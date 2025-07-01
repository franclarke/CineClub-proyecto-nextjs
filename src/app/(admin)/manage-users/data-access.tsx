'use server'
import { prisma } from "@/lib/prisma"

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
 * Lista todos los usuarios con membresía Banquito.
 */
export async function getBanquitoUsers() {
    return prisma.user.findMany({
        where: {
            membership: {
                name: 'Banquito',
            },
        },
        include: {
            membership: true,
        },
        orderBy: { createdAt: 'asc' },
    })
}

/**
 * Lista todos los usuarios con membresía Reposera Deluxe.
 */
export async function getReposeraDeluxeUsers() {
    return prisma.user.findMany({
        where: {
            membership: {
                name: 'Reposera Deluxe',
            },
        },
        include: {
            membership: true,
        },
        orderBy: { createdAt: 'asc' },
    })
}

/**
 * Lista todos los usuarios con membresía Puff XXL Estelar.
 */
export async function getPuffXXLEstelarUsers() {
    return prisma.user.findMany({
        where: {
            membership: {
                name: 'Puff XXL Estelar',
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

export async function editUserById(id: string, data: Partial<{
    name: string
    email: string
    password: string
    membershipId?: string
    isAdmin?: boolean
}>) {
    return prisma.user.update({
        where: { id },
        data,
        include: { membership: true },
    })
}