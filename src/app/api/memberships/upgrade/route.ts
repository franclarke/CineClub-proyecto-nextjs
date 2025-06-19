import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
	try {
		const session = await getServerSession(authOptions)
		
		if (!session?.user?.email) {
			return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
		}

		const { tierName } = await request.json()

		if (!tierName) {
			return NextResponse.json({ error: 'Tier de membresía requerido' }, { status: 400 })
		}

		// Obtener usuario y membresía actual
		const user = await prisma.user.findUnique({
			where: { email: session.user.email },
			include: { membership: true }
		})

		if (!user) {
			return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })
		}

		// Obtener nueva membresía
		const newTier = await prisma.membershipTier.findFirst({
			where: { name: tierName }
		})

		if (!newTier) {
			return NextResponse.json({ error: 'Membresía no encontrada' }, { status: 404 })
		}

		// Verificar que sea un upgrade válido
		if (user.membership && newTier.priority <= user.membership.priority) {
			return NextResponse.json({ error: 'No es posible downgrade' }, { status: 400 })
		}

		// Crear preferencia de Mercado Pago
		const preference = {
			items: [{
				title: `Upgrade a Membresía ${newTier.name}`,
				quantity: 1,
				unit_price: newTier.price,
				currency_id: 'USD'
			}],
			payer: {
				email: user.email
			},
			back_urls: {
				success: `${process.env.NEXTAUTH_URL}/profile?upgrade=success`,
				failure: `${process.env.NEXTAUTH_URL}/profile?upgrade=failure`,
				pending: `${process.env.NEXTAUTH_URL}/profile?upgrade=pending`
			},
			auto_return: 'approved',
			external_reference: `upgrade_${user.id}_${newTier.id}`
		}

		// En un entorno real, aquí usarías la SDK de Mercado Pago
		// const response = await mercadopago.preferences.create(preference)
		
		// Por ahora, simulamos la respuesta
		const mockPaymentUrl = `${process.env.NEXTAUTH_URL}/profile?upgrade=success&tier=${tierName}`

		return NextResponse.json({ 
			paymentUrl: mockPaymentUrl,
			preferenceId: 'mock_preference_id'
		})

	} catch (error) {
		console.error('Error processing membership upgrade:', error)
		return NextResponse.json(
			{ error: 'Error interno del servidor' }, 
			{ status: 500 }
		)
	}
} 