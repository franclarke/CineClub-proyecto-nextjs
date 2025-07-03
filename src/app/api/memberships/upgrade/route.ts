import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { createPaymentPreference } from '@/lib/mercado-pago'

export async function POST(request: NextRequest) {
	try {
		const session = await getServerSession(authOptions)
		if (!session?.user?.email) {
			return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
		}

		const { tierID } = await request.json()

		// Obtener usuario actual
		const user = await prisma.user.findUnique({
			where: { email: session.user.email },
			include: { membership: true }
		})

		if (!user) {
			return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })
		}

		// Obtener tier de destino
		const targetTier = await prisma.membershipTier.findUnique({
			where: { id: tierID }
		})

		if (!targetTier) {
			return NextResponse.json({ error: 'Membresía no encontrada' }, { status: 404 })
		}

		// Verificar que es un upgrade válido
		if (targetTier.priority >= user.membership.priority) {
			return NextResponse.json({ error: 'Solo se permiten upgrades' }, { status: 400 })
		}

		// Crear orden de membresía
		const order = await prisma.order.create({
			data: {
				userId: user.id,
				type: 'membership',
				status: 'pending',
				totalAmount: targetTier.price,
				metadata: {
					membershipTierId: tierID,
					currentMembershipId: user.membershipId,
					upgradeType: 'direct'
				}
			}
		})

		// Crear preferencia de MercadoPago
		const preferenceData = {
			items: [
				{
					id: `membership-${targetTier.id}`,
					title: `Upgrade a Membresía ${targetTier.name}`,
					description: `Actualización de membresía a ${targetTier.name}`,
					quantity: 1,
					currency_id: 'ARS',
					unit_price: targetTier.price
				}
			],
			payer: {
				name: user.name || 'Usuario',
				email: user.email
			},
			back_urls: {
				success: `${process.env.NEXTAUTH_URL}/memberships/payment/success`,
				failure: `${process.env.NEXTAUTH_URL}/memberships/payment/failure`,
				pending: `${process.env.NEXTAUTH_URL}/memberships/payment/pending`
			},
			auto_return: 'approved' as const,
			external_reference: order.id,
			notification_url: `${process.env.NEXTAUTH_URL}/api/payments/webhook`
		}

		const preference = await createPaymentPreference(preferenceData)



		return NextResponse.json({
			url: preference.init_point,
			orderId: order.id,
			preferenceId: preference.id
		})

	} catch (error) {
		console.error('Error creating membership upgrade:', error)
		return NextResponse.json(
			{ error: 'Error interno del servidor' },
			{ status: 500 }
		)
	}
} 
