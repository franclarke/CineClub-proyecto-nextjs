'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/app/components/ui/button'
import { useRouter } from 'next/navigation'

export default function SignupFailurePage() {
	const searchParams = useSearchParams()
	const router = useRouter()
	const [isLoading, setIsLoading] = useState(true)
	const [orderData, setOrderData] = useState<any>(null)
	const [error, setError] = useState<string>('')

	const orderId = searchParams.get('order_id')

	useEffect(() => {
		const fetchOrderData = async () => {
			if (!orderId) {
				setError('ID de orden no encontrado')
				setIsLoading(false)
				return
			}

			try {
				// Buscar datos de la orden para mostrar información
				const response = await fetch(`/api/orders/${orderId}`)
				if (!response.ok) {
					throw new Error('Error al obtener datos de la orden')
				}

				const data = await response.json()
				setOrderData(data)

			} catch (error) {
				console.error('Error fetching order data:', error)
				setError('Error al obtener información de la orden')
			} finally {
				setIsLoading(false)
			}
		}

		fetchOrderData()
	}, [orderId])

	const handleRetry = () => {
		// Redirigir al formulario de signup
		router.push('/')
	}

	const handleGoHome = () => {
		router.push('/')
	}

	if (isLoading) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
				<div className="text-center">
					<div className="w-16 h-16 border-4 border-orange-400/30 border-t-orange-400 rounded-full animate-spin mx-auto mb-4"></div>
					<p className="text-white text-lg">Verificando información...</p>
				</div>
			</div>
		)
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
			<div className="max-w-md w-full">
				{/* Error Animation */}
				<div className="text-center mb-8">
					<div className="w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
						<svg className="w-12 h-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
						</svg>
					</div>
					<h1 className="text-3xl font-bold text-white mb-2">Pago no procesado</h1>
					<p className="text-gray-300">El pago no pudo ser completado</p>
				</div>

				{/* Error Details */}
				<div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 mb-6">
					<h3 className="text-red-300 font-semibold mb-3 flex items-center">
						<svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
						</svg>
						¿Qué pasó?
					</h3>
					<ul className="text-red-200 space-y-2 text-sm">
						<li>• El pago fue rechazado por el sistema</li>
						<li>• Cancelaste la transacción</li>
						<li>• Hubo un problema con tu método de pago</li>
						<li>• Se agotó el tiempo límite para completar el pago</li>
					</ul>
				</div>

				{/* Order Info (if available) */}
				{orderData && orderData.metadata && (
					<div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 mb-6 border border-white/10">
						<h3 className="text-white font-semibold mb-3">Información de la orden</h3>
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

				{/* What to do next */}
				<div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6 mb-6">
					<h3 className="text-blue-300 font-semibold mb-3 flex items-center">
						<svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
						</svg>
						¿Qué puedo hacer?
					</h3>
					<ul className="text-blue-200 space-y-2 text-sm">
						<li>• Verificar que tu tarjeta tenga fondos suficientes</li>
						<li>• Asegurarte de que los datos sean correctos</li>
						<li>• Intentar con otro método de pago</li>
						<li>• Contactar a tu banco si el problema persiste</li>
					</ul>
				</div>

				{/* Action Buttons */}
				<div className="space-y-4">
					<Button
						onClick={handleRetry}
						className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold py-3 px-6 rounded-lg shadow-xl hover:shadow-2xl transition-all duration-200 transform hover:scale-[1.02]"
					>
						<svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
						</svg>
						Intentar nuevamente
					</Button>

					<Button
						onClick={handleGoHome}
						className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/20 py-3 px-6 rounded-lg transition-all duration-200"
					>
						<svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
						</svg>
						Volver al inicio
					</Button>
				</div>

				{/* Support Info */}
				<div className="text-center mt-6">
					<p className="text-gray-400 text-sm mb-2">¿Necesitas ayuda?</p>
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