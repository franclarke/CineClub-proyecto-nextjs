'use client'

import { useState } from 'react'
import type { MembershipTier } from '@prisma/client'

import { SignInForm } from './signin-form'
import { SignUpForm } from './signup-form'

interface AuthFormProps {
  memberships: MembershipTier[]
}

export function AuthForm({ memberships }: AuthFormProps) {
	const [formType, setFormType] = useState<'login' | 'register'>('login')

	const switchToRegister = () => setFormType('register')
	const switchToLogin = () => setFormType('login')

	return (
		<div className="w-full max-w-md p-8 space-y-8 bg-black/30 backdrop-blur-lg rounded-2xl shadow-2xl">
			{formType === 'login' ? (
				<>
					<SignInForm />
					<div className="text-center">
						<button
							onClick={switchToRegister}
							className="text-sm text-gray-300 hover:text-orange-400 transition-colors duration-200"
						>
							¿No tienes cuenta? ¡Crea una aquí!
						</button>
					</div>
				</>
			) : (
				<>
					<SignUpForm memberships={memberships} />
					<div className="text-center">
						<button
							onClick={switchToLogin}
							className="text-sm text-gray-300 hover:text-orange-400 transition-colors duration-200"
						>
							¿Ya tienes una cuenta? Inicia sesión
						</button>
					</div>
				</>
			)}
		</div>
	)
} 
