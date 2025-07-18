import { NextRequest, NextResponse } from 'next/server'
import { generateProductDescription } from '@/lib/gemini/generateProductDescription'

export async function POST(request: NextRequest) {
    try {
        const { productName, productType } = await request.json()

        if (!productName || typeof productName !== 'string') {
            return NextResponse.json(
                { error: 'Nombre del producto es requerido' },
                { status: 400 }
            )
        }

        const result = await generateProductDescription(productName, productType)

        if (!result.success) {
            return NextResponse.json(
                { error: result.error },
                { status: 500 }
            )
        }

        return NextResponse.json({
            success: true,
            description: result.description
        })

    } catch (error) {
        console.error('Error en generate-description API:', error)
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        )
    }
} 