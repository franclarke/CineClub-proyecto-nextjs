import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

// Rutas que requieren autenticación (usar paths exactos)
const PROTECTED_ROUTES = [
	'/profile',
	'/cart',
	'/checkout',
	'/wallet',
	'/reservations'
]

// Rutas que requieren rol de administrador
const ADMIN_ROUTES = ['/admin']

// Función para verificar si una ruta está protegida
function isProtectedRoute(pathname: string): boolean {
	return PROTECTED_ROUTES.some(route => {
		// Verificación exacta para rutas base
		if (pathname === route) return true
		// Verificación para subrutas (ej: /profile/edit, /events/123/seats)
		if (pathname.startsWith(route + '/')) return true
		return false
	})
}

// Función para verificar rutas de admin
function isAdminRoute(pathname: string): boolean {
	return ADMIN_ROUTES.some(route => pathname.startsWith(route))
}

// Función para verificar rutas específicas que requieren autenticación
function requiresAuth(pathname: string): boolean {
	// Verificar rutas protegidas generales
	if (isProtectedRoute(pathname)) return true
	
	// Verificar patrón específico para seats: /events/[id]/seats
	if (pathname.match(/^\/events\/[^\/]+\/seats/)) return true
	
	return false
}

export async function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl

	// Ignorar peticiones internas de next y archivos estáticos
	if (
		pathname.startsWith('/_next') ||
		pathname.startsWith('/api') ||
		pathname.startsWith('/static') ||
		pathname.includes('.') ||
		pathname === '/favicon.ico'
	) {
		return NextResponse.next()
	}

	// Obtener el token de sesión (JWT) de NextAuth
	const token = await getToken({ 
		req: request, 
		secret: process.env.NEXTAUTH_SECRET 
	})

	// Verificar rutas que requieren autenticación
	if (requiresAuth(pathname)) {
		if (!token) {
			const loginUrl = new URL('/', request.url)
			loginUrl.searchParams.set('redirect', pathname)
			return NextResponse.redirect(loginUrl)
		}
	}

	// Verificar rutas de admin
	if (isAdminRoute(pathname)) {
		if (!token) {
			const loginUrl = new URL('/', request.url)
			return NextResponse.redirect(loginUrl)
		}
		
		if (!token.isAdmin) {
			const accessDeniedUrl = new URL('/', request.url)
			return NextResponse.redirect(accessDeniedUrl)
		}
	}

	return NextResponse.next()
}

export const config = {
	matcher: [
		'/profile/:path*',
		'/cart/:path*', 
		'/checkout/:path*',
		'/wallet/:path*',
		'/reservations/:path*',
		'/events/:path*/seats',
		'/admin/:path*',
	],
}