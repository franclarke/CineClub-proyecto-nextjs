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

		const { membershipId, discountCode } = await request.json()

		if (!membershipId) {
			return NextResponse.json({ error: 'ID de membresía requerido' }, { status: 400 })
		}

		// Obtener información del usuario y membresía
		const user = await prisma.user.findUnique({
			where: { id: session.user.id },
			include: {
				membership: true
			}
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

		// Validar y aplicar código de descuento si se proporciona
		let discountPercentage = 0
		let discountDescription = ''
		let discountId = null

		if (discountCode) {
			const discount = await prisma.discount.findUnique({
				where: { 
					code: discountCode.toUpperCase()
				},
				include: {
					membershipTier: true
				}
			})

			if (!discount) {
				return NextResponse.json({ error: 'Código de descuento inválido' }, { status: 400 })
			}

			// Verificar si el descuento está activo
			const now = new Date()
			if (discount.validFrom && discount.validFrom > now) {
				return NextResponse.json({ error: 'Este código de descuento aún no está activo' }, { status: 400 })
			}

			if (discount.validUntil && discount.validUntil < now) {
				return NextResponse.json({ error: 'Este código de descuento ha expirado' }, { status: 400 })
			}

			// Verificar si el descuento es aplicable a la membresía seleccionada
			if (discount.membershipTierId && discount.membershipTierId !== membershipId) {
				return NextResponse.json({ 
					error: `Este código es exclusivo para la membresía ${discount.membershipTier?.name}` 
				}, { status: 400 })
			}

			discountPercentage = discount.percentage
			discountDescription = discount.description || `${discount.percentage}% de descuento`
			discountId = discount.id
		}

		// Calcular precio final con descuento
		const originalPrice = membership.price
		const discountAmount = originalPrice * (discountPercentage / 100)
		const finalPrice = originalPrice - discountAmount

		// Generar referencia externa
		const externalReference = generateExternalReference(user.id, 'membership')

		// Crear orden específica para membresía con información del descuento
		const order = await prisma.order.create({
			data: {
				userId: user.id,
				status: 'pending',
				totalAmount: finalPrice,
				externalReference: externalReference,
				type: 'membership',
				metadata: {
					membershipId: membership.id,
					membershipName: membership.name,
					originalPrice: originalPrice,
					discountCode: discountCode || null,
					discountPercentage: discountPercentage,
					discountAmount: discountAmount,
					discountId: discountId
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

		// Preparar descripción del item con descuento aplicado
		let itemDescription = membership.description || `Membresía ${membership.name} - Puff & Chill`
		if (discountPercentage > 0) {
			itemDescription += ` (${discountDescription})`
		}

		// Crear preferencia de MercadoPago para membresía
		const preferenceData: MPPreferenceData = {
			items: [{
				id: membership.id,
				title: `Membresía ${membership.name}`,
				description: itemDescription,
				quantity: 1,
				unit_price: finalPrice,
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
				amount: finalPrice,
				status: 'pending',
				provider: 'MercadoPago',
				providerRef: preference.id
			}
		})

		return NextResponse.json({
			preferenceId: preference.id,
			orderId: order.id,
			initPoint: preference.init_point,
			sandboxInitPoint: preference.sandbox_init_point,
			originalPrice: originalPrice,
			discountAmount: discountAmount,
			finalPrice: finalPrice,
			discountApplied: discountPercentage > 0
		})

	} catch (error) {
		console.error('Error creando preferencia de pago para membresía:', error)
		return NextResponse.json(
			{ error: 'Error interno del servidor' },
			{ status: 500 }
		)
	}
} 