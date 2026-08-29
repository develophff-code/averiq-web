import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Bot, 
  Store, 
  Stethoscope, 
  FileText, 
  Send, 
  Sparkles, 
  CheckCircle, 
  ShoppingCart, 
  ShieldCheck, 
  RefreshCw,
  Trash2,
  Calendar,
  Clock,
  Cpu
} from 'lucide-react';

export const InteractiveSimulator: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState<'chatbot' | 'pos' | 'clinics' | 'finance'>('chatbot');
  const isEs = i18n.language.startsWith('es');

  // =========================================================================
  // 1. CHATBOT SIMULATOR STATE & AI INTEGRATION (GEMINI REAL-TIME)
  // =========================================================================
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'bot'; text: string; time: string; latency?: number }>>([
    {
      sender: 'bot',
      text: isEs 
        ? "¡Hola! Soy el Agente Técnico de Averiq impulsado por IA en tiempo real. Pregúntame sobre arquitectura, integraciones con WhatsApp, POS, turnos médicos o desarrollo SaaS a medida."
        : "Hello! I am Averiq's real-time AI Technical Agent. Ask me about system architecture, WhatsApp integration, POS, clinic management, or custom SaaS engineering.",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [lastLatency, setLastLatency] = useState<number | null>(null);

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeTab === 'chatbot') {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isBotTyping, activeTab]);

  const handleSendChat = async (textToSend?: string) => {
    const query = textToSend || chatInput;
    if (!query.trim() || isBotTyping) return;

    const userMsg = {
      sender: 'user' as const,
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, userMsg]);
    if (!textToSend) setChatInput('');
    setIsBotTyping(true);

    try {
      let response: Response;
      try {
        response = await fetch('/api/ai/simulate-chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: query,
            history: chatMessages.slice(-6).map(m => ({ sender: m.sender, text: m.text })),
            locale: i18n.language
          })
        });
        if (response.status === 404) {
          response = await fetch('http://localhost:5000/api/ai/simulate-chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              message: query,
              history: chatMessages.slice(-6).map(m => ({ sender: m.sender, text: m.text })),
              locale: i18n.language
            })
          });
        }
      } catch (netErr) {
        response = await fetch('http://localhost:5000/api/ai/simulate-chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: query,
            history: chatMessages.slice(-6).map(m => ({ sender: m.sender, text: m.text })),
            locale: i18n.language
          })
        });
      }

      const resData = await response.json();

      if (resData.success && resData.data?.reply) {
        setLastLatency(resData.data.latencyMs || 420);
        setChatMessages(prev => [...prev, {
          sender: 'bot',
          text: resData.data.reply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          latency: resData.data.latencyMs
        }]);
      } else {
        throw new Error('Fallback required');
      }

    } catch (err) {
      let botResponse = "";
      const lower = query.toLowerCase();

      if (lower.includes("precio") || lower.includes("cost") || lower.includes("cuanto") || lower.includes("quote")) {
        botResponse = isEs 
          ? "Nuestros desarrollos SaaS y chatbots se presupuestan según el alcance exacto de tu negocio. Podés agendar un diagnóstico sin cargo en la sección Contacto."
          : "Our custom SaaS and chatbots are priced according to your exact business scope. You can book a free diagnostic in the Contact section.";
      } else if (lower.includes("turno") || lower.includes("medico") || lower.includes("clinic") || lower.includes("appointment")) {
        botResponse = isEs
          ? "El módulo de Consultorios sincroniza turnos en tiempo real, valida obras sociales y envía recordatorios por WhatsApp reduciendo el ausentismo en un 40%."
          : "The Clinic module syncs appointments in real time, validates insurance, and sends automated WhatsApp reminders reducing no-shows by 40%.";
      } else if (lower.includes("pos") || lower.includes("stock") || lower.includes("venta")) {
        botResponse = isEs
          ? "El POS de Averiq funciona en cualquier dispositivo (tablet, celular o PC), emite comprobantes digitales y mantiene el stock multi-sucursal sincronizado."
          : "Averiq POS runs on any device (tablet, mobile or PC), issues digital receipts, and keeps multi-branch inventory synced.";
      } else {
        botResponse = isEs
          ? `En Averiq diseñamos la arquitectura precisa para "${query}", conectando modelos de IA con tus bases de datos (PostgreSQL), APIs y WhatsApp Business.`
          : `At Averiq we engineer the precise architecture for "${query}", connecting AI models with your databases (PostgreSQL), APIs, and WhatsApp Business.`;
      }

      setChatMessages(prev => [...prev, {
        sender: 'bot',
        text: botResponse,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setIsBotTyping(false);
    }
  };

  // =========================================================================
  // 2. POS SIMULATOR STATE & ADVANCED COMPUTATION
  // =========================================================================
  const [posCart, setPosCart] = useState<Array<{ id: number; name: string; price: number; qty: number }>>([
    { id: 1, name: isEs ? "Café de Especialidad 250g" : "Specialty Coffee 250g", price: 4500, qty: 2 },
    { id: 2, name: isEs ? "Taza Térmica Averiq" : "Averiq Thermal Mug", price: 7800, qty: 1 }
  ]);
  const [posSuccess, setPosSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'qr' | 'card' | 'cash'>('qr');
  const [discountApplied, setDiscountApplied] = useState(false);

  const addItemToCart = (item: { name: string; price: number }) => {
    setPosCart(prev => {
      const existing = prev.find(i => i.name === item.name);
      if (existing) {
        return prev.map(i => i.name === item.name ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...prev, { id: Date.now(), name: item.name, price: item.price, qty: 1 }];
    });
  };

  const removeItem = (id: number) => {
    setPosCart(prev => prev.filter(item => item.id !== id));
  };

  const rawTotal = posCart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const posTotal = discountApplied ? Math.round(rawTotal * 0.9) : rawTotal;

  const handleCheckout = () => {
    if (posCart.length === 0) return;
    setPosSuccess(true);
    setTimeout(() => {
      setPosSuccess(false);
      setPosCart([]);
      setDiscountApplied(false);
    }, 3000);
  };

  // =========================================================================
  // 3. CLINICS SIMULATOR STATE & REALISTIC BOOKING
  // =========================================================================
  const [selectedDoctor, setSelectedDoctor] = useState("Dra. Florencia Silva (Cardiología)");
  const [selectedInsurance, setSelectedInsurance] = useState("OSDE 310");
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  const doctorsList = [
    { name: "Dra. Florencia Silva (Cardiología)", slots: ["09:30 hs", "11:00 hs", "16:15 hs"] },
    { name: "Dr. Mariano Castro (Traumatología)", slots: ["10:15 hs", "14:30 hs", "18:00 hs"] },
    { name: "Dra. Lucía Méndez (Dermatología)", slots: ["08:45 hs", "12:30 hs", "15:00 hs"] }
  ];

  const currentDoctorData = doctorsList.find(d => d.name === selectedDoctor) || doctorsList[0];

  const handleConfirmBooking = (slot: string) => {
    setSelectedSlot(slot);
    setBookingConfirmed(true);
  };

  // =========================================================================
  // 4. FINANCE / AP OCR SIMULATOR STATE
  // =========================================================================
  const invoicePresets = [
    {
      provider: "Servicios Cloud AWS / Hosting",
      cuit: "30-71489201-9",
      number: "FC-A-0001-00049281",
      neto: "$ 122.727,27",
      iva: "$ 25.772,73",
      amount: "$ 148.500,00",
      dueDate: "28/08/2026",
      confidence: "99.8%",
      status: "VALIDADO SIN DUPLICADOS — APROBADO"
    },
    {
      provider: "Distribuidora Tech Argentina S.A.",
      cuit: "30-68994321-4",
      number: "FC-A-0008-00091244",
      neto: "$ 315.785,12",
      iva: "$ 66.314,88",
      amount: "$ 382.100,00",
      dueDate: "05/09/2026",
      confidence: "99.4%",
      status: "VALIDADO SIN DUPLICADOS — APROBADO"
    },
    {
      provider: "Consultora Legal & Tributaria",
      cuit: "33-70112948-9",
      number: "FC-A-0002-00018440",
      neto: "$ 173.553,72",
      iva: "$ 36.446,28",
      amount: "$ 210.000,00",
      dueDate: "12/09/2026",
      confidence: "99.9%",
      status: "VALIDADO SIN DUPLICADOS — APROBADO"
    }
  ];

  const [invoiceIndex, setInvoiceIndex] = useState(0);
  const [isScanning, setIsScanning] = useState(false);
  const currentInvoice = invoicePresets[invoiceIndex];

  const triggerScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setInvoiceIndex(prev => (prev + 1) % invoicePresets.length);
    }, 600);
  };

  return (
    <section id="simulador" className="py-20 relative bg-slate-950/40 border-y border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-700/80 text-xs font-semibold text-cyan-400 font-mono">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t('simulator.badge')}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-heading">
            {t('simulator.title')}
          </h2>
          <p className="text-sm sm:text-base text-slate-400">
            {t('simulator.subtitle')}
          </p>
        </div>

        {/* Tab Selectors */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          <button
            onClick={() => setActiveTab('chatbot')}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
              activeTab === 'chatbot'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20'
                : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Bot className="w-4 h-4" />
            <span>{t('simulator.tabs.chatbot')}</span>
          </button>

          <button
            onClick={() => setActiveTab('pos')}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
              activeTab === 'pos'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-black font-bold shadow-lg shadow-emerald-500/20'
                : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Store className="w-4 h-4" />
            <span>{t('simulator.tabs.pos')}</span>
          </button>

          <button
            onClick={() => setActiveTab('clinics')}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
              activeTab === 'clinics'
                ? 'bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-lg shadow-rose-500/20'
                : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Stethoscope className="w-4 h-4" />
            <span>{t('simulator.tabs.clinics')}</span>
          </button>

          <button
            onClick={() => setActiveTab('finance')}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
              activeTab === 'finance'
                ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-black font-bold shadow-lg shadow-amber-500/20'
                : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>{t('simulator.tabs.finance')}</span>
          </button>
        </div>

        {/* Dynamic Simulator Container */}
        <div className="max-w-4xl mx-auto rounded-3xl glass-panel-glow border border-slate-700/80 p-6 sm:p-8 shadow-2xl">
          
          {/* ========================================================= */}
          {/* TAB 1: CHATBOT PLAYGROUND (GOOGLE GEMINI REAL-TIME)       */}
          {/* ========================================================= */}
          {activeTab === 'chatbot' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-3 gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      Averiq Interactive Support Agent
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    </h4>
                    <p className="text-[11px] text-slate-400 flex items-center gap-1.5">
                      <Cpu className="w-3 h-3 text-cyan-400" />
                      <span>{isEs ? 'Impulsado por Google Gemini en tiempo real' : 'Powered by Google Gemini Real-Time'}</span>
                    </p>
                  </div>
                </div>
                {lastLatency && (
                  <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 self-start sm:self-auto">
                    ⚡ Latencia: {lastLatency}ms
                  </span>
                )}
              </div>

              {/* Chat Message History */}
              <div className="h-72 overflow-y-auto space-y-3 p-4 rounded-2xl bg-slate-950/90 border border-slate-800/80">
                {chatMessages.map((msg, idx) => (
                  <div 
                    key={idx} 
                    className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div 
                      className={`max-w-[85%] p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                        msg.sender === 'user'
                          ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-br-none shadow-md shadow-blue-600/20'
                          : 'bg-slate-900/95 border border-slate-800 text-slate-200 rounded-bl-none shadow-sm'
                      }`}
                    >
                      {msg.text}
                    </div>
                    <div className="flex items-center gap-2 text-[9px] font-mono text-slate-500 mt-1 px-1">
                      <span>{msg.time}</span>
                      {msg.latency && <span>• {msg.latency}ms</span>}
                    </div>
                  </div>
                ))}
                {isBotTyping && (
                  <div className="flex items-center gap-2 p-3.5 rounded-2xl bg-slate-900 border border-slate-800 w-28">
                    <span className="text-[10px] font-mono text-cyan-400">Averiq</span>
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce" />
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.2s]" />
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.4s]" />
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Quick Prompt Pills */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-[11px] text-slate-400">
                  {isEs ? 'Preguntas sugeridas:' : 'Suggested prompts:'}
                </span>
                <button
                  onClick={() => handleSendChat(isEs ? "¿Cómo integran el chatbot con WhatsApp Business API?" : "How do you integrate with WhatsApp Business API?")}
                  className="text-[11px] px-3 py-1 rounded-full bg-slate-900 hover:bg-cyan-950/60 border border-slate-700 hover:border-cyan-500/50 text-cyan-300 transition"
                >
                  WhatsApp API
                </button>
                <button
                  onClick={() => handleSendChat(isEs ? "¿Cómo funciona el módulo de turnos médicos y obras sociales?" : "How does the medical appointment and insurance module work?")}
                  className="text-[11px] px-3 py-1 rounded-full bg-slate-900 hover:bg-cyan-950/60 border border-slate-700 hover:border-cyan-500/50 text-cyan-300 transition"
                >
                  {isEs ? 'Consultorios & Obras Sociales' : 'Clinics & Insurance'}
                </button>
                <button
                  onClick={() => handleSendChat(isEs ? "¿Qué stack tecnológico usan para desarrollar SaaS a medida?" : "What tech stack do you use for custom SaaS?")}
                  className="text-[11px] px-3 py-1 rounded-full bg-slate-900 hover:bg-cyan-950/60 border border-slate-700 hover:border-cyan-500/50 text-cyan-300 transition"
                >
                  {isEs ? 'Stack Tecnológico' : 'Tech Stack'}
                </button>
              </div>

              {/* Chat Input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
                  placeholder={isEs ? "Escribe cualquier consulta técnica para que la IA responda..." : "Ask any technical question for AI to answer..."}
                  className="flex-1 px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-cyan-500"
                />
                <button
                  onClick={() => handleSendChat()}
                  disabled={isBotTyping || !chatInput.trim()}
                  className="px-5 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-black font-bold text-xs sm:text-sm flex items-center gap-1.5 transition"
                >
                  <Send className="w-4 h-4" />
                  <span className="hidden sm:inline">{isEs ? 'Enviar' : 'Send'}</span>
                </button>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 2: POS PLAYGROUND                                     */}
          {/* ========================================================= */}
          {activeTab === 'pos' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                    <Store className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Averiq Smart POS — Punto de Venta Express</h4>
                    <p className="text-[11px] text-slate-400">Terminal de Cobro, Facturación & Control de Inventario</p>
                  </div>
                </div>
                <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-400">
                  Caja #01: ONLINE
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Catalog Quick Add */}
                <div className="space-y-3">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    {isEs ? 'Catálogo Rápido (Tocar para agregar)' : 'Quick Catalog (Click to add)'}
                  </div>
                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      onClick={() => addItemToCart({ name: isEs ? "Pack 3 Remeras" : "Pack 3 T-Shirts", price: 18500 })}
                      className="p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 text-left transition flex flex-col justify-between group"
                    >
                      <span className="text-xs font-semibold text-white group-hover:text-emerald-300 transition-colors">{isEs ? 'Pack 3 Remeras' : 'Pack 3 T-Shirts'}</span>
                      <span className="text-xs font-mono font-bold text-emerald-400 mt-2">$ 18.500</span>
                    </button>
                    <button
                      onClick={() => addItemToCart({ name: isEs ? "Mochila Urbana" : "Urban Backpack", price: 34000 })}
                      className="p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 text-left transition flex flex-col justify-between group"
                    >
                      <span className="text-xs font-semibold text-white group-hover:text-emerald-300 transition-colors">{isEs ? 'Mochila Urbana' : 'Urban Backpack'}</span>
                      <span className="text-xs font-mono font-bold text-emerald-400 mt-2">$ 34.000</span>
                    </button>
                    <button
                      onClick={() => addItemToCart({ name: isEs ? "Auriculares Wireless" : "Wireless Headphones", price: 29900 })}
                      className="p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 text-left transition flex flex-col justify-between group"
                    >
                      <span className="text-xs font-semibold text-white group-hover:text-emerald-300 transition-colors">{isEs ? 'Auriculares BT' : 'BT Headphones'}</span>
                      <span className="text-xs font-mono font-bold text-emerald-400 mt-2">$ 29.900</span>
                    </button>
                    <button
                      onClick={() => addItemToCart({ name: isEs ? "Servicio Técnico Express" : "Express Tech Support", price: 12000 })}
                      className="p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 text-left transition flex flex-col justify-between group"
                    >
                      <span className="text-xs font-semibold text-white group-hover:text-emerald-300 transition-colors">{isEs ? 'Servicio Express' : 'Tech Support'}</span>
                      <span className="text-xs font-mono font-bold text-emerald-400 mt-2">$ 12.000</span>
                    </button>
                  </div>

                  {/* Payment method selector */}
                  <div className="pt-2">
                    <span className="text-[11px] text-slate-400 block mb-1.5 font-medium">Método de Cobro:</span>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => setPaymentMethod('qr')}
                        className={`p-2 rounded-lg text-xs font-semibold border transition ${paymentMethod === 'qr' ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300' : 'bg-slate-900 border-slate-800 text-slate-400'}`}
                      >
                        QR Interoperable
                      </button>
                      <button
                        onClick={() => setPaymentMethod('card')}
                        className={`p-2 rounded-lg text-xs font-semibold border transition ${paymentMethod === 'card' ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300' : 'bg-slate-900 border-slate-800 text-slate-400'}`}
                      >
                        Tarjeta / Débito
                      </button>
                      <button
                        onClick={() => setPaymentMethod('cash')}
                        className={`p-2 rounded-lg text-xs font-semibold border transition ${paymentMethod === 'cash' ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300' : 'bg-slate-900 border-slate-800 text-slate-400'}`}
                      >
                        Efectivo
                      </button>
                    </div>
                  </div>
                </div>

                {/* Live Cart Ticket */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
                      <span className="text-xs font-mono text-slate-400 font-bold">Ticket Digital #1094</span>
                      <span className="text-[10px] font-mono text-emerald-400 font-bold">AFIP Factura B</span>
                    </div>

                    <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                      {posCart.length === 0 ? (
                        <div className="text-center py-6 text-xs text-slate-500">
                          {isEs ? 'El carrito está vacío. Agregá productos.' : 'Cart is empty. Add products.'}
                        </div>
                      ) : (
                        posCart.map(item => (
                          <div key={item.id} className="flex items-center justify-between text-xs group">
                            <span className="text-slate-300">{item.name} x{item.qty}</span>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-white font-semibold">
                                $ {(item.price * item.qty).toLocaleString()}
                              </span>
                              <button onClick={() => removeItem(item.id)} className="text-slate-600 hover:text-rose-400 transition">
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-800 space-y-3">
                    {/* Discount toggle */}
                    <div className="flex items-center justify-between text-xs">
                      <button
                        onClick={() => setDiscountApplied(!discountApplied)}
                        className={`text-[11px] underline ${discountApplied ? 'text-emerald-400 font-bold' : 'text-slate-400'}`}
                      >
                        {discountApplied ? '✓ Descuento 10% aplicado' : '+ Aplicar Cupón AVERIQ10'}
                      </button>
                      {discountApplied && (
                        <span className="font-mono text-emerald-400 text-xs">-$ {Math.round(rawTotal * 0.1).toLocaleString()}</span>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="font-bold text-slate-300">TOTAL:</span>
                      <span className="text-lg font-bold font-mono text-emerald-400">
                        $ {posTotal.toLocaleString()}
                      </span>
                    </div>

                    {posSuccess ? (
                      <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs text-center font-bold flex items-center justify-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        <span>{isEs ? '¡Cobro registrado! Ticket enviado por WhatsApp' : 'Payment processed! Receipt sent via WhatsApp'}</span>
                      </div>
                    ) : (
                      <button
                        onClick={handleCheckout}
                        disabled={posCart.length === 0}
                        className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-black font-extrabold text-xs transition flex items-center justify-center gap-2"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        <span>{isEs ? 'Cobrar & Emitir Comprobante' : 'Checkout & Print Receipt'}</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 3: CLINICS PLAYGROUND                                 */}
          {/* ========================================================= */}
          {activeTab === 'clinics' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
                    <Stethoscope className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Averiq MedTech — Turnos & Obras Sociales</h4>
                    <p className="text-[11px] text-slate-400">Gestión Integral de Consultorios, Especialidades y Pacientes</p>
                  </div>
                </div>
                <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-rose-950/60 border border-rose-500/40 text-rose-400">
                  Agenda Sincronizada
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-2">
                  <label className="text-slate-400 font-medium">{isEs ? 'Profesional Médico / Especialidad:' : 'Medical Professional / Specialty:'}</label>
                  <select
                    value={selectedDoctor}
                    onChange={(e) => {
                      setSelectedDoctor(e.target.value);
                      setBookingConfirmed(false);
                    }}
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-rose-500"
                  >
                    {doctorsList.map(d => (
                      <option key={d.name} value={d.name}>{d.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-slate-400 font-medium">{isEs ? 'Obra Social / Cobertura Médica:' : 'Health Insurance:'}</label>
                  <select
                    value={selectedInsurance}
                    onChange={(e) => setSelectedInsurance(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-emerald-400 font-mono font-bold focus:outline-none focus:border-emerald-500"
                  >
                    <option>OSDE 310 - AFILIADO ACTIVO</option>
                    <option>Swiss Medical - PLAN BLACK</option>
                    <option>Galeno - COBERTURA 220</option>
                    <option>Medifé - PLAN PLATA</option>
                    <option>Particular / Consulta Privada</option>
                  </select>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-300 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-rose-400" />
                    {isEs ? 'Turnos Disponibles para Mañana:' : 'Available Slots Tomorrow:'}
                  </span>
                  <span className="text-[10px] text-slate-500">Duración: 30 min</span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {currentDoctorData.slots.map(slot => (
                    <button 
                      key={slot}
                      onClick={() => handleConfirmBooking(slot)}
                      className={`p-3 rounded-xl border text-center font-mono text-xs transition flex items-center justify-center gap-1.5 ${
                        selectedSlot === slot && bookingConfirmed
                          ? 'bg-rose-600 text-white border-rose-500 shadow-md shadow-rose-600/30'
                          : 'bg-slate-900 hover:bg-rose-950/40 hover:border-rose-500/50 border-slate-800 text-slate-200'
                      }`}
                    >
                      <Clock className="w-3 h-3 text-rose-400" />
                      <span>{slot}</span>
                    </button>
                  ))}
                </div>

                {bookingConfirmed && (
                  <div className="mt-3 p-3.5 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-semibold flex items-center justify-between animate-in fade-in">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-rose-400 shrink-0" />
                      <div>
                        <div>¡Turno reservado para las {selectedSlot} con {selectedDoctor.split(' (')[0]}!</div>
                        <div className="text-[10px] text-rose-400 font-normal mt-0.5">
                          Cobertura ({selectedInsurance}) validada. Recordatorio programado por WhatsApp.
                        </div>
                      </div>
                    </div>
                    <button onClick={() => setBookingConfirmed(false)} className="text-[10px] underline ml-2 shrink-0">Nuevo Turno</button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 4: FINANCE / AP OCR PLAYGROUND                        */}
          {/* ========================================================= */}
          {activeTab === 'finance' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Averiq FinOps — Cuentas a Pagar & Proveedores</h4>
                    <p className="text-[11px] text-slate-400">Extracción Inteligente OCR, Detección de Duplicados & Control de Pagos</p>
                  </div>
                </div>
                <button
                  onClick={triggerScan}
                  disabled={isScanning}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs transition"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
                  <span>{isEs ? 'Escanear Otra Factura' : 'Scan Next Invoice'}</span>
                </button>
              </div>

              {/* Scanned Document Data Card */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <div className="text-[10px] text-slate-500 uppercase font-mono">Proveedor Detectado</div>
                    <div className="font-bold text-white mt-1 truncate">{currentInvoice.provider}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <div className="text-[10px] text-slate-500 uppercase font-mono">CUIT / Tax ID</div>
                    <div className="font-mono text-cyan-400 font-bold mt-1">{currentInvoice.cuit}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <div className="text-[10px] text-slate-500 uppercase font-mono">N° Comprobante</div>
                    <div className="font-mono text-slate-300 font-bold mt-1">{currentInvoice.number}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <div className="text-[10px] text-slate-500 uppercase font-mono">Neto Gravado + IVA</div>
                    <div className="font-mono text-slate-300 font-bold mt-1">{currentInvoice.neto} + {currentInvoice.iva}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <div className="text-[10px] text-slate-500 uppercase font-mono">Monto Total</div>
                    <div className="font-mono text-emerald-400 font-bold text-sm mt-1">{currentInvoice.amount}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <div className="text-[10px] text-slate-500 uppercase font-mono">Confianza OCR & Auditoría</div>
                    <div className="text-[11px] font-mono text-emerald-300 font-bold mt-1 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{currentInvoice.confidence} — OK</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>
    </section>
  );
};
