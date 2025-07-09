import { Suspense } from 'react'
import { Metadata } from 'next'
import { DataAccess } from './components/DataAccess'
import { BackButton } from '@/app/components/ui/back-button'

export const metadata: Metadata = {
	title: 'Checkout | Puff & Chill',
	description: 'Finaliza tu compra y confirma tu reserva'
}

interface CheckoutPageProps {
	params: Promise<{ reservationId: string }>
}

export default async function CheckoutPage({ params }: CheckoutPageProps) {
	const resolvedParams = await params
	
	return (
		<main className="min-h-screen bg-gradient-to-br from-deep-night via-deep-night/95 to-deep-night/90">
			{/* Compact Header */}
			<section className="pt-28 pb-8 px-4 sm:px-6 lg:px-8">
				<div className="max-w-7xl mx-auto">
					{/* Back Button */}
					<div className="mb-6">
						<BackButton />
					</div>
					
					<div className="flex items-center justify-between">
						{/* Title Section */}
						<div className="space-y-2">
							<div className="flex items-center space-x-3">
								<div className="w-1 h-8 bg-gradient-to-b from-sunset-orange to-soft-gold rounded-full"></div>
								<h1 className="text-4xl md:text-5xl font-bold text-soft-beige tracking-tight">
									<span className="bg-gradient-to-r from-sunset-orange to-soft-gold bg-clip-text text-transparent">Checkout</span>
								</h1>
							</div>
							<p className="text-soft-beige/70 text-lg font-light ml-7">
								Confirma tu reserva • Pago seguro
							</p>
						</div>

						{/* Status Badge */}
						<div className="hidden md:flex items-center space-x-2 bg-soft-gray/10 backdrop-blur-sm border border-soft-gray/20 rounded-full px-4 py-2">
							<div className="w-2 h-2 bg-soft-gold rounded-full animate-pulse"></div>
							<span className="text-soft-beige/80 text-sm font-medium">Checkout Seguro</span>
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
						<DataAccess reservationId={resolvedParams.reservationId} />
					</Suspense>
				</div>
			</section>
		</main>
	)
} 