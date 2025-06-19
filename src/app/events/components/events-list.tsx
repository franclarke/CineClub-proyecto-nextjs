'use client'

import { useAuth } from '../../hooks/use-auth'
import { Button } from '../../components/ui/button'
import { EventCard } from './event-card'


export function EventsList({ events, onEventDeleted }: { events: any[], onEventDeleted: (id: string) => void }) {
	const { user, signOut, isLoading } = useAuth()

	if (isLoading) {
		return (
			<div className="flex justify-center items-center py-12">
				<div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
			</div>
		)
	}

	return (
		<div className="max-w-4xl mx-auto">
			{/* Header con información del usuario */}
			<div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6 mb-8">
				<div className="flex justify-between items-center">
					<div>
						<h2 className="text-xl font-semibold text-white mb-2">
							¡Bienvenido, {user?.name || user?.email}!
						</h2>
						<p className="text-gray-300">
							Membresía: <span className="text-orange-400 font-medium">{user?.membershipName}</span>
						</p>
						{user?.isAdmin && (
							<p className="text-green-400 text-sm mt-1">
								✓ Administrador
							</p>
						)}
					</div>
					<Button
						onClick={signOut}
						variant="outline"
						size="sm"
					>
						Cerrar Sesión
					</Button>
				</div>
			</div>

			{/* Lista de eventos */}
			<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
				{events.map(event => (
					<EventCard
						key={event.id}
						event={event}
						onDeleted={onEventDeleted}
					/>
				))}
			</div>
		</div>
	)
}