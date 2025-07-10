import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getMembershipTiers } from '@/lib/actions/auth'
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



export async function MembershipsDataAccess() {
	const session = await getServerSession(authOptions)
	
	const [user, membershipTiers] = await Promise.all([
		session?.user?.email ? getUserMembership(session.user.email) : Promise.resolve(null),
		getMembershipTiers()
	])

	return (
		<MembershipsClientComponent 
			user={user} 
			membershipTiers={membershipTiers}
			isAuthenticated={!!session}
		/>
	)
} 
