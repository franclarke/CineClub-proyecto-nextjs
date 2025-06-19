import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const removeFromCartSchema = z.object({
	productId: z.string()
})

export async function DELETE(request: NextRequest) {
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
		const { productId } = removeFromCartSchema.parse(body)

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

		// Buscar y eliminar item del carrito
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

		await prisma.orderItem.delete({
			where: { id: orderItem.id }
		})

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
		console.error('Error removing from cart:', error)
		return NextResponse.json(
			{ error: 'Error interno del servidor' }, 
			{ status: 500 }
		)
	}
} 