import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const { id: orderId } = await params

		if (!orderId) {
			return NextResponse.json({ error: 'ID de orden requerido' }, { status: 400 })
		}

		const order = await prisma.order.findUnique({
			where: { id: orderId },
			include: {
				user: {
					select: {
						id: true,
						name: true,
						email: true,
						membershipId: true
					}
				},
				items: {
					include: {
						product: true
					}
				},
				reservations: {
					include: {
						event: true,
						seat: true
					}
				},
				payment: true
			}
		})

		if (!order) {
			return NextResponse.json({ error: 'Orden no encontrada' }, { status: 404 })
		}

		return NextResponse.json(order)

	} catch (error) {
		return NextResponse.json(
			{ error: 'Error interno del servidor' },
			{ status: 500 }
		)
	}
} 