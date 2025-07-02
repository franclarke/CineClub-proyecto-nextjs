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

		const { productId, quantity } = await request.json()

		if (!productId || quantity === undefined || quantity < 0) {
			return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 })
		}

		// Obtener el usuario
		const user = await prisma.user.findUnique({
			where: { email: session.user.email }
		})

		if (!user) {
			return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })
		}

		// Buscar orden en estado 'cart'
		const order = await prisma.order.findFirst({
			where: {
				userId: user.id,
				status: 'cart'
			}
		})

		if (!order) {
			return NextResponse.json({ error: 'No hay carrito activo' }, { status: 404 })
		}

		// Buscar item en el carrito
		const orderItem = await prisma.orderItem.findFirst({
			where: {
				orderId: order.id,
				productId: productId
			}
		})

		if (!orderItem) {
			return NextResponse.json({ error: 'Producto no encontrado en el carrito' }, { status: 404 })
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
				return NextResponse.json({ error: 'Stock insuficiente' }, { status: 400 })
			}

			// Actualizar cantidad
			await prisma.orderItem.update({
				where: { id: orderItem.id },
				data: { 
					quantity: quantity,
					price: product.price
				}
			})
		}

		// Recalcular total de la orden
		const orderItems = await prisma.orderItem.findMany({
			where: { orderId: order.id }
		})

		const totalAmount = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)

		await prisma.order.update({
			where: { id: order.id },
			data: { totalAmount }
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
