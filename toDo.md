¡Excelente! Vamos a diseñar todos los **flujos de usuario (normal)** y luego te detallo también los **flujos de administrador**, teniendo en cuenta tus requerimientos y el espíritu del proyecto.

---

## 📝 FLUJOS DEL USUARIO (NORMAL)

### 1. Inicio (Dashboard de Usuario)

* Al loguearse, el usuario entra en la **Home de usuario** con:

  * Próximos eventos destacados.
  * Estado de membresía y beneficios.
  * Link rápido a “Mis Tickets” y “Mis Consumibles”.
  * Acceso a descuentos activos.

---

### 2. Navegar Eventos

* Accede al listado de **Próximos Eventos** (calendar o lista).

  * Puede filtrar por **categoría** (Drama, Acción, etc. desde la API de IMDb).
  * Puede filtrar por **fecha**.
  * Puede ordenar por **popularidad** o **disponibilidad**.

---

### 3. Ver Detalle de Evento

* Al clickear un evento:

  * Se abre la **página de detalle**:

    * Título, sinopsis y póster (IMDb).
    * Ubicación y horario.
    * Asientos disponibles por membresía.
  * Botón: **Reservar Ticket**.

---

### 4. Comprar Ticket

* Selección de asiento (por rango de membresía).
* Opción de agregar consumibles (snacks, bebidas).
* Checkout con:
  * Resumen del pedido (asiento, productos, totales).
  * Aplicar descuento.
  * Pago con Mercado Pago.
* Confirmación con ticket virtual.

---

### 5. Mis Tickets

* Vista de:
  * Tickets comprados (pendientes de uso).
  * Tickets expirados.

---

### 6. Mis Consumibles

* Sección donde ve sus:
  * Consumibles disponibles (ej. 1 cerveza gratis Oro).
  * Consumibles ya usados (historial).

---

### 7. Mi Membresía

* Ver su nivel actual (Bronce/Plata/Oro).
* Ver beneficios.
* Botón para **Upgradear** (pagar la diferencia) o **cancelar** (perder beneficios).

---

## 🛠️ FLUJOS ADICIONALES DEL USUARIO

✅ **Historial de Compras**: todos los pedidos de consumibles y entradas con fecha y status de pago.
✅ **Perfil de Usuario**: editar datos personales (nombre, email, etc.).

---

## 📝 FLUJOS DEL ADMINISTRADOR

### 1. Dashboard Admin

* Estadísticas generales:

  * Eventos activos, ocupación por membresía.
  * Ingresos por evento o snack.
  * Tickets vendidos por rango.

---

### 2. Gestión de Eventos

* Crear evento (título, descripción, fecha, IMDb ID).
* Configurar asientos (por tier).
* Editar evento.
* Borrar evento.

---

### 3. Gestión de Asientos

* Ver asiento por evento y su status.
* Editar (liberar, bloquear, cambiar tier).

---

### 4. Gestión de Tickets

* Ver reservas por evento.
* Forzar cancelación si fuera necesario.

---

### 5. Gestión de Consumibles

* CRUD de snacks y bebidas.
* Stock y precios.

---

### 6. Gestión de Membresías

* Cambiar manualmente membresías.
* Ver usuarios por tier.

---