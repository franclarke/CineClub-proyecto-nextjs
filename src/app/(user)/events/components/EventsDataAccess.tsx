import { prisma } from '@/lib/prisma'
import { EventsClientComponent } from './EventsClientComponent'

interface EventsDataAccessProps {
	searchParams: {
		category?: string
		sort?: 'date' | 'popular' | 'name'
		search?: string
	}
}

export async function EventsDataAccess({ searchParams }: EventsDataAccessProps) {
	const { category, sort = 'date', search } = searchParams

	// Construir filtros
	const where = {
		...(category && category !== 'all' && { category }),
		...(search && {
			OR: [
				{ title: { contains: search, mode: 'insensitive' as const } },
				{ description: { contains: search, mode: 'insensitive' as const } },
			],
		}),
		// Solo eventos futuros
		dateTime: {
			gte: new Date(),
		},
	}

	// Construir order by
	const orderBy = (() => {
		switch (sort) {
			case 'name':
				return { title: 'asc' as const }
			case 'popular':
				// Podríamos ordenar por cantidad de reservas en el futuro
				return { createdAt: 'desc' as const }
			case 'date':
			default:
				return { dateTime: 'asc' as const }
		}
	})()

	// Obtener eventos con información de reservas
	const events = await prisma.event.findMany({
		where,
		orderBy,
		include: {
			seats: {
				select: {
					id: true,
					isReserved: true,
					tier: true,
				},
			},
			_count: {
				select: {
					reservations: true,
				},
			},
		},
	})

	// Obtener categorías únicas para filtros
	const categories = await prisma.event.findMany({
		where: {
			dateTime: {
				gte: new Date(),
			},
		},
		select: {
			category: true,
		},
		distinct: ['category'],
	})

	const uniqueCategories = categories
		.map(event => event.category)
		.filter((category): category is string => category !== null)
		.sort()

	// Formatear datos para el componente cliente
	const formattedEvents = events.map(event => ({
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
		seatsByTier: {
			gold: event.seats.filter(seat => seat.tier === 'Gold').length,
			silver: event.seats.filter(seat => seat.tier === 'Silver').length,
			bronze: event.seats.filter(seat => seat.tier === 'Bronze').length,
		},
	}))

	return (
		<EventsClientComponent 
			events={formattedEvents}
			categories={uniqueCategories}
			currentFilters={{
				category: category || 'all',
				sort,
				search: search || '',
			}}
		/>
	)
} 
