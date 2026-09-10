import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { COMPANY_DETAILS } from '../types';
import { Menu, X, Globe, ChevronRight, MessageCircle, Calculator } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { LoanCalculatorModal } from './LoanCalculatorModal';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [calcModalOpen, setCalcModalOpen] = useState(false);

  const { language, setLanguage, toggleLanguage, t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const isHeroPage = location.pathname === '/';

  const handleHowItWorksClick = (e: React.MouseEvent) => {
    if (location.pathname === '/') {
      e.preventDefault();
      const el = document.getElementById('how-it-works');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate('/#how-it-works');
    }
  };

  const navLinks = [
    { name: t('nav.home') || (language === 'mr' ? 'मुख्यपृष्ठ' : language === 'hi' ? 'मुख्य पृष्ठ' : 'Home'), path: '/', isCustom: false },
    { name: language === 'mr' ? 'कर्ज योजना' : language === 'hi' ? 'ऋण योजनाएं' : 'Loan Plans', path: '/plans', isCustom: false },
    { name: language === 'mr' ? 'कसे कार्य करते' : language === 'hi' ? 'यह कैसे काम करता है' : 'How It Works', path: '/#how-it-works', isCustom: true, onClick: handleHowItWorksClick },
    { name: language === 'mr' ? 'कॅल्क्युलेटर' : language === 'hi' ? 'कैलकुलेटर' : 'Loan Calculator', path: '#calc', isCustom: true, onClick: (e: React.MouseEvent) => { e.preventDefault(); setCalcModalOpen(true); } },
    { name: language === 'mr' ? 'आमच्याबद्दल' : language === 'hi' ? 'हमारे बारे में' : 'About Us', path: '/about', isCustom: false },
    { name: language === 'mr' ? 'संपर्क' : language === 'hi' ? 'संपर्क करें' : 'Contact', path: '/contact', isCustom: false },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 no-print ${
          scrolled
            ? 'bg-[#07132e]/95 backdrop-blur-md border-b border-slate-800/80 shadow-lg'
            : 'bg-[#07132e] border-b border-white/5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[90px]">
            {/* Brand Logo & Name */}
            <Link to="/" className="flex items-center shrink-0 group">
              <div className="relative flex items-center gap-2 sm:gap-3">
                <img
                  src="/logo.jpeg"
                  alt="Bharat Enterprises"
                  className="h-12 sm:h-14 w-auto rounded-lg object-contain shadow-sm group-hover:scale-105 transition-transform"
                />
                <div className="flex flex-col">
                  <div className="flex items-center gap-1 sm:gap-2">
                    <span className="text-base sm:text-2xl font-black tracking-tight text-white uppercase leading-none font-heading">
                      BHARAT
                    </span>
                    <span className="text-xs sm:text-base font-black tracking-widest text-blue-400 uppercase leading-none">
                      ENTERPRISES
                    </span>
                  </div>
                  <span className="text-[9px] sm:text-[11px] font-bold tracking-[0.16em] sm:tracking-[0.2em] text-slate-400 uppercase mt-0.5 sm:mt-1">
                    FINANCE SERVICES
                  </span>
                </div>
              </div>
            </Link>

            {/* Desktop Navigation Links (Center) */}
            <nav className="hidden lg:flex items-center gap-7 text-[15px] font-semibold text-slate-200">
              {navLinks.map((link) => {
                if (link.isCustom) {
                  return (
                    <a
                      key={link.name}
                      href={link.path}
                      onClick={link.onClick}
                      className="cursor-pointer transition-colors py-1 hover:text-white text-slate-300 relative group"
                    >
                      <span>{link.name}</span>
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 rounded-full transition-all duration-200 group-hover:w-full" />
                    </a>
                  );
                }

                const active = location.pathname === link.path;
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`cursor-pointer transition-colors py-1 relative group ${
                      active ? 'text-white font-bold' : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    <span>{link.name}</span>
                    <span
                      className={`absolute -bottom-1 left-0 h-0.5 bg-blue-500 rounded-full transition-all duration-200 ${
                        active ? 'w-full' : 'w-0 group-hover:w-full'
                      }`}
                    />
                  </Link>
                );
              })}
            </nav>

            {/* Right Actions: 3-Way Language Switcher + Apply Now */}
            <div className="hidden sm:flex items-center gap-3">
              {/* 3-Way Language Switcher */}
              <div className="flex items-center p-0.5 rounded-full text-xs font-bold border border-slate-700 bg-[#0d1c3e]">
                <button
                  type="button"
                  onClick={() => setLanguage('en')}
                  className={`px-3 py-1.5 rounded-full transition-all cursor-pointer ${
                    language === 'en'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  EN
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage('hi')}
                  className={`px-3 py-1.5 rounded-full font-devanagari transition-all cursor-pointer ${
                    language === 'hi'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  हिन्दी
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage('mr')}
                  className={`px-3 py-1.5 rounded-full font-devanagari transition-all cursor-pointer ${
                    language === 'mr'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  मराठी
                </button>
              </div>

              {/* Apply Now button (White pill button with dark text) */}
              <Link
                to="/apply"
                className="px-5 lg:px-6 py-2.5 rounded-full bg-white hover:bg-slate-100 text-[#07132e] text-sm font-bold shadow-md hover:shadow-lg transition-all hover:scale-[1.02] cursor-pointer"
              >
                {language === 'mr' ? 'आत्ता अर्ज करा' : language === 'hi' ? 'आवेदन करें' : 'Apply Now'}
              </Link>
            </div>

            {/* Mobile Actions & Hamburger */}
            <div className="flex lg:hidden items-center gap-1.5 sm:gap-2">
              <Link
                to="/apply"
                className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-white text-[#07132e] text-xs sm:text-sm font-bold shadow-sm hover:bg-slate-100 active:scale-95 transition-all"
              >
                {language === 'mr' ? 'अर्ज करा' : language === 'hi' ? 'आवेदन' : 'Apply'}
              </Link>

              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-slate-300 hover:text-white rounded-lg transition-colors cursor-pointer"
                aria-label="Toggle Navigation Menu"
              >
                {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-800 bg-[#081535] px-4 sm:px-5 pt-4 pb-6 space-y-2 shadow-2xl animate-fadeIn text-white max-h-[calc(100dvh-90px)] overflow-y-auto">
            {/* Language toggle row */}
            <div className="flex items-center justify-between p-3 bg-[#0e1f48] rounded-xl mb-3 border border-slate-700/60">
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-2">
                <Globe size={14} className="text-blue-400" />
                {language === 'mr' ? 'भाषा' : language === 'hi' ? 'भाषा' : 'Language'}
              </span>
              <div className="flex items-center gap-1 bg-[#09132d] p-1 rounded-lg border border-slate-700/50">
                <button
                  type="button"
                  onClick={() => setLanguage('en')}
                  className={`px-2.5 py-1 rounded-md text-xs font-bold transition-colors ${
                    language === 'en' ? 'bg-blue-600 text-white' : 'text-slate-400'
                  }`}
                >
                  English
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage('hi')}
                  className={`px-2.5 py-1 rounded-md text-xs font-bold font-devanagari transition-colors ${
                    language === 'hi' ? 'bg-blue-600 text-white' : 'text-slate-400'
                  }`}
                >
                  हिन्दी
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage('mr')}
                  className={`px-2.5 py-1 rounded-md text-xs font-bold font-devanagari transition-colors ${
                    language === 'mr' ? 'bg-blue-600 text-white' : 'text-slate-400'
                  }`}
                >
                  मराठी
                </button>
              </div>
            </div>

            {/* Links list */}
            <div className="divide-y divide-slate-800/80">
              {navLinks.map((link) => {
                if (link.isCustom) {
                  return (
                    <a
                      key={link.name}
                      href={link.path}
                      onClick={(e) => {
                        setMobileMenuOpen(false);
                        link.onClick?.(e);
                      }}
                      className="flex items-center justify-between py-3 text-sm font-semibold text-slate-200 hover:text-white"
                    >
                      <span>{link.name}</span>
                      <ChevronRight size={16} className="text-slate-500" />
                    </a>
                  );
                }

                const active = location.pathname === link.path;
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between py-3 text-sm font-semibold ${
                      active ? 'text-blue-400 font-bold' : 'text-slate-200 hover:text-white'
                    }`}
                  >
                    <span>{link.name}</span>
                    <ChevronRight size={16} className={active ? 'text-blue-400' : 'text-slate-500'} />
                  </Link>
                );
              })}
            </div>

            {/* Quick Action Rows */}
            <div className="pt-3 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setCalcModalOpen(true);
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#122452] border border-blue-500/30 text-blue-200 rounded-xl text-xs font-bold"
              >
                <Calculator size={14} />
                <span>{language === 'mr' ? 'कर्ज ईएमआय कॅल्क्युलेटर उघडा' : language === 'hi' ? 'ऋण ईएमआई कैलकुलेटर खोलें' : 'Open Loan EMI Calculator'}</span>
              </button>

              <a
                href={`https://api.whatsapp.com/send?phone=${COMPANY_DETAILS.cleanPhone}&text=Hello%20Bharat%20Enterprises,%20I%20need%20loan%20assistance`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm"
              >
                <MessageCircle size={15} />
                <span>{language === 'mr' ? 'व्हॉट्सॲप' : language === 'hi' ? 'व्हाट्सएप' : 'WhatsApp'} — {COMPANY_DETAILS.phone}</span>
              </a>
            </div>
          </div>
        )}
      </header>

      {/* Global Modals */}
      <LoanCalculatorModal isOpen={calcModalOpen} onClose={() => setCalcModalOpen(false)} />
    </>
  );
};
