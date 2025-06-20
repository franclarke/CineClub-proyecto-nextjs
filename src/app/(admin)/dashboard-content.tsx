"use client"

import { Link } from "lucide-react"
import { useAuth } from "../../hooks/use-auth"
import { Button } from "../../components/ui/button"


export function DashboardContent() {
	const { user, signOut, isLoading } = useAuth()

	if (isLoading) {
		return (
			<div className="flex justify-center items-center py-12">
				<div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
			</div>
		)
	}

	return (
		<div className="max-w-6xl mx-auto">
			{/* Header del admin */}
			<div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6 mb-8">
				<div className="flex justify-between items-center">


				</div>
			</div>

			{/* Grid de funcionalidades */}
			<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
				<div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6">
					<h3 className="text-lg font-semibold text-white mb-4">
						Gestión de Eventos
					</h3>
					<p className="text-gray-300 text-sm mb-4">
						Crear, editar y eliminar eventos de cine
					</p>
					<Link href="/dashboard/events">
						<Button variant="primary" size="sm" className="w-full">
							Gestionar Eventos
						</Button>
					</Link>
				</div>

				<div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6">
					<h3 className="text-lg font-semibold text-white mb-4">
						Usuarios y Membresías
					</h3>
					<p className="text-gray-300 text-sm mb-4">
						Administrar usuarios y tipos de membresía
					</p>
					<Link href="/dashboard/users">
						<Button variant="primary" size="sm" className="w-full">
							Gestionar Usuarios
						</Button>
					</Link>
				</div>

				<div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6">
					<h3 className="text-lg font-semibold text-white mb-4">
						Reportes y Estadísticas
					</h3>
					<p className="text-gray-300 text-sm mb-4">
						Ver reportes de ventas y ocupación
					</p>
					<Button variant="primary" size="sm" className="w-full">
						Ver Reportes
					</Button>
				</div>

				<div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6">
					<h3 className="text-lg font-semibold text-white mb-4">
						Productos y Snacks
					</h3>
					<p className="text-gray-300 text-sm mb-4">
						Gestionar productos del kiosco
					</p>
					<Button variant="primary" size="sm" className="w-full">
						Gestionar Productos
					</Button>
				</div>

				<div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6">
					<h3 className="text-lg font-semibold text-white mb-4">
						Códigos de Descuento
					</h3>
					<p className="text-gray-300 text-sm mb-4">
						Crear y gestionar códigos promocionales
					</p>
					<Button variant="primary" size="sm" className="w-full">
						Gestionar Descuentos
					</Button>
				</div>

				<div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6">
					<h3 className="text-lg font-semibold text-white mb-4">
						Configuración
					</h3>
					<p className="text-gray-300 text-sm mb-4">
						Configuraciones generales del sistema
					</p>
					<Button variant="primary" size="sm" className="w-full">
						Configurar
					</Button>
				</div>
			</div>
		</div >
	)
} 