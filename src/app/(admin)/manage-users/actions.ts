'use server'
import { getAllUsers, getBronzeUsers, getSilverUsers, getGoldUsers } from './data-access'

export async function fetchUsersByMembership(membership: string) {
    if (membership === 'bronze') return await getBronzeUsers()
    if (membership === 'silver') return await getSilverUsers()
    if (membership === 'gold') return await getGoldUsers()
    return await getAllUsers()
}
