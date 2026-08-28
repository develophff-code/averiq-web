import React from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Globe, 
  MessageSquare, 
  ArrowUp
} from 'lucide-react';
import { InstagramIcon, FacebookIcon } from './SocialIcons';
import averiqLogo from '../assets/averiq_logo_extendido.jpg';

export const Footer: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isEs = i18n.language.startsWith('es');

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleLanguage = () => {
    i18n.changeLanguage(isEs ? 'en' : 'es');
  };

  return (
    <footer className="bg-[#05080E] border-t border-slate-800/80 pt-16 pb-12 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-slate-800/80">
          
          {/* Brand Col */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center">
              <img 
                src={averiqLogo} 
                alt="Averiq - AI Consulting & SaaS Development" 
                className="h-12 md:h-14 w-auto object-contain mix-blend-screen filter drop-shadow-[0_0_12px_rgba(0,210,255,0.2)] -ml-2"
              />
            </div>
            <p className="text-slate-400 max-w-sm leading-relaxed text-xs">
              {t('footer.tagline')}
            </p>
            
            {/* Social Links */}
            <div className="flex items-center gap-3 pt-2">
              <a 
                href="https://wa.me/5492645859829" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-emerald-400 hover:border-emerald-500/50 transition"
                title="WhatsApp Averiq"
              >
                <MessageSquare className="w-4 h-4" />
              </a>
              <a 
                href="https://www.instagram.com/averiqsj.ai" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-pink-400 hover:border-pink-500/50 transition"
                title="Instagram Averiq"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>
              <a 
                href="https://www.facebook.com/averiqsj" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-blue-400 hover:border-blue-500/50 transition"
                title="Facebook Averiq"
              >
                <FacebookIcon className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Solutions Col */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="font-semibold text-white uppercase tracking-wider text-[11px] font-mono">
              {t('footer.solutions_title')}
            </h4>
            <ul className="space-y-2">
              <li><a href="#soluciones" className="hover:text-cyan-400 transition">Chatbots de Atención 24/7</a></li>
              <li><a href="#soluciones" className="hover:text-cyan-400 transition">Chatbots de Ventas & Prospección</a></li>
              <li><a href="#soluciones" className="hover:text-cyan-400 transition">POS para Pequeños Negocios</a></li>
              <li><a href="#soluciones" className="hover:text-cyan-400 transition">Cuentas a Pagar & Proveedores</a></li>
              <li><a href="#soluciones" className="hover:text-cyan-400 transition">Consultorios: Turnos & Obras Sociales</a></li>
              <li><a href="#soluciones" className="hover:text-cyan-400 transition">Consultoría Estratégica en IA</a></li>
            </ul>
          </div>

          {/* Switcher Col */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="font-semibold text-white uppercase tracking-wider text-[11px] font-mono">
              {isEs ? 'Idioma / Language' : 'Language / Idioma'}
            </h4>
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:border-cyan-500/50 hover:text-white transition"
            >
              <Globe className="w-4 h-4 text-cyan-400" />
              <span>{isEs ? 'Cambiar a English' : 'Switch to Español'}</span>
            </button>

            <div className="pt-4">
              <button
                onClick={scrollToTop}
                className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition"
              >
                <ArrowUp className="w-3.5 h-3.5" />
                <span>{isEs ? 'Volver al inicio' : 'Back to top'}</span>
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Credits */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>© {new Date().getFullYear()} Averiq. {t('footer.rights')}</p>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-slate-400 transition">{t('footer.privacy')}</a>
            <span>•</span>
            <a href="#" className="hover:text-slate-400 transition">{t('footer.terms')}</a>
          </div>
        </div>

      </div>
    </footer>
  );
};
