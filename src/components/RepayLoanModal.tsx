import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  QrCode,
  CreditCard,
  Building2,
  AlertTriangle,
  Search,
  Copy,
  ExternalLink,
  PhoneCall
} from 'lucide-react';
import { COMPANY_DETAILS } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface RepayLoanModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RepayLoanModal: React.FC<RepayLoanModalProps> = ({ isOpen, onClose }) => {
  const { language } = useLanguage();
  const isMr = language === 'mr';
  const isHi = language === 'hi';

  const [activeTab, setActiveTab] = useState<'upi' | 'search' | 'bank'>('upi');
  const [searchQuery, setSearchQuery] = useState('');
  const [searched, setSearched] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#0b1733] border border-slate-700/80 text-white rounded-2xl sm:rounded-3xl w-full max-w-xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-700/60 bg-[#0f2148]">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="p-1.5 sm:p-2 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
              <CreditCard size={18} />
            </div>
            <div>
              <h3 className="text-sm sm:text-lg font-bold leading-tight">
                {isMr ? 'सुरक्षित कर्ज परतफेड पोर्टल' : isHi ? 'सुरक्षित ऋण पुनर्भुगतान पोर्टल' : 'Secure Loan Repayment Portal'}
              </h3>
              <p className="text-[10px] sm:text-[11px] text-blue-300">
                {isMr ? COMPANY_DETAILS.marathiName : isHi ? COMPANY_DETAILS.hindiName : COMPANY_DETAILS.name}
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

        {/* Anti-fraud alert banner */}
        <div className="bg-amber-950/50 border-b border-amber-800/40 px-4 sm:px-6 py-2 sm:py-2.5 flex items-center gap-2 text-[11px] sm:text-xs text-amber-200">
          <AlertTriangle size={14} className="shrink-0 text-amber-400" />
          <span className="leading-tight">
            {isMr
              ? 'सावधान: फक्त खालील खात्यांवरच हप्ता भरा. बनावट लिंक्स किंवा अज्ञात क्रमांकावर पैसे पाठवू नका.'
              : isHi
              ? 'सावधान: केवल नीचे दिए गए खातों पर ही किस्त जमा करें। किसी भी फर्जी लिंक या अज्ञात नंबर पर पैसे न भेजें।'
              : 'Beware of fraud: Only pay to the Bharat Enterprises accounts shown below. Never pay to unverified personal UPIs.'}
          </span>
        </div>

        {/* Tabs */}
        <div className="flex overflow-x-auto border-b border-slate-700/40 bg-[#081229] px-3 sm:px-6 pt-2 gap-1 scrollbar-none">
          <button
            onClick={() => setActiveTab('upi')}
            className={`pb-2 px-2.5 sm:px-4 text-[11px] sm:text-xs font-bold transition-all border-b-2 cursor-pointer flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
              activeTab === 'upi'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <QrCode size={13} />
            <span>{isMr ? 'यूपीआय / क्यूआर कोड' : isHi ? 'यूपीआई / क्यूआर कोड' : 'UPI / QR Pay'}</span>
          </button>
          <button
            onClick={() => setActiveTab('search')}
            className={`pb-2 px-2.5 sm:px-4 text-[11px] sm:text-xs font-bold transition-all border-b-2 cursor-pointer flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
              activeTab === 'search'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Search size={13} />
            <span>{isMr ? 'कर्ज खाते शोधा' : isHi ? 'ऋण खाता खोजें' : 'Lookup Loan'}</span>
          </button>
          <button
            onClick={() => setActiveTab('bank')}
            className={`pb-2 px-2.5 sm:px-4 text-[11px] sm:text-xs font-bold transition-all border-b-2 cursor-pointer flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
              activeTab === 'bank'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Building2 size={13} />
            <span>{isMr ? 'बँक खाते तपशील' : isHi ? 'बैंक ट्रांसफर' : 'Bank Transfer'}</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 sm:space-y-5">
          {activeTab === 'upi' && (
            <div className="space-y-4 text-center">
              <div className="bg-white p-4 rounded-2xl inline-block shadow-lg mx-auto border-4 border-blue-500/30">
                {/* Simulated dynamic payment QR */}
                <div className="w-48 h-48 bg-slate-900 rounded-xl p-3 flex flex-col items-center justify-center relative overflow-hidden">
                  <div className="grid grid-cols-6 gap-1 w-full h-full opacity-90">
                    {[...Array(36)].map((_, i) => (
                      <div
                        key={i}
                        className={`rounded-sm ${
                          (i % 2 === 0 && i % 3 === 0) || i === 0 || i === 5 || i === 30 || i === 35
                            ? 'bg-blue-400'
                            : (i * 7) % 5 === 0
                            ? 'bg-white'
                            : 'bg-slate-800'
                        }`}
                      />
                    ))}
                  </div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/80 backdrop-blur-[1px] p-2">
                    <QrCode size={48} className="text-white mb-2" />
                    <span className="text-[10px] font-bold text-blue-300 uppercase tracking-wider">
                      {isMr ? 'पेमेंट करण्यासाठी स्कॅन करा' : isHi ? 'भुगतान हेतु स्कैन करें' : 'Scan to Pay Bharat Enterprises'}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-xs text-slate-400 mb-1">
                  {isMr ? 'व्यावसायिक यूपीआय आयडी' : isHi ? 'व्यावसायिक यूपीआई आईडी' : 'Business UPI ID'}
                </p>
                <div className="inline-flex items-center gap-2 bg-[#122247] border border-blue-500/30 px-4 py-2 rounded-xl text-sm font-mono font-bold text-white">
                  <span>8605333555@okbizaxis</span>
                  <button
                    onClick={() => copyToClipboard('8605333555@okbizaxis', 'upi')}
                    className="p-1 hover:text-blue-400 transition-colors cursor-pointer"
                    title={isMr ? 'आयडी कॉपी करा' : isHi ? 'आईडी कॉपी करें' : 'Copy UPI ID'}
                  >
                    <Copy size={15} />
                  </button>
                  {copied === 'upi' && <span className="text-[10px] text-emerald-400">{isMr ? 'कॉपी झाले!' : isHi ? 'कॉपी हो गया!' : 'Copied!'}</span>}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 max-w-sm mx-auto pt-2">
                <div className="p-3 bg-[#122247] rounded-xl border border-slate-700/60 flex items-center justify-between">
                  <span className="text-xs text-slate-300">{isMr ? 'गुगलपे / फोनपे' : isHi ? 'गूगल पे / फोनपे' : 'GPay / PhonePe'}</span>
                  <p className="text-[10px] text-emerald-400 font-semibold mt-0.5">{isMr ? 'थेट' : isHi ? 'सीधा' : 'Direct'}</p>
                </div>
                <div className="p-3 bg-[#122247] rounded-xl border border-slate-700/60 flex items-center justify-between">
                  <span className="text-xs text-slate-300">{isMr ? 'यूपीआय / क्यूआर' : isHi ? 'यूपीआई / क्यूआर' : 'UPI / QR Code'}</span>
                  <p className="text-[10px] text-emerald-400 font-semibold mt-0.5">{isMr ? 'थेट' : isHi ? 'सीधा' : 'Direct'}</p>
                </div>
                <div className="p-3 bg-[#122247] rounded-xl border border-slate-700/60 flex items-center justify-between">
                  <span className="text-xs text-slate-300">{isMr ? 'बँक ट्रान्सफर' : isHi ? 'बैंक ट्रांसफर' : 'Bank Transfer'}</span>
                  <p className="text-[10px] text-emerald-400 font-semibold mt-0.5">{isMr ? 'एनईएफटी / आयएमपीएस' : isHi ? 'एनईएफटी / आईएमपीएस' : 'NEFT / IMPS'}</p>
                </div>
              </div>

              <p className="text-[11px] text-slate-400 text-center font-devanagari">
                {isMr
                  ? 'पेमेंट केल्यानंतर पुष्टीकरणासाठी कृपया ट्रान्झॅक्शनचा स्क्रीनशॉट व्हॉट्सॲपवर पाठवा.'
                  : isHi
                  ? 'भुगतान के बाद पुष्टि के लिए कृपया रसीद का स्क्रीनशॉट व्हाट्सएप पर भेजें।'
                  : 'After paying, please WhatsApp the transaction receipt for prompt confirmation.'}
              </p>
            </div>
          )}

          {activeTab === 'search' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  {isMr ? 'मोबाईल नंबर किंवा कर्ज अर्ज क्रमांक' : isHi ? 'मोबाइल नंबर या ऋण आवेदन क्रमांक' : 'Mobile Number or Application ID'}
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={isMr ? 'मोबाईल नंबर किंवा अर्ज क्रमांक प्रविष्ट करा' : isHi ? 'मोबाइल नंबर या आवेदन क्रमांक दर्ज करें' : 'Enter mobile number or application ID'}
                    className="flex-1 bg-[#101f3e] border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
                  />
                  <button
                    onClick={() => setSearched(true)}
                    className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Search size={15} />
                    <span>{isMr ? 'शोधा' : isHi ? 'खोजें' : 'Search'}</span>
                  </button>
                </div>
              </div>

              {searched && (
                <div className="bg-[#122247] border border-blue-500/30 rounded-2xl p-5 space-y-3 animate-fadeIn">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-700/60">
                    <div>
                      <p className="text-xs text-slate-400">{isMr ? 'कर्जदार नोंद' : isHi ? 'ऋणी रिकॉर्ड' : 'Borrower Record'}</p>
                      <p className="text-sm font-bold text-white">{isMr ? 'सक्रिय कर्ज खाते' : isHi ? 'सक्रिय ऋण खाता' : 'Active Loan Account'}</p>
                    </div>
                    <span className="px-2.5 py-1 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-semibold rounded-full">
                      {isMr ? 'नियमित / सक्रिय' : isHi ? 'नियमित / सक्रिय' : 'Regular / Active'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-slate-400 block">{isMr ? 'मंजूर रक्कम' : isHi ? 'स्वीकृत राशि' : 'Sanctioned Amount'}</span>
                      <span className="font-bold text-white text-sm">₹{isMr ? '४५,०००' : isHi ? '४५,०००' : '45,000'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">{isMr ? 'दैनिक हप्ता' : isHi ? 'दैनिक किस्त' : 'Daily EMI'}</span>
                      <span className="font-bold text-blue-400 text-sm">₹{isMr ? '५०० / दिवस' : isHi ? '५०० / दिन' : '500 / day'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">{isMr ? 'एकूण देय' : isHi ? 'कुल देय' : 'Total Due'}</span>
                      <span className="font-bold text-amber-300 text-sm">₹{isMr ? '५०० (आज)' : isHi ? '५०० (आज)' : '500 (Today)'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">{isMr ? 'कर्ज संदर्भ क्रमांक' : isHi ? 'ऋण संदर्भ संख्या' : 'Loan Ref ID'}</span>
                      <span className="font-mono text-slate-300">BEFS-ACT-8841</span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={() => setActiveTab('upi')}
                      className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 rounded-xl text-xs transition-colors cursor-pointer"
                    >
                      {isMr ? '₹५०० हप्ता आत्ता भरा' : isHi ? '₹५०० किस्त अभी जमा करें' : 'Pay ₹500 Daily EMI Now'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'bank' && (
            <div className="space-y-4">
              <div className="bg-[#122247] border border-slate-700/60 rounded-2xl p-5 space-y-3 text-xs">
                <div className="flex items-center justify-between pb-2.5 border-b border-slate-700/60">
                  <span className="text-slate-400">{isMr ? 'खातेदाराचे नाव:' : isHi ? 'खाताधारक का नाम:' : 'Account Name:'}</span>
                  <span className="font-bold text-white">{isMr ? COMPANY_DETAILS.marathiName : isHi ? COMPANY_DETAILS.hindiName : COMPANY_DETAILS.name}</span>
                </div>
                <div className="flex items-center justify-between pb-2.5 border-b border-slate-700/60">
                  <span className="text-slate-400">{isMr ? 'बँकेचे नाव:' : isHi ? 'बैंक का नाम:' : 'Bank Name:'}</span>
                  <span className="font-bold text-white">{isMr ? 'ॲक्सिस बँक लि.' : isHi ? 'एक्सिस बैंक लि.' : 'Axis Bank Ltd.'}</span>
                </div>
                <div className="flex items-center justify-between pb-2.5 border-b border-slate-700/60">
                  <span className="text-slate-400">{isMr ? 'खाते क्रमांक:' : isHi ? 'खाता संख्या:' : 'Account Number:'}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-white">924020018894120</span>
                    <button
                      onClick={() => copyToClipboard('924020018894120', 'ac')}
                      className="text-slate-400 hover:text-blue-400 cursor-pointer"
                    >
                      <Copy size={13} />
                    </button>
                    {copied === 'ac' && <span className="text-[10px] text-emerald-400">{isMr ? 'कॉपी झाले' : isHi ? 'कॉपी हो गया' : 'Copied'}</span>}
                  </div>
                </div>
                <div className="flex items-center justify-between pb-2.5 border-b border-slate-700/60">
                  <span className="text-slate-400">{isMr ? 'आयएफएससी कोड:' : isHi ? 'आईएफएससी कोड:' : 'IFSC Code:'}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-white">UTIB0001045</span>
                    <button
                      onClick={() => copyToClipboard('UTIB0001045', 'ifsc')}
                      className="text-slate-400 hover:text-blue-400 cursor-pointer"
                    >
                      <Copy size={13} />
                    </button>
                    {copied === 'ifsc' && <span className="text-[10px] text-emerald-400">{isMr ? 'कॉपी झाले' : isHi ? 'कॉपी हो गया' : 'Copied'}</span>}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">{isMr ? 'शाखा:' : isHi ? 'शाखा:' : 'Branch:'}</span>
                  <span className="text-white">{isMr ? 'मुख्य शाखा' : isHi ? 'मुख्य शाखा' : 'Main Branch'}</span>
                </div>
              </div>
            </div>
          )}

          {/* WhatsApp Support Callout */}
          <div className="bg-[#101e3d] border border-emerald-500/20 p-3.5 rounded-2xl flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <PhoneCall size={16} className="text-emerald-400" />
              <div>
                <p className="text-xs font-bold text-white">
                  {isMr ? 'थेट मदत व पावती पुष्टी' : isHi ? 'सीधी सहायता एवं रसीद सत्यापन' : 'Direct Helpline & Receipt Confirmation'}
                </p>
                <p className="text-[11px] text-slate-400">{COMPANY_DETAILS.phone}</p>
              </div>
            </div>
            <a
              href={`https://api.whatsapp.com/send?phone=${COMPANY_DETAILS.cleanPhone}&text=Hello%20Bharat%20Enterprises,%20I%20have%20made%20a%20loan%20repayment`}
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold inline-flex items-center gap-1.5 transition-colors"
            >
              <span>{isMr ? 'व्हॉट्सॲप' : isHi ? 'व्हाट्सएप' : 'WhatsApp'}</span>
              <ExternalLink size={12} />
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-700/60 bg-[#0f2148] flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-400">
            <ShieldCheck size={14} />
            <span>{isMr ? '२५६-बिट सुरक्षित पेमेंट गेटवे' : isHi ? '२५६-बिट सुरक्षित भुगतान गेटवे' : '256-Bit Encrypted Secure Gateway'}</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
          >
            {isMr ? 'बंद करा' : isHi ? 'बंद करें' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
