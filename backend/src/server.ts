import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { z } from 'zod';
import { db, checkDbConnection, isDbAvailable } from './db.js';
import { sendLeadNotification } from './mailer.js';
import { generateAveriqChatReply, generateAssistantReply } from './ai.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// Security & Parsing Middlewares
app.use(helmet());
app.use(cors({
  origin: [CLIENT_URL, 'http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true
}));
app.use(express.json({ limit: '1mb' }));

// Rate limiter for contact submissions
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
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
  locale: z.string().default('es'),
  source: z.string().default('web_form'),
  metadata: z.record(z.any()).optional().nullable()
});

const UpdateLeadSchema = z.object({
  status: z.enum(['NUEVO', 'CONTACTADO', 'EN_EVALUACION', 'CONVERTIDO', 'DESCARTADO']).optional(),
  notes: z.string().max(2000).optional().nullable()
});

// In-memory fallback storage
const memoryLeads: Array<any> = [];

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

// ----------------------------------------------------
// 1. HEALTH & OPERATIONAL ROUTES
// ----------------------------------------------------
app.get('/api/health', async (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    brand: 'Averiq — Inteligencia que funciona',
    timestamp: new Date().toISOString(),
    database: isDbAvailable ? 'connected (PostgreSQL)' : 'fallback mode'
  });
});

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

// ----------------------------------------------------
// 2. LEAD SUBMISSION (WEB FORM / ASSISTANT / SIMULATOR)
// ----------------------------------------------------
app.post('/api/contact', contactLimiter, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = ContactLeadSchema.parse(req.body);
    const clientIp = req.ip || req.socket.remoteAddress || 'unknown';

    let leadRecord: any;

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
            source: validatedData.source,
            metadata: validatedData.metadata || undefined,
            ipAddress: clientIp
          }
        });
        console.log(`[Lead Created in PostgreSQL] ID: ${leadRecord.id} - ${leadRecord.fullName} (${leadRecord.email})`);
      } catch (dbErr) {
        console.warn('[DB Error] Failed to persist in DB, falling back to memory log:', dbErr);
        leadRecord = {
          id: `fallback-${Date.now()}`,
          ...validatedData,
          status: 'NUEVO',
          createdAt: new Date(),
          updatedAt: new Date()
        };
        memoryLeads.push(leadRecord);
      }
    } else {
      leadRecord = {
        id: `local-${Date.now()}`,
        ...validatedData,
        status: 'NUEVO',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      memoryLeads.push(leadRecord);
      console.log(`[Lead Recorded Locally] ${leadRecord.fullName} (${leadRecord.email}) - ${leadRecord.serviceInterest}`);
    }

    // Trigger asynchronous notification email via Resend (non-blocking)
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

// ----------------------------------------------------
// 2.1 AI CHAT SIMULATION ENDPOINT (FASE 3)
// ----------------------------------------------------
const AiChatSchema = z.object({
  message: z.string().min(1, 'El mensaje no puede estar vacío').max(1000),
  history: z.array(z.object({
    sender: z.enum(['user', 'bot']),
    text: z.string()
  })).optional().default([]),
  locale: z.string().default('es')
});

app.post('/api/ai/simulate-chat', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { message, history, locale } = AiChatSchema.parse(req.body);
    const result = await generateAveriqChatReply(message, history, locale);
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ success: false, message: 'Parámetros inválidos', errors: error.errors });
    }
    next(error);
  }
});

// ----------------------------------------------------
// 2.2 FLOATING ASSISTANT WITH AUTONOMOUS LEAD CAPTURE (FASE 4)
// ----------------------------------------------------
const AssistantChatSchema = z.object({
  sessionId: z.string().optional(),
  message: z.string().min(1, 'El mensaje no puede estar vacío').max(1000),
  history: z.array(z.object({
    sender: z.enum(['user', 'bot']),
    text: z.string()
  })).optional().default([]),
  locale: z.string().default('es')
});

app.post('/api/ai/assistant', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { sessionId, message, history, locale } = AssistantChatSchema.parse(req.body);
    const clientIp = req.ip || req.socket.remoteAddress || 'unknown';

    const result = await generateAssistantReply(message, history, locale);

    // If the assistant autonomously captured a lead during the conversation
    if (result.leadCaptured && result.leadData) {
      const leadPayload = {
        fullName: result.leadData.fullName || 'Prospecto Web (Asistente)',
        email: result.leadData.email || `${sessionId || Date.now()}@chat.lead`,
        phone: result.leadData.phone || null,
        company: result.leadData.company || null,
        serviceInterest: result.leadData.serviceInterest || 'saas_custom',
        message: `[Captura Autónoma Chatbot]: "${message}"\n\nÚltimos mensajes de la sesión:\n${history.slice(-4).map(h => `${h.sender.toUpperCase()}: ${h.text}`).join('\n')}`,
        locale,
        source: 'chat_assistant',
        metadata: {
          sessionId,
          chatSnippet: history.slice(-4)
        }
      };

      if (db && isDbAvailable) {
        try {
          const lead = await db.lead.create({
            data: {
              fullName: leadPayload.fullName,
              email: leadPayload.email,
              phone: leadPayload.phone,
              company: leadPayload.company,
              serviceInterest: mapServiceInterest(leadPayload.serviceInterest) as any,
              message: leadPayload.message,
              locale: leadPayload.locale,
              source: 'chat_assistant',
              metadata: leadPayload.metadata,
              ipAddress: clientIp
            }
          });
          console.log(`[Autonomous Lead Captured from Assistant] ID: ${lead.id} - ${lead.fullName} (${lead.email})`);
        } catch (dbErr) {
          console.warn('[DB Error] Failed to persist assistant lead:', dbErr);
        }
      }

      // Send Resend notification if an email or phone was captured
      if (result.leadData.email || result.leadData.phone) {
        sendLeadNotification(leadPayload).catch(err => console.error('[Mailer Assistant Lead Error]', err));
      }
    }

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ success: false, message: 'Parámetros inválidos', errors: error.errors });
    }
    next(error);
  }
});

// ----------------------------------------------------
// 3. LEADS MANAGEMENT & ANALYTICS API (FASE 2)
// ----------------------------------------------------

// GET /api/leads/stats - Analytics Dashboard Metrics
app.get('/api/leads/stats', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    if (db && isDbAvailable) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const [totalCount, todayCount, statusDistribution, serviceDistribution, sourceDistribution] = await Promise.all([
        db.lead.count(),
        db.lead.count({ where: { createdAt: { gte: today } } }),
        db.lead.groupBy({ by: ['status'], _count: { status: true } }),
        db.lead.groupBy({ by: ['serviceInterest'], _count: { serviceInterest: true } }),
        db.lead.groupBy({ by: ['source'], _count: { source: true } })
      ]);

      return res.json({
        success: true,
        data: {
          totalLeads: totalCount,
          leadsToday: todayCount,
          byStatus: Object.fromEntries(statusDistribution.map(s => [s.status, s._count.status])),
          byService: Object.fromEntries(serviceDistribution.map(s => [s.serviceInterest, s._count.serviceInterest])),
          bySource: Object.fromEntries(sourceDistribution.map(s => [s.source, s._count.source]))
        }
      });
    }

    // Memory fallback stats
    res.json({
      success: true,
      data: {
        totalLeads: memoryLeads.length,
        leadsToday: memoryLeads.length,
        byStatus: { NUEVO: memoryLeads.length },
        byService: {},
        bySource: { web_form: memoryLeads.length }
      }
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/leads - List and Search Leads (Filtered & Paginated)
app.get('/api/leads', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status, service, search, page = '1', limit = '50' } = req.query;
    const pageNum = Math.max(1, parseInt(page as string, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit as string, 10) || 50));
    const skip = (pageNum - 1) * limitNum;

    if (db && isDbAvailable) {
      const whereClause: any = {};

      if (status && typeof status === 'string' && status !== 'ALL') {
        whereClause.status = status;
      }

      if (service && typeof service === 'string' && service !== 'ALL') {
        whereClause.serviceInterest = mapServiceInterest(service);
      }

      if (search && typeof search === 'string' && search.trim() !== '') {
        whereClause.OR = [
          { fullName: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
          { company: { contains: search, mode: 'insensitive' } },
          { message: { contains: search, mode: 'insensitive' } }
        ];
      }

      const [total, leads] = await Promise.all([
        db.lead.count({ where: whereClause }),
        db.lead.findMany({
          where: whereClause,
          orderBy: { createdAt: 'desc' },
          skip,
          take: limitNum
        })
      ]);

      return res.json({
        success: true,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(total / limitNum)
        },
        data: leads
      });
    }

    // Memory fallback list
    res.json({
      success: true,
      pagination: { total: memoryLeads.length, page: 1, limit: 50, totalPages: 1 },
      data: memoryLeads
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/leads/:id - Get Single Lead
app.get('/api/leads/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = String(req.params.id);

    if (db && isDbAvailable) {
      const lead = await db.lead.findUnique({ where: { id } });
      if (!lead) {
        return res.status(404).json({ success: false, message: 'Lead no encontrado' });
      }
      return res.json({ success: true, data: lead });
    }

    const lead = memoryLeads.find(l => l.id === id);
    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead no encontrado' });
    }
    res.json({ success: true, data: lead });
  } catch (error) {
    next(error);
  }
});

// PATCH /api/leads/:id - Update Status / Notes
app.patch('/api/leads/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = String(req.params.id);
    const validatedUpdate = UpdateLeadSchema.parse(req.body);

    if (db && isDbAvailable) {
      const updated = await db.lead.update({
        where: { id },
        data: {
          ...(validatedUpdate.status ? { status: validatedUpdate.status } : {}),
          ...(validatedUpdate.notes !== undefined ? { notes: validatedUpdate.notes } : {})
        }
      });
      return res.json({ success: true, message: 'Lead actualizado correctamente', data: updated });
    }

    const leadIndex = memoryLeads.findIndex(l => l.id === id);
    if (leadIndex === -1) {
      return res.status(404).json({ success: false, message: 'Lead no encontrado' });
    }
    if (validatedUpdate.status) memoryLeads[leadIndex].status = validatedUpdate.status;
    if (validatedUpdate.notes !== undefined) memoryLeads[leadIndex].notes = validatedUpdate.notes;
    memoryLeads[leadIndex].updatedAt = new Date();

    res.json({ success: true, message: 'Lead actualizado en memoria', data: memoryLeads[leadIndex] });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ success: false, message: 'Datos inválidos', errors: error.errors });
    }
    next(error);
  }
});

// DELETE /api/leads/:id - Delete Lead
app.delete('/api/leads/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = String(req.params.id);

    if (db && isDbAvailable) {
      await db.lead.delete({ where: { id } });
      return res.json({ success: true, message: 'Lead eliminado correctamente' });
    }

    const leadIndex = memoryLeads.findIndex(l => l.id === id);
    if (leadIndex === -1) {
      return res.status(404).json({ success: false, message: 'Lead no encontrado' });
    }
    memoryLeads.splice(leadIndex, 1);
    res.json({ success: true, message: 'Lead eliminado' });
  } catch (error) {
    next(error);
  }
});

// ----------------------------------------------------
// 4. CENTRALIZED ERROR HANDLER & SERVER BOOT
// ----------------------------------------------------
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('[Unhandled Server Error]', err);
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor. Por favor intenta más tarde.'
  });
});

app.listen(PORT, async () => {
  console.log(`\n======================================================`);
  console.log(`🚀 Averiq Backend API running on port ${PORT}`);
  console.log(`🌐 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📊 Leads Analytics API: http://localhost:${PORT}/api/leads/stats`);
  console.log(`======================================================\n`);
  await checkDbConnection();
});
