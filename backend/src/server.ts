import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { z } from 'zod';
import { db, checkDbConnection, isDbAvailable } from './db.js';
import { sendLeadNotification } from './mailer.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// Security middlewares
app.use(helmet());
app.use(cors({
  origin: [CLIENT_URL, 'http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true
}));
app.use(express.json({ limit: '1mb' }));

// Rate limiter for contact form submissions (max 10 requests per 15 minutes per IP)
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15,
  message: {
    success: false,
    message: 'Demasiadas solicitudes desde esta IP. Por favor intenta más tarde.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Zod Validation Schema for Leads
const ContactLeadSchema = z.object({
  fullName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').max(100),
  email: z.string().email('Formato de correo electrónico inválido'),
  phone: z.string().max(30).optional().nullable(),
  company: z.string().max(100).optional().nullable(),
  serviceInterest: z.string().default('chatbot_support'),
  message: z.string().min(5, 'El mensaje debe tener al menos 5 caracteres').max(2000),
  locale: z.string().default('es')
});

// In-memory fallback storage when PostgreSQL is not configured yet
const memoryLeads: Array<z.infer<typeof ContactLeadSchema> & { id: string; createdAt: Date }> = [];

// Service key mapper for Prisma Enum
function mapServiceInterest(service: string) {
  switch (service.toLowerCase()) {
    case 'chatbot_support': return 'CHATBOT_SUPPORT';
    case 'chatbot_sales': return 'CHATBOT_SALES';
    case 'pos': return 'POS';
    case 'accounts_payable': return 'ACCOUNTS_PAYABLE';
    case 'clinics': return 'CLINICS';
    case 'consulting': return 'CONSULTING';
    case 'saas_custom': return 'SAAS_CUSTOM';
    default: return 'OTHER';
  }
}

// Health Check Route
app.get('/api/health', async (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    brand: 'Averiq — Inteligencia que funciona',
    timestamp: new Date().toISOString(),
    database: isDbAvailable ? 'connected (PostgreSQL)' : 'fallback mode'
  });
});

// Operational Stats Route
app.get('/api/stats', (_req: Request, res: Response) => {
  res.json({
    success: true,
    data: {
      uptime: process.uptime(),
      version: '2.0.0',
      activeModules: [
        'Chatbot Support & Sales',
        'Small Business POS',
        'Accounts Payable Automation',
        'Healthcare & Clinics ERP',
        'AI Strategy & Private LLMs'
      ]
    }
  });
});

// Contact Lead Submission Endpoint
app.post('/api/contact', contactLimiter, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = ContactLeadSchema.parse(req.body);
    const clientIp = req.ip || req.socket.remoteAddress || 'unknown';

    let leadRecord;

    if (db && isDbAvailable) {
      try {
        leadRecord = await db.lead.create({
          data: {
            fullName: validatedData.fullName,
            email: validatedData.email,
            phone: validatedData.phone || null,
            company: validatedData.company || null,
            serviceInterest: mapServiceInterest(validatedData.serviceInterest) as any,
            message: validatedData.message,
            locale: validatedData.locale,
            ipAddress: clientIp
          }
        });
        console.log(`[Lead Created in PostgreSQL] ID: ${leadRecord.id} - ${leadRecord.fullName} (${leadRecord.email})`);
      } catch (dbErr) {
        console.warn('[DB Error] Failed to persist in DB, falling back to memory log:', dbErr);
        leadRecord = {
          id: `fallback-${Date.now()}`,
          ...validatedData,
          createdAt: new Date()
        };
        memoryLeads.push(leadRecord);
      }
    } else {
      leadRecord = {
        id: `local-${Date.now()}`,
        ...validatedData,
        createdAt: new Date()
      };
      memoryLeads.push(leadRecord);
      console.log(`[Lead Recorded Locally] ${leadRecord.fullName} (${leadRecord.email}) - ${leadRecord.serviceInterest}`);
    }

    // Trigger asynchronous notification email (non-blocking)
    sendLeadNotification(validatedData).catch(err => console.error('[Mailer Async Error]', err));

    res.status(201).json({
      success: true,
      message: validatedData.locale === 'en' 
        ? 'Thank you! Your inquiry has been received. An Averiq specialist will contact you shortly.'
        : '¡Gracias! Tu consulta ha sido recibida. Un especialista de Averiq se contactará a la brevedad.',
      leadId: leadRecord.id
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Datos de formulario inválidos',
        errors: error.errors
      });
    }
    next(error);
  }
});

// List Leads (Summary)
app.get('/api/leads', async (_req: Request, res: Response) => {
  if (db && isDbAvailable) {
    try {
      const leads = await db.lead.findMany({
        take: 50,
        orderBy: { createdAt: 'desc' }
      });
      return res.json({ success: true, count: leads.length, data: leads });
    } catch (err) {
      return res.json({ success: true, count: memoryLeads.length, data: memoryLeads });
    }
  }
  res.json({ success: true, count: memoryLeads.length, data: memoryLeads });
});

// Centralized Error Handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('[Unhandled Server Error]', err);
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor. Por favor intenta más tarde.'
  });
});

// Start Server & verify DB connection
app.listen(PORT, async () => {
  console.log(`\n======================================================`);
  console.log(`🚀 Averiq Backend API running on port ${PORT}`);
  console.log(`🌐 Health check: http://localhost:${PORT}/api/health`);
  console.log(`======================================================\n`);
  await checkDbConnection();
});
