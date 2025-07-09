import { Suspense } from 'react'
import { Metadata } from 'next'
import { ProfileSkeletonComponent } from './components/ProfileSkeletonComponent'
import { ProfileDataAccess } from './components/ProfileDataAccess'
import { BackButton } from '@/app/components/ui/back-button'

export const metadata: Metadata = {
	title: 'Mi Perfil | Puff & Chill',
	description: 'Gestiona tu información personal y configuración de cuenta'
}

export default async function ProfilePage() {
	return (
		<main className="min-h-screen bg-deep-night/98 backdrop-blur-3xl">
			{/* Header Section - Compact like /events */}
			<section className="pt-28 pb-8 px-4 sm:px-6 lg:px-8">
				<div className="max-w-4xl mx-auto">
					{/* Back Button */}
					<div className="mb-6">
						<BackButton href="/" />
					</div>
					
					<div className="flex items-center justify-between">
						{/* Left side - Title */}
						<div className="space-y-2">
							<h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-soft-beige leading-none tracking-tight">
								Mi Perfil
							</h1>
							<p className="text-lg text-soft-beige/60 font-light max-w-2xl leading-relaxed">
								Gestiona tu información personal y configuración de tu cuenta
							</p>
						</div>

						{/* Right side - Status indicator */}
						<div className="hidden md:flex items-center space-x-4">
							<div className="w-px h-16 bg-gradient-to-b from-transparent via-soft-beige/20 to-transparent"></div>
							<div className="flex items-center space-x-3 bg-gradient-to-r from-sunset-orange/10 to-soft-gold/10 border border-sunset-orange/20 rounded-full px-4 py-2">
								<div className="w-2 h-2 bg-sunset-orange rounded-full animate-pulse"></div>
								<span className="text-sunset-orange font-medium text-sm tracking-wide uppercase">
									Mi Cuenta
								</span>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Content Section */}
			<section className="px-4 sm:px-6 lg:px-8 pb-20">
				<div className="max-w-4xl mx-auto">
					<Suspense fallback={<ProfileSkeletonComponent />}>
						<ProfileDataAccess />
					</Suspense>
				</div>
			</section>
		</main>
	)
} 
