import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const updateCartSchema = z.object({
	productId: z.string(),
	quantity: z.number().int().min(0)
})

export async function PATCH(request: NextRequest) {
	try {
		const session = await getServerSession(authOptions)
		
		if (!session?.user?.email) {
			return NextResponse.json(
				{ error: 'No autorizado' }, 
				{ status: 401 }
			)
		}

		const user = await prisma.user.findUnique({
			where: { email: session.user.email }
		})

		if (!user) {
			return NextResponse.json(
				{ error: 'Usuario no encontrado' }, 
				{ status: 404 }
			)
		}

		const body = await request.json()
		const { productId, quantity } = updateCartSchema.parse(body)

		// Buscar orden pendiente
		const order = await prisma.order.findFirst({
			where: {
				userId: user.id,
				status: 'PENDING'
			}
		})

		if (!order) {
			return NextResponse.json(
				{ error: 'No hay carrito activo' }, 
				{ status: 404 }
			)
		}

		// Buscar item en el carrito
		const orderItem = await prisma.orderItem.findFirst({
			where: {
				orderId: order.id,
				productId: productId
			}
		})

		if (!orderItem) {
			return NextResponse.json(
				{ error: 'Producto no encontrado en el carrito' }, 
				{ status: 404 }
			)
		}

		if (quantity === 0) {
			// Eliminar item del carrito
			await prisma.orderItem.delete({
				where: { id: orderItem.id }
			})
		} else {
			// Verificar stock disponible
			const product = await prisma.product.findUnique({
				where: { id: productId }
			})

			if (!product || product.stock < quantity) {
				return NextResponse.json(
					{ error: 'Stock insuficiente' }, 
					{ status: 400 }
				)
			}

			// Actualizar cantidad
			await prisma.orderItem.update({
				where: { id: orderItem.id },
				data: { quantity }
			})
		}

		// Recalcular total de la orden
		const orderItems = await prisma.orderItem.findMany({
			where: { orderId: order.id },
			include: { product: true }
		})

		const total = orderItems.reduce((acc, item) => 
			acc + (item.product.price * item.quantity), 0
		)

		await prisma.order.update({
			where: { id: order.id },
			data: { total }
		})

		return NextResponse.json({ success: true })

	} catch (error) {
		console.error('Error updating cart:', error)
		return NextResponse.json(
			{ error: 'Error interno del servidor' }, 
			{ status: 500 }
		)
	}
} 