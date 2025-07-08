'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingBag } from 'lucide-react'
import { useCart } from '@/lib/cart/cart-context'

export function FloatingCartButton() {
	const { state, toggleCart } = useCart()
	const hasItems = state.totalItems > 0

	return (
		<motion.button
			onClick={toggleCart}
			className={`
        fixed bottom-6 right-6 z-40
        w-14 h-14 rounded-full
        bg-gradient-to-br from-sunset-orange via-[#fcd93f] to-[#9b8b02]
        border border-amber-400/40
        text-black
        shadow-xl
        flex items-center justify-center
        backdrop-blur-md
        transition-all duration-300
        hover:scale-110 hover:shadow-2xl
        ${hasItems ? 'animate-subtle-bounce' : ''}
    `}
			whileTap={{ scale: 0.95 }}
			initial={{ scale: 0, opacity: 0 }}
			animate={{ scale: 1, opacity: 1 }}
			transition={{ type: 'spring', damping: 20, stiffness: 300 }}
		>
			<ShoppingBag className="w-6 h-6" />

			<AnimatePresence>
				{hasItems && (
					<motion.div
						initial={{ scale: 0 }}
						animate={{ scale: 1 }}
						exit={{ scale: 0 }}
						className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center"
					>
						{state.totalItems}
					</motion.div>
				)}
			</AnimatePresence>
		</motion.button>
	)
} 
