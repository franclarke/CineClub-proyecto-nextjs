'use client'

import { useSession, signOut as nextAuthSignOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export function useAuth() {
	const { data: session, status } = useSession()
	const router = useRouter()

	const signOut = async () => {
		await nextAuthSignOut({ redirect: false })
		router.push('/')
	}

	const redirectToSignIn = () => {
		router.push('/auth/signin')
	}

	const redirectToSignUp = () => {
		router.push('/auth/signup')
	}

	return {
		user: session?.user,
		isLoading: status === 'loading',
		isAuthenticated: status === 'authenticated',
		isAdmin: session?.user?.isAdmin ?? false,
		membershipName: session?.user?.membershipName,
		signOut,
		redirectToSignIn,
		redirectToSignUp,
	}
} 
