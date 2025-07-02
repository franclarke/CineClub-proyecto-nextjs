import { Suspense } from 'react'
import { Metadata } from 'next'
import { MembershipsSkeletonComponent } from './components/MembershipsSkeletonComponent'
import { MembershipsDataAccess } from './components/MembershipsDataAccess'

export const metadata: Metadata = {
	title: 'Membresías | Puff & Chill',
	description: 'Elige tu membresía premium y accede a beneficios exclusivos'
}

export default async function MembershipsPage() {
	
	return (
		<main className="min-h-screen bg-deep-night/98 backdrop-blur-3xl">
			{/* Header Section - Compact like /events */}
			<section className="pt-28 pb-8 px-4 sm:px-6 lg:px-8">
				<div className="max-w-6xl mx-auto">
					<div className="flex items-center justify-between">
						{/* Left side - Title */}
						<div className="space-y-2">
							<h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-soft-beige leading-none tracking-tight">
								Membresías <span className="bg-gradient-to-r from-sunset-orange to-soft-gold bg-clip-text text-transparent">Premium</span>
							</h1>
							<p className="text-lg text-soft-beige/60 font-light max-w-2xl leading-relaxed">
								Cada membresía está diseñada para ofrecerte beneficios únicos y experiencias inolvidables
							</p>
						</div>

						{/* Right side - Status indicator */}
						<div className="hidden md:flex items-center space-x-4">
							<div className="w-px h-16 bg-gradient-to-b from-transparent via-soft-beige/20 to-transparent"></div>
							<div className="flex items-center space-x-3 bg-gradient-to-r from-soft-gold/10 to-sunset-orange/10 border border-soft-gold/20 rounded-full px-4 py-2">
								<div className="w-2 h-2 bg-soft-gold rounded-full animate-pulse"></div>
								<span className="text-soft-gold font-medium text-sm tracking-wide uppercase">
									Planes Activos
								</span>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Content Section */}
			<section className="px-4 sm:px-6 lg:px-8 pb-20">
				<div className="max-w-6xl mx-auto">
					<Suspense fallback={<MembershipsSkeletonComponent />}>
						<MembershipsDataAccess />
					</Suspense>
				</div>
			</section>
		</main>
	)
}
