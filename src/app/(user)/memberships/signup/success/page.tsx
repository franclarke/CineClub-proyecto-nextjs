'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { Button } from '@/app/components/ui/button'
import { useRouter } from 'next/navigation'

interface SignupSuccessData {
	orderId: string
	userName: string
	userEmail: string
	membershipName: string
	finalPrice: number
	discountApplied: boolean
}

export default function SignupSuccessPage() {
	const searchParams = useSearchParams()
	const router = useRouter()
	const [isLoading, setIsLoading] = useState(true)
	const [successData, setSuccessData] = useState<SignupSuccessData | null>(null)
	const [error, setError] = useState<string>('')
	const [isSigningIn, setIsSigningIn] = useState(false)

	const orderId = searchParams.get('order_id')
	const userId = searchParams.get('user_id')
	const autoLogin = searchParams.get('auto_login') === 'true'

	useEffect(() => {
		const fetchOrderData = async () => {
			// Si tenemos userId y autoLogin, usar el flujo directo (sin pago)
			if (userId && autoLogin) {
				try {
					const response = await fetch(`/api/auth/auto-login`, {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify({
							userId: userId,
							directLogin: true
						})
					})

					if (!response.ok) {
						throw new Error('Error en auto-login')
					}

					const { token, user } = await response.json()

					// Establecer datos de éxito
					setSuccessData({
						orderId: 'free_signup',
						userName: user.name,
						userEmail: user.email,
						membershipName: user.membership.name,
						finalPrice: 0,
						discountApplied: true
					})

					// Auto-login automático
					setTimeout(async () => {
						setIsSigningIn(true)
						try {
							const signInResult = await signIn('credentials', {
								email: user.email,
								autoLoginToken: token,
								redirect: false,
							})

							if (signInResult?.error) {
								throw new Error('Error al iniciar sesión')
							}

							// Redirigir al dashboard
							router.push('/')
						} catch (error) {
							console.error('Error en auto-login:', error)
							setError('Usuario creado exitosamente. Por favor, inicia sesión manualmente.')
						} finally {
							setIsSigningIn(false)
						}
					}, 2000) // Esperar 2 segundos para mostrar el mensaje de éxito

				} catch (error) {
					console.error('Error en flujo directo:', error)
					setError('Error al procesar el registro')
				} finally {
					setIsLoading(false)
				}
				return
			}

			// Flujo normal con orden de pago
			if (!orderId) {
				setError('ID de orden no encontrado')
				setIsLoading(false)
				return
			}

			try {
				// Buscar datos de la orden
				const response = await fetch(`/api/orders/${orderId}`)
				if (!response.ok) {
					throw new Error('Error al obtener datos de la orden')
				}

				const orderData = await response.json()

				// Verificar que la orden sea de tipo signup y esté completada
				if (orderData.type !== 'signup') {
					setError('Tipo de orden inválido')
					setIsLoading(false)
					return
				}

				if (orderData.status !== 'completed') {
					setError('El pago aún no ha sido confirmado. Por favor, espera unos momentos.')
					setIsLoading(false)
					return
				}

				// Extraer datos del metadata
				const metadata = orderData.metadata
				setSuccessData({
					orderId: orderData.id,
					userName: metadata.userData.name,
					userEmail: metadata.userData.email,
					membershipName: metadata.membershipName,
					finalPrice: orderData.totalAmount,
					discountApplied: metadata.discountPercentage > 0
				})

			} catch (error) {
				console.error('Error fetching order data:', error)
				setError('Error al obtener información de la orden')
			} finally {
				setIsLoading(false)
			}
		}

		fetchOrderData()
	}, [orderId])

	const handleAutoLogin = async () => {
		if (!successData) return

		setIsSigningIn(true)

		try {
			// Obtener token para auto-login
			const response = await fetch('/api/auth/auto-login', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					orderId: successData.orderId,
					email: successData.userEmail
				})
			})

			if (!response.ok) {
				throw new Error('Error en auto-login')
			}

			const { token } = await response.json()

			// Usar el token para hacer login
			const signInResult = await signIn('credentials', {
				email: successData.userEmail,
				autoLoginToken: token,
				redirect: false,
			})

			if (signInResult?.error) {
				throw new Error('Error al iniciar sesión')
			}

			// Redirigir al dashboard
			router.push('/')

		} catch (error) {
			console.error('Error en auto-login:', error)
			setError('Usuario creado exitosamente. Por favor, inicia sesión manualmente.')
		} finally {
			setIsSigningIn(false)
		}
	}

	if (isLoading) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
				<div className="text-center">
					<div className="w-16 h-16 border-4 border-orange-400/30 border-t-orange-400 rounded-full animate-spin mx-auto mb-4"></div>
					<p className="text-white text-lg">Verificando tu pago...</p>
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
						onClick={() => router.push('/')}
						className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg transition-colors"
					>
						Volver al inicio
					</Button>
				</div>
			</div>
		)
	}

	if (!successData) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
				<div className="text-center">
					<p className="text-white text-lg">No se encontraron datos de la orden</p>
				</div>
			</div>
		)
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
			<div className="max-w-md w-full">
				{/* Success Animation */}
				<div className="text-center mb-8">
					<div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
						<svg className="w-12 h-12 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
						</svg>
					</div>
					<h1 className="text-3xl font-bold text-white mb-2">¡Bienvenido a Puff & Chill!</h1>
					<p className="text-gray-300">Tu cuenta ha sido creada exitosamente</p>
				</div>

				{/* Success Details */}
				<div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 mb-6 border border-white/10">
					<div className="space-y-4">
						<div className="flex justify-between items-center">
							<span className="text-gray-400">Nombre:</span>
							<span className="text-white font-medium">{successData.userName}</span>
						</div>
						<div className="flex justify-between items-center">
							<span className="text-gray-400">Email:</span>
							<span className="text-white font-medium">{successData.userEmail}</span>
						</div>
						<div className="flex justify-between items-center">
							<span className="text-gray-400">Membresía:</span>
							<span className="text-orange-400 font-medium">{successData.membershipName}</span>
						</div>
						<div className="flex justify-between items-center">
							<span className="text-gray-400">Precio pagado:</span>
							<span className={`${successData.finalPrice === 0 ? 'text-green-400' : 'text-green-400'} font-medium`}>
								{successData.finalPrice === 0 ? (
									<span className="flex items-center">
										<svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
										</svg>
										¡GRATIS!
									</span>
								) : (
									<>
										${successData.finalPrice.toLocaleString('es-AR')}
										{successData.discountApplied && (
											<span className="text-xs text-green-300 ml-1">(con descuento)</span>
										)}
									</>
								)}
							</span>
						</div>
					</div>
				</div>

				{/* Special Message for Free Signup */}
				{successData.finalPrice === 0 && (
					<div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl p-6 mb-6 border border-green-500/20">
						<div className="flex items-center mb-3">
							<svg className="w-6 h-6 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
							</svg>
							<h3 className="text-white font-semibold">¡Registro completamente gratuito!</h3>
						</div>
						<p className="text-green-200 text-sm">
							¡Felicitaciones! Tu membresía ha sido activada sin costo alguno. Ya puedes disfrutar de todos los beneficios de Puff & Chill.
						</p>
					</div>
				)}

				{/* Benefits */}
				<div className="bg-gradient-to-r from-orange-500/10 to-amber-500/10 rounded-xl p-6 mb-6 border border-orange-500/20">
					<h3 className="text-white font-semibold mb-3 flex items-center">
						<svg className="w-5 h-5 mr-2 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
						</svg>
						¡Ya puedes disfrutar de todos los beneficios!
					</h3>
					<ul className="text-gray-300 space-y-1 text-sm">
						<li>• Reserva de asientos para eventos</li>
						<li>• Acceso a productos exclusivos</li>
						<li>• Descuentos en compras</li>
						<li>• Prioridad en lanzamientos</li>
					</ul>
				</div>

				{/* Auto Login Button */}
				<Button
					onClick={handleAutoLogin}
					disabled={isSigningIn || (successData.finalPrice === 0 && autoLogin)}
					className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold py-3 px-6 rounded-lg shadow-xl hover:shadow-2xl transition-all duration-200 transform hover:scale-[1.02] mb-4"
				>
					{isSigningIn ? (
						<div className="flex items-center justify-center space-x-2">
							<div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
							<span>
								{successData.finalPrice === 0 && autoLogin
									? 'Redirigiendo automáticamente...'
									: 'Iniciando sesión...'
								}
							</span>
						</div>
					) : (
						<>
							<span>
								{successData.finalPrice === 0 && autoLogin
									? 'Redirigiendo en unos segundos...'
									: 'Iniciar sesión y continuar'
								}
							</span>
							<svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
							</svg>
						</>
					)}
				</Button>

				{/* Manual Login Option */}
				<div className="text-center">
					<p className="text-gray-400 text-sm mb-2">¿Prefieres iniciar sesión manualmente?</p>
					<Button
						onClick={() => router.push('/')}
						className="text-orange-400 hover:text-orange-300 underline bg-transparent hover:bg-transparent p-0 h-auto"
					>
						Ir al inicio de sesión
					</Button>
				</div>
			</div>
		</div>
	)
} 