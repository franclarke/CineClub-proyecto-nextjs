import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { CartItem } from '@/types/cart'

export async function POST(request: NextRequest) {
	try {
		const session = await getServerSession(authOptions)
		
		if (!session?.user?.id) {
			return NextResponse.json(
				{ error: 'Unauthorized' },
				{ status: 401 }
			)
		}

		const body = await request.json()
		const { items } = body as { items: CartItem[] }

		// Separar productos y reservas
		const productItems = items.filter(item => item.type === 'product')
		const seatItems = items.filter(item => item.type === 'seat')

		// Sincronizar con la base de datos
		const result = await prisma.$transaction(async (tx) => {
			// 1. Obtener o crear orden pendiente para productos
			let pendingOrder = await tx.order.findFirst({
				where: {
					userId: session.user.id,
					status: 'pending'
				},
				include: {
					items: {
						include: {
							product: true
						}
					}
				}
			})

			if (!pendingOrder && productItems.length > 0) {
				// Crear nueva orden si hay productos
				pendingOrder = await tx.order.create({
					data: {
						userId: session.user.id,
						totalAmount: 0,
						status: 'pending'
					},
					include: {
						items: {
							include: {
								product: true
							}
						}
					}
				})
			}

			// 2. Sincronizar items de productos
			if (pendingOrder && productItems.length > 0) {
				// Eliminar items existentes
				await tx.orderItem.deleteMany({
					where: {
						orderId: pendingOrder.id
					}
				})

				// Crear nuevos items
				const orderItems = await Promise.all(
					productItems.map(async (item) => {
						// Verificar que el producto existe y tiene stock
						const product = await tx.product.findUnique({
							where: { id: item.product.id }
						})

						if (!product || product.stock < item.quantity) {
							throw new Error(`Product ${item.product.name} is not available in requested quantity`)
						}

						return tx.orderItem.create({
							data: {
								orderId: pendingOrder!.id,
								productId: item.product.id,
								quantity: item.quantity,
								price: product.price
							},
							include: {
								product: true
							}
						})
					})
				)

				// Actualizar total de la orden
				const totalAmount = orderItems.reduce((sum, item) => 
					sum + (item.price * item.quantity), 0
				)

				await tx.order.update({
					where: { id: pendingOrder.id },
					data: { totalAmount }
				})
			}

			// 3. Sincronizar reservas de seats
			// Verificar que las reservas temporales aún son válidas
			const validSeatItems = []
			for (const seatItem of seatItems) {
				const existingReservation = await tx.reservation.findFirst({
					where: {
						userId: session.user.id,
						eventId: seatItem.eventId,
						seatId: seatItem.seatId,
						status: 'pending'
					},
					include: {
						seat: true,
						event: true
					}
				})

				if (existingReservation) {
					// Verificar si no ha expirado
					const expiresAt = new Date(existingReservation.createdAt.getTime() + 15 * 60 * 1000)
					if (new Date() <= expiresAt) {
						validSeatItems.push({
							...seatItem,
							expiresAt,
							reservation: existingReservation
						})
					} else {
						// Limpiar reserva expirada
						await tx.reservation.delete({
							where: { id: existingReservation.id }
						})
					}
				}
			}

			return {
				productItems: pendingOrder?.items || [],
				seatItems: validSeatItems,
				user: await tx.user.findUnique({
					where: { id: session.user.id },
					include: {
						membership: true
					}
				})
			}
		})

		// Construir respuesta con items sincronizados
		const syncedItems: CartItem[] = [
			// Productos
			...result.productItems.map(item => ({
				id: `product-${item.product.id}`,
				type: 'product' as const,
				product: item.product,
				quantity: item.quantity,
				unitPrice: item.price,
				totalPrice: item.price * item.quantity,
				addedAt: new Date()
			})),
			// Seats
			...result.seatItems.map(item => ({
				id: `seat-${item.seatId}-${item.eventId}`,
				type: 'seat' as const,
				event: item.reservation.event,
				seat: item.reservation.seat,
				eventId: item.eventId,
				seatId: item.seatId,
				tier: item.reservation.seat.tier,
				seatNumber: item.reservation.seat.seatNumber,
				quantity: 1 as const,
				unitPrice: item.unitPrice,
				totalPrice: item.totalPrice,
				addedAt: item.reservation.createdAt,
				expiresAt: item.expiresAt
			}))
		]

		return NextResponse.json({
			success: true,
			items: syncedItems,
			user: result.user
		})

	} catch (error) {
		console.error('Error syncing cart:', error)
		return NextResponse.json(
			{ 
				error: 'Error syncing cart',
				details: error instanceof Error ? error.message : 'Unknown error'
			},
			{ status: 500 }
		)
	}
}

export async function GET() {
	try {
		const session = await getServerSession(authOptions)
		
		if (!session?.user?.id) {
			return NextResponse.json(
				{ error: 'Unauthorized' },
				{ status: 401 }
			)
		}

		// Obtener estado actual del carrito del usuario
		const [pendingOrder, pendingReservations, user] = await Promise.all([
			// Orden pendiente con productos
			prisma.order.findFirst({
				where: {
					userId: session.user.id,
					status: 'pending'
				},
				include: {
					items: {
						include: {
							product: true
						}
					}
				}
			}),
			// Reservas pendientes
			prisma.reservation.findMany({
				where: {
					userId: session.user.id,
					status: 'pending'
				},
				include: {
					seat: true,
					event: true
				}
			}),
			// Usuario con membresía
			prisma.user.findUnique({
				where: { id: session.user.id },
				include: {
					membership: true
				}
			})
		])

		// Filtrar reservas no expiradas
		const validReservations = pendingReservations.filter(reservation => {
			const expiresAt = new Date(reservation.createdAt.getTime() + 15 * 60 * 1000)
			return new Date() <= expiresAt
		})

		// Limpiar reservas expiradas
		const expiredReservations = pendingReservations.filter(reservation => {
			const expiresAt = new Date(reservation.createdAt.getTime() + 15 * 60 * 1000)
			return new Date() > expiresAt
		})

		if (expiredReservations.length > 0) {
			await prisma.reservation.deleteMany({
				where: {
					id: {
						in: expiredReservations.map(r => r.id)
					}
				}
			})
		}

		// Construir items del carrito
		const cartItems: CartItem[] = [
			// Productos
			...(pendingOrder?.items || []).map(item => ({
				id: `product-${item.product.id}`,
				type: 'product' as const,
				product: item.product,
				quantity: item.quantity,
				unitPrice: item.price,
				totalPrice: item.price * item.quantity,
				addedAt: new Date()
			})),
			// Seats
			...validReservations.map(reservation => {
				const tierPrices = { 'Puff XXL Estelar': 50, 'Reposera Deluxe': 35, 'Banquito': 25 }
				const seatPrice = tierPrices[reservation.seat.tier as keyof typeof tierPrices] || 25
				const expiresAt = new Date(reservation.createdAt.getTime() + 15 * 60 * 1000)

				return {
					id: `seat-${reservation.seat.id}-${reservation.event.id}`,
					type: 'seat' as const,
					event: reservation.event,
					seat: reservation.seat,
					eventId: reservation.event.id,
					seatId: reservation.seat.id,
					tier: reservation.seat.tier,
					seatNumber: reservation.seat.seatNumber,
					quantity: 1 as const,
					unitPrice: seatPrice,
					totalPrice: seatPrice,
					addedAt: reservation.createdAt,
					expiresAt
				}
			})
		]

		return NextResponse.json({
			success: true,
			items: cartItems,
			user
		})

	} catch (error) {
		console.error('Error getting cart:', error)
		return NextResponse.json(
			{ error: 'Error getting cart' },
			{ status: 500 }
		)
	}
} 
