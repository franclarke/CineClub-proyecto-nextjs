'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { EventCard } from './EventCard'
import { SearchIcon, FilterIcon, CalendarIcon, TrendingUpIcon, AlphabeticalIcon, SlidersHorizontalIcon, XIcon } from 'lucide-react'

interface Event {
	id: string
	title: string
	description: string | null
	dateTime: string
	location: string | null
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

export function EventsClientComponent({ events, categories, currentFilters }: EventsClientComponentProps) {
	const router = useRouter()
	const [searchTerm, setSearchTerm] = useState(currentFilters.search)
	const [selectedCategory, setSelectedCategory] = useState(currentFilters.category)
	const [sortBy, setSortBy] = useState(currentFilters.sort)
	const [showFilters, setShowFilters] = useState(false)

	const handleFilterChange = () => {
		const params = new URLSearchParams()
		
		if (selectedCategory && selectedCategory !== 'all') {
			params.set('category', selectedCategory)
		}
		if (sortBy && sortBy !== 'date') {
			params.set('sort', sortBy)
		}
		if (searchTerm) {
			params.set('search', searchTerm)
		}

		const queryString = params.toString()
		router.push(`/events${queryString ? `?${queryString}` : ''}`)
	}

	const clearFilters = () => {
		setSearchTerm('')
		setSelectedCategory('all')
		setSortBy('date')
		router.push('/events')
	}

	const sortOptions = [
		{ value: 'date', label: 'Fecha', icon: CalendarIcon },
		{ value: 'popular', label: 'Populares', icon: TrendingUpIcon },
		{ value: 'name', label: 'A-Z', icon: AlphabeticalIcon },
	]

	const hasActiveFilters = selectedCategory !== 'all' || searchTerm || sortBy !== 'date'

	return (
		<div className="space-y-6">
			{/* Compact Filter Bar */}
			<div className="bg-deep-night/40 backdrop-blur-xl border border-soft-gray/20 rounded-2xl p-4">
				<div className="flex items-center justify-between">
					{/* Search Bar */}
					<div className="flex-1 max-w-md">
						<div className="relative">
							<SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-soft-beige/40" />
							<input
								type="text"
								placeholder="Buscar eventos..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								onKeyPress={(e) => e.key === 'Enter' && handleFilterChange()}
								className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-soft-gray/10 border border-soft-gray/20 text-soft-beige placeholder-soft-beige/50 focus:border-sunset-orange focus:outline-none focus:ring-1 focus:ring-sunset-orange/20 transition-all duration-200 text-sm"
							/>
						</div>
					</div>

					{/* Filter Controls */}
					<div className="flex items-center space-x-3 ml-4">
						{/* Quick Sort */}
						<select
							value={sortBy}
							onChange={(e) => {
								setSortBy(e.target.value)
								handleFilterChange()
							}}
							className="px-3 py-2.5 rounded-xl bg-soft-gray/10 border border-soft-gray/20 text-soft-beige text-sm focus:border-sunset-orange focus:outline-none focus:ring-1 focus:ring-sunset-orange/20 transition-all duration-200"
						>
							{sortOptions.map((option) => (
								<option key={option.value} value={option.value}>
									{option.label}
								</option>
							))}
						</select>

						{/* Filter Toggle */}
						<button
							onClick={() => setShowFilters(!showFilters)}
							className={`flex items-center space-x-2 px-3 py-2.5 rounded-xl transition-all duration-200 text-sm font-medium ${
								showFilters || hasActiveFilters
									? 'bg-sunset-orange text-deep-night'
									: 'bg-soft-gray/10 text-soft-beige hover:bg-soft-gray/20'
							}`}
						>
							<SlidersHorizontalIcon className="w-4 h-4" />
							<span className="hidden sm:inline">Filtros</span>
							{hasActiveFilters && (
								<div className="w-2 h-2 bg-soft-gold rounded-full animate-pulse"></div>
							)}
						</button>

						{/* Apply Search */}
						<button
							onClick={handleFilterChange}
							className="px-4 py-2.5 bg-gradient-to-r from-sunset-orange to-soft-gold text-deep-night rounded-xl font-medium text-sm hover:shadow-lg transition-all duration-200"
						>
							Buscar
						</button>
					</div>
				</div>

				{/* Expandable Filters */}
				{showFilters && (
					<div className="mt-4 pt-4 border-t border-soft-gray/20">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							{/* Category Filter */}
							<div>
								<label className="block text-soft-beige/80 text-sm font-medium mb-2">Categoría</label>
								<select
									value={selectedCategory}
									onChange={(e) => setSelectedCategory(e.target.value)}
									className="w-full px-3 py-2.5 rounded-xl bg-soft-gray/10 border border-soft-gray/20 text-soft-beige text-sm focus:border-sunset-orange focus:outline-none focus:ring-1 focus:ring-sunset-orange/20 transition-all duration-200"
								>
									<option value="all">Todas las categorías</option>
									{categories.map((category) => (
										<option key={category} value={category}>
											{category}
										</option>
									))}
								</select>
							</div>

							{/* Actions */}
							<div className="flex items-end space-x-3">
								<button
									onClick={clearFilters}
									className="flex items-center space-x-2 px-4 py-2.5 bg-soft-gray/10 text-soft-beige hover:bg-soft-gray/20 rounded-xl transition-all duration-200 text-sm"
								>
									<XIcon className="w-4 h-4" />
									<span>Limpiar</span>
								</button>
								<button
									onClick={() => setShowFilters(false)}
									className="px-4 py-2.5 bg-soft-gray/10 text-soft-beige hover:bg-soft-gray/20 rounded-xl transition-all duration-200 text-sm"
								>
									Cerrar
								</button>
							</div>
						</div>
					</div>
				)}
			</div>

			{/* Active Filters Tags */}
			{hasActiveFilters && (
				<div className="flex flex-wrap gap-2">
					{selectedCategory !== 'all' && (
						<span className="inline-flex items-center space-x-1 bg-sunset-orange/20 text-sunset-orange border border-sunset-orange/30 px-3 py-1.5 rounded-full text-sm font-medium">
							<span>{selectedCategory}</span>
							<button
								onClick={() => {
									setSelectedCategory('all')
									handleFilterChange()
								}}
								className="hover:bg-sunset-orange/30 rounded-full p-0.5 transition-colors"
							>
								<XIcon className="w-3 h-3" />
							</button>
						</span>
					)}
					{searchTerm && (
						<span className="inline-flex items-center space-x-1 bg-soft-gold/20 text-soft-gold border border-soft-gold/30 px-3 py-1.5 rounded-full text-sm font-medium">
							<span>"{searchTerm}"</span>
							<button
								onClick={() => {
									setSearchTerm('')
									handleFilterChange()
								}}
								className="hover:bg-soft-gold/30 rounded-full p-0.5 transition-colors"
							>
								<XIcon className="w-3 h-3" />
							</button>
						</span>
					)}
					{sortBy !== 'date' && (
						<span className="inline-flex items-center space-x-1 bg-soft-beige/20 text-soft-beige border border-soft-beige/30 px-3 py-1.5 rounded-full text-sm font-medium">
							<span>{sortOptions.find(opt => opt.value === sortBy)?.label}</span>
							<button
								onClick={() => {
									setSortBy('date')
									handleFilterChange()
								}}
								className="hover:bg-soft-beige/30 rounded-full p-0.5 transition-colors"
							>
								<XIcon className="w-3 h-3" />
							</button>
						</span>
					)}
				</div>
			)}

			{/* Events Grid */}
			{events.length > 0 ? (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{events.map((event) => (
						<EventCard key={event.id} event={event} />
					))}
				</div>
			) : (
				<div className="text-center py-16">
					<div className="bg-deep-night/40 backdrop-blur-xl border border-soft-gray/20 rounded-2xl max-w-md mx-auto p-8">
						<div className="w-16 h-16 bg-soft-gray/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
							<CalendarIcon className="w-8 h-8 text-soft-gray" />
						</div>
						<h3 className="text-xl font-semibold text-soft-beige mb-2">
							No hay eventos disponibles
						</h3>
						<p className="text-soft-beige/60 mb-6 text-sm leading-relaxed">
							{currentFilters.search 
								? `No encontramos eventos que coincidan con "${currentFilters.search}"`
								: 'No hay eventos disponibles con los filtros seleccionados'
							}
						</p>
						{hasActiveFilters && (
							<button
								onClick={clearFilters}
								className="px-6 py-2.5 bg-gradient-to-r from-sunset-orange to-soft-gold text-deep-night rounded-xl font-medium text-sm hover:shadow-lg transition-all duration-200"
							>
								Limpiar Filtros
							</button>
						)}
					</div>
				</div>
			)}

			{/* Results Summary */}
			{events.length > 0 && (
				<div className="flex items-center justify-between text-sm text-soft-beige/60 pt-4 border-t border-soft-gray/20">
					<span>
						{events.length} evento{events.length !== 1 ? 's' : ''} encontrado{events.length !== 1 ? 's' : ''}
					</span>
					<div className="flex items-center space-x-6">
						<span>{events.reduce((acc, event) => acc + event.availableSeats, 0)} asientos disponibles</span>
						<span>{events.reduce((acc, event) => acc + event.reservationCount, 0)} reservas</span>
					</div>
				</div>
			)}
		</div>
	)
} 