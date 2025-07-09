import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
    const subscription = await req.json()
    const { endpoint, keys } = subscription

    try {
        await prisma.pushSubscription.upsert({
            where: { endpoint },
            update: { keys },
            create: { endpoint, keys }
        })
        return NextResponse.json({ success: true })
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 })
    }
}