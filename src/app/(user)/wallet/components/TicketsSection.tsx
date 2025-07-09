'use client'

import { useState, useMemo, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ReservationsByEvent, ReservationWithDetails } from '@/types/api'
import { CalendarIcon, TicketIcon, QrCodeIcon, DownloadIcon, EyeIcon, EyeOffIcon, MapPinIcon, FilterIcon } from 'lucide-react'
import { formatFullDate, formatTime, isPastDate } from '@/lib/utils/date'

interface TicketsSectionProps {
	reservationsByEvent: ReservationsByEvent
	searchQuery?: string
}

type FilterType = 'all' | 'upcoming' | 'past'

export function TicketsSection({ reservationsByEvent, searchQuery = '' }: TicketsSectionProps) {
	const [filter, setFilter] = useState<FilterType>('all')
	const [selectedTicket, setSelectedTicket] = useState<string | null>(null)
	
	// Memoized ticket data for performance
	const ticketData = useMemo(() => {
		const entries = Object.entries(reservationsByEvent)
		const events = entries.map(([eventId, data]) => ({
			eventId,
			...data,
			isUpcoming: !isPastDate(data.event.dateTime)
		}))
		
		return {
			all: events,
			upcoming: events.filter(e => e.isUpcoming),
			past: events.filter(e => !e.isUpcoming)
		}
	}, [reservationsByEvent])

	// Memoized filters with accurate counts
	const filters = useMemo(() => [
		{ id: 'all' as FilterType, label: 'Todos', count: ticketData.all.length },
		{ id: 'upcoming' as FilterType, label: 'Próximos', count: ticketData.upcoming.length },
		{ id: 'past' as FilterType, label: 'Pasados', count: ticketData.past.length }
	], [ticketData])

	// Optimized filtered events with search
	const filteredEvents = useMemo(() => {
		const baseEvents = ticketData[filter] || ticketData.all
		
		if (!searchQuery) return baseEvents
		
		const searchLower = searchQuery.toLowerCase()
		return baseEvents.filter(({ event }) => 
			event.title.toLowerCase().includes(searchLower) ||
			event.location.toLowerCase().includes(searchLower)
		)
	}, [ticketData, filter, searchQuery])

	// Improved QR generation with proper timestamp and error handling
	const generateTicketQR = useCallback((reservationId: string, eventTitle: string, seatNumbers: number[]) => {
		try {
			const qrData = {
				type: 'event_ticket',
				reservationId,
				eventTitle,
				seats: seatNumbers,
				timestamp: new Date().toISOString(),
				venue: 'CineClub Puff & Chill',
				validUntil: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString() // 48 hours
			}
			
			const encodedData = encodeURIComponent(JSON.stringify(qrData))
			return `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodedData}&bgcolor=1a1a1a&color=f5f5dc&margin=20&ecc=M&format=png`
		} catch (error) {
			console.error('Error generating QR code:', error)
			return null
		}
	}, [])

	// Optimized download handler
	const handleDownloadTicket = useCallback(async (eventTitle: string, reservations: ReservationWithDetails[]) => {
		try {
			const ticketData = {
				event: eventTitle,
				seats: reservations.map(r => ({
					seatNumber: r.seat.seatNumber,
					tier: r.seat.tier,
					reservationId: r.id
				})),
				downloadDate: new Date().toISOString(),
				totalSeats: reservations.length
			}
			
			// Create a more detailed ticket file
			const ticketContent = `
CINECLUB PUFF & CHILL
=====================

EVENTO: ${eventTitle}
FECHA DE DESCARGA: ${new Date().toLocaleDateString('es-ES', {
				year: 'numeric',
				month: 'long',
				day: 'numeric',
				hour: '2-digit',
				minute: '2-digit'
			})}

ASIENTOS RESERVADOS:
${reservations.map(r => `• Asiento #${r.seat.seatNumber} (${r.seat.tier}) - ID: ${r.id}`).join('\n')}

TOTAL DE ASIENTOS: ${reservations.length}

INSTRUCCIONES:
• Presenta este ticket en la entrada del evento
• Llega 30 minutos antes del inicio
• Conserva este ticket durante todo el evento

¡Disfruta tu experiencia cinematográfica!
			`.trim()
			
			const blob = new Blob([ticketContent], { type: 'text/plain' })
			const url = URL.createObjectURL(blob)
			const a = document.createElement('a')
			a.href = url
			a.download = `ticket-${eventTitle.replace(/\s+/g, '-').toLowerCase()}.txt`
			document.body.appendChild(a)
			a.click()
			document.body.removeChild(a)
			URL.revokeObjectURL(url)
		} catch (error) {
			console.error('Error downloading ticket:', error)
			alert('Error al descargar el ticket. Inténtalo nuevamente.')
		}
	}, [])

	// Toggle ticket selection
	const handleToggleTicket = useCallback((eventId: string) => {
		setSelectedTicket(prev => prev === eventId ? null : eventId)
	}, [])

	// Empty state
	if (ticketData.all.length === 0) {
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
									? 'bg-gradient-sunset-gold text-deep-night shadow-lg scale-[1.02]'
									: 'bg-soft-gray/20 text-soft-beige hover:bg-soft-gray/30 border border-soft-gray/20 hover:scale-[1.02]'
								}
							`}
							style={{ animationDelay: `${index * 0.1}s` }}
							aria-pressed={filter === filterOption.id}
							aria-label={`Filtrar por ${filterOption.label}`}
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
					<div className="text-soft-beige/60 text-sm" role="status" aria-live="polite">
						{filteredEvents.length} resultado{filteredEvents.length !== 1 ? 's' : ''} 
						{filteredEvents.length > 0 && ` para "${searchQuery}"`}
					</div>
				)}
			</div>

			{/* Tickets Grid */}
			<div className="space-y-6">
				{filteredEvents.map(({ eventId, event, reservations, isUpcoming }, index) => (
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
														{formatFullDate(event.dateTime)} • {formatTime(event.dateTime)}
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
											onClick={() => handleToggleTicket(eventId)}
											className="flex items-center gap-2 bg-gradient-to-r from-sunset-orange/20 to-soft-gold/20 text-sunset-orange px-4 py-3 rounded-xl font-medium transition-all duration-300 hover:bg-gradient-to-r hover:from-sunset-orange/30 hover:to-soft-gold/30 border border-sunset-orange/30 hover:scale-[1.02]"
											aria-expanded={selectedTicket === eventId}
											aria-label={selectedTicket === eventId ? 'Ocultar código QR' : 'Mostrar código QR'}
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
										onClick={() => handleDownloadTicket(event.title, reservations)}
										className="flex items-center gap-2 bg-soft-gray/20 text-soft-beige px-4 py-3 rounded-xl font-medium transition-all duration-300 hover:bg-soft-gray/30 border border-soft-gray/20 hover:scale-[1.02]"
										aria-label={`Descargar ticket para ${event.title}`}
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
										{(() => {
											const qrUrl = generateTicketQR(
												reservations[0]?.id || '', 
												event.title,
												reservations.map(r => r.seat.seatNumber)
											)
											return qrUrl ? (
												<img
													src={qrUrl}
													alt={`Código QR del ticket para ${event.title}`}
													className="w-full h-auto rounded-xl"
													onError={(e) => {
														console.error('Error loading QR image')
														e.currentTarget.style.display = 'none'
														e.currentTarget.nextElementSibling?.classList.remove('hidden')
													}}
												/>
											) : (
												<div className="w-64 h-64 bg-gray-100 rounded-xl flex items-center justify-center">
													<div className="text-center">
														<QrCodeIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
														<p className="text-gray-600 text-sm">Error al generar QR</p>
													</div>
												</div>
											)
										})()}
										<div className="hidden w-64 h-64 bg-gray-100 rounded-xl flex items-center justify-center">
											<div className="text-center">
												<QrCodeIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
												<p className="text-gray-600 text-sm">Error al cargar QR</p>
											</div>
										</div>
									</div>
									<div className="text-center">
										<div className="flex items-center gap-2 mb-3">
											<QrCodeIcon className="w-5 h-5 text-soft-gold" />
											<p className="text-soft-beige font-semibold">
												Código de Entrada
											</p>
										</div>
										<p className="text-soft-beige/60 text-sm leading-relaxed mb-4">
											Presenta este código en la entrada del evento
										</p>
										<div className="bg-gradient-to-r from-soft-gold/10 to-sunset-orange/10 border border-soft-gold/20 rounded-xl p-3">
											<p className="text-soft-beige/70 text-xs">
												Válido por 48 horas • {reservations.length} asiento{reservations.length > 1 ? 's' : ''}
											</p>
										</div>
									</div>
								</div>
							)}
						</div>
					</div>
				))}
			</div>

			{/* No results state */}
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
