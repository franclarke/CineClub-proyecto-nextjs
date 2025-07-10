'use client'

import React, { useState, useRef } from 'react'
import { Button } from '@/app/components/ui/button'
import { supabase } from '@/lib/supabase'

interface ImageUploadProps {
  currentImageUrl?: string
  onImageUpload: (url: string) => void
  onError: (error: string) => void
}

export function ImageUpload({ 
  currentImageUrl, 
  onImageUpload, 
  onError
}: ImageUploadProps) {
  const [previewUrl, setPreviewUrl] = useState<string>(currentImageUrl || '')
  const [uploading, setUploading] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (selectedFile: File) => {
    console.log('📁 Archivo seleccionado:', selectedFile.name, selectedFile.type, selectedFile.size)
    setFile(selectedFile)
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string)
    }
    reader.readAsDataURL(selectedFile)
  }

  const handleUpload = async () => {
    console.log('🚀 Iniciando upload...')
    
    if (!file) {
      console.log('❌ No hay archivo')
      return
    }

    if (!supabase) {
      console.log('❌ Supabase client no está disponible')
      onError('Supabase no configurado')
      return
    }

    console.log('✅ Supabase client disponible')
    console.log('📄 Archivo a subir:', {
      name: file.name,
      type: file.type,
      size: file.size
    })

    // Test bucket access first
    console.log('🔍 Probando acceso al bucket...')
    try {
      const { data: listData, error: listError } = await supabase.storage
        .from('products')
        .list('', { limit: 1 })
      
      console.log('📋 Resultado del test de bucket:', { listData, listError })
      
      if (listError) {
        console.log('❌ Error accediendo al bucket:', listError)
        onError(`Error accediendo al bucket: ${listError.message}`)
        return
      }
    } catch (error) {
      console.log('💥 Error inesperado probando bucket:', error)
      onError(`Error probando bucket: ${error}`)
      return
    }

    setUploading(true)

    try {
      // Generate filename
      const fileExt = file.name.split('.').pop()
      const fileName = `test_${Date.now()}.${fileExt}`
      
      console.log('📝 Nombre del archivo:', fileName)
      console.log('🪣 Subiendo al bucket: products')
      console.log('📦 Detalles del archivo:', {
        fileName,
        fileSize: file.size,
        fileType: file.type,
        timestamp: Date.now()
      })
      
      // Upload to Supabase
      const uploadResult = await supabase.storage
        .from('products')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        })

      console.log('📊 Resultado COMPLETO del upload:', uploadResult)
      console.log('📊 Data del upload:', uploadResult.data)
      console.log('📊 Error del upload:', uploadResult.error)

      if (uploadResult.error) {
        console.log('❌ Error en upload:', uploadResult.error)
        console.log('❌ Mensaje del error:', uploadResult.error.message)
        onError(`Error: ${uploadResult.error.message}`)
        return
      }

      if (!uploadResult.data) {
        console.log('❌ No se recibió data del upload')
        onError('No se recibió confirmación del upload')
        return
      }

      console.log('✅ Upload exitoso!')
      console.log('📁 Path del archivo subido:', uploadResult.data.path)
      console.log('📁 ID del archivo:', uploadResult.data.id)
      console.log('📁 FullPath:', uploadResult.data.fullPath)

      // Get public URL
      const urlResult = supabase.storage
        .from('products')
        .getPublicUrl(uploadResult.data.path)

      console.log('🔗 Resultado de URL pública:', urlResult)
      console.log('🔗 URL pública generada:', urlResult.data.publicUrl)

      // Verify the file was uploaded by listing files
      console.log('🔍 Verificando que el archivo se subió...')
      const { data: verifyData, error: verifyError } = await supabase.storage
        .from('products')
        .list('', { limit: 100 })
      
      console.log('📋 Archivos en el bucket después del upload:', verifyData)
      console.log('📋 Error verificando:', verifyError)

      const uploadedFile = verifyData?.find(f => f.name === fileName)
      console.log('🔍 Archivo encontrado en bucket:', uploadedFile)

      if (!uploadedFile) {
        console.log('⚠️ ADVERTENCIA: El archivo no aparece en el bucket!')
        onError('El archivo no se guardó en el bucket')
        return
      }

      onImageUpload(urlResult.data.publicUrl)
      setFile(null)
      
      console.log('🎉 Upload completado exitosamente')
      
    } catch (error) {
      console.log('💥 Error inesperado:', error)
      console.log('💥 Stack trace:', error instanceof Error ? error.stack : 'No stack available')
      onError(`Error inesperado: ${error}`)
    } finally {
      setUploading(false)
    }
  }

  const handleRemoveImage = () => {
    setFile(null)
    setPreviewUrl('')
    onImageUpload('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="space-y-4">
      <label className="block text-soft-beige/70 text-sm font-medium">
        Imagen del producto
      </label>

      {/* Debug info */}
      <div className="text-xs text-soft-beige/50 bg-soft-gray/10 rounded p-2">
        <p>🔧 Debug:</p>
        <p>Supabase client: {supabase ? '✅ Conectado' : '❌ No disponible'}</p>
        <p>Archivo: {file ? `✅ ${file.name}` : '❌ No seleccionado'}</p>
      </div>
      
      <div className="flex justify-center">
        <div className="relative">
          {previewUrl ? (
            <div className="relative group">
              <img
                src={previewUrl}
                alt="Preview"
                className="w-40 h-40 object-cover rounded-xl border-2 border-soft-gray/20"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-xl flex items-center justify-center gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs"
                >
                  Cambiar
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={handleRemoveImage}
                  className="text-xs border-warm-red text-warm-red hover:bg-warm-red/10"
                >
                  Quitar
                </Button>
              </div>
            </div>
          ) : (
            <label
              htmlFor="product-image"
              className="flex flex-col items-center justify-center w-40 h-40 bg-soft-gray/10 border-2 border-dashed border-soft-gray/30 rounded-xl cursor-pointer hover:border-sunset-orange transition-colors duration-200 group"
            >
              <div className="flex flex-col items-center justify-center h-full text-soft-beige/50 group-hover:text-sunset-orange transition-colors duration-200">
                <svg className="w-10 h-10 mb-2" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                <span className="font-semibold text-sm">Agregar Imagen</span>
              </div>
            </label>
          )}
        </div>
      </div>

      <input
        ref={fileInputRef}
        id="product-image"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const selectedFile = e.target.files?.[0]
          if (selectedFile) {
            handleFileSelect(selectedFile)
          }
        }}
      />

      {file && (
        <div className="flex justify-center">
          <Button
            type="button"
            onClick={handleUpload}
            disabled={uploading || !supabase}
            className="w-full max-w-xs"
          >
            {uploading ? 'Subiendo...' : 'Subir Imagen'}
          </Button>
        </div>
      )}
    </div>
  )
} 