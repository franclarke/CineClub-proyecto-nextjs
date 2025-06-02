# Sistema de Autenticación - Puff & Chill

## 🚀 Configuración Inicial

### 1. Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto con las siguientes variables:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/cineclub_db"

# NextAuth
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# Mercado Pago (Sandbox)
MP_PUBLIC_KEY="your-mp-public-key"
MP_ACCESS_TOKEN="your-mp-access-token"

# Spotify API
SPOTIFY_CLIENT_ID="your-spotify-client-id"
SPOTIFY_CLIENT_SECRET="your-spotify-client-secret"

# IMDb API
IMDB_API_KEY="your-imdb-api-key"
```

### 2. Base de Datos

Ejecuta las migraciones de Prisma:

```bash
npx prisma migrate dev
npx prisma generate
```

### 3. Datos de Prueba

Para probar el sistema, necesitas crear membresías en la base de datos:

```sql
INSERT INTO "MembershipTier" (id, name, price, priority, description, benefits) VALUES
('bronze-id', 'Bronze', 15.00, 1, 'Membresía básica', 'Acceso a eventos regulares'),
('silver-id', 'Silver', 25.00, 2, 'Membresía intermedia', 'Acceso prioritario + descuentos'),
('gold-id', 'Gold', 40.00, 3, 'Membresía premium', 'Acceso VIP + bebida gratis + playlist colaborativa');
```

## 🔐 Flujos de Usuario Implementados

### 1. Registro de Usuario Nuevo
- **Ruta**: `/auth/signup`
- **Flujo**: Formulario → Selección de membresía → Creación de cuenta → Login automático → Redirección a `/events`
- **Validación**: Zod schemas con mensajes en español
- **Seguridad**: Hash de contraseñas con bcrypt

### 2. Inicio de Sesión
- **Ruta**: `/auth/signin`
- **Flujo**: Credenciales → Validación → Sesión JWT → Redirección basada en rol
  - **Admin**: `/dashboard`
  - **Usuario**: `/events`

### 3. Protección de Rutas
- **Middleware**: Protege rutas automáticamente
- **Rutas protegidas**: `/events/*`, `/dashboard/*`, `/cart/*`, `/profile/*`, `/reservations/*`
- **Rutas públicas**: `/`, `/auth/signin`, `/auth/signup`

## 🏗️ Arquitectura de Componentes

### Componentes Reutilizables
- **`FormField`**: Campo de formulario con validación
- **`Button`**: Botón con estados de carga y variantes
- **`MembershipSelector`**: Selector visual de membresías

### Hooks Personalizados
- **`useAuth`**: Manejo centralizado de autenticación
  - Estado de sesión
  - Funciones de navegación
  - Información del usuario

### Server Actions
- **`signUpAction`**: Registro de usuarios con validación
- **`getMembershipTiers`**: Obtención de tipos de membresía

## 🎨 Diseño y UX

### Paleta de Colores
- **Primario**: Orange (600/700)
- **Fondo**: Gradiente Gray-900 → Orange-900
- **Componentes**: Gray-800/50 con backdrop-blur

### Responsive Design
- **Mobile-first**: Diseño adaptativo
- **Breakpoints**: sm, md, lg
- **Grid**: Flexbox y CSS Grid

## 🔒 Seguridad Implementada

### Autenticación
- **NextAuth.js**: Manejo seguro de sesiones
- **JWT**: Tokens seguros con información mínima
- **Credentials Provider**: Validación personalizada

### Validación
- **Zod**: Validación de esquemas en cliente y servidor
- **bcrypt**: Hash seguro de contraseñas
- **CSRF**: Protección automática de NextAuth

### Autorización
- **Middleware**: Verificación de rutas
- **Roles**: Admin vs Usuario regular
- **Sesiones**: Verificación en cada request

## 🧪 Testing del Sistema

### Usuarios de Prueba
Después de configurar la DB, puedes crear usuarios de prueba:

```javascript
// Usuario regular
{
  email: "user@test.com",
  password: "123456",
  membershipId: "bronze-id"
}

// Usuario admin
{
  email: "admin@test.com", 
  password: "123456",
  isAdmin: true,
  membershipId: "gold-id"
}
```

### Flujos a Probar
1. **Registro completo**: Signup → Selección membresía → Login automático
2. **Login admin**: Redirección a dashboard
3. **Login usuario**: Redirección a eventos
4. **Protección de rutas**: Acceso sin autenticación
5. **Logout**: Limpieza de sesión

## 📱 Próximos Pasos

### Funcionalidades Pendientes
1. **Pago con Mercado Pago**: Integración completa
2. **Recuperación de contraseña**: Email reset
3. **Verificación de email**: Confirmación de cuenta
4. **Perfil de usuario**: Edición de datos
5. **Cambio de membresía**: Upgrade/downgrade

### Mejoras de UX
1. **Loading states**: Skeletons y spinners
2. **Error boundaries**: Manejo de errores
3. **Notificaciones**: Toast messages
4. **Animaciones**: Transiciones suaves
5. **PWA**: Instalación offline

## 🚀 Comandos de Desarrollo

```bash
# Instalar dependencias
npm install

# Desarrollo
npm run dev

# Build
npm run build

# Prisma
npx prisma studio
npx prisma migrate dev
npx prisma generate

# Linting
npm run lint
```

## 📚 Tecnologías Utilizadas

- **Next.js 15**: App Router, Server Components
- **NextAuth.js**: Autenticación completa
- **Prisma**: ORM y migraciones
- **TypeScript**: Tipado estático
- **Tailwind CSS**: Estilos utilitarios
- **React Hook Form**: Manejo de formularios
- **Zod**: Validación de esquemas
- **bcryptjs**: Hash de contraseñas 