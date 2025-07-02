import { z } from 'zod'

export const signInSchema = z.object({
	email: z
		.string()
		.min(1, 'El email es requerido')
		.email('Email inválido'),
	password: z
		.string()
		.min(6, 'La contraseña debe tener al menos 6 caracteres'),
})

export const signUpSchema = z.object({
	name: z
		.string()
		.min(2, 'El nombre debe tener al menos 2 caracteres')
		.optional(),
	email: z
		.string()
		.min(1, 'El email es requerido')
		.email('Email inválido'),
	password: z
		.string()
		.min(6, 'La contraseña debe tener al menos 6 caracteres'),
	confirmPassword: z
		.string()
		.min(1, 'Confirma tu contraseña'),
}).refine((data) => data.password === data.confirmPassword, {
	message: 'Las contraseñas no coinciden',
	path: ['confirmPassword'],
})

export const membershipSchema = z.object({
	membershipId: z.string().min(1, 'Debes seleccionar una membresía'),
})

export type SignInFormData = z.infer<typeof signInSchema>
export type SignUpFormData = z.infer<typeof signUpSchema>
export type MembershipFormData = z.infer<typeof membershipSchema> 
