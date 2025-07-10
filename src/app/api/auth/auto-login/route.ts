import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'

export async function POST(request: NextRequest) {
	try {
		const { orderId, email, userId, directLogin } = await request.json()

		// Flujo directo para signup gratuito
		if (directLogin && userId) {
			// Buscar el usuario por ID
			const user = await prisma.user.findUnique({
				where: { id: userId },
				include: {
					membership: true
				}
			})

			if (!user) {
				return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })
			}

			// Verificar que el usuario sea reciente (último día)
			const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
			if (user.createdAt < oneDayAgo) {
				return NextResponse.json({ error: 'Usuario expirado para auto-login' }, { status: 400 })
			}

			// Generar token JWT temporal para auto-login
			const token = jwt.sign(
				{
					userId: user.id,
					email: user.email,
					type: 'auto-login-direct'
				},
				process.env.NEXTAUTH_SECRET!,
				{ expiresIn: '5m' }
			)

			return NextResponse.json({
				token: token,
				user: {
					id: user.id,
					email: user.email,
					name: user.name,
					membership: user.membership
				}
			})
		}

		// Flujo original con orden
		if (!orderId || !email) {
			return NextResponse.json({ error: 'Datos requeridos' }, { status: 400 })
		}

		// Buscar la orden
		const order = await prisma.order.findUnique({
			where: { id: orderId },
			include: {
				user: true
			}
		})

		if (!order) {
			return NextResponse.json({ error: 'Orden no encontrada' }, { status: 404 })
		}

		// Verificar que la orden sea de tipo signup
		if (order.type !== 'signup') {
			return NextResponse.json({ error: 'Tipo de orden inválido' }, { status: 400 })
		}

		// Verificar que la orden esté completada
		if (order.status !== 'completed') {
			return NextResponse.json({ error: 'Orden no completada' }, { status: 400 })
		}

		// Verificar que el email coincida
		if (!order.user || order.user.email !== email) {
			return NextResponse.json({ error: 'Email no coincide' }, { status: 400 })
		}

		// Verificar que la orden sea reciente (último día)
		const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
		if (order.createdAt < oneDayAgo) {
			return NextResponse.json({ error: 'Orden expirada para auto-login' }, { status: 400 })
		}

		// Generar token JWT temporal para auto-login
		const token = jwt.sign(
			{
				userId: order.user.id,
				email: order.user.email,
				orderId: orderId,
				type: 'auto-login'
			},
			process.env.NEXTAUTH_SECRET!,
			{ expiresIn: '5m' }
		)

		return NextResponse.json({
			token: token,
			user: {
				id: order.user.id,
				email: order.user.email,
				name: order.user.name
			}
		})

	} catch (error) {
		console.error('Error en auto-login:', error)
		return NextResponse.json(
			{ error: 'Error interno del servidor' },
			{ status: 500 }
		)
	}
} 