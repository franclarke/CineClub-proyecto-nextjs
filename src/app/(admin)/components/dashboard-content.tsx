"use client"

import { Button } from "@/app/components/ui/button"
import { useAuth } from "@/app/hooks/use-auth"
import Link from "next/link"


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
		<div className="max-w-6xl mx-auto pt-28">
			{/* Grid de funcionalidades */}
			<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
				<div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6">
					<h3 className="text-lg font-semibold text-white mb-4">
						Gestión de Eventos
					</h3>
					<p className="text-gray-300 text-sm mb-4">
						Crear, editar y eliminar eventos de cine
					</p>
					<Link href="/manage-events">
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
					<Link href="/manage-users">
						<Button variant="primary" size="sm" className="w-full">
							Gestionar Usuarios
						</Button>
					</Link>
				</div>

				<div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6">
					<h3 className="text-lg font-semibold text-white mb-4">
						Productos y Snacks
					</h3>
					<p className="text-gray-300 text-sm mb-4">
						Gestionar productos del kiosco
					</p>
					<Link href="/manage-products">
						<Button variant="primary" size="sm" className="w-full">
							Gestionar Productos
						</Button>
					</Link>
				</div>

			</div>
		</div >
	)
} 