import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

// Rutas que requieren autenticación
const PROTECTED_PATHS = [
	'/profile',
	'/reservations',
	'/cart',
	'/events/[id]/seats',
	'/checkout',
	'/wallet',
]

// Rutas que requieren rol de administrador
const ADMIN_PATHS = [
	'/admin',
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
	const isAdminPath = ADMIN_PATHS.some(path => pathname.startsWith(path))

	// Obtener el token de sesión (JWT) de NextAuth
	const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })

	// Si la ruta está protegida y no hay token, redirigir a /auth/signin
	if (isProtected && !token) {
		const signInUrl = new URL('/', request.url)
		return NextResponse.redirect(signInUrl)
	}

	// Si es una ruta de admin, verificar que el usuario sea administrador
	if (isAdminPath) {
		if (!token) {
			const signInUrl = new URL('/', request.url)
			return NextResponse.redirect(signInUrl)
		}
		
		if (!token.isAdmin) {
			// Redirigir a página de acceso denegado o home
			const accessDeniedUrl = new URL('/', request.url)
			return NextResponse.redirect(accessDeniedUrl)
		}
	}

	return NextResponse.next()
}

export const config = {
	matcher: [
		'/profile/:path*',
		'/reservations/:path*',
		'/cart/:path*',
		'/events/:path*/seats',
		'/checkout/:path*',
		'/wallet/:path*',
		'/auth/signin',
		'/admin/:path*',
	],
}