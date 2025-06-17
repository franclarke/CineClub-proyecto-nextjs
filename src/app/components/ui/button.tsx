import * as React from 'react'
import { cva, type VariantProps } from "class-variance-authority"
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
	"font-medium rounded-md transition-base focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed animate-fade-in inline-flex items-center justify-center",
	{
		variants: {
			variant: {
				primary: "btn-primary shadow-glow hover:shadow-glow/80 focus:ring-orange-500",
				secondary: "btn-secondary hover:bg-gray-700 focus:ring-gray-500",
				premium: "btn-premium shadow-premium premium-border hover:shadow-premium/90 focus:ring-amber-500",
				outline: "border border-gray-600 hover:bg-gray-800 text-gray-200 focus:ring-gray-500",
			},
			size: {
				sm: "px-3 py-1.5 text-sm",
				md: "px-4 py-2 text-sm",
				lg: "px-6 py-3 text-base",
			},
		},
		defaultVariants: {
			variant: "primary",
			size: "md",
		},
	}
)

export interface ButtonProps 
	extends React.ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof buttonVariants> {
	children: React.ReactNode
	loading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	({ 
		children, 
		type = 'button',
		variant, 
		size, 
		disabled = false, 
		loading = false, 
		className, 
		...props 
	}, ref) => {
		return (
			<button
				ref={ref}
				type={type}
				disabled={disabled || loading}
				className={cn(buttonVariants({ variant, size }), className)}
				{...props}
			>
				{loading ? (
					<div className="flex items-center justify-center">
						<Loader2 className="w-4 h-4 mr-2 animate-spin" />
						<span>Cargando...</span>
					</div>
				) : (
					children
				)}
			</button>
		)
	}
)

Button.displayName = "Button"

export { Button, buttonVariants } 