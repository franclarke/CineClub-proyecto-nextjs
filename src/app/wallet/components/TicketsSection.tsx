'use client'

import { useState } from 'react'
import { GlassCard } from '@/app/components/ui/glass-card'
import { Button } from '@/app/components/ui/button'

interface TicketsSectionProps {
	reservationsByEvent: Record<string, {
		event: any
		reservations: any[]
	}>
}

type FilterType = 'all' | 'upcoming' | 'past'

export function TicketsSection({ reservationsByEvent }: TicketsSectionProps) {
	const [filter, setFilter] = useState<FilterType>('all')
	const [selectedTicket, setSelectedTicket] = useState<string | null>(null)

	const now = new Date()
	
	const filteredEvents = Object.entries(reservationsByEvent).filter(([_, { event }]) => {
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
			<GlassCard className="p-8 text-center">
				<div className="w-20 h-20 bg-soft-gray/20 rounded-full flex items-center justify-center mx-auto mb-6">
					<svg className="w-10 h-10 text-soft-gray" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
					</svg>
				</div>
				<h3 className="text-display text-xl text-soft-beige mb-2">
					No tienes tickets
				</h3>
				<p className="text-soft-gray mb-6">
					Compra tickets para tus próximos eventos y aparecerán aquí
				</p>
				<a
					href="/events"
					className="inline-flex items-center gap-2 btn-primary px-6 py-3 rounded-lg font-medium"
				>
					Ver Eventos Disponibles
				</a>
			</GlassCard>
		)
	}

	return (
		<div className="space-y-6">
			{/* Filters */}
			<div className="flex flex-wrap gap-3">
				{filters.map((filterOption) => (
					<button
						key={filterOption.id}
						onClick={() => setFilter(filterOption.id)}
						className={`
							flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200
							${filter === filterOption.id
								? 'bg-sunset-orange text-deep-night'
								: 'bg-soft-gray/20 text-soft-beige hover:bg-soft-gray/30'
							}
						`}
					>
						<span>{filterOption.label}</span>
						<span className={`
							px-2 py-1 text-xs rounded-full font-bold
							${filter === filterOption.id
								? 'bg-deep-night/20 text-deep-night'
								: 'bg-sunset-orange text-deep-night'
							}
						`}>
							{filterOption.count}
						</span>
					</button>
				))}
			</div>

			{/* Tickets */}
			<div className="space-y-6">
				{filteredEvents.map(([eventId, { event, reservations }]) => {
					const eventDate = new Date(event.dateTime)
					const isUpcoming = eventDate > now
					const isPast = eventDate <= now

					return (
						<GlassCard key={eventId} className="p-6">
							<div className="flex flex-col lg:flex-row gap-6">
								{/* Event Info */}
								<div className="flex-1">
									<div className="flex items-start justify-between mb-4">
										<div>
											<h3 className="text-sunset-orange font-bold text-xl mb-1">
												{event.title}
											</h3>
											<div className="text-soft-gray text-sm space-y-1">
												<p>
													{eventDate.toLocaleDateString('es-ES', {
														weekday: 'long',
														year: 'numeric',
														month: 'long',
														day: 'numeric'
													})} • {eventDate.toLocaleTimeString('es-ES', {
														hour: '2-digit',
														minute: '2-digit'
													})}
												</p>
												<p>{event.location}</p>
											</div>
										</div>
										<div className={`
											px-3 py-1 rounded-full text-xs font-bold
											${isUpcoming 
												? 'bg-soft-gold/20 text-soft-gold' 
												: 'bg-soft-gray/20 text-soft-gray'
											}
										`}>
											{isUpcoming ? 'PRÓXIMO' : 'PASADO'}
										</div>
									</div>

									{/* Seats */}
									<div className="mb-4">
										<h4 className="text-soft-beige font-medium mb-2">
											Tus Asientos ({reservations.length})
										</h4>
										<div className="flex flex-wrap gap-2">
											{reservations.map((reservation) => (
												<div
													key={reservation.id}
													className="px-3 py-2 bg-soft-gray/20 rounded-lg border border-soft-gray/30 text-center"
												>
													<div className="text-soft-beige font-medium text-sm">
														#{reservation.seat.seatNumber}
													</div>
													<div className="text-soft-gray text-xs">
														{reservation.seat.tier}
													</div>
												</div>
											))}
										</div>
									</div>

									{/* Actions */}
									<div className="flex flex-wrap gap-3">
										{isUpcoming && (
											<Button
												size="sm"
												variant="outline"
												onClick={() => setSelectedTicket(selectedTicket === eventId ? null : eventId)}
											>
												{selectedTicket === eventId ? 'Ocultar QR' : 'Mostrar QR'}
											</Button>
										)}
										<Button
											size="sm"
											variant="outline"
											onClick={() => {
												// Download ticket functionality
												alert('Funcionalidad de descarga próximamente')
											}}
										>
											<svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
											</svg>
											Descargar
										</Button>
									</div>
								</div>

								{/* QR Code */}
								{selectedTicket === eventId && (
									<div className="lg:w-48 flex flex-col items-center">
										<div className="bg-white p-4 rounded-lg mb-3">
											<img
												src={generateTicketQR(reservations[0].id)}
												alt="QR Code"
												className="w-32 h-32"
											/>
										</div>
										<p className="text-soft-gray text-xs text-center">
											Presenta este código QR en el evento
										</p>
									</div>
								)}
							</div>
						</GlassCard>
					)
				})}
			</div>

			{filteredEvents.length === 0 && (
				<GlassCard className="p-8 text-center">
					<div className="w-16 h-16 bg-soft-gray/20 rounded-full flex items-center justify-center mx-auto mb-4">
						<svg className="w-8 h-8 text-soft-gray" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
						</svg>
					</div>
					<p className="text-soft-gray">
						No hay tickets para el filtro seleccionado
					</p>
				</GlassCard>
			)}
		</div>
	)
} 