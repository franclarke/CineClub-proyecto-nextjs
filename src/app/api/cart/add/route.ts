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

		if (!productId || !quantity || quantity < 1) {
			return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 })
		}

		// Verificar que el producto existe y tiene stock
		const product = await prisma.product.findUnique({
			where: { id: productId }
		})

		if (!product) {
			return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 })
		}

		if (product.stock < quantity) {
			return NextResponse.json({ error: 'Stock insuficiente' }, { status: 400 })
		}

		// Obtener el usuario
		const user = await prisma.user.findUnique({
			where: { email: session.user.email }
		})

		if (!user) {
			return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })
		}

		// Buscar o crear una orden en estado 'cart'
		let order = await prisma.order.findFirst({
			where: {
				userId: user.id,
				status: 'cart'
			},
			include: {
				items: true
			}
		})

		if (!order) {
			order = await prisma.order.create({
				data: {
					userId: user.id,
					status: 'cart',
					totalAmount: 0
				},
				include: {
					items: true
				}
			})
		}

		// Verificar si el producto ya está en el carrito
		const existingItem = await prisma.orderItem.findFirst({
			where: {
				orderId: order.id,
				productId: productId
			}
		})

		if (existingItem) {
			// Actualizar cantidad
			await prisma.orderItem.update({
				where: { id: existingItem.id },
				data: {
					quantity: existingItem.quantity + quantity,
					price: product.price
				}
			})
		} else {
			// Crear nuevo item
			await prisma.orderItem.create({
				data: {
					orderId: order.id,
					productId: productId,
					quantity: quantity,
					price: product.price
				}
			})
		}

		// Actualizar el total de la orden
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
		console.error('Error adding to cart:', error)
		return NextResponse.json(
			{ error: 'Error interno del servidor' }, 
			{ status: 500 }
		)
	}
} 