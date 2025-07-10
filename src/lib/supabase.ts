import { createClient } from '@supabase/supabase-js'

// Get environment variables with client-side compatibility
const getSupabaseUrl = () => {
  if (typeof window !== 'undefined') {
    // Client-side
    return process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
  } else {
    // Server-side
    return process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
  }
}

const getSupabaseKey = () => {
  if (typeof window !== 'undefined') {
    // Client-side
    return process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY
  } else {
    // Server-side
    return process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  }
}

// Function to check if Supabase is configured
const checkSupabaseConfig = () => {
  const url = getSupabaseUrl()
  const key = getSupabaseKey()
  
  // Debug logging
  console.log('🔍 Verificando configuración de Supabase...')
  console.log('📍 Environment:', typeof window !== 'undefined' ? 'client' : 'server')
  console.log('🌐 URL configurada:', url ? `✅ ${url.substring(0, 30)}...` : '❌ No definida')
  console.log('🔑 Key configurada:', key ? `✅ ${key.substring(0, 30)}...` : '❌ No definida')
  
  const isValid = url && key && 
    url !== 'https://your-project.supabase.co' && 
    key !== 'your-anon-key-here' &&
    url.includes('supabase.co')
    
  console.log('✅ Configuración válida:', isValid ? '✅ Sí' : '❌ No')
  
  return isValid
}

// Check configuration
const isSupabaseConfigured = checkSupabaseConfig()

// Create Supabase client only if properly configured
export const supabase = isSupabaseConfigured 
  ? createClient(getSupabaseUrl()!, getSupabaseKey()!)
  : null

console.log('🔌 Cliente Supabase:', supabase ? '✅ Creado correctamente' : '❌ No se pudo crear')

/**
 * Check if Supabase is properly configured
 * This function works both on client and server
 */
export function isSupabaseReady(): boolean {
  const configured = checkSupabaseConfig()
  return Boolean(configured)
}

/**
 * Get configuration error message
 */
export function getSupabaseConfigError(): string {
  const url = getSupabaseUrl()
  const key = getSupabaseKey()
  
  if (!url || url === 'https://your-project.supabase.co') {
    return 'SUPABASE_URL no está configurada correctamente. Revisa tu archivo .env'
  }
  if (!key || key === 'your-anon-key-here') {
    return 'SUPABASE_ANON_KEY no está configurada correctamente. Revisa tu archivo .env'
  }
  if (!url.includes('supabase.co')) {
    return 'SUPABASE_URL no parece ser una URL válida de Supabase'
  }
  return 'Configuración de Supabase incompleta'
}

/**
 * Test Supabase connection
 */
export async function testSupabaseConnection(): Promise<{ success: boolean; error?: string }> {
  try {
    if (!isSupabaseReady()) {
      return { success: false, error: getSupabaseConfigError() }
    }

    if (!supabase) {
      return { success: false, error: 'Cliente de Supabase no disponible' }
    }

    // Test storage connection
    const { data, error } = await supabase.storage
      .from('products')
      .list('', { limit: 1 })

    if (error) {
      return { 
        success: false, 
        error: `Error accessing products bucket: ${error.message}. Verifica que el bucket "products" exista y sea público.` 
      }
    }

    return { success: true }
  } catch (error) {
    return { success: false, error: 'Error inesperado al verificar conexión' }
  }
}

/**
 * Uploads an image file to the products bucket in Supabase
 * @param file - The file to upload
 * @param productId - The product ID to use as filename prefix
 * @returns Promise with the public URL or error
 */
export async function uploadProductImage(file: File, productId: string): Promise<{ url?: string; error?: string }> {
  try {
    if (!isSupabaseConfigured) {
      return { error: getSupabaseConfigError() }
    }

    if (!supabase) {
      return { error: 'Cliente de Supabase no disponible' }
    }

    // Generate unique filename
    const fileExt = file.name.split('.').pop()
    const fileName = `${productId}_${Date.now()}.${fileExt}`
    
    // Upload to Supabase storage
    const { data, error } = await supabase.storage
      .from('products')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) {
      return { error: error.message }
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('products')
      .getPublicUrl(data.path)

    return { url: publicUrl }
  } catch (error) {
    return { error: 'Error uploading image' }
  }
}

/**
 * Deletes an image from the products bucket
 * @param imageUrl - The full URL or path of the image to delete
 * @returns Promise with success status
 */
export async function deleteProductImage(imageUrl: string): Promise<{ success: boolean; error?: string }> {
  try {
    if (!imageUrl) return { success: true }

    if (!isSupabaseConfigured) {
      console.warn('Supabase not configured, skipping image deletion')
      return { success: true } // Don't fail the product deletion
    }

    if (!supabase) {
      return { success: false, error: 'Cliente de Supabase no disponible' }
    }
    
    // Extract filename from URL
    const urlParts = imageUrl.split('/')
    const fileName = urlParts[urlParts.length - 1]
    
    const { error } = await supabase.storage
      .from('products')
      .remove([fileName])

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    return { success: false, error: 'Error deleting image' }
  }
}

/**
 * Updates an existing product image (deletes old one and uploads new one)
 * @param file - The new file to upload
 * @param productId - The product ID
 * @param oldImageUrl - The URL of the old image to delete
 * @returns Promise with the new public URL or error
 */
export async function updateProductImage(
  file: File, 
  productId: string, 
  oldImageUrl?: string
): Promise<{ url?: string; error?: string }> {
  try {
    if (!isSupabaseConfigured) {
      return { error: getSupabaseConfigError() }
    }

    // Delete old image if exists
    if (oldImageUrl) {
      await deleteProductImage(oldImageUrl)
    }

    // Upload new image
    return await uploadProductImage(file, productId)
  } catch (error) {
    return { error: 'Error updating image' }
  }
} 