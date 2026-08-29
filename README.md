# Averiq — Inteligencia que funciona

Plataforma web institucional, simulador interactivo y suite de APIs con Inteligencia Artificial real para **Averiq** (Desarrollo SaaS a medida, agentes de IA conversacionales y automatización operativa).

---

## 🌟 Características Principales

### 1. 🎨 Diseño Visual Anti-Genérico (Tech-Editorial)
- Paleta profunda de grafito y cian eléctrico (`#080C14` / `#00D2FF`).
- Tipografías modernas (*Plus Jakarta Sans*, *Syne* y *JetBrains Mono*).
- Bento Grid interactivo con demostraciones visuales y micro-interacciones.
- Totalmente optimizado y responsive para dispositivos móviles, tablets y escritorio.

### 2. ⚡ Integración de Inteligencia Artificial Real (Google Gemini)
- **Google GenAI SDK (`@google/genai`)** con el modelo de alta velocidad **`gemini-3.6-flash`** y cadena de fallbacks inteligentes.
- **System Prompt Técnico Especializado:** Respuestas pragmáticas y sólidas sobre arquitecturas (React, TypeScript, Node.js, PostgreSQL, APIs REST, RAG y WhatsApp Business API).
- Medición de latencia de ejecución en tiempo real (`ms`).

### 3. 🤖 Averiq Interactive Support Agent (Simulador Principal)
Playground interactivo con 4 pestañas 100% funcionales:
1. **Chatbot de Soporte & Ventas:** Conectado en tiempo real a Gemini con sugerencias y auto-scroll interno.
2. **Smart POS Express:** Catálogo interactivo, cupón de descuento (`AVERIQ10`), selección de método de cobro (QR Interoperable, Tarjeta, Efectivo) y ticket digital con validación AFIP.
3. **Consultorios Médicos & Obras Sociales:** Médicos por especialidad, validación de obras sociales (OSDE, Swiss Medical, Galeno, Medifé, Particular), selección de turnos y recordatorio de WhatsApp.
4. **FinOps OCR (Cuentas a Pagar):** Escáner con presets reales, desglose de Neto + IVA 21%, índice de confianza OCR (99.8%) y detección de comprobantes duplicados.

### 4. 💬 Averiq Assistant Flotante con Captura Autónoma de Leads
- Widget de chat en la esquina inferior con memoria de sesión (`sessionId`).
- **Captura Autónoma:** Extrae automáticamente el nombre, email, teléfono o empresa del visitante durante la conversación.
- **Persistencia y Notificación:** Registra el prospecto en PostgreSQL (`source: 'chat_assistant'`) y despacha un correo inmediato al equipo comercial.
- **Badge de Confirmación:** Informa visualmente al usuario que sus datos fueron recibidos.
- **Escalación a WhatsApp:** Derivación directa con un clic al número oficial.

### 5. 📧 Notificaciones por Correo (Resend API)
- Integración oficial con el SDK de **Resend**.
- Plantilla corporativa HTML en modo oscuro enviada a `contacto.averiq@gmail.com` ante cada prospecto nuevo.

### 6. 🌐 Multilingüe (ES / EN)
- Soporte multilingüe completo (Español e Inglés) gestionado con `i18next`.

### 7. 🗄️ Base de Datos & Gestión de Leads (PostgreSQL + Prisma)
- Modelo `Lead` con auditoría completa (`source`, `status`, `notes`, `metadata`, `ipAddress`).
- Suite REST con analíticas (`/api/leads/stats`) y CRUD de prospectos.

---

## 🛠️ Endpoints de la API Backend

| Método | Endpoint | Descripción |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Estado del servidor y conexión a PostgreSQL |
| `POST` | `/api/contact` | Recepción de formulario de contacto y envío de email |
| `POST` | `/api/ai/simulate-chat` | Consulta de IA para el Simulador Interactivo |
| `POST` | `/api/ai/assistant` | Consulta de IA para el Asistente Flotante + Captura de Leads |
| `GET` | `/api/leads/stats` | Métricas y analíticas de prospectos para dashboard |
| `GET` | `/api/leads` | Listado paginado y filtrado de prospectos |
| `GET` | `/api/leads/:id` | Detalle de un prospecto específico |
| `PATCH` | `/api/leads/:id` | Actualización de estado (`NUEVO`, `CONTACTADO`, `CALIFICADO`, `CONVERTIDO`, `DESCARTADO`) y notas |
| `DELETE` | `/api/leads/:id` | Eliminación de un prospecto |

---

## ⚙️ Variables de Entorno (`backend/.env`)

```env
# Servidor
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# Base de Datos PostgreSQL
DATABASE_URL="postgresql://postgres:TU_PASSWORD@localhost:5432/averiq_db?schema=public"

# Envíos de Correo Transaccional (Resend)
RESEND_API_KEY="re_..."
NOTIFY_EMAIL="contacto.averiq@gmail.com"

# Inteligencia Artificial (Google Gemini)
GEMINI_API_KEY="AIza..."

# Canales de Contacto
WHATSAPP_NUMBER="5492645859829"
```

---

## 🚀 Cómo Iniciar el Proyecto en Desarrollo

### 1. Iniciar el Backend
```bash
cd backend
npm install
npx prisma migrate dev
npm run dev
```
API corriendo en: **`http://localhost:5000`**

### 2. Iniciar el Frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend corriendo en: **`http://localhost:5173`**

---

## 📁 Estructura del Repositorio

```
averiq-web/
├── frontend/                     # Aplicación React + TypeScript + Vite + Tailwind
│   ├── src/
│   │   ├── components/           # Navbar, Hero, Solutions, InteractiveSimulator, Methodology, ContactSection, Footer, LiveChatWidget
│   │   ├── i18n/                 # Diccionarios de traducción (es.json / en.json)
│   │   ├── App.tsx               # Layout principal
│   │   └── main.tsx              # Entrada de la aplicación
│   ├── public/averiq_logo.jpg    # Asset de identidad corporativa
│   └── vite.config.ts            # Configuración de Vite con Proxy API a :5000
├── backend/                      # API Node.js + Express + TypeScript + Prisma
│   ├── src/
│   │   ├── server.ts             # Servidor Express, validaciones Zod y rutas REST
│   │   ├── ai.ts                 # Integración Google Gemini (Simulator + Assistant + Captura)
│   │   ├── db.ts                 # Conexión Prisma con PostgreSQL
│   │   └── mailer.ts             # Notificaciones por email con Resend API
│   ├── prisma/
│   │   ├── schema.prisma         # Modelo Lead (source, status, notes, metadata)
│   │   └── migrations/           # Historial de migraciones SQL
│   ├── .env                      # Credenciales y variables de entorno
│   └── tsconfig.json
└── README.md                     # Documentación general del proyecto
```

---

*Averiq — Inteligencia que funciona.*
