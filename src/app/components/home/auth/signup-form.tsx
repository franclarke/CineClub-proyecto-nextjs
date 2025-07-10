'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { signIn } from 'next-auth/react'
import { MembershipTier } from '@prisma/client'

import { FormField } from '../../ui/form-field'
import { Button } from '../../ui/button'
import { MembershipSelector } from './membership-selector'
import { type SignUpFormData, signUpSchema } from '@/lib/validations/auth'
import { signUpAction } from '@/lib/actions/auth'

interface SignUpFormProps {
	memberships: MembershipTier[]
}

export function SignUpForm({ memberships }: SignUpFormProps) {
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState<string>('')
	const [selectedMembership, setSelectedMembership] = useState<string>('')
	const [membershipError, setMembershipError] = useState<string>('')
	const [currentStep, setCurrentStep] = useState(1)
	const [discountCode, setDiscountCode] = useState('')
	const [isValidatingDiscount, setIsValidatingDiscount] = useState(false)
	const [appliedDiscount, setAppliedDiscount] = useState<{ percentage: number; description: string } | null>(null)
	const [discountError, setDiscountError] = useState('')

	const {
		register,
		handleSubmit,
		formState: { errors },
		trigger,
	} = useForm<SignUpFormData>({
		resolver: zodResolver(signUpSchema),
	})

	const nextStep = async () => {
		const isValid = await trigger(['name', 'email', 'password', 'confirmPassword'])
		if (isValid) setCurrentStep(2)
	}

	const prevStep = () => setCurrentStep(1)

	const validateDiscountCode = async () => {
		if (!discountCode.trim()) {
			setAppliedDiscount(null)
			setDiscountError('')
			return
		}

		setIsValidatingDiscount(true)
		setDiscountError('')

		try {
			const response = await fetch('/api/discounts/validate', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ 
					code: discountCode.toUpperCase(),
					membershipId: selectedMembership || null
				})
			})

			if (!response.ok) {
				const data = await response.json()
				setDiscountError(data.error || 'Código de descuento inválido')
				setAppliedDiscount(null)
				return
			}

			const { discount } = await response.json()
			setAppliedDiscount({
				percentage: discount.percentage,
				description: discount.description
			})
			setDiscountError('')
		} catch (error) {
			setDiscountError('Error al validar el código de descuento')
			setAppliedDiscount(null)
		} finally {
			setIsValidatingDiscount(false)
		}
	}

	const getSelectedMembershipPrice = () => {
		const membership = memberships.find(m => m.id === selectedMembership)
		if (!membership) return { originalPrice: 0, discountAmount: 0, finalPrice: 0 }
		
		const originalPrice = membership.price
		const discountAmount = appliedDiscount ? originalPrice * (appliedDiscount.percentage / 100) : 0
		const finalPrice = originalPrice - discountAmount

		return { originalPrice, discountAmount, finalPrice }
	}

	const onSubmit = async (data: SignUpFormData) => {
		setIsLoading(true)
		setError('')
		setMembershipError('')

		// Validar que se haya seleccionado una membresía
		if (!selectedMembership) {
			setMembershipError('Debes seleccionar una membresía')
			setIsLoading(false)
			return
		}

		try {
			// Verificar si el precio final es 0
			const { finalPrice } = getSelectedMembershipPrice()
			
			if (finalPrice === 0) {
				// Si el precio es 0, crear el usuario directamente sin MercadoPago
				const directSignupResponse = await fetch('/api/memberships/signup-payment', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						userData: data,
						membershipId: selectedMembership,
						discountCode: appliedDiscount ? discountCode : null,
						skipPayment: true // Flag para indicar que se salte el pago
					}),
				})

				if (!directSignupResponse.ok) {
					const errorData = await directSignupResponse.json()
					setError(errorData.error || 'Error al crear la cuenta')
					return
				}

				const signupData = await directSignupResponse.json()
				
				// Redirigir a la página de éxito con auto-login
				window.location.href = `/memberships/signup/success?user_id=${signupData.userId}&auto_login=true`
				
			} else {
				// Si el precio es mayor a 0, proceder con MercadoPago
				const paymentResponse = await fetch('/api/memberships/signup-payment', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						userData: data,
						membershipId: selectedMembership,
						discountCode: appliedDiscount ? discountCode : null
					}),
				})

				if (!paymentResponse.ok) {
					const errorData = await paymentResponse.json()
					setError(errorData.error || 'Error al procesar el pago')
					return
				}

				const paymentData = await paymentResponse.json()

				// Redirigir a MercadoPago
				if (paymentData.initPoint) {
					// En desarrollo usar sandbox, en producción usar initPoint normal
					const redirectUrl = process.env.NODE_ENV === 'development' 
						? paymentData.sandboxInitPoint 
						: paymentData.initPoint

					window.location.href = redirectUrl
				} else {
					setError('Error al generar el enlace de pago')
				}
			}

		} catch (error) {
			console.error('Error en signup:', error)
			setError('Error al procesar el registro')
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<div className="w-full">
			{/* Progress Indicator */}
			<div className="mb-6 md:mb-8">
				<div className="flex items-center justify-center space-x-2 md:space-x-4">
					<div className={`flex items-center space-x-1 md:space-x-2 ${currentStep === 1 ? 'text-orange-400' : currentStep > 1 ? 'text-green-400' : 'text-gray-500'}`}>
						<div className={`w-6 h-6 md:w-8 md:h-8 rounded-full border-2 flex items-center justify-center ${currentStep === 1 ? 'border-orange-400 bg-orange-400/20' : currentStep > 1 ? 'border-green-400 bg-green-400/20' : 'border-gray-500'}`}>
							{currentStep > 1 ? (
								<svg className="w-3 h-3 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 20 20">
									<path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
								</svg>
							) : (
								<span className="text-xs md:text-sm font-bold">1</span>
							)}
						</div>
						<span className="text-xs md:text-sm font-medium hidden sm:inline">Información Personal</span>
						<span className="text-xs font-medium sm:hidden">Datos</span>
					</div>
					
					<div className={`w-4 md:w-8 h-0.5 ${currentStep > 1 ? 'bg-green-400' : 'bg-gray-500'}`} />
					
					<div className={`flex items-center space-x-1 md:space-x-2 ${currentStep === 2 ? 'text-orange-400' : 'text-gray-500'}`}>
						<div className={`w-6 h-6 md:w-8 md:h-8 rounded-full border-2 flex items-center justify-center ${currentStep === 2 ? 'border-orange-400 bg-orange-400/20' : 'border-gray-500'}`}>
							<span className="text-xs md:text-sm font-bold">2</span>
						</div>
						<span className="text-xs md:text-sm font-medium hidden sm:inline">Membresía</span>
						<span className="text-xs font-medium sm:hidden">Plan</span>
					</div>
				</div>
			</div>

			<form onSubmit={handleSubmit(onSubmit)} className="space-y-6 md:space-y-8">
				{/* Step 1: Personal Information */}
				{currentStep === 1 && (
					<div className="space-y-4 md:space-y-6">
						<div className="text-center mb-6 md:mb-8">
							<h3 className="text-xl md:text-2xl font-semibold text-white mb-2">
								Crear tu cuenta
							</h3>
							<p className="text-gray-400 text-sm md:text-base">
								Ingresa tus datos para comenzar tu experiencia cinematográfica
							</p>
						</div>

						<div className="space-y-4 md:space-y-5">
							<FormField<SignUpFormData>
								label="Nombre completo"
								name="name"
								placeholder="Ej: Juan Pérez"
								register={register}
								error={errors.name?.message}
								className="bg-white/5 border-white/10 text-white placeholder-gray-400 focus:border-orange-400 focus:ring-orange-400/20"
								icon={
									<svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
									</svg>
								}
							/>

							<FormField<SignUpFormData>
								label="Email"
								name="email"
								type="email"
								placeholder="tu@email.com"
								register={register}
								error={errors.email?.message}
								required
								className="bg-white/5 border-white/10 text-white placeholder-gray-400 focus:border-orange-400 focus:ring-orange-400/20"
								icon={
									<svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
									</svg>
								}
							/>

							<div className="grid grid-cols-1 gap-4">
								<FormField<SignUpFormData>
									label="Contraseña"
									name="password"
									type="password"
									placeholder="••••••••"
									register={register}
									error={errors.password?.message}
									required
									className="bg-white/5 border-white/10 text-white placeholder-gray-400 focus:border-orange-400 focus:ring-orange-400/20"
									icon={
										<svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
										</svg>
									}
								/>

								<FormField<SignUpFormData>
									label="Confirmar contraseña"
									name="confirmPassword"
									type="password"
									placeholder="••••••••"
									register={register}
									error={errors.confirmPassword?.message}
									required
									className="bg-white/5 border-white/10 text-white placeholder-gray-400 focus:border-orange-400 focus:ring-orange-400/20"
									icon={
										<svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
										</svg>
									}
								/>
							</div>
						</div>

						<Button
							type="button"
							onClick={nextStep}
							className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold py-3 px-6 rounded-lg shadow-xl hover:shadow-2xl transition-all duration-200 transform hover:scale-[1.02]"
							size="lg"
						>
							Continuar
						</Button>
					</div>
				)}

				{/* Step 2: Membership Selection */}
				{currentStep === 2 && (
					<div className="space-y-4 md:space-y-6">
						<div className="text-center mb-6 md:mb-8">
							<h3 className="text-xl md:text-2xl font-semibold text-white mb-2">
								Elige tu membresía
							</h3>
							<p className="text-gray-400 mb-4 text-sm md:text-base">
								Selecciona el plan que mejor se adapte a tu estilo de vida cinematográfico
							</p>
						</div>

						<MembershipSelector
							memberships={memberships}
							selectedId={selectedMembership}
							onSelect={(membershipId) => {
								setSelectedMembership(membershipId)
								// Revalidar código de descuento si está aplicado
								if (appliedDiscount && discountCode) {
									setTimeout(validateDiscountCode, 100)
								}
							}}
							error={membershipError}
						/>

						{/* Discount Code Section */}
						<div className="space-y-4">
							<div className="bg-white/5 rounded-lg p-4 border border-white/10">
								<h4 className="text-white font-medium mb-3 flex items-center">
									<svg className="w-5 h-5 mr-2 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.99 1.99 0 013 12V7a4 4 0 014-4z" />
									</svg>
									¿Tienes un código de descuento?
								</h4>
								
								{appliedDiscount ? (
									<div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
										<div className="flex items-center justify-between">
											<div className="flex items-center space-x-2">
												<svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
													<path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
												</svg>
												<span className="text-green-300 font-medium">
													{discountCode} - {appliedDiscount.percentage}% de descuento aplicado
												</span>
											</div>
											<button
												type="button"
												onClick={() => {
													setAppliedDiscount(null)
													setDiscountCode('')
													setDiscountError('')
												}}
												className="text-green-400/80 hover:text-green-400 text-sm underline"
											>
												Quitar
											</button>
										</div>
									</div>
								) : (
									<div className="space-y-3">
										<div className="flex space-x-2">
											<input
												type="text"
												value={discountCode}
												onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
												onBlur={validateDiscountCode}
												placeholder="Ej: FREE"
												className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:border-orange-400 focus:ring-orange-400/20 focus:outline-none"
												disabled={isValidatingDiscount}
											/>
											<Button
												type="button"
												onClick={validateDiscountCode}
												disabled={isValidatingDiscount || !discountCode.trim()}
												className="px-4 py-2 bg-orange-500/20 text-orange-400 border border-orange-500/30 rounded-lg hover:bg-orange-500/30 transition-colors duration-200 disabled:opacity-50"
											>
												{isValidatingDiscount ? (
													<div className="w-5 h-5 border-2 border-orange-400/30 border-t-orange-400 rounded-full animate-spin"></div>
												) : (
													'Aplicar'
												)}
											</Button>
										</div>
										
										{discountError && (
											<p className="text-sm text-red-400">{discountError}</p>
										)}
									</div>
								)}
							</div>

							{/* Price Summary */}
							{selectedMembership && (
								<div className="bg-white/5 rounded-lg p-4 border border-white/10">
									<h4 className="text-white font-medium mb-3">Resumen de precios</h4>
									<div className="space-y-2">
										<div className="flex justify-between items-center">
											<span className="text-gray-400">Precio original:</span>
											<span className={`${appliedDiscount ? 'text-gray-400 line-through' : 'text-white font-medium'}`}>
												${getSelectedMembershipPrice().originalPrice.toLocaleString('es-AR')}
											</span>
										</div>
										
										{appliedDiscount && (
											<>
												<div className="flex justify-between items-center">
													<span className="text-green-400">Descuento ({appliedDiscount.percentage}%):</span>
													<span className="text-green-400">
														-${getSelectedMembershipPrice().discountAmount.toLocaleString('es-AR')}
													</span>
												</div>
												<div className="border-t border-white/10 pt-2">
													<div className="flex justify-between items-center">
														<span className="text-white font-medium">Total a pagar:</span>
														<span className="text-white font-bold text-lg">
															${getSelectedMembershipPrice().finalPrice.toLocaleString('es-AR')}
														</span>
													</div>
												</div>
											</>
										)}
									</div>
								</div>
							)}
						</div>

						{/* Error Display */}
						{error && (
							<div className="relative">
								<div className="absolute inset-0 bg-red-500/20 rounded-lg blur-sm"></div>
								<div className="relative p-4 rounded-lg bg-red-500/10 border border-red-500/30 backdrop-blur-sm">
									<div className="flex items-center space-x-2">
										<svg className="w-5 h-5 text-red-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
											<path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
										</svg>
										<p className="text-sm text-red-300 font-medium">{error}</p>
									</div>
								</div>
							</div>
						)}

						{/* Navigation Buttons */}
						<div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
							<Button
								type="button"
								onClick={prevStep}
								className="flex-1 bg-white/10 hover:bg-white/20 text-white border border-white/20 py-3 px-6 rounded-lg transition-all duration-200 order-2 sm:order-1"
								size="lg"
							>
								<svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
								</svg>
								Atrás
							</Button>

							<Button
								type="submit"
								loading={isLoading}
								className="flex-1 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold py-3 px-6 rounded-lg shadow-xl hover:shadow-2xl transition-all duration-200 transform hover:scale-[1.02] order-1 sm:order-2"
								size="lg"
							>
								{isLoading ? (
									<div className="flex items-center justify-center space-x-2">
										<div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
										<span>Procesando...</span>
									</div>
								) : (
									<>
										<span className="hidden sm:inline">Continuar al pago</span>
										<span className="sm:hidden">Pagar</span>
										<svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
										</svg>
									</>
								)}
							</Button>
						</div>
					</div>
				)}
			</form>
		</div>
	)
} 
