# Configuración de Supabase para Gestión de Imágenes de Productos

## 📋 Requisitos

Para que funcione la gestión completa de productos con imágenes, necesitas configurar Supabase como servicio de almacenamiento.

## 🚀 Configuración Inicial

### 1. Crear Proyecto en Supabase

1. Ve a [supabase.com](https://supabase.com) y crea una cuenta
2. Crea un nuevo proyecto
3. Guarda las credenciales del proyecto

### 2. Variables de Entorno

Agrega estas variables a tu archivo `.env.local`:

```env
# Supabase - Required for product image uploads
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 3. Crear Bucket de Storage

En el panel de Supabase:

1. Ve a **Storage** > **Buckets**
2. Crea un nuevo bucket llamado `products`
3. Configurar como **público** para que las imágenes sean accesibles

#### Configuración del bucket `products`:

```sql
-- Permitir acceso público de lectura
INSERT INTO storage.buckets (id, name, public) VALUES ('products', 'products', true);

-- Política para permitir INSERT/SELECT a usuarios autenticados
CREATE POLICY "Authenticated users can upload product images" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'products');

CREATE POLICY "Anyone can view product images" ON storage.objects
  FOR SELECT 
  USING (bucket_id = 'products');

-- Política para permitir UPDATE/DELETE solo a admins
CREATE POLICY "Admins can manage product images" ON storage.objects
  FOR ALL TO authenticated
  USING (bucket_id = 'products' AND auth.jwt() ->> 'role' = 'admin');
```

### 4. Configurar RLS (Row Level Security)

Si necesitas políticas más estrictas, puedes configurar RLS en el bucket:

```sql
-- Activar RLS
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;
```

## 📁 Estructura de Archivos

Las imágenes se suben con la siguiente nomenclatura:
- `{productId}_{timestamp}.{extension}`
- Ejemplo: `cm123abc_1704067200000.jpg`

## 🔄 Funcionalidades Implementadas

### Panel de Administración (`/manage-products`)

✅ **Crear productos** con carga de imagen a Supabase
✅ **Editar productos** con actualización de imagen
✅ **Eliminar productos** con eliminación automática de imagen del bucket
✅ **Preview de imagen** durante la edición
✅ **Validación de archivos** (tipo y tamaño)

### Vista Pública (`/shop`)

✅ **Mostrar imágenes** desde Supabase Storage
✅ **Fallback automático** a placeholder si no hay imagen
✅ **Optimización** de carga de imágenes externas
✅ **Manejo de errores** de carga de imagen

## 🛠 Tipos de Archivo Soportados

- **PNG** (recomendado para productos con transparencia)
- **JPG/JPEG** (recomendado para fotos)
- **WEBP** (formato moderno, menor tamaño)

**Tamaño máximo:** 5MB por archivo

## 🔧 Troubleshooting

### Error: "Error uploading image"
- Verifica que las variables de entorno estén configuradas correctamente
- Asegúrate de que el bucket `products` existe y es público
- Revisa las políticas RLS del bucket

### Error: "Image not loading in public view"
- Verifica que el bucket sea público
- Confirma que la URL de la imagen sea accesible
- Revisa la política SELECT del bucket

### Error: "Cannot delete image"
- Verifica que tengas permisos para eliminar objetos del bucket
- Confirma que el archivo existe en Supabase Storage

## 📝 Migraciones Pendientes

Si ya tienes productos con imágenes en `/public/products/`, necesitarás:

1. **Migrar manualmente** las imágenes existentes a Supabase
2. **Actualizar** las URLs en la base de datos
3. **Eliminar** las imágenes de `/public/products/` (opcional)

### Script de migración (ejemplo):

```sql
-- Ejemplo para actualizar productos existentes
UPDATE "Product" 
SET "imageUrl" = 'https://your-project.supabase.co/storage/v1/object/public/products/' || "imageUrl"
WHERE "imageUrl" IS NOT NULL 
AND "imageUrl" NOT LIKE 'https://%';
```

## 🎯 Beneficios

- ✅ **Escalabilidad**: Sin límites de storage en el servidor
- ✅ **Performance**: CDN global de Supabase
- ✅ **Gestión**: Eliminación automática de imágenes huérfanas
- ✅ **Seguridad**: Control granular de permisos
- ✅ **Costo**: Solo pagas por lo que usas 