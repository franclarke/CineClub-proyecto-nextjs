'use server'
import { getAllUsers, getBanquitoUsers, getReposeraDeluxeUsers, getPuffXXLEstelarUsers, getUserById, editUserById } from './data-access'

export async function fetchUsersByMembership(membership: string) {
    if (membership === 'banquito') return await getBanquitoUsers()
    if (membership === 'reposera-deluxe') return await getReposeraDeluxeUsers()
    if (membership === 'puff-xxl-estelar') return await getPuffXXLEstelarUsers()
    return await getAllUsers()
}

// Nueva función para obtener un usuario por ID desde el cliente
export async function fetchUserByIdClient(id: string) {
    return await getUserById(id)
}

// Nueva función para editar un usuario por ID
export async function editUserByIdClient(id: string, data: any) {
    return await editUserById(id, data)
}