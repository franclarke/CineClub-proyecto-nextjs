import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { MembershipsClientComponent } from './MembershipsClientComponent'

async function getUserMembership(email: string) {
	const user = await prisma.user.findUnique({
		where: { email },
		include: {
			membership: {
				select: {
					id: true,
					name: true,
					price: true,
					benefits: true,
					priority: true
				}
			}
		}
	})

	if (!user) return null

	// Transform benefits from string|null to string[]
	return {
		...user,
		membership: {
			...user.membership,
			benefits: user.membership.benefits 
				? user.membership.benefits.split(',').map(b => b.trim())
				: []
		}
	}
}

async function getMembershipTiers() {
	return await prisma.membershipTier.findMany({
		orderBy: { priority: 'asc' }
	})
}

interface MembershipsDataAccessProps {
	upgrade?: string
}

export async function MembershipsDataAccess({ upgrade }: MembershipsDataAccessProps) {
	const session = await getServerSession(authOptions)
	
	const [user, membershipTiers] = await Promise.all([
		session?.user?.email ? getUserMembership(session.user.email) : Promise.resolve(null),
		getMembershipTiers()
	])

	return (
		<MembershipsClientComponent 
			user={user} 
			membershipTiers={membershipTiers}
			suggestedUpgrade={upgrade}
			isAuthenticated={!!session}
		/>
	)
} 
