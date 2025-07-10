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

    // Eliminar imagen de Supabase si existe
    if (product.imageUrl) {
        try {
            await deleteProductImage(product.imageUrl)
        } catch (error) {
            console.error('Error deleting image from Supabase:', error)
            // Continuamos con la eliminación del producto aunque falle la imagen
        }
    }

    // Eliminar producto de la base de datos
    return prisma.product.delete({
        where: { id },
    })
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
    return prisma.product.create({
        data,
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
    return prisma.product.update({
        where: { id },
        data,
    })
}