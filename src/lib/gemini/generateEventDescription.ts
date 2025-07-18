/**
 * Genera una descripción de evento usando la API de Gemini
 * @param movieTitle - Título de la película
 * @param movieOverview - Sinopsis de la película (opcional)
 * @param movieYear - Año de la película (opcional)
 * @param movieRating - Rating de la película (opcional)
 * @returns Promise con la descripción generada o error
 */
export async function generateEventDescription(
    movieTitle: string,
    movieOverview?: string,
    movieYear?: string,
    movieRating?: number
): Promise<{ success: boolean; description?: string; error?: string }> {
    try {
        const apiKey = process.env.GEMINI_API_KEY
        if (!apiKey) {
            return { success: false, error: 'API key de Gemini no configurada' }
        }

        const movieInfo = [
            `Película: ${movieTitle}`,
            movieYear && `Año: ${movieYear}`,
            movieRating && `Rating: ${movieRating}/10`,
            movieOverview && `Sinopsis: ${movieOverview}`
        ].filter(Boolean).join('\n')

        const prompt = `Genera una descripción atractiva y emocionante para un evento de cine al aire libre bajo las estrellas.

Información de la película:
${movieInfo}

La descripción debe:
- Ser breve pero impactante (máximo 150 palabras)
- Evocar la experiencia mágica del cine al aire libre
- Mencionar elementos como "bajo las estrellas", "experiencia única", "ambiente mágico"
- Ser emocionante y persuasiva para que la gente quiera asistir
- Incluir el título de la película de forma natural
- Tener un tono cálido y acogedor
- Terminar con una invitación sutil

Genera solo la descripción, sin títulos ni formato adicional.`

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [
                            { text: prompt }
                        ]
                    }],
                    generationConfig: {
                        temperature: 0.8,
                        maxOutputTokens: 200
                    }
                })
            }
        )

        if (!response.ok) {
            const errorData = await response.json()
            console.error('Error en la API de Gemini:', errorData)
            return { 
                success: false, 
                error: `Error en la API: ${errorData.error?.message || 'Error desconocido'}` 
            }
        }

        const data = await response.json()
        
        const description = data.candidates?.[0]?.content?.parts?.[0]?.text

        if (!description) {
            return { 
                success: false, 
                error: 'No se generó ninguna descripción en la respuesta' 
            }
        }

        return { success: true, description: description.trim() }

    } catch (error) {
        console.error('Error generando descripción con Gemini:', error)
        return { 
            success: false, 
            error: error instanceof Error ? error.message : 'Error desconocido' 
        }
    }
} 