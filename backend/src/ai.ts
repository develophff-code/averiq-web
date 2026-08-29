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
- Si el usuario pregunta en español, responde en español neutro o argentino profesional. Si pregunta en inglés, responde en inglés impecable.
- Mantén las respuestas concisas (1 a 3 párrafos como máximo) para una experiencia conversacional ágil en el simulador.
`;

export interface ChatHistoryItem {
  sender: 'user' | 'bot';
  text: string;
}

export async function generateAveriqChatReply(
  userMessage: string,
  history: ChatHistoryItem[] = [],
  locale: string = 'es'
): Promise<{ reply: string; modelUsed: string; latencyMs: number }> {
  const startTime = Date.now();
  const ai = getAiClient();

  if (!ai) {
    // Fallback response if API key is missing
    const fallback = locale === 'en'
      ? "At Averiq, we engineer custom SaaS, intelligent chatbots, and enterprise AI workflows. Please reach out via our contact form or WhatsApp for a tailored diagnostic."
      : "En Averiq desarrollamos SaaS a medida, chatbots inteligentes y automatizaciones operativas con IA. Contáctanos por nuestro formulario o WhatsApp para un diagnóstico personalizado.";
    return { reply: fallback, modelUsed: 'fallback-static', latencyMs: Date.now() - startTime };
  }

  // Model fallback chain: gemini-3.6-flash -> gemini-3.5-flash -> gemini-flash-latest
  const candidateModels = ['gemini-3.6-flash', 'gemini-3.5-flash', 'gemini-flash-latest'];

  // Format conversation history for Gemini
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

  // Graceful fallback if all remote model calls fail
  const latencyMs = Date.now() - startTime;
  const fallback = locale === 'en'
    ? "Averiq engineers precise AI & SaaS platforms tailored to your business operations. Connect directly with our engineering team via WhatsApp or the contact section."
    : "Averiq diseña software a medida e inteligencia artificial adaptada a los flujos reales de tu negocio. Conéctate directamente con nuestro equipo por WhatsApp o el formulario de contacto.";

  return { reply: fallback, modelUsed: 'fallback-safe', latencyMs };
}
