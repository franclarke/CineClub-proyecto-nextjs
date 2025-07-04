import { getServerSession } from 'next-auth/next'
import { DashboardHome } from './(user)/(home)/dashboard-home'
import { HeroSection } from './components/home/hero-section'
import { AuthForm } from './components/home/auth/auth-form'
import { DashboardContent } from './(admin)/components/dashboard-content'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

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
	
	// Si el usuario está autenticado, mostramos el dashboard correspondiente
	if (session?.user?.email) {
		const userWithMembership = await getUserWithMembership(session.user.email)

		if (userWithMembership) {
			const userData = {
				name: userWithMembership.name,
				email: userWithMembership.email,
				membershipName: userWithMembership.membership?.name || 'Bronce',
			}

			if (session.user.isAdmin) {
				return <DashboardContent />
			}

			return <DashboardHome user={userData} />
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
