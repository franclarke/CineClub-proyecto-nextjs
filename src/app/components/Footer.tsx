'use client'

import Link from 'next/link'

export default function Footer() {
	const scrollToTop = () => {
		window.scrollTo({ top: 0, behavior: 'smooth' })
	}

	return (
		<footer className="bg-deep-night border-t border-soft-gray/20">
			{/* Main Footer Content */}
			<div className="py-16 px-4">
				<div className="max-w-7xl mx-auto">
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
						{/* Brand Section */}
						<div className="lg:col-span-1">
							<div className="flex items-center space-x-3 mb-6">
								<div className="w-12 h-12 bg-gradient-sunset rounded-full flex items-center justify-center">
									<span className="text-deep-night font-bold text-2xl">🎬</span>
								</div>
								<span className="text-display text-2xl text-soft-beige">
									PUFF & CHILL
								</span>
							</div>
							<p className="text-soft-beige/80 leading-relaxed mb-6">
								Donde el cine se encuentra con las estrellas. Vive películas como nunca antes en nuestra exclusiva terraza con sonido premium y vistas impresionantes.
							</p>
							<div className="flex space-x-4">
								<a href="#" className="text-soft-beige/60 hover:text-sunset-orange transition-colors duration-200">
									<span className="sr-only">Instagram</span>
									<div className="w-10 h-10 bg-soft-gray/20 rounded-full flex items-center justify-center hover:bg-sunset-orange/20">
										📷
									</div>
								</a>
								<a href="#" className="text-soft-beige/60 hover:text-sunset-orange transition-colors duration-200">
									<span className="sr-only">Twitter</span>
									<div className="w-10 h-10 bg-soft-gray/20 rounded-full flex items-center justify-center hover:bg-sunset-orange/20">
										🐦
									</div>
								</a>
								<a href="#" className="text-soft-beige/60 hover:text-sunset-orange transition-colors duration-200">
									<span className="sr-only">TikTok</span>
									<div className="w-10 h-10 bg-soft-gray/20 rounded-full flex items-center justify-center hover:bg-sunset-orange/20">
										🎵
									</div>
								</a>
								<a href="#" className="text-soft-beige/60 hover:text-sunset-orange transition-colors duration-200">
									<span className="sr-only">Spotify</span>
									<div className="w-10 h-10 bg-soft-gray/20 rounded-full flex items-center justify-center hover:bg-sunset-orange/20">
										🎧
									</div>
								</a>
							</div>
						</div>

						{/* Quick Links */}
						<div>
							<h4 className="text-display text-xl text-soft-beige mb-6">Experiencia</h4>
							<ul className="space-y-4">
								<li>
									<Link href="/events" className="text-soft-beige/70 hover:text-sunset-orange transition-colors duration-200">
										Eventos de Esta Noche
									</Link>
								</li>
								<li>
									<Link href="/upcoming" className="text-soft-beige/70 hover:text-sunset-orange transition-colors duration-200">
										Próximas Películas
									</Link>
								</li>
								<li>
									<Link href="/membership" className="text-soft-beige/70 hover:text-sunset-orange transition-colors duration-200">
										Planes de Membresía
									</Link>
								</li>
								<li>
									<Link href="/venue" className="text-soft-beige/70 hover:text-sunset-orange transition-colors duration-200">
										Terraza del Venue
									</Link>
								</li>
								<li>
									<Link href="/private-events" className="text-soft-beige/70 hover:text-sunset-orange transition-colors duration-200">
										Proyecciones Privadas
									</Link>
								</li>
							</ul>
						</div>

						{/* Support */}
						<div>
							<h4 className="text-display text-xl text-soft-beige mb-6">Soporte</h4>
							<ul className="space-y-4">
								<li>
									<Link href="/help" className="text-soft-beige/70 hover:text-sunset-orange transition-colors duration-200">
										Centro de Ayuda
									</Link>
								</li>
								<li>
									<Link href="/contact" className="text-soft-beige/70 hover:text-sunset-orange transition-colors duration-200">
										Contáctanos
									</Link>
								</li>
								<li>
									<Link href="/faq" className="text-soft-beige/70 hover:text-sunset-orange transition-colors duration-200">
										Preguntas Frecuentes
									</Link>
								</li>
								<li>
									<Link href="/accessibility" className="text-soft-beige/70 hover:text-sunset-orange transition-colors duration-200">
										Accesibilidad
									</Link>
								</li>
								<li>
									<Link href="/feedback" className="text-soft-beige/70 hover:text-sunset-orange transition-colors duration-200">
										Comentarios
									</Link>
								</li>
							</ul>
						</div>

						{/* Contact Info */}
						<div>
							<h4 className="text-display text-xl text-soft-beige mb-6">Visítanos</h4>
							<div className="space-y-4 text-soft-beige/70">
								<div className="flex items-start space-x-3">
									<span className="text-sunset-orange mt-1">📍</span>
									<div>
										<p className="font-semibold text-soft-beige">Terraza Centro</p>
										<p>Calle Cinema Heights 123</p>
										<p>Ciudad de México, CDMX 01000</p>
									</div>
								</div>
								<div className="flex items-center space-x-3">
									<span className="text-sunset-orange">📞</span>
									<a href="tel:+525512345678" className="hover:text-sunset-orange transition-colors duration-200">
										(55) 1234-5678
									</a>
								</div>
								<div className="flex items-center space-x-3">
									<span className="text-sunset-orange">✉️</span>
									<a href="mailto:hola@puffandchill.com" className="hover:text-sunset-orange transition-colors duration-200">
										hola@puffandchill.com
									</a>
								</div>
								<div className="flex items-center space-x-3">
									<span className="text-sunset-orange">🕐</span>
									<div>
										<p>Puertas abren diario a las 7:30 PM</p>
										<p className="text-sm">Sujeto a condiciones climáticas</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Bottom Bar */}
			<div className="py-8 px-4 border-t border-soft-gray/20">
				<div className="max-w-7xl mx-auto">
					<div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
						<div className="text-soft-beige/60 text-sm">
							© 2024 CineClub Puff & Chill. Todos los derechos reservados.
						</div>
						<div className="flex flex-wrap gap-6 text-sm">
							<Link href="/privacy" className="text-soft-beige/60 hover:text-sunset-orange transition-colors duration-200">
								Política de Privacidad
							</Link>
							<Link href="/terms" className="text-soft-beige/60 hover:text-sunset-orange transition-colors duration-200">
								Términos de Servicio
							</Link>
							<Link href="/cookies" className="text-soft-beige/60 hover:text-sunset-orange transition-colors duration-200">
								Política de Cookies
							</Link>
							<Link href="/disclaimer" className="text-soft-beige/60 hover:text-sunset-orange transition-colors duration-200">
								Aviso Legal
							</Link>
						</div>
					</div>
				</div>
			</div>

			{/* Back to Top Button */}
			<button 
				onClick={scrollToTop}
				className="fixed bottom-8 right-8 w-12 h-12 bg-gradient-sunset rounded-full flex items-center justify-center shadow-glow hover:scale-110 transition-all duration-300 z-40"
				aria-label="Volver arriba"
			>
				<span className="text-deep-night text-xl">↑</span>
			</button>
		</footer>
	)
} 