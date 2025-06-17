import { Event } from '@prisma/client'
import { GlassCard } from '@/app/components/ui/glass-card'

interface EventInfoProps {
	event: Event
}

export function EventInfo({ event }: EventInfoProps) {
	const eventDate = new Date(event.dateTime)
	
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
				
				<div>
					<span className="text-soft-gray text-sm">Fecha y Hora</span>
					<p className="text-soft-beige font-medium">
						{eventDate.toLocaleDateString('es-ES', {
							weekday: 'long',
							year: 'numeric',
							month: 'long',
							day: 'numeric'
						})}
					</p>
					<p className="text-soft-beige/80">
						{eventDate.toLocaleTimeString('es-ES', {
							hour: '2-digit',
							minute: '2-digit'
						})}
					</p>
				</div>
				
				<div>
					<span className="text-soft-gray text-sm">Ubicación</span>
					<p className="text-soft-beige font-medium">
						{event.location}
					</p>
				</div>
				
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