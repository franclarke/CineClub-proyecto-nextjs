'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { signIn } from 'next-auth/react'
import { MembershipTier } from '@prisma/client'

import { signUpSchema, type SignUpFormData } from '../../../../lib/validations/auth'
import { signUpAction } from '../../../../lib/actions/auth'
import { FormField } from '../ui/form-field'
import { Button } from '../ui/button'
import { MembershipSelector } from './membership-selector'

interface SignUpFormProps {
	memberships: MembershipTier[]
}

export function SignUpForm({ memberships }: SignUpFormProps) {
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState<string>('')
	const [selectedMembership, setSelectedMembership] = useState<string>('')
	const [membershipError, setMembershipError] = useState<string>('')
	const [currentStep, setCurrentStep] = useState(1)
	const router = useRouter()

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
			const result = await signUpAction({
				...data,
				membershipId: selectedMembership,
			})

			if (!result.success) {
				setError(result.error || 'Error al crear la cuenta')
				return
			}

			// Iniciar sesión automáticamente después del registro
			const signInResult = await signIn('credentials', {
				email: data.email,
				password: data.password,
				redirect: false,
			})

			if (signInResult?.error) {
				setError('Cuenta creada pero error al iniciar sesión')
				return
			}

			// Redirigir a eventos (el flujo de pago se implementará más adelante)
			router.push('/events')
		} catch {
			setError('Error al crear la cuenta')
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<div className="w-full">
			{/* Progress Indicator */}
			<div className="mb-8">
				<div className="flex items-center justify-center space-x-4">
					<div className={`flex items-center space-x-2 ${currentStep === 1 ? 'text-orange-400' : currentStep > 1 ? 'text-green-400' : 'text-gray-500'}`}>
						<div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${currentStep === 1 ? 'border-orange-400 bg-orange-400/20' : currentStep > 1 ? 'border-green-400 bg-green-400/20' : 'border-gray-500'}`}>
							{currentStep > 1 ? (
								<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
									<path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
								</svg>
							) : (
								<span className="text-sm font-bold">1</span>
							)}
						</div>
						<span className="text-sm font-medium">Información Personal</span>
					</div>
					
					<div className={`w-8 h-0.5 ${currentStep > 1 ? 'bg-green-400' : 'bg-gray-500'}`} />
					
					<div className={`flex items-center space-x-2 ${currentStep === 2 ? 'text-orange-400' : 'text-gray-500'}`}>
						<div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${currentStep === 2 ? 'border-orange-400 bg-orange-400/20' : 'border-gray-500'}`}>
							<span className="text-sm font-bold">2</span>
						</div>
						<span className="text-sm font-medium">Membresía</span>
					</div>
				</div>
			</div>

			<form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
				{/* Step 1: Personal Information */}
				{currentStep === 1 && (
					<div className="space-y-6">
						<div className="text-center mb-8">
							<h3 className="text-2xl font-semibold text-white mb-2">
								Crear tu cuenta
							</h3>
							<p className="text-gray-400">
								Ingresa tus datos para comenzar tu experiencia cinematográfica
							</p>
						</div>

						<div className="space-y-5">
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

							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
					<div className="space-y-6">
						<div className="text-center mb-8">
							<h3 className="text-2xl font-semibold text-white mb-2">
								Elige tu membresía
							</h3>
							<p className="text-gray-400">
								Selecciona el plan que mejor se adapte a tu estilo de vida cinematográfico
							</p>
						</div>

						<MembershipSelector
							memberships={memberships}
							selectedId={selectedMembership}
							onSelect={setSelectedMembership}
							error={membershipError}
						/>

						{/* Error Display */}
						{error && (
							<div className="relative">
								<div className="absolute inset-0 bg-red-500/20 rounded-lg blur-sm"></div>
								<div className="relative p-4 rounded-lg bg-red-500/10 border border-red-500/30 backdrop-blur-sm">
									<div className="flex items-center space-x-2">
										<svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
											<path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
										</svg>
										<p className="text-sm text-red-300 font-medium">{error}</p>
									</div>
								</div>
							</div>
						)}

						{/* Navigation Buttons */}
						<div className="flex space-x-4">
							<Button
								type="button"
								onClick={prevStep}
								className="flex-1 bg-white/10 hover:bg-white/20 text-white border border-white/20 py-3 px-6 rounded-lg transition-all duration-200"
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
								className="flex-1 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold py-3 px-6 rounded-lg shadow-xl hover:shadow-2xl transition-all duration-200 transform hover:scale-[1.02]"
								size="lg"
							>
								{isLoading ? (
									<div className="flex items-center justify-center space-x-2">
										<div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
										<span>Creando cuenta...</span>
									</div>
								) : (
									<>
										Crear cuenta
										<svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
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