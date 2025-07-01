'use client'

import React, { useEffect, useState } from 'react'
import React, { useState, useEffect, useCallback } from 'react'
import { User, MembershipTier } from '@prisma/client'
import { fetchUserByIdClient, editUserByIdClient } from '../actions'
import { PencilIcon, ArrowLeftIcon } from 'lucide-react'
import Link from 'next/link'

interface UserWithMembership extends User {
  membership: MembershipTier
}

interface UserInfoProps {
  userId: string
}

export default function UserInfo({ userId }: UserInfoProps) {
  const [user, setUser] = useState<UserWithMembership | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    membershipTierId: ''
  })
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    const fetchUser = async () => {
      const fetchUser = useCallback(async () => {
        try {
          setIsLoading(true)
          try {
            const userData = await fetchUserByIdClient(userId)
            setUser(userData)
            if (userData) {
              setEditForm({
                name: userData.name || '',
                email: userData.email,
                membershipTierId: userData.membership?.id || ''
              })
            }
          } catch (error) {
            setUser(null)
          } finally {
            setIsLoading(false)
          }
        }
    fetchUser()
      }, [userId])
      setEditForm({
        email: userData.email,
        isAdmin: userData.isAdmin,
        membershipTierId: userData.membershipTierId
      })
    }
  } catch (error) {
    console.error('Error fetching user:', error)
  } finally {
    setIsLoading(false)
  }
}, [userId])

useEffect(() => {
  fetchUser()
}, [fetchUser])

const handleSave = async () => {
  try {
    const updatedUser = await editUserByIdClient(userId, {
      name: editForm.name,
      email: editForm.email,
      membershipId: editForm.membershipTierId
    })
    setUser(updatedUser)
    setIsEditing(false)
    setSuccess(true)
    setTimeout(() => setSuccess(false), 2000)
  } catch (error) {
    console.error('Error updating user:', error)
  }
}

const handleCancel = () => {
  if (user) {
    setEditForm({
      name: user.name || '',
      email: user.email,
      membershipTierId: user.membership?.id || ''
    })
  }
  setIsEditing(false)
}

if (isLoading) {
  return (
    <div className="bg-gray-900 rounded-2xl p-8 shadow-lg animate-pulse">
      <div className="h-8 bg-gray-700 rounded w-1/3 mb-6"></div>
      <div className="space-y-4">
        <div className="h-5 bg-gray-700 rounded w-full"></div>
        <div className="h-5 bg-gray-700 rounded w-2/3"></div>
        <div className="h-5 bg-gray-700 rounded w-1/2"></div>
      </div>
    </div>
  )
}

if (!user) {
  return (
    <div className="bg-gray-900 rounded-2xl p-8 shadow-lg">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-white mb-2">Usuario no encontrado</h3>
        <p className="text-gray-400">No se pudo cargar la información del usuario.</p>
      </div>
    </div>
  )
}

return (
  <div className="bg-gray-900 rounded-2xl p-4 shadow-lg max-w-xl mt-10 mx-auto">
    {success && (
      <div className="mb-4 text-green-400 bg-green-900/60 rounded-lg px-4 py-2 text-center font-semibold transition-all duration-500">
        ¡Usuario actualizado correctamente!
      </div>
    )}
    <div className="flex justify-between items-center mb-8">
      <Link
        href="/manage-users"
        className="flex items-center gap-2 text-gray-300 hover:text-orange-400 transition"
      >
        <ArrowLeftIcon className="w-5 h-5" />
        <span className="hidden sm:inline">Volver</span>
      </Link>
      {!isEditing ? (
        <button
          onClick={() => setIsEditing(true)}
          className="p-2 rounded-full bg-gray-800 hover:bg-orange-600 transition flex items-center justify-center"
          title="Editar usuario"
        >
          <PencilIcon className="w-5 h-5 text-orange-400" />
        </button>
      ) : (
        <div className="flex space-x-2">
          <button
            onClick={handleSave}
            className="px-5 py-2 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-lg shadow hover:from-green-700 hover:to-green-600 transition"
          >
            Guardar
          </button>
          <button
            onClick={handleCancel}
            className="px-5 py-2 bg-gray-700 text-white rounded-lg shadow hover:bg-gray-600 transition"
          >
            Cancelar
          </button>
        </div>
      )}
    </div>

    <form
      className="space-y-6"
      onSubmit={e => {
        e.preventDefault()
        handleSave()
      }}
    >
      <div>
        <label className="block text-sm font-semibold text-gray-300 mb-1">
          Nombre
        </label>
        {isEditing ? (
          <input
            type="text"
            value={editForm.name}
            onChange={e => setEditForm({ ...editForm, name: e.target.value })}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
            required
          />
        ) : (
          <div className="px-4 py-2 bg-gray-800 rounded-lg text-white">
            {user.name || <span className="text-gray-400 italic">Sin nombre</span>}
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-300 mb-1">
          Email
        </label>
        {isEditing ? (
          <input
            type="email"
            value={editForm.email}
            onChange={e => setEditForm({ ...editForm, email: e.target.value })}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
            required
          />
        ) : (
          <div className="px-4 py-2 bg-gray-800 rounded-lg text-white">
            {user.email}
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-300 mb-1">
          Membresía
        </label>
        {isEditing ? (
          <select
            value={editForm.membershipTierId}
            onChange={e => setEditForm({ ...editForm, membershipTierId: e.target.value })}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
          >
            <option value="">Sin membresía</option>
            {/* Puedes mapear tus membresías reales aquí */}
            <option value="1">Bronce</option>
            <option value="2">Plata</option>
            <option value="3">Oro</option>
          </select>
        ) : (
          <div className="px-4 py-2 bg-gray-800 rounded-lg text-white">
            <span className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold
                ${user.membership.name === 'Oro' ? 'bg-yellow-900 text-yellow-200' :
                user.membership.name === 'Plata' ? 'bg-gray-600 text-gray-200' :
                  user.membership.name === 'Bronze' ? 'bg-orange-900 text-orange-200' :
                    'bg-gray-700 text-gray-300'
              }`}>
              {user.membership.name}
            </span>
          </div>
        )}
      </div>
    </form>

    <div className="mt-8 text-xs text-gray-500 text-center">
      ID de usuario: <span className="font-mono">{user.id}</span>
    </div>
    <div className="mt-1 text-xs text-gray-500 text-center">
      Registrado el {new Date(user.createdAt).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })}
    </div>
  </div>
)
}