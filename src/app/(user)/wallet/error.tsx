'use client'

import { useEffect } from 'react'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import Link from 'next/link'

export default function WalletError({
	error,
	reset,
}: {
	error: Error & { digest?: string }
	reset: () => void
}) {
	useEffect(() => {
		// Log the error to an error reporting service
		console.error('Wallet page error:', error)
	}, [error])

	return (
		<div className="min-h-screen bg-gradient-to-br from-deep-night via-soft-night to-deep-night flex items-center justify-center p-4">
			<div className="max-w-md w-full">
				<div className="bg-soft-beige/5 backdrop-blur-xl border border-soft-beige/10 rounded-3xl p-8 text-center">
					<div className="w-20 h-20 bg-red-500/20 rounded-3xl flex items-center justify-center mx-auto mb-6">
						<AlertTriangle className="w-10 h-10 text-red-400" />
					</div>
					
					<h2 className="text-2xl font-bold text-soft-beige mb-4">
						Error al cargar la cartera
					</h2>
					
					<p className="text-soft-beige/70 mb-8 leading-relaxed">
						{error.message || 'Ocurrió un error inesperado al cargar tus datos de cartera. Por favor, intenta nuevamente.'}
					</p>
					
					<div className="space-y-4">
						<button
							onClick={reset}
							className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-sunset-orange to-soft-gold text-deep-night px-6 py-4 rounded-2xl font-semibold transition-all duration-300 hover:shadow-lg hover:scale-[1.02] group"
						>
							<RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-300" />
							<span>Intentar nuevamente</span>
						</button>
						
						<Link
							href="/"
							className="w-full flex items-center justify-center gap-3 bg-soft-beige/10 border border-soft-beige/20 text-soft-beige px-6 py-4 rounded-2xl font-semibold transition-all duration-300 hover:bg-soft-beige/20 hover:scale-[1.02] group"
						>
							<Home className="w-5 h-5" />
							<span>Volver al inicio</span>
						</Link>
					</div>
					
					{error.digest && (
						<p className="text-soft-beige/40 text-xs mt-6">
							Error ID: {error.digest}
						</p>
					)}
				</div>
			</div>
		</div>
	)
} 