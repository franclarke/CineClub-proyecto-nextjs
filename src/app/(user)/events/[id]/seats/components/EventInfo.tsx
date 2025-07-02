import { Event } from '@prisma/client'
import { GlassCard } from '@/app/components/ui/glass-card'
import { CalendarIcon, ClockIcon, MapPinIcon } from 'lucide-react'
import { formatFullDate, formatTime } from '@/lib/utils/date'

interface EventInfoProps {
	event: Event
}

export function EventInfo({ event }: EventInfoProps) {
	const eventDate = typeof event.dateTime === 'string' ? event.dateTime : event.dateTime.toISOString()
	
	return (
		<GlassCard className="p-6">
			<h3 className="text-display text-xl text-soft-beige mb-4">
				Información del Evento
			</h3>
			
			<div className="space-y-3">
				<div>
					<h4 className="text-sunset-orange font-semibold mb-1">
						{event.title}
					</h4>
					<p className="text-soft-beige/80 text-sm line-clamp-3">
						{event.description}
					</p>
				</div>
				
				<div className="flex items-center gap-3 text-soft-beige/80">
					<CalendarIcon className="w-5 h-5 text-sunset-orange" />
					<span className="text-sm">
						{formatFullDate(eventDate)}
					</span>
				</div>
				
				<div className="flex items-center gap-3 text-soft-beige/80">
					<ClockIcon className="w-5 h-5 text-soft-gold" />
					<span className="text-sm">
						{formatTime(eventDate)}
					</span>
				</div>
				
				{event.location && (
					<div className="flex items-center gap-3 text-soft-beige/80">
						<MapPinIcon className="w-5 h-5 text-soft-beige" />
						<span className="text-sm">{event.location}</span>
					</div>
				)}
				
				{event.category && (
					<div>
						<span className="text-soft-gray text-sm">Categoría</span>
						<p className="text-soft-beige font-medium">
							{event.category}
						</p>
					</div>
				)}
			</div>
		</GlassCard>
	)
} 