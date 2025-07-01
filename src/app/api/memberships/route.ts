import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
	try {
		const memberships = await prisma.membershipTier.findMany()
		return NextResponse.json(memberships)
	} catch (error) {
		console.error('Error fetching memberships:', error)
		return NextResponse.json({ error: 'Error fetching memberships' }, { status: 500 })
	}
} 
