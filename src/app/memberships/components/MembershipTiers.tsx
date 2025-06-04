export default function MembershipTiers() {
	const tiers = [
		{
			name: "Bronce",
			icon: "🥉",
			price: "$15",
			period: "/mes",
			description: "Perfecto para amantes casuales del cine",
			features: [
				"Acceso mensual a eventos",
				"Área de asientos estándar",
				"Menú básico de snacks",
				"Acceso al chat comunitario",
				"Previstas exclusivas para miembros"
			],
			buttonText: "Comenzar Bronce",
			buttonStyle: "btn-secondary",
			bgColor: "bg-dark-olive/20",
			borderColor: "border-dark-olive/40"
		},
		{
			name: "Plata",
			icon: "🥈",
			price: "$35",
			period: "/mes",
			description: "Experiencia mejorada con beneficios",
			features: [
				"Reserva prioritaria (3 días antes)",
				"Sección de asientos premium",
				"Selección gourmet de snacks",
				"Bebida de bienvenida gratis",
				"Eventos y mixers para miembros",
				"Acceso a listas de Spotify"
			],
			buttonText: "Elegir Plata",
			buttonStyle: "btn-primary",
			bgColor: "bg-sunset-orange/10",
			borderColor: "border-sunset-orange/30",
			popular: true
		},
		{
			name: "Oro",
			icon: "🥇",
			price: "$75",
			period: "/mes",
			description: "Experiencia VIP definitiva de cine",
			features: [
				"Reserva exclusiva (7 días antes)",
				"Lounge VIP y asientos premium",
				"Menú completo de cena gourmet",
				"Bebidas premium ilimitadas",
				"Invitaciones a proyecciones privadas",
				"Control colaborativo de playlist",
				"Servicio de concierge personal",
				"Evento anual de apreciación"
			],
			buttonText: "Obtener Oro",
			buttonStyle: "btn-premium",
			bgColor: "bg-soft-gold/10",
			borderColor: "border-soft-gold/30"
		}
	]

	return (
		<section className="py-20 px-4 bg-gradient-to-b from-deep-night to-soft-gray/10">
			<div className="max-w-7xl mx-auto">
				<div className="text-center mb-16">
					<h2 className="text-display text-4xl md:text-6xl text-soft-gold mb-6">
						Elige tu Experiencia
					</h2>
					<p className="text-xl text-soft-beige/80 max-w-3xl mx-auto">
						Desde noches casuales de cine hasta experiencias VIP de lujo - encuentra la membresía perfecta para tu viaje cinematográfico
					</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
					{tiers.map((tier, index) => (
						<div 
							key={tier.name}
							className={`
								relative rounded-2xl p-8 backdrop-blur-sm border-2 transition-all duration-300 hover:scale-105 hover:shadow-2xl
								${tier.bgColor} ${tier.borderColor}
								${tier.popular ? 'ring-2 ring-sunset-orange/50 shadow-glow' : ''}
								flex flex-col h-full
							`}
						>
							{tier.popular && (
								<div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
									<span className="bg-gradient-sunset text-deep-night px-6 py-2 rounded-full text-sm font-bold">
										MÁS POPULAR
									</span>
								</div>
							)}

							<div className="flex-1 flex flex-col">
								<div className="text-center mb-8">
									<div className="text-6xl mb-4">{tier.icon}</div>
									<h3 className="text-display text-3xl text-soft-beige mb-2">{tier.name}</h3>
									<p className="text-soft-beige/70 mb-4">{tier.description}</p>
									<div className="flex items-baseline justify-center">
										<span className="text-4xl font-bold text-sunset-orange">{tier.price}</span>
										<span className="text-soft-beige/70 ml-1">{tier.period}</span>
									</div>
								</div>

								<ul className="space-y-4 mb-8">
									{tier.features.map((feature, featureIndex) => (
										<li key={featureIndex} className="flex items-start space-x-3">
											<span className="text-sunset-orange mt-1">✓</span>
											<span className="text-soft-beige/90">{feature}</span>
										</li>
									))}
								</ul>
							</div>

							<button className={`${tier.buttonStyle} w-full py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-105`}>
								{tier.buttonText}
							</button>
						</div>
					))}
				</div>

			</div>
		</section>
	)
} 