
# Manual de Instalación - Sistema de Transporte para la Industria Avícola Colombiana

Este manual detalla los pasos necesarios para desplegar la aplicación en un servidor Ubuntu 22.04 LTS.

## Requisitos Previos

- Servidor Ubuntu 22.04 LTS con acceso root o usuario con privilegios sudo
- Dominio apuntando al servidor (opcional pero recomendado)
- Acceso SSH al servidor

## 1. Preparación del Servidor

### 1.1. Actualizar el Sistema

```bash
sudo apt update
sudo apt upgrade -y
```

### 1.2. Instalar Dependencias Básicas

```bash
sudo apt install -y curl wget git build-essential
```

## 2. Instalar Node.js

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
```

### 2.1. Verificar la instalación de Node.js

```bash
node -v
npm -v
```

## 3. Instalar PM2 (Gestor de Procesos)

```bash
sudo npm install -g pm2
```

## 4. Configurar Nginx como Servidor Web

### 4.1. Instalar Nginx

```bash
sudo apt install -y nginx
```

### 4.2. Habilitar y Verificar Nginx

```bash
sudo systemctl enable nginx
sudo systemctl start nginx
sudo systemctl status nginx
```

### 4.3. Configurar el Firewall (si está activo)

```bash
sudo ufw allow 'Nginx Full'
sudo ufw allow ssh
sudo ufw enable
```

## 5. Clonar el Repositorio de la Aplicación

```bash
mkdir -p /var/www
cd /var/www
git clone [URL_DE_SU_REPOSITORIO] transporte-app
cd transporte-app
```

## 6. Configurar las Variables de Entorno

Crear el archivo .env:

```bash
nano .env
```

Añadir la configuración de Supabase (asegúrate de reemplazar estas credenciales con las correctas):

```
VITE_SUPABASE_URL=https://rwnjiiofnxbjveriqzcw.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ3bmppaW9mbnhianZlcmlxemN3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI0MTM3NDIsImV4cCI6MjA1Nzk4OTc0Mn0.E9_tsidlmNMIvk79jO6azmRo0FRM8Egu7j4j_QxpLUA
```

## 7. Instalar Dependencias de la Aplicación

```bash
npm install
```

## 8. Construir la Aplicación

```bash
npm run build
```

## 9. Configurar Nginx para servir la Aplicación

Crear un nuevo archivo de configuración de Nginx:

```bash
sudo nano /etc/nginx/sites-available/transporte-app
```

Añadir la siguiente configuración (reemplazar example.com con tu dominio):

```nginx
server {
    listen 80;
    server_name example.com www.example.com;

    location / {
        root /var/www/transporte-app/dist;
        try_files $uri $uri/ /index.html;
        index index.html;
    }

    # Configuración opcional para limitar el tamaño de carga
    client_max_body_size 10M;
}
```

Habilitar el sitio:

```bash
sudo ln -s /etc/nginx/sites-available/transporte-app /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## 10. Configurar PM2 para gestionar la aplicación (opcional para desarrollo)

Si necesitas ejecutar un servidor de desarrollo:

```bash
cd /var/www/transporte-app
pm2 start npm --name "transporte-app" -- run dev
pm2 save
pm2 startup
```

## 11. Configurar SSL/TLS con Certbot (Opcional pero Recomendado)

### 11.1. Instalar Certbot

```bash
sudo apt install -y certbot python3-certbot-nginx
```

### 11.2. Obtener Certificado SSL

```bash
sudo certbot --nginx -d example.com -d www.example.com
```

Seguir las instrucciones y seleccionar la opción para redirigir todo el tráfico HTTP a HTTPS.

## 12. Configuración de Cron para renovación automática de certificados

```bash
sudo systemctl status certbot.timer
```

## 13. Configuración de Base de Datos (PostgreSQL)

### 13.1. Conectarse a la Base de Datos

La aplicación ya está configurada para conectarse a la base de datos Supabase en la nube:

- Hostname: buoyantly-shipshape-sleeper.data-1.use1.tembo.io 
- Puerto: 5432
- Usuario: Postgres
- Contraseña: Cx5a3MSqolfm7Oz3
- Base de datos: SOFT_TRANSPORTE

No es necesario instalar PostgreSQL localmente, a menos que desees tener una réplica de la base de datos.

## 14. Verificación final de la instalación

1. Visita tu dominio en un navegador: https://example.com
2. Verifica que la aplicación cargue correctamente
3. Comprueba que puedas iniciar sesión y acceder a todas las funcionalidades

## 15. Mantenimiento y Actualizaciones

### 15.1. Actualizar la aplicación

```bash
cd /var/www/transporte-app
git pull
npm install
npm run build
sudo systemctl reload nginx
```

### 15.2. Reiniciar la aplicación (si está usando PM2)

```bash
pm2 restart transporte-app
```

### 15.3. Monitorear Logs

```bash
# Logs de Nginx
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# Logs de PM2
pm2 logs transporte-app
```

## 16. Copias de seguridad de la base de datos

Para realizar copias de seguridad de la base de datos Supabase:

```bash
# Instalar cliente PostgreSQL
sudo apt install -y postgresql-client

# Crear copia de seguridad
pg_dump -h buoyantly-shipshape-sleeper.data-1.use1.tembo.io -U postgres -d SOFT_TRANSPORTE -f backup_$(date +%Y%m%d).sql

# Restaurar copia de seguridad (si es necesario)
psql -h buoyantly-shipshape-sleeper.data-1.use1.tembo.io -U postgres -d SOFT_TRANSPORTE -f backup_filename.sql
```

## 17. Solución de problemas comunes

### 17.1. Errores 502 Bad Gateway

Verificar los logs de Nginx y asegurarse de que la aplicación esté correctamente construida:

```bash
sudo systemctl status nginx
sudo tail -f /var/log/nginx/error.log
```

### 17.2. Problemas de conexión con la base de datos

Verificar que la configuración de Supabase es correcta y que el servidor tiene acceso a internet.

### 17.3. Errores de permisos

```bash
# Corregir permisos de archivos
sudo chown -R www-data:www-data /var/www/transporte-app
```

---

## Contacto y Soporte

Para cualquier duda o problema durante la instalación, contactar a:
[Información de contacto del equipo de soporte]
