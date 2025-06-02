import { withAuth } from 'next-auth/middleware'

export default withAuth(
	function middleware(req) {
		// Lógica adicional si es necesaria
	},
	{
		callbacks: {
			authorized: ({ token, req }) => {
				const { pathname } = req.nextUrl
				
				// Rutas públicas
				const publicRoutes = [
					'/auth/signin',
					'/auth/signup',
					'/',
				]
				
				// Si es una ruta pública, permitir acceso
				if (publicRoutes.includes(pathname)) {
					return true
				}
				
				// Para rutas protegidas, verificar token
				if (!token) {
					return false
				}
				
				// Protección de rutas de admin
				if (pathname.startsWith('/dashboard')) {
					return token.isAdmin === true
				}
				
				// Para otras rutas protegidas, solo verificar autenticación
				return true
			},
		},
	}
)

export const config = {
	matcher: [
		'/dashboard/:path*',
		'/events/:path*',
		'/cart/:path*',
		'/profile/:path*',
		'/reservations/:path*',
	],
} 