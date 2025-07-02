'use server'

import { prisma } from '@/lib/prisma'

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
 * Elimina un producto por su ID.
 */
export async function deleteProduct(id: string) {
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
}) {
    return prisma.product.create({
        data,
    })
}