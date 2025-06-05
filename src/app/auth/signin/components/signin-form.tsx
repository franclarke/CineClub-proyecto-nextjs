'use client'

import { useState } from 'react'
import { signIn, getSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { signInSchema, type SignInFormData } from '../../../../../lib/validations/auth'
import { FormField } from '../../../components/ui/form-field'
import { Button } from '../../../components/ui/button'

export function SignInForm() {
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState<string>('')
	const router = useRouter()

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<SignInFormData>({
		resolver: zodResolver(signInSchema),
	})

	const onSubmit = async (data: SignInFormData) => {
		setIsLoading(true)
		setError('')

		try {
			const result = await signIn('credentials', {
				email: data.email,
				password: data.password,
				redirect: false,
			})

			if (result?.error) {
				setError('Credenciales inválidas')
				return
			}

			// Obtener sesión para verificar el rol
			const session = await getSession()
			
			if (session?.user?.isAdmin) {
				router.push('/dashboard')
			} else {
				router.push('/events')
			}
		} catch {
			setError('Error al iniciar sesión')
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
			{/* Welcome Message */}
			<div className="text-center mb-8">
				<h3 className="text-xl font-semibold text-white mb-2">
					Bienvenido de vuelta
				</h3>
				<p className="text-gray-400 text-sm">
					Inicia sesión para acceder a tu cuenta
				</p>
			</div>

			{/* Form Fields */}
			<div className="space-y-5">
				<div className="group">
					<FormField<SignInFormData>
						label="Email"
						name="email"
						type="email"
						placeholder="tu@email.com"
						register={register}
						error={errors.email?.message}
						required
						className="bg-white/5 border-white/10 text-white placeholder-gray-400 focus:border-orange-400 focus:ring-orange-400/20"
					/>
				</div>

				<div className="group">
					<FormField<SignInFormData>
						label="Contraseña"
						name="password"
						type="password"
						placeholder="••••••••"
						register={register}
						error={errors.password?.message}
						required
						className="bg-white/5 border-white/10 text-white placeholder-gray-400 focus:border-orange-400 focus:ring-orange-400/20"
					/>
				</div>
			</div>

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

			{/* Submit Button */}
			<div className="space-y-4">
				<Button
					type="submit"
					loading={isLoading}
					className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold py-3 px-6 rounded-lg shadow-xl hover:shadow-2xl transition-all duration-200 transform hover:scale-[1.02]"
					size="lg"
				>
					{isLoading ? (
						<div className="flex items-center justify-center space-x-2">
							<div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
							<span>Iniciando sesión...</span>
						</div>
					) : (
						'Iniciar Sesión'
					)}
				</Button>
			</div>
		</form>
	)

}