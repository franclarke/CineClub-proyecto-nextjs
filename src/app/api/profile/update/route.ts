import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PATCH(request: NextRequest) {
	try {
		const session = await getServerSession(authOptions)
		
		if (!session?.user?.email) {
			return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
		}

		const body = await request.json()
		const { name, phone, birthDate, location } = body

		// Validar que al menos un campo esté presente
		if (!name && !phone && !birthDate && !location) {
			return NextResponse.json({ error: 'Al menos un campo debe ser enviado' }, { status: 400 })
		}

		// Preparar objeto de actualización solo con campos definidos
		const updateData: { name?: string; phone?: string; birthDate?: string; location?: string } = {}
		if (name !== undefined) updateData.name = name
		if (phone !== undefined) updateData.phone = phone
		if (birthDate !== undefined) updateData.birthDate = birthDate
		if (location !== undefined) updateData.location = location

		// Actualizar usuario
		const updatedUser = await prisma.user.update({
			where: { email: session.user.email },
			data: updateData,
			select: {
				id: true,
				name: true,
				email: true,
				phone: true,
				birthDate: true,
				location: true,
				updatedAt: true
			}
		})

		return NextResponse.json({ 
			success: true,
			user: updatedUser
		})

	} catch (error) {
		console.error('Error updating profile:', error)
		return NextResponse.json(
			{ error: 'Error interno del servidor' }, 
			{ status: 500 }
		)
	}
} 
