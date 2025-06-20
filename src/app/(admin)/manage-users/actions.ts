'use server'
import { getAllUsers, getBronzeUsers, getSilverUsers, getGoldUsers, getUserById, editUserById } from './data-access'

export async function fetchUsersByMembership(membership: string) {
    if (membership === 'bronze') return await getBronzeUsers()
    if (membership === 'silver') return await getSilverUsers()
    if (membership === 'gold') return await getGoldUsers()
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