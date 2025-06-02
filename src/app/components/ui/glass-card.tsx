import { ReactNode } from 'react'

interface GlassCardProps {
	children: ReactNode
	className?: string
	variant?: 'default' | 'premium' | 'subtle'
	hover?: boolean
}

export function GlassCard({ 
	children, 
	className = '', 
	variant = 'default',
	hover = true 
}: GlassCardProps) {
	const baseClasses = 'backdrop-blur-xl border rounded-2xl transition-all duration-500'
	
	const variants = {
		default: 'bg-white/10 border-white/20 shadow-2xl',
		premium: 'bg-gradient-to-br from-amber-500/20 to-orange-600/20 border-amber-300/30 shadow-amber-500/25 shadow-2xl',
		subtle: 'bg-gray-900/40 border-gray-700/50 shadow-xl'
	}

	const hoverClasses = hover 
		? 'hover:scale-105 hover:shadow-3xl hover:bg-white/15 cursor-pointer' 
		: ''

	return (
		<div className={`${baseClasses} ${variants[variant]} ${hoverClasses} ${className}`}>
			{children}
		</div>
	)
} 