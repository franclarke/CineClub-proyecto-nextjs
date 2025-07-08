import { ReactNode } from 'react'
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const glassCardVariants = cva(
	"relative backdrop-blur-xl border rounded-2xl transition-all duration-500 animate-fade-in",
	{
		variants: {
			variant: {
				default: [
					"bg-black/20 border-white/10",
					"shadow-soft",
				],
				premium: [
					"bg-gradient-to-br from-amber-500/20 to-orange-600/20",
					"border-amber-300/30 premium-border",
					"shadow-premium",
				],
				subtle: [
					"bg-gray-800/40 border-gray-600/50",
					"shadow-soft",
				],
				glow: [
					"bg-black/15 border-white/20",
					"shadow-glow",
				],
			},
			size: {
				sm: "p-[var(--spacing-sm)]",
				md: "p-[var(--spacing-md)]",
				lg: "p-[var(--spacing-lg)]",
				xl: "p-[var(--spacing-xl)]",
			},
			hover: {
				true: " hover:shadow-glow hover:bg-black/25 transition-base",
				false: "",
			}
		},
		defaultVariants: {
			variant: "default",
			size: "md",
			hover: true,
		}
	}
)

export interface GlassCardProps
	extends React.HTMLAttributes<HTMLDivElement>,
	VariantProps<typeof glassCardVariants> {
	children: ReactNode
	className?: string
}

export function GlassCard({
	children,
	className,
	variant,
	size,
	hover,
	...props
}: GlassCardProps) {
	return (
		<div
			className={cn(glassCardVariants({ variant, size, hover }), className)}
			{...props}
		>
			{children}
		</div>
	)
} 
