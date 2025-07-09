import { notFound } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { WalletClient } from './WalletClient'
import { EventWithCount, ReservationWithDetails } from '@/types/api'

export async function DataAccess() {
	try {
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

		// Get user's paid orders for products section (only paid orders)
		const paidOrders = await prisma.order.findMany({
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

		// Get all orders (paid and pending) for history section
		const allOrders = await prisma.order.findMany({
			where: {
				userId: session.user.id,
				status: {
					in: ['paid', 'pending']
				}
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

		// Group reservations by event with proper typing
		const reservationsByEvent = reservations.reduce<Record<string, { event: EventWithCount, reservations: ReservationWithDetails[] }>>((acc, reservation) => {
			const eventId = reservation.event.id
			if (!acc[eventId]) {
				acc[eventId] = {
					event: reservation.event,
					reservations: []
				}
			}
			acc[eventId].reservations.push(reservation)
			return acc
		}, {})

		// Calculate summary statistics with optimized date calculations
		const now = new Date()
		const upcomingEvents = Object.values(reservationsByEvent).filter(
			({ event }) => new Date(event.dateTime) > now
		)
		const pastEvents = Object.values(reservationsByEvent).filter(
			({ event }) => new Date(event.dateTime) <= now
		)

		// Calculate total spent - only from PAID orders
		const totalSpent = paidOrders.reduce((sum, order) => sum + order.totalAmount, 0)
		
		// Calculate total products - only from PAID orders (available for redemption)
		const totalProducts = paidOrders.reduce((sum, order) => 
			sum + order.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0
		)

		// Add reservation costs to total spent (assuming base ticket price)
		const reservationCosts = reservations.length * 25 // Base ticket price from schema
		const totalSpentIncludingTickets = totalSpent + reservationCosts

		const summary = {
			totalTickets: reservations.length,
			upcomingEvents: upcomingEvents.length,
			pastEvents: pastEvents.length,
			totalProducts,
			totalSpent: totalSpentIncludingTickets // Include both orders and tickets
		}

		return (
			<WalletClient
				reservationsByEvent={reservationsByEvent}
				paidOrders={paidOrders}
				allOrders={allOrders}
				summary={summary}
			/>
		)
	} catch (error) {
		console.error('Error fetching wallet data:', error)
		// In production, you might want to handle this differently
		notFound()
	}
} 
