import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  Percent,
  IndianRupee,
  Banknote,
  User,
  Phone,
  ArrowRight,
  AlertCircle,
  Lock,
  FileText
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const Hero: React.FC = () => {
  const { language } = useLanguage();
  const isMr = language === 'mr';
  const isHi = language === 'hi';
  const navigate = useNavigate();

  // Form State - Home page only asks for Name and Mobile number
  const [fullName, setFullName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');

  // Errors
  const [errors, setErrors] = useState<{ name?: string; mobile?: string }>({});

  // Formatting helpers
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFullName(e.target.value);
    if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
  };

  const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, '').slice(0, 10);
    setMobileNumber(val);
    if (errors.mobile) setErrors((prev) => ({ ...prev, mobile: undefined }));
  };

  const validateForm = () => {
    const newErrors: { name?: string; mobile?: string } = {};

    // Validate Name
    if (!fullName.trim()) {
      newErrors.name = isMr
        ? 'कृपया तुमचे पूर्ण नाव प्रविष्ट करा'
        : isHi
        ? 'कृपया अपना पूरा नाम दर्ज करें'
        : 'Please enter your full name';
    } else if (fullName.trim().length < 2) {
      newErrors.name = isMr
        ? 'कृपया किमान २ अक्षरी नाव प्रविष्ट करा'
        : isHi
        ? 'कृपया कम से कम २ अक्षरों का नाम दर्ज करें'
        : 'Please enter a valid full name';
    }

    // Validate Mobile
    if (!mobileNumber.trim()) {
      newErrors.mobile = isMr
        ? 'कृपया मोबाईल नंबर प्रविष्ट करा'
        : isHi
        ? 'कृपया मोबाइल नंबर दर्ज करें'
        : 'Please enter your mobile number';
    } else if (mobileNumber.length !== 10 || !/^[6-9]\d{9}$/.test(mobileNumber)) {
      newErrors.mobile = isMr
        ? 'वैध १० अंकी मोबाईल नंबर प्रविष्ट करा'
        : isHi
        ? 'मान्य १० अंकों का मोबाइल नंबर दर्ज करें'
        : 'Valid 10-digit mobile number required (starts with 6-9)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Save to session storage for seamless auto-fill in loan application form
    try {
      sessionStorage.setItem('befs_initial_name', fullName);
      sessionStorage.setItem('befs_initial_mobile', mobileNumber);
    } catch {
      // ignore
    }

    // Navigate to dedicated application form page with name and mobile query parameters
    navigate(`/apply?name=${encodeURIComponent(fullName.trim())}&mobile=${encodeURIComponent(mobileNumber.trim())}`);
  };

  return (
    <>
      <section className="relative bg-[#07132e] text-white pt-7 pb-12 sm:pt-10 sm:pb-16 lg:pt-14 lg:pb-24 w-full overflow-hidden">
        {/* Background Radial Glow Elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 -left-20 w-[550px] h-[550px] rounded-full bg-blue-600/10 blur-[120px]" />
          <div className="absolute bottom-10 right-0 w-[650px] h-[650px] rounded-full bg-indigo-500/10 blur-[130px]" />
          <div className="absolute top-10 right-1/4 w-[400px] h-[400px] rounded-full bg-sky-500/5 blur-[90px]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

            {/* ─── LEFT COLUMN: Heading, Character & Responsive Badges ─── */}
            <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left">
              {/* Main Headline */}
              <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-black text-white tracking-tight leading-[1.18] sm:leading-[1.15] mb-5 sm:mb-8 max-w-xl">
                {isMr ? (
                  <>
                    तुमच्या वैयक्तिक कर्ज
                    <br />
                    अर्जाची सुरुवात करा
                  </>
                ) : isHi ? (
                  <>
                    अपने व्यक्तिगत ऋण
                    <br />
                    आवेदन की शुरुआत करें
                  </>
                ) : (
                  <>
                    Start Your Personal
                    <br />
                    Loan Application
                  </>
                )}
              </h1>

              {/* Character Illustration with Responsive Badges */}
              <div className="w-full flex flex-col items-center">
                {/* Desktop & Tablet floating badge container (sm: and above) */}
                <div className="relative w-full max-w-[520px] aspect-[4/3] hidden sm:flex items-center justify-center">

                  {/* SVG Connecting Dashed Curves (desktop only) */}
                  <svg
                    className="absolute inset-0 w-full h-full pointer-events-none z-0"
                    viewBox="0 0 520 390"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {/* Left arc connecting top-left and bottom-left */}
                    <path
                      d="M 125 125 C 60 170, 60 220, 130 270"
                      stroke="#3b82f6"
                      strokeWidth="1.5"
                      strokeDasharray="4 4"
                      strokeOpacity="0.4"
                    />
                    {/* Right arc connecting top-right and bottom-right */}
                    <path
                      d="M 390 125 C 460 170, 460 220, 390 270"
                      stroke="#3b82f6"
                      strokeWidth="1.5"
                      strokeDasharray="4 4"
                      strokeOpacity="0.4"
                    />
                  </svg>

                  {/* Central Portrait of Indian Man */}
                  <div className="relative w-[300px] lg:w-[320px] h-[300px] lg:h-[320px] rounded-3xl overflow-hidden shadow-2xl border border-white/10 z-10 group">
                    <img
                      src="/hero-man.jpg"
                      alt="Bharat Enterprises Confident Customer"
                      className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                    />
                    {/* Soft bottom vignette gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#07132e]/70 via-transparent to-transparent" />
                  </div>

                  {/* Floating Badge 1: Top-Left (Easy Application) */}
                  <div
                    className="absolute top-6 left-2 z-20 bg-white text-slate-900 rounded-full px-4 py-2.5 shadow-xl flex items-center gap-2.5 transition-all duration-300 hover:scale-105 hover:shadow-2xl border border-slate-100 animate-fadeInUp anim-delay-100"
                  >
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white shrink-0 shadow-sm">
                      <ShieldCheck size={18} strokeWidth={2.5} />
                    </div>
                    <span className="text-sm font-bold tracking-tight whitespace-nowrap">
                      {isMr ? 'सोपी अर्ज प्रक्रिया' : isHi ? 'आसान आवेदन प्रक्रिया' : 'Easy Application'}
                    </span>
                  </div>

                  {/* Floating Badge 2: Bottom-Left (Low Interest Rates) */}
                  <div
                    className="absolute bottom-8 left-4 z-20 bg-white text-slate-900 rounded-full px-4 py-2.5 shadow-xl flex items-center gap-2.5 transition-all duration-300 hover:scale-105 hover:shadow-2xl border border-slate-100 animate-fadeInUp anim-delay-200"
                  >
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white shrink-0 shadow-sm">
                      <Percent size={16} strokeWidth={2.5} />
                    </div>
                    <span className="text-sm font-bold tracking-tight whitespace-nowrap">
                      {isMr ? 'कमी व्याज दर' : isHi ? 'कम ब्याज दर' : 'Low Interest Rates'}
                    </span>
                  </div>

                  {/* Floating Badge 3: Top-Right (Flexible Repayment) */}
                  <div
                    className="absolute top-8 right-2 z-20 bg-white text-slate-900 rounded-full px-4 py-2.5 shadow-xl flex items-center gap-2.5 transition-all duration-300 hover:scale-105 hover:shadow-2xl border border-slate-100 animate-fadeInUp anim-delay-300"
                  >
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white shrink-0 shadow-sm">
                      <IndianRupee size={17} strokeWidth={2.5} />
                    </div>
                    <span className="text-sm font-bold tracking-tight whitespace-nowrap">
                      {isMr ? 'लवचिक परतफेड' : isHi ? 'लचीला पुनर्भुगतान' : 'Flexible Repayment'}
                    </span>
                  </div>

                  {/* Floating Badge 4: Bottom-Right (Up to ₹4.5 Lakhs) */}
                  <div
                    className="absolute bottom-10 right-0 z-20 bg-white text-slate-900 rounded-full px-4 py-2.5 shadow-xl flex items-center gap-2.5 transition-all duration-300 hover:scale-105 hover:shadow-2xl border border-slate-100 animate-fadeInUp anim-delay-400"
                  >
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white shrink-0 shadow-sm">
                      <Banknote size={17} strokeWidth={2.5} />
                    </div>
                    <span className="text-sm font-bold tracking-tight whitespace-nowrap">
                      {isMr ? '₹४.५ लाखांपर्यंत' : isHi ? '₹४.५ लाख तक' : 'Up to ₹4.5 Lakhs'}
                    </span>
                  </div>

                </div>

                {/* Mobile View: Dedicated Unobstructed Portrait + Clean 2x2 Feature Grid (< sm) */}
                <div className="sm:hidden w-full flex flex-col items-center">
                  {/* Clean, unobstructed portrait card */}
                  <div className="relative w-[240px] h-[240px] xs:w-[270px] xs:h-[270px] rounded-3xl overflow-hidden shadow-2xl border border-blue-400/20 ring-4 ring-blue-500/10">
                    <img
                      src="/hero-man.jpg"
                      alt="Bharat Enterprises Confident Customer"
                      className="w-full h-full object-cover object-top"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#07132e]/60 via-transparent to-transparent" />
                  </div>

                  {/* Clean 2x2 Feature Cards directly below the image */}
                  <div className="grid grid-cols-2 gap-2.5 w-full max-w-sm mt-5">
                    {/* Feature 1 */}
                    <div className="bg-white text-slate-900 rounded-2xl p-2.5 flex items-center gap-2 shadow-md border border-slate-100">
                      <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white shrink-0 shadow-xs">
                        <ShieldCheck size={15} strokeWidth={2.5} />
                      </div>
                      <span className="text-xs font-bold tracking-tight text-slate-900 leading-tight">
                        {isMr ? 'सोपी अर्ज प्रक्रिया' : isHi ? 'आसान आवेदन प्रक्रिया' : 'Easy Application'}
                      </span>
                    </div>

                    {/* Feature 2 */}
                    <div className="bg-white text-slate-900 rounded-2xl p-2.5 flex items-center gap-2 shadow-md border border-slate-100">
                      <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white shrink-0 shadow-xs">
                        <IndianRupee size={15} strokeWidth={2.5} />
                      </div>
                      <span className="text-xs font-bold tracking-tight text-slate-900 leading-tight">
                        {isMr ? 'लवचिक परतफेड' : isHi ? 'लचीला पुनर्भुगतान' : 'Flexible Repayment'}
                      </span>
                    </div>

                    {/* Feature 3 */}
                    <div className="bg-white text-slate-900 rounded-2xl p-2.5 flex items-center gap-2 shadow-md border border-slate-100">
                      <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white shrink-0 shadow-xs">
                        <Percent size={14} strokeWidth={2.5} />
                      </div>
                      <span className="text-xs font-bold tracking-tight text-slate-900 leading-tight">
                        {isMr ? 'कमी व्याज दर' : isHi ? 'कम ब्याज दर' : 'Low Interest Rates'}
                      </span>
                    </div>

                    {/* Feature 4 */}
                    <div className="bg-white text-slate-900 rounded-2xl p-2.5 flex items-center gap-2 shadow-md border border-slate-100">
                      <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white shrink-0 shadow-xs">
                        <Banknote size={15} strokeWidth={2.5} />
                      </div>
                      <span className="text-xs font-bold tracking-tight text-slate-900 leading-tight">
                        {isMr ? '₹४.५ लाखांपर्यंत' : isHi ? '₹४.५ लाख तक' : 'Up to ₹4.5 Lakhs'}
                      </span>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* ─── RIGHT COLUMN: "Enter Your Details" Application Card ─── */}
            <div className="lg:col-span-5 w-full max-w-md mx-auto">
              <div className="bg-[#0f1d38]/95 backdrop-blur-md border border-[#1e345e] rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-2xl shadow-black/40">

                {/* Card Title & Subtitle */}
                <div className="mb-6">
                  <h2 className="text-2xl sm:text-[1.65rem] font-bold text-white tracking-tight">
                    {isMr ? 'तुमचे तपशील प्रविष्ट करा' : isHi ? 'अपना विवरण दर्ज करें' : 'Enter Your Details'}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-400 mt-1.5 leading-relaxed">
                    {isMr
                      ? 'पुढे जाण्यासाठी कृपया तुमचे नाव आणि मोबाईल नंबर प्रविष्ट करा.'
                      : isHi
                      ? 'आगे बढ़ने के लिए कृपया अपना नाम और मोबाइल नंबर दर्ज करें।'
                      : 'Please enter your Name and Mobile Number to start application.'}
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleContinue} className="space-y-4 text-left">

                  {/* Full Name Field */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-200">
                      {isMr ? 'पूर्ण नाव' : isHi ? 'पूरा नाम' : 'Full Name'}{' '}
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <User size={17} />
                      </div>
                      <input
                        type="text"
                        value={fullName}
                        onChange={handleNameChange}
                        placeholder={isMr ? 'उदा. रमेश विठ्ठल पाटील' : isHi ? 'उदा. रमेश विट्ठल शर्मा' : 'Enter your full name'}
                        className={`w-full pl-10 pr-4 py-3 bg-[#192744] border rounded-xl text-white text-sm placeholder:text-slate-500 focus:outline-none transition-all ${errors.name
                            ? 'border-red-400 focus:ring-1 focus:ring-red-400'
                            : 'border-[#263c68] focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                          }`}
                      />
                    </div>
                    {errors.name && (
                      <p className="text-[11px] text-red-400 flex items-center gap-1 mt-1">
                        <AlertCircle size={12} /> {errors.name}
                      </p>
                    )}
                  </div>

                  {/* Mobile Number Field */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-200">
                      {isMr ? 'मोबाईल नंबर' : isHi ? 'मोबाइल नंबर' : 'Mobile Number'}{' '}
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="relative flex items-center">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-300 font-semibold text-sm">
                        <span>+91</span>
                        <span className="text-slate-500 mx-2">|</span>
                      </div>
                      <input
                        type="tel"
                        value={mobileNumber}
                        onChange={handleMobileChange}
                        placeholder={isMr ? 'मोबाईल नंबर टाका' : isHi ? 'मोबाइल नंबर दर्ज करें' : 'Enter your mobile number'}
                        maxLength={10}
                        className={`w-full pl-16 pr-10 py-3 bg-[#192744] border rounded-xl text-white font-medium text-sm placeholder:text-slate-500 focus:outline-none transition-all ${errors.mobile
                            ? 'border-red-400 focus:ring-1 focus:ring-red-400'
                            : 'border-[#263c68] focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                          }`}
                      />
                      <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400">
                        <Phone size={16} />
                      </div>
                    </div>
                    {errors.mobile && (
                      <p className="text-[11px] text-red-400 flex items-center gap-1 mt-1">
                        <AlertCircle size={12} /> {errors.mobile}
                      </p>
                    )}
                  </div>

                  {/* Submit / Continue Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-semibold py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 text-sm sm:text-base transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
                    >
                      <span>{isMr ? 'पुढे जा' : isHi ? 'आगे बढ़ें' : 'Continue'}</span>
                      <ArrowRight size={17} />
                    </button>
                  </div>

                  {/* Secure micro text */}
                  <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 pt-1">
                    <Lock size={12} className="text-blue-400" />
                    <span>{isMr ? '२५६-बिट सुरक्षित व गोपनीय' : isHi ? '२५६-बिट सुरक्षित एवं गोपनीय' : '256-Bit SSL Encrypted & Confidential'}</span>
                  </div>

                </form>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ─── Bottom Ticker Strip ─── */}
      <div className="bg-[#091530] border-y border-[#15274d] overflow-hidden py-3">
        <div className="flex animate-ticker whitespace-nowrap">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center gap-6 px-8 text-xs font-medium text-slate-300">
              {/* Message 1: Document requirement warning */}
              <div className="flex items-center gap-2">
                <span className="text-white font-bold text-xs bg-orange-600/30 text-orange-300 px-2 py-0.5 rounded border border-orange-500/40 uppercase tracking-wider flex items-center gap-1">
                  <FileText size={11} />
                  {isMr ? 'महत्त्वाचे!' : isHi ? 'महत्वपूर्ण!' : 'Important!'}
                </span>
                <span className="text-amber-200 font-semibold">
                  {isMr
                    ? 'फॉर्म व सर्व आवश्यक कागदपत्रे जोडल्याशिवाय अर्ज स्वीकारला जाणार नाही.'
                    : isHi
                    ? 'फॉर्म और सभी आवश्यक दस्तावेज संलग्न किए बिना आवेदन स्वीकार नहीं किया जाएगा।'
                    : 'Application will NOT be accepted without submitting the form with all required documents attached.'}
                </span>
              </div>
              <span className="text-blue-500/40">✦</span>
              {/* Message 2: Fraud warning */}
              <div className="flex items-center gap-2">
                <span className="text-white font-bold text-xs bg-red-600/20 text-red-400 px-2 py-0.5 rounded border border-red-500/30 uppercase tracking-wider">
                  {isMr ? 'सावधान!' : isHi ? 'सावधान!' : 'Beware of fraud!'}
                </span>
                <span>
                  {isMr
                    ? 'बनावट यूपीआय किंवा अनाधिकृत लिंकवर थेट बँक पेमेंट करू नका. भारत एंटरप्रायझेस इतर खात्यांवर केलेल्या पेमेंटसाठी जबाबदार नाही.'
                    : isHi
                    ? 'नकली यूपीआई या अनधिकृत लिंक पर सीधा बैंक भुगतान न करें। भारत एंटरप्राइजेज अन्य खातों में किए गए भुगतान के लिए जिम्मेदार नहीं है।'
                    : 'Do not make direct bank payments to fake UPI links or unauthorised payment links. Bharat Enterprises is not responsible for payments made to other accounts.'}
                </span>
              </div>
              <span className="text-blue-500/40">✦</span>
            </div>
          ))}
        </div>
      </div>

      {/* No repay modal - removed as per requirements */}
    </>
  );
};
