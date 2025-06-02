import NextAuth from 'next-auth'

declare module 'next-auth' {
	interface Session {
		user: {
			id: string
			email: string
			name?: string
			membershipId: string
			membershipName: string
			isAdmin: boolean
		}
	}

	interface User {
		id: string
		email: string
		name?: string
		membershipId: string
		membershipName: string
		isAdmin: boolean
	}
}

declare module 'next-auth/jwt' {
	interface JWT {
		membershipId: string
		membershipName: string
		isAdmin: boolean
	}
} 