'use server'
import { getAllUsers, getBanquitoUsers, getReposeraDeluxeUsers, getPuffXXLEstelarUsers } from './data-access'

export async function fetchUsersByMembership(membership: string) {
    if (membership === 'banquito') return await getBanquitoUsers()
    if (membership === 'reposera-deluxe') return await getReposeraDeluxeUsers()
    if (membership === 'puff-xxl-estelar') return await getPuffXXLEstelarUsers()
    return await getAllUsers()
}
