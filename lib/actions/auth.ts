import { redirect } from 'next/navigation'
import bcrypt from 'bcryptjs'
import { prisma } from '../prisma'
import { signUpSchema, type SignUpFormData } from '../validations/auth'
import { z } from 'zod'

export async function signUpAction(data: SignUpFormData & { membershipId: string }) {
	try {
		// Validar datos
		const validatedData = signUpSchema.parse(data)

		// Verificar si el usuario ya existe
		const existingUser = await prisma.user.findUnique({
			where: { email: validatedData.email },
		})

		if (existingUser) {
			return {
				success: false,
				error: 'El usuario ya existe con este email',
			}
		}

		// Verificar si la membresía existe
		const membership = await prisma.membershipTier.findUnique({
			where: { id: data.membershipId },
		})

		if (!membership) {
			return {
				success: false,
				error: 'Membresía inválida',
			}
		}

		// Hash de la contraseña
		const hashedPassword = await bcrypt.hash(validatedData.password, 12)

		// Crear usuario
		const user = await prisma.user.create({
			data: {
				email: validatedData.email,
				password: hashedPassword,
				name: validatedData.name,
				membershipId: data.membershipId,
			},
		})

		return {
			success: true,
			user: {
				id: user.id,
				email: user.email,
				name: user.name,
			},
		}
	} catch (error) {
		if (error instanceof z.ZodError) {
			return {
				success: false,
				error: 'Datos inválidos',
				fieldErrors: error.flatten().fieldErrors,
			}
		}

		return {
			success: false,
			error: 'Error interno del servidor',
		}
	}
}

export async function getMembershipTiers() {
	try {
		const tiers = await prisma.membershipTier.findMany({
			orderBy: { priority: 'asc' },
		})

		return tiers
	} catch (error) {
		console.error('Error fetching membership tiers:', error)
		return []
	}
}

export async function redirectToDashboard() {
	redirect('/')
}

export async function redirectToEvents() {
	redirect('/events')
} 