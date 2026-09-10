import React from 'react';
import { Link } from 'react-router-dom';
import { COMPANY_DETAILS } from '../types';
import { Phone, MessageCircle, ArrowUp, Mail } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const Footer: React.FC = () => {
  const { language } = useLanguage();
  const isMr = language === 'mr';
  const isHi = language === 'hi';
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const navLinks = [
    { to: '/', label: isMr ? 'मुख्यपृष्ठ' : isHi ? 'मुख्य पृष्ठ' : 'Home' },
    { to: '/about', label: isMr ? 'आमच्याबद्दल' : isHi ? 'हमारे बारे में' : 'About Us' },
    { to: '/plans', label: isMr ? 'कर्ज योजना' : isHi ? 'ऋण योजनाएं' : 'Loan Plans' },
    { to: '/apply', label: isMr ? 'कर्ज अर्ज' : isHi ? 'ऋण आवेदन' : 'Loan Application' },
    { to: '/contact', label: isMr ? 'संपर्क' : isHi ? 'संपर्क' : 'Contact Us' },
  ];

  return (
    <footer className="bg-[#040e24] text-slate-400 border-t border-white/5 pt-14 pb-8 w-full no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-10 border-b border-white/[0.07]">

          {/* Brand */}
          <div className="md:col-span-5 space-y-6">
            <div className="flex items-center gap-3">
              <img src="/logo.jpeg" alt="Bharat Enterprises" className="h-11 w-auto object-contain" />
              <div>
                <p className="text-white font-bold text-sm tracking-tight uppercase">
                  {isMr ? 'भारत एंटरप्रायझेस' : isHi ? 'भारत एंटरप्राइजेज' : 'Bharat Enterprises'}
                </p>
                <p className="text-[#1a56db] text-[11px] font-semibold tracking-widest uppercase mt-0.5">
                  {isMr ? 'फायनान्स सर्व्हिसेस' : isHi ? 'फाइनेंस सर्विसेज' : 'Finance Services'}
                </p>
              </div>
            </div>

            <p className="text-sm leading-relaxed max-w-sm text-slate-400">
              {isMr
                ? 'लहान व्यवसाय, किरकोळ दुकानदार आणि विक्रेत्यांसाठी नियमित दैनिक आणि साप्ताहिक मायक्रो कर्ज सेवा.'
                : isHi
                ? 'छोटे व्यापारियों, खुदरा दुकानदारों एवं विक्रेताओं के लिए सुव्यवस्थित दैनिक एवं साप्ताहिक माइक्रो ऋण सेवाएं।'
                : 'Providing structured daily and weekly micro loans to small businesses, retail shop owners, and merchants.'}
            </p>

            <div>
              <p className="text-xs text-slate-500 mb-1">
                {isMr ? COMPANY_DETAILS.sloganMarathi : isHi ? COMPANY_DETAILS.sloganHindi : COMPANY_DETAILS.sloganEnglish}
              </p>
            </div>

            <a
              href={`https://api.whatsapp.com/send?phone=${COMPANY_DETAILS.cleanPhone}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#25d366] hover:bg-[#20ba5a] text-white text-sm font-semibold rounded-lg transition-colors"
            >
              <MessageCircle size={15} />
              <span>{isMr ? 'व्हॉट्सॲप: ' : isHi ? 'व्हाट्सएप: ' : 'WhatsApp: '}{COMPANY_DETAILS.phone}</span>
            </a>
          </div>

          {/* Navigation */}
          <div className="md:col-span-3 space-y-5">
            <h4 className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest">
              {isMr ? 'नेव्हिगेशन' : isHi ? 'नेविगेशन' : 'Navigation'}
            </h4>
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm text-slate-400 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="md:col-span-4 space-y-5">
            <h4 className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest">
              {isMr ? 'ग्राहक साहाय्यता' : isHi ? 'ग्राहक सहायता' : 'Customer Support'}
            </h4>
            <div className="space-y-4">

              <div className="flex items-start gap-3">
                <Phone size={14} className="text-slate-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-medium text-white mb-0.5">
                    {isMr ? 'हेल्पलाईन व व्हॉट्सॲप' : isHi ? 'हेल्पलाइन एवं व्हाट्सएप' : 'Helpline & WhatsApp'}
                  </p>
                  <a href={`tel:${COMPANY_DETAILS.cleanPhone}`} className="text-sm font-semibold text-white hover:text-[#38bdf8] transition-colors">
                    {COMPANY_DETAILS.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail size={14} className="text-slate-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-medium text-white mb-0.5">
                    {isMr ? 'ईमेल सपोर्ट' : isHi ? 'ईमेल सहायता' : 'Email Support'}
                  </p>
                  <a href={`mailto:${COMPANY_DETAILS.email}`} className="text-sm text-slate-400 hover:text-white transition-colors">
                    {COMPANY_DETAILS.email}
                  </a>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Bottom */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-600">
            {isMr
              ? `© ${new Date().getFullYear()} भारत एंटरप्रायझेस फायनान्स सर्व्हिसेस. सर्व हक्क राखीव.`
              : isHi
              ? `© ${new Date().getFullYear()} भारत एंटरप्राइजेज फाइनेंस सर्विसेज। सर्वाधिकार सुरक्षित।`
              : `© ${new Date().getFullYear()} Bharat Enterprises Finance Services. All rights reserved.`}
          </p>
          <button
            type="button"
            onClick={scrollToTop}
            className="flex items-center gap-2 text-xs text-slate-500 hover:text-white transition-colors cursor-pointer"
          >
            <span>{isMr ? 'शीर्षावर जा' : isHi ? 'शीर्ष पर जाएं' : 'Back to top'}</span>
            <ArrowUp size={12} />
          </button>
        </div>

      </div>
    </footer>
  );
};
