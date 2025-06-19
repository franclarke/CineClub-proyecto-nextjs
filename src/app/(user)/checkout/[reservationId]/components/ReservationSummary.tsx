import { ReservationsByEvent } from '@/types/api'
import { Calendar, MapPin, Clock, Users } from 'lucide-react'

interface ReservationSummaryProps {
	reservationsByEvent: ReservationsByEvent
}

export function ReservationSummary({ reservationsByEvent }: ReservationSummaryProps) {
	return (
		<div className="space-y-6">
			{Object.entries(reservationsByEvent).map(([eventId, { event, reservations }]) => {
				const eventDate = new Date(event.dateTime)
				
				return (
					<div key={eventId} className="border-b border-soft-gray/20 last:border-0 pb-6 last:pb-0">
						{/* Event Header */}
						<div className="flex items-start gap-4 mb-4">
							<div className="w-12 h-12 bg-gradient-to-r from-sunset-orange/20 to-soft-gold/20 rounded-xl flex items-center justify-center">
								<Calendar className="w-6 h-6 text-sunset-orange" />
							</div>
							<div className="flex-1">
								<h3 className="text-xl font-bold text-sunset-orange mb-2">
									{event.title}
								</h3>
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-soft-beige/80">
									<div className="flex items-center gap-2">
										<Calendar className="w-4 h-4" />
										<span>
											{eventDate.toLocaleDateString('es-ES', {
												weekday: 'long',
												year: 'numeric',
												month: 'long',
												day: 'numeric'
											})}
										</span>
									</div>
									<div className="flex items-center gap-2">
										<Clock className="w-4 h-4" />
										<span>
											{eventDate.toLocaleTimeString('es-ES', {
												hour: '2-digit',
												minute: '2-digit'
											})}
										</span>
									</div>
									<div className="flex items-center gap-2">
										<MapPin className="w-4 h-4" />
										<span>{event.location}</span>
									</div>
									<div className="flex items-center gap-2">
										<Users className="w-4 h-4" />
										<span>{reservations.length} {reservations.length === 1 ? 'asiento' : 'asientos'}</span>
									</div>
								</div>
							</div>
						</div>

						{/* Seats Grid */}
						<div className="mt-4">
							<h4 className="text-soft-beige font-medium mb-3 flex items-center gap-2">
								<Users className="w-4 h-4" />
								Asientos Seleccionados
							</h4>
							<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
								{reservations.map((reservation) => (
									<div
										key={reservation.id}
										className="bg-soft-gray/10 border border-soft-gray/20 rounded-lg p-3 text-center hover:bg-soft-gray/20 transition-colors duration-300"
									>
										<div className="text-soft-beige font-semibold text-sm">
											{reservation.seat.seatNumber}
										</div>
										<div className="text-soft-beige/60 text-xs capitalize">
											{reservation.seat.tier}
										</div>
									</div>
								))}
							</div>
						</div>

						{/* Price Summary */}
						<div className="mt-4 p-4 bg-soft-gray/10 rounded-lg border border-soft-gray/20">
							<div className="flex justify-between items-center">
								<span className="text-soft-beige/80 text-sm">
									{reservations.length} × $25
								</span>
								<span className="text-soft-beige font-bold">
									${reservations.length * 25}
								</span>
							</div>
						</div>
					</div>
				)
			})}
		</div>
	)
} 