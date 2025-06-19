import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { EventDetailClientComponent } from './EventDetailClientComponent'

interface EventDetailDataAccessProps {
	eventId: string
}

export async function EventDetailDataAccess({ eventId }: EventDetailDataAccessProps) {
	const event = await prisma.event.findUnique({
		where: { id: eventId },
		include: {
			seats: {
				select: {
					id: true,
					seatNumber: true,
					tier: true,
					isReserved: true,
				},
				orderBy: {
					seatNumber: 'asc',
				},
			},
			reservations: {
				select: {
					id: true,
					status: true,
					user: {
						select: {
							name: true,
							email: true,
						},
					},
				},
			},
			_count: {
				select: {
					reservations: true,
				},
			},
		},
	})

	if (!event) {
		notFound()
	}

	// Calcular estadísticas de asientos
	const seatStats = {
		total: event.seats.length,
		available: event.seats.filter(seat => !seat.isReserved).length,
		reserved: event.seats.filter(seat => seat.isReserved).length,
		byTier: {
			gold: {
				total: event.seats.filter(seat => seat.tier === 'Gold').length,
				available: event.seats.filter(seat => seat.tier === 'Gold' && !seat.isReserved).length,
			},
			silver: {
				total: event.seats.filter(seat => seat.tier === 'Silver').length,
				available: event.seats.filter(seat => seat.tier === 'Silver' && !seat.isReserved).length,
			},
			bronze: {
				total: event.seats.filter(seat => seat.tier === 'Bronze').length,
				available: event.seats.filter(seat => seat.tier === 'Bronze' && !seat.isReserved).length,
			},
		},
	}

	// Formatear datos para el componente cliente
	const eventData = {
		id: event.id,
		title: event.title,
		description: event.description,
		dateTime: event.dateTime.toISOString(),
		location: event.location,
		category: event.category,
		imdbId: event.imdbId,
		spotifyUri: event.spotifyUri,
		seatStats,
		seats: event.seats,
		reservationCount: event._count.reservations,
		createdAt: event.createdAt.toISOString(),
		updatedAt: event.updatedAt.toISOString(),
	}

	return <EventDetailClientComponent event={eventData} />
} 