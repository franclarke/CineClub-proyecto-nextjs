import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
    try {
        // Simular limpieza de caché
        console.log('🧹 Clearing product cache...')
        
        return NextResponse.json({
            success: true,
            message: 'Cache cleared successfully'
        })
    } catch (error) {
        console.error('Error clearing cache:', error)
        
        return NextResponse.json(
            { error: 'Failed to clear cache' },
            { status: 500 }
        )
    }
} 