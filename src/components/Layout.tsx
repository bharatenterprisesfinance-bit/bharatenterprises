import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { COMPANY_DETAILS } from '../types';
import { MessageCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const Layout: React.FC = () => {
  const location = useLocation();
  const { language } = useLanguage();
  const isMr = language === 'mr';
  const isHi = language === 'hi';
  const isApplyPage = location.pathname === '/apply';

  return (
    <div className="min-h-screen bg-[#07132e] flex flex-col selection:bg-[#1a56db] selection:text-white overflow-x-hidden w-full max-w-full">
      {/* Sticky Global Navigation */}
      <Navbar />

      {/* Main Dynamic Page Content — padded top to clear the fixed 90px header */}
      <main className="flex-1 w-full max-w-full overflow-x-hidden pt-[90px]">
        <Outlet />
      </main>

      {/* Global Footer (hidden on /apply where anti-fraud ticker serves as the bottom bar) */}
      {!isApplyPage && <Footer />}

      {/* Floating WhatsApp Button (hidden on /apply to avoid covering the continue button) */}
      {!isApplyPage && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 no-print">
          <a
            href={`https://api.whatsapp.com/send?phone=${COMPANY_DETAILS.cleanPhone}&text=Hello%20Bharat%20Enterprises,%20I%20want%20to%20inquire%20about%20a%20loan`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center w-12 h-12 sm:w-auto sm:h-auto sm:px-4 sm:py-3 bg-emerald-500 hover:bg-emerald-400 text-white rounded-full shadow-2xl shadow-emerald-900/40 transition-all hover:scale-105 group font-bold text-sm border border-emerald-400/30 animate-pulse-glow"
            title={isMr ? 'व्हॉट्सॲपवर चॅट करा' : isHi ? 'व्हाट्सएप पर चैट करें' : 'Chat on WhatsApp'}
          >
            <MessageCircle size={22} className="group-hover:rotate-12 transition-transform shrink-0" />
            <span className="hidden sm:inline font-semibold text-sm">
              {isMr ? 'व्हॉट्सॲप' : isHi ? 'व्हाट्सएप' : 'WhatsApp Us'}
            </span>
          </a>
        </div>
      )}
    </div>
  );
};
