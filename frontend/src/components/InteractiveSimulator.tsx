import React, { useState } from 'react';
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
  RefreshCw
} from 'lucide-react';

export const InteractiveSimulator: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState<'chatbot' | 'pos' | 'clinics' | 'finance'>('chatbot');
  const isEs = i18n.language.startsWith('es');

  // --- CHATBOT SIMULATOR STATE ---
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'bot'; text: string; time: string }>>([
    {
      sender: 'bot',
      text: isEs 
        ? "¡Hola! Soy el asistente inteligente de Averiq. ¿En qué puedo ayudarte hoy?"
        : "Hello! I am Averiq's intelligent assistant. How can I help you today?",
      time: "10:00"
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isBotTyping, setIsBotTyping] = useState(false);

  const handleSendChat = (textToSend?: string) => {
    const query = textToSend || chatInput;
    if (!query.trim()) return;

    const userMsg = {
      sender: 'user' as const,
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, userMsg]);
    if (!textToSend) setChatInput('');
    setIsBotTyping(true);

    setTimeout(() => {
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
          ? `Entendido tu interés en "${query}". En Averiq diseñamos la arquitectura precisa para automatizar este flujo con IA y conectarlo con tu base de datos.`
          : `Understood your inquiry regarding "${query}". At Averiq we engineer the precise architecture to automate this workflow with AI and database sync.`;
      }

      setChatMessages(prev => [...prev, {
        sender: 'bot',
        text: botResponse,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
      setIsBotTyping(false);
    }, 600);
  };

  // --- POS SIMULATOR STATE ---
  const [posCart, setPosCart] = useState<Array<{ id: number; name: string; price: number; qty: number }>>([
    { id: 1, name: isEs ? "Café Especialidad 250g" : "Specialty Coffee 250g", price: 4500, qty: 1 },
    { id: 2, name: isEs ? "Taza Térmica Averiq" : "Averiq Thermal Mug", price: 7800, qty: 1 }
  ]);
  const [posSuccess, setPosSuccess] = useState(false);

  const addItemToCart = (item: { name: string; price: number }) => {
    setPosCart(prev => {
      const existing = prev.find(i => i.name === item.name);
      if (existing) {
        return prev.map(i => i.name === item.name ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...prev, { id: Date.now(), name: item.name, price: item.price, qty: 1 }];
    });
  };

  const posTotal = posCart.reduce((sum, item) => sum + (item.price * item.qty), 0);

  const handleCheckout = () => {
    if (posCart.length === 0) return;
    setPosSuccess(true);
    setTimeout(() => {
      setPosSuccess(false);
      setPosCart([]);
    }, 2500);
  };

  // --- CLINICS SIMULATOR STATE ---
  const [selectedDoctor, setSelectedDoctor] = useState("Dra. Florencia Silva (Cardiología)");
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  // --- FINANCE SIMULATOR STATE ---
  const [scannedInvoice, setScannedInvoice] = useState({
    provider: "Servicios Cloud AWS / Hosting",
    cuit: "30-71489201-9",
    number: "FC-A-0001-00049281",
    amount: "$ 148.500,00",
    dueDate: "28/08/2026",
    status: "VALIDADO SIN DUPLICADOS"
  });
  const [isScanning, setIsScanning] = useState(false);

  const triggerScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setScannedInvoice({
        provider: "Distribuidora Tech Argentina S.A.",
        cuit: "30-68994321-4",
        number: "FC-A-0008-00091244",
        amount: "$ 382.100,00",
        dueDate: "05/09/2026",
        status: "VALIDADO SIN DUPLICADOS - APROBADO"
      });
    }, 800);
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
          
          {/* TAB 1: CHATBOT PLAYGROUND */}
          {activeTab === 'chatbot' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Averiq Interactive Support Agent</h4>
                    <p className="text-[11px] text-slate-400 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                      {isEs ? 'Online en tiempo real' : 'Online real-time'}
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-mono px-2 py-1 rounded bg-slate-900 border border-slate-800 text-cyan-400">
                  Model: Averiq-Conversational-v2
                </span>
              </div>

              {/* Chat Message History */}
              <div className="h-64 overflow-y-auto space-y-3 p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80">
                {chatMessages.map((msg, idx) => (
                  <div 
                    key={idx} 
                    className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div 
                      className={`max-w-[85%] p-3 rounded-2xl text-xs sm:text-sm ${
                        msg.sender === 'user'
                          ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-br-none'
                          : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-none'
                      }`}
                    >
                      {msg.text}
                    </div>
                    <span className="text-[9px] font-mono text-slate-500 mt-1 px-1">{msg.time}</span>
                  </div>
                ))}
                {isBotTyping && (
                  <div className="flex items-center gap-1.5 p-3 rounded-2xl bg-slate-900 border border-slate-800 w-20">
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce" />
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.2s]" />
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.4s]" />
                  </div>
                )}
              </div>

              {/* Quick Prompt Pills */}
              <div className="flex flex-wrap gap-2 pt-1">
                <span className="text-[11px] text-slate-400 self-center">
                  {isEs ? 'Preguntas sugeridas:' : 'Suggested prompts:'}
                </span>
                <button
                  onClick={() => handleSendChat(isEs ? "¿Cómo integran el chatbot con WhatsApp?" : "How do you integrate with WhatsApp?")}
                  className="text-[11px] px-2.5 py-1 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-700 text-cyan-300 transition"
                >
                  {isEs ? 'WhatsApp Integration' : 'WhatsApp Integration'}
                </button>
                <button
                  onClick={() => handleSendChat(isEs ? "¿Cuánto tarda un SaaS a medida?" : "How long does a custom SaaS take?")}
                  className="text-[11px] px-2.5 py-1 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-700 text-cyan-300 transition"
                >
                  {isEs ? 'Tiempos de entrega' : 'Delivery times'}
                </button>
                <button
                  onClick={() => handleSendChat(isEs ? "¿Cómo funciona el módulo de turnos médicos?" : "How does the medical appointment module work?")}
                  className="text-[11px] px-2.5 py-1 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-700 text-cyan-300 transition"
                >
                  {isEs ? 'Consultorios & Turnos' : 'Clinics & Booking'}
                </button>
              </div>

              {/* Chat Input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
                  placeholder={isEs ? "Escribí tu consulta para probar la IA..." : "Type your message to test AI..."}
                  className="flex-1 px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-cyan-500"
                />
                <button
                  onClick={() => handleSendChat()}
                  className="px-5 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs sm:text-sm flex items-center gap-1.5 transition"
                >
                  <Send className="w-4 h-4" />
                  <span className="hidden sm:inline">{isEs ? 'Enviar' : 'Send'}</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: POS PLAYGROUND */}
          {activeTab === 'pos' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                    <Store className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Averiq Smart POS — Punto de Venta Express</h4>
                    <p className="text-[11px] text-slate-400">Terminal de Cobro & Control de Inventario</p>
                  </div>
                </div>
                <span className="text-[10px] font-mono px-2 py-1 rounded bg-emerald-950/60 border border-emerald-500/40 text-emerald-400">
                  Caja #01: ACTIVA
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Catalog Quick Add */}
                <div className="space-y-3">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    {isEs ? 'Productos Frecuentes' : 'Quick Products'}
                  </div>
                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      onClick={() => addItemToCart({ name: isEs ? "Pack 3 Remeras" : "Pack 3 T-Shirts", price: 18500 })}
                      className="p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 text-left transition flex flex-col justify-between"
                    >
                      <span className="text-xs font-semibold text-white">{isEs ? 'Pack 3 Remeras' : 'Pack 3 T-Shirts'}</span>
                      <span className="text-xs font-mono font-bold text-emerald-400 mt-2">$ 18.500</span>
                    </button>
                    <button
                      onClick={() => addItemToCart({ name: isEs ? "Mochila Urbana" : "Urban Backpack", price: 34000 })}
                      className="p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 text-left transition flex flex-col justify-between"
                    >
                      <span className="text-xs font-semibold text-white">{isEs ? 'Mochila Urbana' : 'Urban Backpack'}</span>
                      <span className="text-xs font-mono font-bold text-emerald-400 mt-2">$ 34.000</span>
                    </button>
                    <button
                      onClick={() => addItemToCart({ name: isEs ? "Auriculares Wireless" : "Wireless Headphones", price: 29900 })}
                      className="p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 text-left transition flex flex-col justify-between"
                    >
                      <span className="text-xs font-semibold text-white">{isEs ? 'Auriculares BT' : 'BT Headphones'}</span>
                      <span className="text-xs font-mono font-bold text-emerald-400 mt-2">$ 29.900</span>
                    </button>
                    <button
                      onClick={() => addItemToCart({ name: isEs ? "Servicio Técnico Express" : "Express Tech Support", price: 12000 })}
                      className="p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 text-left transition flex flex-col justify-between"
                    >
                      <span className="text-xs font-semibold text-white">{isEs ? 'Servicio Express' : 'Tech Support'}</span>
                      <span className="text-xs font-mono font-bold text-emerald-400 mt-2">$ 12.000</span>
                    </button>
                  </div>
                </div>

                {/* Live Cart Ticket */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
                      <span className="text-xs font-mono text-slate-400 font-bold">Ticket de Venta #1094</span>
                      <span className="text-[10px] font-mono text-emerald-400">AFIP / Factura Digital</span>
                    </div>

                    <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                      {posCart.length === 0 ? (
                        <div className="text-center py-6 text-xs text-slate-500">
                          {isEs ? 'El carrito está vacío. Agregá productos.' : 'Cart is empty. Add products.'}
                        </div>
                      ) : (
                        posCart.map(item => (
                          <div key={item.id} className="flex items-center justify-between text-xs">
                            <span className="text-slate-300">{item.name} x{item.qty}</span>
                            <span className="font-mono text-white font-semibold">
                              $ {(item.price * item.qty).toLocaleString()}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-800 space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-bold text-slate-300">TOTAL:</span>
                      <span className="text-lg font-bold font-mono text-emerald-400">
                        $ {posTotal.toLocaleString()}
                      </span>
                    </div>

                    {posSuccess ? (
                      <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs text-center font-bold flex items-center justify-center gap-2">
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

          {/* TAB 3: CLINICS PLAYGROUND */}
          {activeTab === 'clinics' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
                    <Stethoscope className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Averiq MedTech — Turnos & Obras Sociales</h4>
                    <p className="text-[11px] text-slate-400">Gestión de Consultorios y Pacientes</p>
                  </div>
                </div>
                <span className="text-[10px] font-mono px-2 py-1 rounded bg-rose-950/60 border border-rose-500/40 text-rose-400">
                  Agenda Sincronizada
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-2">
                  <label className="text-slate-400 font-medium">{isEs ? 'Profesional Médico:' : 'Medical Professional:'}</label>
                  <select
                    value={selectedDoctor}
                    onChange={(e) => setSelectedDoctor(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-rose-500"
                  >
                    <option>Dra. Florencia Silva (Cardiología)</option>
                    <option>Dr. Mariano Castro (Traumatología)</option>
                    <option>Dra. Lucía Méndez (Dermatología)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-slate-400 font-medium">{isEs ? 'Obra Social / Cobertura:' : 'Health Insurance:'}</label>
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-emerald-400 font-mono font-bold flex items-center justify-between">
                    <span>OSDE 310 - AFILIADO ACTIVO</span>
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="text-xs font-bold text-slate-300">{isEs ? 'Horarios Disponibles para Mañana:' : 'Available Slots Tomorrow:'}</div>
                <div className="grid grid-cols-3 gap-2">
                  <button 
                    onClick={() => setBookingConfirmed(true)}
                    className="p-2.5 rounded-xl bg-slate-900 hover:bg-rose-600 hover:text-white border border-slate-800 text-center font-mono text-xs text-slate-200 transition"
                  >
                    09:30 hs
                  </button>
                  <button 
                    onClick={() => setBookingConfirmed(true)}
                    className="p-2.5 rounded-xl bg-slate-900 hover:bg-rose-600 hover:text-white border border-slate-800 text-center font-mono text-xs text-slate-200 transition"
                  >
                    11:00 hs
                  </button>
                  <button 
                    onClick={() => setBookingConfirmed(true)}
                    className="p-2.5 rounded-xl bg-slate-900 hover:bg-rose-600 hover:text-white border border-slate-800 text-center font-mono text-xs text-slate-200 transition"
                  >
                    16:15 hs
                  </button>
                </div>

                {bookingConfirmed && (
                  <div className="mt-3 p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-semibold flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-rose-400" />
                      {isEs ? 'Turno confirmado y notificación enviada por WhatsApp al paciente.' : 'Appointment booked & WhatsApp notification dispatched.'}
                    </span>
                    <button onClick={() => setBookingConfirmed(false)} className="text-[10px] underline">Reset</button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: FINANCE / AP PLAYGROUND */}
          {activeTab === 'finance' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Averiq FinOps — Cuentas a Pagar & Proveedores</h4>
                    <p className="text-[11px] text-slate-400">Extracción Inteligente OCR & Control de Pagos</p>
                  </div>
                </div>
                <button
                  onClick={triggerScan}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs transition"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
                  <span>{isEs ? 'Escanear Otra Factura' : 'Scan Next Invoice'}</span>
                </button>
              </div>

              {/* Scanned Document Data Card */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <div className="text-[10px] text-slate-500 uppercase font-mono">Proveedor</div>
                    <div className="font-bold text-white mt-1">{scannedInvoice.provider}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <div className="text-[10px] text-slate-500 uppercase font-mono">CUIT Detectado</div>
                    <div className="font-mono text-cyan-400 font-bold mt-1">{scannedInvoice.cuit}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <div className="text-[10px] text-slate-500 uppercase font-mono">N° Comprobante</div>
                    <div className="font-mono text-slate-300 font-bold mt-1">{scannedInvoice.number}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <div className="text-[10px] text-slate-500 uppercase font-mono">Monto Total</div>
                    <div className="font-mono text-emerald-400 font-bold text-sm mt-1">{scannedInvoice.amount}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <div className="text-[10px] text-slate-500 uppercase font-mono">Vencimiento</div>
                    <div className="font-mono text-amber-400 font-bold mt-1">{scannedInvoice.dueDate}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <div className="text-[10px] text-slate-500 uppercase font-mono">Estado Auditoría</div>
                    <div className="text-[11px] font-mono text-emerald-300 font-bold mt-1 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{scannedInvoice.status}</span>
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
