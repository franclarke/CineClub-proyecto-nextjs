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

		// Verificar si el precio es $0 y procesar como upgrade gratuito
		if (targetTier.price === 0) {
			console.log('✓ Upgrade gratuito detectado, procesando directamente')
			
			try {
				// Actualizar la membresía del usuario directamente
				await prisma.user.update({
					where: { id: user.id },
					data: {
						membershipId: targetTier.id
					}
				})

				// Actualizar la orden como completada
				await prisma.order.update({
					where: { id: order.id },
					data: {
						status: 'completed'
					}
				})

				// Crear registro de pago simulado
				await prisma.payment.create({
					data: {
						orderId: order.id,
						amount: 0,
						status: 'completed',
						paymentDate: new Date(),
						provider: 'Free',
						providerRef: `FREE_UPGRADE_${Date.now()}`
					}
				})

				console.log('✓ Upgrade gratuito completado para usuario:', user.id)

				// Retornar URL de éxito para upgrade gratuito
				return NextResponse.json({
					isFreeUpgrade: true,
					url: `${process.env.NEXTAUTH_URL}/memberships/payment/success?order_id=${order.id}`,
					orderId: order.id,
					message: 'Membresía actualizada exitosamente sin costo'
				})

			} catch (error) {
				console.error('Error procesando upgrade gratuito:', error)
				return NextResponse.json({ 
					error: 'Error procesando upgrade gratuito' 
				}, { status: 500 })
			}
		}

		// Crear preferencia de MercadoPago (solo si targetTier.price > 0)
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
