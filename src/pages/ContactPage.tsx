import React from 'react';
import { Link } from 'react-router-dom';
import { ContactSection } from '../components/ContactSection';
import { COMPANY_DETAILS } from '../types';
import { Phone, MessageCircle, Mail } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const ContactPage: React.FC = () => {
  const { language } = useLanguage();
  const isMr = language === 'mr';
  const isHi = language === 'hi';

  return (
    <div className="w-full bg-white min-h-screen">

      {/* Page Header */}
      <div className="bg-[#0b1f4a] text-white py-12 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-xs text-slate-400 mb-5">
            <Link to="/" className="hover:text-white transition-colors">
              {isMr ? 'मुख्यपृष्ठ' : isHi ? 'मुख्य पृष्ठ' : 'Home'}
            </Link>
            <span>/</span>
            <span className="text-white">
              {isMr ? 'संपर्क' : isHi ? 'संपर्क' : 'Contact Us'}
            </span>
          </nav>
          <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            {isMr ? 'संपर्क साधा' : isHi ? 'ग्राहक सहायता एवं संपर्क' : 'Customer Support'}
          </h1>
          <p className="text-slate-400 mt-2 text-sm max-w-lg">
            {isMr
              ? 'कर्जाबद्दल प्रश्न असल्यास आमच्याशी थेट फोन किंवा व्हॉट्सॲपवर संपर्क करा.'
              : isHi
              ? 'ऋण अथवा पुनर्भुगतान संबंधी किसी भी जानकारी के लिए सीधे फोन, व्हाट्सएप अथवा ईमेल द्वारा संपर्क करें।'
              : 'Have questions about a loan or repayment? Connect with our support team directly via phone, WhatsApp, or email.'}
          </p>
          <div className="flex flex-wrap items-center gap-4 mt-5 text-sm text-slate-300">
            <a href={`tel:${COMPANY_DETAILS.cleanPhone}`} className="hover:text-white transition-colors font-medium">
              {COMPANY_DETAILS.phone}
            </a>
            <span className="text-slate-600">·</span>
            <a href={`mailto:${COMPANY_DETAILS.email}`} className="hover:text-white transition-colors">
              {COMPANY_DETAILS.email}
            </a>
          </div>
        </div>
      </div>

      {/* Contact Form Section */}
      <div className="w-full">
        <ContactSection />
      </div>

      {/* Direct Channels Information */}
      <section className="py-12 sm:py-14 bg-slate-50 border-t border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-10">
            <p className="text-xs font-semibold text-[#1a56db] uppercase tracking-widest mb-2">
              {isMr ? 'थेट संपर्क' : isHi ? 'सीधा संपर्क' : 'Direct Channels'}
            </p>
            <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
              {isMr ? 'ग्राहक साहाय्यता पर्याय' : isHi ? 'ग्राहक सहायता विकल्प' : 'Connect with Our Team'}
            </h3>
            <p className="text-sm text-slate-500 mt-1">
              {isMr
                ? 'आम्ही आपल्या सर्व प्रश्नांचे निरसन करण्यासाठी सदैव तत्पर आहोत.'
                : isHi
                ? 'हम आपकी सहायता और प्रश्नों के समाधान हेतु सदैव तत्पर हैं।'
                : 'Reach out through any of our support channels.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Phone */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                <Phone size={22} />
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-1">
                {isMr ? 'दूरध्वनी हेल्पलाईन' : isHi ? 'फोन हेल्पलाइन' : 'Phone Helpline'}
              </h4>
              <p className="text-xs text-slate-500 mb-4">
                {isMr ? 'थेट फोनवर बोला' : isHi ? 'सीधी वॉयस सहायता' : 'Direct voice assistance'}
              </p>
              <a
                href={`tel:${COMPANY_DETAILS.cleanPhone}`}
                className="text-sm font-bold text-blue-600 hover:underline"
              >
                {COMPANY_DETAILS.phone}
              </a>
            </div>

            {/* WhatsApp */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                <MessageCircle size={22} />
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-1">
                {isMr ? 'व्हॉट्सॲप डेस्क' : isHi ? 'व्हाट्सएप डेस्क' : 'WhatsApp Desk'}
              </h4>
              <p className="text-xs text-slate-500 mb-4">
                {isMr ? 'कागदपत्रे व चौकशी पाठवा' : isHi ? 'दस्तावेज एवं पूछताछ भेजें' : 'Chat & send documents'}
              </p>
              <a
                href={`https://api.whatsapp.com/send?phone=${COMPANY_DETAILS.cleanPhone}`}
                target="_blank"
                rel="noreferrer"
                className="text-sm font-bold text-emerald-600 hover:underline"
              >
                {isMr ? 'व्हॉट्सॲप चॅट' : isHi ? 'व्हाट्सएप चैट' : 'WhatsApp Chat'}
              </a>
            </div>

            {/* Email */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
                <Mail size={22} />
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-1">
                {isMr ? 'ईमेल सपोर्ट' : isHi ? 'ईमेल सहायता' : 'Email Support'}
              </h4>
              <p className="text-xs text-slate-500 mb-4">
                {isMr ? 'थेट पत्रव्यवहार' : isHi ? 'सीधा पत्राचार' : 'Email support'}
              </p>
              <a
                href={`mailto:${COMPANY_DETAILS.email}`}
                className="text-sm font-bold text-indigo-600 hover:underline break-all"
              >
                {COMPANY_DETAILS.email}
              </a>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
