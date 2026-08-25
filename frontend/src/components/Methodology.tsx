import React from 'react';
import { useTranslation } from 'react-i18next';
import { Sparkles, CheckCircle2 } from 'lucide-react';

export const Methodology: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isEs = i18n.language.startsWith('es');

  const steps = [
    {
      number: "01",
      title: isEs ? "Diagnóstico Operativo & Arquitectura" : "Operational Diagnosis & Architecture",
      desc: isEs 
        ? "Mapeamos tus procesos, identificamos cuellos de botella reales y definimos la pila tecnológica óptima sin sobrecostos ni humo."
        : "We map your workflows, isolate true operational bottlenecks, and architect the optimal tech stack without bloat.",
      badge: "Discovery"
    },
    {
      number: "02",
      title: isEs ? "Diseño de Experiencia & Prototipado" : "UX Engineering & Fast Prototyping",
      desc: isEs 
        ? "Construimos interfaces limpias, intuitivas y validamos un prototipo funcional en días para asegurar adopción total por tu equipo."
        : "We engineer clean, intuitive user interfaces and test functional prototypes rapidly to ensure high team adoption.",
      badge: "Prototype"
    },
    {
      number: "03",
      title: isEs ? "Desarrollo Robusto & Conexión con IA" : "Robust Development & AI Pipeline",
      desc: isEs 
        ? "Programamos en TypeScript y PostgreSQL, desplegamos agentes de IA y conectamos con WhatsApp, AFIP, CRM o tus sistemas actuales."
        : "We build with TypeScript & PostgreSQL, deploy fine-tuned AI agents, and integrate with WhatsApp, CRM and internal systems.",
      badge: "Engineering"
    },
    {
      number: "04",
      title: isEs ? "Puesta en Producción & Soporte Continuo" : "Production Launch & Dedicated Support",
      desc: isEs 
        ? "Monitoreamos la precisión de los modelos, garantizamos 99.9% de disponibilidad y evolucionamos las herramientas con tu negocio."
        : "We track model precision, guarantee 99.9% uptime, and continuously scale features alongside your business growth.",
      badge: "Scale & Care"
    }
  ];

  return (
    <section id="metodologia" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-700/80 text-xs font-semibold text-indigo-400 font-mono">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t('methodology.badge')}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight font-heading">
            {t('methodology.title')}
          </h2>
          <p className="text-base sm:text-lg text-slate-400 leading-relaxed">
            {t('methodology.subtitle')}
          </p>
        </div>

        {/* 4 Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, idx) => (
            <div 
              key={idx}
              className="relative rounded-3xl glass-panel p-6 border border-slate-800 hover:border-indigo-500/40 transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="font-mono text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-500">
                    {step.number}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-slate-400">
                    {step.badge}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white mb-3 group-hover:text-indigo-300 transition-colors">
                  {step.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {step.desc}
                </p>
              </div>

              <div className="pt-6 mt-4 border-t border-slate-800/80 flex items-center gap-2 text-[11px] text-cyan-400 font-mono">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{isEs ? 'Entregable verificado' : 'Verified milestone'}</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
