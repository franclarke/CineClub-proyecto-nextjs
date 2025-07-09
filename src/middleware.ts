import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

// Rutas que requieren autenticación (usuarios regulares)
const PROTECTED_PATHS = [
	'/profile',
	'/cart',
	'/events',
	'/checkout',
	'/wallet',
	'/memberships'
]

// Rutas que requieren rol de administrador
const ADMIN_PATHS = [
	'/manage-users',
	'/manage-events',
	'/manage-products'
]

// Rutas públicas que no requieren autenticación
const PUBLIC_PATHS = [
	'/',
	'/api/auth'
]

export async function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl
	
	// Ignorar archivos estáticos, rutas internas de Next.js y rutas API
	if (
		pathname.startsWith('/_next') ||
		pathname.startsWith('/static') ||
		pathname.startsWith('/api') ||
		pathname.includes('.') ||
		pathname === '/favicon.ico'
	) {
		return NextResponse.next()
	}

	// Permitir rutas públicas sin verificación
	const isPublicPath = PUBLIC_PATHS.some(path => 
		path === pathname || pathname.startsWith(path)
	)
	
	if (isPublicPath) {
		return NextResponse.next()
	}

	// Obtener el token de sesión
	const token = await getToken({ 
		req: request, 
		secret: process.env.NEXTAUTH_SECRET 
	})

	// Verificar si es una ruta de administrador
	const isAdminPath = ADMIN_PATHS.some(path => pathname.startsWith(path))
	
	if (isAdminPath) {
		// Las rutas admin requieren autenticación Y rol de admin
		if (!token) {
			return NextResponse.redirect(new URL('/', request.url))
		}
		
		if (!token.isAdmin) {
			return NextResponse.redirect(new URL('/', request.url))
		}
		
		return NextResponse.next()
	}

	// Verificar si es una ruta protegida (usuarios regulares)
	const isProtectedPath = PROTECTED_PATHS.some(path => pathname.startsWith(path))
	
	if (isProtectedPath) {
		// Las rutas protegidas solo requieren autenticación
		if (!token) {
			return NextResponse.redirect(new URL('/', request.url))
		}
		
		return NextResponse.next()
	}

	// Para cualquier otra ruta, permitir acceso
	return NextResponse.next()
}

export const config = {
	matcher: [
		// Incluir todas las rutas excepto las que empiezan con:
		'/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)' 
	]
}
