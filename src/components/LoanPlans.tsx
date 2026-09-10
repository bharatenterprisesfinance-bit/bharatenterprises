import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { LOAN_PLANS, COMPANY_DETAILS, LoanPlan } from '../types';
import { 
  Calculator, 
  ArrowRight, 
  ShieldCheck, 
  CreditCard, 
  Building2, 
  Clock, 
  Landmark,
  BadgePercent,
  CheckCircle2
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface LoanPlansProps {
  onSelectPlan?: (plan: LoanPlan, type: 'Daily' | 'Weekly') => void;
}


export const LoanPlans: React.FC<LoanPlansProps> = ({ onSelectPlan }) => {
  const [customPlanIdx, setCustomPlanIdx] = useState<number>(4); // default ₹45,000 (popular)
  const { language, t } = useLanguage();
  const isMr = language === 'mr';
  const isHi = language === 'hi';

  // Look up live numbers directly from official plan data (no interpolation)
  const currentPlan = LOAN_PLANS[customPlanIdx];
  const customAmount = currentPlan.loanAmount;
  const customFee = currentPlan.processingFee;
  const customDaily = currentPlan.dailyEmi;
  const customWeekly = currentPlan.weeklyEmi;
  const customTotal = currentPlan.totalRepayment;

  return (
    <section id="plans-section" className="py-8 sm:py-16 bg-slate-50 border-b border-slate-200 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="max-w-3xl mx-auto mb-6 sm:mb-10 text-center sm:text-left">
          <p className="text-[11px] sm:text-xs font-bold text-[#1a56db] uppercase tracking-widest mb-1.5 sm:mb-2">
            {t('plans.badge')}
          </p>
          <h2 className="text-xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
            {t('plans.title')}
          </h2>
          <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-slate-500 leading-relaxed">
            {t('plans.sub')}
          </p>
        </div>

        {/* Info Banner: Modernized & Responsive */}
        <div className="bg-gradient-to-br from-[#0c1e45] via-[#091738] to-[#061026] text-white p-4 sm:p-7 rounded-2xl sm:rounded-3xl border border-blue-900/50 shadow-xl mb-8 relative overflow-hidden">
          {/* Subtle decorative glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 sm:gap-6">
            <div className="space-y-2 flex-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-400/20 uppercase tracking-widest">
                {isMr ? 'कर्ज योजना तपशील' : isHi ? 'ऋण योजना विवरण' : 'Loan Plan Details'}
              </span>
              <h3 className="text-base sm:text-xl font-bold text-white tracking-tight leading-snug">
                {isMr
                  ? 'आमच्याकडे ₹ ९,००० ते ₹ ४,५०,००० पर्यंत १४ प्रकारचे प्रमाणित प्लॅन उपलब्ध आहेत.'
                  : isHi
                  ? 'हमारे पास ₹ ९,००० से ₹ ४,५०,००० तक १४ प्रकार की मानक योजनाएं उपलब्ध हैं।'
                  : 'Structured 14-Tier Micro & Business Credit Plans (₹ 9,000 to ₹ 4,50,000)'}
              </h3>
            </div>

            {/* 2 Key Stats Cards: Side-by-Side 2-Column Grid on Mobile */}
            <div className="grid grid-cols-2 gap-2.5 sm:gap-3.5 w-full lg:w-auto mt-2 lg:mt-0 shrink-0">
              <div className="bg-[#12234c]/90 border border-blue-400/20 p-3 sm:px-5 sm:py-4 rounded-xl text-center flex flex-col items-center justify-center shadow-xs">
                <span className="text-[10px] text-blue-300 uppercase font-bold tracking-wider flex items-center gap-1">
                  <Clock size={12} className="text-blue-400" />
                  <span>{isMr ? 'मुदत' : isHi ? 'अवधि' : 'Tenure'}</span>
                </span>
                <span className="text-sm sm:text-base font-black text-white mt-1 leading-tight">
                  {isMr ? '१४ आठवडे २ दिवस' : isHi ? '१४ सप्ताह २ दिन' : '14 Weeks 2 Days'}
                </span>
                <span className="text-[10px] text-slate-400 mt-0.5">
                  {isMr ? '(१०० दिवस)' : isHi ? '(१०० दिन)' : '(100 Days)'}
                </span>
              </div>

              <div className="bg-[#12234c]/90 border border-blue-400/20 p-3 sm:px-5 sm:py-4 rounded-xl text-center flex flex-col items-center justify-center shadow-xs">
                <span className="text-[10px] text-blue-300 uppercase font-bold tracking-wider flex items-center gap-1">
                  <BadgePercent size={12} className="text-blue-400" />
                  <span>{isMr ? 'प्रोसेसिंग फी' : isHi ? 'प्रोसेसिंग शुल्क' : 'Processing Fee'}</span>
                </span>
                <span className="text-sm sm:text-base font-black text-white mt-1 leading-tight">
                  {isMr ? 'फक्त १.००%' : isHi ? 'सपाट १.००%' : 'Flat 1.00%'}
                </span>
                <span className="text-[10px] text-emerald-400 font-bold mt-0.5 flex items-center gap-0.5">
                  <CheckCircle2 size={10} />
                  <span>{isMr ? 'कोणतेही छुपे शुल्क नाही' : isHi ? 'कोई छिपा हुआ शुल्क नहीं' : 'No Hidden Charges'}</span>
                </span>
              </div>
            </div>

          </div>
        </div>

        {/* Interactive Banking EMI Calculator Card */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-7 mb-10 shadow-xs">
          <div className="flex items-center justify-between flex-wrap gap-3 mb-6 pb-4 border-b border-slate-100">
            <div>
              <h4 className="text-base font-semibold text-slate-900">
                {t('plans.calcTitle')}
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">{t('plans.calcSub')}</p>
            </div>
            <span className="text-xs text-slate-500 bg-slate-100 px-3 py-1 rounded-md">
              {isMr ? '१०० दिवसांची प्रमाणित मुदत' : isHi ? '१०० दिनों की मानक अवधि' : '100-Day Standard Tenure'}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Slider & Presets Column */}
            <div className="lg:col-span-6 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">{t('plans.calcAmount')}</span>
                <span className="text-2xl font-black text-[#0b254a] font-mono">₹ {customAmount.toLocaleString('en-IN')}/-</span>
              </div>

              <input
                type="range"
                min={0}
                max={13}
                step={1}
                value={customPlanIdx}
                onChange={(e) => setCustomPlanIdx(Number(e.target.value))}
                className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#0b254a]"
              />

              {/* Quick preset amount chips */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  {isMr ? 'रक्कम निवडा:' : isHi ? 'राशि चुनें:' : 'Quick Select Amount:'}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {LOAN_PLANS.map((plan, idx) => (
                    <button
                      key={plan.loanAmount}
                      type="button"
                      onClick={() => setCustomPlanIdx(idx)}
                      className={`px-2.5 py-1 rounded text-xs font-bold font-mono transition-all cursor-pointer ${
                        customPlanIdx === idx
                          ? 'bg-[#0b254a] text-white shadow-xs'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                      }`}
                    >
                      {plan.loanAmount >= 100000 ? `₹ ${(plan.loanAmount / 100000).toFixed(1)}L` : `₹ ${plan.loanAmount / 1000}k`}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Live Breakdown Cards */}
            <div className="lg:col-span-6 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-lg text-center">
                <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">{t('plans.calcFee')}</span>
                <span className="text-sm sm:text-base font-bold text-[#0b1f4a] font-mono">₹ {customFee.toLocaleString('en-IN')}/-</span>
                <span className="text-[10px] text-slate-400 block">{isMr ? '१% एकवेळ' : isHi ? '१% एकमुश्त' : '1% one-time'}</span>
              </div>

              <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-lg text-center">
                <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">{t('plans.calcDaily')}</span>
                <span className="text-sm sm:text-base font-bold text-[#0b1f4a] font-mono">₹ {customDaily.toLocaleString('en-IN')}/-</span>
                <span className="text-[10px] text-slate-400 block">{t('plans.calcForDays')}</span>
              </div>

              <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-lg text-center">
                <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">{t('plans.calcWeekly')}</span>
                <span className="text-sm sm:text-base font-bold text-[#0b1f4a] font-mono">₹ {customWeekly.toLocaleString('en-IN')}/-</span>
                <span className="text-[10px] text-slate-400 block">{t('plans.calcForWks')}</span>
              </div>

              <div className="bg-slate-50 border border-[#1a56db]/20 p-3.5 rounded-lg text-center">
                <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">{t('plans.calcTotal')}</span>
                <span className="text-sm sm:text-base font-bold text-[#0b1f4a] font-mono">₹ {customTotal.toLocaleString('en-IN')}/-</span>
                <span className="text-[10px] text-slate-400 block">{t('plans.calcNet')}</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-xs text-slate-500 text-center sm:text-left flex items-center gap-1.5">
              <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
              <span>{t('plans.calcIncludes')}</span>
            </span>
            <Link
              to={`/apply?amount=${customAmount}&plan=Daily`}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-[#0b254a] hover:bg-blue-900 text-white text-xs font-bold rounded-lg shadow-sm transition-all uppercase tracking-wider hover:scale-[1.01]"
            >
              <span>{t('plans.calcApply')} (₹ {customAmount.toLocaleString('en-IN')})</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        {/* 14-Tier Official Loan Schedule Table */}
        <div className="bg-white rounded-xl border border-slate-300 shadow-sm overflow-hidden mb-8 w-full">
          
          {/* Table Header Bar */}
          <div className="bg-[#0b254a] text-white px-4 sm:px-6 py-3.5 flex items-center justify-between flex-wrap gap-2 border-b border-blue-950">
            <div className="flex items-center gap-2.5">
              <Building2 size={16} className="text-amber-400 shrink-0" />
              <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-white">
                {t('plans.tableHeader')}
              </h4>
            </div>
            <div className="flex items-center gap-3 text-xs font-semibold text-blue-200">
              <span className="hidden sm:inline">•</span>
              <span>{isMr ? 'मुदत: १४ आठवडे २ दिवस (१०० दिवस)' : isHi ? 'अवधि: १४ सप्ताह २ दिन (१०० दिन)' : 'Tenure: 14 Weeks 2 Days (100 Days)'}</span>
              <span className="hidden sm:inline">•</span>
              <span className="text-amber-300 font-bold">{isMr ? '१४ प्रमाणित योजना' : isHi ? '१४ मानक योजनाएं' : '14 Standard Plans'}</span>
            </div>
          </div>

          {/* MOBILE ONLY: 14-Tier Scheme Cards (< sm) */}
          <div className="sm:hidden p-3 space-y-3 bg-slate-100/70">
            {LOAN_PLANS.map((plan) => (
              <div
                key={plan.sn}
                className={`p-4 rounded-2xl border transition-all bg-white shadow-xs ${
                  plan.isPopular ? 'border-amber-400 ring-2 ring-amber-400/20 shadow-md' : 'border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-[#0b254a] text-white text-[11px] font-bold flex items-center justify-center font-mono">
                      {plan.sn}
                    </span>
                    <span className="text-lg font-black text-[#0b254a] font-mono">
                      ₹ {plan.loanAmount.toLocaleString('en-IN')}/-
                    </span>
                  </div>
                  {plan.isPopular && (
                    <span className="text-[9px] bg-amber-100 text-amber-900 border border-amber-300 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                      {isMr ? 'लोकप्रिय' : isHi ? 'लोकप्रिय' : 'Popular'}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2 py-3 text-xs">
                  <div className="bg-blue-50/70 border border-blue-100/80 p-2.5 rounded-xl">
                    <span className="text-[10px] text-blue-900 font-bold uppercase block">{isMr ? '१% फी' : isHi ? '१% शुल्क' : '1% Fee'}</span>
                    <span className="font-mono font-bold text-blue-950 text-sm">₹ {plan.processingFee.toLocaleString('en-IN')}/-</span>
                  </div>
                  <div className="bg-emerald-50/70 border border-emerald-100/80 p-2.5 rounded-xl">
                    <span className="text-[10px] text-emerald-800 font-bold uppercase block">{isMr ? 'दैनिक हप्ता' : isHi ? 'दैनिक किस्त' : 'Daily EMI'}</span>
                    <span className="font-mono font-bold text-emerald-700 text-sm">₹ {plan.dailyEmi.toLocaleString('en-IN')}/-</span>
                  </div>
                  <div className="bg-amber-50/70 border border-amber-100/80 p-2.5 rounded-xl">
                    <span className="text-[10px] text-amber-800 font-bold uppercase block">{isMr ? 'साप्ताहिक हप्ता' : isHi ? 'साप्ताहिक किस्त' : 'Weekly EMI'}</span>
                    <span className="font-mono font-bold text-amber-700 text-sm">₹ {plan.weeklyEmi.toLocaleString('en-IN')}/-</span>
                  </div>
                  <div className="bg-slate-100/80 border border-slate-200/80 p-2.5 rounded-xl">
                    <span className="text-[10px] text-slate-600 font-bold uppercase block">{isMr ? 'एकूण परतफेड' : isHi ? 'कुल पुनर्भुगतान' : 'Total'}</span>
                    <span className="font-mono font-bold text-slate-900 text-sm">₹ {plan.totalRepayment.toLocaleString('en-IN')}/-</span>
                  </div>
                </div>

                <Link
                  to={`/apply?amount=${plan.loanAmount}&plan=Daily`}
                  className="w-full mt-1 flex items-center justify-center gap-1.5 py-2.5 bg-[#0b254a] hover:bg-blue-900 text-white text-xs font-bold rounded-xl uppercase tracking-wider shadow-xs transition-all active:scale-[0.99]"
                >
                  <span>{isMr ? 'या कर्जासाठी अर्ज करा' : isHi ? 'इस योजना के लिए आवेदन करें' : 'Apply For This Plan'}</span>
                  <ArrowRight size={13} />
                </Link>
              </div>
            ))}
          </div>

          {/* DESKTOP ONLY: 14-Tier Official Table (hidden sm:block) */}
          <div className="hidden sm:block overflow-x-auto w-full">
            <table className="w-full text-left border-collapse min-w-[640px]">
              <thead>
                <tr className="bg-slate-100 text-slate-800 border-b border-slate-200 text-[11px] sm:text-xs uppercase tracking-wider font-extrabold">
                  <th className="py-3 px-3 text-center border-r border-slate-200 w-12">{t('plans.thSn')}</th>
                  <th className="py-3 px-4 border-r border-slate-200 text-[#0b254a] sticky left-0 z-10 bg-slate-100 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.08)]">
                    {t('plans.thLoan')}
                  </th>
                  <th className="py-3 px-4 border-r border-slate-200 text-blue-950 bg-blue-50/50">{t('plans.thProcessingFee')}</th>
                  <th className="py-3 px-4 border-r border-slate-200 text-emerald-800 bg-emerald-50/40">{t('plans.thDaily')}</th>
                  <th className="py-3 px-4 border-r border-slate-200 text-amber-800 bg-amber-50/40">{t('plans.thWeekly')}</th>
                  <th className="py-3 px-4 text-slate-900 bg-slate-50/80">{t('plans.thTotal')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-xs font-medium">
                {LOAN_PLANS.map((plan, idx) => {
                  const rowBg = plan.isPopular ? 'bg-amber-50/50' : idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/70';
                  return (
                    <tr 
                      key={plan.sn}
                      className={`transition-colors hover:bg-blue-50/50 ${rowBg}`}
                    >
                      {/* 1. Serial Number */}
                      <td className="py-3 px-3 text-center font-bold text-slate-600 border-r border-slate-200 font-mono">
                        {plan.sn}
                      </td>

                      {/* 2. Loan Amount (Sticky on horizontal scroll) */}
                      <td className={`py-3 px-4 font-bold text-[#0b254a] border-r border-slate-200 font-mono sticky left-0 z-10 ${rowBg} shadow-[2px_0_5px_-2px_rgba(0,0,0,0.08)]`}>
                        ₹ {plan.loanAmount.toLocaleString('en-IN')}/-
                        {plan.isPopular && (
                          <span className="ml-2 text-[9px] bg-amber-100 text-amber-900 border border-amber-300 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                            {isMr ? 'लोकप्रिय' : isHi ? 'लोकप्रिय' : 'Popular'}
                          </span>
                        )}
                      </td>

                      {/* 3. Processing Fee (1%) */}
                      <td className="py-3 px-4 font-bold text-blue-950 bg-blue-50/20 border-r border-slate-200 font-mono">
                        ₹ {plan.processingFee.toLocaleString('en-IN')}/-
                      </td>

                      {/* 4. Daily EMI */}
                      <td className="py-3 px-4 font-bold text-emerald-700 bg-emerald-50/20 border-r border-slate-200 font-mono">
                        ₹ {plan.dailyEmi.toLocaleString('en-IN')}/-
                      </td>

                      {/* 5. Weekly EMI */}
                      <td className="py-3 px-4 font-bold text-amber-700 bg-amber-50/20 border-r border-slate-200 font-mono">
                        ₹ {plan.weeklyEmi.toLocaleString('en-IN')}/-
                      </td>

                      {/* 6. Total Repayment */}
                      <td className="py-3 px-4 font-bold text-slate-900 bg-slate-50/50 font-mono">
                        ₹ {plan.totalRepayment.toLocaleString('en-IN')}/-
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Institutional Footnote Bar */}
          <div className="bg-slate-100 border-t border-slate-200 px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between text-xs text-slate-700 gap-3">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-slate-900 uppercase text-[11px] tracking-wider">{isMr ? 'मुदत:' : isHi ? 'अवधि:' : 'Tenure:'}</span>
                <span className="bg-[#0b254a] text-white px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider font-mono">
                  {isMr ? '१४ आठवडे २ दिवस (१०० दिवस)' : isHi ? '१४ सप्ताह २ दिन (१०० दिन)' : '14 Weeks 2 Days (100 Days)'}
                </span>
              </div>
              <span className="text-slate-400 hidden sm:inline">•</span>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-slate-900 uppercase text-[11px] tracking-wider">{isMr ? 'प्रोसेसिंग फी:' : isHi ? 'प्रोसेसिंग शुल्क:' : 'Processing Fee:'}</span>
                <span className="text-blue-900 font-bold">{isMr ? 'कर्ज रकमेच्या १%' : isHi ? 'ऋण राशि का १%' : '1% of Loan Amount'}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 font-bold text-slate-800 text-xs">
              <span className="text-[11px] uppercase tracking-wider text-slate-500">{isMr ? 'हेल्पलाईन:' : isHi ? 'हेल्पलाइन:' : 'Helpline:'}</span>
              <a href={`tel:${COMPANY_DETAILS.cleanPhone}`} className="hover:underline font-mono text-[#0b254a]">
                {COMPANY_DETAILS.phone}
              </a>
            </div>
          </div>
        </div>

        {/* Banking Action Prompt below Table */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="text-sm sm:text-base font-bold text-slate-900">
              {isMr ? 'कर्ज घेण्यासाठी आजच ऑनलाइन अर्ज सादर करा' : isHi ? 'ऋण प्राप्त करने के लिए आज ही ऑनलाइन आवेदन करें' : 'Ready to Apply for Micro Business Credit?'}
            </h4>
            <p className="text-xs text-slate-500 font-devanagari">
              {isMr
                ? 'आधार कार्ड व पॅन कार्डवर सोपी पडताळणी आणि पारदर्शक प्रक्रिया.'
                : isHi
                ? 'आधार कार्ड और पैन कार्ड पर आसान सत्यापन एवं पारदर्शी प्रक्रिया।'
                : 'Clear document verification and straightforward digital disbursement.'}
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto shrink-0">
            <Link
              to="/apply"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#0b254a] hover:bg-blue-900 text-white text-xs font-bold rounded-lg shadow-sm transition-all uppercase tracking-wider"
            >
              <span>{isMr ? 'ऑनलाइन कर्ज अर्ज करा' : isHi ? 'ऑनलाइन ऋण आवेदन करें' : 'Apply for Loan'}</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
};
