# 🖼️ Sistema de Carga de Imágenes - Productos

## ✅ ¡Sistema Habilitado!

El sistema de carga de imágenes para productos ya está **completamente implementado** y listo para usar.

## 🚀 Cómo Usar

### 1. Verificar Configuración

Antes de usar el sistema, verifica que Supabase esté configurado correctamente consultando el archivo `.env.local` en la raíz del proyecto.

Si todo está bien configurado, podrás:
- ✅ Cargar imágenes sin problemas
- ✅ Ver el mensaje "Carga de imágenes habilitada" en el dashboard
- ✅ Subir archivos PNG, JPG, JPEG, WEBP hasta 5MB

### 2. Cargar Imágenes

1. Ve a **Admin Panel** → **Administrar Productos** (`/manage-products`)
2. Haz clic en **"Agregar Producto"** o **"Editar"** un producto existente
3. En la sección "Imagen del producto":
   - Si Supabase está configurado, verás: **"Carga de imágenes habilitada"**
   - Haz clic en **"Agregar Imagen"** o arrastra un archivo
   - Formatos soportados: PNG, JPG, JPEG, WEBP (máx 5MB)
   - La imagen se subirá automáticamente a Supabase

### 3. Gestión de Imágenes

- **Cambiar imagen**: Hover sobre la imagen → "Cambiar"
- **Eliminar imagen**: Hover sobre la imagen → "Quitar"
- **Eliminación automática**: Al eliminar un producto, su imagen se elimina automáticamente de Supabase

## 🔧 Características

### ✅ Implementado
- **Carga directa** a Supabase Storage
- **Validación** de formato y tamaño
- **Preview** en tiempo real
- **Actualización** de imágenes existentes
- **Eliminación automática** al borrar productos
- **Feedback visual** del estado de carga
- **Detección automática** de configuración de Supabase

### 🎯 Funcionalidades
- **Formatos**: PNG, JPG, JPEG, WEBP
- **Tamaño máximo**: 5MB por imagen
- **Almacenamiento**: Supabase Storage (CDN global)
- **Eliminación**: Automática al eliminar productos
- **Fallback**: Placeholder si no hay imagen

## 🔍 Troubleshooting

### ❌ "Configuración de Supabase requerida"
1. Verifica que `.env.local` contenga:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-key-aqui
   ```
2. Verifica la configuración directamente en el dashboard
3. Consulta `SUPABASE_SETUP.md` para configuración completa

### ❌ "Error uploading image"
1. Verifica que el bucket `products` existe en Supabase
2. Confirma que el bucket es público
3. Revisa las políticas de seguridad en Supabase Dashboard

### ❌ "Image not loading"
1. Verifica la URL en el navegador
2. Confirma que el archivo existe en Supabase Storage
3. Revisa las políticas de lectura del bucket

## 📱 Uso en Producción

El sistema está listo para producción:
- **Escalable**: Sin límites de storage del servidor
- **Rápido**: CDN global de Supabase
- **Eficiente**: Eliminación automática de imágenes huérfanas
- **Seguro**: Políticas de acceso configurables

## 🛠️ Archivos Relacionados

- `src/app/(admin)/manage-products/` - Panel de administración
- `src/app/(admin)/manage-products/components/ImageUpload.tsx` - Componente de carga
- `src/lib/supabase.ts` - Funciones de Supabase
- `SUPABASE_SETUP.md` - Configuración detallada

## 📋 Comandos Útiles

```bash
# Iniciar servidor de desarrollo
npm run dev

# Abrir Prisma Studio
npm run db:studio

# Ejecutar migraciones
npm run db:migrate
```

---

🎉 **¡Todo listo!** Ahora puedes cargar imágenes de productos de forma profesional y escalable. 