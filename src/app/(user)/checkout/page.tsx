import { Suspense } from 'react'
import { Metadata } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { CheckoutClient } from './components/CheckoutClient'
import { BackButton } from '@/app/components/ui/back-button'

export const metadata: Metadata = {
	title: 'Checkout | Puff & Chill',
	description: 'Finaliza tu compra del carrito'
}

async function getUserData(email: string) {
	return await prisma.user.findUnique({
		where: { email },
		include: {
			membership: true
		}
	})
}

export default async function CheckoutPage() {
	const session = await getServerSession(authOptions)
	
	if (!session?.user?.email) {
		redirect('/login')
	}

	const user = await getUserData(session.user.email)
	
	if (!user) {
		redirect('/login')
	}

	return (
		<main className="min-h-screen bg-gradient-to-br from-deep-night via-deep-night/95 to-deep-night/90">
			{/* Header */}
			<section className="pt-28 pb-8 px-4 sm:px-6 lg:px-8">
				<div className="max-w-7xl mx-auto">
					{/* Back Button */}
					<div className="mb-6">
						<BackButton href="/shop" label="Volver a la tienda" />
					</div>
					
					<div className="flex items-center justify-between">
						<div className="space-y-2">
							<div className="flex items-center space-x-3">
								<div className="w-1 h-8 bg-gradient-to-b from-sunset-orange to-soft-gold rounded-full"></div>
								<h1 className="text-4xl md:text-5xl font-bold text-soft-beige tracking-tight">
									Resumen de Compra
								</h1>
							</div>
							<p className="text-soft-beige/70 text-lg font-light ml-7">
								Revisa tu pedido antes de proceder al pago
							</p>
						</div>

						<div className="hidden md:flex items-center space-x-2 bg-soft-gray/10 backdrop-blur-sm border border-soft-gray/20 rounded-full px-4 py-2">
							<div className="w-2 h-2 bg-soft-gold rounded-full animate-pulse"></div>
							<span className="text-soft-beige/80 text-sm font-medium">Pago Seguro</span>
						</div>
					</div>
				</div>
			</section>

			{/* Main Content */}
			<section className="px-4 sm:px-6 lg:px-8 pb-16">
				<div className="max-w-7xl mx-auto">
					<Suspense fallback={
						<div className="flex justify-center items-center py-20">
							<div className="w-8 h-8 border-2 border-sunset-orange border-t-transparent rounded-full animate-spin"></div>
						</div>
					}>
						<CheckoutClient user={user} />
					</Suspense>
				</div>
			</section>
		</main>
	)
} 