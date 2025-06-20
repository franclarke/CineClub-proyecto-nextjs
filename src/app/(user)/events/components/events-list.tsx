'use client'

import { useAuth } from '@/app/hooks/use-auth'
import { Button } from '@/app/components/ui/button'

export function EventsList() {
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

			{/* Lista de eventos (placeholder) */}
			<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
				{[1, 2, 3].map((i) => (
					<div
						key={i}
						className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6"
					>
						<div className="aspect-video bg-gray-700 rounded-lg mb-4" />
						<h3 className="text-lg font-semibold text-white mb-2">
							Evento {i}
						</h3>
						<p className="text-gray-300 text-sm mb-4">
							Próximamente disponible...
						</p>
						<Button variant="outline" size="sm" className="w-full">
							Ver Detalles
						</Button>
					</div>
				))}
			</div>
		</div>
	)
} 