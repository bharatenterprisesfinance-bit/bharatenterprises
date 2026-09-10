import React from 'react';
import { COMPANY_DETAILS } from '../types';
import { 
  Building2, 
  ShieldCheck, 
  Users, 
  TrendingUp, 
  Phone, 
  FileText
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const AboutSection: React.FC = () => {
  const { language, t } = useLanguage();
  const isMr = language === 'mr';
  const isHi = language === 'hi';

  return (
    <section id="about" className="py-10 sm:py-14 bg-white border-b border-slate-200 relative w-full max-w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 w-full">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-10 items-stretch w-full">
          
          {/* Left Column: Story & Trust Badges */}
          <div className="lg:col-span-7 space-y-6 flex flex-col justify-between">
            
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-slate-100 border border-slate-200 text-slate-700 font-bold text-[11px] uppercase tracking-wider">
                <Building2 size={13} className="text-blue-900" />
                {t('about.badge')}
              </div>

              <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                {t('about.title1')} <br className="hidden sm:inline" />
                <span className="text-blue-900">{t('about.title2')}</span>
              </h2>

              <p className="text-sm text-slate-600 leading-relaxed">
                {t('about.desc1')}
              </p>

              <p className="text-sm text-slate-700 font-devanagari leading-relaxed bg-slate-50 p-3.5 rounded border border-slate-200">
                {t('about.desc2')}
              </p>
            </div>

            {/* 4 Pillars Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
              <div className="p-4 bg-slate-50 rounded border border-slate-200 space-y-1">
                <div className="flex items-center gap-2 text-blue-900 font-bold text-xs uppercase tracking-wide">
                  <ShieldCheck size={16} />
                  <span>{t('about.pillar1')}</span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">{t('about.pillar1Desc')}</p>
              </div>

              <div className="p-4 bg-slate-50 rounded border border-slate-200 space-y-1">
                <div className="flex items-center gap-2 text-blue-900 font-bold text-xs uppercase tracking-wide">
                  <TrendingUp size={16} />
                  <span>{t('about.pillar2')}</span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">{t('about.pillar2Desc')}</p>
              </div>

              <div className="p-4 bg-slate-50 rounded border border-slate-200 space-y-1">
                <div className="flex items-center gap-2 text-blue-900 font-bold text-xs uppercase tracking-wide">
                  <Users size={16} />
                  <span>{t('about.pillar3')}</span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">{t('about.pillar3Desc')}</p>
              </div>

              <div className="p-4 bg-slate-50 rounded border border-slate-200 space-y-1">
                <div className="flex items-center gap-2 text-blue-900 font-bold text-xs uppercase tracking-wide">
                  <FileText size={16} />
                  <span>{t('about.pillar4')}</span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">{t('about.pillar4Desc')}</p>
              </div>
            </div>

            {/* Direct Assistance snippet */}
            <div className="p-4 bg-slate-100 rounded border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-900 text-white rounded flex items-center justify-center flex-shrink-0">
                  <Phone size={16} />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    {isMr ? 'ग्राहक सेवा' : isHi ? 'ग्राहक सेवा' : 'Customer Support'}
                  </span>
                  <span className="text-xs font-bold text-slate-800">{COMPANY_DETAILS.phone}</span>
                </div>
              </div>

              <a
                href={`tel:${COMPANY_DETAILS.cleanPhone}`}
                className="px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold rounded flex items-center gap-1.5 shadow-sm transition-all uppercase tracking-wider whitespace-nowrap"
              >
                <Phone size={13} />
                <span>{isMr ? 'कॉल करा: ' : isHi ? 'कॉल करें: ' : 'Call '}{COMPANY_DETAILS.phone}</span>
              </a>
            </div>

          </div>

          {/* Right Column: Signature Blue Mission & Credentials Card */}
          <div className="lg:col-span-5 bg-[#0b254a] text-white p-7 sm:p-8 rounded-xl flex flex-col justify-between shadow-md border border-blue-900">
            
            <div className="space-y-5">
              <div className="border-b border-blue-800 pb-3">
                <span className="text-[10px] font-bold uppercase tracking-widest text-blue-300 block mb-1">
                  {isMr ? 'आमचे ध्येय व मानके' : isHi ? 'हमारा उद्देश्य एवं मानक' : 'Our Mission & Standards'}
                </span>
                <h3 className="text-xl sm:text-2xl font-bold leading-snug text-white">
                  {isMr
                    ? '"तुमचा विश्वास, आमची साथ — व्यवसाय वाढवण्यासाठी आर्थिक पाठबळ."'
                    : isHi
                    ? '"आपका विश्वास, हमारा साथ — व्यापार वृद्धि हेतु वित्तीय संबल."'
                    : '"Your Trust, Our Support — Financial Backing to Grow Your Business."'}
                </h3>
              </div>

              <p className="text-xs sm:text-sm text-blue-100 leading-relaxed opacity-90">
                {isMr
                  ? 'आम्ही मानतो की आर्थिक पाठबळ वेळेवर, पारदर्शक आणि सुलभ असले पाहिजे. भारत एंटरप्रायझेससोबत जोडल्याने तुम्हाला थेट मदत आणि सुलभ दैनिक कर्ज सुविधा मिळते.'
                  : isHi
                  ? 'हमारा मानना है कि वित्तीय सहायता समय पर, पारदर्शी और सुलभ होनी चाहिए। भारत एंटरप्राइजेज से जुड़ने पर आपको सीधी सहायता और सुगम ऋण सुविधा मिलती है।'
                  : 'We believe that financial support should be structured, accessible, and completely transparent. Partnering with Bharat Enterprises ensures direct guidance and streamlined financing.'}
              </p>

              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold uppercase tracking-widest text-blue-300">
                  {isMr ? 'प्रमुख कार्यप्रणाली मानके' : isHi ? 'प्रमुख परिचालन मानक' : 'Key Operational Standards'}
                </h4>
                <ul className="space-y-2.5 text-xs text-blue-100">
                  <li className="flex items-start">
                    <span className="w-1.5 h-1.5 bg-amber-400 rounded-full mr-2.5 mt-1.5 flex-shrink-0"></span>
                    <span>
                      {isMr ? (
                        <><strong>समर्पित सेवा:</strong> किरकोळ व्यापारी आणि विक्रेत्यांना नियोजित मायक्रो-क्रेडिट सेवा.</>
                      ) : isHi ? (
                        <><strong>समर्पित सेवा:</strong> खुदरा व्यापारियों और विक्रेताओं के लिए सुव्यवस्थित माइक्रो-क्रेडिट सेवा।</>
                      ) : (
                        <><strong>Dedicated Service:</strong> Serving retail merchants and vendors with structured micro-credit.</>
                      )}
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-1.5 h-1.5 bg-amber-400 rounded-full mr-2.5 mt-1.5 flex-shrink-0"></span>
                    <span>
                      {isMr ? (
                        <><strong>पारदर्शक प्रक्रिया:</strong> फक्त १% प्रोसेसिंग फी आणि कोणतेही लपलेले शुल्क नाही.</>
                      ) : isHi ? (
                        <><strong>पारदर्शी प्रक्रिया:</strong> केवल १% प्रोसेसिंग शुल्क और कोई छुपा हुआ प्रभार नहीं।</>
                      ) : (
                        <><strong>Transparent Process:</strong> Flat 1% processing fee with zero hidden surcharges.</>
                      )}
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-1.5 h-1.5 bg-amber-400 rounded-full mr-2.5 mt-1.5 flex-shrink-0"></span>
                    <span>
                      {isMr ? (
                        <><strong>सुलभ पडताळणी:</strong> सुलभ कागदपत्रे आणि ग्राहकांना अनुकूल मार्गदर्शन.</>
                      ) : isHi ? (
                        <><strong>सुगम सत्यापन:</strong> सरल दस्तावेज और ग्राहक हितैषी मार्गदर्शन।</>
                      ) : (
                        <><strong>Convenient Review:</strong> Streamlined documentation and friendly customer guidance.</>
                      )}
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-1.5 h-1.5 bg-amber-400 rounded-full mr-2.5 mt-1.5 flex-shrink-0"></span>
                    <span>
                      {isMr ? (
                        <><strong>लवचिक संकलन:</strong> थेट संकलन किंवा डिजिटल यूपीआय / फोनपे ट्रान्सफर.</>
                      ) : isHi ? (
                        <><strong>लचीला संग्रह:</strong> सीधा संग्रह अथवा डिजिटल यूपीआई / फोनपे ट्रांसफर।</>
                      ) : (
                        <><strong>Flexible Collection:</strong> Direct collection or digital UPI / PhonePe transfers.</>
                      )}
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="border-t border-blue-800 pt-5 mt-6 flex items-center justify-between text-xs text-blue-200">
              <div className="flex items-center gap-2">
                <ShieldCheck size={15} className="text-blue-300" />
                <span>{isMr ? 'सोपी आणि पारदर्शक प्रक्रिया' : isHi ? 'सरल एवं पारदर्शी प्रक्रिया' : 'Simple & Transparent Process'}</span>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300">
                {isMr ? '१४ कर्ज योजना' : isHi ? '१४ ऋण योजनाएं' : '14 Loan Tiers'}
              </span>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
