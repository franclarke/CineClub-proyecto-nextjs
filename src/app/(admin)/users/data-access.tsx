'use server'
import { prisma } from '@/lib/prisma'

/**
 * Lista todos los usuarios.
 */
export async function getAllUsers() {
    return prisma.user.findMany({
        include: {
            membership: true,
        },
        orderBy: { createdAt: 'asc' },
    })
}

/**
 * Lista todos los usuarios con membresía Bronce.
 */
export async function getBronzeUsers() {
    return prisma.user.findMany({
        where: {
            membership: {
                name: 'Bronze',
            },
        },
        include: {
            membership: true,
        },
        orderBy: { createdAt: 'asc' },
    })
}

/**
 * Lista todos los usuarios con membresía Plata.
 */
export async function getSilverUsers() {
    return prisma.user.findMany({
        where: {
            membership: {
                name: 'Silver',
            },
        },
        include: {
            membership: true,
        },
        orderBy: { createdAt: 'asc' },
    })
}

/**
 * Lista todos los usuarios con membresía Oro.
 */
export async function getGoldUsers() {
    return prisma.user.findMany({
        where: {
            membership: {
                name: 'Gold',
            },
        },
        include: {
            membership: true,
        },
        orderBy: { createdAt: 'asc' },
    })
}

/**
 * Obtiene un usuario por su ID.
 */
export async function getUserById(id: string) {
    return prisma.user.findUnique({
        where: { id },
        include: { membership: true },
    })
}

/**
 * Actualiza un usuario existente.
 */
export async function updateUser(id: string, data: Partial<{
    name: string
    email: string
    password: string
    membershipId?: string
}>) {
    return prisma.user.update({
        where: { id },
        data,
    })
}

/**
 * Elimina un usuario por su ID.
 */
export async function deleteUser(id: string) {
    return prisma.user.delete({
        where: { id },
    })
}

/**
 * Lista todos los usuarios por tipo de membresía (nombre).
 */
export async function getUsersByMembership(name: string) {
    return prisma.user.findMany({
        where: {
            membership: {
                name,
            },
        },
        include: { membership: true },
        orderBy: { createdAt: 'asc' },
    })
}

/**
 * Lista todas las membresías.
 */
export async function getAllMemberships() {
    return prisma.membershipTier.findMany({
        orderBy: { name: 'asc' },
    })
}