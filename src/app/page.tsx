import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { HeroSection } from './components/home/hero-section'
import { AuthForm } from './components/auth/auth-form'
import { AppLogo } from './components/ui/app-logo'
import { DashboardHome } from './components/home/dashboard-home'
import Navigation from './components/Navigation'

async function getUserWithMembership(email: string) {
	return await prisma.user.findUnique({
		where: { email },
		include: {
			membership: {
				select: {
					name: true,
				},
			},
		},
	})
}

export default async function Home() {
	const session = await getServerSession(authOptions)
	
	// Si el usuario está autenticado, mostramos el dashboard
	if (session?.user?.email) {
		const userWithMembership = await getUserWithMembership(session.user.email)
		
		if (userWithMembership) {
			const userData = {
				name: userWithMembership.name,
				email: userWithMembership.email,
				membershipName: userWithMembership.membership.name,
			}
			
			return (
				<>
					<Navigation />
					<DashboardHome user={userData} />
				</>
			)
		}
	}

	// Si no está autenticado, mostramos la página de landing/auth
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
