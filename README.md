# Averiq — Inteligencia que funciona

Sitio web institucional y API de captación de clientes y demostración para **Averiq**.

---

## 🌟 Características Principales

1. **Diseño Visual Anti-Genérico (Tech-Editorial):**
   - Paleta de color grafito profundo y cian eléctrico (`#080C14` / `#00D2FF`).
   - Tipografías modernas (*Plus Jakarta Sans*, *Syne* y *JetBrains Mono*).
   - Bento Grid interactivo con demostraciones visuales y micro-interacciones.

2. **Hero Section con Alta Conversión:**
   - Titulares de impacto y propuesta de valor clara.
   - Dual Call To Action: Solicitud de Diagnóstico/Demo y enlace directo a WhatsApp.
   - Accesos directos a canales de redes sociales: **WhatsApp**, **Instagram** y **Facebook**.

3. **Conmutador de Idioma (ES / EN):**
   - Soporte multilingüe completo (Español e Inglés) con `i18next`.
   - Selector en la barra de navegación y pie de página con persistencia.

4. **Catálogo de Soluciones y SaaS de Nicho:**
   - 🤖 **Chatbots de Atención 24/7** (Soporte multicanal y resolución de tickets).
   - 📈 **Chatbots de Ventas & Prospección** (Calificación y sincronización CRM).
   - 🏪 **POS Inteligente para Pequeños Negocios** (Stock en tiempo real y facturación).
   - 📑 **Cuentas a Pagar & Proveedores** (Lectura OCR y conciliación).
   - 🩺 **Consultorios Médicos** (Turnos online y validación de Obras Sociales).
   - 🧠 **Consultoría Estratégica en IA** (Modelos privados, gobernanza y automatización).

5. **Simulador Interactivo en Vivo:**
   - Playground integrado donde los visitantes pueden interactuar con 4 simulaciones funcionales (Chatbot, POS, Turnos y Facturas).

6. **Asistente de Chat Flotante:**
   - Widget interactivo en la esquina inferior derecha para responder dudas en tiempo real.

7. **Backend API Robusto (Node.js + TypeScript + PostgreSQL):**
   - Endpoint `/api/contact` con validación estricta con **Zod**.
   - Persistencia con **Prisma ORM** y soporte de fallback seguro en memoria si PostgreSQL no está iniciado.
   - Sistema de notificaciones por email mediante **Nodemailer**.
   - Seguridad con **Helmet**, **CORS** y **Rate Limiting**.

---

## 🚀 Cómo Iniciar el Proyecto

### 1. Iniciar el Frontend (React + TypeScript + Vite)
```bash
cd frontend
npm run dev
```
El frontend estará disponible en: **`http://localhost:5173`**

### 2. Iniciar el Backend (Node.js + Express + Prisma)
```bash
cd backend
npm run dev
```
La API estará disponible en: **`http://localhost:5000`**
Health check: `http://localhost:5000/api/health`

### 3. Configurar PostgreSQL (Opcional pero recomendado para producción)
En `backend/.env`, configurar la variable de conexión:
```env
DATABASE_URL="postgresql://usuario:password@localhost:5432/averiq_db?schema=public"
```
Luego ejecutar las migraciones:
```bash
cd backend
npx prisma migrate dev --name init
```

---

## 📁 Estructura del Repositorio

```
averiq-web/
├── frontend/                     # Aplicación React + TypeScript + Vite
│   ├── src/
│   │   ├── components/           # Navbar, Hero, Solutions, Simulator, Contact, Footer, LiveChatWidget
│   │   ├── i18n/                 # Configuración y diccionarios es.json / en.json
│   │   ├── App.tsx               # Layout principal
│   │   ├── main.tsx              # Entrada de la aplicación
│   │   └── index.css             # Estilos globales y Tailwind CSS
│   ├── public/logo.svg           # Logo vectorial de Averiq
│   └── vite.config.ts
├── backend/                      # API Node.js + Express + TypeScript
│   ├── src/
│   │   ├── server.ts             # Servidor Express, endpoints y validaciones Zod
│   │   ├── db.ts                 # Cliente Prisma con fallback
│   │   └── mailer.ts             # Servicio de correo
│   ├── prisma/
│   │   └── schema.prisma         # Modelo de datos PostgreSQL (Leads, Status, Services)
│   ├── .env                      # Variables de entorno
│   └── tsconfig.json
└── package.json                  # Scripts del workspace
```
