'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/app/components/ui/button'
import { ReservationsByEvent } from '@/types/api'
import { CalendarIcon, TicketIcon, QrCodeIcon, DownloadIcon, EyeIcon, EyeOffIcon, MapPinIcon, FilterIcon } from 'lucide-react'

interface TicketsSectionProps {
	reservationsByEvent: ReservationsByEvent
	searchQuery?: string
}

type FilterType = 'all' | 'upcoming' | 'past'

export function TicketsSection({ reservationsByEvent, searchQuery = '' }: TicketsSectionProps) {
	const [filter, setFilter] = useState<FilterType>('all')
	const [selectedTicket, setSelectedTicket] = useState<string | null>(null)

	const now = new Date()
	
	// Filter by search query and date filter
	const filteredEvents = Object.entries(reservationsByEvent).filter(([, { event }]) => {
		// Search filter
		const matchesSearch = !searchQuery || 
			event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
			event.location.toLowerCase().includes(searchQuery.toLowerCase())
		
		if (!matchesSearch) return false
		
		// Date filter
		const eventDate = new Date(event.dateTime)
		switch (filter) {
			case 'upcoming':
				return eventDate > now
			case 'past':
				return eventDate <= now
			default:
				return true
		}
	})

	const generateTicketQR = (reservationId: string) => {
		// In a real app, this would generate a proper QR code
		// For now, we'll return a placeholder URL
		return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(reservationId)}`
	}

	const filters = [
		{ id: 'all' as FilterType, label: 'Todos', count: Object.keys(reservationsByEvent).length },
		{ 
			id: 'upcoming' as FilterType, 
			label: 'Próximos', 
			count: Object.values(reservationsByEvent).filter(({ event }) => new Date(event.dateTime) > now).length 
		},
		{ 
			id: 'past' as FilterType, 
			label: 'Pasados', 
			count: Object.values(reservationsByEvent).filter(({ event }) => new Date(event.dateTime) <= now).length 
		}
	]

	if (Object.keys(reservationsByEvent).length === 0) {
		return (
			<div className="text-center py-20">
				<div className="bg-soft-beige/5 backdrop-blur-xl border border-soft-beige/10 rounded-3xl max-w-lg mx-auto p-12">
					<div className="w-20 h-20 bg-gradient-to-r from-sunset-orange/20 to-soft-gold/20 rounded-3xl flex items-center justify-center mx-auto mb-8">
						<TicketIcon className="w-10 h-10 text-sunset-orange" />
					</div>
					<h3 className="text-2xl font-bold text-soft-beige mb-4">
						No tienes tickets
					</h3>
					<p className="text-soft-beige/60 mb-8 leading-relaxed">
						Compra tickets para tus próximos eventos y aparecerán aquí
					</p>
					<Link
						href="/events"
						className="inline-flex items-center gap-3 bg-gradient-to-r from-sunset-orange to-soft-gold text-deep-night px-8 py-4 rounded-2xl font-semibold transition-all duration-300 hover:shadow-lg hover:scale-[1.02] group"
					>
						<CalendarIcon className="w-5 h-5" />
						<span>Ver Eventos Disponibles</span>
					</Link>
				</div>
			</div>
		)
	}

	return (
		<div className="space-y-8">
			{/* Filters */}
			<div className="flex items-center justify-between">
				<div className="flex flex-wrap gap-3">
					{filters.map((filterOption, index) => (
						<button
							key={filterOption.id}
							onClick={() => setFilter(filterOption.id)}
							className={`
								flex items-center gap-2 px-4 py-3 rounded-xl font-semibold transition-all duration-300 group
								${filter === filterOption.id
									? 'bg-gradient-to-r from-sunset-orange to-soft-gold text-deep-night shadow-lg scale-[1.02]'
									: 'bg-soft-gray/20 text-soft-beige hover:bg-soft-gray/30 border border-soft-gray/20 hover:scale-[1.02]'
								}
							`}
							style={{ animationDelay: `${index * 0.1}s` }}
						>
							<span className="text-sm">{filterOption.label}</span>
							{filterOption.count > 0 && (
								<div className={`
									px-2 py-1 text-xs rounded-full font-bold
									${filter === filterOption.id
										? 'bg-deep-night/20 text-deep-night'
										: 'bg-sunset-orange text-deep-night'
									}
								`}>
									{filterOption.count}
								</div>
							)}
						</button>
					))}
				</div>
				
				{searchQuery && (
					<div className="text-soft-beige/60 text-sm">
						{filteredEvents.length} resultado{filteredEvents.length !== 1 ? 's' : ''} 
						{filteredEvents.length > 0 && ` para "${searchQuery}"`}
					</div>
				)}
			</div>

			{/* Tickets Grid */}
			<div className="space-y-6">
				{filteredEvents.map(([eventId, { event, reservations }], index) => {
					const eventDate = new Date(event.dateTime)
					const isUpcoming = eventDate > now

					return (
						<div
							key={eventId}
							className="bg-soft-beige/5 backdrop-blur-xl border border-soft-beige/10 rounded-3xl p-8 animate-fade-in hover-lift"
							style={{ animationDelay: `${index * 0.1}s` }}
						>
							<div className="flex flex-col lg:flex-row gap-8">
								{/* Event Info */}
								<div className="flex-1">
									<div className="flex items-start justify-between mb-6">
										<div className="flex items-center gap-4">
											<div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${isUpcoming ? 'bg-gradient-to-r from-sunset-orange/20 to-soft-gold/20' : 'bg-soft-gray/20'}`}>
												<TicketIcon className={`w-7 h-7 ${isUpcoming ? 'text-sunset-orange' : 'text-soft-gray'}`} />
											</div>
											<div>
												<h3 className="text-2xl font-bold text-soft-beige mb-2">
													{event.title}
												</h3>
												<div className="space-y-2">
													<div className="flex items-center gap-2 text-soft-beige/80">
														<CalendarIcon className="w-4 h-4" />
														<span>
															{eventDate.toLocaleDateString('es-ES', {
																weekday: 'long',
																year: 'numeric',
																month: 'long',
																day: 'numeric'
															})} • {eventDate.toLocaleTimeString('es-ES', {
																hour: '2-digit',
																minute: '2-digit'
															})}
														</span>
													</div>
													<div className="flex items-center gap-2 text-soft-beige/60">
														<MapPinIcon className="w-4 h-4" />
														<span>{event.location}</span>
													</div>
												</div>
											</div>
										</div>
										<div className={`
											px-4 py-2 rounded-xl text-sm font-bold border
											${isUpcoming 
												? 'bg-soft-gold/20 text-soft-gold border-soft-gold/30' 
												: 'bg-soft-gray/20 text-soft-gray border-soft-gray/30'
											}
										`}>
											{isUpcoming ? 'PRÓXIMO' : 'PASADO'}
										</div>
									</div>

									{/* Seats */}
									<div className="mb-6">
										<h4 className="text-soft-beige font-semibold mb-4">
											Tus Asientos ({reservations.length})
										</h4>
										<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
											{reservations.map((reservation) => (
												<div
													key={reservation.id}
													className="bg-soft-gray/10 border border-soft-gray/20 rounded-xl p-4 text-center hover:bg-soft-gray/20 transition-all duration-300 group"
												>
													<div className="text-soft-beige font-bold mb-1 group-hover:text-sunset-orange transition-colors">
														#{reservation.seat.seatNumber}
													</div>
													<div className="text-soft-beige/60 text-xs">
														{reservation.seat.tier}
													</div>
												</div>
											))}
										</div>
									</div>

									{/* Actions */}
									<div className="flex flex-wrap gap-3">
										{isUpcoming && (
											<button
												onClick={() => setSelectedTicket(selectedTicket === eventId ? null : eventId)}
												className="flex items-center gap-2 bg-gradient-to-r from-sunset-orange/20 to-soft-gold/20 text-sunset-orange px-4 py-3 rounded-xl font-medium transition-all duration-300 hover:bg-gradient-to-r hover:from-sunset-orange/30 hover:to-soft-gold/30 border border-sunset-orange/30 hover:scale-[1.02]"
											>
												{selectedTicket === eventId ? (
													<>
														<EyeOffIcon className="w-4 h-4" />
														<span>Ocultar QR</span>
													</>
												) : (
													<>
														<EyeIcon className="w-4 h-4" />
														<span>Mostrar QR</span>
													</>
												)}
											</button>
										)}
										<button
											onClick={() => {
												// Download ticket functionality
												alert('Funcionalidad de descarga próximamente')
											}}
											className="flex items-center gap-2 bg-soft-gray/20 text-soft-beige px-4 py-3 rounded-xl font-medium transition-all duration-300 hover:bg-soft-gray/30 border border-soft-gray/20 hover:scale-[1.02]"
										>
											<DownloadIcon className="w-4 h-4" />
											<span>Descargar</span>
										</button>
									</div>
								</div>

								{/* QR Code */}
								{selectedTicket === eventId && isUpcoming && (
									<div className="lg:w-64 flex flex-col items-center animate-scale-in">
										<div className="bg-white p-6 rounded-2xl mb-6 shadow-lg">
											<Image
												src={generateTicketQR(reservations[0]?.id || '')}
												alt="Código QR del ticket"
												width={200}
												height={200}
												className="rounded-xl"
											/>
										</div>
										<div className="text-center">
											<div className="flex items-center gap-2 mb-3">
												<QrCodeIcon className="w-5 h-5 text-soft-gold" />
												<p className="text-soft-beige font-semibold">
													Código de Entrada
												</p>
											</div>
											<p className="text-soft-beige/60 text-sm leading-relaxed">
												Presenta este código en la entrada del evento
											</p>
										</div>
									</div>
								)}
							</div>
						</div>
					)
				})}
			</div>

			{filteredEvents.length === 0 && (
				<div className="text-center py-16">
					<div className="bg-soft-beige/5 backdrop-blur-xl border border-soft-beige/10 rounded-3xl max-w-md mx-auto p-8">
						<div className="w-16 h-16 bg-soft-gray/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
							<FilterIcon className="w-8 h-8 text-soft-gray" />
						</div>
						<p className="text-soft-beige/60 text-sm">
							No hay tickets para el filtro seleccionado
							{searchQuery && ` que coincidan con "${searchQuery}"`}
						</p>
					</div>
				</div>
			)}
		</div>
	)
} 