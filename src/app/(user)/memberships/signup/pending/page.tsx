'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/app/components/ui/button'
import { useRouter } from 'next/navigation'

export default function SignupPendingPage() {
	const searchParams = useSearchParams()
	const router = useRouter()
	const [isLoading, setIsLoading] = useState(true)
	const [orderData, setOrderData] = useState<any>(null)
	const [error, setError] = useState<string>('')
	const [checkCount, setCheckCount] = useState(0)

	const orderId = searchParams.get('order_id')
	const maxChecks = 20 // Máximo 20 checks (10 minutos)

	useEffect(() => {
		const fetchOrderData = async () => {
			if (!orderId) {
				setError('ID de orden no encontrado')
				setIsLoading(false)
				return
			}

			try {
				const response = await fetch(`/api/orders/${orderId}`)
				if (!response.ok) {
					throw new Error('Error al obtener datos de la orden')
				}

				const data = await response.json()
				setOrderData(data)

				// Si el pago está completado, redirigir a success
				if (data.status === 'completed') {
					router.push(`/memberships/signup/success?order_id=${orderId}`)
					return
				}

				// Si el pago falló, redirigir a failure
				if (data.status === 'cancelled' || data.status === 'failed') {
					router.push(`/memberships/signup/failure?order_id=${orderId}`)
					return
				}

			} catch (error) {
				console.error('Error fetching order data:', error)
				setError('Error al obtener información de la orden')
			} finally {
				setIsLoading(false)
			}
		}

		fetchOrderData()
	}, [orderId, router])

	// Verificar estado del pago cada 30 segundos
	useEffect(() => {
		if (!orderId || checkCount >= maxChecks) return

		const interval = setInterval(async () => {
			try {
				const response = await fetch(`/api/orders/${orderId}`)
				if (response.ok) {
					const data = await response.json()
					
					if (data.status === 'completed') {
						router.push(`/memberships/signup/success?order_id=${orderId}`)
						return
					}
					
					if (data.status === 'cancelled' || data.status === 'failed') {
						router.push(`/memberships/signup/failure?order_id=${orderId}`)
						return
					}
				}
			} catch (error) {
				console.error('Error checking order status:', error)
			}

			setCheckCount(prev => prev + 1)
		}, 30000) // Cada 30 segundos

		return () => clearInterval(interval)
	}, [orderId, router, checkCount, maxChecks])

	const handleGoHome = () => {
		router.push('/')
	}

	const handleCheckManually = () => {
		window.location.reload()
	}

	if (isLoading) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
				<div className="text-center">
					<div className="w-16 h-16 border-4 border-orange-400/30 border-t-orange-400 rounded-full animate-spin mx-auto mb-4"></div>
					<p className="text-white text-lg">Cargando información...</p>
				</div>
			</div>
		)
	}

	if (error) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
				<div className="max-w-md w-full text-center">
					<div className="bg-red-500/10 border border-red-500/30 rounded-lg p-6 mb-6">
						<svg className="w-16 h-16 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
						</svg>
						<h2 className="text-xl font-semibold text-red-300 mb-2">Error</h2>
						<p className="text-red-200">{error}</p>
					</div>
					<Button
						onClick={handleGoHome}
						className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg transition-colors"
					>
						Volver al inicio
					</Button>
				</div>
			</div>
		)
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
			<div className="max-w-md w-full">
				{/* Pending Animation */}
				<div className="text-center mb-8">
					<div className="w-24 h-24 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
						<svg className="w-12 h-12 text-yellow-400 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
						</svg>
					</div>
					<h1 className="text-3xl font-bold text-white mb-2">Procesando pago...</h1>
					<p className="text-gray-300">Tu pago está siendo verificado</p>
				</div>

				{/* Processing Info */}
				<div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-6 mb-6">
					<h3 className="text-yellow-300 font-semibold mb-3 flex items-center">
						<svg className="w-5 h-5 mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
						</svg>
						¿Qué está pasando?
					</h3>
					<ul className="text-yellow-200 space-y-2 text-sm">
						<li>• Estamos verificando tu pago con MercadoPago</li>
						<li>• Este proceso puede tomar unos minutos</li>
						<li>• Te redirigiremos automáticamente una vez confirmado</li>
						<li>• No cierres esta ventana hasta que se complete</li>
					</ul>
				</div>

				{/* Order Info (if available) */}
				{orderData && orderData.metadata && (
					<div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 mb-6 border border-white/10">
						<h3 className="text-white font-semibold mb-3">Información de tu orden</h3>
						<div className="space-y-2 text-sm">
							<div className="flex justify-between">
								<span className="text-gray-400">Email:</span>
								<span className="text-white">{orderData.metadata.userData?.email}</span>
							</div>
							<div className="flex justify-between">
								<span className="text-gray-400">Membresía:</span>
								<span className="text-orange-400">{orderData.metadata.membershipName}</span>
							</div>
							<div className="flex justify-between">
								<span className="text-gray-400">Monto:</span>
								<span className="text-white">${orderData.totalAmount?.toLocaleString('es-AR')}</span>
							</div>
						</div>
					</div>
				)}

				{/* Progress Indicator */}
				<div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 mb-6 border border-white/10">
					<div className="flex items-center justify-between mb-2">
						<span className="text-gray-400 text-sm">Progreso de verificación</span>
						<span className="text-gray-400 text-sm">{checkCount}/{maxChecks}</span>
					</div>
					<div className="w-full bg-gray-700 rounded-full h-2">
						<div 
							className="bg-gradient-to-r from-orange-500 to-amber-500 h-2 rounded-full transition-all duration-500"
							style={{ width: `${(checkCount / maxChecks) * 100}%` }}
						></div>
					</div>
				</div>

				{/* Action Buttons */}
				<div className="space-y-4">
					<Button
						onClick={handleCheckManually}
						className="w-full bg-orange-500/20 text-orange-400 border border-orange-500/30 py-3 px-6 rounded-lg hover:bg-orange-500/30 transition-all duration-200"
					>
						<svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
						</svg>
						Verificar ahora
					</Button>

					{checkCount >= maxChecks && (
						<Button
							onClick={handleGoHome}
							className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/20 py-3 px-6 rounded-lg transition-all duration-200"
						>
							<svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
							</svg>
							Volver al inicio
						</Button>
					)}
				</div>

				{/* Support Info */}
				<div className="text-center mt-6">
					<p className="text-gray-400 text-sm mb-2">¿El pago está tardando mucho?</p>
					<p className="text-gray-300 text-sm">
						Contáctanos en{' '}
						<a href="mailto:support@puffandchill.com" className="text-orange-400 hover:text-orange-300 underline">
							support@puffandchill.com
						</a>
					</p>
				</div>
			</div>
		</div>
	)
} 