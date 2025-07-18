import { NextRequest, NextResponse } from 'next/server'
import { generateEventDescription } from '@/lib/gemini/generateEventDescription'

export async function POST(request: NextRequest) {
    try {
        const { movieTitle, movieOverview, movieYear, movieRating } = await request.json()

        if (!movieTitle || typeof movieTitle !== 'string') {
            return NextResponse.json(
                { error: 'Título de la película es requerido' },
                { status: 400 }
            )
        }

        const result = await generateEventDescription(
            movieTitle,
            movieOverview,
            movieYear,
            movieRating
        )

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