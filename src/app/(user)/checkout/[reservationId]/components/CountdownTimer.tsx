'use client'

import { useEffect, useState, useCallback } from 'react'
import { Clock } from 'lucide-react'
import { useHydration } from '@/app/hooks/use-hydration'

interface CountdownTimerProps {
	expiresAt: Date
	onExpire?: () => void
}

export function CountdownTimer({ expiresAt, onExpire }: CountdownTimerProps) {
	const [timeLeft, setTimeLeft] = useState('--:--')
	const [isExpired, setIsExpired] = useState(false)
	const isHydrated = useHydration()

	const calculateTimeLeft = useCallback(() => {
		if (!isHydrated) return

		const now = new Date().getTime()
		const expiration = new Date(expiresAt).getTime()
		const difference = expiration - now

		if (difference <= 0) {
			setIsExpired(true)
			setTimeLeft('00:00')
			onExpire?.()
			return
		}

		const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
		const seconds = Math.floor((difference % (1000 * 60)) / 1000)

		setTimeLeft(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`)
	}, [expiresAt, onExpire, isHydrated])

	useEffect(() => {
		if (!isHydrated) return

		// Calculate initial time on mount
		calculateTimeLeft()

		const timer = setInterval(calculateTimeLeft, 1000)

		return () => clearInterval(timer)
	}, [calculateTimeLeft, isHydrated])

	return (
		<div 
			className={`flex items-center gap-2 ${isExpired ? 'text-warm-red' : 'text-sunset-orange'}`}
			suppressHydrationWarning
		>
			<Clock size={18} />
			<span className="font-mono font-semibold text-lg">{timeLeft}</span>
		</div>
	)
} 