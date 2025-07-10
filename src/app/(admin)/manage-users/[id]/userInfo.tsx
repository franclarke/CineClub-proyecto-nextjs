
'use client'

import React, { useEffect, useState } from 'react'
import { User, MembershipTier } from '@prisma/client'
import { fetchUserByIdClient, editUserByIdClient, fetchMembershipOptions } from '../actions'
import { PencilIcon, ArrowLeftIcon, User as UserIcon, Mail, Crown, Shield } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/app/components/ui/button'
import { Switch } from '@/app/components/ui/switch'

interface UserWithMembership extends User {
  membership: MembershipTier
}

interface UserInfoProps {
  userId: string
}

export default function UserInfo({ userId }: UserInfoProps) {
  const [user, setUser] = useState<UserWithMembership | null>(null)
  const [memberships, setMemberships] = useState<MembershipTier[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    membershipTierId: '',
    isAdmin: false
  })
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        // Fetch user and memberships in parallel
        const [userData, membershipData] = await Promise.all([
          fetchUserByIdClient(userId),
          fetchMembershipOptions()
        ])

        setUser(userData)
        setMemberships(membershipData)
        
        if (userData) {
          setEditForm({
            name: userData.name || '',
            email: userData.email,
            membershipTierId: userData.membership?.id || '',
            isAdmin: userData.isAdmin
          })
        }
      } catch (error) {
        setUser(null)
        setError('No se pudo cargar la información del usuario')
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [userId])

  const handleSave = async () => {
    try {
      setError(null)
      const updatedUser = await editUserByIdClient(userId, {
        name: editForm.name,
        email: editForm.email,
        membershipId: editForm.membershipTierId || null,
        isAdmin: editForm.isAdmin
      })
      setUser(updatedUser)
      setIsEditing(false)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (error) {
      console.error('Error updating user:', error)
      setError('Error al actualizar el usuario')
    }
  }

  const handleCancel = () => {
    if (user) {
      setEditForm({
        name: user.name || '',
        email: user.email,
        membershipTierId: user.membership?.id || '',
        isAdmin: user.isAdmin
      })
    }
    setIsEditing(false)
    setError(null)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-deep-night pt-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="card-modern p-8 animate-pulse">
            <div className="h-8 bg-soft-gray/20 rounded w-1/3 mb-6"></div>
            <div className="space-y-4">
              <div className="h-5 bg-soft-gray/20 rounded w-full"></div>
              <div className="h-5 bg-soft-gray/20 rounded w-2/3"></div>
              <div className="h-5 bg-soft-gray/20 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-deep-night pt-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="card-modern p-8">
            <div className="text-center">
              <UserIcon className="w-16 h-16 text-soft-beige/30 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-soft-beige mb-2">Usuario no encontrado</h3>
              <p className="text-soft-beige/70 mb-6">No se pudo cargar la información del usuario.</p>
              <Button asChild variant="secondary">
                <Link href="/manage-users">
                  <ArrowLeftIcon className="w-4 h-4 mr-2" />
                  Volver a usuarios
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-deep-night pt-20">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <Button asChild variant="secondary" size="sm">
            <Link href="/manage-users">
              <ArrowLeftIcon className="w-4 h-4 mr-2" />
              Volver a usuarios
            </Link>
          </Button>
        </div>

        {/* Title */}
        <div className="mb-8">
          <h1 className="text-display text-3xl text-soft-beige mb-2">
            Editar Usuario
          </h1>
          <p className="text-soft-beige/70">
            Gestiona la información y membresía del usuario
          </p>
        </div>

        {/* Messages */}
        {success && (
          <div className="mb-6 p-4 bg-dark-olive/20 border border-dark-olive/30 rounded-xl">
            <div className="flex items-center gap-2 text-dark-olive">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <span className="font-medium">Usuario actualizado correctamente</span>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-warm-red/20 border border-warm-red/30 rounded-xl">
            <div className="flex items-center gap-2 text-warm-red">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span className="font-medium">{error}</span>
            </div>
          </div>
        )}

        {/* User Form */}
        <div className="card-modern p-8">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-sunset-orange/20 rounded-lg flex items-center justify-center">
                <UserIcon className="w-6 h-6 text-sunset-orange" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-semibold text-soft-beige">
                    {user.name || 'Usuario sin nombre'}
                  </h2>
                  {user.isAdmin && (
                    <span className="px-2 py-1 bg-sunset-orange/20 text-sunset-orange border border-sunset-orange/30 rounded-full text-xs font-semibold">
                      Admin
                    </span>
                  )}
                </div>
                <p className="text-soft-beige/70 text-sm">
                  ID: {user.id.slice(0, 8)}...
                </p>
              </div>
            </div>
            
            {!isEditing ? (
              <Button
                onClick={() => setIsEditing(true)}
                variant="secondary"
                size="sm"
                className="flex items-center gap-2"
              >
                <PencilIcon className="w-4 h-4" />
                Editar
              </Button>
            ) : (
              <div className="flex space-x-2">
                <Button
                  onClick={handleSave}
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  Guardar
                </Button>
                <Button
                  onClick={handleCancel}
                  variant="secondary"
                  size="sm"
                >
                  Cancelar
                </Button>
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
            {/* Name Field */}
            <div>
              <label className="block text-soft-beige/70 font-medium mb-2">
                <UserIcon className="w-4 h-4 inline mr-2" />
                Nombre
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={editForm.name}
                  onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-soft-gray/10 text-soft-beige border border-soft-gray/20 focus:outline-none focus:ring-2 focus:ring-sunset-orange focus:border-transparent transition-base"
                  placeholder="Ingresa el nombre del usuario"
                  required
                />
              ) : (
                <div className="px-4 py-3 bg-soft-gray/10 rounded-xl text-soft-beige">
                  {user.name || <span className="text-soft-beige/50 italic">Sin nombre</span>}
                </div>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-soft-beige/70 font-medium mb-2">
                <Mail className="w-4 h-4 inline mr-2" />
                Email
              </label>
              {isEditing ? (
                <input
                  type="email"
                  value={editForm.email}
                  onChange={e => setEditForm({ ...editForm, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-soft-gray/10 text-soft-beige border border-soft-gray/20 focus:outline-none focus:ring-2 focus:ring-sunset-orange focus:border-transparent transition-base"
                  required
                />
              ) : (
                <div className="px-4 py-3 bg-soft-gray/10 rounded-xl text-soft-beige">
                  {user.email}
                </div>
              )}
            </div>

            {/* Membership Field */}
            <div>
              <label className="block text-soft-beige/70 font-medium mb-2">
                <Crown className="w-4 h-4 inline mr-2" />
                Membresía
              </label>
              {isEditing ? (
                <select
                  value={editForm.membershipTierId}
                  onChange={e => setEditForm({ ...editForm, membershipTierId: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-soft-gray/10 text-soft-beige border border-soft-gray/20 focus:outline-none focus:ring-2 focus:ring-sunset-orange focus:border-transparent transition-base"
                >
                  <option value="" className="bg-deep-night">Sin membresía</option>
                  {memberships.map(membership => (
                    <option key={membership.id} value={membership.id} className="bg-deep-night">
                      {membership.name}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="px-4 py-3 bg-soft-gray/10 rounded-xl">
                  <span
                    className={`
                      px-3 py-1 rounded-full text-xs font-semibold border inline-block
                      ${user.membership?.name === 'Puff XXL Estelar' ? 'bg-soft-gold/20 text-soft-gold border-soft-gold/30' :
                        user.membership?.name === 'Reposera Deluxe' ? 'bg-soft-beige/20 text-soft-beige border-soft-beige/30' :
                          user.membership?.name === 'Banquito' ? 'bg-sunset-orange/20 text-sunset-orange border-sunset-orange/30' :
                            'bg-soft-gray/20 text-soft-gray border-soft-gray/30'}
                    `}>
                    {user.membership?.name || 'Sin membresía'}
                  </span>
                </div>
              )}
            </div>

            {/* Admin Role Field */}
            <div>
              <label className="block text-soft-beige/70 font-medium mb-2">
                <Shield className="w-4 h-4 inline mr-2" />
                Rol de Administrador
              </label>
              {isEditing ? (
                <div className="px-4 py-3 bg-soft-gray/10 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-soft-beige font-medium">¿Es administrador?</span>
                      <p className="text-soft-beige/60 text-sm">
                        Los administradores tienen acceso completo al panel de gestión
                      </p>
                    </div>
                    <Switch
                      checked={editForm.isAdmin}
                      onChange={(checked) => setEditForm({ ...editForm, isAdmin: checked })}
                    />
                  </div>
                </div>
              ) : (
                <div className="px-4 py-3 bg-soft-gray/10 rounded-xl text-soft-beige">
                  {user.isAdmin ? (
                    <span className="px-3 py-1 bg-sunset-orange/20 text-sunset-orange border border-sunset-orange/30 rounded-full text-xs font-semibold inline-block">
                      Administrador
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-soft-gray/20 text-soft-gray border border-soft-gray/30 rounded-full text-xs font-semibold inline-block">
                      Usuario estándar
                    </span>
                  )}
                </div>
              )}
            </div>
          </form>

          {/* User Info */}
          <div className="mt-8 pt-6 border-t border-soft-gray/20">
            <div className="text-xs text-soft-beige/50 space-y-1">
              <div>ID completo: <span className="font-mono text-soft-beige/70">{user.id}</span></div>
              <div>
                Registrado el {new Date(user.createdAt).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
              {user.updatedAt && user.updatedAt !== user.createdAt && (
                <div>
                  Última actualización: {new Date(user.updatedAt).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
