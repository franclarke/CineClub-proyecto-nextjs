'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useAuth } from '../../hooks/use-auth'
import { ChevronDownIcon, ShoppingBagIcon, WalletIcon, UserIcon, LogOutIcon, MenuIcon, XIcon, StarIcon, CalendarIcon, ShoppingCartIcon } from 'lucide-react'
import { useCart } from '@/lib/cart/cart-context'

export default function Navigation() {
	const [isMenuOpen, setIsMenuOpen] = useState(false)
	const [isProfileOpen, setIsProfileOpen] = useState(false)
	const [scrolled, setScrolled] = useState(false)
	const { user, isAuthenticated, signOut, isLoading, isAdmin } = useAuth()
	const { state: cartState, toggleCart } = useCart()
	const pathname = usePathname()
	const profileRef = useRef<HTMLDivElement>(null)

	// Handle scroll effect
	useEffect(() => {
		const handleScroll = () => {
			setScrolled(window.scrollY > 20)
		}
		window.addEventListener('scroll', handleScroll)
		return () => window.removeEventListener('scroll', handleScroll)
	}, [])

	// Close profile dropdown when clicking outside
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
				setIsProfileOpen(false)
			}
		}
		document.addEventListener('mousedown', handleClickOutside)
		return () => document.removeEventListener('mousedown', handleClickOutside)
	}, [])

	// Close mobile menu on route change
	useEffect(() => {
		setIsMenuOpen(false)
	}, [pathname])

	const isActivePage = (path: string) => pathname === path

	const getMembershipColor = (membershipName?: string) => {
		switch (membershipName?.toLowerCase()) {
			case 'bronze':
				return 'text-bronze'
			case 'silver':
				return 'text-silver'
			default:
				return 'text-soft-gold'
		}
	}

	const navItems = [
		{ href: '/events', label: 'Eventos', icon: CalendarIcon },
		{ href: '/shop', label: 'Tienda', icon: ShoppingBagIcon },
		...(isAuthenticated ? [{ href: '/wallet', label: 'Wallet', icon: WalletIcon }] : [])
	]

	if (isLoading) {
		return (
			<nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
				scrolled 
					? 'bg-deep-night/75 backdrop-blur-3xl shadow-2xl border-b border-soft-gray/20' 
					: 'bg-deep-night/90 backdrop-blur-2xl border-b border-soft-gray/10'
			}`}>
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex items-center justify-between h-16 lg:h-20">
						<Link href="/" className="flex items-center">
							<div className="rounded-2xl overflow-hidden shadow-lg">
								<Image 
									src="/logo.png" 
									alt="Puff & Chill Logo" 
									width={100} 
									height={100}
									className="object-contain"
								/>
							</div>
						</Link>
						<div className="w-8 h-8 border-3 border-sunset-orange border-t-transparent rounded-full animate-spin" />
					</div>
				</div>
			</nav>
		)
	}

	return (
		<nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
			scrolled 
				? 'bg-deep-night/75 backdrop-blur-3xl shadow-2xl border-b border-soft-gray/20' 
				: 'bg-deep-night/90 backdrop-blur-2xl border-b border-soft-gray/10'
		}`}>
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex items-center justify-between h-16 lg:h-20">
					{/* Logo */}
					<Link href="/" className="flex items-center group">
						<div className="rounded-2xl overflow-hidden shadow-lg group-hover:shadow-xl transition-all duration-300">
							<Image 
								src="/logo.png" 
								alt="Puff & Chill Logo" 
								width={100} 
								height={100}
								className="object-contain group-hover:scale-105 transition-transform duration-300"
							/>
						</div>
					</Link>

					{/* Desktop Navigation */}
					<div className="hidden lg:flex items-center space-x-2">
						{navItems.map(({ href, label, icon: Icon }) => (
							<Link 
								key={href}
								href={href} 
								className={`flex items-center space-x-3 px-6 py-3 rounded-xl font-medium transition-all duration-300 relative group ${
									isActivePage(href)
										? 'text-sunset-orange bg-sunset-orange/10 shadow-lg'
										: 'text-soft-beige hover:text-sunset-orange hover:bg-soft-gray/10'
								}`}
							>
								<Icon className="w-5 h-5" />
								<span className="text-base">{label}</span>
								{isActivePage(href) && (
									<div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-sunset-orange rounded-full shadow-lg" />
								)}
							</Link>
						))}
					</div>

					{/* Desktop Auth/Profile */}
					<div className="hidden lg:flex items-center space-x-3">
						{isAuthenticated ? (
							<>
								{/* Profile Dropdown */}
								<div className="relative" ref={profileRef}>
									<button
										onClick={() => setIsProfileOpen(!isProfileOpen)}
										className="flex items-center space-x-3 px-3 py-2 bg-soft-gray/5 hover:bg-soft-gray/15 rounded-xl transition-all duration-300 group border border-transparent hover:border-soft-gray/20"
									>
										{/* Avatar */}
										<div className="w-8 h-8 bg-gradient-to-br from-sunset-orange to-soft-gold rounded-lg flex items-center justify-center shadow-lg">
											<UserIcon className="w-4 h-4 text-deep-night" />
										</div>
										
										{/* User Info */}
										<div className="text-left hidden xl:block">
											<div className="text-soft-beige font-medium text-sm leading-tight">
												{user?.name || user?.email?.split('@')[0]}
											</div>
											<div className="flex items-center space-x-1">
												<StarIcon className={`w-3 h-3 ${getMembershipColor(user?.membershipName)}`} />
												<span className={`text-xs font-medium ${getMembershipColor(user?.membershipName)}`}>
													{user?.membershipName}
												</span>
											</div>
										</div>
										
										<ChevronDownIcon className={`w-4 h-4 text-soft-beige/60 transition-all duration-300 ${
											isProfileOpen ? 'rotate-180 text-sunset-orange' : 'group-hover:text-soft-beige'
										}`} />
									</button>

									{/* Enhanced Profile Dropdown */}
									{isProfileOpen && (
										<div className="absolute right-0 mt-2 w-72 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in slide-in-from-top-2 duration-200"
											style={{
												backgroundColor: 'rgba(28, 28, 30, 0.98)',
												backdropFilter: 'blur(40px)',
												WebkitBackdropFilter: 'blur(40px)',
												border: '1px solid rgba(58, 58, 60, 0.3)'
											}}
										>
											{/* Profile Header */}
											<div className="p-4 border-b border-soft-gray/10">
												<div className="flex items-center space-x-3">
													<div className="w-12 h-12 bg-gradient-to-br from-sunset-orange to-soft-gold rounded-xl flex items-center justify-center shadow-lg">
														<UserIcon className="w-6 h-6 text-deep-night" />
													</div>
													<div>
														<p className="text-soft-beige font-semibold">
															{user?.name || user?.email}
														</p>
														<div className="flex items-center space-x-1 mt-1">
															<StarIcon className={`w-3 h-3 ${getMembershipColor(user?.membershipName)}`} />
															<span className={`text-xs font-medium ${getMembershipColor(user?.membershipName)}`}>
																Membresía {user?.membershipName}
															</span>
														</div>
													</div>
												</div>
											</div>

											{/* Menu Items */}
											<div className="p-2">
												<Link
													href="/profile"
													className="flex items-center space-x-3 px-3 py-3 text-soft-beige hover:text-sunset-orange hover:bg-soft-gray/10 rounded-xl transition-all duration-300 group"
													onClick={() => setIsProfileOpen(false)}
												>
													<div className="w-9 h-9 bg-soft-gray/10 group-hover:bg-sunset-orange/20 rounded-lg flex items-center justify-center transition-colors duration-300">
														<UserIcon className="w-4 h-4" />
													</div>
													<div>
														<p className="font-medium text-sm">Mi Perfil</p>
														<p className="text-xs text-soft-beige/60">Configuración de cuenta</p>
													</div>
												</Link>
												<Link
													href="/memberships"
													className="flex items-center space-x-3 px-3 py-3 text-soft-beige hover:text-sunset-orange hover:bg-soft-gray/10 rounded-xl transition-all duration-300 group"
													onClick={() => setIsProfileOpen(false)}
												>
													<div className="w-9 h-9 bg-soft-gray/10 group-hover:bg-soft-gold/20 rounded-lg flex items-center justify-center transition-colors duration-300">
														<StarIcon className="w-4 h-4" />
													</div>
													<div>
														<p className="font-medium text-sm">Mi Membresía</p>
														<p className="text-xs text-soft-beige/60">Gestionar plan</p>
													</div>
												</Link>
												<div className="h-px bg-soft-gray/10 my-2" />
												<button
													onClick={() => {
														signOut()
														setIsProfileOpen(false)
													}}
													className="flex items-center space-x-3 w-full px-3 py-3 text-soft-beige hover:text-warm-red hover:bg-warm-red/10 rounded-xl transition-all duration-300 group"
												>
													<div className="w-9 h-9 bg-soft-gray/10 group-hover:bg-warm-red/20 rounded-lg flex items-center justify-center transition-colors duration-300">
														<LogOutIcon className="w-4 h-4" />
													</div>
													<div className="text-left">
														<p className="font-medium text-sm">Cerrar Sesión</p>
														<p className="text-xs text-soft-beige/60">Salir de tu cuenta</p>
													</div>
												</button>
											</div>
										</div>
									)}
								</div>
								
							</>
						) : (
							<>
								<div className="flex items-center space-x-2">
									<Link 
										href="/auth/signin" 
										className="px-4 py-2 text-soft-beige hover:text-sunset-orange hover:bg-soft-gray/10 rounded-xl transition-all duration-300 font-medium text-sm"
									>
										Iniciar Sesión
									</Link>
									<Link 
										href="/auth/signup" 
										className="px-6 py-2.5 bg-gradient-to-r from-sunset-orange to-soft-gold hover:from-sunset-orange/90 hover:to-soft-gold/90 text-deep-night font-bold rounded-xl transition-all duration-300 hover:transform hover:scale-105 shadow-lg text-sm"
									>
										Registrarse
									</Link>
								</div>
							</>
						)}
					</div>

					{/* Enhanced Mobile menu button */}
					<button
						onClick={() => setIsMenuOpen(!isMenuOpen)}
						className="lg:hidden p-2.5 rounded-xl text-soft-beige hover:text-sunset-orange hover:bg-soft-gray/10 transition-all duration-300 border border-transparent hover:border-soft-gray/20"
						aria-label="Abrir menú"
					>
						<div className="relative w-5 h-5">
							<MenuIcon className={`absolute inset-0 transition-all duration-300 ${isMenuOpen ? 'opacity-0 rotate-180' : 'opacity-100 rotate-0'}`} />
							<XIcon className={`absolute inset-0 transition-all duration-300 ${isMenuOpen ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-180'}`} />
						</div>
					</button>
				</div>

				{/* Enhanced Mobile Navigation */}
				<div className={`lg:hidden overflow-hidden transition-all duration-300 ${
					isMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
				}`}>
					<div className="border-t border-soft-gray/10 bg-deep-night/98 backdrop-blur-3xl">
						<div className="p-4 space-y-1">
							{navItems.map(({ href, label, icon: Icon }) => (
								<Link 
									key={href}
									href={href} 
									className={`flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
										isActivePage(href)
											? 'text-sunset-orange bg-sunset-orange/10'
											: 'text-soft-beige hover:text-sunset-orange hover:bg-soft-gray/10'
									}`}
									onClick={() => setIsMenuOpen(false)}
								>
									<Icon className="w-5 h-5" />
									<span>{label}</span>
									{isActivePage(href) && (
										<div className="ml-auto w-2 h-2 bg-sunset-orange rounded-full" />
									)}
								</Link>
							))}
							
							{/* Cart Button - Solo para usuarios logueados no administradores */}
							{isAuthenticated && !isAdmin && (
								<button 
									onClick={() => {
										toggleCart()
										setIsMenuOpen(false)
									}}
									className="flex items-center space-x-3 w-full px-4 py-3 text-soft-beige hover:text-sunset-orange hover:bg-soft-gray/10 rounded-xl transition-all duration-300 font-medium relative"
								>
									<ShoppingCartIcon className="w-5 h-5" />
									<span>Carrito</span>
									{cartState.totalItems > 0 && (
										<div className="ml-auto w-6 h-6 bg-gradient-to-r from-sunset-orange to-soft-gold text-deep-night text-xs font-bold rounded-full flex items-center justify-center">
											{cartState.totalItems > 9 ? '9+' : cartState.totalItems}
										</div>
									)}
								</button>
							)}
							
							<div className="h-px bg-soft-gray/10 my-3" />
							
							{isAuthenticated ? (
								<>
									{/* Mobile User Info */}
									<div className="px-4 py-3 mb-2 bg-soft-gray/5 rounded-xl">
										<div className="flex items-center space-x-3">
											<div className="w-10 h-10 bg-gradient-to-br from-sunset-orange to-soft-gold rounded-xl flex items-center justify-center shadow-lg">
												<UserIcon className="w-5 h-5 text-deep-night" />
											</div>
											<div>
												<p className="text-soft-beige font-semibold text-sm">
													{user?.name || user?.email}
												</p>
												<div className="flex items-center space-x-1 mt-1">
													<StarIcon className={`w-3 h-3 ${getMembershipColor(user?.membershipName)}`} />
													<span className={`text-xs font-medium ${getMembershipColor(user?.membershipName)}`}>
														{user?.membershipName}
													</span>
												</div>
											</div>
										</div>
									</div>
									
									<Link 
										href="/memberships" 
										className="flex items-center space-x-3 px-4 py-3 text-soft-beige hover:text-sunset-orange hover:bg-soft-gray/10 rounded-xl transition-all duration-300 font-medium"
										onClick={() => setIsMenuOpen(false)}
									>
										<StarIcon className="w-5 h-5" />
										<span>Membresías</span>
									</Link>
									<Link 
										href="/profile" 
										className="flex items-center space-x-3 px-4 py-3 text-soft-beige hover:text-sunset-orange hover:bg-soft-gray/10 rounded-xl transition-all duration-300 font-medium"
										onClick={() => setIsMenuOpen(false)}
									>
										<UserIcon className="w-5 h-5" />
										<span>Mi Perfil</span>
									</Link>
									<button 
										onClick={() => {
											signOut()
											setIsMenuOpen(false)
										}}
										className="flex items-center space-x-3 w-full px-4 py-3 text-soft-beige hover:text-warm-red hover:bg-warm-red/10 rounded-xl transition-all duration-300 font-medium"
									>
										<LogOutIcon className="w-5 h-5" />
										<span>Cerrar Sesión</span>
									</button>
								</>
							) : (
								<div className="space-y-2">
									<Link 
										href="/auth/signin" 
										className="block px-4 py-3 text-soft-beige hover:text-sunset-orange hover:bg-soft-gray/10 rounded-xl transition-all duration-300 font-medium"
										onClick={() => setIsMenuOpen(false)}
									>
										Iniciar Sesión
									</Link>
									<Link 
										href="/auth/signup" 
										className="block px-4 py-3 bg-gradient-to-r from-sunset-orange to-soft-gold text-deep-night font-bold rounded-xl transition-all duration-300 text-center"
										onClick={() => setIsMenuOpen(false)}
									>
										Registrarse
									</Link>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</nav>
	)
} 
