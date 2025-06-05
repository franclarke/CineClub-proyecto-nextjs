import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

// Rutas que requieren autenticación
const PROTECTED_PATHS = [
	'/dashboard',
	'/profile',
	'/reservations',
	'/cart',
]

export async function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl

	// Ignorar peticiones internas de next y archivos estáticos
	if (
		pathname.startsWith('/_next') ||
		pathname.startsWith('/static') ||
		pathname.endsWith('.ico') ||
		pathname === '/favicon.ico'
	) {
		return NextResponse.next()
	}

	// Comprobar si la ruta está protegida
	const isProtected = PROTECTED_PATHS.some(path => pathname.startsWith(path))

	// Obtener el token de sesión (JWT) de NextAuth
	const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })

	if (isProtected && !token) {
		// Usuario no autenticado intentando acceder → redirigir a /auth/signin
		const signInUrl = new URL('/auth/signin', request.url)
		return NextResponse.redirect(signInUrl)
	}

	// Si el usuario autenticado intenta acceder a /auth/signin, redirigirlo al dashboard
	if (pathname.startsWith('/auth/signin') && token) {
		const dashboardUrl = new URL('/dashboard', request.url)
		return NextResponse.redirect(dashboardUrl)
	}

	return NextResponse.next()
}

export const config = {
	matcher: [
		'/dashboard/:path*',
		'/profile/:path*',
		'/reservations/:path*',
		'/cart/:path*',
		'/auth/signin',
	],
} 