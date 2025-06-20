import { ReactNode } from 'react'

interface PageHeaderProps {
	title: string
	subtitle: string
	statusLabel: string
	statusColor?: 'sunset-orange' | 'soft-gold' | 'soft-beige'
	children?: ReactNode
}

export function PageHeader({ 
	title, 
	subtitle, 
	statusLabel, 
	statusColor = 'sunset-orange',
	children 
}: PageHeaderProps) {
	return (
		<section className="pt-28 pb-8 px-4 sm:px-6 lg:px-8">
			<div className="max-w-6xl mx-auto">
				<div className="flex items-center justify-between">
					{/* Left side - Title */}
					<div className="space-y-2">
						<h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-soft-beige leading-none tracking-tight">
							{title}
						</h1>
						<p className="text-lg text-soft-beige/60 font-light max-w-2xl leading-relaxed">
							{subtitle}
						</p>
					</div>

					{/* Right side - Status indicator */}
					<div className="hidden md:flex items-center space-x-4">
						<div className="w-px h-16 bg-gradient-to-b from-transparent via-soft-beige/20 to-transparent"></div>
						<div className={`flex items-center space-x-3 bg-gradient-to-r from-${statusColor}/10 to-${statusColor === 'sunset-orange' ? 'soft-gold' : statusColor}/10 border border-${statusColor}/20 rounded-full px-4 py-2`}>
							<div className={`w-2 h-2 bg-${statusColor} rounded-full animate-pulse`}></div>
							<span className={`text-${statusColor} font-medium text-sm tracking-wide uppercase`}>
								{statusLabel}
							</span>
						</div>
					</div>
				</div>
				{children}
			</div>
		</section>
	)
} 