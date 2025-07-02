import { getServerSession } from 'next-auth/next'
import { notFound } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { ProfileClientComponent } from './ProfileClientComponent'

async function getUserProfile(email: string) {
	return await prisma.user.findUnique({
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
			},
			reservations: {
				take: 5,
				orderBy: { createdAt: 'desc' },
				include: {
					event: {
						select: {
							title: true,
							dateTime: true,
							location: true
						}
					}
				}
			}
		}
	})
}

async function getMembershipTiers() {
	return await prisma.membershipTier.findMany({
		orderBy: { priority: 'asc' }
	})
}

export async function ProfileDataAccess() {
	const session = await getServerSession(authOptions)
	
	if (!session?.user?.email) {
		notFound()
	}

	const [userProfile, membershipTiers] = await Promise.all([
		getUserProfile(session.user.email),
		getMembershipTiers()
	])

	if (!userProfile) {
		notFound()
	}

	return (
		<ProfileClientComponent 
			user={userProfile} 
			membershipTiers={membershipTiers}
		/>
	)
} 
