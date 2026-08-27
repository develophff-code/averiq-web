import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Menu, 
  X, 
  Globe, 
  ArrowRight, 
  Bot, 
  Sparkles, 
  Layers, 
  ChevronDown 
} from 'lucide-react';
import averiqLogo from '../assets/averiq_logo_extendido.jpg';

interface NavbarProps {
  onOpenContactModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = () => {
  const { t, i18n } = useTranslation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [solutionsDropdownOpen, setSolutionsDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleLanguage = () => {
    const nextLang = i18n.language.startsWith('es') ? 'en' : 'es';
    i18n.changeLanguage(nextLang);
  };

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    setSolutionsDropdownOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const isEs = i18n.language.startsWith('es');

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-[#080C14]/90 backdrop-blur-xl border-b border-slate-800/80 shadow-2xl shadow-black/40 py-2.5' 
          : 'bg-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Logo Extendido Averiq */}
          <a 
            href="#" 
            className="flex items-center group focus:outline-none"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            <img 
              src={averiqLogo} 
              alt="Averiq - AI Consulting & SaaS Development" 
              className="h-10 md:h-12 w-auto object-contain mix-blend-screen filter drop-shadow-[0_0_12px_rgba(0,210,255,0.25)] group-hover:drop-shadow-[0_0_20px_rgba(0,210,255,0.5)] group-hover:scale-[1.02] transition-all duration-300"
            />
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {/* Solutions with Dropdown */}
            <div className="relative" onMouseLeave={() => setSolutionsDropdownOpen(false)}>
              <button 
                onClick={() => scrollToSection('soluciones')}
                onMouseEnter={() => setSolutionsDropdownOpen(true)}
                className="text-sm font-medium text-slate-300 hover:text-cyan-400 flex items-center gap-1 transition-colors py-2"
              >
                {t('nav.solutions')}
                <ChevronDown className="w-3.5 h-3.5 opacity-70" />
              </button>

              {solutionsDropdownOpen && (
                <div 
                  className="absolute top-full left-0 w-80 p-3 rounded-2xl glass-panel-glow border border-cyan-500/20 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200"
                >
                  <div className="space-y-1">
                    <button 
                      onClick={() => scrollToSection('soluciones')}
                      className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-white/5 transition flex items-start gap-3"
                    >
                      <Bot className="w-4 h-4 text-cyan-400 mt-1 shrink-0" />
                      <div>
                        <div className="text-xs font-semibold text-white">
                          {isEs ? 'Chatbots & Agentes IA' : 'AI Chatbots & Agents'}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {isEs ? 'Atención 24/7 y Ventas automatizadas' : '24/7 Support & Sales Automation'}
                        </div>
                      </div>
                    </button>

                    <button 
                      onClick={() => scrollToSection('soluciones')}
                      className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-white/5 transition flex items-start gap-3"
                    >
                      <Layers className="w-4 h-4 text-indigo-400 mt-1 shrink-0" />
                      <div>
                        <div className="text-xs font-semibold text-white">
                          {isEs ? 'SaaS por Rubro' : 'Niche SaaS Platforms'}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {isEs ? 'POS, Cuentas a Pagar y Consultorios' : 'POS, Accounts Payable & Health Clinics'}
                        </div>
                      </div>
                    </button>

                    <button 
                      onClick={() => scrollToSection('soluciones')}
                      className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-white/5 transition flex items-start gap-3"
                    >
                      <Sparkles className="w-4 h-4 text-emerald-400 mt-1 shrink-0" />
                      <div>
                        <div className="text-xs font-semibold text-white">
                          {isEs ? 'Consultoría Corporativa de IA' : 'Enterprise AI Consulting'}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {isEs ? 'Modelos privados y optimización' : 'Private models & workflow optimization'}
                        </div>
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button 
              onClick={() => scrollToSection('simulador')}
              className="text-sm font-medium text-slate-300 hover:text-cyan-400 transition-colors"
            >
              {t('nav.interactive')}
            </button>

            <button 
              onClick={() => scrollToSection('metodologia')}
              className="text-sm font-medium text-slate-300 hover:text-cyan-400 transition-colors"
            >
              {t('nav.methodology')}
            </button>

            <button 
              onClick={() => scrollToSection('contacto')}
              className="text-sm font-medium text-slate-300 hover:text-cyan-400 transition-colors"
            >
              {t('nav.contact')}
            </button>
          </nav>

          {/* Right Actions: Language Switcher + CTA Button */}
          <div className="hidden md:flex items-center gap-4">
            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-700/80 text-xs font-semibold text-slate-300 hover:text-white hover:border-cyan-500/50 hover:bg-slate-800 transition-all duration-200"
              title={isEs ? "Cambiar a Inglés" : "Switch to Spanish"}
            >
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              <span className={isEs ? "text-cyan-400 font-bold" : "opacity-60"}>ES</span>
              <span className="opacity-40 text-[10px]">/</span>
              <span className={!isEs ? "text-cyan-400 font-bold" : "opacity-60"}>EN</span>
            </button>

            {/* Primary CTA */}
            <button
              onClick={() => scrollToSection('contacto')}
              className="relative group overflow-hidden px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-500 to-indigo-600 p-[1px] font-semibold text-xs text-white shadow-lg shadow-blue-500/20 hover:shadow-cyan-500/30 transition-all duration-300 active:scale-95"
            >
              <span className="relative flex items-center gap-2 px-4 py-2 rounded-[11px] bg-[#090D16] group-hover:bg-opacity-80 transition-all">
                <span>{t('nav.cta')}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-xs font-bold text-slate-300"
            >
              <span>{isEs ? 'ES' : 'EN'}</span>
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 pt-3 pb-6 bg-[#090D16]/95 border-b border-slate-800 backdrop-blur-2xl space-y-3 animate-in fade-in duration-200">
          <div className="flex flex-col space-y-2 pt-2">
            <button 
              onClick={() => scrollToSection('soluciones')}
              className="text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-200 hover:bg-slate-800/80"
            >
              {t('nav.solutions')}
            </button>
            <button 
              onClick={() => scrollToSection('simulador')}
              className="text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-200 hover:bg-slate-800/80"
            >
              {t('nav.interactive')}
            </button>
            <button 
              onClick={() => scrollToSection('metodologia')}
              className="text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-200 hover:bg-slate-800/80"
            >
              {t('nav.methodology')}
            </button>
            <button 
              onClick={() => scrollToSection('contacto')}
              className="text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-200 hover:bg-slate-800/80"
            >
              {t('nav.contact')}
            </button>
          </div>

          <div className="pt-3 border-t border-slate-800/80 flex flex-col gap-3">
            <button
              onClick={() => scrollToSection('contacto')}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 font-semibold text-sm text-white"
            >
              <span>{t('nav.cta')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
