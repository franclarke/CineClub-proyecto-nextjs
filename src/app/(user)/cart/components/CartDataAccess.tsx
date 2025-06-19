import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { CartClientComponent } from './CartClientComponent'

async function getCartData(userId: string) {
	// Obtener órdenes pendientes del usuario
	const pendingOrders = await prisma.order.findMany({
		where: {
			userId,
			status: 'PENDING'
		},
		include: {
			items: {
				include: {
					product: true
				}
			}
		}
	})

	return pendingOrders
}

async function getAvailableProducts() {
	return await prisma.product.findMany({
		where: {
			stock: {
				gt: 0
			}
		},
		orderBy: {
			name: 'asc'
		}
	})
}

async function getUserMembership(email: string) {
	const user = await prisma.user.findUnique({
		where: { email },
		include: {
			membership: {
				select: {
					name: true,
					discounts: {
						where: {
							OR: [
								{ validUntil: null }, // No expiration date
								{ validUntil: { gte: new Date() } } // Not expired
							],
							AND: [
								{
									OR: [
										{ validFrom: null }, // No start date
										{ validFrom: { lte: new Date() } } // Already started
									]
								}
							]
						},
						select: {
							percentage: true
						}
					}
				}
			}
		}
	})

	if (!user) return null

	// Calculate total discount percentage from all valid discounts
	const totalDiscountPercentage = user.membership.discounts.reduce((total, discount) => {
		return total + discount.percentage
	}, 0)

	return {
		...user,
		membership: {
			name: user.membership.name,
			discounts: totalDiscountPercentage
		}
	}
}

export async function CartDataAccess() {
	const session = await getServerSession(authOptions)
	
	if (!session?.user?.email) {
		return (
			<div className="text-center py-12">
				<p className="text-soft-beige/60 mb-4">
					Debes iniciar sesión para ver tu carrito
				</p>
			</div>
		)
	}

	const user = await getUserMembership(session.user.email)
	
	if (!user) {
		return (
			<div className="text-center py-12">
				<p className="text-soft-beige/60 mb-4">
					Usuario no encontrado
				</p>
			</div>
		)
	}

	const [cartOrders, availableProducts] = await Promise.all([
		getCartData(user.id),
		getAvailableProducts()
	])

	return (
		<CartClientComponent 
			user={user}
			cartOrders={cartOrders}
			availableProducts={availableProducts}
		/>
	)
} 