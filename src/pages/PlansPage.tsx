import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LoanPlans } from '../components/LoanPlans';
import { LoanPlan } from '../types';
import { MessageCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { COMPANY_DETAILS } from '../types';

export const PlansPage: React.FC = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const isMr = language === 'mr';
  const isHi = language === 'hi';

  const handleSelectPlan = (plan: LoanPlan, type: 'Daily' | 'Weekly') => {
    navigate(`/apply?amount=${plan.loanAmount}&plan=${type}`);
  };

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
              {isMr ? 'कर्ज योजना' : isHi ? 'ऋण योजनाएं' : 'Loan Plans'}
            </span>
          </nav>
          <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            {isMr
              ? 'कर्ज योजना व ईएमआय कॅल्क्युलेटर'
              : isHi
              ? 'ऋण योजनाएं एवं ईएमआई कैलकुलेटर'
              : 'Loan Plans & EMI Calculator'}
          </h1>
          <p className="text-slate-400 mt-2 text-sm max-w-xl">
            {isMr
              ? '१४ प्रमाणित श्रेणी — ₹९,००० ते ₹४,५०,००० — केवळ १% फ्लॅट प्रोसेसिंग फी.'
              : isHi
              ? '१४ मानक श्रेणियां — ₹९,००० से ₹४,५०,००० — केवल १% फ्लैट प्रोसेसिंग शुल्क।'
              : '14 standard tiers from ₹ 9,000 to ₹ 4,50,000 — flat 1% processing fee only.'}
          </p>
        </div>
      </div>

      {/* Main Loan Plans Component */}
      <div className="w-full">
        <LoanPlans onSelectPlan={handleSelectPlan} />
      </div>

      {/* WhatsApp Help Assistance */}
      <section className="py-8 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto p-5 border border-slate-200 rounded-xl bg-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs">
            <div>
              <p className="text-sm font-semibold text-slate-900 mb-0.5">
                {isMr ? 'योजना निवडण्यात मदत हवी आहे?' : isHi ? 'योजना चुनने में सहायता चाहिए?' : 'Need help choosing a plan?'}
              </p>
              <p className="text-xs sm:text-sm text-slate-500">
                {isMr
                  ? 'आमच्या प्रतिनिधींशी थेट व्हॉट्सॲपवर बोला.'
                  : isHi
                  ? 'हमारे ऋण अधिकारी से सीधे व्हाट्सएप पर चर्चा करें।'
                  : 'Talk to our loan officer directly on WhatsApp.'}
              </p>
            </div>
            <a
              href={`https://api.whatsapp.com/send?phone=${COMPANY_DETAILS.cleanPhone}&text=Hello%20Bharat%20Enterprises,%20I%20need%20help%20choosing%20a%20loan%20plan`}
              target="_blank"
              rel="noreferrer"
              className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 bg-[#25d366] hover:bg-[#20ba5a] text-white text-xs sm:text-sm font-semibold rounded-lg transition-colors cursor-pointer"
            >
              <MessageCircle size={15} />
              <span>{isMr ? 'व्हॉट्सॲप' : isHi ? 'व्हाट्सएप' : 'WhatsApp Us'}</span>
            </a>
          </div>
        </div>
      </section>

    </div>
  );
};
