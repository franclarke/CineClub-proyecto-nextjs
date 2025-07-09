import { prisma } from '@/lib/prisma'
import { EventsClientComponent } from './EventsClientComponent'

interface EventsDataAccessProps {
	searchParams: {
		category?: string
		sort?: 'date' | 'popular' | 'name'
		search?: string
	}
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

	// Obtener eventos con información de reservas y membresías
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

	// Obtener información de membresías para calcular precios
	const membershipTiers = await prisma.membershipTier.findMany({
		select: {
			id: true,
			name: true,
			price: true,
			priority: true,
		},
		orderBy: {
			priority: 'asc'
		}
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
	const formattedEvents = events.map(event => {
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

		return {
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
		}
	})

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
