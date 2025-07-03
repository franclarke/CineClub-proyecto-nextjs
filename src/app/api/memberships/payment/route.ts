import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import {
	createPaymentPreference,
	generateExternalReference,
	MPPreferenceData
} from '@/lib/mercado-pago'

export async function POST(request: NextRequest) {
	try {
		const session = await getServerSession(authOptions)

		if (!session?.user?.email) {
			return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
		}

		const { membershipId } = await request.json()

		if (!membershipId) {
			return NextResponse.json({ error: 'ID de membresía requerido' }, { status: 400 })
		}

		// Obtener información del usuario y membresía
		const user = await prisma.user.findUnique({
			where: { id: session.user.id }
		})

		if (!user) {
			return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })
		}

		const membership = await prisma.membershipTier.findUnique({
			where: { id: membershipId }
		})

		if (!membership) {
			return NextResponse.json({ error: 'Membresía no encontrada' }, { status: 404 })
		}

		// Generar referencia externa
		const externalReference = generateExternalReference(user.id, 'membership')

		// Crear orden específica para membresía
		const order = await prisma.order.create({
			data: {
				userId: user.id,
				status: 'pending',
				totalAmount: membership.price,
				externalReference: externalReference,
				type: 'membership',
				metadata: {
					membershipId: membership.id,
					membershipName: membership.name
				}
			}
		})

		// Determine base URL for callbacks
		const baseUrl = process.env.NEXTAUTH_URL || request.headers.get('origin') || 'http://localhost:3000'
		const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl

		const successUrl = `${cleanBaseUrl}/memberships/payment/success?order_id=${order.id}`
		const failureUrl = `${cleanBaseUrl}/memberships/payment/failure?order_id=${order.id}`
		const pendingUrl = `${cleanBaseUrl}/memberships/payment/pending?order_id=${order.id}`
		const webhookUrl = `${cleanBaseUrl}/api/payments/webhook`

		// Crear preferencia de MercadoPago para membresía
		const preferenceData: MPPreferenceData = {
			items: [{
				id: membership.id,
				title: `Membresía ${membership.name}`,
				description: membership.description || `Membresía ${membership.name} - Puff & Chill`,
				quantity: 1,
				unit_price: membership.price,
				currency_id: 'ARS'
			}],
			payer: {
				name: user.name?.split(' ')[0] || 'Usuario',
				surname: user.name?.split(' ').slice(1).join(' ') || 'Puff&Chill',
				email: user.email,
			},
			back_urls: {
				success: successUrl,
				failure: failureUrl,
				pending: pendingUrl
			},
			auto_return: 'approved',
			notification_url: webhookUrl,
			statement_descriptor: 'PUFF&CHILL',
			external_reference: externalReference
		}

		const preference = await createPaymentPreference(preferenceData)


		// Crear registro de pago
		await prisma.payment.create({
			data: {
				orderId: order.id,
				amount: membership.price,
				status: 'pending',
				provider: 'MercadoPago',
				providerRef: preference.id
			}
		})

		return NextResponse.json({
			preferenceId: preference.id,
			orderId: order.id,
			initPoint: preference.init_point,
			sandboxInitPoint: preference.sandbox_init_point
		})

	} catch (error) {
		console.error('Error creando preferencia de pago para membresía:', error)
		return NextResponse.json(
			{ error: 'Error interno del servidor' },
			{ status: 500 }
		)
	}
} 