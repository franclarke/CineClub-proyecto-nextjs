'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '../../hooks/use-auth'
import { ChevronDownIcon, UsersIcon, PackageIcon, LogOutIcon, MenuIcon, XIcon, CalendarIcon, ShieldCheckIcon } from 'lucide-react'

export default function AdminNavigation() {
	const [isMenuOpen, setIsMenuOpen] = useState(false)
	const [isProfileOpen, setIsProfileOpen] = useState(false)
	const { user, isAuthenticated, signOut, isLoading } = useAuth()

	if (isLoading) {
		return (
			<nav className="fixed top-0 left-0 right-0 z-50 bg-deep-night/90 backdrop-blur-custom border-b border-soft-gray/10 shadow-soft">
				<div className="max-w-7xl mx-auto px-6 lg:px-8">
					<div className="flex items-center justify-between h-20">
						<Link href="/admin" className="flex items-center">
							<div className="rounded-2xl overflow-hidden shadow-soft">
								<Image
									src="/logo.png"
									alt="Puff & Chill Logo"
									width={120}
									height={120}
									className="object-contain"
								/>
							</div>
						</Link>
						<div className="flex items-center gap-2">
							<div className="w-6 h-6 border-2 border-sunset-orange border-t-transparent rounded-full animate-spin" />
							<span className="text-soft-beige/70 text-sm">Cargando...</span>
						</div>
					</div>
				</div>
			</nav>
		)
	}

	return (
		<nav className="fixed top-0 left-0 right-0 z-50 bg-deep-night/90 backdrop-blur-custom border-b border-soft-gray/10 shadow-soft">
			<div className="max-w-7xl mx-auto px-6 lg:px-8">
				<div className="flex items-center justify-between h-20">
					{/* Logo */}
					<Link href="/" className="flex items-center group">
						<div className="rounded-2xl overflow-hidden shadow-soft group-hover:shadow-glow transition-all duration-300">
							<Image
								src="/logo.png"
								alt="Puff & Chill Logo"
								width={120}
								height={120}
								className="object-contain group-hover:scale-105 transition-transform duration-300"
							/>
						</div>
					</Link>

					{/* Desktop Navigation */}
					<div className="hidden lg:flex items-center space-x-2">
						<Link
							href="/manage-events"
							className="flex items-center space-x-2 px-6 py-3 text-soft-beige hover:text-sunset-orange hover:bg-soft-gray/10 rounded-2xl transition-base font-medium"
						>
							<CalendarIcon className="w-5 h-5" />
							<span>Eventos</span>
						</Link>
						<Link
							href="/manage-users"
							className="flex items-center space-x-2 px-6 py-3 text-soft-beige hover:text-sunset-orange hover:bg-soft-gray/10 rounded-2xl transition-base font-medium"
						>
							<UsersIcon className="w-5 h-5" />
							<span>Usuarios</span>
						</Link>
						<Link
							href="/manage-products"
							className="flex items-center space-x-2 px-6 py-3 text-soft-beige hover:text-sunset-orange hover:bg-soft-gray/10 rounded-2xl transition-base font-medium"
						>
							<PackageIcon className="w-5 h-5" />
							<span>Productos</span>
						</Link>
					</div>

					{/* Desktop Auth/Profile */}
					<div className="hidden lg:flex items-center space-x-4">
						{isAuthenticated && (
							<div className="relative">
								<button
									onClick={() => setIsProfileOpen(!isProfileOpen)}
									className="flex items-center space-x-4 px-4 py-3 bg-soft-gray/10 hover:bg-soft-gray/20 rounded-2xl transition-base group"
								>
									{/* User Info */}
									<div className="text-left">
										<div className="text-soft-beige font-semibold text-sm">
											{user?.name || user?.email}
										</div>
										<div className="flex items-center space-x-1">
											<ShieldCheckIcon className="w-3 h-3 text-sunset-orange" />
											<span className="text-sunset-orange text-xs font-medium">
												Administrador
											</span>
										</div>
									</div>
									<ChevronDownIcon className="w-5 h-5 text-soft-beige/60 group-hover:text-soft-beige transition-colors duration-300" />
								</button>

								{/* Profile Dropdown */}
								{isProfileOpen && (
									<div className="absolute right-0 mt-3 w-64 rounded-2xl shadow-soft overflow-hidden z-50 glass-card">
										<div className="p-2">
											<button
												onClick={() => {
													signOut()
													setIsProfileOpen(false)
												}}
												className="flex items-center space-x-3 w-full px-4 py-3 text-soft-beige hover:text-warm-red hover:bg-warm-red/10 rounded-xl transition-base group"
											>
												<div className="w-10 h-10 bg-soft-gray/10 group-hover:bg-warm-red/20 rounded-lg flex items-center justify-center transition-colors duration-300">
													<LogOutIcon className="w-5 h-5" />
												</div>
												<div className="text-left">
													<p className="font-medium">Cerrar Sesión</p>
													<p className="text-xs text-soft-beige/60">Salir del panel de administración</p>
												</div>
											</button>
										</div>
									</div>
								)}
							</div>
						)}
					</div>

					{/* Mobile menu button */}
					<button
						onClick={() => setIsMenuOpen(!isMenuOpen)}
						className="lg:hidden p-3 rounded-2xl text-soft-beige hover:text-sunset-orange hover:bg-soft-gray/10 transition-base"
						aria-label="Abrir menú"
					>
						{isMenuOpen ? (
							<XIcon className="w-6 h-6" />
						) : (
							<MenuIcon className="w-6 h-6" />
						)}
					</button>
				</div>

				{/* Mobile Navigation */}
				{isMenuOpen && (
					<div className="lg:hidden border-t border-soft-gray/10 glass-card z-40">
						<div className="p-4 space-y-2">
							<Link
								href="/manage-events"
								className="flex items-center space-x-3 px-4 py-3 text-soft-beige hover:text-sunset-orange hover:bg-soft-gray/10 rounded-2xl transition-base font-medium"
								onClick={() => setIsMenuOpen(false)}
							>
								<CalendarIcon className="w-5 h-5" />
								<span>Eventos</span>
							</Link>
							<Link
								href="/manage-users"
								className="flex items-center space-x-3 px-4 py-3 text-soft-beige hover:text-sunset-orange hover:bg-soft-gray/10 rounded-2xl transition-base font-medium"
								onClick={() => setIsMenuOpen(false)}
							>
								<UsersIcon className="w-5 h-5" />
								<span>Usuarios</span>
							</Link>
							<Link
								href="/manage-products"
								className="flex items-center space-x-3 px-4 py-3 text-soft-beige hover:text-sunset-orange hover:bg-soft-gray/10 rounded-2xl transition-base font-medium"
								onClick={() => setIsMenuOpen(false)}
							>
								<PackageIcon className="w-5 h-5" />
								<span>Productos</span>
							</Link>

							<div className="pt-4 border-t border-soft-gray/10">
								{isAuthenticated && (
									<>
										<div className="px-4 py-3 mb-2">
											<div className="flex items-center space-x-3">
												<p className="text-soft-beige font-semibold">
													{user?.name || user?.email}
												</p>
												<div className="flex items-center space-x-1 mt-1">
													<ShieldCheckIcon className="w-3 h-3 text-sunset-orange" />
													<span className="text-sunset-orange text-xs font-medium">
														Administrador
													</span>
												</div>
											</div>
										</div>
										<button
											onClick={() => {
												signOut()
												setIsMenuOpen(false)
											}}
											className="flex items-center space-x-3 w-full px-4 py-3 text-soft-beige hover:text-warm-red hover:bg-warm-red/10 rounded-2xl transition-base font-medium"
										>
											<LogOutIcon className="w-5 h-5" />
											<span>Cerrar Sesión</span>
										</button>
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
