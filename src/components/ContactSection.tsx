import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { COMPANY_DETAILS } from '../types';
import { 
  Phone, 
  Mail, 
  MessageCircle, 
  Send, 
  CheckCircle2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useLanguage } from '../context/LanguageContext';

export const ContactSection: React.FC = () => {
  const { language, t } = useLanguage();
  const isMr = language === 'mr';
  const isHi = language === 'hi';
  const [inquiry, setInquiry] = useState({
    name: '',
    mobile: '',
    loanAmount: '45000',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiry.name || !inquiry.mobile) return;

    // Open WhatsApp inquiry
    const text = isMr
      ? `*नवीन कर्ज विचारणा - भारत एंटरप्रायझेस*%0A👤 नाव: ${encodeURIComponent(inquiry.name)}%0A📱 मोबाईल: ${encodeURIComponent(inquiry.mobile)}%0A💰 रक्कम: ₹${encodeURIComponent(inquiry.loanAmount)}%0A💬 संदेश: ${encodeURIComponent(inquiry.message || 'मला कर्ज योजनांबद्दल अधिक माहिती हवी आहे.')}`
      : isHi
      ? `*नवीन ऋण पूछताछ - भारत एंटरप्राइजेज*%0A👤 नाम: ${encodeURIComponent(inquiry.name)}%0A📱 मोबाइल: ${encodeURIComponent(inquiry.mobile)}%0A💰 राशि: ₹${encodeURIComponent(inquiry.loanAmount)}%0A💬 संदेश: ${encodeURIComponent(inquiry.message || 'मुझे ऋण योजनाओं के बारे में अधिक जानकारी चाहिए।')}`
      : `*New Loan Inquiry - Bharat Enterprises*%0A👤 Name: ${encodeURIComponent(inquiry.name)}%0A📱 Mobile: ${encodeURIComponent(inquiry.mobile)}%0A💰 Amount: ₹${encodeURIComponent(inquiry.loanAmount)}%0A💬 Message: ${encodeURIComponent(inquiry.message || 'I want more information regarding loan plans.')}`;
    window.open(`https://api.whatsapp.com/send?phone=${COMPANY_DETAILS.cleanPhone}&text=${text}`, '_blank');

    confetti({ particleCount: 50, spread: 50, origin: { y: 0.7 } });
    setSubmitted(true);
  };

  return (
    <section id="contact" className="py-10 sm:py-14 bg-slate-50 border-b border-slate-200 relative w-full max-w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 w-full">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
          <span className="text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-widest bg-white border border-slate-200 px-3 py-1 rounded">
            {t('contact.badge')}
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-2.5">
            {t('contact.title')}
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-600">
            {t('contact.sub')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Left Column: Direct Contact Information Cards */}
          <div className="lg:col-span-5 space-y-3.5 flex flex-col justify-between">
            
            {/* Primary Phone Card */}
            <div className="bg-white p-4 sm:p-5 rounded border border-slate-200 shadow-2xs flex items-start gap-4 hover:border-blue-900 transition-colors">
              <div className="p-3 rounded bg-slate-100 text-blue-900 flex items-center justify-center flex-shrink-0">
                <Phone size={20} />
              </div>
              <div className="space-y-1 flex-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  {isMr ? 'मोबाईल हेल्पलाईन व संपर्क' : isHi ? 'मोबाइल हेल्पलाइन एवं संपर्क' : 'Mobile Helpline & Desk'}
                </span>
                <p className="text-base sm:text-lg font-bold text-slate-900 font-mono">
                  {COMPANY_DETAILS.phone}
                </p>
                <div className="flex gap-3 pt-1 text-xs">
                  <a
                    href={`tel:${COMPANY_DETAILS.cleanPhone}`}
                    className="font-bold text-blue-900 hover:underline uppercase tracking-wide text-[11px]"
                  >
                    {isMr ? 'कॉल करा' : isHi ? 'कॉल करें' : 'Click to Call'}
                  </a>
                  <span className="text-slate-300">•</span>
                  <a
                    href={`https://api.whatsapp.com/send?phone=${COMPANY_DETAILS.cleanPhone}`}
                    target="_blank"
                    rel="noreferrer"
                    className="font-bold text-green-600 hover:underline uppercase tracking-wide text-[11px]"
                  >
                    {isMr ? 'व्हॉट्सॲप' : isHi ? 'व्हाट्सएप डेस्क' : 'WhatsApp Desk'}
                  </a>
                </div>
              </div>
            </div>

            {/* Email Support Card */}
            <div className="bg-white p-4 sm:p-5 rounded border border-slate-200 shadow-2xs flex items-start gap-4 hover:border-blue-900 transition-colors">
              <div className="p-3 rounded bg-slate-100 text-blue-900 flex items-center justify-center flex-shrink-0">
                <Mail size={20} />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  {isMr ? 'ईमेल सपोर्ट' : isHi ? 'ईमेल सहायता' : 'Email Support'}
                </span>
                <p className="text-sm font-bold text-slate-900">
                  <a href={`mailto:${COMPANY_DETAILS.email}`} className="hover:text-blue-600 transition-colors">
                    {COMPANY_DETAILS.email}
                  </a>
                </p>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {isMr ? 'तुमचे प्रश्न थेट आमच्या टीमला पाठवा' : isHi ? 'अपने प्रश्न सीधे हमारी टीम को भेजें' : 'Send your loan questions directly to our team'}
                </p>
              </div>
            </div>

            {/* Direct WhatsApp Callout Banner */}
            <div className="bg-blue-900 text-white p-5 rounded border border-blue-800 space-y-2.5 shadow-sm">
              <div className="flex items-center gap-2">
                <MessageCircle size={18} className="text-green-400" />
                <span className="font-bold text-xs uppercase tracking-wider">
                  {isMr ? 'थेट व्हॉट्सॲप सहाय्य' : isHi ? 'सीधी व्हाट्सएप सहायता' : 'Direct WhatsApp Assistance'}
                </span>
              </div>
              <p className="text-xs text-blue-200 leading-relaxed">
                {isMr
                  ? 'कर्ज पात्रतेसाठी किंवा अर्ज सादर करण्यासाठी आमच्याशी व्हॉट्सॲपवर संपर्क साधा.'
                  : isHi
                  ? 'ऋण पात्रता अथवा आवेदन जमा करने हेतु हमसे व्हाट्सएप पर संपर्क करें।'
                  : 'Connect with our team on WhatsApp to check your loan eligibility or submit your loan application.'}
              </p>
              <a
                href={`https://api.whatsapp.com/send?phone=${COMPANY_DETAILS.cleanPhone}&text=Hello%20Bharat%20Enterprises,%20I%20want%20to%20apply%20for%20a%20loan`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 w-full py-2.5 bg-green-600 hover:bg-green-700 text-white font-bold text-xs rounded transition-colors uppercase tracking-wider"
              >
                <MessageCircle size={15} />
                <span>{isMr ? 'व्हॉट्सॲप मेसेज करा' : isHi ? 'व्हाट्सएप संदेश भेजें' : 'WhatsApp Us'} ({COMPANY_DETAILS.phone})</span>
              </a>
            </div>

          </div>

          {/* Right Column: Quick Callback & Inquiry Form */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-7 rounded border border-slate-200 shadow-2xs flex flex-col justify-between">
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                {isMr ? 'त्वरित चौकशी' : isHi ? 'त्वरित पूछताछ' : 'Quick Inquiries'}
              </span>
              <h3 className="text-lg font-bold text-slate-900">
                {t('contact.sendInquiry')}
              </h3>
              <p className="text-xs text-slate-500 mt-1 mb-6">
                {isMr
                  ? 'तुमचा संपर्क आणि कर्जाची गरज नोंदवा. आमची टीम लवकरच संपर्क करेल.'
                  : isHi
                  ? 'अपना संपर्क विवरण और ऋण आवश्यकता दर्ज करें। हमारी टीम शीघ्र ही संपर्क करेगी।'
                  : 'Leave your contact details and loan requirement. Our team will contact you promptly.'}
              </p>

              {submitted ? (
                <div className="p-6 bg-slate-50 border border-slate-200 rounded text-center space-y-3">
                  <CheckCircle2 size={32} className="text-green-600 mx-auto" />
                  <h4 className="text-sm font-bold text-slate-900">
                    {isMr ? 'व्हॉट्सॲपद्वारे चौकशी पाठवली!' : isHi ? 'व्हाट्सएप द्वारा पूछताछ भेजी गई!' : 'Inquiry Sent via WhatsApp!'}
                  </h4>
                  <p className="text-xs text-slate-600">
                    {isMr
                      ? 'धन्यवाद! आम्हाला तुमची विनंती प्राप्त झाली आहे. कर्ज प्रक्रियेसाठी तुम्ही संपूर्ण अर्ज देखील भरू शकता.'
                      : isHi
                      ? 'धन्यवाद! हमें आपका अनुरोध प्राप्त हो गया है। ऋण स्वीकृति हेतु आप संपूर्ण ऑनलाइन आवेदन भी भर सकते हैं।'
                      : 'Thank you! We have received your request. You can also fill the complete signed application form to get your loan processed immediately.'}
                  </p>
                  <div className="pt-2">
                    <Link
                      to="/apply"
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0b254a] hover:bg-blue-900 text-white text-xs font-bold rounded uppercase tracking-wider transition-colors"
                    >
                      {isMr ? 'ऑनलाइन कर्ज अर्ज करा' : isHi ? 'ऑनलाइन ऋण आवेदन करें' : 'Apply for Loan Online'}
                    </Link>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                        {isMr ? 'पूर्ण नाव' : isHi ? 'पूरा नाम' : 'Your Full Name'} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={inquiry.name}
                        onChange={(e) => setInquiry({ ...inquiry, name: e.target.value })}
                        placeholder={isMr ? 'उदा. रमेश पाटील' : isHi ? 'उदा. रमेश कुमार' : 'E.g. Ramesh Patil'}
                        className="w-full px-3.5 py-3 sm:py-2.5 rounded-lg border border-slate-200 text-base sm:text-sm focus:ring-2 focus:ring-blue-900/30 focus:border-blue-900 outline-none min-h-[44px]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                        {isMr ? 'मोबाईल नंबर' : isHi ? 'मोबाइल नंबर' : 'Mobile Number'} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        maxLength={10}
                        inputMode="tel"
                        pattern="[0-9]*"
                        autoComplete="tel"
                        value={inquiry.mobile}
                        onChange={(e) => setInquiry({ ...inquiry, mobile: e.target.value })}
                        placeholder={isMr ? '१० अंकी मोबाईल नंबर' : isHi ? '१० अंकों का मोबाइल नंबर' : '10-digit number'}
                        className="w-full px-3.5 py-3 sm:py-2.5 rounded-lg border border-slate-200 text-base sm:text-sm focus:ring-2 focus:ring-blue-900/30 focus:border-blue-900 outline-none font-mono min-h-[44px]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                      {isMr ? 'अपेक्षित कर्ज रक्कम' : isHi ? 'अपेक्षित ऋण राशि' : 'Expected Loan Amount'}
                    </label>
                    <select
                      value={inquiry.loanAmount}
                      onChange={(e) => setInquiry({ ...inquiry, loanAmount: e.target.value })}
                      className="w-full px-3.5 py-3 sm:py-2.5 rounded-lg border border-slate-200 text-base sm:text-sm focus:ring-2 focus:ring-blue-900/30 focus:border-blue-900 outline-none bg-white font-mono min-h-[44px]"
                    >
                      <option value="9000">{isMr ? '₹ ९,०००/- (रु. १००/दिवस हप्ता)' : isHi ? '₹ ९,०००/- (रु. १००/दिन किस्त)' : '₹ 9,000/- (Rs. 100/day EMI)'}</option>
                      <option value="18000">{isMr ? '₹ १८,०००/- (रु. २००/दिवस हप्ता)' : isHi ? '₹ १८,०००/- (रु. २००/दिन किस्त)' : '₹ 18,000/- (Rs. 200/day EMI)'}</option>
                      <option value="27000">{isMr ? '₹ २७,०००/- (रु. ३००/दिवस हप्ता)' : isHi ? '₹ २७,०००/- (रु. ३००/दिन किस्त)' : '₹ 27,000/- (Rs. 300/day EMI)'}</option>
                      <option value="36000">{isMr ? '₹ ३६,०००/- (रु. ४००/दिवस हप्ता)' : isHi ? '₹ ३६,०००/- (रु. ४००/दिन किस्त)' : '₹ 36,000/- (Rs. 400/day EMI)'}</option>
                      <option value="45000">{isMr ? '₹ ४५,०००/- (रु. ५००/दिवस हप्ता)' : isHi ? '₹ ४५,०००/- (रु. ५००/दिन किस्त)' : '₹ 45,000/- (Rs. 500/day EMI)'}</option>
                      <option value="54000">{isMr ? '₹ ५४,०००/- (रु. ६००/दिवस हप्ता)' : isHi ? '₹ ५४,०००/- (रु. ६००/दिन किस्त)' : '₹ 54,000/- (Rs. 600/day EMI)'}</option>
                      <option value="63000">{isMr ? '₹ ६३,०००/- (रु. ७००/दिवस हप्ता)' : isHi ? '₹ ६३,०००/- (रु. ७००/दिन किस्त)' : '₹ 63,000/- (Rs. 700/day EMI)'}</option>
                      <option value="72000">{isMr ? '₹ ७२,०००/- (रु. ८००/दिवस हप्ता)' : isHi ? '₹ ७२,०००/- (रु. ८००/दिन किस्त)' : '₹ 72,000/- (Rs. 800/day EMI)'}</option>
                      <option value="81000">{isMr ? '₹ ८१,०००/- (रु. ९००/दिवस हप्ता)' : isHi ? '₹ ८१,०००/- (रु. ९००/दिन किस्त)' : '₹ 81,000/- (Rs. 900/day EMI)'}</option>
                      <option value="90000">{isMr ? '₹ ९०,०००/- (रु. १,०००/दिवस हप्ता)' : isHi ? '₹ ९०,०००/- (रु. १,०००/दिन किस्त)' : '₹ 90,000/- (Rs. 1,000/day EMI)'}</option>
                      <option value="180000">{isMr ? '₹ १,८०,०००/- (रु. २,०००/दिवस हप्ता)' : isHi ? '₹ १,८०,०००/- (रु. २,०००/दिन किस्त)' : '₹ 1,80,000/- (Rs. 2,000/day EMI)'}</option>
                      <option value="270000">{isMr ? '₹ २,७०,०००/- (रु. ३,०००/दिवस हप्ता)' : isHi ? '₹ २,७०,०००/- (रु. ३,०००/दिन किस्त)' : '₹ 2,70,000/- (Rs. 3,000/day EMI)'}</option>
                      <option value="360000">{isMr ? '₹ ३,६०,०००/- (रु. ४,०००/दिवस हप्ता)' : isHi ? '₹ ३,६०,०००/- (रु. ४,०००/दिन किस्त)' : '₹ 3,60,000/- (Rs. 4,000/day EMI)'}</option>
                      <option value="450000">{isMr ? '₹ ४,५०,०००/- (रु. ५,०००/दिवस हप्ता)' : isHi ? '₹ ४,५०,०००/- (रु. ५,०००/दिन किस्त)' : '₹ 4,50,000/- (Rs. 5,000/day EMI)'}</option>
                      <option value="Custom">{isMr ? 'इतर सानुकूल रक्कम' : isHi ? 'अन्य अनुकूलित राशि' : 'Other Custom Amount'}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                      {isMr ? 'व्यवसाय तपशील / संदेश (पर्यायी)' : isHi ? 'व्यवसाय विवरण / संदेश (वैकल्पिक)' : 'Message / Business Details (Optional)'}
                    </label>
                    <textarea
                      rows={3}
                      value={inquiry.message}
                      onChange={(e) => setInquiry({ ...inquiry, message: e.target.value })}
                      placeholder={isMr ? 'तुमच्या दुकानाबद्दल किंवा कर्जाच्या हेतूबद्दल सांगा...' : isHi ? 'अपनी दुकान या ऋण के उद्देश्य के बारे में बताएं...' : 'Tell us about your shop or purpose of loan...'}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-base sm:text-sm focus:ring-2 focus:ring-blue-900/30 focus:border-blue-900 outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 sm:py-3 bg-[#0b254a] hover:bg-blue-900 text-white rounded-lg font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all min-h-[44px] cursor-pointer hover:scale-[1.01]"
                  >
                    <Send size={15} />
                    <span>{isMr ? 'कर्ज विचारणा पाठवा' : isHi ? 'ऋण पूछताछ भेजें' : 'Send Loan Inquiry'}</span>
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
