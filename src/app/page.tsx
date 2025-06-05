import { prisma } from '../../lib/prisma'
import { HeroSection } from './components/home/hero-section'
import { AuthForm } from './components/auth/auth-form'
import { AppLogo } from './components/ui/app-logo'

export default async function Home() {
	const memberships = await prisma.membershipTier.findMany({
		orderBy: {
			price: 'asc',
		},
	})

	return (
		<main className="relative flex h-screen w-full items-center justify-center overflow-hidden">
			{/* Background Image */}
			<div
				className="absolute inset-0 bg-cover bg-center"
				style={{ backgroundImage: 'url(/background-image.png)' }}
			/>
			<div className="absolute inset-0 bg-black/60" />

			{/* Logo */}
			<div className="absolute left-1/2 top-8 z-20 -translate-x-1/2 md:left-8 md:translate-x-0">
				<AppLogo />
			</div>

			{/* Layout Grid */}
			<div className="relative z-10 grid h-full w-full max-w-screen-2xl grid-cols-1 md:grid-cols-3">
				{/* Left Side: Hero / Info */}
				<div className="col-span-2 hidden md:flex">
					<HeroSection />
				</div>

				{/* Right Side: Auth Form */}
				<div className="flex items-center justify-center">
					<AuthForm memberships={memberships} />
				</div>
			</div>
		</main>
	)
}
