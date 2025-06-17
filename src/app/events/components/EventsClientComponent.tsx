'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { SearchIcon, CalendarIcon, MapPinIcon, UsersIcon, FilterIcon } from 'lucide-react'

interface Event {
	id: string
	title: string
	description: string
	dateTime: string
	location: string
	category: string | null
	imdbId: string | null
	spotifyUri: string | null
	reservationCount: number
	totalSeats: number
	availableSeats: number
	seatsByTier: {
			gold: number
	silver: number
	bronze: number
	}
}

interface EventsClientComponentProps {
	events: Event[]
	categories: string[]
	currentFilters: {
		category: string
		sort: string
		search: string
	}
}

export function EventsClientComponent({ 
	events, 
	categories, 
	currentFilters 
}: EventsClientComponentProps) {
	const router = useRouter()
	const searchParams = useSearchParams()
	const [searchTerm, setSearchTerm] = useState(currentFilters.search)
	const [isFilterOpen, setIsFilterOpen] = useState(false)

	const updateFilter = (key: string, value: string) => {
		const params = new URLSearchParams(searchParams.toString())
		
		if (value === 'all' || value === '') {
			params.delete(key)
		} else {
			params.set(key, value)
		}
		
		router.push(`/events?${params.toString()}`)
	}

	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault()
		updateFilter('search', searchTerm)
	}

	const formatDate = (dateString: string) => {
		const date = new Date(dateString)
		return {
			day: date.getDate(),
			month: date.toLocaleDateString('es-ES', { month: 'short' }),
			time: date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
			weekday: date.toLocaleDateString('es-ES', { weekday: 'long' })
		}
	}

	const sortOptions = [
		{ value: 'date', label: 'Por fecha' },
		{ value: 'name', label: 'Por nombre' },
		{ value: 'popular', label: 'Más populares' },
	]

	return (
		<div className="space-y-8">
			{/* Search and Filters */}
			<div className="bg-soft-gray/20 backdrop-blur-sm rounded-xl border border-soft-gray/20 p-6">
				{/* Search Bar */}
				<form onSubmit={handleSearch} className="mb-6">
					<div className="relative max-w-md mx-auto">
						<SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-soft-gray" />
						<input
							type="text"
							placeholder="Buscar eventos..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="w-full pl-10 pr-4 py-3 bg-soft-gray/30 border border-soft-gray/20 rounded-lg text-soft-beige placeholder-soft-gray focus:outline-none focus:border-sunset-orange transition-colors duration-200"
						/>
					</div>
				</form>

				{/* Filters Toggle */}
				<div className="flex justify-center mb-4">
					<button
						onClick={() => setIsFilterOpen(!isFilterOpen)}
						className="flex items-center space-x-2 px-4 py-2 bg-soft-gray/30 rounded-lg text-soft-beige hover:text-sunset-orange transition-colors duration-200"
					>
						<FilterIcon className="w-4 h-4" />
						<span>Filtros</span>
					</button>
				</div>

				{/* Filter Options */}
				{isFilterOpen && (
					<div className="space-y-4">
						{/* Category Filter */}
						<div>
							<label className="block text-soft-beige text-sm font-medium mb-2">
								Categoría
							</label>
							<div className="flex flex-wrap gap-2">
								<button
									onClick={() => updateFilter('category', 'all')}
									className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
										currentFilters.category === 'all'
											? 'bg-sunset-orange text-deep-night'
											: 'bg-soft-gray/30 text-soft-beige hover:text-sunset-orange'
									}`}
								>
									Todas
								</button>
								{categories.map(category => (
									<button
										key={category}
										onClick={() => updateFilter('category', category)}
										className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
											currentFilters.category === category
												? 'bg-sunset-orange text-deep-night'
												: 'bg-soft-gray/30 text-soft-beige hover:text-sunset-orange'
										}`}
									>
										{category}
									</button>
								))}
							</div>
						</div>

						{/* Sort Filter */}
						<div>
							<label className="block text-soft-beige text-sm font-medium mb-2">
								Ordenar por
							</label>
							<div className="flex flex-wrap gap-2">
								{sortOptions.map(option => (
									<button
										key={option.value}
										onClick={() => updateFilter('sort', option.value)}
										className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
											currentFilters.sort === option.value
												? 'bg-sunset-orange text-deep-night'
												: 'bg-soft-gray/30 text-soft-beige hover:text-sunset-orange'
										}`}
									>
										{option.label}
									</button>
								))}
							</div>
						</div>
					</div>
				)}
			</div>

			{/* Results Count */}
			<div className="text-center">
				<p className="text-soft-beige/70">
					{events.length} evento{events.length !== 1 ? 's' : ''} encontrado{events.length !== 1 ? 's' : ''}
				</p>
			</div>

			{/* Events Grid */}
			{events.length === 0 ? (
				<div className="text-center py-16">
					<CalendarIcon className="w-16 h-16 text-soft-gray mx-auto mb-4" />
					<h3 className="text-xl text-soft-beige mb-2">No se encontraron eventos</h3>
					<p className="text-soft-beige/60">
						Intenta ajustar tus filtros o revisa más tarde
					</p>
				</div>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
					{events.map((event, index) => {
						const dateInfo = formatDate(event.dateTime)
						const isAlmostFull = event.availableSeats < event.totalSeats * 0.2
						
						return (
							<div
								key={event.id}
								className="group bg-soft-gray/30 backdrop-blur-sm rounded-xl border border-soft-gray/20 overflow-hidden hover:border-sunset-orange/40 transition-all duration-300 hover:transform hover:-translate-y-2 hover:shadow-glow animate-fade-in"
								style={{ animationDelay: `${index * 0.1}s` }}
							>
								{/* Event Image Placeholder */}
								<div className="h-48 bg-gradient-to-br from-sunset-orange/20 to-warm-red/20 flex items-center justify-center relative">
									<CalendarIcon className="w-12 h-12 text-sunset-orange/60" />
									
									{/* Date Badge */}
									<div className="absolute top-4 left-4 bg-deep-night/80 backdrop-blur-sm rounded-lg px-3 py-2 text-center">
										<div className="text-2xl font-bold text-soft-beige">{dateInfo.day}</div>
										<div className="text-xs text-soft-gold uppercase">{dateInfo.month}</div>
									</div>

									{/* Availability Badge */}
									{isAlmostFull && (
										<div className="absolute top-4 right-4 bg-warm-red/90 backdrop-blur-sm rounded-lg px-2 py-1">
											<span className="text-xs text-soft-beige font-medium">Últimos lugares</span>
										</div>
									)}
								</div>

								{/* Event Content */}
								<div className="p-6 space-y-4">
									{/* Category */}
									{event.category && (
										<span className="inline-block px-2 py-1 bg-sunset-orange/20 text-sunset-orange text-xs rounded-full">
											{event.category}
										</span>
									)}

									{/* Title */}
									<h3 className="text-display text-xl text-soft-beige group-hover:text-sunset-orange transition-colors duration-300 line-clamp-2">
										{event.title}
									</h3>

									{/* Date and Time */}
									<div className="flex items-center space-x-2 text-soft-beige/70">
										<CalendarIcon className="w-4 h-4" />
										<span className="text-sm">
											{dateInfo.weekday}, {dateInfo.time}
										</span>
									</div>

									{/* Location */}
									<div className="flex items-center space-x-2 text-soft-beige/70">
										<MapPinIcon className="w-4 h-4" />
										<span className="text-sm">{event.location}</span>
									</div>

									{/* Description */}
									<p className="text-soft-beige/70 text-sm line-clamp-3 leading-relaxed">
										{event.description}
									</p>

									{/* Availability */}
									<div className="flex items-center justify-between text-sm">
										<div className="flex items-center space-x-2 text-soft-beige/70">
											<UsersIcon className="w-4 h-4" />
											<span>
												{event.availableSeats} de {event.totalSeats} disponibles
											</span>
										</div>
										<div className="text-right">
											<div className="text-xs text-soft-gold">
												Desde {event.seatsByTier.bronze > 0 ? 'Bronze' : event.seatsByTier.silver > 0 ? 'Silver' : 'Gold'}
											</div>
										</div>
									</div>

									{/* Action Button */}
									<Link
										href={`/events/${event.id}`}
										className="block w-full btn-primary text-center py-3 rounded-lg font-medium transition-all duration-200"
									>
										Ver Detalles
									</Link>
								</div>
							</div>
						)
					})}
				</div>
			)}
		</div>
	)
} 