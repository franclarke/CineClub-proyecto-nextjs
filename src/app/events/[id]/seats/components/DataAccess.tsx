import { notFound } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { SeatMapClient } from './SeatMapClient'

interface DataAccessProps {
	eventId: string
}

export async function DataAccess({ eventId }: DataAccessProps) {
	const session = await getServerSession(authOptions)
	
	if (!session?.user) {
		notFound()
	}

	// Get event with seats
	const event = await prisma.event.findUnique({
		where: { id: eventId },
		include: {
			seats: {
				include: {
					reservation: {
						include: {
							user: {
								include: {
									membership: true
								}
							}
						}
					}
				},
				orderBy: {
					seatNumber: 'asc'
				}
			}
		}
	})

	if (!event) {
		notFound()
	}

	// Get user's membership
	const user = await prisma.user.findUnique({
		where: { id: session.user.id },
		include: {
			membership: true
		}
	})

	if (!user) {
		notFound()
	}

	// Check if event is in the past
	const isEventPast = new Date(event.dateTime) < new Date()
	
	if (isEventPast) {
		notFound()
	}

	return (
		<SeatMapClient 
			event={event}
			currentUser={user}
		/>
	)
} 