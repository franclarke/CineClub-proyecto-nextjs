'use server'

import { prisma } from '@/lib/prisma'
import { deleteProductImage } from '@/lib/supabase'

/**
 * Obtiene todos los productos.
 */
export async function getAllProducts() {
    return prisma.product.findMany({
        orderBy: { createdAt: 'desc' },
    })
}

/**
 * Obtiene un producto por su ID.
 */
export async function getProductById(id: string) {
    return prisma.product.findUnique({
        where: { id },
    })
}

/**
 * Elimina un producto por su ID y su imagen asociada de Supabase.
 */
export async function deleteProduct(id: string) {
    // Obtener el producto primero para acceder a la imageUrl
    const product = await prisma.product.findUnique({
        where: { id },
    })

    if (!product) {
        throw new Error('Producto no encontrado')
    }

    console.log(`🗑️ Deleting product: ${product.name} (ID: ${id})`)

    // Eliminar imagen de Supabase si existe
    if (product.imageUrl) {
        console.log(`📸 Product has image, attempting to delete: ${product.imageUrl}`)
        try {
            const result = await deleteProductImage(product.imageUrl)
            if (!result.success && result.error) {
                console.error(`❌ Failed to delete product image: ${result.error}`)
                // Log error but continue with product deletion
            }
        } catch (error) {
            console.error('❌ Unexpected error deleting image from Supabase:', error)
            // Continuamos con la eliminación del producto aunque falle la imagen
        }
    }

    // Eliminar producto de la base de datos
    console.log(`🗄️ Deleting product from database: ${id}`)
    const deletedProduct = await prisma.product.delete({
        where: { id },
    })

    console.log(`✅ Successfully deleted product: ${product.name}`)
    return deletedProduct
}

/**
 * Agrega un nuevo producto.
 */
export async function addProduct(data: {
    name: string
    description?: string
    price: number
    stock: number
    imageUrl?: string
}) {
    // Ensure empty string and undefined are converted to null for database
    const cleanData = {
        ...data,
        imageUrl: (!data.imageUrl || data.imageUrl === '') ? null : data.imageUrl
    }

    return prisma.product.create({
        data: cleanData,
    })
}

/**
 * Actualiza un producto existente.
 */
export async function updateProduct(id: string, data: {
    name: string
    description?: string
    price: number
    stock: number
    imageUrl?: string
}) {
    console.log(`📝 Updating product: ${id}`)
    
    // Get current product to check for image changes
    const currentProduct = await prisma.product.findUnique({
        where: { id },
    })

    if (!currentProduct) {
        throw new Error('Producto no encontrado')
    }

    // Check if image was removed or changed
    const oldImageUrl = currentProduct.imageUrl
    const newImageUrl = data.imageUrl

    // If image was removed (old exists but new doesn't or is empty string)
    if (oldImageUrl && (!newImageUrl || newImageUrl === '')) {
        console.log(`🗑️ Image removed, deleting old image: ${oldImageUrl}`)
        try {
            const result = await deleteProductImage(oldImageUrl)
            if (!result.success && result.error) {
                console.error(`❌ Failed to delete old image: ${result.error}`)
            }
        } catch (error) {
            console.error('❌ Unexpected error deleting old image:', error)
        }
    }
    // If image was changed (both exist but different)
    else if (oldImageUrl && newImageUrl && oldImageUrl !== newImageUrl) {
        console.log(`🔄 Image changed, deleting old image: ${oldImageUrl}`)
        try {
            const result = await deleteProductImage(oldImageUrl)
            if (!result.success && result.error) {
                console.error(`❌ Failed to delete old image: ${result.error}`)
            }
        } catch (error) {
            console.error('❌ Unexpected error deleting old image:', error)
        }
    }

    // Ensure empty string and undefined are converted to null for database
    const cleanData = {
        ...data,
        imageUrl: (!data.imageUrl || data.imageUrl === '') ? null : data.imageUrl
    }

    const updatedProduct = await prisma.product.update({
        where: { id },
        data: cleanData,
    })

    console.log(`✅ Successfully updated product: ${updatedProduct.name}`)
    return updatedProduct
}