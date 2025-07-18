import { NextRequest, NextResponse } from 'next/server'
import { checkProductReferences } from '@/app/(admin)/manage-products/data-access'

export async function POST(request: NextRequest) {
    try {
        const { productId } = await request.json()

        if (!productId) {
            return NextResponse.json(
                { error: 'Product ID is required' },
                { status: 400 }
            )
        }

        const references = await checkProductReferences(productId)

        return NextResponse.json({
            success: true,
            data: references
        })
    } catch (error) {
        console.error('Error checking product references:', error)
        
        if (error instanceof Error) {
            return NextResponse.json(
                { error: error.message },
                { status: 400 }
            )
        }

        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
} 