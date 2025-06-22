import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getPaymentInfo, validateMPWebhook } from '@/lib/mercado-pago'
import { Order, OrderItem, Reservation, User } from '@prisma/client'

type OrderWithItems = Order & {
	items: OrderItem[]
	reservations: Reservation[]
	user: User
}

export async function POST(request: NextRequest) {
	try {
		const body = await request.json()
		const headers = request.headers

		// Validar webhook (aquí puedes agregar validación de firma)
		if (!validateMPWebhook(body, headers)) {
			return NextResponse.json({ error: 'Webhook inválido' }, { status: 400 })
		}

		// MercadoPago envía diferentes tipos de notificaciones
		if (body.type === 'payment') {
			const paymentId = body.data?.id

			if (!paymentId) {
				return NextResponse.json({ error: 'ID de pago no encontrado' }, { status: 400 })
			}

			// Obtener información del pago desde MercadoPago
			const paymentInfo = await getPaymentInfo(paymentId)
			
			if (!paymentInfo) {
				return NextResponse.json({ error: 'Pago no encontrado' }, { status: 404 })
			}

			// Buscar la orden por external_reference
			const externalReference = paymentInfo.external_reference
			if (!externalReference) {
				return NextResponse.json({ error: 'Referencia externa no encontrada' }, { status: 400 })
			}

			const order = await prisma.order.findFirst({
				where: { 
					externalReference: externalReference 
				},
				include: {
					items: true,
					reservations: true,
					user: true
				}
			})

			if (!order) {
				return NextResponse.json({ error: 'Orden no encontrada' }, { status: 404 })
			}

			// Crear o actualizar el pago en la base de datos
			const existingPayment = await prisma.payment.findUnique({
				where: { orderId: order.id }
			})

			const paymentData = {
				orderId: order.id,
				amount: paymentInfo.transaction_amount || 0,
				status: mapMPStatusToOurStatus(paymentInfo.status || 'pending'),
				providerPaymentId: paymentId,
				providerResponse: JSON.stringify(paymentInfo),
				currency: paymentInfo.currency_id || 'ARS',
				paymentMethod: paymentInfo.payment_method?.id || 'unknown',
				installments: paymentInfo.installments || 1
			}

			if (existingPayment) {
				await prisma.payment.update({
					where: { id: existingPayment.id },
					data: paymentData
				})
			} else {
				await prisma.payment.create({
					data: paymentData
				})
			}

			// Actualizar el estado de la orden según el estado del pago
			const paymentStatus = paymentInfo.status || 'pending'
			if (paymentStatus === 'approved') {
				await prisma.order.update({
					where: { id: order.id },
					data: { status: 'completed' }
				})

				// Procesar items del pedido (crear reservas, actualizar stock, etc.)
				await processOrderItems(order)
			} else if (paymentStatus === 'rejected' || paymentStatus === 'cancelled') {
				await prisma.order.update({
					where: { id: order.id },
					data: { status: 'cancelled' }
				})
			}

			return NextResponse.json({ received: true })
		}

		return NextResponse.json({ received: true })
	} catch (error) {
		console.error('Error procesando webhook:', error)
		return NextResponse.json(
			{ error: 'Error interno del servidor' }, 
			{ status: 500 }
		)
	}
}

// Mapear estados de MercadoPago a nuestros estados
function mapMPStatusToOurStatus(mpStatus: string): string {
	switch (mpStatus) {
		case 'approved':
			return 'completed'
		case 'pending':
		case 'in_process':
		case 'in_mediation':
			return 'pending'
		case 'rejected':
		case 'cancelled':
			return 'failed'
		case 'refunded':
		case 'charged_back':
			return 'refunded'
		default:
			return 'pending'
	}
}

// Procesar items de la orden aprobada
async function processOrderItems(order: OrderWithItems) {
	try {
		// Procesar productos - actualizar stock
		for (const item of order.items) {
			if (item.productId) {
				await prisma.product.update({
					where: { id: item.productId },
					data: {
						stock: {
							decrement: item.quantity
						}
					}
				})
			}
		}

		// Procesar reservas - confirmar asientos
		for (const reservation of order.reservations) {
			await prisma.reservation.update({
				where: { id: reservation.id },
				data: {
					status: 'confirmed'
				}
			})

			// Marcar el asiento como reservado
			await prisma.seat.update({
				where: { id: reservation.seatId },
				data: {
					isReserved: true
				}
			})
		}
	} catch (error) {
		console.error('Error procesando items de la orden:', error)
	}
} 