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
  
  const isValid = url && key && 
    url !== 'https://your-project.supabase.co' && 
    key !== 'your-anon-key-here' &&
    url.includes('supabase.co')
  
  return isValid
}

// Check configuration
const isSupabaseConfigured = checkSupabaseConfig()

// Create Supabase client only if properly configured
export const supabase = isSupabaseConfigured 
  ? createClient(getSupabaseUrl()!, getSupabaseKey()!)
  : null

// Supabase client initialized

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
 * Extracts the file path from a Supabase storage URL
 * @param imageUrl - The full Supabase storage URL
 * @returns The file path to use with storage.remove()
 */
function extractFilePathFromSupabaseUrl(imageUrl: string): string {
  // Handle different URL formats:
  // 1. Full Supabase URL: https://project.supabase.co/storage/v1/object/public/bucket/filename
  // 2. Relative path: products/filename
  // 3. Just filename: filename
  
  if (imageUrl.includes('/storage/v1/object/public/products/')) {
    // Extract everything after /products/
    const match = imageUrl.match(/\/storage\/v1\/object\/public\/products\/(.+)/)
    return match ? match[1] : imageUrl.split('/').pop() || imageUrl
  }
  
  if (imageUrl.startsWith('products/')) {
    // Remove the bucket prefix
    return imageUrl.replace('products/', '')
  }
  
  // If it's just a filename or unknown format, use the last part
  return imageUrl.split('/').pop() || imageUrl
}

/**
 * Deletes an image from the products bucket
 * @param imageUrl - The full URL or path of the image to delete
 * @returns Promise with success status
 */
export async function deleteProductImage(imageUrl: string): Promise<{ success: boolean; error?: string }> {
  try {
    if (!imageUrl) {
      return { success: true }
    }

    if (!isSupabaseConfigured) {
      return { success: true } // Don't fail the product deletion
    }

    if (!supabase) {
      return { success: false, error: 'Cliente de Supabase no disponible' }
    }
    
    // Extract filename from URL using the improved function
    const fileName = extractFilePathFromSupabaseUrl(imageUrl)
    
    const { error } = await supabase.storage
      .from('products')
      .remove([fileName])

    if (error) {
      // Check if the error is because the file doesn't exist
      if (error.message.includes('not found') || error.message.includes('does not exist')) {
        return { success: true } // Consider it successful if file doesn't exist
      }
      
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Error deleting image'
    return { success: false, error: errorMessage }
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

/**
 * Lists all files in the products bucket
 * @returns Promise with list of files or error
 */
export async function listProductImages(): Promise<{ files?: any[]; error?: string }> {
  try {
    if (!isSupabaseConfigured) {
      return { error: getSupabaseConfigError() }
    }

    if (!supabase) {
      return { error: 'Cliente de Supabase no disponible' }
    }

    const { data, error } = await supabase.storage
      .from('products')
      .list('', {
        limit: 100,
        offset: 0
      })

    if (error) {
      return { error: error.message }
    }

    return { files: data }
  } catch (error) {
    return { error: 'Error listing images' }
  }
}

/**
 * Checks if a file exists in the products bucket
 * @param fileName - The filename to check
 * @returns Promise with existence status
 */
export async function checkFileExists(fileName: string): Promise<{ exists: boolean; error?: string }> {
  try {
    if (!isSupabaseConfigured) {
      return { exists: false, error: getSupabaseConfigError() }
    }

    if (!supabase) {
      return { exists: false, error: 'Cliente de Supabase no disponible' }
    }

    const { data, error } = await supabase.storage
      .from('products')
      .list('', {
        search: fileName
      })

    if (error) {
      return { exists: false, error: error.message }
    }

    const exists = data.some(file => file.name === fileName)
    return { exists }
  } catch (error) {
    return { exists: false, error: 'Error checking file existence' }
  }
} 