import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Bot, 
  X, 
  Send
} from 'lucide-react';

interface ChatMessage {
  sender: 'bot' | 'user';
  text: string;
  time?: string;
  isLeadConfirmation?: boolean;
}

export const LiveChatWidget: React.FC = () => {
  const { i18n } = useTranslation();
  const isEs = i18n.language.startsWith('es');

  const [isOpen, setIsOpen] = useState(false);
  const [sessionId] = useState(() => {
    const existing = typeof window !== 'undefined' ? sessionStorage.getItem('averiq_chat_session') : null;
    if (existing) return existing;
    const newId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    if (typeof window !== 'undefined') sessionStorage.setItem('averiq_chat_session', newId);
    return newId;
  });

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: 'bot',
      text: isEs 
        ? "¡Hola! 👋 Soy el asistente inteligente de Averiq. ¿En qué solución para tu negocio o consulta puedo orientarte?" 
        : "Hello! 👋 I'm the Averiq assistant. Which solution or service can I guide you with?",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const widgetScrollContainerRef = useRef<HTMLDivElement>(null);
  const isWidgetInitialMount = useRef(true);

  useEffect(() => {
    if (isWidgetInitialMount.current) {
      isWidgetInitialMount.current = false;
      return;
    }
    if (isOpen && widgetScrollContainerRef.current) {
      widgetScrollContainerRef.current.scrollTo({
        top: widgetScrollContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, typing, isOpen]);

  const handleSend = async (preset?: string) => {
    const text = preset || input;
    if (!text.trim() || typing) return;

    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMessages(prev => [...prev, { sender: 'user', text, time: currentTime }]);
    if (!preset) setInput('');
    setTyping(true);

    try {
      let response: Response;
      try {
        response = await fetch('/api/ai/assistant', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId,
            message: text,
            history: messages.slice(-8).map(m => ({ sender: m.sender, text: m.text })),
            locale: i18n.language
          })
        });
        if (response.status === 404) {
          response = await fetch('http://localhost:5000/api/ai/assistant', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              sessionId,
              message: text,
              history: messages.slice(-8).map(m => ({ sender: m.sender, text: m.text })),
              locale: i18n.language
            })
          });
        }
      } catch (netErr) {
        response = await fetch('http://localhost:5000/api/ai/assistant', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId,
            message: text,
            history: messages.slice(-8).map(m => ({ sender: m.sender, text: m.text })),
            locale: i18n.language
          })
        });
      }

      const resData = await response.json();

      if (resData.success && resData.data?.reply) {
        const botMsg: ChatMessage = {
          sender: 'bot',
          text: resData.data.reply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        
        const newMsgs: ChatMessage[] = [botMsg];

        if (resData.data.leadCaptured) {
          newMsgs.push({
            sender: 'bot',
            text: isEs
              ? "⚡ ¡Datos registrados con éxito! Un consultor especializado de Averiq se comunicará a la brevedad."
              : "⚡ Contact details recorded! An Averiq specialist will reach out shortly.",
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isLeadConfirmation: true
          });
        }

        setMessages(prev => [...prev, ...newMsgs]);
      } else {
        throw new Error('Assistant fallback');
      }

    } catch (err) {
      let reply = "";
      const lower = text.toLowerCase();

      if (lower.includes("hola") || lower.includes("hi") || lower.includes("hello")) {
        reply = isEs 
          ? "¡Hola! En Averiq desarrollamos soluciones a medida: Chatbots, POS, Cuentas a Pagar, Turnos médicos y Consultoría de IA. ¿Querés agendar un llamado o ver una demo?"
          : "Hello! At Averiq we engineer custom SaaS: Chatbots, POS, Accounts Payable, Clinic Management and Enterprise AI. Would you like to book a call or see a demo?";
      } else if (lower.includes("demo") || lower.includes("contacto") || lower.includes("contact") || lower.includes("precio")) {
        reply = isEs
          ? "Podés completar el formulario de contacto o hablar directamente con nuestros directores por WhatsApp al +54 9 264 585-9829."
          : "You can submit the contact form or reach our directors directly via WhatsApp at +54 9 264 585-9829.";
      } else {
        reply = isEs
          ? `Excelente consulta sobre "${text}". Podemos adaptar nuestros módulos específicamente a los requerimientos de tu empresa.`
          : `Great question regarding "${text}". We can tailor our modules specifically to your business requirements.`;
      }

      setMessages(prev => [...prev, { 
        sender: 'bot', 
        text: reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setTyping(false);
    }
  };

  const handleWhatsAppRedirect = () => {
    window.open("https://wa.me/5492645859829?text=" + encodeURIComponent("Hola Averiq! Vengo del asistente del sitio web y me gustaría hablar con un asesor."), "_blank");
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="relative group p-4 rounded-full bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 text-white shadow-2xl shadow-cyan-500/30 hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center"
          aria-label="Abrir Asistente Averiq"
        >
          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-cyan-400"></span>
          </span>
          <Bot className="w-6 h-6" />
        </button>
      ) : (
        <div className="w-[340px] sm:w-[380px] h-[480px] rounded-3xl glass-panel-glow border border-slate-700/80 shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300">
          
          {/* Widget Header */}
          <div className="p-4 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                  Averiq Assistant
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                </h4>
                <p className="text-[10px] text-slate-400">
                  {isEs ? 'Inteligencia que funciona' : 'Intelligence that works'}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Body */}
          <div 
            ref={widgetScrollContainerRef}
            className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#080C14]/90 text-xs"
          >
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-2xl leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-br-none shadow-md shadow-blue-600/20'
                      : m.isLeadConfirmation
                      ? 'bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 font-medium rounded-bl-none shadow-sm'
                      : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-none shadow-sm'
                  }`}
                >
                  {m.text}
                </div>
                {m.time && (
                  <span className="text-[9px] font-mono text-slate-500 mt-1 px-1">{m.time}</span>
                )}
              </div>
            ))}
            {typing && (
              <div className="p-2.5 rounded-2xl bg-slate-900 border border-slate-800 w-24 flex items-center gap-1.5">
                <span className="text-[10px] font-mono text-cyan-400">Averiq</span>
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.4s]"></span>
              </div>
            )}
          </div>

          {/* Quick suggestions */}
          <div className="px-3 py-2 bg-slate-950 border-t border-slate-800 flex gap-1.5 overflow-x-auto text-[10px]">
            <button
              onClick={() => handleSend(isEs ? "¿Qué servicios ofrecen?" : "What services do you offer?")}
              className="whitespace-nowrap px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300 hover:text-cyan-400 transition"
            >
              {isEs ? 'Servicios' : 'Services'}
            </button>
            <button
              onClick={() => handleSend(isEs ? "¿Cómo pido una demo?" : "How to request a demo?")}
              className="whitespace-nowrap px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300 hover:text-cyan-400 transition"
            >
              {isEs ? 'Pedir Demo' : 'Request Demo'}
            </button>
            <button
              onClick={handleWhatsAppRedirect}
              className="whitespace-nowrap px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-emerald-400 hover:bg-emerald-950/40 transition"
            >
              WhatsApp
            </button>
          </div>

          {/* Input Footer */}
          <div className="p-3 bg-slate-900/90 border-t border-slate-800 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={isEs ? "Escribí tu mensaje..." : "Type your message..."}
              className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
            <button
              onClick={() => handleSend()}
              className="p-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black transition flex items-center justify-center"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}
    </div>
  );
};
