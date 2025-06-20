'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '../hooks/use-auth'
import { ChevronDownIcon, LogOutIcon, LayoutDashboardIcon, CalendarDaysIcon, HomeIcon, UserIcon, CogIcon } from 'lucide-react'

export default function AdminNavigation() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [isProfileOpen, setIsProfileOpen] = useState(false)
    const { user, isAuthenticated, signOut, isLoading } = useAuth()

    if (isLoading) {
        return (
            <nav className="fixed top-0 left-0 right-0 z-50 bg-deep-night/95 backdrop-blur-sm border-b border-soft-gray/20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <Link href="/" className="flex items-center space-x-2">
                            <div className="w-10 h-10 bg-gradient-sunset rounded-full flex items-center justify-center">
                                <span className="text-deep-night font-bold text-xl">🎬</span>
                            </div>
                            <span className="font-bebas text-xl text-soft-beige hidden sm:block tracking-wider">
                                PUFF & CHILL
                            </span>
                        </Link>
                        <div className="w-8 h-8 border-2 border-sunset-orange border-t-transparent rounded-full animate-spin" />
                    </div>
                </div>
            </nav>
        )
    }

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-deep-night/10 backdrop-blur-3xl border-b border-soft-gray/60">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2">
                        <div className="w-10 h-10 bg-gradient-sunset rounded-full flex items-center justify-center">
                            <span className="text-deep-night font-bold text-xl">🎬</span>
                        </div>
                        <span className="font-bebas text-xl text-soft-beige hidden sm:block tracking-wider">
                            PUFF & CHILL
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex  items-center space-x-8">
                        <Link
                            href="/dashboard"
                            className="flex items-center gap-2 text-soft-beige hover:text-sunset-orange hover:bg-soft-gray/20 transition-colors duration-200 px-3 py-2 rounded-md"
                        >
                            <LayoutDashboardIcon className="w-5 h-5" />
                            <span>Dashboard</span>
                        </Link>
                        <Link
                            href="/events"
                            className="flex items-center gap-2 text-soft-beige hover:text-sunset-orange hover:bg-soft-gray/20 transition-colors duration-200 px-3 py-2 rounded-md"
                        >
                            <CalendarDaysIcon className="w-5 h-5" />
                            <span>Eventos</span>
                        </Link>
                        <Link
                            href="/"
                            className="flex items-center gap-2 text-soft-beige hover:text-sunset-orange hover:bg-soft-gray/20 transition-colors duration-200 px-3 py-2 rounded-md"
                        >
                            <HomeIcon className="w-5 h-5" />
                            <span>Inicio</span>
                        </Link>
                    </div>

                    {/* Desktop Auth/Profile */}
                    <div className="hidden md:flex items-center space-x-4">
                        {isAuthenticated ? (
                            <div className="relative">
                                <button
                                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                                    className="flex items-center space-x-3 text-soft-beige hover:text-sunset-orange transition-colors duration-200"
                                >
                                    <div className="flex items-center space-x-2">
                                        <div className="w-8 h-8 bg-gradient-premium rounded-full flex items-center justify-center">
                                            <UserIcon className="w-4 h-4 text-deep-night" />
                                        </div>
                                        <div className="text-left">
                                            <div className="text-sm font-medium">{user?.name || user?.email}</div>
                                            <div className="text-xs text-soft-gold">{user?.membershipName}</div>
                                        </div>
                                    </div>
                                    <ChevronDownIcon className="w-4 h-4" />
                                </button>

                                {/* Profile Dropdown */}
                                {isProfileOpen && (
                                    <div className="absolute hover:bg right-0 mt-2 w-48 bg-deep-night bg-deep-night/10 backdrop-blur-3xl rounded-lg border border-soft-gray/20 shadow-glow">
                                        <div className="py-2">
                                            <Link
                                                href="/profile"
                                                className="flex items-center space-x-2 px-4 py-2 text-soft-beige hover:text-sunset-orange hover:bg-soft-gray/20 transition-colors duration-200"
                                                onClick={() => setIsProfileOpen(false)}
                                            >
                                                <UserIcon className="w-4 h-4" />
                                                <span>Mi Perfil</span>
                                            </Link>
                                            <Link
                                                href="/memberships"
                                                className="flex items-center space-x-2 px-4 py-2 text-soft-beige hover:text-sunset-orange hover:bg-soft-gray/20 transition-colors duration-200"
                                                onClick={() => setIsProfileOpen(false)}
                                            >
                                                <CogIcon className="w-4 h-4" />
                                                <span>Mi Membresía</span>
                                            </Link>
                                            <button
                                                onClick={() => {
                                                    signOut()
                                                    setIsProfileOpen(false)
                                                }}
                                                className="flex items-center space-x-2 w-full text-left px-4 py-2 text-soft-beige hover:text-warm-red hover:bg-soft-gray/20 transition-colors duration-200"
                                            >
                                                <LogOutIcon className="w-4 h-4" />
                                                <span>Cerrar Sesión</span>
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <>
                                <Link
                                    href="/auth/signin"
                                    className="text-soft-beige hover:text-sunset-orange transition-colors duration-200"
                                >
                                    Iniciar Sesión
                                </Link>
                                <Link
                                    href="/auth/signup"
                                    className="btn-primary px-6 py-2 rounded-lg font-medium transition-all duration-200"
                                >
                                    Registrarse
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="md:hidden p-2 rounded-lg text-soft-beige hover:text-sunset-orange transition-colors duration-200"
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
                    <div className="md:hidden border-t border-soft-gray/10 backdrop-blur-3xl">
                        <div className="px-2 pt-2 pb-3 space-y-1">
                            <Link
                                href="/dashboard"
                                className="flex items-center gap-2 px-3 py-2 text-soft-beige hover:text-sunset-orange hover:bg-soft-gray/20 transition-colors duration-200"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                <LayoutDashboardIcon className="w-5 h-5" />
                                <span>Dashboard</span>
                            </Link>
                            <Link
                                href="/events"
                                className="flex items-center gap-2 px-3 py-2 text-soft-beige hover:text-sunset-orange hover:bg-soft-gray/20 transition-colors duration-200"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                <CalendarDaysIcon className="w-5 h-5" />
                                <span>Eventos</span>
                            </Link>
                            <Link
                                href="/"
                                className="flex items-center gap-2 px-3 py-2 text-soft-beige hover:text-sunset-orange hover:bg-soft-gray/20 transition-colors duration-200"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                <HomeIcon className="w-5 h-5" />
                                <span>Inicio</span>
                            </Link>
                        </div>
                        {/* Bienvenida y cerrar sesión */}
                        <div className="border-t border-soft-gray/20 pt-4">
                            {isAuthenticated ? (
                                <>
                                    <div className="px-3 py-2">
                                        <span className="text-soft-beige text-sm">
                                            ¡Hola, {user?.name || user?.email}!
                                        </span>
                                        <div className="mt-1">
                                            <span className="text-xs bg-soft-gold/20 text-soft-gold px-2 py-1 rounded-full">
                                                {user?.membershipName}
                                            </span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => {
                                            signOut()
                                            setIsMenuOpen(false)
                                        }}
                                        className="flex items-center space-x-2 w-full text-left px-3 py-2 text-soft-beige hover:text-warm-red transition-colors duration-200"
                                    >
                                        <LogOutIcon className="w-4 h-4" />
                                        <span>Cerrar Sesión</span>
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link
                                        href="/auth/signin"
                                        className="block px-3 py-2 text-soft-beige hover:text-sunset-orange transition-colors duration-200"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Iniciar Sesión
                                    </Link>
                                    <Link
                                        href="/auth/signup"
                                        className="block mx-3 mt-2 btn-primary px-6 py-2 rounded-lg font-medium text-center transition-all duration-200"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Registrarse
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    )
}