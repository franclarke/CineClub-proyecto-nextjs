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

	// Si la ruta está protegida y no hay token, redirigir a /auth/signin
	if (isProtected && !token) {
		const signInUrl = new URL('/', request.url)
		return NextResponse.redirect(signInUrl)
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
	],
}