import { notFound } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { WalletClient } from './WalletClient'
import { EventWithCount, ReservationWithDetails } from '@/types/api'

export async function DataAccess() {
	const session = await getServerSession(authOptions)
	
	if (!session?.user) {
		notFound()
	}

	// Get user's confirmed reservations with event and seat details
	const reservations = await prisma.reservation.findMany({
		where: {
			userId: session.user.id,
			status: 'confirmed'
		},
		include: {
			seat: true,
			event: {
				include: {
					_count: {
						select: {
							reservations: true
						}
					}
				}
			},
			user: {
				include: {
					membership: true
				}
			}
		},
		orderBy: {
			createdAt: 'desc'
		}
	})

	// Get user's paid orders with order items and products
	const orders = await prisma.order.findMany({
		where: {
			userId: session.user.id,
			status: 'paid'
		},
		include: {
			items: {
				include: {
					product: true
				}
			},
			payment: true
		},
		orderBy: {
			createdAt: 'desc'
		}
	})

	// Group reservations by event
	const reservationsByEvent = reservations.reduce((acc, reservation) => {
		const eventId = reservation.event.id
		if (!acc[eventId]) {
			acc[eventId] = {
				event: reservation.event,
				reservations: []
			}
		}
		acc[eventId].reservations.push(reservation)
		return acc
	}, {} as Record<string, { event: EventWithCount, reservations: ReservationWithDetails[] }>)

	// Calculate summary statistics
	const now = new Date()
	const upcomingEvents = Object.values(reservationsByEvent).filter(
		({ event }) => new Date(event.dateTime) > now
	)
	const pastEvents = Object.values(reservationsByEvent).filter(
		({ event }) => new Date(event.dateTime) <= now
	)

	const totalSpent = orders.reduce((sum, order) => sum + order.totalAmount, 0)
	const totalProducts = orders.reduce((sum, order) => 
		sum + order.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0
	)

	const summary = {
		totalTickets: reservations.length,
		upcomingEvents: upcomingEvents.length,
		pastEvents: pastEvents.length,
		totalProducts,
		totalSpent
	}

	return (
		<WalletClient
			reservationsByEvent={reservationsByEvent}
			orders={orders}
			summary={summary}
		/>
	)
} 