'use client'

import { useAuth } from '../hooks/use-auth'
import Navigation from '../(user)/components/Navigation'
import AdminNavigation from '../admin/components/AdminNavigation'

export default function ConditionalNavigation() {
	const { user, isAuthenticated, isLoading } = useAuth()

	// No mostrar nada mientras carga
	if (isLoading) {
		return null
	}

	// No mostrar navegación si no está autenticado
	if (!isAuthenticated) {
		return null
	}

	// Mostrar navegación de admin si es administrador
	if (user?.isAdmin) {
		return <AdminNavigation />
	}

	// Mostrar navegación común para usuarios regulares
	return <Navigation />
} 