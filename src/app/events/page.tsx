import { EventsList } from './components/events-list'

export default function EventsPage() {
	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-orange-900">
			<div className="container mx-auto px-4 py-8">
				<div className="text-center mb-8">
					<h1 className="text-4xl font-bold text-white mb-4">
						Próximos Eventos
					</h1>
					<p className="text-gray-300">
						Descubre nuestras sesiones de cine bajo las estrellas
					</p>
				</div>

				<EventsList />
			</div>
		</div>
	)
} 