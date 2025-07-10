import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { deleteEvent } from '@/app/(admin)/manage-events/data-access'

/**
 * DELETE /api/events/[id]
 * Elimina un evento específico (solo admins)
 */
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        // Verificar autenticación
        const session = await getServerSession(authOptions)
        if (!session?.user?.isAdmin) {
            return NextResponse.json(
                { error: 'No autorizado' },
                { status: 401 }
            )
        }

        const { id } = await params
        
        if (!id) {
            return NextResponse.json(
                { error: 'ID de evento requerido' },
                { status: 400 }
            )
        }

        // Eliminar el evento
        const result = await deleteEvent(id)

        if (!result.success) {
            return NextResponse.json(
                { error: result.error },
                { status: 400 }
            )
        }

        return NextResponse.json(
            { message: 'Evento eliminado correctamente' },
            { status: 200 }
        )
    } catch (error) {
        console.error('Error en DELETE /api/events/[id]:', error)
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        )
    }
} 