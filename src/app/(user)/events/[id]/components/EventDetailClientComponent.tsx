'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { 
	CalendarIcon, 
	MapPinIcon, 
	ClockIcon, 
	PlayIcon,
	TagIcon
} from 'lucide-react'
import { TrailerPlayer } from './TrailerPlayer'
import { formatFullDate, formatTime, formatMonthShort } from '@/lib/utils/date'
import { parseISO } from 'date-fns'
import { useCurrentDate } from '@/app/hooks/use-hydration'
import { BackButton } from '@/app/components/ui/back-button'
import { EventDetail, EventDetailClientComponentProps } from '@/types/events'

interface IMDbData {
	title: string
	year: string
	genre: string
	director: string
	plot: string
	poster: string
	runtime: string
	imdbRating: string
}

export function EventDetailClientComponent({ event }: EventDetailClientComponentProps) {
	const [imdbData, setImdbData] = useState<IMDbData | null>(null)
	const [isLoadingImdb, setIsLoadingImdb] = useState(false)
	const currentDate = useCurrentDate()

	useEffect(() => {
		if (event.imdbId) {
			setIsLoadingImdb(true)
			// En una implementación real, aquí llamarías a tu API que consulta IMDb
			// Por ahora, simulamos datos
			setTimeout(() => {
				setImdbData({
					title: event.title,
					year: '2024',
					genre: event.category || 'Drama',
					director: 'Director Placeholder',
					plot: event.description || 'Descripción no disponible',
					poster: '/placeholder-movie-poster.jpg',
					runtime: '120 min',
					imdbRating: '8.5'
				})
				setIsLoadingImdb(false)
			}, 1000)
		}
	}, [event.imdbId, event.title, event.category, event.description])

	const formatDate = (dateString: string | Date) => {
		const dateStr = typeof dateString === 'string' ? dateString : dateString.toISOString()
		const date = parseISO(dateStr)
		return {
			full: formatFullDate(dateStr),
			time: formatTime(dateStr),
			day: date.getDate(),
			month: formatMonthShort(dateStr),
		}
	}

	const dateInfo = formatDate(event.dateTime)
	const isEventPast = currentDate ? new Date(event.dateTime) < currentDate : false
	const isAlmostFull = event.seatStats.available < event.seatStats.total * 0.2

	return (
		<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			{/* Back Button */}
			<div className="mb-8">
				<BackButton href="/events" label="Volver a eventos" />
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
				{/* Main Content */}
				<div className="lg:col-span-2 space-y-8">
					{/* Hero Section */}
					<div className="relative">
						{/* Movie Poster / Hero Image */}
						<div className="aspect-video bg-gradient-to-br from-sunset-orange/20 to-warm-red/20 rounded-xl overflow-hidden flex items-center justify-center relative">
							{event.imageUrl ? (
								<Image 
									src={event.imageUrl} 
									alt={event.title}
									fill
									className="object-cover"
									sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
								/>
							) : isLoadingImdb ? (
								<div className="animate-pulse">
									<div className="w-24 h-24 bg-soft-gray/30 rounded-full flex items-center justify-center">
										<PlayIcon className="w-12 h-12 text-soft-gray" />
									</div>
								</div>
							) : (
								<div className="text-center">
									<PlayIcon className="w-24 h-24 text-sunset-orange/60 mx-auto mb-4" />
									<p className="text-soft-beige/60">Imagen no disponible</p>
								</div>
							)}

							{/* Date Badge */}
							<div className="absolute top-4 left-4 bg-deep-night/80 backdrop-blur-sm rounded-lg px-3 py-2 text-center">
								<div className="text-2xl font-bold text-soft-beige">{dateInfo.day}</div>
								<div className="text-xs text-soft-gold uppercase">{dateInfo.month}</div>
							</div>

							{/* Availability Badge */}
							{isAlmostFull && !isEventPast && (
								<div className="absolute top-4 right-4 bg-warm-red/90 backdrop-blur-sm rounded-lg px-3 py-2">
									<span className="text-sm text-soft-beige font-medium">Últimos lugares</span>
								</div>
							)}
						</div>
					</div>

					{/* Title and Basic Info */}
					<div className="space-y-4">
						<div className="flex flex-wrap items-center gap-3 mb-4">
							{event.category && (
								<span className="inline-flex items-center space-x-1 px-3 py-1 bg-sunset-orange/20 text-sunset-orange text-sm rounded-full">
									<TagIcon className="w-3 h-3" />
									<span>{event.category}</span>
								</span>
							)}
							{imdbData && (
								<span className="inline-flex items-center space-x-1 px-3 py-1 bg-soft-gold/20 text-soft-gold text-sm rounded-full">
									<span>⭐</span>
									<span>{imdbData.imdbRating}/10</span>
								</span>
							)}
						</div>

						<h1 className="text-display text-3xl md:text-5xl text-soft-beige">
							{event.title}
						</h1>

						{imdbData && (
							<div className="flex flex-wrap items-center gap-6 text-soft-beige/70">
								<div className="flex items-center space-x-2">
									<ClockIcon className="w-4 h-4" />
									<span>{imdbData.runtime}</span>
								</div>
								<div>
									<span>Dirigida por {imdbData.director}</span>
								</div>
								<div>
									<span>{imdbData.year}</span>
								</div>
							</div>
						)}

						<div className="flex flex-wrap items-center gap-6 text-soft-beige/70">
							<div className="flex items-center space-x-2">
								<CalendarIcon className="w-4 h-4" />
								<span>{dateInfo.full} a las {dateInfo.time}</span>
							</div>
							<div className="flex items-center space-x-2">
								<MapPinIcon className="w-4 h-4" />
								<span>{event.location}</span>
							</div>
						</div>
					</div>

					{/* Description */}
					<div className="space-y-4">
						<h2 className="text-display text-2xl text-soft-beige">Sinopsis</h2>
						<p className="text-soft-beige/80 leading-relaxed">
							{imdbData?.plot || event.description || 'Descripción no disponible'}
						</p>
					</div>

					{/* Trailer Section */}
					<TrailerPlayer 
						tmdbId={event.tmdbId} 
					/>
				</div>

				{/* Sidebar */}
				<div className="space-y-6">
					{/* Booking Card */}
					<div className="bg-soft-gray/30 backdrop-blur-sm rounded-xl border border-soft-gray/20 p-6">
						<h3 className="text-display text-xl text-soft-beige mb-4">
							Reservar Asiento
						</h3>
						
						<div className="space-y-4 mb-6">
							<div className="flex items-center justify-between text-sm">
								<span className="text-soft-beige/70">Disponibles:</span>
								<span className="text-soft-beige font-medium">
									{event.seatStats.available} de {event.seatStats.total}
								</span>
							</div>
							
							{/* Seat availability by tier */}
							<div className="space-y-2">
								{Object.entries(event.seatStats.byTier).map(([tier, stats]) => (
									<div key={tier} className="flex items-center justify-between text-sm">
										<span className="text-soft-beige/70 capitalize">{tier}:</span>
										<span className={`font-medium ${
											stats.available > 0 ? 'text-soft-beige' : 'text-warm-red'
										}`}>
											{stats.available}/{stats.total}
										</span>
									</div>
								))}
							</div>
						</div>

						{isEventPast ? (
							<div className="text-center py-4">
								<p className="text-warm-red font-medium">Evento finalizado</p>
							</div>
						) : event.seatStats.available === 0 ? (
							<div className="text-center py-4">
								<p className="text-warm-red font-medium">Entradas agotadas</p>
							</div>
						) : (
							<Link
								href={`/events/${event.id}/seats`}
								className="block w-full btn-primary text-center py-3 rounded-lg font-medium transition-all duration-200"
							>
								Seleccionar Asientos
							</Link>
						)}
					</div>

					{/* Event Details */}
					<div className="bg-soft-gray/30 backdrop-blur-sm rounded-xl border border-soft-gray/20 p-6">
						<h3 className="text-display text-xl text-soft-beige mb-4">
							Detalles del Evento
						</h3>
						
						<div className="space-y-3">
							<div className="flex items-center justify-between">
								<span className="text-soft-beige/70">Fecha:</span>
								<span className="text-soft-beige text-sm">{dateInfo.full}</span>
							</div>
							<div className="flex items-center justify-between">
								<span className="text-soft-beige/70">Hora:</span>
								<span className="text-soft-beige text-sm">{dateInfo.time}</span>
							</div>
							<div className="flex items-center justify-between">
								<span className="text-soft-beige/70">Ubicación:</span>
								<span className="text-soft-beige text-sm">{event.location}</span>
							</div>
							{imdbData && (
								<>
									<div className="flex items-center justify-between">
										<span className="text-soft-beige/70">Duración:</span>
										<span className="text-soft-beige text-sm">{imdbData.runtime}</span>
									</div>
									<div className="flex items-center justify-between">
										<span className="text-soft-beige/70">Calificación:</span>
										<span className="text-soft-beige text-sm">⭐ {imdbData.imdbRating}/10</span>
									</div>
								</>
							)}
							<div className="flex items-center justify-between">
								<span className="text-soft-beige/70">Reservas:</span>
								<span className="text-soft-beige text-sm">{event.reservationCount}</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
} 