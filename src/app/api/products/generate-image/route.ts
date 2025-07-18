import { NextRequest, NextResponse } from 'next/server'
import { generateProductImage } from '@/lib/gemini/generateProductImage'

export async function POST(request: NextRequest) {
    try {
        const { productName } = await request.json()

        if (!productName || typeof productName !== 'string') {
            return NextResponse.json(
                { error: 'Nombre del producto es requerido' },
                { status: 400 }
            )
        }

        const result = await generateProductImage(productName)

        if (!result.success) {
            return NextResponse.json(
                { error: result.error },
                { status: 500 }
            )
        }

        return NextResponse.json({
            success: true,
            imageData: result.imageData
        })

    } catch (error) {
        console.error('Error en generate-image API:', error)
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        )
    }
} 