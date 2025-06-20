import { notFound } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { CheckoutClient } from './CheckoutClient'
import { CheckoutData } from '@/types/api'

interface DataAccessProps {
	reservationId: string
}

export async function DataAccess({ reservationId }: DataAccessProps) {
	const session = await getServerSession(authOptions)
	
	if (!session?.user) {
		notFound()
	}

	// Get reservation with all related data
	const reservation = await prisma.reservation.findUnique({
		where: { 
			id: reservationId,
			userId: session.user.id,
			status: 'pending'
		},
		include: {
			seat: true,
			event: true,
			user: {
				include: {
					membership: true
				}
			}
		}
	})

	if (!reservation) {
		notFound()
	}

	// Check if reservation is still valid (not expired)
	const expiresAt = new Date(reservation.createdAt.getTime() + 15 * 60 * 1000) // 15 minutes from creation
	if (new Date() > expiresAt) {
		notFound()
	}

	// Get user's cart items (from order items or session)
	const cartItems = await prisma.orderItem.findMany({
		where: {
			order: {
				userId: session.user.id,
				status: 'pending'
			}
		},
		include: {
			product: true
		}
	})

	// Get available products for cart
	const availableProducts = await prisma.product.findMany({
		where: {
			stock: {
				gt: 0
			}
		},
		orderBy: {
			name: 'asc'
		}
	})

	// Calculate membership discount
	const membershipDiscount = reservation.user.membership.name === 'Oro' ? 15 : 
		reservation.user.membership.name === 'Plata' ? 10 : 
		reservation.user.membership.name === 'Bronce' ? 5 : 0

	// Calculate total
	const ticketPrice = 25
	const cartTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
	const subtotal = ticketPrice + cartTotal
	const discountAmount = subtotal * (membershipDiscount / 100)
	const total = subtotal - discountAmount

	const checkoutData: CheckoutData = {
		reservation: {
			...reservation,
			expiresAt
		},
		event: reservation.event,
		seat: reservation.seat,
		cartItems,
		availableProducts,
		membershipDiscount,
		total
	}

	return (
		<CheckoutClient data={checkoutData} />
	)
} 