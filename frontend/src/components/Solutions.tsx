import React from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Bot, 
  TrendingUp, 
  Store, 
  FileText, 
  Stethoscope, 
  BrainCircuit, 
  Check, 
  ArrowUpRight, 
  Sparkles,
  Calendar,
  CreditCard,
  Receipt
} from 'lucide-react';

export const Solutions: React.FC = () => {
  const { t, i18n } = useTranslation();

  const scrollToContactWithService = (serviceKey: string) => {
    const el = document.getElementById('contacto');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      const select = document.getElementById('service-select') as HTMLSelectElement;
      if (select) {
        select.value = serviceKey;
        select.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }
  };

  const isEs = i18n.language.startsWith('es');

  return (
    <section id="soluciones" className="py-24 relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-700/80 text-xs font-semibold text-cyan-400 font-mono">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t('solutions.badge')}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight font-heading">
            {t('solutions.title')}
          </h2>
          <p className="text-base sm:text-lg text-slate-400 leading-relaxed">
            {t('solutions.subtitle')}
          </p>
        </div>

        {/* Bento Grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {/* CARD 1: Chatbots de Atención 24/7 */}
          <div 
            className="group relative rounded-3xl glass-panel p-7 border border-slate-800 hover:border-cyan-500/50 transition-all duration-300 flex flex-col justify-between hover:shadow-xl hover:shadow-cyan-500/10"
          >
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 group-hover:bg-cyan-500 group-hover:text-black transition-all duration-300">
                  <Bot className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-mono font-bold tracking-wider px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-cyan-300">
                  {t('solutions.items.chatbot_support.tag')}
                </span>
              </div>

              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                {t('solutions.items.chatbot_support.title')}
              </h3>
              <p className="text-sm text-slate-400 mb-6 leading-relaxed">
                {t('solutions.items.chatbot_support.desc')}
              </p>

              {/* Live Preview Box */}
              <div className="mb-6 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/90 space-y-2 text-xs">
                <div className="flex items-start gap-2 text-slate-300">
                  <span className="text-[10px] font-mono text-slate-500">User:</span>
                  <p className="italic">"¿Qué horarios tienen para entrega hoy?"</p>
                </div>
                <div className="flex items-start gap-2 text-cyan-300 bg-cyan-950/30 p-2 rounded-lg border border-cyan-500/20">
                  <span className="text-[10px] font-mono text-cyan-400 font-bold">Averiq Bot:</span>
                  <p>"Despachamos hasta las 18:00 hs. Tu pedido #4920 ya está listo para retiro."</p>
                </div>
              </div>

              <ul className="space-y-2 mb-6 text-xs text-slate-300">
                {((t('solutions.items.chatbot_support.bullets', { returnObjects: true }) as string[]) || []).map((bullet, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button 
              onClick={() => scrollToContactWithService('chatbot_support')}
              className="w-full mt-2 py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-cyan-500 hover:text-black border border-slate-700 hover:border-cyan-400 text-xs font-bold text-slate-200 flex items-center justify-center gap-2 transition-all duration-200"
            >
              <span>{isEs ? 'Implementar Chatbot de Atención' : 'Deploy Support Chatbot'}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* CARD 2: Chatbots de Ventas & Calificación */}
          <div 
            className="group relative rounded-3xl glass-panel p-7 border border-slate-800 hover:border-blue-500/50 transition-all duration-300 flex flex-col justify-between hover:shadow-xl hover:shadow-blue-500/10"
          >
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 group-hover:scale-110 group-hover:bg-blue-500 group-hover:text-white transition-all duration-300">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-mono font-bold tracking-wider px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-blue-300">
                  {t('solutions.items.chatbot_sales.tag')}
                </span>
              </div>

              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-300 transition-colors">
                {t('solutions.items.chatbot_sales.title')}
              </h3>
              <p className="text-sm text-slate-400 mb-6 leading-relaxed">
                {t('solutions.items.chatbot_sales.desc')}
              </p>

              {/* Metric Feature */}
              <div className="mb-6 p-3.5 rounded-xl bg-blue-950/20 border border-blue-500/20 flex items-center justify-between">
                <div>
                  <div className="text-[10px] uppercase font-mono text-slate-400">Lead Conversion Boost</div>
                  <div className="text-base font-bold text-white flex items-center gap-1.5">
                    <span>+3.4x Cierres Rápidos</span>
                  </div>
                </div>
                <div className="text-xs font-mono font-bold px-2 py-1 rounded bg-blue-500/20 text-blue-300">
                  CRM Sync
                </div>
              </div>

              <ul className="space-y-2 mb-6 text-xs text-slate-300">
                {((t('solutions.items.chatbot_sales.bullets', { returnObjects: true }) as string[]) || []).map((bullet, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button 
              onClick={() => scrollToContactWithService('chatbot_sales')}
              className="w-full mt-2 py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-blue-600 hover:text-white border border-slate-700 hover:border-blue-400 text-xs font-bold text-slate-200 flex items-center justify-center gap-2 transition-all duration-200"
            >
              <span>{isEs ? 'Impulsar Ventas con IA' : 'Boost Sales with AI'}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* CARD 3: POS Inteligente para Pequeños Negocios */}
          <div 
            className="group relative rounded-3xl glass-panel p-7 border border-slate-800 hover:border-emerald-500/50 transition-all duration-300 flex flex-col justify-between hover:shadow-xl hover:shadow-emerald-500/10"
          >
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 group-hover:bg-emerald-500 group-hover:text-black transition-all duration-300">
                  <Store className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-mono font-bold tracking-wider px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-emerald-300">
                  {t('solutions.items.pos_system.tag')}
                </span>
              </div>

              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-emerald-300 transition-colors">
                {t('solutions.items.pos_system.title')}
              </h3>
              <p className="text-sm text-slate-400 mb-6 leading-relaxed">
                {t('solutions.items.pos_system.desc')}
              </p>

              {/* Visual feature */}
              <div className="mb-6 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Receipt className="w-4 h-4 text-emerald-400" />
                  <span className="text-slate-300 font-mono">Stock & Factura #1084</span>
                </div>
                <span className="font-mono text-emerald-400 font-bold">$12.450 OK</span>
              </div>

              <ul className="space-y-2 mb-6 text-xs text-slate-300">
                {((t('solutions.items.pos_system.bullets', { returnObjects: true }) as string[]) || []).map((bullet, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button 
              onClick={() => scrollToContactWithService('pos')}
              className="w-full mt-2 py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-emerald-500 hover:text-black border border-slate-700 hover:border-emerald-400 text-xs font-bold text-slate-200 flex items-center justify-center gap-2 transition-all duration-200"
            >
              <span>{isEs ? 'Ver Demo POS para tu Negocio' : 'View POS Demo for Business'}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* CARD 4: Cuentas a Pagar & Proveedores */}
          <div 
            className="group relative rounded-3xl glass-panel p-7 border border-slate-800 hover:border-amber-500/50 transition-all duration-300 flex flex-col justify-between hover:shadow-xl hover:shadow-amber-500/10"
          >
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-110 group-hover:bg-amber-500 group-hover:text-black transition-all duration-300">
                  <FileText className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-mono font-bold tracking-wider px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-amber-300">
                  {t('solutions.items.accounts_payable.tag')}
                </span>
              </div>

              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-amber-300 transition-colors">
                {t('solutions.items.accounts_payable.title')}
              </h3>
              <p className="text-sm text-slate-400 mb-6 leading-relaxed">
                {t('solutions.items.accounts_payable.desc')}
              </p>

              {/* OCR Feature */}
              <div className="mb-6 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-amber-400" />
                  <span className="text-slate-300 font-mono">OCR Extracción: Factura A</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">100% Precisión</span>
              </div>

              <ul className="space-y-2 mb-6 text-xs text-slate-300">
                {((t('solutions.items.accounts_payable.bullets', { returnObjects: true }) as string[]) || []).map((bullet, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button 
              onClick={() => scrollToContactWithService('accounts_payable')}
              className="w-full mt-2 py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-amber-500 hover:text-black border border-slate-700 hover:border-amber-400 text-xs font-bold text-slate-200 flex items-center justify-center gap-2 transition-all duration-200"
            >
              <span>{isEs ? 'Automatizar Cuentas a Pagar' : 'Automate Accounts Payable'}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* CARD 5: Consultorios Médicos, Turnos & Obras Sociales */}
          <div 
            className="group relative rounded-3xl glass-panel p-7 border border-slate-800 hover:border-rose-500/50 transition-all duration-300 flex flex-col justify-between hover:shadow-xl hover:shadow-rose-500/10"
          >
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 group-hover:scale-110 group-hover:bg-rose-500 group-hover:text-white transition-all duration-300">
                  <Stethoscope className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-mono font-bold tracking-wider px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-rose-300">
                  {t('solutions.items.clinics_health.tag')}
                </span>
              </div>

              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-rose-300 transition-colors">
                {t('solutions.items.clinics_health.title')}
              </h3>
              <p className="text-sm text-slate-400 mb-6 leading-relaxed">
                {t('solutions.items.clinics_health.desc')}
              </p>

              {/* Clinic Feature */}
              <div className="mb-6 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-rose-400" />
                  <span className="text-slate-300 font-mono">Turno #34: Dr. Gómez</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-bold">OSDE / Swiss OK</span>
              </div>

              <ul className="space-y-2 mb-6 text-xs text-slate-300">
                {((t('solutions.items.clinics_health.bullets', { returnObjects: true }) as string[]) || []).map((bullet, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button 
              onClick={() => scrollToContactWithService('clinics')}
              className="w-full mt-2 py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-rose-600 hover:text-white border border-slate-700 hover:border-rose-400 text-xs font-bold text-slate-200 flex items-center justify-center gap-2 transition-all duration-200"
            >
              <span>{isEs ? 'Digitalizar Consultorios' : 'Digitize Clinics'}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* CARD 6: Consultoría de Soluciones de AI */}
          <div 
            className="group relative rounded-3xl glass-panel p-7 border border-slate-800 hover:border-indigo-500/50 transition-all duration-300 flex flex-col justify-between hover:shadow-xl hover:shadow-indigo-500/10"
          >
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 group-hover:scale-110 group-hover:bg-indigo-500 group-hover:text-white transition-all duration-300">
                  <BrainCircuit className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-mono font-bold tracking-wider px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-indigo-300">
                  {t('solutions.items.ai_consulting.tag')}
                </span>
              </div>

              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-indigo-300 transition-colors">
                {t('solutions.items.ai_consulting.title')}
              </h3>
              <p className="text-sm text-slate-400 mb-6 leading-relaxed">
                {t('solutions.items.ai_consulting.desc')}
              </p>

              {/* Enterprise Feature */}
              <div className="mb-6 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                  <span className="text-slate-300 font-mono">LLM On-Premise / Cloud</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-bold">100% Privado</span>
              </div>

              <ul className="space-y-2 mb-6 text-xs text-slate-300">
                {((t('solutions.items.ai_consulting.bullets', { returnObjects: true }) as string[]) || []).map((bullet, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button 
              onClick={() => scrollToContactWithService('consulting')}
              className="w-full mt-2 py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-indigo-600 hover:text-white border border-slate-700 hover:border-indigo-400 text-xs font-bold text-slate-200 flex items-center justify-center gap-2 transition-all duration-200"
            >
              <span>{isEs ? 'Agendar Consultoría Estratégica' : 'Schedule AI Consulting'}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
};
