import { MercadoPagoConfig, Preference } from 'mercadopago'
import { CartItem, ProductCartItem, SeatCartItem } from '@/types/cart'

const isProduction = process.env.NODE_ENV === 'production'

const accessToken = isProduction
	? process.env.MP_ACCESS_TOKEN
	: process.env.MP_TEST_ACCESS_TOKEN

// MercadoPago SDK configured

if (!accessToken) {
	const requiredToken = isProduction ? 'MP_ACCESS_TOKEN' : 'MP_TEST_ACCESS_TOKEN'
	throw new Error(`La variable de entorno ${requiredToken} no está configurada.`)
}
// Configurar MercadoPago
if (!accessToken) {
	throw new Error('MP_ACCESS_TOKEN no está configurado en las variables de entorno')
}

const client = new MercadoPagoConfig({
	accessToken: accessToken,
})

export const publicKey = isProduction
	? process.env.MP_PUBLIC_KEY
	: process.env.MP_TEST_PUBLIC_KEY

// MercadoPago public key configured


if (!publicKey) {
	const requiredKey = isProduction ? 'MP_PUBLIC_KEY' : 'MP_TEST_PUBLIC_KEY'
			// Environment variable not configured
}

const preference = new Preference(client)

// Tipos para MercadoPago
export interface MPItem {
	id: string
	title: string
	description?: string
	picture_url?: string
	category_id?: string
	quantity: number
	unit_price: number
	currency_id?: string
}

export interface MPPreferenceData {
	items: MPItem[]
	payer?: {
		name?: string
		surname?: string
		email?: string
		phone?: {
			area_code?: string
			number?: string
		}
		identification?: {
			type?: string
			number?: string
		}
		address?: {
			street_name?: string
			street_number?: string
			zip_code?: string
		}
	}
	back_urls?: {
		success?: string
		failure?: string
		pending?: string
	}
	auto_return?: 'approved' | 'all'
	payment_methods?: {
		excluded_payment_methods?: Array<{ id: string }>
		excluded_payment_types?: Array<{ id: string }>
		installments?: number
	}
	notification_url?: string
	statement_descriptor?: string
	external_reference?: string
	expires?: boolean
	expiration_date_from?: string
	expiration_date_to?: string
}

// Convertir items del carrito a formato MercadoPago
export function convertCartItemsToMPItems(items: CartItem[]): MPItem[] {
	return items.map((item) => {
		if (item.type === 'product') {
			const productItem = item as ProductCartItem
			return {
				id: productItem.product.id,
				title: productItem.product.name,
				description: productItem.product.description || `Producto: ${productItem.product.name}`,
				category_id: 'food', // Asumiendo que son productos de comida/bebida
				quantity: productItem.quantity,
				unit_price: productItem.unitPrice,
			}
		} else {
			const seatItem = item as SeatCartItem
			return {
				id: seatItem.seat.id,
				title: `${seatItem.event.title} - Asiento ${seatItem.seatNumber}`,
				description: `Entrada para ${seatItem.event.title} - Tier ${seatItem.tier} - Asiento ${seatItem.seatNumber}`,
				category_id: 'tickets',
				quantity: 1,
				unit_price: seatItem.unitPrice,
			}
		}
	})
}

// Crear preferencia de pago
export async function createPaymentPreference(data: MPPreferenceData) {
	try {
		const response = await preference.create({
			body: {
				items: data.items,
				payer: data.payer,
				back_urls: data.back_urls,
				...(data.auto_return && { auto_return: data.auto_return }),
				payment_methods: data.payment_methods,
				notification_url: data.notification_url,
				statement_descriptor: data.statement_descriptor,
				external_reference: data.external_reference,
				...(data.expires && {
					expires: data.expires,
					expiration_date_from: data.expiration_date_from,
					expiration_date_to: data.expiration_date_to
				})
			}
		})

		return response
	} catch (error) {
		// Error creating MercadoPago preference

		// Proporcionar información más específica del error
		if (error && typeof error === 'object' && 'message' in error) {
			throw new Error(`Error de MercadoPago: ${error.message}`)
		}

		throw new Error('Error al crear la preferencia de pago')
	}
}

// Obtener información de un pago
export async function getPaymentInfo(paymentId: string) {
	try {
		const payment = new (await import('mercadopago')).Payment(client)
		const response = await payment.get({ id: paymentId })
		return response
	} catch (error) {
		throw new Error('Error al obtener información del pago')
	}
}

// Tipos para el webhook de MercadoPago
interface MPWebhookBody {
	type: string
	data: {
		id: string
	}
	[key: string]: unknown
}

// Validar webhook de MercadoPago
export function validateMPWebhook(body: MPWebhookBody, headers: Headers): boolean {
	// Aquí puedes agregar validación adicional de seguridad
	// Por ejemplo, verificar el x-signature header

	// Verificar que el webhook tenga la estructura esperada
	if (!body || typeof body !== 'object') {
		return false
	}

	// Verificar que tenga los campos requeridos
	if (!body.type || !body.data) {
		return false
	}

	// Opcional: Verificar la firma del webhook (x-signature)
	const signature = headers.get('x-signature')
	if (signature) {
		// TODO: Validar firma usando el secreto de webhook de MercadoPago
		// return validateSignature(body, signature)
	}

	return true
}

// Helper para calcular descuentos
export function calculateOrderTotals(
	items: CartItem[],
	membershipDiscount: number = 0
) {
	const subtotal = items.reduce((acc, item) => acc + item.totalPrice, 0)
	const discountAmount = subtotal * (membershipDiscount / 100)
	const total = subtotal - discountAmount

	return {
		subtotal: Number(subtotal.toFixed(2)),
		discountAmount: Number(discountAmount.toFixed(2)),
		total: Number(total.toFixed(2)),
		membershipDiscount
	}
}

// Generar referencia externa única
export function generateExternalReference(userId: string, type: string = 'cart', timestamp: number = Date.now()): string {
	return `PUFF-${type.toUpperCase()}-${userId}-${timestamp}`
}

// Función para verificar el estado de un pago
export async function getPaymentStatus() {
	try {
		// Aquí usarías la API de payments de MercadoPago
		// const payment = new Payment(client)
		// return await payment.get({ id: paymentId })

		// Por ahora retornamos un mock
		return { status: 'pending' }
	} catch (error) {
		throw new Error('Error verificando el pago')
	}
} 