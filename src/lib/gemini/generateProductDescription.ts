/**
 * Genera una descripción de producto usando la API de Gemini
 * @param productName - Nombre del producto
 * @param productType - Tipo/categoría del producto (opcional)
 * @returns Promise con la descripción generada o error
 */
export async function generateProductDescription(
    productName: string,
    productType?: string
): Promise<{ success: boolean; description?: string; error?: string }> {
    try {
        const apiKey = process.env.GEMINI_API_KEY
        if (!apiKey) {
            return { success: false, error: 'API key de Gemini no configurada' }
        }

        const prompt = `Genera una descripción breve, atractiva y profesional para un producto de snack o bebida premium de cine al aire libre.\n\nNombre: ${productName}${productType ? `\nTipo: ${productType}` : ''}\n\nLa descripción debe:\n- Ser clara y apetitosa (máx. 40 palabras)\n- Resaltar calidad, sabor y experiencia sensorial\n- Evocar el ambiente chill y nocturno del autocine bajo las estrellas\n- No incluir precios, ni frases genéricas\n- Terminar con una invitación sutil a probarlo\n\nSolo la descripción, sin títulos ni formato extra.`

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
                        maxOutputTokens: 100
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