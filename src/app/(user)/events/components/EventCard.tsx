"use client"

import Link from 'next/link'
import Image from 'next/image'
import { CalendarIcon, ClockIcon, MapPinIcon, UsersIcon, ArrowRightIcon, HeartIcon, BookmarkIcon } from 'lucide-react'
import { useState } from 'react'
import { getDay, formatShortDate, formatTime, formatWeekdayShort, formatMonthShort } from '@/lib/utils/date'
import { Event, EventCardProps } from '@/types/events'

export function EventCard({ event }: EventCardProps) {
	const [isFavorite, setIsFavorite] = useState(false)
	const [isBookmarked, setIsBookmarked] = useState(false)
	
	// Format date for display using consistent formatting
	const formattedDate = formatShortDate(event.dateTime)
	const formattedTime = formatTime(event.dateTime)
	const formattedWeekday = formatWeekdayShort(event.dateTime)
	const dayNumber = getDay(event.dateTime)
	const monthShort = formatMonthShort(event.dateTime)

	const occupancyRate = ((event.totalSeats - event.availableSeats) / event.totalSeats) * 100
	const isAlmostFull = event.availableSeats < event.totalSeats * 0.2

	// Get available tiers using the new data structure
	const getAvailableTiers = () => {
		return event.priceInfo.availableTiers
	}

	const availableTiers = getAvailableTiers()
	const hasAvailableSeats = availableTiers.length > 0

	// Format price for display
	const formatPrice = (price: number) => {
		return new Intl.NumberFormat('es-AR', {
			style: 'currency',
			currency: 'ARS',
			minimumFractionDigits: 0,
			maximumFractionDigits: 0,
		}).format(price)
	}

	return (
		<div className="group bg-deep-night/60 backdrop-blur-xl border border-soft-gray/20 rounded-2xl overflow-hidden hover:border-sunset-orange/40 transition-all duration-300 hover:transform hover:scale-[1.02] hover:shadow-2xl hover:shadow-sunset-orange/10">
			{/* Header Image Area */}
			<div className="relative h-40 bg-gradient-to-br from-sunset-orange/10 to-warm-red/10 overflow-hidden">
				{/* Background Pattern */}
				<div className="absolute inset-0 bg-gradient-to-t from-deep-night/80 via-transparent to-transparent z-10"></div>
				
				{/* Movie Image or Icon */}
				{event.imageUrl ? (
					<Image
						src={event.imageUrl}
						alt={event.title}
						fill
						className="object-cover"
						sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
					/>
				) : (
					<div className="absolute inset-0 flex items-center justify-center">
						<div className="text-4xl opacity-30 group-hover:opacity-50 transition-opacity duration-300">
							🎬
						</div>
					</div>
				)}

				{/* Top Row - Date & Actions */}
				<div className="absolute top-3 left-3 right-3 flex justify-between items-start z-20">
					{/* Date Badge */}
					<div className="bg-deep-night/90 backdrop-blur-sm rounded-xl px-3 py-2 border border-soft-gray/20">
						<div className="text-center">
							<div className="text-lg font-bold text-soft-beige leading-none">
								{dayNumber}
							</div>
							<div className="text-xs text-soft-gold uppercase font-medium">
								{monthShort}
							</div>
						</div>
					</div>

					{/* Action Buttons */}
					<div className="flex space-x-2">
						<button
							onClick={(e) => {
								e.preventDefault()
								setIsFavorite(!isFavorite)
							}}
							className={`w-8 h-8 rounded-lg backdrop-blur-sm border border-soft-gray/20 flex items-center justify-center transition-all duration-200 ${
								isFavorite 
									? 'bg-warm-red text-soft-beige' 
									: 'bg-deep-night/60 text-soft-beige/60 hover:bg-deep-night/80 hover:text-soft-beige'
							}`}
						>
							<HeartIcon className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
						</button>
						<button
							onClick={(e) => {
								e.preventDefault()
								setIsBookmarked(!isBookmarked)
							}}
							className={`w-8 h-8 rounded-lg backdrop-blur-sm border border-soft-gray/20 flex items-center justify-center transition-all duration-200 ${
								isBookmarked 
									? 'bg-soft-gold text-deep-night' 
									: 'bg-deep-night/60 text-soft-beige/60 hover:bg-deep-night/80 hover:text-soft-beige'
							}`}
						>
							<BookmarkIcon className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
						</button>
					</div>
				</div>

				{/* Bottom Row - Category & Status */}
				<div className="absolute bottom-3 left-3 right-3 flex justify-between items-end z-20">
					{/* Category Badge */}
					{event.category && (
						<div className="bg-sunset-orange/90 backdrop-blur-sm rounded-lg px-2.5 py-1 border border-sunset-orange/50">
							<span className="text-xs text-soft-beige font-semibold uppercase tracking-wide">
								{event.category}
							</span>
						</div>
					)}

					{/* Availability Warning */}
					{isAlmostFull && (
						<div className="bg-warm-red/80 backdrop-blur-sm rounded-lg px-2.5 py-1 border border-warm-red/30">
							<span className="text-xs text-soft-beige font-medium">
								¡Últimos lugares!
							</span>
						</div>
					)}
				</div>
			</div>

			{/* Content */}
			<div className="p-5 space-y-4">
				{/* Title */}

				<Link href={`/events/${event.id}`}>
				<div>
					<h3 className="text-lg font-bold text-soft-beige group-hover:text-sunset-orange transition-colors duration-300 leading-tight line-clamp-2 mb-1">
						{event.title}
					</h3>
					{event.description && (
						<p className="text-soft-beige/60 text-sm leading-relaxed line-clamp-2">
							{event.description}
						</p>
					)}
				</div>
				</Link>
				{/* Event Details */}
				<div className="space-y-2.5">
					<div className="flex items-center gap-2.5 text-soft-beige/80">
						<div className="w-7 h-7 bg-sunset-orange/20 rounded-lg flex items-center justify-center flex-shrink-0">
							<CalendarIcon className="w-3.5 h-3.5 text-sunset-orange" />
						</div>
						<div className="text-sm">
							<span className="font-medium text-soft-beige">{formattedWeekday}</span>
							<span className="text-soft-beige/60 ml-2">{formattedDate}</span>
						</div>
					</div>

					<div className="flex items-center gap-2.5 text-soft-beige/80">
						<div className="w-7 h-7 bg-soft-gold/20 rounded-lg flex items-center justify-center flex-shrink-0">
							<ClockIcon className="w-3.5 h-3.5 text-soft-gold" />
						</div>
						<div className="text-sm">
							<span className="font-medium text-soft-beige">{formattedTime}</span>
						</div>
					</div>

					{event.location && (
						<div className="flex items-center gap-2.5 text-soft-beige/80">
							<div className="w-7 h-7 bg-soft-beige/20 rounded-lg flex items-center justify-center flex-shrink-0">
								<MapPinIcon className="w-3.5 h-3.5 text-soft-beige" />
							</div>
							<div className="text-sm">
								<span className="font-medium text-soft-beige truncate">{event.location}</span>
							</div>
						</div>
					)}
				</div>

				{/* Availability Section */}
				<div className="bg-soft-gray/10 border border-soft-gray/20 rounded-xl p-3 space-y-3">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							<div className="w-6 h-6 bg-gradient-to-r from-sunset-orange/20 to-soft-gold/20 rounded-lg flex items-center justify-center">
								<UsersIcon className="w-3.5 h-3.5 text-sunset-orange" />
							</div>
							<div className="text-sm">
								<span className="font-semibold text-soft-beige">{event.availableSeats}</span>
								<span className="text-soft-beige/60">/{event.totalSeats}</span>
							</div>
						</div>
						<div className="text-right">
							{hasAvailableSeats ? (
								<>
									<div className="text-sm font-semibold text-soft-gold">
										{availableTiers.length} tier{availableTiers.length > 1 ? 's' : ''}
									</div>
									<div className="text-xs text-soft-beige/60">
										disponible{availableTiers.length > 1 ? 's' : ''}
									</div>
								</>
							) : (
								<>
									<div className="text-sm font-semibold text-warm-red">
										Agotado
									</div>
									<div className="text-xs text-soft-beige/60">
										Sin disponibilidad
									</div>
								</>
							)}
						</div>
					</div>

					{/* Progress Bar */}
					<div className="w-full bg-soft-gray/30 rounded-full h-1.5">
						<div 
							className="bg-gradient-to-r from-sunset-orange to-soft-gold h-1.5 rounded-full transition-all duration-300"
							style={{ width: `${occupancyRate}%` }}
						></div>
					</div>
					
					<div className="flex justify-between items-center text-xs">
						<span className="text-soft-beige/60">{Math.round(occupancyRate)}% ocupado</span>
						<span className="text-soft-beige/60">{event.reservationCount} reservas</span>
					</div>

					{/* Price Information */}
					{hasAvailableSeats && event.priceInfo.lowestPrice > 0 && (
						<div className="pt-2 border-t border-soft-gray/20">
							<div className="flex items-center justify-end">
								<div>
									<div className="text-xs text-soft-beige/60">Desde:</div>
									<div className="text-lg font-bold text-soft-gold">
										{formatPrice(event.priceInfo.lowestPrice)}
									</div>
								</div>
							</div>
						</div>
					)}
				</div>

				{/* Action Button */}
				<Link
					href={`/events/${event.id}`}
					className="group/button flex items-center justify-center gap-2 w-full bg-gradient-sunset-gold hover:bg-gradient-sunset-red text-deep-night px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-300 hover:shadow-lg hover:shadow-sunset-orange/25"
				>
					<span>Ver Detalles</span>
					<ArrowRightIcon className="w-4 h-4 group-hover/button:translate-x-0.5 transition-transform duration-300" />
				</Link>
			</div>
		</div>
	)
} 
