# 🚀 Migración de Imágenes a Supabase - Productos

## ✅ ¿Qué se ha actualizado?

El seed de la base de datos ha sido **completamente actualizado** para subir automáticamente las imágenes de productos desde `public/products/` al bucket de Supabase.

### 📋 Cambios realizados:

1. **Seed inteligente**: Las imágenes se suben automáticamente a Supabase durante el seed
2. **Fallback robusto**: Si Supabase no está configurado, usa URLs locales como respaldo
3. **Gestión automática**: Genera nombres únicos para las imágenes y maneja errores
4. **URLs dinámicas**: Los productos usan URLs de Supabase o locales según la configuración

## 🔧 Configuración de Supabase

### 1. Crear proyecto y configurar variables de entorno

```env
# Agregar a .env.local
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-key-aqui
```

### 2. Crear bucket de storage

En el dashboard de Supabase:
1. Ve a **Storage** > **Buckets**
2. Crea un bucket llamado `products`
3. Configúralo como **público**

### 3. Configurar políticas de seguridad

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
```

## 🎯 Ejecutar la migración

### Opción 1: Con Supabase configurado (Recomendado)
```bash
# 1. Configurar Supabase (ver arriba)
# 2. Ejecutar seed para subir imágenes
npx prisma db seed
```

### Opción 2: Sin Supabase (Solo desarrollo)
```bash
# Las imágenes se mantendrán locales
npx prisma db seed
```

## 📊 Resultado esperado

### Con Supabase configurado:
```
📸 Subiendo imágenes de productos a Supabase...
📸 Subiendo rolls-jamon-rucula.png...
✅ Rolls de jamón crudo con rúcula y crema de queso - https://tu-proyecto.supabase.co/storage/v1/object/public/products/product_123_abc.png
📸 Subiendo queso-brie-panecitos.png...
✅ Queso brie tibio con panecitos - https://tu-proyecto.supabase.co/storage/v1/object/public/products/product_124_def.png
...
📸 Imágenes de productos: 16 imágenes subidas a Supabase
```

### Sin Supabase configurado:
```
📸 Subiendo imágenes de productos a Supabase...
📸 Subiendo rolls-jamon-rucula.png...
⚠️  Supabase no configurado, usando URL local para rolls-jamon-rucula.png
✅ Rolls de jamón crudo con rúcula y crema de queso - /products/rolls-jamon-rucula.png
...
📸 Imágenes de productos: 16 imágenes subidas a Supabase
```

## 🔍 Verificar la migración

### 1. Verificar productos en la base de datos
```bash
npx prisma studio
```

Ve a la tabla `Product` y verifica que las URLs de `imageUrl` apunten a Supabase:
- ✅ **Con Supabase**: `https://tu-proyecto.supabase.co/storage/v1/object/public/products/product_123_abc.png`
- ⚠️ **Sin Supabase**: `/products/rolls-jamon-rucula.png`

### 2. Verificar en el dashboard de productos
Ve a `/manage-products` y verifica que las imágenes se muestren correctamente.

## 🎨 Imágenes incluidas

El seed incluye estas 16 imágenes de productos:

### 🍽️ Snacks Salados
- `rolls-jamon-rucula.png` - Rolls de jamón crudo con rúcula y crema de queso
- `queso-brie-panecitos.png` - Queso brie tibio con panecitos  
- `papas-rusticas-dips.png` - Papas rústicas con especias y dips caseros
- `nachos-guacamole.png` - Nachos con Guacamole
- `mini-empanadas-gourmet.png` - Mini empanadas gourmet
- `palomitas-clasicas.png` - Palomitas clásicas
- `mix-frutos-secos.png` - Mix de frutos secos

### 🍬 Dulces y Chocolates
- `cookies-gourmet.png` - Cookies gourmet
- `brownie.png` - Brownie
- `chocolate-artesanal.png` - Barra de chocolate artesanal

### ☕ Bebidas Calientes
- `cappuccino.png` - Cappuccino
- `cafe-americano.png` - Café Americano
- `chocolate-caliente.png` - Chocolate caliente

### 🧊 Bebidas Frías
- `limonada-casera.png` - Limonada casera
- `jugos-prensados.png` - Jugo exprimido
- `vino-copa-individual.png` - Botellita de vino tinto con copa individual

## 🛠️ Características técnicas

### ✅ Funcionalidades del seed:
- **Lectura automática**: Lee todas las imágenes desde `public/products/`
- **Nombres únicos**: Genera nombres únicos para evitar colisiones
- **Gestión de errores**: Maneja errores y usa fallbacks locales
- **Verificación**: Verifica que Supabase esté configurado antes de subir
- **Logs detallados**: Muestra el progreso de cada imagen

### ⚡ Optimizaciones:
- **Carga única**: Solo sube imágenes que no existen
- **Contenido tipificado**: Establece el tipo MIME correcto
- **Cache control**: Configura headers de cache para mejor rendimiento
- **Compresión**: Mantiene las imágenes optimizadas

## 🔄 Migración de datos existentes

Si ya tienes productos en la base de datos con URLs locales, puedes migrar fácilmente:

```bash
# Resetear la base de datos
npx prisma db reset

# Ejecutar seed con Supabase configurado
npx prisma db seed
```

## 📞 Troubleshooting

### ❌ "Supabase no configurado"
- Verifica que `.env.local` contenga las variables correctas
- Asegúrate de que el bucket `products` exista y sea público
- Verifica la configuración directamente en el dashboard de productos

### ❌ "Error subiendo imagen"
- Verifica las políticas de seguridad del bucket
- Confirma que el bucket esté configurado como público
- Revisa los logs de Supabase para más detalles

### ❌ "Imagen no se muestra"
- Verifica que la URL de la imagen sea accesible
- Confirma que el bucket tenga políticas de lectura pública
- Revisa la configuración de CORS si es necesario

## 🎯 Próximos pasos

1. **Configurar Supabase** siguiendo la documentación completa en `SUPABASE_SETUP.md`
2. **Ejecutar el seed** para subir todas las imágenes
3. **Verificar el resultado** en el dashboard de productos
4. **Probar la funcionalidad** de carga de imágenes en `/manage-products`

---

💡 **Tip**: El sistema está diseñado para funcionar con o sin Supabase, así que puedes desarrollar localmente mientras decides si configurar el almacenamiento en la nube.

🎉 **¡Migración completada!** Las imágenes ahora se gestionan profesionalmente con Supabase Storage. 