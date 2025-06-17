import Link from 'next/link'
import { CalendarIcon, ShoppingBagIcon, WalletIcon, UserIcon } from 'lucide-react'

interface DashboardHomeProps {
	user: {
		name?: string | null
		email: string
		membershipName?: string
	}
}

export function DashboardHome({ user }: DashboardHomeProps) {
	const quickActions = [
		{
			title: 'Próximos Eventos',
			description: 'Explora las próximas funciones',
			href: '/events',
			icon: CalendarIcon,
			color: 'sunset-orange',
		},
		{
			title: 'Mi Wallet',
			description: 'Tickets y consumibles',
			href: '/wallet',
			icon: WalletIcon,
			color: 'soft-gold',
		},
		{
			title: 'Tienda',
			description: 'Food & drinks para tu experiencia',
			href: '/cart',
			icon: ShoppingBagIcon,
			color: 'warm-red',
		},
		{
			title: 'Mi Perfil',
			description: 'Gestiona tu cuenta y membresía',
			href: '/profile',
			icon: UserIcon,
			color: 'dark-olive',
		},
	]

	return (
		<main className="min-h-screen bg-deep-night pt-20 pb-12">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				{/* Header de bienvenida */}
				<div className="text-center mb-16 animate-fade-in">
					<h1 className="text-display text-4xl md:text-6xl text-soft-beige mb-4">
						¡Bienvenido de vuelta!
					</h1>
					<p className="text-xl text-soft-beige/80 mb-2">
						{user.name || user.email}
					</p>
					<div className="inline-flex items-center space-x-2">
						<span className="text-soft-gold text-sm">Membresía:</span>
						<span className="px-3 py-1 bg-soft-gold/20 text-soft-gold rounded-full text-sm font-medium">
							{user.membershipName}
						</span>
					</div>
				</div>

				{/* Quick Actions Grid */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
					{quickActions.map((action, index) => {
						const IconComponent = action.icon
						return (
							<Link
								key={action.href}
								href={action.href}
								className="group bg-soft-gray/30 backdrop-blur-sm p-8 rounded-xl border border-soft-gray/20 hover:border-sunset-orange/40 transition-all duration-300 hover:transform hover:-translate-y-2 hover:shadow-glow animate-fade-in"
								style={{ animationDelay: `${index * 0.1}s` }}
							>
								<div className="flex flex-col items-center text-center space-y-4">
									<div className={`w-16 h-16 bg-${action.color}/20 rounded-full flex items-center justify-center group-hover:bg-${action.color}/30 transition-colors duration-300`}>
										<IconComponent className={`w-8 h-8 text-${action.color}`} />
									</div>
									<div>
										<h3 className="text-display text-xl text-soft-beige mb-2 group-hover:text-sunset-orange transition-colors duration-300">
											{action.title}
										</h3>
										<p className="text-soft-beige/70 text-sm leading-relaxed">
											{action.description}
										</p>
									</div>
								</div>
							</Link>
						)
					})}
				</div>

				{/* Featured Section - Recent Activity or Recommendations */}
				<div className="bg-soft-gray/20 backdrop-blur-sm rounded-xl border border-soft-gray/20 p-8">
					<h2 className="text-display text-2xl text-soft-beige mb-6">
						Tu Actividad Reciente
					</h2>
					<div className="text-center py-12">
						<div className="w-16 h-16 bg-soft-gray/30 rounded-full flex items-center justify-center mx-auto mb-4">
							<CalendarIcon className="w-8 h-8 text-soft-gray" />
						</div>
						<p className="text-soft-beige/60 mb-6">
							Aún no tienes actividad reciente
						</p>
						<Link 
							href="/events"
							className="btn-primary px-6 py-3 rounded-lg font-medium inline-flex items-center space-x-2"
						>
							<CalendarIcon className="w-4 h-4" />
							<span>Explorar Eventos</span>
						</Link>
					</div>
				</div>
			</div>
		</main>
	)
} 