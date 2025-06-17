import { notFound } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { CheckoutClient } from './CheckoutClient'

interface DataAccessProps {
	reservationId: string
}

export async function DataAccess({ reservationId }: DataAccessProps) {
	const session = await getServerSession(authOptions)
	
	if (!session?.user) {
		notFound()
	}

	// Get order with reservations
	const order = await prisma.order.findUnique({
		where: { 
			id: reservationId,
			userId: session.user.id 
		},
		include: {
			user: {
				include: {
					membership: true
				}
			},
			items: {
				include: {
					product: true
				}
			}
		}
	})

	if (!order) {
		notFound()
	}

	// Get associated reservations
	const reservations = await prisma.reservation.findMany({
		where: {
			userId: session.user.id,
			status: 'pending',
			createdAt: {
				gte: new Date(Date.now() - 15 * 60 * 1000) // Last 15 minutes
			}
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
			}
		},
		orderBy: {
			createdAt: 'desc'
		},
		take: 10 // Limit to prevent abuse
	})

	// Filter reservations that belong to current order session
	const currentReservations = reservations.filter(reservation => 
		reservation.createdAt > new Date(Date.now() - 12 * 60 * 1000) // Within last 12 minutes
	)

	if (currentReservations.length === 0) {
		notFound()
	}

	// Group reservations by event
	const reservationsByEvent = currentReservations.reduce((acc, reservation) => {
		const eventId = reservation.event.id
		if (!acc[eventId]) {
			acc[eventId] = {
				event: reservation.event,
				reservations: []
			}
		}
		acc[eventId].reservations.push(reservation)
		return acc
	}, {} as Record<string, { event: any, reservations: any[] }>)

	// Get available products for cart
	const products = await prisma.product.findMany({
		where: {
			stock: {
				gt: 0
			}
		},
		orderBy: {
			name: 'asc'
		}
	})

	return (
		<CheckoutClient 
			order={{
				...order,
				reservationsByEvent
			}}
			products={products}
			expiresAt={new Date(Date.now() + 10 * 60 * 1000)} // 10 minutes from now
		/>
	)
} 