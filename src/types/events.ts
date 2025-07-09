export interface Event {
	id: string
	title: string
	description: string | null
	dateTime: string | Date
	location: string | null
	category: string | null
	imdbId: string | null
	tmdbId: string | null
	imageUrl: string | null
	reservationCount: number
	totalSeats: number
	availableSeats: number
	seatsByTier: {
		'Puff XXL Estelar': number
		'Reposera Deluxe': number
		'Banquito': number
	}
	priceInfo: {
		lowestPrice: number
		tierPrices: {
			'Puff XXL Estelar': number
			'Reposera Deluxe': number
			'Banquito': number
		}
		availableTiers: string[]
	}
}

export interface EventDetail extends Event {
	seats: Seat[]
	seatStats: {
		total: number
		available: number
		reserved: number
		byTier: {
			gold: { total: number; available: number }
			silver: { total: number; available: number }
			bronze: { total: number; available: number }
		}
	}
	createdAt: string
	updatedAt: string
}

export interface Seat {
	id: string
	seatNumber: number
	tier: string
	isReserved: boolean
}

export interface EventsClientComponentProps {
	events: Event[]
	categories: string[]
	currentFilters: {
		category: string
		sort: string
		search: string
	}
}

export interface EventCardProps {
	event: Event
}

export interface EventDetailClientComponentProps {
	event: EventDetail
} 