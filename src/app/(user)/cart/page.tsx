import { Suspense } from 'react'
import { Metadata } from 'next'
import { CartSkeletonComponent } from './components/CartSkeletonComponent'
import { CartDataAccess } from './components/CartDataAccess'

export const metadata: Metadata = {
	title: 'Mi Carrito | Puff & Chill',
	description: 'Revisa y gestiona los productos en tu carrito de compras'
}

export default async function CartPage() {
	return (
		<main className="min-h-screen bg-gradient-to-br from-deep-night via-deep-night/95 to-deep-night/90">
			{/* Compact Header */}
			<section className="pt-28 pb-8 px-4 sm:px-6 lg:px-8">
				<div className="max-w-7xl mx-auto">
					<div className="flex items-center justify-between">
						{/* Title Section */}
						<div className="space-y-2">
							<div className="flex items-center space-x-3">
								<div className="w-1 h-8 bg-gradient-to-b from-sunset-orange to-soft-gold rounded-full"></div>
								<h1 className="text-4xl md:text-5xl font-bold text-soft-beige tracking-tight">
									Mi Carrito
								</h1>
							</div>
							<p className="text-soft-beige/70 text-lg font-light ml-7">
								Revisa tus productos • Finaliza tu compra
							</p>
						</div>

						{/* Status Badge */}
						<div className="hidden md:flex items-center space-x-2 bg-soft-gray/10 backdrop-blur-sm border border-soft-gray/20 rounded-full px-4 py-2">
							<div className="w-2 h-2 bg-soft-gold rounded-full animate-pulse"></div>
							<span className="text-soft-beige/80 text-sm font-medium">Carrito Activo</span>
						</div>
					</div>
				</div>
			</section>

			{/* Main Content */}
			<section className="px-4 sm:px-6 lg:px-8 pb-16">
				<div className="max-w-7xl mx-auto">
					<Suspense fallback={<CartSkeletonComponent />}>
						<CartDataAccess />
					</Suspense>
				</div>
			</section>
		</main>
	)
} 