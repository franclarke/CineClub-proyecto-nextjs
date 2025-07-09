import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { EventDetailClientComponent } from './EventDetailClientComponent'

interface EventDetailDataAccessProps {
	eventId: string
}

// Función para obtener el precio por tier
function getTierPrice(tier: string): number {
	const tierPrices = { 
		'Puff XXL Estelar': 50, 
		'Reposera Deluxe': 35, 
		'Banquito': 25 
	}
	return tierPrices[tier as keyof typeof tierPrices] || 25
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

	// Calcular asientos por tier con nombres correctos
	const seatsByTier = {
		'Puff XXL Estelar': event.seats.filter(seat => seat.tier === 'Puff XXL Estelar' && !seat.isReserved).length,
		'Reposera Deluxe': event.seats.filter(seat => seat.tier === 'Reposera Deluxe' && !seat.isReserved).length,
		'Banquito': event.seats.filter(seat => seat.tier === 'Banquito' && !seat.isReserved).length,
	}

	// Calcular precios disponibles
	const availableTiers = Object.entries(seatsByTier)
		.filter(([, count]) => count > 0)
		.map(([tier]) => tier)

	const tierPrices = availableTiers.map(tier => getTierPrice(tier))
	const lowestPrice = tierPrices.length > 0 ? Math.min(...tierPrices) : 0

	// Información de precios por tier
	const priceInfo = {
		lowestPrice,
		tierPrices: {
			'Puff XXL Estelar': getTierPrice('Puff XXL Estelar'),
			'Reposera Deluxe': getTierPrice('Reposera Deluxe'),
			'Banquito': getTierPrice('Banquito'),
		},
		availableTiers,
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
		reservationCount: event._count.reservations,
		totalSeats: event.seats.length,
		availableSeats: event.seats.filter(seat => !seat.isReserved).length,
		seatsByTier,
		priceInfo,
		seatStats,
		seats: event.seats,
		createdAt: event.createdAt.toISOString(),
		updatedAt: event.updatedAt.toISOString(),
	}

	return <EventDetailClientComponent event={eventData} />
} 