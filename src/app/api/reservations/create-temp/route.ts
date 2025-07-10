import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Seat, Reservation } from '@prisma/client'

type SeatWithReservation = Seat & {
	reservation: Reservation | null
}

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
		const { eventId, seatIds } = body

		if (!eventId || !Array.isArray(seatIds) || seatIds.length === 0) {
			return NextResponse.json(
				{ error: 'Invalid request data' },
				{ status: 400 }
			)
		}

		// Start transaction for atomic operation
		const result = await prisma.$transaction(async (tx) => {
			// Verify event exists and is not in the past
			const event = await tx.event.findUnique({
				where: { id: eventId }
			})

			if (!event) {
				throw new Error('Event not found')
			}

			const isEventPast = new Date(event.dateTime) < new Date()
			if (isEventPast) {
				throw new Error('Cannot reserve seats for past events')
			}

			// Get user with membership info
			const user = await tx.user.findUnique({
				where: { id: session.user.id },
				include: {
					membership: {
						select: {
							name: true,
							priority: true
						}
					}
				}
			})

			if (!user) {
				throw new Error('User not found')
			}

			// Lock and verify seats are available
			const seats = await tx.seat.findMany({
				where: {
					id: { in: seatIds },
					eventId: eventId
				},
				include: {
					reservation: true
				}
			})

			if (seats.length !== seatIds.length) {
				throw new Error('Some seats were not found')
			}

			// Check if any seats are already reserved
			const reservedSeats = seats.filter((seat: SeatWithReservation) => seat.reservation)
			if (reservedSeats.length > 0) {
				throw new Error(`Seats ${reservedSeats.map((s: SeatWithReservation) => s.seatNumber).join(', ')} are already reserved`)
			}

			// Check membership tier restrictions
			const invalidTierSeats = seats.filter((seat: SeatWithReservation) => {
				const seatTierPriority = getTierPriority(seat.tier)
				// User can access seat if their priority <= seat priority
						// Puff XXL Estelar (1) can access all seats: Puff XXL Estelar (1), Reposera Deluxe (2), Banquito (3)
		// Reposera Deluxe (2) can access: Reposera Deluxe (2), Banquito (3)
		// Banquito (3) can only access: Banquito (3)
				return user.membership.priority > seatTierPriority
			})

			if (invalidTierSeats.length > 0) {
				throw new Error(`Your ${user.membership.name} membership doesn't allow access to these seats: ${invalidTierSeats.map((s: SeatWithReservation) => s.seatNumber).join(', ')}`)
			}

			// Create reservations with temporary status
			const reservations = await Promise.all(
				seats.map((seat: SeatWithReservation) => 
					tx.reservation.create({
						data: {
							userId: session.user.id,
							eventId: eventId,
							seatId: seat.id,
							status: 'pending'
						},
						include: {
							seat: true,
							event: true
						}
					})
				)
			)

			// Create a temporary order for checkout
			const totalAmount = seats.reduce((total: number, seat: SeatWithReservation) => {
				// Price based on tier - Premium tiers cost more
				const tierPrices = { 'Puff XXL Estelar': 50, 'Reposera Deluxe': 35, 'Banquito': 25 };
				return total + (tierPrices[seat.tier as keyof typeof tierPrices] || 25);
			}, 0)

			const order = await tx.order.create({
				data: {
					userId: session.user.id,
					totalAmount,
					status: 'pending',
					items: {
						create: []
					}
				},
				include: {
					items: true
				}
			})

			// Schedule cleanup of temporary reservations (10 minutes)
			setTimeout(async () => {
				try {
					await cleanupExpiredReservations(reservations.map(r => r.id))
				} catch (error) {
				}
			}, 10 * 60 * 1000) // 10 minutes

			return {
				reservationId: order.id,
				reservations: reservations.map(r => ({
					id: r.id,
					seatNumber: r.seat.seatNumber,
					tier: r.seat.tier
				})),
				totalAmount,
				expiresAt: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes from now
			}
		})

		return NextResponse.json(result)

	} catch (error) {
		
		const message = error instanceof Error ? error.message : 'Internal server error'
		const status = message.includes('not found') ? 404 : 
					  message.includes('already reserved') || message.includes("doesn't allow") ? 409 : 500

		return NextResponse.json(
			{ error: message },
			{ status }
		)
	}
}

// Helper function for tier priority
function getTierPriority(tier: string): number {
			const priorities = { 'Puff XXL Estelar': 1, 'Reposera Deluxe': 2, 'Banquito': 3 }
	return priorities[tier as keyof typeof priorities] || 999
}

// Cleanup function for expired reservations
async function cleanupExpiredReservations(reservationIds: string[]) {
	try {
		// Only delete reservations that are still pending (not confirmed by payment)
		await prisma.reservation.deleteMany({
			where: {
				id: { in: reservationIds },
				status: 'pending'
			}
		})
		
	} catch (error) {
	}
} 
