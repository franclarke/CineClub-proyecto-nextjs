import { SignInForm } from './components/signin-form'
import { AnimatedSection } from '../../components/ui/animated-section'

export default function SignInPage() {
	return (
		<div className="min-h-screen relative overflow-hidden">
			{/* Background Image with Parallax Effect */}
			<div 
				className="absolute inset-0 bg-cover bg-center bg-no-repeat"
				style={{
					backgroundImage: 'url(/background-image.png)',
					scale: '1.1'
				}}
			/>
			
			{/* Dark Overlay with Gradient */}
			<div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/70 to-black/90" />
			
			{/* Floating Background Effects */}
			<div className="absolute inset-0">
				<div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse" />
				<div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
			</div>

			{/* Content */}
			<div className="relative z-10 min-h-screen flex items-center justify-center p-4">
				<div className="max-w-md w-full space-y-8">
					<AnimatedSection direction="fade" delay={200}>
						<div className="text-center mb-8">
							{/* Logo Badge */}
							<div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl mb-6 shadow-2xl">
								<span className="text-white text-3xl font-bold">🎬</span>
							</div>
							
							<h1 className="font-bebas text-5xl md:text-6xl text-white mb-4 tracking-wider">
								PUFF<span className="text-orange-400">&</span>CHILL
							</h1>
							<h2 className="text-2xl font-light text-gray-200 mb-3">
								Inicia Sesión
							</h2>
							<p className="text-gray-400 leading-relaxed">
								Disfruta del cine bajo las estrellas
							</p>
						</div>
					</AnimatedSection>

					<AnimatedSection direction="up" delay={400}>
						<div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8 shadow-2xl">
							<SignInForm />
						</div>
					</AnimatedSection>

					{/* Decorative Elements */}
					<AnimatedSection direction="fade" delay={800}>
						<div className="flex justify-center space-x-8 mt-8">
							<div className="w-2 h-2 bg-orange-400 rounded-full animate-ping" />
							<div className="w-2 h-2 bg-amber-400 rounded-full animate-ping" style={{ animationDelay: '0.5s' }} />
							<div className="w-2 h-2 bg-orange-400 rounded-full animate-ping" style={{ animationDelay: '1s' }} />
						</div>
					</AnimatedSection>
				</div>
			</div>

			{/* Bottom Floating Elements */}
			<div className="absolute bottom-10 left-10 w-16 h-16 bg-orange-500/20 rounded-full blur-xl animate-pulse" />
			<div className="absolute top-10 right-10 w-24 h-24 bg-amber-500/20 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1.5s' }} />
		</div>
	)
} 