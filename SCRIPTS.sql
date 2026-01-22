-- ========================================
-- BARBERSHOP SAAS - MANTENIMIENTO MANUAL
-- ========================================

-- 1️⃣ CREAR SUPER ADMIN (MÉTODO RECOMENDADO)
-- Regístrate normalmente desde el formulario /auth/register
-- Luego ejecuta este script reemplazando el correo:

UPDATE users 
SET role = 'super_admin' 
WHERE email = 'admin@tudominio.com';


-- 2️⃣ CREAR SUPER ADMIN (MÉTODO DIRECTO - INSERT)
-- Nota: La contraseña debe ser hasheada externamente si se usa LibSQL directo.
-- Se recomienda el MÉTODO 1 para asegurar compatibilidad con Better-Auth.

/*
INSERT INTO users (id, email, name, role, email_verified, created_at, updated_at)
VALUES (
    'sa_001', 
    'superadmin@ejemplo.com', 
    'Administrador Global', 
    'super_admin', 
    1, 
    strftime('%s', 'now') * 1000, 
    strftime('%s', 'now') * 1000
);
*/
