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

		const { name } = await request.json()

		if (!name?.trim()) {
			return NextResponse.json({ error: 'El nombre es requerido' }, { status: 400 })
		}

		const updatedUser = await prisma.user.update({
			where: { email: session.user.email },
			data: { name: name.trim() },
			select: {
				id: true,
				name: true,
				email: true
			}
		})

		return NextResponse.json({ 
			message: 'Perfil actualizado exitosamente',
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
