import { Suspense } from 'react'
import { Metadata } from 'next'
import { ShopDataAccess } from './components/ShopDataAccess'
import { ShopSkeletonComponent } from './components/ShopSkeletonComponent'

export const metadata: Metadata = {
	title: 'Tienda | Puff & Chill',
	description: 'Descubre nuestros productos exclusivos para tu experiencia de cine'
}

export default async function ShopPage() {
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
									Tienda
								</h1>
							</div>
							<p className="text-soft-beige/70 text-lg font-light ml-7">
								Snacks premium • Bebidas exclusivas • Experiencias únicas
							</p>
						</div>

						{/* Status Badge */}
						<div className="hidden md:flex items-center space-x-2 bg-soft-gray/10 backdrop-blur-sm border border-soft-gray/20 rounded-full px-4 py-2">
							<div className="w-2 h-2 bg-soft-gold rounded-full animate-pulse"></div>
							<span className="text-soft-beige/80 text-sm font-medium">Tienda Online</span>
						</div>
					</div>
				</div>
			</section>

			{/* Main Content */}
			<section className="px-4 sm:px-6 lg:px-8 pb-16">
				<div className="max-w-7xl mx-auto">
					<Suspense fallback={<ShopSkeletonComponent />}>
						<ShopDataAccess />
					</Suspense>
				</div>
			</section>
		</main>
	)
} 