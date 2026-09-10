import React from 'react';
import { Link } from 'react-router-dom';
import { COMPANY_DETAILS } from '../types';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const AboutPage: React.FC = () => {
  const { language } = useLanguage();
  const isMr = language === 'mr';
  const isHi = language === 'hi';

  const values = [
    {
      title: isMr ? 'पारदर्शकता' : isHi ? 'पारदर्शिता' : 'Transparency',
      desc: isMr
        ? 'कोणतेही छुपे शुल्क नाही. केवळ १% फ्लॅट प्रोसेसिंग फी — तुम्हाला सुरुवातीपासूनच सर्व माहिती दिली जाते.'
        : isHi
        ? 'कोई छिपा हुआ शुल्क नहीं। केवल १% फ्लैट प्रोसेसिंग शुल्क — हस्ताक्षर करने से पूर्व सभी विवरण पारदर्शी रूप से बताए जाते हैं।'
        : 'No hidden charges. Just 1% flat processing fee — everything disclosed upfront before you sign.',
    },
    {
      title: isMr ? 'सुलभ सेवा' : isHi ? 'सुगम सेवा' : 'Streamlined Service',
      desc: isMr
        ? 'सुलभ पडताळणी आणि थेट कर्ज वितरण — सोपी व पारदर्शक प्रक्रिया.'
        : isHi
        ? 'सरल सत्यापन एवं प्रत्यक्ष ऋण वितरण — सीधी एवं सुविधाजनक प्रक्रिया।'
        : 'Simple verification and direct disbursal — clear and convenient process.',
    },
    {
      title: isMr ? 'थेट संपर्क' : isHi ? 'सीधा सहयोग' : 'Direct Support',
      desc: isMr
        ? 'स्थानिक पातळीवर सुलभ संकलन आणि थेट ग्राहक सहाय्य.'
        : isHi
        ? 'सुविधाजनक किस्त संग्रह और सीधी ग्राहक सहायता।'
        : 'Convenient installment collection and direct customer assistance.',
    },
    {
      title: isMr ? 'विश्वास' : isHi ? 'विश्वास' : 'Trust',
      desc: isMr
        ? 'पारदर्शक हिशोब आणि स्पष्ट दस्तऐवज — आमच्या प्रत्येक व्यवहारात प्रामाणिकपणा.'
        : isHi
        ? 'पारदर्शी हिसाब और स्पष्ट दस्तावेज — हमारे प्रत्येक व्यवहार में विश्वसनीयता एवं निष्ठा।'
        : 'Transparent accounting and clear documentation — honesty built into every transaction.',
    },
  ];

  const team = [
    {
      name: isMr ? 'व्यवस्थापक' : isHi ? 'प्रबंधन टीम' : 'Management Team',
      desc: isMr
        ? 'वित्त सेवा, ग्राहक सेवा आणि व्यवसाय विकासात समर्पित व्यावसायिकांची टीम.'
        : isHi
        ? 'वित्त सेवाओं, ग्राहक संबंधों और व्यवसाय विकास हेतु समर्पित पेशेवरों की टीम।'
        : 'A dedicated team focused on finance services, customer relations, and business support.',
    },
    {
      name: isMr ? 'क्षेत्र प्रतिनिधी' : isHi ? 'फील्ड प्रतिनिधि' : 'Field Representatives',
      desc: isMr
        ? 'स्थानिक भागात प्रत्यक्ष सेवा देणारे आमचे प्रतिनिधी ग्राहकांपर्यंत पोहोचतात.'
        : isHi
        ? 'स्थानीय क्षेत्रों में ग्राहकों तक प्रत्यक्ष सेवा और सुलभ संकलन सुविधा पहुंचाने वाली टीम।'
        : 'Our local field representatives provide convenient doorstep collection and support.',
    },
  ];

  return (
    <div className="w-full bg-white min-h-screen">

      {/* Page Header */}
      <div className="bg-[#0b1f4a] text-white py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-xs text-slate-400 mb-6">
            <Link to="/" className="hover:text-white transition-colors">
              {isMr ? 'मुख्यपृष्ठ' : isHi ? 'मुख्य पृष्ठ' : 'Home'}
            </Link>
            <span>/</span>
            <span className="text-white">
              {isMr ? 'आमच्याबद्दल' : isHi ? 'हमारे बारे में' : 'About Us'}
            </span>
          </nav>
          <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight max-w-2xl">
            {isMr
              ? 'स्थानिक व्यवसायांसाठी विश्वासू मायक्रो फायनान्स सेवा'
              : isHi
              ? 'स्थानीय व्यवसायों के लिए विश्वसनीय माइक्रो फाइनेंस सेवाएं'
              : 'Trusted Micro-Finance for Local Businesses'}
          </h1>
          <p className="text-slate-400 mt-3 text-sm max-w-xl leading-relaxed">
            {isMr
              ? 'स्थानिक लहान दुकानदार व व्यावसायिकांना वेळेवर आर्थिक पाठबळ देणारी संस्था.'
              : isHi
              ? 'स्थानीय छोटे दुकानदारों एवं व्यापारियों को समय पर वित्तीय संबल प्रदान करने वाला प्रतिष्ठित संस्थान।'
              : 'Dedicated to providing structured, transparent, and accessible micro-financing to merchants and shopkeepers.'}
          </p>
        </div>
      </div>

      {/* Story */}
      <section className="py-14 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 items-start">
            <div>
              <p className="text-xs font-semibold text-[#1a56db] uppercase tracking-widest mb-3">
                {isMr ? 'आमची कहाणी' : isHi ? 'हमारी कहानी' : 'Our Story'}
              </p>
              <h2 className="text-2xl font-bold text-slate-900 mb-5">
                {isMr ? 'का सुरुवात केली?' : isHi ? 'शुरुआत क्यों की?' : 'Why We Started'}
              </h2>
              <div className="space-y-4 text-sm text-slate-600 leading-relaxed">
                <p>
                  {isMr
                    ? 'अनेक लहान व्यावसायिक आणि दुकानदारांना तातडीच्या भांडवलासाठी औपचारिक बँकिंग प्रक्रिया गुंतागुंतीची वाटते.'
                    : isHi
                    ? 'कई छोटे व्यापारियों और दुकानदारों को तात्कालिक कार्यशील पूंजी प्राप्त करने में औपचारिक बैंकिंग प्रक्रिया जटिल लगती है।'
                    : 'Many small shopkeepers and local merchants face hurdles accessing quick working capital due to complex documentation.'}
                </p>
                <p>
                  {isMr
                    ? 'भारत एंटरप्रायझेस फायनान्स सर्व्हिसेसची सुरुवात याच गरजेतून झाली — सोपी, पारदर्शक आणि न्याय्य मायक्रो कर्ज सेवा उपलब्ध करून देणे. आमचे ब्रीदवाक्य आहे: तुमचा विश्वास, आमची साथ.'
                    : isHi
                    ? 'भारत एंटरप्राइजेज फाइनेंस सर्विसेज की शुरुआत इसी उद्देश्य से हुई — सरल, पारदर्शी और उचित माइक्रो ऋण सुविधाएं प्रदान करना। हमारा ध्येय वाक्य है: विश्वास आपका, साथ हमारा।'
                    : 'Bharat Enterprises Finance Services was created to address this gap — offering structured, transparent, and fair micro-credit with convenient daily and weekly options.'}
                </p>
                <p>
                  {isMr
                    ? 'लहान व्यवसायांना वेळेवर आर्थिक पाठबळ देऊन त्यांच्या स्थिर वाढीस मदत करणे हे आमचे ध्येय आहे.'
                    : isHi
                    ? 'छोटे व्यवसायों को समय पर वित्तीय संबल प्रदान कर उनकी निरंतर एवं सुदृढ़ प्रगति में सहयोग करना हमारा लक्ष्य है।'
                    : 'Our goal is to support the steady, sustainable growth of local merchants with flexible repayment options.'}
                </p>
              </div>
            </div>

            <div className="border border-slate-200 rounded-xl p-7 space-y-5">
              <p className="text-xs font-semibold text-[#1a56db] uppercase tracking-widest mb-1">
                {isMr ? 'महत्त्वाचे तपशील' : isHi ? 'प्रमुख विवरण' : 'Key Details'}
              </p>
              {[
                {
                  label: isMr ? 'संस्थेचे नाव' : isHi ? 'संस्थान का नाम' : 'Company Name',
                  value: isMr ? COMPANY_DETAILS.marathiName : isHi ? COMPANY_DETAILS.hindiName : COMPANY_DETAILS.name
                },
                {
                  label: isMr ? 'कर्ज योजना' : isHi ? 'पुनर्भुगतान मॉडल' : 'Repayment Models',
                  value: isMr ? 'दैनिक व साप्ताहिक हप्ता' : isHi ? 'दैनिक एवं साप्ताहिक किस्त' : 'Daily & Weekly Installments'
                },
                {
                  label: isMr ? 'कर्ज श्रेणी' : isHi ? 'ऋण सीमा' : 'Loan Range',
                  value: isMr ? '₹ ९,००० – ₹ ४,५०,०००' : isHi ? '₹ ९,००० – ₹ ४,५०,०००' : '₹ 9,000 – ₹ 4,50,000'
                },
                {
                  label: isMr ? 'प्रोसेसिंग फी' : isHi ? 'प्रोसेसिंग शुल्क' : 'Processing Fee',
                  value: isMr ? 'फक्त १% — कोणतेही लपलेले शुल्क नाही' : isHi ? 'केवल १% — कोई छिपा हुआ प्रभार नहीं' : '1% Flat — No Hidden Charges'
                },
                {
                  label: isMr ? 'कागदपत्रे' : isHi ? 'दस्तावेज' : 'Documentation',
                  value: isMr ? 'आधार व पॅन आधारित ओळख पडताळणी' : isHi ? 'आधार एवं पैन आधारित सत्यापन' : 'Aadhaar & PAN based KYC'
                },
              ].map((fact, i) => (
                <div key={i} className="flex justify-between py-3 border-b border-slate-100 last:border-0">
                  <span className="text-sm text-slate-500">{fact.label}</span>
                  <span className="text-sm font-semibold text-slate-900 text-right max-w-[55%]">{fact.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-14 sm:py-16 bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold text-[#1a56db] uppercase tracking-widest mb-3">
            {isMr ? 'आमची मूल्ये' : isHi ? 'हमारे मूल्य' : 'Our Values'}
          </p>
          <h2 className="text-2xl font-bold text-slate-900 mb-10">
            {isMr ? 'आम्हाला वेगळे काय बनवते?' : isHi ? 'हमें क्या विशिष्ट बनाता है?' : 'What Makes Us Different'}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {values.map((val, i) => (
              <div key={i} className="bg-white border border-slate-200 rounded-xl p-6">
                <div className="flex items-start gap-3">
                  <span className="text-xs font-bold text-[#1a56db] w-5 shrink-0 mt-0.5">{String(i + 1).padStart(2, '0')}.</span>
                  <div>
                    <h3 className="text-base font-semibold text-slate-900 mb-1.5">{val.title}</h3>
                    <p className="text-sm text-slate-500 leading-relaxed">{val.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-14 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold text-[#1a56db] uppercase tracking-widest mb-3">
            {isMr ? 'आमची टीम' : isHi ? 'हमारी टीम' : 'Our Team'}
          </p>
          <h2 className="text-2xl font-bold text-slate-900 mb-8">
            {isMr ? 'समर्पित टीम' : isHi ? 'सेवा के पीछे समर्पित लोग' : 'Dedicated People Behind the Service'}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {team.map((member, i) => (
              <div key={i} className="border border-slate-200 rounded-xl p-6">
                <h3 className="text-base font-semibold text-slate-900 mb-2">{member.name}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{member.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 bg-[#0b1f4a] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <div>
            <h3 className="text-xl font-bold mb-1">
              {isMr ? 'आजच कर्जासाठी अर्ज करा' : isHi ? 'आज ही ऋण के लिए आवेदन करें' : 'Apply for a Loan Today'}
            </h3>
            <p className="text-sm text-slate-400">
              {isMr ? '५ मिनिटांत ऑनलाइन अर्ज पूर्ण करा.' : isHi ? '५ मिनट में ऑनलाइन आवेदन पूर्ण करें।' : 'Complete your application online in 5 minutes.'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/apply"
              className="px-6 py-2.5 bg-white hover:bg-slate-100 text-[#0b1f4a] font-semibold text-sm rounded-lg transition-colors inline-flex items-center gap-2"
            >
              <span>{isMr ? 'अर्ज करा' : isHi ? 'आवेदन करें' : 'Apply Now'}</span>
              <ArrowRight size={14} />
            </Link>
            <Link
              to="/contact"
              className="px-6 py-2.5 border border-white/20 text-white font-semibold text-sm rounded-lg transition-colors hover:bg-white/8"
            >
              {isMr ? 'संपर्क करा' : isHi ? 'संपर्क करें' : 'Contact Us'}
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};
