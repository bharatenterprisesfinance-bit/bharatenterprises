import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Calculator, ArrowRight, ShieldCheck, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { LOAN_PLANS } from '../types';

interface LoanCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// All 14 official loan amounts
const LOAN_AMOUNTS = LOAN_PLANS.map((p) => p.loanAmount);

export const LoanCalculatorModal: React.FC<LoanCalculatorModalProps> = ({ isOpen, onClose }) => {
  const { language } = useLanguage();
  const isMr = language === 'mr';
  const isHi = language === 'hi';
  const navigate = useNavigate();

  // Default to plan index 4 (₹45,000 - popular)
  const [planIndex, setPlanIndex] = useState<number>(4);
  const [repayFreq, setRepayFreq] = useState<'Daily' | 'Weekly'>('Daily');

  if (!isOpen) return null;

  const selectedPlan = LOAN_PLANS[planIndex];
  const amount = selectedPlan.loanAmount;

  // Values come directly from the official plan data - no interpolation
  const processingFee = selectedPlan.processingFee;
  const totalRepay = selectedPlan.totalRepayment;
  const emiValue = repayFreq === 'Daily' ? selectedPlan.dailyEmi : selectedPlan.weeklyEmi;
  const emiText = `₹${emiValue.toLocaleString('en-IN')} / ${
    repayFreq === 'Daily'
      ? isMr ? 'दिवस' : isHi ? 'दिन' : 'day'
      : isMr ? 'आठवडा' : isHi ? 'सप्ताह' : 'week'
  }`;
  const tenureText = isMr ? '१४ आठवडे २ दिवस (१०० दिवस)' : isHi ? '१४ सप्ताह २ दिन (१०० दिन)' : '14 Weeks 2 Days (100 Days)';

  const handleApply = () => {
    onClose();
    navigate(`/apply?amount=${amount}&plan=${repayFreq}`);
  };

  const prevPlan = () => setPlanIndex((i) => Math.max(0, i - 1));
  const nextPlan = () => setPlanIndex((i) => Math.min(LOAN_PLANS.length - 1, i + 1));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#0b1733] border border-slate-700/80 text-white rounded-2xl sm:rounded-3xl w-full max-w-xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-700/60 bg-[#0f2148]">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="p-1.5 sm:p-2 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
              <Calculator size={18} />
            </div>
            <div>
              <h3 className="text-sm sm:text-lg font-bold leading-tight">
                {isMr ? 'कर्ज ईएमआय कॅल्क्युलेटर' : isHi ? 'ऋण ईएमआई कैलकुलेटर' : 'Loan EMI & Repayment Calculator'}
              </h3>
              <p className="text-[10px] sm:text-[11px] text-blue-300">
                {isMr
                  ? '१४ प्रमाणित योजना (₹९,००० ते ₹४,५०,०००)'
                  : isHi
                  ? '१४ मानक योजनाएं (₹९,००० से ₹४,५०,०००)'
                  : '14 Standard Plans (₹9,000 to ₹4,50,000)'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5">
          {/* Amount Selector */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                {isMr ? 'कर्ज रक्कम' : isHi ? 'ऋण राशि' : 'Loan Amount'}
              </label>
              <div className="text-2xl font-black text-blue-400 font-mono">
                ₹{amount.toLocaleString('en-IN')}
                {selectedPlan.isPopular && (
                  <span className="ml-2 text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider align-middle">
                    {isMr ? 'लोकप्रिय' : isHi ? 'लोकप्रिय' : 'Popular'}
                  </span>
                )}
              </div>
            </div>

            {/* Arrow navigation + plan indicator */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={prevPlan}
                disabled={planIndex === 0}
                className="p-2 rounded-xl bg-[#122247] border border-slate-700/60 text-slate-300 hover:bg-[#1a2e5d] disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
              >
                <ChevronLeft size={18} />
              </button>

              {/* Progress bar representing position among 14 tiers */}
              <div className="flex-1 flex items-center gap-1">
                {LOAN_PLANS.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setPlanIndex(idx)}
                    className={`h-2 rounded-full transition-all cursor-pointer ${
                      idx === planIndex
                        ? 'bg-blue-500 flex-[2]'
                        : 'bg-slate-700 hover:bg-slate-500 flex-1'
                    }`}
                    title={`₹${LOAN_AMOUNTS[idx].toLocaleString('en-IN')}`}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={nextPlan}
                disabled={planIndex === LOAN_PLANS.length - 1}
                className="p-2 rounded-xl bg-[#122247] border border-slate-700/60 text-slate-300 hover:bg-[#1a2e5d] disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
              >
                <ChevronRight size={18} />
              </button>
            </div>

            {/* Plan label */}
            <div className="text-center text-xs text-slate-400 font-mono">
              {isMr ? 'योजना' : isHi ? 'योजना' : 'Plan'} {selectedPlan.sn} / 14
              <span className="mx-2 text-slate-600">•</span>
              {isMr ? 'मुदत:' : isHi ? 'अवधि:' : 'Tenure:'} {tenureText}
            </div>

            {/* Quick chips — all 14 tiers */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {LOAN_PLANS.map((plan, idx) => (
                <button
                  key={plan.loanAmount}
                  type="button"
                  onClick={() => setPlanIndex(idx)}
                  className={`px-2.5 py-1 text-[11px] rounded-lg font-semibold font-mono transition-all cursor-pointer ${
                    planIndex === idx
                      ? 'bg-blue-600 text-white font-bold shadow-sm ring-1 ring-blue-400'
                      : 'bg-[#122247] text-slate-300 hover:bg-[#1a2e5d]'
                  }`}
                >
                  {plan.loanAmount >= 100000
                    ? `₹${(plan.loanAmount / 100000).toFixed(1)}L`
                    : `₹${plan.loanAmount / 1000}k`}
                </button>
              ))}
            </div>
          </div>

          {/* Repayment Plan choice */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
              {isMr ? 'परतफेड वारंवारता' : isHi ? 'पुनर्भुगतान आवृत्ति' : 'Repayment Frequency'}
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(['Daily', 'Weekly'] as const).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setRepayFreq(p)}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all border cursor-pointer text-center ${
                    repayFreq === p
                      ? 'bg-blue-600 border-blue-400 text-white shadow-md'
                      : 'bg-[#122247] border-slate-700/60 text-slate-300 hover:border-slate-500'
                  }`}
                >
                  {p === 'Daily'
                    ? isMr ? 'दैनिक' : isHi ? 'दैनिक' : 'Daily'
                    : isMr ? 'साप्ताहिक' : isHi ? 'साप्ताहिक' : 'Weekly'}
                </button>
              ))}
            </div>
          </div>

          {/* Calculation summary card */}
          <div className="bg-[#122247] border border-blue-500/30 rounded-2xl p-5 space-y-3.5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-700/60">
              <span className="text-xs text-slate-400">{isMr ? 'हप्ता रक्कम' : isHi ? 'किस्त राशि' : 'EMI Amount'}</span>
              <span className="text-xl font-black text-emerald-400 font-mono">{emiText}</span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-400 block">{isMr ? 'मुदत' : isHi ? 'अवधि' : 'Tenure'}</span>
                <span className="font-bold text-white text-sm">{tenureText}</span>
              </div>
              <div>
                <span className="text-slate-400 block">{isMr ? 'प्रोसेसिंग फी' : isHi ? 'प्रोसेसिंग शुल्क' : 'Processing Fee'}</span>
                <span className="font-bold text-white text-sm">₹{processingFee.toLocaleString('en-IN')} {isMr ? '(१%)' : isHi ? '(१%)' : '(1%)'}</span>
              </div>
              <div>
                <span className="text-slate-400 block">{isMr ? 'एकूण परतफेड' : isHi ? 'कुल पुनर्भुगतान' : 'Total Repayment'}</span>
                <span className="font-bold text-amber-300 text-sm font-mono">
                  ₹{totalRepay.toLocaleString('en-IN')}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block">{isMr ? 'कागदपत्रे' : isHi ? 'दस्तावेज' : 'Documentation'}</span>
                <span className="font-bold text-white text-sm">{isMr ? 'आधार व पॅन' : isHi ? 'आधार व पैन' : 'Aadhaar & PAN'}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <ShieldCheck size={16} className="text-emerald-400 shrink-0" />
            <span>
              {isMr
                ? 'कोणतीही छुपी फी नाही. १००% पारदर्शक प्रक्रिया.'
                : isHi
                ? 'कोई छिपा हुआ शुल्क नहीं। १००% पारदर्शी प्रक्रिया।'
                : 'No hidden charges. Transparent process with direct disbursement.'}
            </span>
          </div>
        </div>

        {/* Footer with Apply CTA */}
        <div className="px-6 py-4 border-t border-slate-700/60 bg-[#0f2148] flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2.5 text-xs font-semibold text-slate-400 hover:text-white cursor-pointer"
          >
            {isMr ? 'रद्द करा' : isHi ? 'रद्द करें' : 'Cancel'}
          </button>
          <button
            onClick={handleApply}
            className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 px-5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 transition-all cursor-pointer"
          >
            <span>
              {isMr
                ? `₹${amount.toLocaleString('en-IN')} साठी अर्ज करा`
                : isHi
                ? `₹${amount.toLocaleString('en-IN')} के लिए आवेदन करें`
                : `Apply for ₹${amount.toLocaleString('en-IN')}`}
            </span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};
