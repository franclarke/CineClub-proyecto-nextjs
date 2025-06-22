import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from './prisma'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

const loginSchema = z.object({
	email: z.string().email(),
	password: z.string().min(6),
})

export const authOptions: NextAuthOptions = {
	providers: [
		CredentialsProvider({
			name: 'credentials',
			credentials: {
				email: { label: 'Email', type: 'email' },
				password: { label: 'Password', type: 'password' },
			},
			async authorize(credentials) {
				try {
					const { email, password } = loginSchema.parse(credentials)

					const user = await prisma.user.findUnique({
						where: { email },
						include: {
							membership: true,
						},
					})

					if (!user) {
						return null
					}

					const isPasswordValid = await bcrypt.compare(password, user.password)

					if (!isPasswordValid) {
						return null
					}

					return {
						id: user.id,
						email: user.email,
						name: user.name || undefined,
						membershipId: user.membershipId,
						membershipName: user.membership.name,
						isAdmin: user.isAdmin,
					}
				} catch {
					return null
				}
			},
		}),
	],
	session: {
		strategy: 'jwt',
	},
	callbacks: {
		async jwt({ token, user }) {
			if (user) {
				token.membershipId = user.membershipId
				token.membershipName = user.membershipName
				token.isAdmin = user.isAdmin
			}
			return token
		},
		async session({ session, token }) {
			if (session.user) {
				session.user.id = token.sub!
				session.user.membershipId = token.membershipId as string
				session.user.membershipName = token.membershipName as string
				session.user.isAdmin = token.isAdmin as boolean
			}
			return session
		},
	},
	pages: {
		signIn: '/auth/signin',
	},
	secret: process.env.NEXTAUTH_SECRET,
} 
