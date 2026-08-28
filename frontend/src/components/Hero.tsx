import React from 'react';
import { useTranslation } from 'react-i18next';
import { 
  ArrowRight, 
  MessageSquare, 
  Sparkles, 
  CheckCircle2, 
  Activity, 
  Layers, 
  Zap,
  ShieldCheck,
  Clock
} from 'lucide-react';
import { InstagramIcon, FacebookIcon } from './SocialIcons';

export const Hero: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isEs = i18n.language.startsWith('es');

  const scrollToContact = () => {
    const el = document.getElementById('contacto');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const whatsappUrl = "https://wa.me/5491100000000?text=" + encodeURIComponent(
    isEs 
      ? "Hola Averiq! Me interesa conocer más sobre sus soluciones de software e Inteligencia Artificial." 
      : "Hello Averiq! I would like to learn more about your software and AI solutions."
  );

  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
      {/* Background Gradients & Tech Grid */}
      <div className="absolute inset-0 grid-bg-subtle opacity-60 pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-3xl pointer-events-none radial-glow" />
      <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Core Copy & CTAs */}
          <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
            
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-slate-900/90 border border-cyan-500/30 text-xs font-semibold text-cyan-300 shadow-inner shadow-cyan-500/10">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400"></span>
              </span>
              <span>{t('hero.badge')}</span>
            </div>

            {/* Main Headline - Sharp, crisp and perfectly proportioned */}
            <div className="space-y-3">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.12]">
                <span>{t('hero.title_main')} </span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-400 to-blue-500 font-extrabold">
                  {t('hero.title_highlight')}
                </span>
              </h1>
              <p className="text-xl sm:text-2xl font-medium text-slate-300 tracking-tight">
                {t('hero.title_sub')}
              </p>
            </div>

            {/* Detailed Description */}
            <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              {t('hero.description')}
            </p>

            {/* CTAs Button Group */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              {/* Primary Contact CTA */}
              <button
                onClick={scrollToContact}
                className="w-full sm:w-auto px-7 py-4 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 text-white font-bold text-sm shadow-xl shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-3 group"
              >
                <Sparkles className="w-4 h-4 text-cyan-200" />
                <span>{t('hero.cta_primary')}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              {/* Direct WhatsApp CTA */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-6 py-4 rounded-xl bg-slate-900/90 hover:bg-slate-800/90 border border-emerald-500/40 hover:border-emerald-400 text-emerald-300 hover:text-emerald-200 font-semibold text-sm shadow-lg shadow-emerald-500/10 transition-all duration-300 flex items-center justify-center gap-2.5"
              >
                <MessageSquare className="w-4 h-4 text-emerald-400" />
                <span>{t('hero.cta_whatsapp')}</span>
              </a>
            </div>

            {/* Social Media Channels Bar */}
            <div className="pt-4 border-t border-slate-800/80">
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  {t('hero.social_label')}
                </span>
                
                <div className="flex items-center gap-3">
                  {/* WhatsApp */}
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700/80 hover:border-emerald-500/60 hover:bg-emerald-950/30 text-slate-300 hover:text-emerald-400 text-xs font-medium transition-all group"
                    title="WhatsApp Averiq"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-400 group-hover:scale-110 transition-transform" />
                    <span>WhatsApp</span>
                  </a>

                  {/* Instagram */}
                  <a
                    href="https://www.instagram.com/averiqsj.ai"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700/80 hover:border-pink-500/60 hover:bg-pink-950/30 text-slate-300 hover:text-pink-400 text-xs font-medium transition-all group"
                    title="Instagram Averiq"
                  >
                    <InstagramIcon className="w-3.5 h-3.5 text-pink-400 group-hover:scale-110 transition-transform" />
                    <span>Instagram</span>
                  </a>

                  {/* Facebook */}
                  <a
                    href="https://www.facebook.com/averiqsj"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700/80 hover:border-blue-500/60 hover:bg-blue-950/30 text-slate-300 hover:text-blue-400 text-xs font-medium transition-all group"
                    title="Facebook Averiq"
                  >
                    <FacebookIcon className="w-3.5 h-3.5 text-blue-400 group-hover:scale-110 transition-transform" />
                    <span>Facebook</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-4 pt-4 max-w-xl mx-auto lg:mx-0">
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 text-center lg:text-left">
                <div className="text-xl sm:text-2xl font-bold text-cyan-400 font-mono">+70%</div>
                <div className="text-[11px] text-slate-400 font-medium">
                  {isEs ? 'Eficiencia Operativa' : 'Operational Efficiency'}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 text-center lg:text-left">
                <div className="text-xl sm:text-2xl font-bold text-indigo-400 font-mono">24/7</div>
                <div className="text-[11px] text-slate-400 font-medium">
                  {isEs ? 'Atención & Automatización' : 'Support & Automation'}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 text-center lg:text-left">
                <div className="text-xl sm:text-2xl font-bold text-emerald-400 font-mono">100%</div>
                <div className="text-[11px] text-slate-400 font-medium">
                  {isEs ? 'Flujos a tu Medida' : 'Tailored Workflows'}
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Active Solutions Ecosystem Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Outer Glow frame */}
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 rounded-3xl blur-xl opacity-75 animate-pulse" />

              {/* Main Ecosystem Hub Card */}
              <div className="relative rounded-2xl glass-panel-glow p-5 sm:p-6 border border-slate-700/80 shadow-2xl space-y-4">
                
                {/* Header: Business Value & Operational Status */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                      {isEs ? 'Ecosistema de Soluciones' : 'Solutions Ecosystem'}
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      {isEs ? 'Plataformas activas e integradas' : 'Active and integrated platforms'}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[11px] font-medium text-emerald-400">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>{isEs ? 'En Operación' : 'Active'}</span>
                  </div>
                </div>

                {/* Active Modules Nodes */}
                <div className="space-y-2.5">
                  
                  {/* Module 1: Chatbot IA */}
                  <div className="p-3 rounded-xl bg-slate-900/80 border border-cyan-500/30 flex items-center justify-between group hover:border-cyan-400 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
                        <MessageSquare className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white flex items-center gap-1.5">
                          {isEs ? 'Chatbots de Atención & Ventas' : 'Support & Sales Chatbots'}
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono">WhatsApp/Web</span>
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {isEs ? 'Turnos, FAQs y Calificación 24/7' : 'Appointments, FAQs & Lead Scoring'}
                        </div>
                      </div>
                    </div>
                    <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                  </div>

                  {/* Module 2: POS & Inventario */}
                  <div className="p-3 rounded-xl bg-slate-900/80 border border-indigo-500/30 flex items-center justify-between group hover:border-indigo-400 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                        <Zap className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white flex items-center gap-1.5">
                          {isEs ? 'POS para Pequeños Negocios' : 'Small Business POS'}
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono">Real-Time</span>
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {isEs ? 'Facturación ágil y control de stock' : 'Fast checkout & stock control'}
                        </div>
                      </div>
                    </div>
                    <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                  </div>

                  {/* Module 3: Cuentas a Pagar */}
                  <div className="p-3 rounded-xl bg-slate-900/80 border border-emerald-500/30 flex items-center justify-between group hover:border-emerald-400 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                        <Layers className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white flex items-center gap-1.5">
                          {isEs ? 'Cuentas a Pagar & Proveedores' : 'Accounts Payable & Vendors'}
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">OCR AI</span>
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {isEs ? 'Lectura automática y vencimientos' : 'Automatic parsing & due dates'}
                        </div>
                      </div>
                    </div>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  </div>

                  {/* Module 4: Consultorios Médicos */}
                  <div className="p-3 rounded-xl bg-slate-900/80 border border-pink-500/30 flex items-center justify-between group hover:border-pink-400 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-pink-500/10 text-pink-400">
                        <Activity className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white flex items-center gap-1.5">
                          {isEs ? 'Consultorios & Salud' : 'Clinics & Healthcare'}
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-pink-500/20 text-pink-300 font-mono">Turnos + OS</span>
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {isEs ? 'Validación de cobertura y agenda' : 'Insurance validation & booking'}
                        </div>
                      </div>
                    </div>
                    <CheckCircle2 className="w-4 h-4 text-pink-400" />
                  </div>

                </div>

                {/* Card Bottom: Business Value Metrics */}
                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{isEs ? 'Soluciones 100% a medida' : '100% Tailored solutions'}</span>
                  </div>
                  <div className="flex items-center gap-1 text-cyan-400">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{isEs ? 'Despliegue rápido' : 'Fast delivery'}</span>
                  </div>
                </div>

              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
