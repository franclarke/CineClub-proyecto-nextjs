import { NextResponse } from 'next/server'
// import { prisma } from '@/lib/prisma'

export async function GET() {
	try {
		// TODO: Database integration
		// For now, return mock memberships
		const memberships = [
			{
				id: '1',
				name: 'Oro',
				description: 'Experiencia VIP definitiva de cine',
				priority: 1,
				price: 75,
				benefits: 'Acceso exclusivo, VIP lounge, bebidas premium ilimitadas'
			},
			{
				id: '2',
				name: 'Plata',
				description: 'Experiencia mejorada con beneficios',
				priority: 2,
				price: 35,
				benefits: 'Reserva prioritaria, asientos premium, bebida gratis'
			},
			{
				id: '3',
				name: 'Bronce',
				description: 'Perfecto para amantes casuales del cine',
				priority: 3,
				price: 15,
				benefits: 'Acceso a eventos, asientos estándar, menú básico'
			}
		]

		return NextResponse.json({
			success: true,
			memberships
		})

	} catch (error) {
		console.error('Memberships route error:', error)
		
		return NextResponse.json(
			{ error: 'Error al obtener membresías' },
			{ status: 500 }
		)
	}
} 