import Link from 'next/link'
import { CalendarIcon, ShoppingBagIcon, WalletIcon, UserIcon, ArrowRightIcon } from 'lucide-react'

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
			gradient: 'from-sunset-orange/20 to-sunset-orange/5',
		},
		{
			title: 'Mi Wallet',
			description: 'Tickets y consumibles',
			href: '/wallet',
			icon: WalletIcon,
			color: 'soft-gold',
			gradient: 'from-soft-gold/20 to-soft-gold/5',
		},
		{
			title: 'Tienda',
			description: 'Food & drinks para tu experiencia',
			href: '/shop',
			icon: ShoppingBagIcon,
			color: 'warm-red',
			gradient: 'from-warm-red/20 to-warm-red/5',
		},
		{
			title: 'Mi Perfil',
			description: 'Gestiona tu cuenta y membresía',
			href: '/profile',
			icon: UserIcon,
			color: 'soft-beige',
			gradient: 'from-soft-beige/20 to-soft-beige/5',
		},
	]

	return (
		<main className="min-h-screen bg-deep-night/98 backdrop-blur-3xl">
			{/* Hero Section */}
			<section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
				<div className="max-w-6xl mx-auto pb-18 pt-6">
					<div className="text-center space-y-8">
						{/* Welcome Badge */}
						<div className="inline-flex items-center space-x-3 bg-gradient-to-r from-soft-gold/10 to-sunset-orange/10 border border-soft-gold/20 rounded-full px-6 py-3 animate-fade-in">
							<div className="w-2 h-2 bg-soft-gold rounded-full animate-pulse"></div>
							<span className="text-soft-gold font-medium text-sm tracking-wide uppercase">
								Bienvenido de vuelta
							</span>
						</div>

						{/* Main Title */}
						<div className="space-y-4 animate-fade-in" style={{ animationDelay: '0.1s' }}>
							<h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-soft-beige leading-none tracking-tight">
								¡Hola, {user.name?.split(' ')[0] || 'Usuario'}!
							</h1>
							<p className="text-xl md:text-2xl text-soft-beige/60 font-light max-w-2xl mx-auto leading-relaxed">
								Tu experiencia cinematográfica bajo las estrellas te espera
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* Quick Actions */}
			<section className="px-4 sm:px-6 lg:px-8 pb-20">
				<div className="max-w-6xl mx-auto">
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
						{quickActions.map((action, index) => {
							const IconComponent = action.icon
							return (
								<Link
									key={action.href}
									href={action.href}
									className="group relative overflow-hidden bg-deep-night/95 backdrop-blur-2xl border border-soft-gray/20 rounded-3xl p-8 hover:border-soft-gray/30 transition-all duration-500 hover:transform hover:scale-105 shadow-2xl hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.8)] animate-fade-in min-h-[280px] flex flex-col"
									style={{ animationDelay: `${index * 0.1 + 0.3}s` }}
								>
									{/* Background Gradient */}
									<div className={`absolute inset-0 bg-gradient-to-br ${action.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
									
									<div className="relative z-10 flex flex-col items-center text-center space-y-6 h-full justify-between">
										{/* Content Container */}
										<div className="flex flex-col items-center text-center space-y-6">
											{/* Icon */}
											<div className={`w-20 h-20 bg-gradient-to-br from-${action.color}/20 to-${action.color}/5 border border-${action.color}/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
												<IconComponent className={`w-10 h-10 text-${action.color}`} />
											</div>

											{/* Content */}
											<div className="space-y-3">
												<h3 className="text-2xl font-bold text-soft-beige group-hover:text-sunset-orange transition-colors duration-300">
													{action.title}
												</h3>
												<p className="text-soft-beige/60 text-sm leading-relaxed font-medium">
													{action.description}
												</p>
											</div>
										</div>

										{/* Arrow Icon - Always at bottom */}
										<div className="w-10 h-10 bg-soft-gray/10 rounded-full flex items-center justify-center group-hover:bg-sunset-orange/20 transition-all duration-300">
											<ArrowRightIcon className="w-5 h-5 text-soft-beige/40 group-hover:text-sunset-orange group-hover:translate-x-1 transition-all duration-300" />
										</div>
									</div>
								</Link>
							)
						})}
					</div>
				</div>
			</section>

		</main>
	)
} 
