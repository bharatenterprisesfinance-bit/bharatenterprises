import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Hero } from '../components/Hero';
import { LoanPlans } from '../components/LoanPlans';
import {
  TrendingUp,
  ArrowRight,
  Zap,
  Lock,
  HeartHandshake,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const HomePage: React.FC = () => {
  const { language } = useLanguage();
  const isMr = language === 'mr';
  const isHi = language === 'hi';
  const navigate = useNavigate();

  const features = [
    {
      icon: <Zap size={18} />,
      title: isMr ? 'सोपी अर्ज प्रक्रिया' : isHi ? 'सरल आवेदन प्रक्रिया' : 'Easy Application',
      desc: isMr
        ? 'सोपी ऑनलाईन पात्रता तपासणी.'
        : isHi
        ? 'सरल ऑनलाइन पात्रता जांच।'
        : 'Simple online eligibility check.',
    },
    {
      icon: <Lock size={18} />,
      title: isMr ? 'सुरक्षित व खाजगी' : isHi ? 'सुरक्षित एवं गोपनीय' : 'Secure & Private',
      desc: isMr
        ? 'तुमच्या डेटासाठी बँक-स्तरीय सुरक्षा.'
        : isHi
        ? 'आपके डेटा हेतु बैंक-स्तरीय सुरक्षा।'
        : 'Bank-level security for all your data.',
    },
    {
      icon: <TrendingUp size={18} />,
      title: isMr ? 'लवचिक परतफेड' : isHi ? 'लचीला पुनर्भुगतान' : 'Flexible Repayment',
      desc: isMr
        ? 'दैनिक किंवा साप्ताहिक हप्ते निवडा.'
        : isHi
        ? 'दैनिक अथवा साप्ताहिक किस्तें चुनें।'
        : 'Choose daily or weekly installment schedules.',
    },
    {
      icon: <HeartHandshake size={18} />,
      title: isMr ? 'समर्पित सहाय्य' : isHi ? 'समर्पित सहायता' : 'Dedicated Support',
      desc: isMr
        ? 'फोन व व्हॉट्सॲपवर जलद ग्राहक सेवा.'
        : isHi
        ? 'फोन एवं व्हाट्सएप पर त्वरित ग्राहक सेवा।'
        : 'Customer assistance via phone & WhatsApp.',
    },
  ];

  const steps = [
    {
      num: '01',
      title: isMr ? 'अर्ज करा' : isHi ? 'आवेदन करें' : 'Apply Online',
      desc: isMr
        ? '५ मिनिटांत ऑनलाइन फॉर्म भरा.'
        : isHi
        ? '५ मिनट में ऑनलाइन फॉर्म भरें।'
        : 'Fill the simple online form in 5 minutes.',
    },
    {
      num: '02',
      title: isMr ? 'पडताळणी' : isHi ? 'दस्तावेज सत्यापन' : 'Document Check',
      desc: isMr
        ? 'सुलभ दस्तऐवज पडताळणी प्रक्रिया.'
        : isHi
        ? 'सरल दस्तावेज समीक्षा प्रक्रिया।'
        : 'Simple document review process.',
    },
    {
      num: '03',
      title: isMr ? 'निधी मिळवा' : isHi ? 'ऋण वितरण' : 'Disbursement',
      desc: isMr
        ? 'थेट बँक खात्यात पैसे जमा करा.'
        : isHi
        ? 'सीधे बैंक खाते में धनराशि प्राप्त करें।'
        : 'Funds transferred directly to your account.',
    },
  ];

  return (
    <div className="w-full bg-white">
      {/* Hero */}
      <Hero />

      {/* ── Why Choose Us ──────────────────────────────────────────────── */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12">
            <p className="text-xs font-semibold text-[#1a56db] uppercase tracking-widest mb-3">
              {isMr ? 'आमची वैशिष्ट्ये' : isHi ? 'हमारी विशेषताएं' : 'Why Choose Us'}
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              {isMr
                ? 'डिजिटल मायक्रो फायनान्सचे भविष्य अनुभवा'
                : isHi
                ? 'आधुनिक डिजिटल माइक्रो फाइनेंस का अनुभव करें'
                : 'Designed for the Modern Borrower'}
            </h2>
            <p className="text-slate-500 mt-2 text-sm leading-relaxed">
              {isMr
                ? 'आधुनिक तंत्रज्ञान आणि ग्राहक-प्रथम दृष्टिकोनासह डिझाइन केलेले.'
                : isHi
                ? 'आधुनिक तकनीक और ग्राहक-प्रथम दृष्टिकोण के साथ तैयार किया गया।'
                : 'Technology-first approach with transparent pricing and no hidden charges.'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-slate-200 border border-slate-200 rounded-xl overflow-hidden">
            {features.map((feat, i) => (
              <div
                key={i}
                className="bg-white p-7 hover:bg-slate-50 transition-colors"
              >
                <div className="text-[#1a56db] mb-4">{feat.icon}</div>
                <h3 className="text-sm font-semibold text-slate-900 mb-1.5">{feat.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ───────────────────────────────────────────────── */}
      <section id="how-it-works" className="py-16 sm:py-20 bg-slate-50 border-y border-slate-200 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-14">
            <p className="text-xs font-semibold text-[#1a56db] uppercase tracking-widest mb-3">
              {isMr ? 'कसे काम करते' : isHi ? 'यह कैसे काम करता है' : 'How It Works'}
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              {isMr ? 'फक्त ३ सोप्या पायऱ्या' : isHi ? 'केवल ३ आसान चरण' : 'Get a Loan in 3 Simple Steps'}
            </h2>
            <p className="text-slate-500 mt-2 text-sm">
              {isMr
                ? 'जलद, सुलभ आणि पारदर्शक प्रक्रिया.'
                : isHi
                ? 'त्वरित, सरल एवं पूर्णतः पारदर्शी प्रक्रिया।'
                : 'Fast, transparent, and completely paperless process.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connector */}
            <div className="hidden md:block absolute top-8 left-[calc(16.66%+2rem)] right-[calc(16.66%+2rem)] h-px border-t border-dashed border-slate-300" />

            {steps.map((step, i) => (
              <div key={i} className="flex flex-col items-center text-center">
                <div className="relative mb-6">
                  <div className="w-16 h-16 rounded-full bg-[#0b1f4a] text-white flex items-center justify-center text-xl font-black relative z-10">
                    {step.num}
                  </div>
                </div>
                <h3 className="text-base font-semibold text-slate-900 mb-2">{step.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed max-w-[220px]">{step.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/apply"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#1a56db] hover:bg-blue-700 text-white text-sm font-semibold rounded-full shadow-md transition-all hover:shadow-lg"
            >
              <span>{isMr ? 'आत्ता सुरुवात करा' : isHi ? 'अभी शुरुआत करें' : 'Start Your Application'}</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Official 14-Tier Loan Plans Section ──────────────────────── */}
      <div className="w-full">
        <LoanPlans
          onSelectPlan={(plan, type) => {
            navigate(`/apply?amount=${plan.loanAmount}&plan=${type}`);
          }}
        />
      </div>

      {/* ── CTA ─────────────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-24 bg-[#0b1f4a] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-4">
            {isMr ? 'डिजिटल अर्ज पोर्टल' : isHi ? 'डिजिटल ऋण पोर्टल' : 'Paperless Micro-Finance'}
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight max-w-2xl mx-auto leading-tight">
            {isMr
              ? 'तुमच्या व्यवसायासाठी आजच कर्ज अर्ज करा'
              : isHi
              ? 'अपने व्यवसाय हेतु आज ही ऋण आवेदन करें'
              : 'Ready to Grow Your Business?'}
          </h2>
          <p className="text-sm text-slate-400 max-w-lg mx-auto mt-4 leading-relaxed">
            {isMr
              ? 'केवळ ५ मिनिटांत ऑनलाइन अर्ज भरा, डिजिटल स्वाक्षरी करा आणि पोचपावती मिळवा.'
              : isHi
              ? 'केवल ५ मिनट में ऑनलाइन आवेदन भरें, डिजिटल हस्ताक्षर करें और पावती प्राप्त करें।'
              : 'Complete your application in 5 minutes. Digital signature and PDF receipt included.'}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
            <Link
              to="/apply"
              className="px-8 py-3.5 bg-white hover:bg-slate-100 text-[#0b1f4a] font-semibold text-sm rounded-full shadow-md transition-all"
            >
              {isMr ? 'ऑनलाइन कर्ज अर्ज करा' : isHi ? 'ऑनलाइन ऋण आवेदन करें' : 'Apply Online Now'}
            </Link>
            <Link
              to="/plans"
              className="px-8 py-3.5 border border-white/20 text-white font-semibold text-sm rounded-full transition-all hover:bg-white/8"
            >
              {isMr ? 'कर्ज योजना तपासा' : isHi ? 'ऋण योजनाएं देखें' : 'View Loan Plans'}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
