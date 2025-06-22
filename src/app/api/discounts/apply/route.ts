import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
	try {
		const session = await getServerSession(authOptions)
		
		if (!session?.user?.email) {
			return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
		}

		const { code } = await request.json()

		if (!code || typeof code !== 'string') {
			return NextResponse.json({ error: 'Código de descuento requerido' }, { status: 400 })
		}

		// Buscar el código de descuento
		const discount = await prisma.discount.findUnique({
			where: { 
				code: code.toUpperCase()
			},
			include: {
				membershipTier: true
			}
		})

		if (!discount) {
			return NextResponse.json({ error: 'Código de descuento inválido' }, { status: 404 })
		}

		// Verificar si el descuento está activo
		const now = new Date()
		if (discount.validFrom && discount.validFrom > now) {
			return NextResponse.json({ error: 'Este código de descuento aún no está activo' }, { status: 400 })
		}

		if (discount.validUntil && discount.validUntil < now) {
			return NextResponse.json({ error: 'Este código de descuento ha expirado' }, { status: 400 })
		}

		// Obtener información del usuario
		const user = await prisma.user.findUnique({
			where: { email: session.user.email },
			include: {
				membership: true
			}
		})

		if (!user) {
			return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })
		}

		// Verificar si el descuento es aplicable a la membresía del usuario
		if (discount.membershipTierId && discount.membershipTierId !== user.membershipId) {
			return NextResponse.json({ 
				error: `Este código es exclusivo para miembros ${discount.membershipTier?.name}` 
			}, { status: 400 })
		}

		// Retornar información del descuento
		return NextResponse.json({
			discount: {
				id: discount.id,
				code: discount.code,
				percentage: discount.percentage,
				description: discount.description || `${discount.percentage}% de descuento`
			}
		})

	} catch (error) {
		console.error('Error applying discount:', error)
		return NextResponse.json(
			{ error: 'Error interno del servidor' }, 
			{ status: 500 }
		)
	}
} 