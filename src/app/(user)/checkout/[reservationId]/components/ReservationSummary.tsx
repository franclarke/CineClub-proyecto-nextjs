import { Event, Reservation, Seat } from '@prisma/client'
import Image from 'next/image'
import { Calendar, MapPin, Clock, Users, Ticket } from 'lucide-react'

interface ReservationSummaryProps {
	reservation: Reservation & {
		seat: Seat
		event: Event
		expiresAt: Date
	}
	event: Event
	seat: Seat
}

export function ReservationSummary({ reservation, event, seat }: ReservationSummaryProps) {
	const eventDate = new Date(event.dateTime)
	
	return (
		<div className="space-y-6">
			{/* Event Header */}
			<div className="flex items-start gap-4 mb-4">
				{/* Event Image or Icon */}
				{event.imageUrl ? (
					<div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
						<Image
							src={event.imageUrl}
							alt={event.title}
							fill
							className="object-cover"
							sizes="80px"
						/>
					</div>
				) : (
					<div className="w-20 h-20 bg-gradient-to-r from-sunset-orange/20 to-soft-gold/20 rounded-xl flex items-center justify-center flex-shrink-0">
						<Ticket className="w-8 h-8 text-sunset-orange" />
					</div>
				)}
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
							<span>1 asiento</span>
						</div>
					</div>
				</div>
			</div>

			{/* Seat Info */}
			<div className="mt-4">
				<h4 className="text-soft-beige font-medium mb-3 flex items-center gap-2">
					<Users className="w-4 h-4" />
					Tu Asiento
				</h4>
				<div className="bg-soft-gray/10 border border-soft-gray/20 rounded-lg p-4">
					<div className="flex items-center justify-between">
						<div>
							<div className="text-soft-beige font-semibold text-lg">
								Asiento #{seat.seatNumber}
							</div>
							<div className="text-soft-beige/60 text-sm capitalize">
								Tier {seat.tier}
							</div>
						</div>
						<div className="text-right">
							<div className="text-sunset-orange font-bold text-lg">
								$25.00
							</div>
							<div className="text-soft-beige/60 text-xs">
								Precio del ticket
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Reservation Details */}
			<div className="mt-4 p-4 bg-gradient-to-r from-soft-gold/10 to-sunset-orange/10 rounded-lg border border-soft-gold/20">
				<div className="flex items-center justify-between">
					<div>
						<div className="text-soft-beige font-medium">
							Reserva Temporal
						</div>
						<div className="text-soft-beige/60 text-sm">
							ID: {reservation.id.slice(-8)}
						</div>
					</div>
					<div className="text-right">
						<div className="text-soft-gold font-bold">
							ACTIVA
						</div>
						<div className="text-soft-beige/60 text-xs">
							Expira pronto
						</div>
					</div>
				</div>
			</div>
		</div>
	)
} 