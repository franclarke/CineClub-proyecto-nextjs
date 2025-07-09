import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { CartItem } from '@/types/cart'

// Definir tipos localmente para evitar problemas de importación
interface MPItem {
	id: string
	title: string
	description?: string
	quantity: number
	unit_price: number
	currency_id?: string
}

interface MPPreferenceData {
	items: MPItem[]
	payer?: {
		name?: string
		surname?: string
		email?: string
	}
	back_urls?: {
		success?: string
		failure?: string
		pending?: string
	}
	auto_return?: 'approved'
	notification_url?: string
	statement_descriptor?: string
	external_reference?: string
}

// Función para convertir items del carrito a formato MercadoPago
function convertCartItemsToMPItems(items: CartItem[]): MPItem[] {
	return items.map((item) => {
		if (item.type === 'product') {
			return {
				id: item.product.id,
				title: item.product.name,
				description: item.product.description || `Producto: ${item.product.name}`,
				quantity: item.quantity,
				unit_price: item.unitPrice,
				currency_id: 'ARS'
			}
		} else {
			return {
				id: item.seat.id,
				title: `${item.event.title} - Asiento ${item.seatNumber}`,
				description: `Entrada para ${item.event.title} - Tier ${item.tier} - Asiento ${item.seatNumber}`,
				quantity: 1,
				unit_price: item.unitPrice,
				currency_id: 'ARS'
			}
		}
	})
}

// Función para calcular totales
function calculateOrderTotals(items: CartItem[], discountPercentage: number = 0) {
	const subtotal = items.reduce((acc, item) => acc + item.totalPrice, 0)
	const discountAmount = subtotal * (discountPercentage / 100)
	const total = subtotal - discountAmount

	return {
		subtotal: Number(subtotal.toFixed(2)),
		discountAmount: Number(discountAmount.toFixed(2)),
		total: Number(total.toFixed(2)),
		discountPercentage
	}
}

// Función para crear preferencia de MercadoPago
async function createMPPreference(data: MPPreferenceData) {
	try {
		const { MercadoPagoConfig, Preference } = await import('mercadopago')
		
		const accessToken = process.env.NODE_ENV === 'production'
			? process.env.MP_ACCESS_TOKEN
			: process.env.MP_TEST_ACCESS_TOKEN

		if (!accessToken) {
			throw new Error('MercadoPago access token not configured')
		}

		const client = new MercadoPagoConfig({
			accessToken: accessToken,
		})

		const preference = new Preference(client)

		const response = await preference.create({
			body: {
				items: data.items,
				payer: data.payer,
				back_urls: data.back_urls,
				auto_return: data.auto_return,
				notification_url: data.notification_url,
				statement_descriptor: data.statement_descriptor,
				external_reference: data.external_reference
			}
		})

		return response
	} catch (error) {
		console.error('Error creating MercadoPago preference:', error)
		throw error
	}
}

export async function POST(request: NextRequest) {
	try {
		console.log('=== Create Preference API Called ===')
		
		// Paso 1: Verificar sesión
		const session = await getServerSession(authOptions)
		if (!session?.user?.email) {
			console.log('No autorizado - Sin sesión')
			return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
		}

		console.log('✓ Usuario autenticado:', session.user.email)

		// Paso 2: Parsear body
		let body
		try {
			body = await request.json()
			console.log('✓ Body parseado correctamente')
		} catch (error) {
			console.error('Error parseando body:', error)
			return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
		}

		// Paso 3: Validar datos
		let items: CartItem[] = []
		let discountCode: string | undefined

		if (body.items && Array.isArray(body.items)) {
			items = body.items
			discountCode = body.discountCode
			console.log('✓ Items recibidos:', items.length)
		} else {
			return NextResponse.json({ error: 'Items requeridos' }, { status: 400 })
		}

		if (items.length === 0) {
			return NextResponse.json({ error: 'No hay items en el carrito' }, { status: 400 })
		}

		// Paso 4: Obtener usuario
		let user
		try {
			user = await prisma.user.findUnique({
				where: { id: session.user.id },
				include: {
					membership: true
				}
			})
			console.log('✓ Usuario encontrado en BD')
		} catch (error) {
			console.error('Error obteniendo usuario:', error)
			return NextResponse.json({ error: 'Error obteniendo usuario' }, { status: 500 })
		}

		if (!user) {
			return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })
		}

		// Paso 5: Calcular descuentos
		const membershipDiscount = user.membership?.name === 'Oro' ? 15 :
			user.membership?.name === 'Plata' ? 10 :
				user.membership?.name === 'Bronce' ? 5 : 0

		let additionalDiscount = 0
		if (discountCode) {
			try {
				const discount = await prisma.discount.findUnique({
					where: { code: discountCode }
				})
				if (discount && (!discount.membershipTierId || discount.membershipTierId === user.membershipId)) {
					additionalDiscount = discount.percentage
				}
			} catch (error) {
				console.error('Error obteniendo descuento:', error)
				// Continuar sin descuento adicional
			}
		}

		const totalDiscount = membershipDiscount + additionalDiscount
		const totals = calculateOrderTotals(items, totalDiscount)

		console.log('✓ Totales calculados:', totals)

		// Paso 6: Separar tipos de items
		const productItems = items.filter(item => item.type === 'product')
		const seatItems = items.filter(item => item.type === 'seat')

		// Paso 7: Verificar disponibilidad de asientos (solo si hay asientos)
		if (seatItems.length > 0) {
			try {
				const { isSeatAvailable } = await import('@/lib/utils/reservations')
				for (const seatItem of seatItems) {
					const isAvailable = await isSeatAvailable(seatItem.seat.id)
					if (!isAvailable) {
						return NextResponse.json({
							error: `Asiento ${seatItem.seatNumber} no está disponible`
						}, { status: 400 })
					}
				}
				console.log('✓ Asientos disponibles')
			} catch (error) {
				console.error('Error verificando asientos:', error)
				return NextResponse.json({ error: 'Error verificando disponibilidad' }, { status: 500 })
			}
		}

		// Paso 8: Crear orden
		let order
		try {
			order = await prisma.order.create({
				data: {
					userId: user.id,
					status: 'pending',
					totalAmount: totals.total,
					type: seatItems.length > 0 ? 'event' : 'cart',
					items: productItems.length > 0 ? {
						create: productItems.map(item => ({
							product: { connect: { id: item.product.id } },
							quantity: item.quantity,
							price: item.unitPrice
						}))
					} : undefined
				},
				include: {
					items: { include: { product: true } }
				}
			})
			console.log('✓ Orden creada:', order.id)
		} catch (error) {
			console.error('Error creando orden:', error)
			return NextResponse.json({ error: 'Error creando orden' }, { status: 500 })
		}

		// Paso 9: Actualizar con external reference
		try {
			await prisma.order.update({
				where: { id: order.id },
				data: { externalReference: order.id }
			})
			console.log('✓ External reference actualizado')
		} catch (error) {
			console.error('Error actualizando external reference:', error)
			// Continuar, no es crítico
		}

		// Paso 10: Crear reservaciones (solo si hay asientos)
		if (seatItems.length > 0) {
			try {
				for (const seatItem of seatItems) {
					await prisma.reservation.create({
						data: {
							userId: user.id,
							eventId: seatItem.event.id,
							seatId: seatItem.seat.id,
							orderId: order.id,
							status: 'pending'
						}
					})
				}
				console.log('✓ Reservaciones creadas')
			} catch (error) {
				console.error('Error creando reservaciones:', error)
				return NextResponse.json({ error: 'Error creando reservaciones' }, { status: 500 })
			}
		}

		// Paso 11: Preparar datos para MercadoPago
		const mpItems = convertCartItemsToMPItems(items)
		const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXTAUTH_URL || 'http://localhost:3000'
		const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl

		const preferenceData: MPPreferenceData = {
			items: mpItems,
			payer: {
				name: user.name?.split(' ')[0] || 'Usuario',
				surname: user.name?.split(' ').slice(1).join(' ') || 'Puff&Chill',
				email: user.email,
			},
			back_urls: {
				success: `${cleanBaseUrl}/checkout/success`,
				failure: `${cleanBaseUrl}/checkout/failure`,
				pending: `${cleanBaseUrl}/checkout/pending`
			},
			auto_return: process.env.NODE_ENV === 'production' ? 'approved' : undefined,
			notification_url: `${cleanBaseUrl}/api/payments/webhook`,
			statement_descriptor: 'PUFF&CHILL',
			external_reference: order.id
		}

		console.log('✓ Datos de preferencia preparados')

		// Paso 12: Crear preferencia de MercadoPago
		let preference
		try {
			preference = await createMPPreference(preferenceData)
			console.log('✓ Preferencia de MercadoPago creada:', preference.id)
		} catch (error) {
			console.error('Error creando preferencia de MercadoPago:', error)
			return NextResponse.json({ 
				error: 'Error creando preferencia de pago. Verifique configuración de MercadoPago.' 
			}, { status: 500 })
		}

		// Paso 13: Crear registro de pago
		try {
			await prisma.payment.create({
				data: {
					orderId: order.id,
					amount: totals.total,
					status: 'pending',
					provider: 'MercadoPago',
					providerRef: preference.id
				}
			})
			console.log('✓ Registro de pago creado')
		} catch (error) {
			console.error('Error creando registro de pago:', error)
			// Continuar, no es crítico para el flujo
		}

		// Paso 14: Preparar respuesta
		const response = {
			preferenceId: preference.id,
			orderId: order.id,
			initPoint: preference.init_point,
			sandboxInitPoint: preference.sandbox_init_point
		}

		console.log('✓ Respuesta preparada:', response)

		return NextResponse.json(response)

	} catch (error) {
		console.error('Error general en create-preference:', error)
		
		if (error instanceof Error) {
			console.error('Error details:', error.message)
			console.error('Error stack:', error.stack)
		}
		
		return NextResponse.json(
			{ error: 'Error interno del servidor' },
			{ status: 500 }
		)
	}
}