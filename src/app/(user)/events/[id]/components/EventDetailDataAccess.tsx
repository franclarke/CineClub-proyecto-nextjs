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
					total: event.seats.filter(seat => seat.tier === 'Puff XXL Estelar').length,
					available: event.seats.filter(seat => seat.tier === 'Puff XXL Estelar' && !seat.isReserved).length,
				},
				silver: {
					total: event.seats.filter(seat => seat.tier === 'Reposera Deluxe').length,
					available: event.seats.filter(seat => seat.tier === 'Reposera Deluxe' && !seat.isReserved).length,
				},
				bronze: {
					total: event.seats.filter(seat => seat.tier === 'Banquito').length,
					available: event.seats.filter(seat => seat.tier === 'Banquito' && !seat.isReserved).length,
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
		tmdbId: event.tmdbId,
		imageUrl: event.imageUrl,
		seatStats,
		seats: event.seats,
		reservationCount: event._count.reservations,
		createdAt: event.createdAt.toISOString(),
		updatedAt: event.updatedAt.toISOString(),
	}

	return <EventDetailClientComponent event={eventData} />
} 