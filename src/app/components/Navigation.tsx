'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '../hooks/use-auth'

export default function Navigation() {
	const [isMenuOpen, setIsMenuOpen] = useState(false)
	const { user, isAuthenticated, signOut, isLoading } = useAuth()

	if (isLoading) {
		return (
			<nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-sm border-b border-gray-700/20">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex items-center justify-between h-16">
						<Link href="/" className="flex items-center space-x-2">
							<div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full flex items-center justify-center">
								<span className="text-gray-900 font-bold text-xl">🎬</span>
							</div>
							<span className="font-bebas text-xl text-gray-100 hidden sm:block tracking-wider">
								PUFF & CHILL
							</span>
						</Link>
						<div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
					</div>
				</div>
			</nav>
		)
	}

	return (
		<nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-sm border-b border-gray-700/20">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex items-center justify-between h-16">
					{/* Logo */}
					<Link href="/" className="flex items-center space-x-2">
						<div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full flex items-center justify-center">
							<span className="text-gray-900 font-bold text-xl">🎬</span>
						</div>
						<span className="font-bebas text-xl text-gray-100 hidden sm:block tracking-wider">
							PUFF & CHILL
						</span>
					</Link>

					{/* Desktop Navigation */}
					<div className="hidden md:flex items-center space-x-8">
						<Link 
							href="/events" 
							className="text-gray-100 hover:text-orange-400 transition-colors duration-200"
						>
							Eventos
						</Link>
						<Link 
							href="/membership" 
							className="text-gray-100 hover:text-orange-400 transition-colors duration-200"
						>
							Membresías
						</Link>
						<Link 
							href="/about" 
							className="text-gray-100 hover:text-orange-400 transition-colors duration-200"
						>
							Nosotros
						</Link>
						<Link 
							href="/contact" 
							className="text-gray-100 hover:text-orange-400 transition-colors duration-200"
						>
							Contacto
						</Link>
					</div>

					{/* Desktop Auth Buttons */}
					<div className="hidden md:flex items-center space-x-4">
											{isAuthenticated ? (
						<>
							<div className="flex items-center space-x-3">
								<span className="text-gray-100/80 text-sm">
									¡Hola, {user?.name || user?.email}!
								</span>
								<span className="text-xs bg-amber-500/20 text-amber-300 px-2 py-1 rounded-full">
									{user?.membershipName}
								</span>
							</div>
							<button 
								onClick={signOut}
								className="text-gray-100 hover:text-orange-400 transition-colors duration-200"
							>
								Cerrar Sesión
							</button>
						</>
					) : (
						<>
							<Link 
								href="/auth/signin" 
								className="text-gray-100 hover:text-orange-400 transition-colors duration-200"
							>
								Iniciar Sesión
							</Link>
							<Link 
								href="/auth/signup" 
								className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200"
							>
								Registrarse
							</Link>
						</>
					)}
					</div>

					{/* Mobile menu button */}
					<button
						onClick={() => setIsMenuOpen(!isMenuOpen)}
						className="md:hidden p-2 rounded-lg text-gray-100 hover:text-orange-400 transition-colors duration-200"
						aria-label="Abrir menú"
					>
						<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							{isMenuOpen ? (
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
							) : (
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
							)}
						</svg>
					</button>
				</div>

				{/* Mobile Navigation */}
				{isMenuOpen && (
					<div className="md:hidden border-t border-gray-700/20">
						<div className="px-2 pt-2 pb-3 space-y-1">
							<Link 
								href="/events" 
								className="block px-3 py-2 text-gray-100 hover:text-orange-400 transition-colors duration-200"
								onClick={() => setIsMenuOpen(false)}
							>
								Eventos
							</Link>
							<Link 
								href="/membership" 
								className="block px-3 py-2 text-gray-100 hover:text-orange-400 transition-colors duration-200"
								onClick={() => setIsMenuOpen(false)}
							>
								Membresías
							</Link>
							<Link 
								href="/about" 
								className="block px-3 py-2 text-gray-100 hover:text-orange-400 transition-colors duration-200"
								onClick={() => setIsMenuOpen(false)}
							>
								Nosotros
							</Link>
							<Link 
								href="/contact" 
								className="block px-3 py-2 text-gray-100 hover:text-orange-400 transition-colors duration-200"
								onClick={() => setIsMenuOpen(false)}
							>
								Contacto
							</Link>
							<div className="border-t border-gray-700/20 pt-4">
								{isAuthenticated ? (
									<>
										<div className="px-3 py-2">
											<span className="text-gray-100/80 text-sm">
												¡Hola, {user?.name || user?.email}!
											</span>
											<div className="mt-1">
												<span className="text-xs bg-amber-500/20 text-amber-300 px-2 py-1 rounded-full">
													{user?.membershipName}
												</span>
											</div>
										</div>
										<button 
											onClick={() => {
												signOut()
												setIsMenuOpen(false)
											}}
											className="block w-full text-left px-3 py-2 text-gray-100 hover:text-orange-400 transition-colors duration-200"
										>
											Cerrar Sesión
										</button>
									</>
								) : (
									<>
										<Link 
											href="/auth/signin" 
											className="block px-3 py-2 text-gray-100 hover:text-orange-400 transition-colors duration-200"
											onClick={() => setIsMenuOpen(false)}
										>
											Iniciar Sesión
										</Link>
										<Link 
											href="/auth/signup" 
											className="block mx-3 mt-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-6 py-2 rounded-lg font-medium text-center transition-all duration-200"
											onClick={() => setIsMenuOpen(false)}
										>
											Registrarse
										</Link>
									</>
								)}
							</div>
						</div>
					</div>
				)}
			</div>
		</nav>
	)
} 