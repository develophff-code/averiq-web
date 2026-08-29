import { GoogleGenAI } from '@google/genai';

let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn('[AI] GEMINI_API_KEY not configured.');
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
}

const AVERIQ_SYSTEM_PROMPT = `
Eres el Asistente Técnico y Consultor Experto de Averiq ("Inteligencia que funciona").
Averiq es una empresa de tecnología e ingeniería de software especializada en Inteligencia Artificial aplicada y desarrollo SaaS a medida.

Soluciones y Servicios Principales de Averiq:
1. Chatbots de Atención al Cliente 24/7: Agentes conversacionales conectados con bases de conocimiento, reducción del 70% en carga de tickets, integración con WhatsApp Business API y Web, escalamiento humano inteligente.
2. Chatbots de Ventas y Prospección: Calificación automática de prospectos, sincronización en tiempo real con CRM, cotizaciones dinámicas y agendamiento directo.
3. POS Inteligente para Pequeños Negocios: Punto de venta ágil, control de inventario multi-sucursal, facturación digital/fiscal y analítica de ventas desde celular, tablet o PC.
4. Cuentas a Pagar & Proveedores: Circuito automatizado de compras con extracción OCR de facturas, detección de comprobantes duplicados, calendario de vencimientos y conciliación.
5. Consultorios Médicos y Obras Sociales: Gestión integral de centros de salud y profesionales, turnos autogestionables, validación de cobertura de obras sociales y recordatorios por WhatsApp.
6. Consultoría e Integración de IA Corporativa: Diagnóstico de cuellos de botella, desarrollo e integración de modelos LLM privados/on-premise, automatización de procesos (RPA + IA) y gobernanza de datos.

Instrucciones de Respuesta:
- Sé pragmático, profesional, claro y tecnológicamente sólido. Evita el "humo" o respuestas genéricas abstractas.
- Explica con precisión arquitecturas técnicas (React, TypeScript, Node.js, PostgreSQL, APIs REST/Webhooks), integraciones y beneficios medibles.
- Si el usuario pregunta en español, responde en español neutro o profesional. Si pregunta en inglés, responde en inglés impecable.
- Mantén las respuestas concisas (1 a 3 párrafos como máximo) para una experiencia conversacional ágil.
`;

const ASSISTANT_SYSTEM_PROMPT = `
Eres el Asistente Inteligente de Averiq ("Inteligencia que funciona").
Tu misión es atender a los visitantes del sitio web, orientarlos sobre nuestros productos y servicios SaaS e IA, y facilitar que agenden una demostración o se contacten con el equipo de Averiq.

Nuestras Soluciones:
1. Chatbots de Atención 24/7 (Soporte multicanal, WhatsApp Business, reducción del 70% en tickets).
2. Chatbots de Ventas & Prospección (Calificación de leads, cotizaciones automáticas, sincronización CRM).
3. POS Inteligente para Pequeños Negocios (Control de stock, facturación digital/AFIP, multi-sucursal).
4. Cuentas a Pagar & Proveedores (Extracción OCR de facturas, control de duplicados, circuito de aprobación).
5. Consultorios Médicos & Obras Sociales (Agenda de turnos online, validación de coberturas, recordatorios por WhatsApp).
6. Consultoría e Integración de IA para Empresas (Modelos LLM privados, automatización de procesos RPA + IA).

Directrices de Conversación:
- Sé cordial, profesional, ágil y resolutivo.
- Respuestas breves y fáciles de leer en dispositivos móviles (máximo 2 párrafos).
- Cuando el usuario manifieste interés en precios, contratar, pedir una demo o hablar con un especialista, invítalo amablemente a compartir su correo, WhatsApp o nombre para que el equipo lo contacte de inmediato.
- Si el usuario comparte datos de contacto (email o teléfono), confírmale calurosamente que el equipo de Averiq se comunicará a la brevedad.
- Si detectas que el usuario proporcionó un email o teléfono de contacto, agrega al final de tu mensaje el siguiente bloque exacto:
<!--LEAD_CAPTURE:{"fullName":"Nombre del usuario","email":"correo o null","phone":"telefono o null","company":"empresa o null","serviceInterest":"saas_custom"}-->
`;

export interface ChatHistoryItem {
  sender: 'user' | 'bot';
  text: string;
}

export interface AssistantResponse {
  reply: string;
  leadCaptured: boolean;
  leadData?: {
    fullName: string;
    email?: string;
    phone?: string;
    company?: string;
    serviceInterest?: string;
  };
  modelUsed: string;
  latencyMs: number;
}

// SIMULATOR AI GENERATOR
export async function generateAveriqChatReply(
  userMessage: string,
  history: ChatHistoryItem[] = [],
  locale: string = 'es'
): Promise<{ reply: string; modelUsed: string; latencyMs: number }> {
  const startTime = Date.now();
  const ai = getAiClient();

  if (!ai) {
    const fallback = locale === 'en'
      ? "At Averiq, we engineer custom SaaS, intelligent chatbots, and enterprise AI workflows. Please reach out via our contact form or WhatsApp for a tailored diagnostic."
      : "En Averiq desarrollamos SaaS a medida, chatbots inteligentes y automatizaciones operativas con IA. Contáctanos por nuestro formulario o WhatsApp para un diagnóstico personalizado.";
    return { reply: fallback, modelUsed: 'fallback-static', latencyMs: Date.now() - startTime };
  }

  const candidateModels = ['gemini-3.6-flash', 'gemini-3.5-flash', 'gemini-flash-latest'];

  const contents = [
    ...history.slice(-6).map(h => ({
      role: h.sender === 'user' ? 'user' : 'model',
      parts: [{ text: h.text }]
    })),
    {
      role: 'user',
      parts: [{ text: userMessage }]
    }
  ];

  for (const modelName of candidateModels) {
    try {
      const response = await ai.models.generateContent({
        model: modelName,
        contents,
        config: {
          systemInstruction: AVERIQ_SYSTEM_PROMPT,
          temperature: 0.6
        }
      });

      const reply = response.text || (locale === 'en' ? "How else can I assist with Averiq's solutions?" : "¿En qué otra solución de Averiq puedo orientarte?");
      const latencyMs = Date.now() - startTime;
      return { reply, modelUsed: modelName, latencyMs };
    } catch (err: any) {
      console.warn(`[AI Error] Model ${modelName} failed:`, err.message);
    }
  }

  const latencyMs = Date.now() - startTime;
  const fallback = locale === 'en'
    ? "Averiq engineers precise AI & SaaS platforms tailored to your business operations. Connect directly with our engineering team via WhatsApp or the contact section."
    : "Averiq diseña software a medida e inteligencia artificial adaptada a los flujos reales de tu negocio. Conéctate directamente con nuestro equipo por WhatsApp o el formulario de contacto.";

  return { reply: fallback, modelUsed: 'fallback-safe', latencyMs };
}

// FLOATING ASSISTANT AI GENERATOR (WITH AUTONOMOUS LEAD EXTRACTION)
export async function generateAssistantReply(
  userMessage: string,
  history: ChatHistoryItem[] = [],
  locale: string = 'es'
): Promise<AssistantResponse> {
  const startTime = Date.now();
  const ai = getAiClient();

  if (!ai) {
    const fallback = locale === 'en'
      ? "Hello! I can guide you through our SaaS, Chatbots, and AI solutions. Feel free to contact our team via WhatsApp or the form below."
      : "¡Hola! Puedo orientarte sobre nuestros Chatbots, POS, Turnos médicos y Consultoría de IA. También podés hablar directamente con un asesor por WhatsApp.";
    return { reply: fallback, leadCaptured: false, modelUsed: 'fallback-static', latencyMs: Date.now() - startTime };
  }

  const candidateModels = ['gemini-3.6-flash', 'gemini-3.5-flash', 'gemini-flash-latest'];

  const contents = [
    ...history.slice(-8).map(h => ({
      role: h.sender === 'user' ? 'user' : 'model',
      parts: [{ text: h.text }]
    })),
    {
      role: 'user',
      parts: [{ text: userMessage }]
    }
  ];

  for (const modelName of candidateModels) {
    try {
      const response = await ai.models.generateContent({
        model: modelName,
        contents,
        config: {
          systemInstruction: ASSISTANT_SYSTEM_PROMPT,
          temperature: 0.65
        }
      });

      let rawReply = response.text || "";
      let leadCaptured = false;
      let leadData: any = undefined;

      // Extract <!--LEAD_CAPTURE:...--> if present
      const leadMatch = rawReply.match(/<!--LEAD_CAPTURE:(\{.*?\})-->/s);
      if (leadMatch) {
        try {
          leadData = JSON.parse(leadMatch[1]);
          leadCaptured = Boolean(leadData.email || leadData.phone);
          // Remove the tag from the user-facing text
          rawReply = rawReply.replace(leadMatch[0], '').trim();
        } catch (parseErr) {
          console.warn('[Assistant Lead Parse Error]', parseErr);
        }
      }

      // Regex fallback: check if user message contains an email or phone number
      if (!leadCaptured) {
        const emailMatch = userMessage.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
        const phoneMatch = userMessage.match(/(?:\+?\d{1,3}[-.\s]?)?\(?\d{2,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{3,4}/);
        
        if (emailMatch || phoneMatch) {
          leadCaptured = true;
          leadData = {
            fullName: 'Usuario Web (Chat)',
            email: emailMatch ? emailMatch[0] : undefined,
            phone: phoneMatch ? phoneMatch[0] : undefined,
            serviceInterest: 'saas_custom'
          };
        }
      }

      const latencyMs = Date.now() - startTime;
      return {
        reply: rawReply,
        leadCaptured,
        leadData,
        modelUsed: modelName,
        latencyMs
      };
    } catch (err: any) {
      console.warn(`[Assistant Error] Model ${modelName} failed:`, err.message);
    }
  }

  const latencyMs = Date.now() - startTime;
  return {
    reply: locale === 'en'
      ? "I can connect you with an Averiq specialist right away via WhatsApp or our contact form."
      : "Puedo conectarte de inmediato con un especialista de Averiq por WhatsApp o a través de nuestro formulario.",
    leadCaptured: false,
    modelUsed: 'fallback-safe',
    latencyMs
  };
}
