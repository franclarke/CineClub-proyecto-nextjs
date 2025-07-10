import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { signUpSchema, type SignUpFormData } from '@/lib/validations/auth'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

// Definir tipos para MercadoPago
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
				...(data.auto_return && { auto_return: data.auto_return }),
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
		console.log('=== Signup Payment API Called ===')
		
		// Parsear body
		const body = await request.json()
		const { userData, membershipId, discountCode, skipPayment } = body

		console.log('✓ Datos recibidos:', { membershipId, discountCode, skipPayment })

		// Validar datos del usuario
		let validatedUserData: SignUpFormData
		try {
			validatedUserData = signUpSchema.parse(userData)
		} catch (error) {
			if (error instanceof z.ZodError) {
				return NextResponse.json({
					error: 'Datos inválidos',
					fieldErrors: error.flatten().fieldErrors
				}, { status: 400 })
			}
			throw error
		}

		// Verificar si el usuario ya existe
		const existingUser = await prisma.user.findUnique({
			where: { email: validatedUserData.email }
		})

		if (existingUser) {
			return NextResponse.json({
				error: 'El usuario ya existe con este email'
			}, { status: 400 })
		}

		// Verificar si la membresía existe
		const membership = await prisma.membershipTier.findUnique({
			where: { id: membershipId }
		})

		if (!membership) {
			return NextResponse.json({
				error: 'Membresía no encontrada'
			}, { status: 404 })
		}

		// Validar y aplicar código de descuento si se proporciona
		let discountPercentage = 0
		let discountDescription = ''
		let discountId = null

		if (discountCode) {
			const discount = await prisma.discount.findUnique({
				where: { 
					code: discountCode.toUpperCase()
				},
				include: {
					membershipTier: true
				}
			})

			if (!discount) {
				return NextResponse.json({ error: 'Código de descuento inválido' }, { status: 400 })
			}

			// Verificar si el descuento está activo
			const now = new Date()
			if (discount.validFrom && discount.validFrom > now) {
				return NextResponse.json({ error: 'Este código de descuento aún no está activo' }, { status: 400 })
			}

			if (discount.validUntil && discount.validUntil < now) {
				return NextResponse.json({ error: 'Este código de descuento ha expirado' }, { status: 400 })
			}

			// Verificar si el descuento es aplicable a la membresía seleccionada
			if (discount.membershipTierId && discount.membershipTierId !== membershipId) {
				return NextResponse.json({ 
					error: `Este código es exclusivo para la membresía ${discount.membershipTier?.name}` 
				}, { status: 400 })
			}

			discountPercentage = discount.percentage
			discountDescription = discount.description || `${discount.percentage}% de descuento`
			discountId = discount.id
		}

		// Calcular precio final con descuento
		const originalPrice = membership.price
		const discountAmount = originalPrice * (discountPercentage / 100)
		const finalPrice = originalPrice - discountAmount

		// Si skipPayment es true y el precio final es 0, crear el usuario directamente
		if (skipPayment && finalPrice === 0) {
			console.log('✓ Precio final es 0, creando usuario directamente')
			
			// Hash de la contraseña
			const hashedPassword = await bcrypt.hash(validatedUserData.password, 12)
			
			// Crear el usuario con la membresía seleccionada
			const newUser = await prisma.user.create({
				data: {
					name: validatedUserData.name,
					email: validatedUserData.email,
					password: hashedPassword,
					membershipId: membership.id
				}
			})

			// Crear orden como completada (sin pago)
			const order = await prisma.order.create({
				data: {
					userId: newUser.id,
					status: 'completed',
					totalAmount: 0,
					externalReference: `free_signup_${Date.now()}`,
					type: 'signup',
					metadata: {
						membershipId: membership.id,
						membershipName: membership.name,
						originalPrice: originalPrice,
						discountCode: discountCode || null,
						discountPercentage: discountPercentage,
						discountAmount: discountAmount,
						discountId: discountId,
						freeSignup: true
					}
				}
			})

			// Crear registro de pago como completado (sin MercadoPago)
			await prisma.payment.create({
				data: {
					orderId: order.id,
					amount: 0,
					status: 'completed',
					provider: 'free',
					providerRef: `free_${order.id}`
				}
			})

			console.log('✓ Usuario creado exitosamente con membresía gratuita:', newUser.id)

			return NextResponse.json({
				userId: newUser.id,
				orderId: order.id,
				originalPrice: originalPrice,
				discountAmount: discountAmount,
				finalPrice: 0,
				discountApplied: discountPercentage > 0,
				freeSignup: true
			})
		}

		// Hash de la contraseña para almacenar temporalmente
		const hashedPassword = await bcrypt.hash(validatedUserData.password, 12)

		// Generar referencia externa única para signup
		const externalReference = `signup_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

		// Crear orden específica para signup de membresía
		const order = await prisma.order.create({
			data: {
				// userId será null hasta que se complete el pago
				userId: null,
				status: 'pending',
				totalAmount: finalPrice,
				externalReference: externalReference,
				type: 'signup',
				metadata: {
					// Datos del usuario para crear después del pago
					userData: {
						name: validatedUserData.name,
						email: validatedUserData.email,
						password: hashedPassword
					},
					membershipId: membership.id,
					membershipName: membership.name,
					originalPrice: originalPrice,
					discountCode: discountCode || null,
					discountPercentage: discountPercentage,
					discountAmount: discountAmount,
					discountId: discountId
				}
			}
		})

		console.log('✓ Orden de signup creada:', order.id)

		// Determinar URLs base
		const baseUrl = process.env.NEXTAUTH_URL || request.headers.get('origin') || 'http://localhost:3000'
		const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl

		const successUrl = `${cleanBaseUrl}/memberships/signup/success?order_id=${order.id}`
		const failureUrl = `${cleanBaseUrl}/memberships/signup/failure?order_id=${order.id}`
		const pendingUrl = `${cleanBaseUrl}/memberships/signup/pending?order_id=${order.id}`
		const webhookUrl = `${cleanBaseUrl}/api/payments/webhook`

		// Preparar descripción del item
		let itemDescription = membership.description || `Membresía ${membership.name} - Puff & Chill`
		if (discountPercentage > 0) {
			itemDescription += ` (${discountDescription})`
		}

		// Verificar si el precio final es $0 y procesar como membresía gratuita
		if (finalPrice === 0) {
			console.log('✓ Membresía gratuita detectada, procesando directamente')
			
			try {
				// Crear el usuario directamente
				const newUser = await prisma.user.create({
					data: {
						name: validatedUserData.name,
						email: validatedUserData.email,
						password: hashedPassword,
						membershipId: membership.id
					}
				})

				// Actualizar la orden con el userId y marcar como completada
				await prisma.order.update({
					where: { id: order.id },
					data: {
						userId: newUser.id,
						status: 'completed'
					}
				})

				// Crear registro de pago simulado
				await prisma.payment.create({
					data: {
						orderId: order.id,
						amount: 0,
						status: 'completed',
						paymentDate: new Date(),
						provider: 'Free',
						providerRef: `FREE_SIGNUP_${Date.now()}`
					}
				})

				console.log('✓ Usuario creado y membresía gratuita activada:', newUser.id)

				// Retornar URL de éxito para membresía gratuita
				return NextResponse.json({
					isFreeSignup: true,
					userId: newUser.id,
					orderId: order.id,
					redirectUrl: `${cleanBaseUrl}/memberships/signup/success?user_id=${newUser.id}&auto_login=true`,
					originalPrice: originalPrice,
					discountAmount: discountAmount,
					finalPrice: finalPrice,
					discountApplied: discountPercentage > 0,
					message: 'Membresía activada exitosamente sin costo'
				})

			} catch (error) {
				console.error('Error procesando membresía gratuita:', error)
				return NextResponse.json({ 
					error: 'Error procesando membresía gratuita' 
				}, { status: 500 })
			}
		}

		// Crear preferencia de MercadoPago (solo si finalPrice > 0)
		const preferenceData: MPPreferenceData = {
			items: [{
				id: membership.id,
				title: `Membresía ${membership.name}`,
				description: itemDescription,
				quantity: 1,
				unit_price: finalPrice,
				currency_id: 'ARS'
			}],
			payer: {
				name: validatedUserData.name?.split(' ')[0] || 'Usuario',
				surname: validatedUserData.name?.split(' ').slice(1).join(' ') || 'Puff&Chill',
				email: validatedUserData.email,
			},
			back_urls: {
				success: successUrl,
				failure: failureUrl,
				pending: pendingUrl
			},
			notification_url: webhookUrl,
			statement_descriptor: 'PUFF&CHILL',
			external_reference: externalReference
		}

		const preference = await createMPPreference(preferenceData)

		console.log('✓ Preferencia de MercadoPago creada:', preference.id)

		// Crear registro de pago
		await prisma.payment.create({
			data: {
				orderId: order.id,
				amount: finalPrice,
				status: 'pending',
				provider: 'MercadoPago',
				providerRef: preference.id
			}
		})

		console.log('✓ Registro de pago creado')

		return NextResponse.json({
			preferenceId: preference.id,
			orderId: order.id,
			initPoint: preference.init_point,
			sandboxInitPoint: preference.sandbox_init_point,
			originalPrice: originalPrice,
			discountAmount: discountAmount,
			finalPrice: finalPrice,
			discountApplied: discountPercentage > 0
		})

	} catch (error) {
		console.error('Error en signup payment:', error)
		return NextResponse.json(
			{ error: 'Error interno del servidor' },
			{ status: 500 }
		)
	}
} 