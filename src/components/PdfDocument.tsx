import React from 'react';
import { LoanFormData, COMPANY_DETAILS } from '../types';
import { Logo } from './Logo';
import { useLanguage } from '../context/LanguageContext';
import {
  User,
  Briefcase,
  IndianRupee,
  Users,
  FileText,
  ShieldCheck,
  Phone,
  Mail,
  Globe
} from 'lucide-react';

interface PdfDocumentProps {
  formData: LoanFormData;
  id?: string;
  isPrinting?: boolean;
}

export const PdfDocument: React.FC<PdfDocumentProps> = ({ formData, id = 'loan-application-document' }) => {
  const { language } = useLanguage();
  const isMr = language === 'mr';
  const isHi = language === 'hi';

  return (
    <div
      id={id}
      className="bg-white text-slate-900 border-4 border-[#0F3876] font-sans text-xs leading-tight relative select-text"
      style={{
        width: '794px',
        minWidth: '794px',
        maxWidth: '794px',
        boxSizing: 'border-box',
        padding: '20px',
        margin: '0 auto',
        backgroundColor: '#ffffff'
      }}
    >
      {/* Outer Inner Border for clean document aesthetic */}
      <div
        className="border border-[#0F3876]/40 relative flex flex-col gap-2.5"
        style={{ padding: '16px', boxSizing: 'border-box' }}
      >

        {/* Top Header Section */}
        <div className="flex flex-row items-center justify-between gap-3 border-b-2 border-[#0F3876] pb-2.5">
          {/* Logo on Left */}
          <div className="flex items-center shrink-0 w-[150px]">
            <Logo size="md" textColor="dark" />
          </div>

          {/* Title & Tagline in Center */}
          <div className="text-center flex-1 px-2">
            <h1 className="text-xl font-black text-[#0F3876] tracking-tight uppercase leading-none">
              {isMr ? COMPANY_DETAILS.marathiName : isHi ? COMPANY_DETAILS.hindiName : 'BHARAT ENTERPRISES'}
            </h1>
            {!isMr && !isHi && (
              <h2 className="text-[11px] font-bold text-[#0F3876] tracking-widest uppercase mt-0.5">
                FINANCE SERVICES
              </h2>
            )}
            <div className="inline-block bg-[#0F3876] text-white px-3 py-0.5 rounded-full text-[9px] font-bold tracking-wider uppercase mt-1">
              {isMr ? COMPANY_DETAILS.taglineMarathi : isHi ? COMPANY_DETAILS.taglineHindi : COMPANY_DETAILS.tagline}
            </div>
            <p className="text-[11px] font-extrabold text-[#D32F2F] mt-0.5 font-devanagari">
              {isMr ? COMPANY_DETAILS.sloganMarathi : isHi ? COMPANY_DETAILS.sloganHindi : COMPANY_DETAILS.sloganEnglish}
            </p>
          </div>

          {/* Application No. Box on Right */}
          <div className="flex flex-col items-end shrink-0 w-[150px]">
            <div className="border-2 border-[#0F3876] rounded px-3 py-1 text-center bg-blue-50/50 w-full">
              <span className="block text-[9px] font-bold text-slate-600 uppercase tracking-wider">
                {isMr ? 'अर्ज क्रमांक' : isHi ? 'आवेदन क्रमांक' : 'Application No.'}
              </span>
              <span className="text-xs font-black text-[#0F3876] font-mono tracking-wider">
                {formData.applicationNo || 'BEFS-2026-0001'}
              </span>
            </div>
          </div>
        </div>

        {/* Main Title Bar */}
        <div className="bg-[#0F3876] text-white py-1 px-3 rounded text-center shadow-xs">
          <h3 className="text-xs font-black tracking-wider uppercase">
            {isMr ? 'कर्ज अर्ज फॉर्म' : isHi ? 'ऋण आवेदन फॉर्म' : 'LOAN APPLICATION FORM'}
          </h3>
        </div>

        {/* 1. PERSONAL INFORMATION */}
        <div className="space-y-1">
          <div className="flex flex-row items-center gap-1.5 text-[#0F3876] font-bold text-xs border-b border-blue-200 pb-0.5">
            <div className="w-4 h-4 rounded-full bg-[#0F3876] text-white flex items-center justify-center text-[9px] shrink-0">
              <User size={10} />
            </div>
            <span className="uppercase">
              {isMr ? '१. वैयक्तिक माहिती' : isHi ? '१. व्यक्तिगत विवरण' : '1. PERSONAL INFORMATION'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-xs pt-0.5">
            <div className="flex flex-row items-end min-w-0">
              <span className="font-semibold text-slate-800 shrink-0 mr-1.5 text-[11px]">
                {isMr ? 'पूर्ण नाव :' : isHi ? 'पूरा नाम :' : 'Full Name :'}
              </span>
              <span className="flex-1 font-bold text-slate-900 border-b border-dotted border-slate-400 pb-0.5 text-[11px] truncate leading-none">
                {formData.fullName || '__________________________'}
              </span>
            </div>

            <div className="flex flex-row items-end min-w-0">
              <span className="font-semibold text-slate-800 shrink-0 mr-1.5 text-[11px]">
                {isMr ? 'वडिलांचे / पतीचे नाव :' : isHi ? 'पिता / पति का नाम :' : 'Father/Husband :'}
              </span>
              <span className="flex-1 font-bold text-slate-900 border-b border-dotted border-slate-400 pb-0.5 text-[11px] truncate leading-none">
                {formData.fatherHusbandName || '__________________________'}
              </span>
            </div>

            <div className="flex flex-row items-end min-w-0">
              <span className="font-semibold text-slate-800 shrink-0 mr-1.5 text-[11px]">
                {isMr ? 'जन्मतारीख :' : isHi ? 'जन्म तिथि :' : 'Date of Birth :'}
              </span>
              <span className="flex-1 font-medium text-slate-900 border-b border-dotted border-slate-400 pb-0.5 text-[11px] font-mono leading-none">
                {formData.dob || '__________________________'}
              </span>
            </div>

            <div className="flex flex-row items-end min-w-0">
              <span className="font-semibold text-slate-800 shrink-0 mr-1.5 text-[11px]">
                {isMr ? 'मोबाइल नंबर :' : isHi ? 'मोबाइल नंबर :' : 'Mobile Number :'}
              </span>
              <span className="flex-1 font-bold text-slate-900 border-b border-dotted border-slate-400 pb-0.5 font-mono text-[11px] leading-none">
                {formData.mobileNumber ? `+91 ${formData.mobileNumber}` : '__________________________'}
              </span>
            </div>

            <div className="flex flex-row items-end min-w-0">
              <span className="font-semibold text-slate-800 shrink-0 mr-1.5 text-[11px]">
                {isMr ? 'आधार क्रमांक :' : isHi ? 'आधार संख्या :' : 'Aadhaar Number :'}
              </span>
              <span className="flex-1 font-bold text-slate-900 border-b border-dotted border-slate-400 pb-0.5 font-mono text-[11px] tracking-wider leading-none">
                {formData.aadhaarNumber
                  ? formData.aadhaarNumber.replace(/\D/g, '').replace(/(\d{4})(\d{4})(\d{4})/, '$1 $2 $3')
                  : '__________________________'}
              </span>
            </div>

            <div className="flex flex-row items-end min-w-0">
              <span className="font-semibold text-slate-800 shrink-0 mr-1.5 text-[11px]">
                {isMr ? 'पॅन क्रमांक :' : isHi ? 'पैन संख्या :' : 'PAN Number :'}
              </span>
              <span className="flex-1 font-bold text-slate-900 border-b border-dotted border-slate-400 pb-0.5 uppercase font-mono text-[11px] tracking-wider leading-none">
                {formData.panNumber || '__________________________'}
              </span>
            </div>

            <div className="col-span-2 flex flex-row items-start min-w-0 pt-0.5">
              <span className="font-semibold text-slate-800 shrink-0 mr-1.5 text-[11px] pt-0.5">
                {isMr ? 'पूर्ण पत्ता :' : isHi ? 'पूरा पता :' : 'Full Address :'}
              </span>
              <span className="flex-1 font-medium text-slate-900 border-b border-dotted border-slate-400 pb-0.5 text-[11px] leading-snug break-words">
                {formData.fullAddress || '____________________________________________________________________________________________________'}
              </span>
            </div>
          </div>
        </div>

        {/* 2. BUSINESS INFORMATION */}
        <div className="space-y-1">
          <div className="flex flex-row items-center gap-1.5 text-[#0F3876] font-bold text-xs border-b border-blue-200 pb-0.5">
            <div className="w-4 h-4 rounded-full bg-[#0F3876] text-white flex items-center justify-center text-[9px] shrink-0">
              <Briefcase size={10} />
            </div>
            <span className="uppercase">
              {isMr ? '२. व्यवसाय माहिती' : isHi ? '२. व्यवसाय विवरण' : '2. BUSINESS INFORMATION'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-xs pt-0.5">
            <div className="flex flex-row items-end min-w-0">
              <span className="font-semibold text-slate-800 shrink-0 mr-1.5 text-[11px]">
                {isMr ? 'व्यवसायाचे / दुकानाचे नाव :' : isHi ? 'व्यवसाय / दुकान का नाम :' : 'Business Name :'}
              </span>
              <span className="flex-1 font-bold text-slate-900 border-b border-dotted border-slate-400 pb-0.5 text-[11px] truncate leading-none">
                {formData.businessName || '__________________________'}
              </span>
            </div>

            <div className="flex flex-row items-end min-w-0">
              <span className="font-semibold text-slate-800 shrink-0 mr-1.5 text-[11px]">
                {isMr ? 'व्यवसायाचा प्रकार :' : isHi ? 'व्यवसाय का प्रकार :' : 'Business Type :'}
              </span>
              <span className="flex-1 font-bold text-slate-900 border-b border-dotted border-slate-400 pb-0.5 text-[11px] truncate leading-none">
                {formData.typeOfBusiness || '__________________________'}
              </span>
            </div>

            <div className="col-span-2 flex flex-row items-start min-w-0 pt-0.5">
              <span className="font-semibold text-slate-800 shrink-0 mr-1.5 text-[11px] pt-0.5">
                {isMr ? 'व्यवसायाचा पत्ता :' : isHi ? 'व्यवसाय का पता :' : 'Business Address :'}
              </span>
              <span className="flex-1 font-medium text-slate-900 border-b border-dotted border-slate-400 pb-0.5 text-[11px] leading-snug break-words">
                {formData.businessAddress || '____________________________________________________________________________________________________'}
              </span>
            </div>

            <div className="col-span-2 flex flex-row items-end min-w-0">
              <span className="font-semibold text-slate-800 shrink-0 mr-1.5 text-[11px]">
                {isMr ? 'व्यवसायातील अनुभव :' : isHi ? 'व्यवसाय का अनुभव :' : 'Years in Business :'}
              </span>
              <span className="flex-1 font-bold text-slate-900 border-b border-dotted border-slate-400 pb-0.5 text-[11px] leading-none">
                {formData.yearsInBusiness ? (isMr ? `${formData.yearsInBusiness} वर्षे` : isHi ? `${formData.yearsInBusiness} वर्ष` : `${formData.yearsInBusiness} Years`) : '__________________________'}
              </span>
            </div>
          </div>
        </div>

        {/* 3. LOAN DETAILS */}
        <div className="space-y-1">
          <div className="flex flex-row items-center gap-1.5 text-[#0F3876] font-bold text-xs border-b border-blue-200 pb-0.5">
            <div className="w-4 h-4 rounded-full bg-[#0F3876] text-white flex items-center justify-center text-[9px] shrink-0">
              <IndianRupee size={10} />
            </div>
            <span className="uppercase">
              {isMr ? '३. कर्ज तपशील व परतफेड' : isHi ? '३. ऋण विवरण एवं पुनर्भुगतान' : '3. LOAN DETAILS & REPAYMENT'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-xs pt-0.5">
            <div className="flex flex-row items-end min-w-0">
              <span className="font-semibold text-slate-800 shrink-0 mr-1.5 text-[11px]">
                {isMr ? 'कर्ज रक्कम :' : isHi ? 'ऋण राशि :' : 'Loan Amount :'}
              </span>
              <span className="flex-1 font-black text-[#0F3876] border-b border-dotted border-slate-400 pb-0.5 font-mono text-[12px] leading-none">
                {formData.requiredLoanAmount ? `₹ ${Number(formData.requiredLoanAmount).toLocaleString('en-IN')}/-` : '₹ ____________________'}
              </span>
            </div>

            <div className="flex flex-row items-end min-w-0">
              <span className="font-semibold text-slate-800 shrink-0 mr-1.5 text-[11px]">
                {isMr ? 'प्रोसेसिंग फी (१%) :' : isHi ? 'प्रोसेसिंग शुल्क (१%) :' : 'Processing Fee (1%) :'}
              </span>
              <span className="flex-1 font-bold text-slate-900 border-b border-dotted border-slate-400 pb-0.5 font-mono text-[11px] leading-none">
                {formData.requiredLoanAmount ? `₹ ${(Number(formData.requiredLoanAmount) * 0.01).toLocaleString('en-IN')}/-` : '₹ ____________________'}
              </span>
            </div>

            <div className="col-span-2 flex flex-row items-end min-w-0">
              <span className="font-semibold text-slate-800 shrink-0 mr-1.5 text-[11px]">
                {isMr ? 'कर्जाचा हेतू :' : isHi ? 'ऋण का उद्देश्य :' : 'Purpose of Loan :'}
              </span>
              <span className="flex-1 font-bold text-slate-900 border-b border-dotted border-slate-400 pb-0.5 text-[11px] truncate leading-none">
                {formData.purposeOfLoan || (isMr ? 'व्यापार व खेळते भांडवल' : isHi ? 'व्यवसाय एवं कार्यशील पूंजी' : 'Working Capital & Business Inventory')}
              </span>
            </div>

            <div className="col-span-2 flex flex-row items-center gap-4 pt-0.5 min-w-0">
              <span className="font-semibold text-slate-800 shrink-0 text-[11px]">
                {isMr ? 'परतफेड योजना :' : isHi ? 'पुनर्भुगतान योजना :' : 'Repayment Plan :'}
              </span>
              <div className="flex flex-row items-center gap-4 text-xs font-bold text-slate-800">
                <div className="flex items-center gap-1.5">
                  <span className={`w-3.5 h-3.5 border-2 border-[#0F3876] rounded flex items-center justify-center text-[10px] font-bold ${formData.repaymentPlan === 'Daily' ? 'bg-[#0F3876] text-white' : 'bg-white'}`}>
                    {formData.repaymentPlan === 'Daily' ? '✓' : ''}
                  </span>
                  <span className="text-[11px]">{isMr ? 'दैनिक हप्ता' : isHi ? 'दैनिक किस्त' : 'Daily'}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className={`w-3.5 h-3.5 border-2 border-[#0F3876] rounded flex items-center justify-center text-[10px] font-bold ${formData.repaymentPlan === 'Weekly' ? 'bg-[#0F3876] text-white' : 'bg-white'}`}>
                    {formData.repaymentPlan === 'Weekly' ? '✓' : ''}
                  </span>
                  <span className="text-[11px]">{isMr ? 'साप्ताहिक हप्ता' : isHi ? 'साप्ताहिक किस्त' : 'Weekly'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4. GUARANTOR DETAILS */}
        <div className="space-y-1">
          <div className="flex flex-row items-center gap-1.5 text-[#0F3876] font-bold text-xs border-b border-blue-200 pb-0.5">
            <div className="w-4 h-4 rounded-full bg-[#0F3876] text-white flex items-center justify-center text-[9px] shrink-0">
              <Users size={10} />
            </div>
            <span className="uppercase">
              {isMr ? '४. जामीनदार माहिती (अनिवार्य)' : isHi ? '४. गारंटर विवरण (अनिवार्य)' : '4. GUARANTOR DETAILS (COMPULSORY)'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-xs pt-0.5">
            <div className="flex flex-row items-end min-w-0">
              <span className="font-semibold text-slate-800 shrink-0 mr-1.5 text-[11px]">
                {isMr ? 'नाव :' : isHi ? 'नाम :' : 'Guarantor Name :'}
              </span>
              <span className="flex-1 font-bold text-slate-900 border-b border-dotted border-slate-400 pb-0.5 text-[11px] truncate leading-none">
                {formData.guarantorName || '__________________________'}
              </span>
            </div>

            <div className="flex flex-row items-end min-w-0">
              <span className="font-semibold text-slate-800 shrink-0 mr-1.5 text-[11px]">
                {isMr ? 'मोबाइल :' : isHi ? 'मोबाइल :' : 'Guarantor Mobile :'}
              </span>
              <span className="flex-1 font-bold text-slate-900 border-b border-dotted border-slate-400 pb-0.5 font-mono text-[11px] leading-none">
                {formData.guarantorMobile ? `+91 ${formData.guarantorMobile}` : '__________________________'}
              </span>
            </div>

            <div className="flex flex-row items-end min-w-0">
              <span className="font-semibold text-slate-800 shrink-0 mr-1.5 text-[11px]">
                {isMr ? 'नातेसंबंध :' : isHi ? 'संबंध :' : 'Relationship :'}
              </span>
              <span className="flex-1 font-bold text-slate-900 border-b border-dotted border-slate-400 pb-0.5 text-[11px] truncate leading-none">
                {formData.guarantorRelation || '__________________________'}
              </span>
            </div>

            <div className="flex flex-row items-end min-w-0">
              <span className="font-semibold text-slate-800 shrink-0 mr-1.5 text-[11px]">
                {isMr ? 'आधार क्रमांक :' : isHi ? 'आधार संख्या :' : 'Aadhaar Number :'}
              </span>
              <span className="flex-1 font-bold text-slate-900 border-b border-dotted border-slate-400 pb-0.5 font-mono text-[11px] tracking-wider leading-none">
                {formData.guarantorAadhaar
                  ? formData.guarantorAadhaar.replace(/\D/g, '').replace(/(\d{4})(\d{4})(\d{4})/, '$1 $2 $3')
                  : '__________________________'}
              </span>
            </div>
          </div>
        </div>

        {/* 5. REQUIRED DOCUMENTS */}
        <div className="space-y-1">
          <div className="flex flex-row items-center gap-1.5 text-[#0F3876] font-bold text-xs border-b border-blue-200 pb-0.5">
            <div className="w-4 h-4 rounded-full bg-[#0F3876] text-white flex items-center justify-center text-[9px] shrink-0">
              <FileText size={10} />
            </div>
            <span className="uppercase">
              {isMr ? '५. जोडलेली कागदपत्रे' : isHi ? '५. संलग्न दस्तावेज' : '5. ATTACHED DOCUMENTS'}
            </span>
          </div>

          <div className="grid grid-cols-4 gap-2 text-xs pt-0.5 text-slate-800">
            <div className="flex items-center gap-1.5">
              <span className={`w-3.5 h-3.5 border-2 border-[#0F3876] rounded flex items-center justify-center text-[10px] font-bold ${formData.docAadhaar ? 'bg-[#0F3876] text-white' : 'bg-white'}`}>
                {formData.docAadhaar ? '✓' : ''}
              </span>
              <span className="text-[10px] leading-tight">{isMr ? 'आधार कार्ड' : isHi ? 'आधार कार्ड' : 'Aadhaar Card'}</span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className={`w-3.5 h-3.5 border-2 border-[#0F3876] rounded flex items-center justify-center text-[10px] font-bold ${formData.docPan ? 'bg-[#0F3876] text-white' : 'bg-white'}`}>
                {formData.docPan ? '✓' : ''}
              </span>
              <span className="text-[10px] leading-tight">{isMr ? 'पॅन कार्ड' : isHi ? 'पैन कार्ड' : 'PAN Card'}</span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className={`w-3.5 h-3.5 border-2 border-[#0F3876] rounded flex items-center justify-center text-[10px] font-bold ${formData.docPhoto ? 'bg-[#0F3876] text-white' : 'bg-white'}`}>
                {formData.docPhoto ? '✓' : ''}
              </span>
              <span className="text-[10px] leading-tight">{isMr ? 'पासपोर्ट फोटो' : isHi ? 'पासपोर्ट फोटो' : 'Passport Photo'}</span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className={`w-3.5 h-3.5 border-2 border-[#0F3876] rounded flex items-center justify-center text-[10px] font-bold ${formData.docBusinessProof ? 'bg-[#0F3876] text-white' : 'bg-white'}`}>
                {formData.docBusinessProof ? '✓' : ''}
              </span>
              <span className="text-[10px] leading-tight">{isMr ? 'व्यवसाय पुरावा' : isHi ? 'व्यवसाय प्रमाण' : 'Business Proof'}</span>
            </div>
          </div>
        </div>

        {/* 6. DECLARATION & SIGNATURE */}
        <div className="space-y-1">
          <div className="flex flex-row items-center gap-1.5 text-[#0F3876] font-bold text-xs border-b border-blue-200 pb-0.5">
            <div className="w-4 h-4 rounded-full bg-[#0F3876] text-white flex items-center justify-center text-[9px] shrink-0">
              <ShieldCheck size={10} />
            </div>
            <span className="uppercase">
              {isMr ? '६. हमीपत्र व स्वाक्षरी' : isHi ? '६. घोषणापत्र एवं हस्ताक्षर' : '6. DECLARATION & SIGNATURE'}
            </span>
          </div>

          <div className="text-[10px] text-slate-700 bg-slate-50 p-2 rounded border border-slate-200 space-y-0.5 leading-snug">
            {isMr ? (
              <p className="font-devanagari text-slate-800 font-medium text-[10px]">
                "मी घोषित करतो/करते की मी दिलेली वरील सर्व माहिती खरी आणि अचूक आहे. कोणतीही माहिती खोटी आढळल्यास संस्था माझा अर्ज नाकारू शकते."
              </p>
            ) : isHi ? (
              <p className="font-devanagari text-slate-800 font-medium text-[10px]">
                "मैं घोषणा करता/करती हूँ कि मेरे द्वारा दी गई उपरोक्त सभी जानकारी सत्य एवं सही है। यदि कोई भी जानकारी असत्य पाई जाती है, तो संस्था को मेरा ऋण आवेदन अस्वीकार करने का अधिकार है।"
              </p>
            ) : (
              <p className="font-medium text-[10px]">
                "I hereby declare that all the above information provided by me is true and correct. If any information found wrong, the company has the right to reject my loan application."
              </p>
            )}
          </div>

          <div className="flex flex-row items-end justify-between pt-1 text-xs">
            <div className="flex flex-col items-center">
              <div className="h-9 flex items-center justify-center">
                {formData.applicantSignature ? (
                  formData.signatureType === 'draw' && formData.applicantSignature.startsWith('data:image') ? (
                    <img src={formData.applicantSignature} alt="Applicant Signature" className="h-8 max-w-[150px] object-contain" />
                  ) : (
                    <span className="font-serif italic font-bold text-sm text-[#0F3876]">
                      {formData.applicantSignature}
                    </span>
                  )
                ) : (
                  <span className="text-slate-300 italic text-[10px]">
                    {isMr ? 'डिजिटल स्वाक्षरी' : isHi ? 'डिजिटल हस्ताक्षर' : 'Digitally Signed'}
                  </span>
                )}
              </div>
              <div className="border-t border-slate-800 pt-0.5 text-center min-w-[160px]">
                <span className="font-bold text-slate-900 block text-[11px]">
                  {isMr ? 'अर्जदाराची स्वाक्षरी' : isHi ? 'आवेदक के हस्ताक्षर' : 'Applicant Signature'}
                </span>
              </div>
            </div>

            <div className="flex flex-row items-baseline gap-1.5">
              <span className="font-bold text-slate-800 text-[11px]">
                {isMr ? 'दिनांक :' : isHi ? 'दिनांक :' : 'Date :'}
              </span>
              <span className="font-bold text-slate-900 border-b border-slate-800 min-w-[90px] text-center pb-0.5 font-mono text-[11px]">
                {formData.applicationDate || new Date().toLocaleDateString('en-GB')}
              </span>
            </div>
          </div>
        </div>

        {/* FOR OFFICE USE ONLY */}
        <div className="border-2 border-dashed border-[#0F3876] rounded p-2 bg-blue-50/40 text-[9px] space-y-1">
          <div className="text-center font-black text-[#0F3876] tracking-wider uppercase border-b border-blue-200 pb-0.5">
            {isMr ? 'केवळ कार्यालयीन उपयोगासाठी' : isHi ? 'केवल कार्यालयीन उपयोग हेतु' : 'FOR OFFICE USE ONLY'}
          </div>

          <div className="grid grid-cols-4 gap-1.5 pt-0.5 text-slate-800">
            <div>
              <span className="font-semibold text-slate-700">{isMr ? 'अर्ज क्र.:' : isHi ? 'आवेदन क्र.:' : 'App No:'}</span>{' '}
              <span className="font-bold text-[#0F3876] font-mono">{formData.applicationNo || 'BEFS-2026-0001'}</span>
            </div>
            <div>
              <span className="font-semibold text-slate-700">{isMr ? 'प्राप्त दिनांक:' : isHi ? 'प्राप्त तिथि:' : 'Received Date:'}</span>{' '}
              <span className="font-medium text-slate-900">{formData.applicationDate || '___/___/2026'}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="font-semibold text-slate-700">{isMr ? 'स्थिती:' : isHi ? 'स्थिति:' : 'Status:'}</span>
              <span className="border border-slate-500 px-1 py-0.2 rounded text-[8px]">{isMr ? '☐ मंजूर' : isHi ? '☐ स्वीकृत' : '☐ Approved'}</span>
              <span className="border border-slate-500 px-1 py-0.2 rounded text-[8px]">{isMr ? '☐ प्रलंबित' : isHi ? '☐ लंबित' : '☐ Pending'}</span>
            </div>
            <div>
              <span className="font-semibold text-slate-700">{isMr ? 'कर्ज रक्कम:' : isHi ? 'ऋण राशि:' : 'Loan Amount:'}</span>{' '}
              <span className="font-bold text-slate-900">₹ ____________</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-2 text-center text-[9px]">
            <div className="border-t border-slate-400 pt-0.5">{isMr ? 'डेस्क स्वाक्षरी' : isHi ? 'डेस्क हस्ताक्षर' : 'Desk Signature'}</div>
            <div className="border-t border-slate-400 pt-0.5">{isMr ? 'पडताळणी दिनांक' : isHi ? 'सत्यापन तिथि' : 'Verification Date'}</div>
            <div className="border-t border-slate-400 pt-0.5">{isMr ? 'शेरा / टिप्पणी' : isHi ? 'टिप्पणी' : 'Remarks / Notes'}</div>
          </div>
        </div>

        {/* Footer Blue Bar */}
        <div className="bg-[#0F3876] text-white py-1 px-3 rounded flex flex-row items-center justify-between text-[9px] gap-2">
          <div className="flex items-center gap-1 font-bold">
            <Phone size={10} className="text-yellow-400" />
            <span>{COMPANY_DETAILS.phone}</span>
          </div>
          <div className="flex items-center gap-1 font-medium text-blue-100 truncate">
            <Mail size={10} className="text-yellow-400 shrink-0" />
            <span className="truncate">{COMPANY_DETAILS.email}</span>
          </div>
          <div className="flex items-center gap-1 font-medium text-blue-200 shrink-0">
            <Globe size={10} className="text-yellow-400" />
            <span>{COMPANY_DETAILS.website}</span>
          </div>
        </div>

      </div>
    </div>
  );
};
