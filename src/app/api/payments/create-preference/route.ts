import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { 
	createPaymentPreference, 
	convertCartItemsToMPItems, 
	calculateOrderTotals,
	generateExternalReference,
	MPPreferenceData 
} from '@/lib/mercado-pago'
import { CartItem } from '@/types/cart'

export async function POST(request: NextRequest) {
	try {
		const session = await getServerSession(authOptions)
		
		if (!session?.user?.email) {
			return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
		}

		const body = await request.json()
		
		// Manejar tanto el formato nuevo (items) como el actual (orderId)
		let items: CartItem[] = []
		let discountCode: string | undefined
		
		if (body.items) {
			// Formato nuevo: items del carrito global
			items = body.items
			discountCode = body.discountCode
		} else if (body.orderId) {
			// Formato actual: orden existente - mantenemos compatibilidad
			const existingOrder = await prisma.order.findUnique({
				where: { 
					id: body.orderId,
					userId: session.user.id 
				},
				include: {
					items: {
						include: {
							product: true
						}
					}
				}
			})
			
			if (!existingOrder) {
				return NextResponse.json({ error: 'Orden no encontrada' }, { status: 404 })
			}
			
			// Convertir OrderItems a CartItems
			items = existingOrder.items.map(item => ({
				id: `product-${item.product.id}`,
				type: 'product' as const,
				product: item.product,
				quantity: item.quantity,
				unitPrice: item.price,
				totalPrice: item.price * item.quantity,
				addedAt: existingOrder.createdAt
			}))
		} else {
			return NextResponse.json({ error: 'Datos inválidos: se requiere items o orderId' }, { status: 400 })
		}

		if (!items || items.length === 0) {
			return NextResponse.json({ error: 'No hay items en el carrito' }, { status: 400 })
		}

		// Obtener información del usuario
		const user = await prisma.user.findUnique({
			where: { id: session.user.id },
			include: {
				membership: true
			}
		})

		if (!user) {
			return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })
		}

		// Calcular descuento por membresía
		const membershipDiscount = user.membership?.name === 'Oro' ? 15 : 
			user.membership?.name === 'Plata' ? 10 : 
			user.membership?.name === 'Bronce' ? 5 : 0

		// Validar y aplicar código de descuento adicional si existe
		let additionalDiscount = 0
		if (discountCode) {
			const discount = await prisma.discount.findUnique({
				where: { 
					code: discountCode
				}
			})
			
			if (discount) {
				// Verificar si es aplicable a la membresía del usuario
				if (!discount.membershipTierId || discount.membershipTierId === user.membershipId) {
					additionalDiscount = discount.percentage
				}
			}
		}

		const totalDiscount = membershipDiscount + additionalDiscount
		const totals = calculateOrderTotals(items, totalDiscount)

		// Separar productos y asientos
		const productItems = items.filter(item => item.type === 'product')
		const seatItems = items.filter(item => item.type === 'seat')
		
		if (items.length === 0) {
			return NextResponse.json({ error: 'No hay items en el carrito' }, { status: 400 })
		}

		// Crear orden en la base de datos
		const order = await prisma.order.create({
			data: {
				userId: user.id,
				status: 'pending',
				totalAmount: totals.total,
				items: {
					create: productItems.map(item => ({
						product: {
							connect: { id: item.product.id }
						},
						quantity: item.quantity,
						price: item.unitPrice
					}))
				}
			},
			include: {
				items: {
					include: {
						product: true
					}
				}
			}
		})

		// TODO: Crear reservaciones para los asientos cuando se implemente

		// Convertir TODOS los items a formato MercadoPago
		const mpItems = convertCartItemsToMPItems(items)

		// Determine base URL for callbacks
		const baseUrl = process.env.NEXTAUTH_URL || request.headers.get('origin') || 'http://localhost:3000'

		// Crear preferencia de MercadoPago
		const preferenceData: MPPreferenceData = {
			items: mpItems,
			payer: {
				name: user.name?.split(' ')[0] || 'Usuario',
				surname: user.name?.split(' ').slice(1).join(' ') || 'Puff&Chill',
				email: user.email,
			},
			back_urls: {
				success: `${baseUrl}/checkout/success?order_id=${order.id}`,
				failure: `${baseUrl}/checkout/failure?order_id=${order.id}`,
				pending: `${baseUrl}/checkout/pending?order_id=${order.id}`
			},
			auto_return: 'approved',
			notification_url: `${baseUrl}/api/payments/webhook`,
			statement_descriptor: 'PUFF&CHILL',
			external_reference: generateExternalReference(user.id),
			expires: true,
			expiration_date_from: new Date().toISOString(),
			expiration_date_to: new Date(Date.now() + 30 * 60 * 1000).toISOString()
		}

		const preference = await createPaymentPreference(preferenceData)

		// Crear registro de pago
		await prisma.payment.create({
			data: {
				orderId: order.id,
				amount: totals.total,
				status: 'pending',
				provider: 'MercadoPago',
				providerRef: preference.id
			}
		})

		return NextResponse.json({
			preferenceId: preference.id,
			orderId: order.id,
			initPoint: preference.init_point,
			sandboxInitPoint: preference.sandbox_init_point
		})

	} catch (error) {
		console.error('Error creando preferencia de pago:', error)
		return NextResponse.json(
			{ error: 'Error interno del servidor' }, 
			{ status: 500 }
		)
	}
} 