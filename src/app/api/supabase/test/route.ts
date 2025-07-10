import { NextResponse } from 'next/server'
import { isSupabaseReady, getSupabaseConfigError, supabase } from '@/lib/supabase'

/**
 * Test endpoint to verify Supabase configuration
 */
export async function GET() {
  try {
    // Check if Supabase is configured
    if (!isSupabaseReady()) {
      return NextResponse.json({
        success: false,
        error: getSupabaseConfigError(),
        configured: false
      }, { status: 400 })
    }

    // Test storage connection
    if (!supabase) {
      return NextResponse.json({
        success: false,
        error: 'Cliente de Supabase no disponible',
        configured: true
      }, { status: 500 })
    }

    // Test bucket access
    const { data, error } = await supabase.storage
      .from('products')
      .list('', {
        limit: 1
      })

    if (error) {
      return NextResponse.json({
        success: false,
        error: `Error accessing products bucket: ${error.message}`,
        configured: true,
        suggestion: 'Verifica que el bucket "products" exista y sea público'
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      configured: true,
      message: 'Supabase configurado correctamente',
      bucket: 'products bucket accessible'
    })

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Error inesperado al verificar configuración',
      configured: false
    }, { status: 500 })
  }
} 