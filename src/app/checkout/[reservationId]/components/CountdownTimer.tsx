'use client'

import { useState, useEffect } from 'react'

interface CountdownTimerProps {
	expiresAt: Date
	onExpired: () => void
}

export function CountdownTimer({ expiresAt, onExpired }: CountdownTimerProps) {
	const [timeLeft, setTimeLeft] = useState<{
		minutes: number
		seconds: number
		total: number
	}>({ minutes: 0, seconds: 0, total: 0 })

	useEffect(() => {
		const updateTimer = () => {
			const now = new Date().getTime()
			const distance = expiresAt.getTime() - now

			if (distance < 0) {
				setTimeLeft({ minutes: 0, seconds: 0, total: 0 })
				onExpired()
				return
			}

			const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
			const seconds = Math.floor((distance % (1000 * 60)) / 1000)

			setTimeLeft({ minutes, seconds, total: distance })
		}

		// Update immediately
		updateTimer()

		// Update every second
		const interval = setInterval(updateTimer, 1000)

		return () => clearInterval(interval)
	}, [expiresAt, onExpired])

	const isUrgent = timeLeft.total < 2 * 60 * 1000 // Less than 2 minutes
	const isVeryUrgent = timeLeft.total < 60 * 1000 // Less than 1 minute

	return (
		<div className={`
			flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-300
			${isVeryUrgent 
				? 'bg-warm-red/20 border-warm-red text-warm-red animate-pulse' 
				: isUrgent 
					? 'bg-sunset-orange/20 border-sunset-orange text-sunset-orange' 
					: 'bg-soft-gray/20 border-soft-gray text-soft-beige'
			}
		`}>
			<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
			</svg>
			<span className="font-mono font-medium">
				{String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
			</span>
			<span className="text-sm">
				{isVeryUrgent ? '¡URGENTE!' : isUrgent ? 'Pocos min.' : 'restantes'}
			</span>
		</div>
	)
} 