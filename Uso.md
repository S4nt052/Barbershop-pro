# Manual de Implementación: BarberShop SaaS

Este documento detalla la arquitectura y configuración del sistema finalizado para producción.

## 1. Arquitectura (Hexagonal / Clean)

El proyecto sigue una estructura de **SaaS Modular Monolith** para asegurar escalabilidad sin la complejidad de microservicios:

```text
src/
  ├── core/                 # Utilidades compartidas y constantes
  ├── modules/              # Lógica de negocio por dominios
  │   ├── appointments/     # Citas, Servicios y Agenda Inteligente
  │   ├── barbershops/      # Gestión de Negocios, Sucursales y Barberos
  │   └── users/            # Autenticación y Perfiles
  └── app/                  # Capa de UI (Next.js App Router)
```

## 2. Base de Datos (Turso / LibSQL)

El esquema centralizado se encuentra en [DATABASE_SCHEMA.sql](file:///e:/systems/BarberShop/DATABASE_SCHEMA.sql). Para sincronizar cambios:

1. Modifica [src/modules/shared/infrastructure/database/schema.ts](file:///e:/systems/BarberShop/src/modules/shared/infrastructure/database/schema.ts).
2. Sincroniza con: `npx drizzle-kit push` (recomendado para Turso).
3. O genera migraciones con: `npx drizzle-kit generate`.

## 3. Autenticación (Better-Auth)

Configurado en [src/modules/users/infrastructure/auth.ts](file:///e:/systems/BarberShop/src/modules/users/infrastructure/auth.ts). Soporta:
- Registro/Login con Email y Contraseña.
- RBAC (Roles): `super_admin`, `owner`, `barber`, `client`.

## 4. Lógica de Agenda Inteligente

El [AvailabilityService](file:///e:/systems/BarberShop/src/modules/appointments/domain/AvailabilityService.ts#6-63) implementa las reglas críticas:
- **Validación de Horarios**: Cruce entre horario de sucursal y barbero.
- **Buffers**: Espacio de tiempo configurable entre citas (por defecto 10 min).
- **Auto-asignación**: Lógica para "Cualquier barbero disponible".

## 5. Configuración y Feature Flags

Las funcionalidades se activan por barbería desde el campo `settings` (JSON) en la tabla `barbershops`.
- [FeatureFlagService](file:///e:/systems/BarberShop/src/modules/barbershops/domain/FeatureFlagService.ts#3-30) centraliza estas validaciones para ser usadas en el Middleware o la UI.

---

## 6. Guía de Configuración de Credenciales

Para que el sistema funcione, necesitas configurar las siguientes variables de entorno en un archivo `.env.local` en la raíz del proyecto.

### A. Turso (Base de Datos)
Turso es un SQLite distribuido basado en LibSQL.

**Para Windows (PowerShell):**
1. Ejecuta:
   ```powershell
   irm https://get.turso.tech/install.ps1 | iex
   ```
2. Si falla con error de conexión/DNS:
   - Ejecuta: `ipconfig /flushdns` (asegúrate de escribir **flushdns** correctamente).
   - O descarga el instalador manualmente de [turso.tech](https://turso.tech).

**Para Git Bash / Linux / Mac:**
```bash
curl -sSfL https://get.turso.tech/install.sh | bash
```

**Pasos post-instalación:**
1. **Login**: `turso auth login`.
2. **Crear DB**: `turso db create barbershop-db`.
3. **Obtener URL**: `turso db show barbershop-db --url`. (Esta es tu `TURSO_DATABASE_URL`).
4. **Obtener Token**: `turso db tokens create barbershop-db`. (Esta es tu `TURSO_AUTH_TOKEN`).

### B. Better-Auth (Seguridad)
Better-Auth requiere un secreto para firmar las sesiones.
1. **Generar Secreto**: Puedes usar `openssl rand -base64 32` (en git bash) en tu terminal o cualquier generador de strings aleatorios.
2. **Configurar**: Asígnalo a `BETTER_AUTH_SECRET`.
3. **URL Base**: En desarrollo usa `BETTER_AUTH_URL=http://localhost:3000`.

### C. Uploadcare (Almacenamiento de Imágenes)
Usado para logos de barberías, avatares y fotos de cortes.
1. **Registro**: Crea una cuenta gratuita en [Uploadcare](https://uploadcare.com/).
2. **Dashboard**: Crea un nuevo proyecto y en "API Keys" copia la **Public Key**.
3. **Variables**:
   - `NEXT_PUBLIC_UPLOADCARE_PUBLIC_KEY=tu_public_key`

---

## 7. Despliegue en Producción (Vercel)

El sistema está listo para Vercel:
1. Conecta tu repositorio de GitHub.
2. Agrega todas las variables de entorno anteriores en la configuración de Vercel.
3. El comando de build es `npm run build` y el directorio de salida `.next`.

---

## 8. Verificación Final (Iteraciones Pendientes)

> [!WARNING]
> **Falta por probar**:
> - Flujo completo de pasarela de pago (opcional).
> - Notificaciones por WhatsApp/Email (implementación de adapters externos).
> - Pruebas de carga en la lógica de la agenda con +100 citas simultáneas.

---

## Comandos Útiles

- `npm run dev`: Inicia el entorno de desarrollo con soporte para Windows.
- `npx drizzle-kit studio`: Visualizador web para navegar por tus datos locales o remotos.
- `npx drizzle-kit push:sqlite`: Empuja cambios de esquema directamente sin migraciones SQL manuales.
