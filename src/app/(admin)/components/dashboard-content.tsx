"use client"

import { Button } from "@/app/components/ui/button"
import { useAuth } from "@/app/hooks/use-auth"
import Link from "next/link"
import { useState, useEffect } from "react"
import { Bell, Send } from "lucide-react"


export function DashboardContent() {
	const { isLoading } = useAuth()
	const [notification, setNotification] = useState({
		title: '',
		body: ''
	})
	const [sending, setSending] = useState(false)
	const [success, setSuccess] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [cleaning, setCleaning] = useState(false)
	const [cleanSuccess, setCleanSuccess] = useState(false)
	const [needsCleanup, setNeedsCleanup] = useState(false)
	const [checkingConfig, setCheckingConfig] = useState(true)
	


	// Verificar si necesitamos mostrar la advertencia de limpieza
	useEffect(() => {
		const checkSubscriptionsStatus = async () => {
			try {
				// Verificar si hay suscripciones y si las claves VAPID están configuradas
				const response = await fetch('/api/push/test')
				if (response.ok) {
					const data = await response.json()
					// Solo mostrar advertencia si hay suscripciones pero las claves VAPID no están configuradas correctamente
					setNeedsCleanup(data.config.activeSubscriptions > 0 && !data.config.vapidConfigured)
				}
			} catch (error) {
				console.error('Error verificando estado de suscripciones:', error)
			} finally {
				setCheckingConfig(false)
			}
		}
		checkSubscriptionsStatus()
	}, [cleanSuccess]) // Re-verificar después de limpiar

	if (isLoading) {
		return (
			<div className="flex justify-center items-center py-12">
				<div className="w-8 h-8 border-2 border-sunset-orange border-t-transparent rounded-full animate-spin" />
			</div>
		)
	}

	const handleSendNotification = async (e: React.FormEvent) => {
		e.preventDefault()
		
		if (!notification.title.trim() || !notification.body.trim()) {
			setError('Por favor completa todos los campos')
			return
		}

		setSending(true)
		setError(null)

		try {
			const response = await fetch('/api/push/send', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					title: notification.title,
					body: notification.body
				})
			})

			const data = await response.json()
			
			if (response.ok) {
				setSuccess(true)
				setNotification({ title: '', body: '' })
				setTimeout(() => setSuccess(false), 3000)
				
				// Mostrar información detallada del envío
				if (data.details) {
					console.log(`Notificaciones enviadas: ${data.details.success}/${data.details.total}`)
				}
			} else {
				setError(data.error || data.message || 'Error al enviar la notificación')
			}
		} catch (err) {
			setError('Error de conexión al enviar la notificación')
		} finally {
			setSending(false)
		}
	}

	const handleCleanSubscriptions = async () => {
		setCleaning(true)
		setError(null)

		try {
			const response = await fetch('/api/push/cleanup', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				}
			})

			const data = await response.json()
			
			if (response.ok) {
				setCleanSuccess(true)
				setNeedsCleanup(false) // Resetear el estado de advertencia
				setTimeout(() => setCleanSuccess(false), 3000)
				console.log(`Suscripciones eliminadas: ${data.details.deleted}`)
			} else {
				setError(data.error || 'Error al limpiar suscripciones')
			}
		} catch (err) {
			setError('Error de conexión al limpiar suscripciones')
		} finally {
			setCleaning(false)
		}
	}



	return (
		<div className="max-w-6xl mx-auto pt-28 px-6">
			{/* Header */}
			<div className="text-center mb-8">
				<h1 className="text-display text-4xl md:text-5xl text-soft-beige mb-4">
					Panel de Administración
				</h1>
				<p className="text-soft-beige/70 text-lg">
					Gestiona todos los aspectos del CineClub Puff & Chill
				</p>
			</div>

			{/* Grid de funcionalidades */}
			<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-12">
				<div className="card-modern p-6 hover-lift">
					<div className="flex items-center mb-4">
						<div className="w-12 h-12 bg-sunset-orange/20 rounded-lg flex items-center justify-center mr-4">
							<svg className="w-6 h-6 text-sunset-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
							</svg>
						</div>
						<h3 className="text-lg font-semibold text-soft-beige">
							Gestión de Eventos
						</h3>
					</div>
					<p className="text-soft-beige/70 text-sm mb-4">
						Crear, editar y eliminar eventos de cine
					</p>
					<Link href="/manage-events" className="block">
						<Button variant="primary" size="sm" className="w-full">
							Gestionar Eventos
						</Button>
					</Link>
				</div>

				<div className="card-modern p-6 hover-lift">
					<div className="flex items-center mb-4">
						<div className="w-12 h-12 bg-sunset-orange/20 rounded-lg flex items-center justify-center mr-4">
							<svg className="w-6 h-6 text-sunset-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
							</svg>
						</div>
						<h3 className="text-lg font-semibold text-soft-beige">
							Usuarios y Membresías
						</h3>
					</div>
					<p className="text-soft-beige/70 text-sm mb-4">
						Administrar usuarios y tipos de membresía
					</p>
					<Link href="/manage-users" className="block">
						<Button variant="primary" size="sm" className="w-full">
							Gestionar Usuarios
						</Button>
					</Link>
				</div>

				<div className="card-modern p-6 hover-lift">
					<div className="flex items-center mb-4">
						<div className="w-12 h-12 bg-sunset-orange/20 rounded-lg flex items-center justify-center mr-4">
							<svg className="w-6 h-6 text-sunset-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
							</svg>
						</div>
						<h3 className="text-lg font-semibold text-soft-beige">
							Productos y Snacks
						</h3>
					</div>
					<p className="text-soft-beige/70 text-sm mb-4">
						Gestionar productos del kiosco
					</p>
					<Link href="/manage-products" className="block">
						<Button variant="primary" size="sm" className="w-full">
							Gestionar Productos
						</Button>
					</Link>
				</div>
			</div>

			{/* Push Notifications Section */}
			<div className="card-modern p-6">
				<div className="flex items-center mb-6">
					<div className="w-12 h-12 bg-sunset-orange/20 rounded-lg flex items-center justify-center mr-4">
						<Bell className="w-6 h-6 text-sunset-orange" />
					</div>
					<div>
						<h3 className="text-lg font-semibold text-soft-beige">
							Enviar Notificación Push
						</h3>
						<p className="text-soft-beige/70 text-sm">
							Envía notificaciones a todos los usuarios suscritos
						</p>
					</div>
				</div>

				{/* Success/Error Messages */}
				{success && (
					<div className="mb-4 p-4 bg-dark-olive/20 border border-dark-olive/30 rounded-xl">
						<div className="flex items-center gap-2 text-dark-olive">
							<svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
							</svg>
							<span className="font-medium">Notificación enviada correctamente</span>
						</div>
					</div>
				)}

				{error && (
					<div className="mb-4 p-4 bg-warm-red/20 border border-warm-red/30 rounded-xl">
						<div className="flex items-center gap-2 text-warm-red">
							<svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
							</svg>
							<span className="font-medium">{error}</span>
						</div>
					</div>
				)}

				{/* Clean Success Message */}
				{cleanSuccess && (
					<div className="mb-4 p-4 bg-blue-500/20 border border-blue-500/30 rounded-xl">
						<div className="flex items-center gap-2 text-blue-400">
							<svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
							</svg>
							<span className="font-medium">Suscripciones eliminadas correctamente</span>
						</div>
					</div>
				)}



				{/* Cleanup Section - Solo mostrar si hay problemas */}
				{needsCleanup && !checkingConfig && (
					<div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
						<h4 className="text-sm font-medium text-yellow-400 mb-2">
							⚠️ Problema detectado con suscripciones VAPID
						</h4>
						<p className="text-xs text-yellow-300 mb-3">
							Las suscripciones existentes fueron creadas con claves VAPID incorrectas. 
							Debe limpiarlas para que las notificaciones funcionen correctamente.
						</p>
						<Button 
							onClick={handleCleanSubscriptions}
							disabled={cleaning}
							loading={cleaning}
							variant="outline"
							size="sm"
							className="border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10"
						>
							{cleaning ? 'Limpiando...' : 'Limpiar Suscripciones Inválidas'}
						</Button>
					</div>
				)}

				<form onSubmit={handleSendNotification} className="space-y-4">
					<div>
						<label htmlFor="title" className="block text-soft-beige/70 font-medium mb-2">
							Título de la notificación
						</label>
						<input
							id="title"
							type="text"
							value={notification.title}
							onChange={(e) => setNotification(prev => ({ ...prev, title: e.target.value }))}
							placeholder="Ej: ¡Nueva película disponible!"
							className="w-full px-4 py-3 rounded-xl bg-soft-gray/10 text-soft-beige border border-soft-gray/20 focus:outline-none focus:ring-2 focus:ring-sunset-orange focus:border-transparent transition-base placeholder:text-soft-beige/50"
							maxLength={50}
							required
						/>
						<div className="text-xs text-soft-beige/50 mt-1">
							{notification.title.length}/50 caracteres
						</div>
					</div>

					<div>
						<label htmlFor="body" className="block text-soft-beige/70 font-medium mb-2">
							Mensaje
						</label>
						<textarea
							id="body"
							value={notification.body}
							onChange={(e) => setNotification(prev => ({ ...prev, body: e.target.value }))}
							placeholder="Escribe el mensaje de la notificación..."
							rows={4}
							className="w-full px-4 py-3 rounded-xl bg-soft-gray/10 text-soft-beige border border-soft-gray/20 focus:outline-none focus:ring-2 focus:ring-sunset-orange focus:border-transparent transition-base placeholder:text-soft-beige/50 resize-none"
							maxLength={120}
							required
						/>
						<div className="text-xs text-soft-beige/50 mt-1">
							{notification.body.length}/120 caracteres
						</div>
					</div>



					<div className="flex justify-end">
						<Button 
							type="submit" 
							disabled={sending || !notification.title.trim() || !notification.body.trim()}
							loading={sending}
							className="flex items-center gap-2"
						>
							{sending ? (
								<>Enviando...</>
							) : (
								<>
									<Send className="w-4 h-4" />
									Enviar Notificación
								</>
							)}
						</Button>
					</div>
				</form>
			</div>
		</div>
	)
} 
