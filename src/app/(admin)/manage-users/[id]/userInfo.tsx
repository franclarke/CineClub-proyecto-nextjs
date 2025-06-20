'use client'

import React, { useState, useEffect } from 'react'
import { User, MembershipTier } from '@prisma/client'

interface UserWithMembership extends User {
  membershipTier: MembershipTier
}

interface UserInfoProps {
  userId: string
}

export function UserInfo({ userId }: UserInfoProps) {
  const [user, setUser] = useState<UserWithMembership | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({
    email: '',
    isAdmin: false,
    membershipTierId: ''
  })

  useEffect(() => {
    fetchUser()
  }, [userId])

  const fetchUser = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/admin/users/${userId}`)
      if (response.ok) {
        const userData = await response.json()
        setUser(userData)
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
  }

  const handleSave = async () => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editForm)
      })

      if (response.ok) {
        await fetchUser()
        setIsEditing(false)
      }
    } catch (error) {
      console.error('Error updating user:', error)
    }
  }

  const handleCancel = () => {
    if (user) {
      setEditForm({
        email: user.email,
        isAdmin: user.isAdmin,
        membershipTierId: user.membershipTier.id
      })
    }
    setIsEditing(false)
  }

  if (isLoading) {
    return (
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-700 rounded w-48 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-700 rounded w-full"></div>
            <div className="h-4 bg-gray-700 rounded w-3/4"></div>
            <div className="h-4 bg-gray-700 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="text-center">
          <h3 className="text-lg font-medium text-white mb-2">Usuario no encontrado</h3>
          <p className="text-gray-400">No se pudo cargar la información del usuario.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-white">Información del Usuario</h2>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
          >
            Editar
          </button>
        ) : (
          <div className="flex space-x-2">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Guardar
            </button>
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Cancelar
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              ID de Usuario
            </label>
            <div className="px-3 py-2 bg-gray-700 rounded-lg text-gray-400 text-sm font-mono">
              {user.id}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Email
            </label>
            {isEditing ? (
              <input
                type="email"
                value={editForm.email}
                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            ) : (
              <div className="px-3 py-2 bg-gray-700 rounded-lg text-white">
                {user.email}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Fecha de Registro
            </label>
            <div className="px-3 py-2 bg-gray-700 rounded-lg text-white">
              {new Date(user.createdAt).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Membresía
            </label>
            <div className="px-3 py-2 bg-gray-700 rounded-lg text-white">
              <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                user.membershipTier.name === 'Oro' ? 'bg-yellow-900 text-yellow-200' :
                user.membershipTier.name === 'Plata' ? 'bg-gray-600 text-gray-200' :
                'bg-orange-900 text-orange-200'
              }`}>
                {user.membershipTier.name}
              </span>
            </div>
          </div>

          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={isEditing ? editForm.isAdmin : user.isAdmin}
                onChange={(e) => isEditing && setEditForm({ ...editForm, isAdmin: e.target.checked })}
                disabled={!isEditing}
                className="rounded border-gray-600 bg-gray-700 text-orange-600 focus:ring-orange-500 focus:ring-offset-gray-800"
              />
              <span className="text-sm font-medium text-gray-300">
                Administrador
              </span>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Estado
            </label>
            <div className="px-3 py-2 bg-gray-700 rounded-lg">
              <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-green-900 text-green-200">
                Activo
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 