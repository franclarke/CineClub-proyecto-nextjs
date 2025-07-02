'use client'

import { useEffect, useRef, useState } from 'react'

interface AnimatedSectionProps {
	children: React.ReactNode
	className?: string
	delay?: number
	direction?: 'up' | 'down' | 'left' | 'right' | 'fade'
}

export function AnimatedSection({ 
	children, 
	className = '', 
	delay = 0,
	direction = 'up' 
}: AnimatedSectionProps) {
	const [isVisible, setIsVisible] = useState(false)
	const ref = useRef<HTMLDivElement>(null)

	useEffect(() => {
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					setTimeout(() => {
						setIsVisible(true)
					}, delay)
				}
			},
			{ threshold: 0.1 }
		)

		if (ref.current) {
			observer.observe(ref.current)
		}

		return () => observer.disconnect()
	}, [delay])

	const getAnimationClasses = () => {
		const baseClasses = 'transition-all duration-1000 ease-out'
		
		if (!isVisible) {
			switch (direction) {
				case 'up':
					return `${baseClasses} opacity-0 translate-y-16`
				case 'down':
					return `${baseClasses} opacity-0 -translate-y-16`
				case 'left':
					return `${baseClasses} opacity-0 translate-x-16`
				case 'right':
					return `${baseClasses} opacity-0 -translate-x-16`
				case 'fade':
					return `${baseClasses} opacity-0`
				default:
					return `${baseClasses} opacity-0 translate-y-16`
			}
		}
		
		return `${baseClasses} opacity-100 translate-x-0 translate-y-0`
	}

	return (
		<div 
			ref={ref}
			className={`${getAnimationClasses()} ${className}`}
		>
			{children}
		</div>
	)
} 
