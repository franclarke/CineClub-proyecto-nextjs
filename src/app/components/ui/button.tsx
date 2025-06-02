import { ReactNode } from 'react'

interface ButtonProps {
	children: ReactNode
	type?: 'button' | 'submit'
	variant?: 'primary' | 'secondary' | 'outline'
	size?: 'sm' | 'md' | 'lg'
	disabled?: boolean
	loading?: boolean
	onClick?: () => void
	className?: string
}

export function Button({
	children,
	type = 'button',
	variant = 'primary',
	size = 'md',
	disabled = false,
	loading = false,
	onClick,
	className = '',
}: ButtonProps) {
	const baseStyles = 'font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'
	
	const variants = {
		primary: 'bg-orange-600 hover:bg-orange-700 text-white focus:ring-orange-500',
		secondary: 'bg-gray-600 hover:bg-gray-700 text-white focus:ring-gray-500',
		outline: 'border border-gray-600 hover:bg-gray-800 text-gray-200 focus:ring-gray-500',
	}

	const sizes = {
		sm: 'px-3 py-1.5 text-sm',
		md: 'px-4 py-2 text-sm',
		lg: 'px-6 py-3 text-base',
	}

	return (
		<button
			type={type}
			disabled={disabled || loading}
			onClick={onClick}
			className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
		>
			{loading ? (
				<div className="flex items-center justify-center">
					<div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
					Cargando...
				</div>
			) : (
				children
			)}
		</button>
	)
} 