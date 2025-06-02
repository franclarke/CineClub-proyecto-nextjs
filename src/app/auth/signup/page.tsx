import { getMembershipTiers } from '../../../../lib/actions/auth'
import { SignUpForm } from './components/signup-form'
import { AnimatedSection } from '../../components/ui/animated-section'

export default async function SignUpPage() {
	const memberships = await getMembershipTiers()

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
			<div className="absolute inset-0 bg-gradient-to-br from-black/85 via-black/75 to-black/90" />
			
			{/* Floating Background Effects */}
			<div className="absolute inset-0">
				<div className="absolute top-1/6 left-1/6 w-80 h-80 bg-orange-500/15 rounded-full blur-3xl animate-pulse" />
				<div className="absolute bottom-1/6 right-1/6 w-80 h-80 bg-amber-500/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }} />
				<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-orange-600/5 rounded-full blur-3xl" />
			</div>

			{/* Content */}
			<div className="relative z-10 min-h-screen flex items-center justify-center p-4">
				<div className="max-w-4xl w-full space-y-8">
					<AnimatedSection direction="fade" delay={200}>
						<div className="text-center mb-8">
							{/* Logo Badge */}
							<div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl mb-8 shadow-2xl">
								<span className="text-white text-4xl font-bold">🎬</span>
							</div>
							
							<h1 className="font-bebas text-6xl md:text-7xl text-white mb-6 tracking-wider">
								PUFF<span className="text-orange-400">&</span>CHILL
							</h1>
							<h2 className="text-3xl font-light text-gray-200 mb-4">
								Únete al Club
							</h2>
							<p className="text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
								Crea tu cuenta y elige tu membresía para comenzar a disfrutar 
								de experiencias cinematográficas únicas bajo las estrellas
							</p>
						</div>
					</AnimatedSection>

					<AnimatedSection direction="up" delay={400}>
						<div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl overflow-hidden">
							<div className="p-8">
								<SignUpForm memberships={memberships} />
							</div>
						</div>
					</AnimatedSection>

					{/* Decorative Elements */}
					<AnimatedSection direction="fade" delay={800}>
						<div className="flex justify-center items-center space-x-6 mt-8">
							<div className="flex space-x-2">
								<div className="w-3 h-3 bg-orange-400 rounded-full animate-bounce" />
								<div className="w-3 h-3 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
								<div className="w-3 h-3 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
							</div>
							<span className="text-gray-400 text-sm">
								Tu experiencia premium te espera
							</span>
							<div className="flex space-x-2">
								<div className="w-3 h-3 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '0.6s' }} />
								<div className="w-3 h-3 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '0.8s' }} />
								<div className="w-3 h-3 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '1s' }} />
							</div>
						</div>
					</AnimatedSection>
				</div>
			</div>

			{/* Corner Floating Elements */}
			<div className="absolute top-16 left-16 w-20 h-20 bg-orange-500/20 rounded-full blur-xl animate-pulse" />
			<div className="absolute bottom-16 right-16 w-28 h-28 bg-amber-500/20 rounded-full blur-xl animate-pulse" style={{ animationDelay: '2s' }} />
			<div className="absolute top-1/3 right-16 w-16 h-16 bg-orange-400/15 rounded-full blur-xl animate-pulse" style={{ animationDelay: '3s' }} />
			<div className="absolute bottom-1/3 left-16 w-24 h-24 bg-amber-400/15 rounded-full blur-xl animate-pulse" style={{ animationDelay: '4s' }} />
		</div>
	)
} 