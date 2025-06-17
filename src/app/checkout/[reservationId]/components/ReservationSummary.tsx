import { GlassCard } from '@/app/components/ui/glass-card'

interface ReservationSummaryProps {
	reservationsByEvent: Record<string, {
		event: any
		reservations: any[]
	}>
}

export function ReservationSummary({ reservationsByEvent }: ReservationSummaryProps) {
	return (
		<GlassCard className="p-6">
			<h3 className="text-display text-xl text-soft-beige mb-4">
				Tus Reservas
			</h3>
			
			<div className="space-y-6">
				{Object.entries(reservationsByEvent).map(([eventId, { event, reservations }]) => {
					const eventDate = new Date(event.dateTime)
					
					return (
						<div key={eventId} className="border-b border-soft-gray/20 last:border-0 pb-6 last:pb-0">
							{/* Event info */}
							<div className="mb-4">
								<h4 className="text-sunset-orange font-semibold mb-1">
									{event.title}
								</h4>
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

							{/* Seats */}
							<div>
								<h5 className="text-soft-beige font-medium mb-2">
									Asientos seleccionados ({reservations.length})
								</h5>
								<div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
									{reservations.map((reservation) => (
										<div
											key={reservation.id}
											className="flex items-center justify-center p-2 bg-soft-gray/20 rounded-lg border border-soft-gray/30"
										>
											<div className="text-center">
												<div className="text-soft-beige font-medium text-sm">
													{reservation.seat.seatNumber}
												</div>
												<div className="text-soft-gray text-xs">
													{reservation.seat.tier}
												</div>
											</div>
										</div>
									))}
								</div>
							</div>

							{/* Price summary for this event */}
							<div className="mt-4 p-3 bg-soft-gray/10 rounded-lg">
								<div className="flex justify-between items-center">
									<span className="text-soft-gray text-sm">
										{reservations.length} × $25
									</span>
									<span className="text-soft-beige font-medium">
										${reservations.length * 25}
									</span>
								</div>
							</div>
						</div>
					)
				})}
			</div>
		</GlassCard>
	)
} 