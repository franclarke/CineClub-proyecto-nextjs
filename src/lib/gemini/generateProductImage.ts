/**
 * Genera una imagen de producto usando la API de Gemini
 * @param productName - Nombre del producto para incluir en el prompt
 * @returns Promise con la imagen generada en base64 o error
 */
export async function generateProductImage(productName: string): Promise<{ success: boolean; imageData?: string; error?: string }> {
    try {
        const apiKey = process.env.GEMINI_API_KEY
        if (!apiKey) {
            return { success: false, error: 'API key de Gemini no configurada' }
        }

        const prompt = `Fotografía cuadrada 1:1, resolución alta (≥1024×1024), que muestra ${productName} centrado y a foco nítido.  
– Fondo negro o gris antracita liso, sin texturas ni gradientes.  
– Iluminación de estudio cálida y tenue: key-light suave a 45°, fill muy bajo, realce sutil de contornos.  
– Estética premium-minimalista y cinematográfica, evocando un autocine nocturno bajo las estrellas.  
– Admite un reflejo o sombra suave en la base para profundidad 3-D.  
– Sin personas, tipografías, logotipos, bordes ni elementos que distraigan.  
– Resultado: imagen realista, elegante, sobria y moderna, con acabado profesional.`

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-preview-image-generation:generateContent?key=${apiKey}`,
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
                        responseModalities: ["TEXT", "IMAGE"]
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
        
        // Buscar la imagen en la respuesta
        const imagePart = data.candidates?.[0]?.content?.parts?.find(
            (part: any) => part.inlineData?.mimeType?.startsWith('image/')
        )

        if (!imagePart?.inlineData?.data) {
            return { 
                success: false, 
                error: 'No se generó ninguna imagen en la respuesta' 
            }
        }

        // La imagen viene en base64, la convertimos a data URL
        const mimeType = imagePart.inlineData.mimeType || 'image/png'
        const imageData = `data:${mimeType};base64,${imagePart.inlineData.data}`

        return { success: true, imageData }

    } catch (error) {
        console.error('Error generando imagen con Gemini:', error)
        return { 
            success: false, 
            error: error instanceof Error ? error.message : 'Error desconocido' 
        }
    }
} 