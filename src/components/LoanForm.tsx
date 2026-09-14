import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LoanFormData, UploadDocFile, COMPANY_DETAILS, LOAN_PLANS } from '../types';
import { PdfDocument } from './PdfDocument';
import { SignaturePad } from './SignaturePad';
import { toJpeg } from 'html-to-image';
import { jsPDF } from 'jspdf';
import confetti from 'canvas-confetti';
import {
  Send,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  MessageCircle,
  AlertCircle,
  User,
  Briefcase,
  IndianRupee,
  Users,
  FileText,
  ShieldCheck,
  Check,
  Building2,
  Phone,
  X,
  ArrowLeft,
  ArrowRight,
  Banknote,
  Percent,
  CreditCard,
  Lock,
  Sparkles,
  Mail,
  Upload,
  Camera,
  Trash2,
  FileUp,
  Loader2,
  Image as ImageIcon,
  FolderCheck,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { formatPhoneNumber, getRawPhoneNumber, isValidMobileNumber } from '../utils/phoneUtils';
import { processFileForUpload, formatFileSize, validateFileSize } from '../utils/fileUtils';

// ─── Google Sheets & Google Drive Integration (via Apps Script Web App) ────
// After deploying your Apps Script, replace the placeholder with the Web App URL,
// or set VITE_GOOGLE_SCRIPT_URL in your .env file.
const GOOGLE_SHEET_SCRIPT_URL =
  (import.meta as any).env?.VITE_GOOGLE_SCRIPT_URL ||
  'https://script.google.com/macros/s/AKfycbwj8Dp828dlJ0r-ksJjYEAW6_DjLLgVisifj01bb1YOmp0j4D7uLg07nVuMtZaDxqri/exec';

async function submitToGoogleSheets(
  data: LoanFormData,
  language: string
): Promise<{ success: boolean; folderUrl?: string }> {
  const endpoint =
    (import.meta as any).env?.VITE_GOOGLE_SCRIPT_URL || GOOGLE_SHEET_SCRIPT_URL;

  if (!endpoint || endpoint === 'YOUR_GOOGLE_SCRIPT_URL_HERE') {
    return { success: false };
  }

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' }, // text/plain avoids CORS preflight with Apps Script
      body: JSON.stringify({
        ...data,
        language,
        aadhaarDoc: data.aadhaarDoc || null,
        panDoc: data.panDoc || null,
        photoDoc: data.photoDoc || null,
        businessProofDoc: data.businessProofDoc || null,
        applicationPdfDoc: data.applicationPdfDoc || null,
      }),
    });

    const json = await res.json().catch(() => null);
    return {
      success: true,
      folderUrl: json?.folderUrl,
    };
  } catch (err) {
    console.error('Save to Google Sheets & Drive failed:', err);
    return { success: false };
  }
}

// ─── Unique Timestamp-Based Application ID ──────────────────────────────────
// Format: BEFS-YYYYMMDD-HHMMSS (e.g. BEFS-20260914-173845)
// Every submission gets a strictly unique ID based on the date and time.
function generateTimestampAppId(): string {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const hh = String(now.getHours()).padStart(2, '0');
  const min = String(now.getMinutes()).padStart(2, '0');
  const ss = String(now.getSeconds()).padStart(2, '0');
  return `BEFS-${yyyy}${mm}${dd}-${hh}${min}${ss}`;
}

function getOrCreateAppId(): string {
  // Always generate a brand new timestamp ID for each new application
  return generateTimestampAppId();
}

// ─── Step Config (6 Distinct Steps for Application Form) ─────────────────────
interface Step {
  id: number;
  icon: React.ReactNode;
  titleMr: string;
  titleHi: string;
  titleEn: string;
}

const STEPS: Step[] = [
  { id: 1, icon: <User size={16} />, titleMr: 'वैयक्तिक माहिती', titleHi: 'व्यक्तिगत जानकारी', titleEn: 'Personal Details' },
  { id: 2, icon: <Briefcase size={16} />, titleMr: 'व्यवसाय माहिती', titleHi: 'व्यवसाय विवरण', titleEn: 'Business Info' },
  { id: 3, icon: <IndianRupee size={16} />, titleMr: 'कर्ज तपशील', titleHi: 'ऋण विवरण', titleEn: 'Loan Details' },
  { id: 4, icon: <Users size={16} />, titleMr: 'जामीनदार', titleHi: 'गारंटर विवरण', titleEn: 'Guarantor' },
  { id: 5, icon: <FileText size={16} />, titleMr: 'कागदपत्रे', titleHi: 'दस्तावेज़', titleEn: 'Documents' },
  { id: 6, icon: <ShieldCheck size={16} />, titleMr: 'घोषणा व स्वाक्षरी', titleHi: 'घोषणा एवं हस्ताक्षर', titleEn: 'Declaration & Signature' },
];

// ─── Field Component ──────────────────────────────────────────────────────────
interface FieldProps {
  label: string;
  sublabel?: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}
const Field: React.FC<FieldProps> = ({ label, sublabel, required, error, children }) => (
  <div className="space-y-1.5 text-left">
    <label className="block">
      <span className="text-xs font-semibold text-slate-200">
        {label}{required && <span className="text-red-400 ml-1">*</span>}
      </span>
      {sublabel && <span className="block text-[10px] text-slate-400 font-devanagari mt-0.5">{sublabel}</span>}
    </label>
    {children}
    {error && (
      <p className="text-[11px] text-red-400 flex items-center gap-1 mt-1 font-medium">
        <AlertCircle size={12} /> {error}
      </p>
    )}
  </div>
);

const inputCls = (error?: string) =>
  `w-full px-4 py-3 rounded-xl border text-sm font-medium text-white outline-none transition-all placeholder:text-slate-500 bg-[#192744] min-h-[46px] ${error
    ? 'border-red-400 bg-red-950/20 focus:ring-1 focus:ring-red-400'
    : 'border-[#263c68] hover:border-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
  }`;

// ─── Props ─────────────────────────────────────────────────────────────────
interface LoanFormProps {
  initialName?: string;
  initialMobile?: string;
  initialPan?: string;
  initialAmount?: number;
  initialPlan?: 'Daily' | 'Weekly';
}

export const LoanForm: React.FC<LoanFormProps> = ({
  initialName,
  initialMobile,
  initialPan,
  initialAmount,
  initialPlan,
}) => {
  const { language } = useLanguage();
  const isMr = language === 'mr';
  const isHi = language === 'hi';
  const navigate = useNavigate();

  // Retrieve saved session data if props not passed directly
  const savedName = initialName || (() => {
    try { return sessionStorage.getItem('befs_initial_name') || ''; } catch { return ''; }
  })();
  const savedMobile = formatPhoneNumber(initialMobile || (() => {
    try { return sessionStorage.getItem('befs_initial_mobile') || ''; } catch { return ''; }
  })());
  const savedPan = initialPan || (() => {
    try { return sessionStorage.getItem('befs_initial_pan') || ''; } catch { return ''; }
  })();

  const [currentStep, setCurrentStep] = useState(1);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null);
  const [generatedPdfFileName, setGeneratedPdfFileName] = useState('');
  const [whatsAppDirectUrl, setWhatsAppDirectUrl] = useState('');
  const [statusMsg, setStatusMsg] = useState('');

  // Submitted application state
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [hasOpenedWhatsApp, setHasOpenedWhatsApp] = useState(false);

  // Document upload & Google Drive states
  const [uploadingDocKey, setUploadingDocKey] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [driveFolderUrl, setDriveFolderUrl] = useState<string | null>(null);
  const [cloudSaveStatus, setCloudSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [skipUploadToWhatsApp, setSkipUploadToWhatsApp] = useState(false);

  const [formData, setFormData] = useState<LoanFormData>(() => ({
    applicationNo: getOrCreateAppId(),
    fullName: savedName || '',
    fatherHusbandName: '',
    dob: '',
    mobileNumber: savedMobile || '',
    aadhaarNumber: '',
    panNumber: savedPan || '',
    fullAddress: '',
    businessName: '',
    typeOfBusiness: '',
    businessAddress: '',
    yearsInBusiness: '',
    requiredLoanAmount: initialAmount ? initialAmount.toString() : '45000',
    purposeOfLoan: '',
    repaymentPlan: initialPlan || 'Daily',
    guarantorName: '',
    guarantorMobile: '',
    guarantorAadhaar: '',
    guarantorRelation: '',
    docAadhaar: false,
    docPan: false,
    docPhoto: false,
    docBusinessProof: false,
    aadhaarDoc: null,
    panDoc: null,
    photoDoc: null,
    businessProofDoc: null,
    declarationAccepted: false,
    applicantSignature: '',
    signatureType: 'draw',
    applicationDate: new Date().toLocaleDateString('en-GB'),
  }));

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    docKey: 'aadhaarDoc' | 'panDoc' | 'photoDoc' | 'businessProofDoc',
    flagKey: 'docAadhaar' | 'docPan' | 'docPhoto' | 'docBusinessProof'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const sizeCheck = validateFileSize(file, 12);
    if (!sizeCheck.valid) {
      setUploadError(sizeCheck.error || 'File size too large (max 12MB)');
      return;
    }

    setUploadingDocKey(docKey);
    setUploadError(null);

    try {
      const processed = await processFileForUpload(file);
      setFormData(prev => ({
        ...prev,
        [docKey]: processed,
        [flagKey]: true,
      }));

      if (formErrors[docKey]) {
        setFormErrors(prev => {
          const u = { ...prev };
          delete u[docKey];
          return u;
        });
      }
    } catch (err) {
      console.error('File upload error:', err);
      setUploadError(
        isMr
          ? 'कागदपत्र अपलोड करताना त्रुटी आली. कृपया पुन्हा प्रयत्न करा.'
          : isHi
          ? 'दस्तावेज़ अपलोड करते समय त्रुटि आई। कृपया पुनः प्रयास करें।'
          : 'Failed to process document file. Please try again.'
      );
    } finally {
      setUploadingDocKey(null);
      e.target.value = '';
    }
  };

  const handleRemoveDoc = (
    docKey: 'aadhaarDoc' | 'panDoc' | 'photoDoc' | 'businessProofDoc',
    flagKey: 'docAadhaar' | 'docPan' | 'docPhoto' | 'docBusinessProof'
  ) => {
    setFormData(prev => ({
      ...prev,
      [docKey]: null,
      [flagKey]: false,
    }));
  };

  useEffect(() => {
    if (initialName) setFormData(prev => ({ ...prev, fullName: initialName }));
    if (initialMobile) setFormData(prev => ({ ...prev, mobileNumber: formatPhoneNumber(initialMobile) }));
    if (initialPan) setFormData(prev => ({ ...prev, panNumber: initialPan }));
    if (initialAmount) setFormData(prev => ({ ...prev, requiredLoanAmount: initialAmount.toString() }));
    if (initialPlan) setFormData(prev => ({ ...prev, repaymentPlan: initialPlan }));
  }, [initialName, initialMobile, initialPan, initialAmount, initialPlan]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormData(prev => ({ ...prev, [name]: val }));
    if (formErrors[name]) setFormErrors(prev => { const u = { ...prev }; delete u[name]; return u; });
  };

  const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setFormData(prev => ({ ...prev, mobileNumber: formatted }));
    if (formErrors.mobileNumber) setFormErrors(prev => { const u = { ...prev }; delete u.mobileNumber; return u; });
  };

  const handleGuarantorMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setFormData(prev => ({ ...prev, guarantorMobile: formatted }));
    if (formErrors.guarantorMobile) setFormErrors(prev => { const u = { ...prev }; delete u.guarantorMobile; return u; });
  };

  const formatAadhaar = (raw: string): string => {
    const digits = raw.replace(/\D/g, '').slice(0, 12);
    return digits.replace(/(\d{4})(\d{0,4})(\d{0,4})/, (_m, a, b, c) =>
      [a, b, c].filter(Boolean).join(' ')
    );
  };

  const handleAadhaarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatAadhaar(e.target.value);
    setFormData(prev => ({ ...prev, aadhaarNumber: formatted }));
    if (formErrors.aadhaarNumber) setFormErrors(prev => { const u = { ...prev }; delete u.aadhaarNumber; return u; });
  };

  const handleSignatureChange = (sig: string, type: 'draw' | 'type') => {
    setFormData(prev => ({ ...prev, applicantSignature: sig, signatureType: type }));
    if (formErrors.applicantSignature) setFormErrors(prev => { const u = { ...prev }; delete u.applicantSignature; return u; });
  };

  // ── Validate current step ────────────────────────────────────────────────
  const validateStep = (step: number): boolean => {
    const errors: Record<string, string> = {};

    // STEP 1: Personal Details
    if (step === 1) {
      if (!formData.fullName.trim()) errors.fullName = isMr ? 'पूर्ण नाव आवश्यक आहे' : isHi ? 'पूरा नाम अनिवार्य है' : 'Full name is required';
      if (!formData.fatherHusbandName.trim()) errors.fatherHusbandName = isMr ? 'वडिलांचे / पतीचे नाव आवश्यक आहे' : isHi ? 'पिता / पति का नाम अनिवार्य है' : 'Father / Husband name is required';
      if (!formData.dob) errors.dob = isMr ? 'जन्मतारीख आवश्यक आहे' : isHi ? 'जन्म तिथि अनिवार्य है' : 'Date of birth is required';
      if (!isValidMobileNumber(formData.mobileNumber))
        errors.mobileNumber = isMr ? 'वैध १० अंकी मोबाइल नंबर आवश्यक आहे (६-९ ने सुरू होणारा)' : isHi ? 'मान्य १० अंकों का मोबाइल नंबर अनिवार्य है (६-९ से शुरू होने वाला)' : 'Valid 10-digit mobile number required (starts with 6-9)';
      if (!formData.aadhaarNumber.trim() || formData.aadhaarNumber.replace(/\s+/g, '').length < 12)
        errors.aadhaarNumber = isMr ? '१२ अंकी आधार कार्ड नंबर आवश्यक आहे' : isHi ? '१२ अंकों का आधार नंबर अनिवार्य है' : 'Valid 12-digit Aadhaar number is required';

      const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
      if (!formData.panNumber.trim()) {
        errors.panNumber = isMr ? 'पॅन नंबर आवश्यक आहे' : isHi ? 'पैन नंबर अनिवार्य है' : 'PAN number is required';
      } else if (formData.panNumber.length !== 10 || !panRegex.test(formData.panNumber)) {
        errors.panNumber = isMr ? 'वैध १० अंकी पॅन कार्ड आवश्यक आहे' : isHi ? 'मान्य १० अक्षरों का पैन कार्ड अनिवार्य है' : 'Valid 10-character PAN required';
      }
      if (!formData.fullAddress.trim()) errors.fullAddress = isMr ? 'रहिवासी पत्ता आवश्यक आहे' : isHi ? 'आवासीय पता अनिवार्य है' : 'Residential address is required';
    }

    // STEP 2: Business Info
    if (step === 2) {
      if (!formData.businessName.trim()) errors.businessName = isMr ? 'व्यवसायाचे नाव आवश्यक आहे' : isHi ? 'व्यवसाय का नाम अनिवार्य है' : 'Business name is required';
      if (!formData.typeOfBusiness.trim()) errors.typeOfBusiness = isMr ? 'व्यवसाय प्रकार आवश्यक आहे' : isHi ? 'व्यवसाय का प्रकार अनिवार्य है' : 'Type of business is required';
      if (!formData.businessAddress.trim()) errors.businessAddress = isMr ? 'व्यवसायाचा पत्ता आवश्यक आहे' : isHi ? 'व्यवसाय का पता अनिवार्य है' : 'Business address is required';
    }

    // STEP 3: Loan Details
    if (step === 3) {
      if (!formData.requiredLoanAmount) errors.requiredLoanAmount = isMr ? 'कर्ज रक्कम निवडा' : isHi ? 'ऋण राशि चुनें' : 'Loan amount is required';
      if (!formData.repaymentPlan) errors.repaymentPlan = isMr ? 'परतफेड योजना निवडा' : isHi ? 'पुनर्भुगतान योजना चुनें' : 'Select a repayment plan';
    }

    // STEP 4: Guarantor Details (Compulsory)
    if (step === 4) {
      if (!formData.guarantorName.trim()) errors.guarantorName = isMr ? 'जामीनदाराचे पूर्ण नाव आवश्यक आहे' : isHi ? 'गारंटर का पूरा नाम अनिवार्य है' : 'Guarantor full name is required';
      if (!isValidMobileNumber(formData.guarantorMobile))
        errors.guarantorMobile = isMr ? 'जामीनदाराचा वैध १० अंकी मोबाइल आवश्यक आहे (६-९ ने सुरू होणारा)' : isHi ? 'गारंटर का मान्य १० अंकों का मोबाइल नंबर अनिवार्य है (६-९ से शुरू होने वाला)' : 'Valid 10-digit guarantor mobile is required (starts with 6-9)';
      if (!formData.guarantorAadhaar.trim() || formData.guarantorAadhaar.replace(/\s+/g, '').length < 12)
        errors.guarantorAadhaar = isMr ? 'जामीनदाराचा १२ अंकी आधार नंबर आवश्यक आहे' : isHi ? 'गारंटर का १२ अंकों का आधार नंबर अनिवार्य है' : 'Valid 12-digit guarantor Aadhaar is required';
      if (!formData.guarantorRelation.trim()) errors.guarantorRelation = isMr ? 'नातेसंबंध आवश्यक आहे' : isHi ? 'गारंटर से संबंध अनिवार्य है' : 'Relation with guarantor is required';
    }

    // STEP 5: Required Documents
    if (step === 5) {
      if (!skipUploadToWhatsApp) {
        if (!formData.aadhaarDoc) {
          errors.aadhaarDoc = isMr
            ? 'आधार कार्ड प्रत (फोटो किंवा PDF) अपलोड करा'
            : isHi
            ? 'आधार कार्ड प्रति (फोटो या पीडीएफ) अपलोड करें'
            : 'Please upload Aadhaar card copy (photo or PDF)';
        }
        if (!formData.panDoc) {
          errors.panDoc = isMr
            ? 'पॅन कार्ड प्रत (फोटो किंवा PDF) अपलोड करा'
            : isHi
            ? 'पैन कार्ड प्रति (फोटो या पीडीएफ) अपलोड करें'
            : 'Please upload PAN card copy (photo or PDF)';
        }
      }
    }

    // STEP 6: Declaration & Signature
    if (step === 6) {
      if (!formData.declarationAccepted) errors.declarationAccepted = isMr ? 'कृपया घोषणा स्वीकार करा' : isHi ? 'कृपया घोषणा स्वीकार करें' : 'Please accept the declaration';
      if (!formData.applicantSignature) errors.applicantSignature = isMr ? 'स्वाक्षरी आवश्यक आहे' : isHi ? 'हस्ताक्षर अनिवार्य हैं' : 'Signature is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(s => Math.min(s + 1, 6));
      const el = document.getElementById('application-form-card');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    setCurrentStep(s => Math.max(s - 1, 1));
    const el = document.getElementById('application-form-card');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  // ── PDF Generation ───────────────────────────────────────────────────────
  const triggerDownload = (blob: Blob, fileName: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = fileName;
    document.body.appendChild(a); a.click();
    setTimeout(() => document.body.removeChild(a), 800);
  };

  const generatePdf = async () => {
    const cleanName = formData.fullName.trim().replace(/[^a-zA-Z0-9]/g, '_') || 'Applicant';
    const fileName = `BharatEnterprises_LoanApplication_${cleanName}_${formData.applicationNo}.pdf`;
    if (document.fonts?.ready) await document.fonts.ready;
    await new Promise(r => setTimeout(r, 200));
    const el = document.getElementById('offscreen-pdf-render-target') || document.getElementById('official-form-offscreen-view');
    if (!el) throw new Error('Render target not found');

    const imgDataUrl = await toJpeg(el, {
      quality: 0.95,
      pixelRatio: 2,
      backgroundColor: '#ffffff',
      cacheBust: true,
      width: 794,
    });

    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const pageW = pdf.internal.pageSize.getWidth();
    const pageH = pdf.internal.pageSize.getHeight();
    const margin = 5;
    const maxW = pageW - margin * 2;
    const maxH = pageH - margin * 2;

    let finalW = maxW;
    let finalH = (el.offsetHeight * maxW) / (el.offsetWidth || 794);
    let offsetX = margin;
    let offsetY = margin;

    if (finalH > maxH) {
      finalW = (finalW * maxH) / finalH;
      finalH = maxH;
      offsetX = (pageW - finalW) / 2;
    } else {
      offsetY = (pageH - finalH) / 2;
    }

    pdf.addImage(imgDataUrl, 'JPEG', offsetX, offsetY, finalW, finalH);
    const blob = pdf.output('blob');
    const blobUrl = URL.createObjectURL(blob);
    const pdfDataUri = pdf.output('datauristring');
    setGeneratedPdfFileName(fileName);
    setPdfBlobUrl(blobUrl);
    return { blob, fileName, blobUrl, pdfDataUri };
  };

  // ── Submit ───────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!validateStep(6)) return;
    setIsGeneratingPdf(true);
    setStatusMsg(isMr ? 'अर्ज प्रक्रिया सुरू आहे...' : isHi ? 'आवेदन प्रक्रिया प्रगति पर है...' : 'Processing loan application...');

    const emiText = isMr
      ? (formData.repaymentPlan === 'Daily'
          ? `₹ ${(Number(formData.requiredLoanAmount) / 90).toFixed(0)} / दिवस (१०० दिवस)`
          : `₹ ${((Number(formData.requiredLoanAmount) / 90) * 7).toFixed(0)} / आठवडा (१४ आठवडे २ दिवस)`)
      : isHi
      ? (formData.repaymentPlan === 'Daily'
          ? `₹ ${(Number(formData.requiredLoanAmount) / 90).toFixed(0)} / दिन (१०० दिन)`
          : `₹ ${((Number(formData.requiredLoanAmount) / 90) * 7).toFixed(0)} / सप्ताह (१४ सप्ताह २ दिन)`)
      : (formData.repaymentPlan === 'Daily'
          ? `₹ ${(Number(formData.requiredLoanAmount) / 90).toFixed(0)} / day (100 days)`
          : `₹ ${((Number(formData.requiredLoanAmount) / 90) * 7).toFixed(0)} / week (14 weeks 2 days)`);

    const message = isMr
      ? `*कर्ज अर्ज — भारत एंटरप्राइजेस*
---
अर्ज क्रमांक: ${formData.applicationNo}
तारीख: ${formData.applicationDate}
अर्जदार: ${formData.fullName}
मोबाइल: ${formData.mobileNumber}
पॅन: ${formData.panNumber}
पत्ता: ${formData.fullAddress || '-'}
व्यवसाय: ${formData.businessName || 'व्यवसाय'} (${formData.typeOfBusiness || 'व्यवसाय'})
कर्ज रक्कम: रु. ${Number(formData.requiredLoanAmount).toLocaleString('en-IN')}/-
परतफेड योजना: ${formData.repaymentPlan === 'Daily' ? 'दैनिक' : 'साप्ताहिक'} (${emiText})
---
नमस्कार, मी माझा कर्ज अर्ज सादर केला आहे.
संपर्क: ${COMPANY_DETAILS.phone}`
      : isHi
      ? `*ऋण आवेदन — भारत एंटरप्राइजेज*
---
आवेदन क्रमांक: ${formData.applicationNo}
तारीख: ${formData.applicationDate}
आवेदक: ${formData.fullName}
मोबाइल: ${formData.mobileNumber}
पैन: ${formData.panNumber}
पता: ${formData.fullAddress || '-'}
व्यवसाय: ${formData.businessName || 'व्यवसाय'} (${formData.typeOfBusiness || 'व्यवसाय'})
ऋण राशि: रु. ${Number(formData.requiredLoanAmount).toLocaleString('en-IN')}/-
पुनर्भुगतान योजना: ${formData.repaymentPlan === 'Daily' ? 'दैनिक' : 'साप्ताहिक'} (${emiText})
---
नमस्ते, मैंने अपना ऋण आवेदन जमा किया है।
संपर्क: ${COMPANY_DETAILS.phone}`
      : `*Loan Application — Bharat Enterprises*
---
Application No: ${formData.applicationNo}
Date: ${formData.applicationDate}
Applicant: ${formData.fullName}
Mobile: ${formData.mobileNumber}
PAN: ${formData.panNumber}
Address: ${formData.fullAddress || '-'}
Business: ${formData.businessName || 'Business'} (${formData.typeOfBusiness || 'Business'})
Loan Amount: Rs. ${Number(formData.requiredLoanAmount).toLocaleString('en-IN')}/-
Repayment Plan: ${formData.repaymentPlan} (${emiText})
---
Hello, I have submitted my loan application.
Contact: ${COMPANY_DETAILS.phone}`;

    const encodedMsg = encodeURIComponent(message);
    const waUrl = `https://api.whatsapp.com/send?phone=${COMPANY_DETAILS.cleanPhone}&text=${encodedMsg}`;
    setWhatsAppDirectUrl(waUrl);

    try {
      const { blob, fileName, pdfDataUri } = await generatePdf();
      setIsSubmitted(true);
      try {
        sessionStorage.removeItem('befs_app_id');
        sessionStorage.removeItem('befs_initial_name');
        sessionStorage.removeItem('befs_initial_mobile');
        sessionStorage.removeItem('befs_initial_pan');
      } catch { }
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });

      const applicationPdfDoc: UploadDocFile = {
        name: fileName,
        mimeType: 'application/pdf',
        base64: pdfDataUri,
        size: blob.size,
      };

      // ── Save to Google Sheets & Google Drive (including the Application Form PDF) ──
      setCloudSaveStatus('saving');
      submitToGoogleSheets({ ...formData, applicationPdfDoc }, language).then(res => {
        if (res.success) {
          setCloudSaveStatus('saved');
          if (res.folderUrl) setDriveFolderUrl(res.folderUrl);
        } else {
          setCloudSaveStatus('error');
        }
      });
    } catch (err) {
      console.error(err);
      setStatusMsg(
        isMr
          ? 'अर्ज सादर करताना त्रुटी आली. कृपया पुन्हा प्रयत्न करा.'
          : isHi
          ? 'आवेदन जमा करते समय त्रुटि आई। कृपया पुनः प्रयास करें।'
          : 'Error submitting application. Please try again.'
      );
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleWhatsAppSubmit = async () => {
    // 1. Download PDF first
    try {
      if (pdfBlobUrl) {
        const a = document.createElement('a');
        a.href = pdfBlobUrl;
        a.download = generatedPdfFileName || `BharatEnterprises_LoanApplication_${formData.applicationNo}.pdf`;
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
          if (document.body.contains(a)) document.body.removeChild(a);
        }, 800);
      } else {
        const { blob, fileName } = await generatePdf();
        triggerDownload(blob, fileName);
      }
    } catch (err) {
      console.error('Error downloading PDF:', err);
    }

    setHasOpenedWhatsApp(true);

    // 2. Immediately redirect / open WhatsApp
    const waWindow = window.open(whatsAppDirectUrl, '_blank');
    if (!waWindow || waWindow.closed || typeof waWindow.closed === 'undefined') {
      window.location.href = whatsAppDirectUrl;
    }
  };

  const handleCloseTab = () => {
    try {
      window.close();
    } catch { }
    setTimeout(() => {
      navigate('/');
    }, 300);
  };

  const PRESET_AMOUNTS = [9000, 18000, 27000, 36000, 45000, 54000, 63000, 72000, 81000, 90000, 180000, 270000, 360000, 450000];

  // ── SUCCESS VIEW AFTER APPLICATION SUBMISSION ──
  if (isSubmitted) {
    return (
      <section className="py-10 sm:py-16 bg-[#07132e] text-white min-h-screen px-4 sm:px-6 lg:px-8 font-sans w-full relative overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 -left-20 w-[550px] h-[550px] rounded-full bg-emerald-600/10 blur-[120px]" />
          <div className="absolute bottom-10 right-0 w-[650px] h-[650px] rounded-full bg-blue-500/10 blur-[130px]" />
        </div>

        <div className="max-w-4xl mx-auto space-y-6 relative z-10">
          {/* Top Card */}
          <div className="bg-[#0f1d38]/95 backdrop-blur-md border-2 border-emerald-500/50 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden space-y-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-lg shadow-emerald-600/30">
                <CheckCircle2 size={36} />
              </div>

              <div className="space-y-1.5 text-center sm:text-left flex-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>{isMr ? 'माहिती तयार झाली आहे — अंतिम पायरी बाकी' : isHi ? 'विवरण तैयार हो गया है — अंतिम चरण शेष' : 'Information Generated — Final Step Required'}</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  {isMr ? 'कर्ज अर्जाची माहिती तयार झाली आहे' : isHi ? 'ऋण आवेदन का विवरण तैयार हो गया है' : 'Application Information is Generated'}
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 font-devanagari">
                  {isMr
                    ? 'तुमचा स्वाक्षरी केलेला कर्ज अर्ज तयार आहे. PDF डाऊनलोड करण्यासाठी आणि व्हॉट्सॲपवर पाठवण्यासाठी खालील बटनावर क्लिक करा.'
                    : isHi
                    ? 'आपका हस्ताक्षरित ऋण आवेदन पत्र तैयार है। पीडीएफ डाउनलोड करने और व्हाट्सएप पर भेजने के लिए नीचे दिए गए बटन पर क्लिक करें।'
                    : 'Your signed loan application docket is ready. Click the button below to download your PDF and immediately submit on WhatsApp.'}
                </p>
                <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <span className="font-mono text-xs font-bold bg-[#192744] border border-[#263c68] text-white px-3 py-1 rounded-lg">
                    {isMr ? 'अर्ज क्र.:' : isHi ? 'आवेदन क्र.:' : 'App ID:'} {formData.applicationNo}
                  </span>
                  <span className="text-xs font-semibold text-slate-300 bg-[#192744] border border-[#263c68] px-2.5 py-1 rounded-lg">
                    {isMr ? 'तारीख:' : isHi ? 'दिनांक:' : 'Date:'} {formData.applicationDate}
                  </span>
                  <span className="text-xs font-bold text-amber-300 bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 rounded-lg">
                    {isMr ? 'स्थिती: व्हॉट्सॲप सबमिशन प्रलंबित' : isHi ? 'स्थिति: व्हाट्सएप सबमिशन प्रतीक्षित' : 'Status: Pending WhatsApp Submission'}
                  </span>
                  {cloudSaveStatus === 'saving' && (
                    <span className="text-xs font-semibold text-blue-300 bg-blue-500/10 border border-blue-500/30 px-2.5 py-1 rounded-lg flex items-center gap-1.5">
                      <Loader2 size={12} className="animate-spin text-blue-400" />
                      <span>{isMr ? 'तुमचा फॉर्म सेव्ह होत आहे...' : isHi ? 'आपका फॉर्म सहेजा जा रहा है...' : 'Saving your form...'}</span>
                    </span>
                  )}
                  {cloudSaveStatus === 'saved' && (
                    <span className="text-xs font-semibold text-emerald-300 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded-lg flex items-center gap-1.5">
                      <FolderCheck size={13} className="text-emerald-400" />
                      <span>{isMr ? 'तुमचा फॉर्म सुरक्षित सेव्ह झाला' : isHi ? 'आपका फॉर्म सुरक्षित सहेज लिया गया है' : 'Your form is saved'}</span>
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* MANDATORY WARNING & REDIRECT TO WHATSAPP BOX */}
            <div className="bg-[#122247] border border-amber-500/30 rounded-2xl p-5 sm:p-6 space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-slate-950 text-[9px] font-black leading-none">!</span>
                </div>
                <div className="space-y-1 text-left">
                  <h3 className="text-sm sm:text-base font-black text-amber-300 uppercase tracking-wide">
                    {isMr ? 'अतिशय महत्त्वाची अंतिम सूचना' : isHi ? 'अत्यंत महत्वपूर्ण अंतिम सूचना' : 'Mandatory Final Submission Notice'}
                  </h3>
                  <p className="text-xs sm:text-sm text-amber-200 font-bold leading-relaxed font-devanagari">
                    {isMr
                      ? 'फक्त ऑनलाईन फॉर्म भरून कर्ज मंजूर होत नाही! डाऊनलोड झालेला अर्ज (PDF) व केवायसी कागदपत्रे आमच्या व्हॉट्सॲप हेल्पडेस्कवर पाठवणे १००% बंधनकारक आहे.'
                      : isHi
                      ? 'केवल ऑनलाइन फॉर्म भरने से ऋण स्वीकृत नहीं होता! डाउनलोड किया गया आवेदन पत्र (पीडीएफ) और केवाईसी दस्तावेज़ हमारे व्हाट्सएप हेल्पडेस्क पर भेजना १००% अनिवार्य है।'
                      : 'Filling the online form alone does not complete your loan! Sending the downloaded PDF and KYC documents to our WhatsApp Desk is 100% mandatory.'}
                  </p>
                </div>
              </div>

              {/* Step by step guide */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
                <div className="bg-[#192744] p-3.5 rounded-xl border border-slate-700/60 flex items-start gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-black flex items-center justify-center shrink-0 text-xs">1</span>
                  <p className="text-slate-300 leading-snug">
                    {isMr ? 'खालील हिरव्या बटनावर (व्हॉट्सॲप सबमिट) क्लिक करा.' : isHi ? 'नीचे दिए गए हरे बटन (व्हाट्सएप सबमिट) पर क्लिक करें।' : 'Click the green "Submit on WhatsApp" button below.'}
                  </p>
                </div>
                <div className="bg-[#192744] p-3.5 rounded-xl border border-slate-700/60 flex items-start gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-black flex items-center justify-center shrink-0 text-xs">2</span>
                  <p className="text-slate-300 leading-snug">
                    {isMr ? 'तुमची स्वाक्षरी केलेली PDF लगेच डाऊनलोड होईल आणि व्हॉट्सॲप उघडेल.' : isHi ? 'आपका हस्ताक्षरित पीडीएफ तुरंत डाउनलोड हो जाएगा और व्हाट्सएप खुल जाएगा।' : 'Your signed PDF will download immediately and WhatsApp will open.'}
                  </p>
                </div>
                <div className="bg-[#192744] p-3.5 rounded-xl border border-slate-700/60 flex items-start gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-black flex items-center justify-center shrink-0 text-xs">3</span>
                  <p className="text-slate-300 leading-snug">
                    {isMr ? 'डाऊनलोड झालेली PDF आणि आधार/पॅन फोटो व्हॉट्सॲपवर पाठवा.' : isHi ? 'डाउनलोड किया गया पीडीएफ और आधार/पैन फोटो व्हाट्सएप पर भेजें।' : 'Send the downloaded PDF along with your Aadhaar / PAN photo in WhatsApp.'}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleWhatsAppSubmit}
                  className="w-full py-4 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm sm:text-base uppercase tracking-wider shadow-lg shadow-emerald-600/40 flex items-center justify-center gap-2.5 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
                >
                  <MessageCircle size={22} className="stroke-[2.5]" />
                  <span>{isMr ? 'व्हॉट्सॲपवर पाठवा (येथे क्लिक करा)' : isHi ? 'व्हाट्सएप पर भेजें (यहाँ क्लिक करें)' : 'Submit on WhatsApp (Click Here)'}</span>
                </button>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => {
                  setIsSubmitted(false);
                  setCurrentStep(1);
                  setFormData(prev => ({
                    ...prev,
                    applicationNo: generateTimestampAppId(),
                  }));
                }}
                className="text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <ArrowLeft size={14} />
                <span>{isMr ? 'अर्जात बदल करा / नवीन अर्ज' : isHi ? 'आवेदन में सुधार करें / नया आवेदन' : 'Edit Application / New Application'}</span>
              </button>

              <button
                type="button"
                onClick={handleCloseTab}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer border border-slate-700"
              >
                <X size={15} />
                <span>{isMr ? 'टॅब बंद करा' : isHi ? 'टैब बंद करें' : 'Close Tab'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Hidden PDF render target */}
        <div style={{ position: 'fixed', top: 0, left: 0, width: '794px', minWidth: '794px', maxWidth: '794px', backgroundColor: '#ffffff', zIndex: -99999, opacity: 1, pointerEvents: 'none' }}>
          <PdfDocument formData={formData} id="offscreen-pdf-render-target" />
        </div>
      </section>
    );
  }

  // ── MAIN APPLICATION FORM VIEW ──
  return (
    <div id="loan-application-section" className="relative bg-[#07132e] text-white pt-4 pb-16 lg:pt-6 lg:pb-24 w-full overflow-hidden min-h-screen font-sans">
      {/* Ambient Radial Glow Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 -left-20 w-[550px] h-[550px] rounded-full bg-blue-600/10 blur-[120px]" />
        <div className="absolute bottom-10 right-0 w-[650px] h-[650px] rounded-full bg-indigo-500/10 blur-[130px]" />
        <div className="absolute top-10 right-1/4 w-[400px] h-[400px] rounded-full bg-sky-500/5 blur-[90px]" />
      </div>

      {/* Top Application Breadcrumb & Status Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 relative z-10">
        <div className="flex flex-wrap items-center justify-between gap-3 py-3 border-b border-slate-800/80 text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#11234a] hover:bg-[#183168] text-slate-200 hover:text-white font-semibold transition-colors cursor-pointer border border-[#213b73]"
            >
              <ArrowLeft size={13} />
              <span>{isMr ? 'मुख्यपृष्ठ' : isHi ? 'मुख्य पृष्ठ' : 'Home'}</span>
            </Link>
            <span className="text-slate-600">/</span>
            <span className="text-blue-400 font-bold uppercase tracking-wider text-[11px]">
              {isMr ? 'कर्ज अर्ज फॉर्म' : isHi ? 'ऋण आवेदन फॉर्म' : 'Loan Application Form'}
            </span>
          </div>

          <div className="flex items-center gap-3 font-mono text-[11px]">
            <span className="text-slate-400 bg-[#0e1d3b] px-2.5 py-1 rounded-md border border-slate-800">
              {isMr ? 'अर्ज क्र.:' : isHi ? 'आवेदन क्र.:' : 'ID:'} {formData.applicationNo}
            </span>
            <span className="hidden sm:inline-flex items-center gap-1 text-emerald-400 bg-emerald-950/40 px-2.5 py-1 rounded-md border border-emerald-800/40">
              <Lock size={11} /> {isMr ? '२५६-बिट एनक्रिप्टेड' : isHi ? '२५६-बिट सुरक्षित' : '256-Bit Encrypted'}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start">

          {/* ─── LEFT COLUMN: Trust, Features & Assistance Card (renders below form on mobile) ─── */}
          <div className="order-2 lg:order-1 lg:col-span-4 xl:col-span-4 flex flex-col gap-6 lg:sticky lg:top-24">
            <div className="bg-[#0c1938]/90 backdrop-blur-md border border-[#1e345e] rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-2xl space-y-5 sm:space-y-6">

              {/* Customer Photo + Verified Badge */}
              <div className="relative rounded-2xl overflow-hidden aspect-[4/3] border border-white/10 shadow-lg group">
                <img
                  src="/hero-man.jpg"
                  alt="Customer"
                  className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#07132e]/85 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 flex items-center text-xs">
                  <span className="font-bold text-white bg-blue-600/90 px-2.5 py-1 rounded-lg backdrop-blur-xs flex items-center gap-1">
                    <ShieldCheck size={13} /> {isMr ? 'सुरक्षित पोर्टल' : isHi ? 'सुरक्षित पोर्टल' : 'Secure Portal'}
                  </span>
                </div>
              </div>

              {/* Headline */}
              <div>
                <h3 className="text-lg sm:text-xl font-black text-white tracking-tight">
                  {isMr ? 'लघु व्यवसाय व वैयक्तिक कर्ज अर्ज' : isHi ? 'लघु व्यवसाय एवं व्यक्तिगत ऋण आवेदन' : 'Micro Business & Personal Loan'}
                </h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed font-devanagari">
                  {isMr
                    ? 'छोट्या दुकानदारांसाठी आणि व्यावसायिकांसाठी सुलभ कर्ज प्रक्रिया.'
                    : isHi
                    ? 'छोटे दुकानदारों और व्यवसायियों के लिए सुलभ ऋण प्रक्रिया।'
                    : 'Structured daily & weekly micro-loans for local shops, traders, and entrepreneurs.'}
                </p>
              </div>

              {/* 4 Feature Highlights */}
              <div className="space-y-3 pt-1 border-t border-slate-800">
                {[
                  {
                    icon: <ShieldCheck size={16} className="text-blue-400" />,
                    title: isMr ? 'सोपी प्रक्रिया' : isHi ? 'आसान प्रक्रिया' : 'Simple In-Principle Process',
                    desc: isMr ? 'कागदपत्रे तपासणीनंतर सुलभ प्रक्रिया' : isHi ? 'दस्तावेज़ सत्यापन उपरांत सुगम प्रक्रिया' : 'Clear document check'
                  },
                  {
                    icon: <Percent size={16} className="text-blue-400" />,
                    title: isMr ? 'पारदर्शक १% फी' : isHi ? 'पारदर्शी १% शुल्क' : 'Minimal 1% Processing Fee',
                    desc: isMr ? 'कोणतेही छुपे शुल्क नाही' : isHi ? 'कोई छिपा हुआ शुल्क नहीं' : 'Zero hidden charges'
                  },
                  {
                    icon: <IndianRupee size={16} className="text-blue-400" />,
                    title: isMr ? 'दैनिक/साप्ताहिक हप्ता' : isHi ? 'दैनिक/साप्ताहिक किस्त' : 'Daily & Weekly Repayment',
                    desc: isMr ? 'तुमच्या व्यवसायाच्या सोयीनुसार' : isHi ? 'आपके व्यापार की सुविधानुसार' : 'Suits your daily cash flow'
                  },
                  {
                    icon: <Banknote size={16} className="text-blue-400" />,
                    title: isMr ? '₹४.५ लाखांपर्यंत' : isHi ? '₹४.५ लाख तक' : 'Up to ₹4,50,000 Sanction',
                    desc: isMr ? 'विनातारण खेळते भांडवल' : isHi ? 'बिना गारंटी कार्यशील पूंजी' : 'Collateral-free working capital'
                  },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-xs">
                    <div className="w-7 h-7 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center shrink-0 mt-0.5">
                      {item.icon}
                    </div>
                    <div>
                      <p className="font-bold text-white leading-tight">{item.title}</p>
                      <p className="text-[11px] text-slate-400 font-devanagari">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Customer Support Info */}
              <div className="p-3.5 rounded-2xl bg-[#122247] border border-blue-500/30 space-y-1.5 text-xs text-left">
                <div className="flex items-center gap-1.5 text-blue-300 font-bold uppercase tracking-wider text-[10px]">
                  <Phone size={13} />
                  <span>{isMr ? 'थेट ग्राहक साहाय्यता' : isHi ? 'सीधी ग्राहक सहायता' : 'Customer Support'}</span>
                </div>
                <p className="text-slate-200 font-semibold font-mono">{COMPANY_DETAILS.phone}</p>
                <p className="text-slate-400 text-[11px] flex items-center gap-1 pt-0.5">
                  <Mail size={11} className="text-blue-400" />
                  <span>{COMPANY_DETAILS.email}</span>
                </p>
              </div>

            </div>
          </div>

          {/* ─── RIGHT COLUMN: The 6-Step Loan Application Form Card ─── */}
          <div className="order-1 lg:order-2 lg:col-span-8 xl:col-span-8 w-full" id="application-form-card">
            <div className="bg-[#0f1d38]/95 backdrop-blur-md border border-[#1e345e] rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-2xl shadow-black/50 text-white">

              {/* Status banner */}
              {statusMsg && (
                <div className="mb-5 p-3.5 bg-blue-950/60 border border-blue-500/40 text-blue-200 rounded-2xl text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-blue-400 shrink-0" /> {statusMsg}
                </div>
              )}

              {/* Stepper Header */}
              <div className="mb-6 pb-5 border-b border-slate-700/60">
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div>
                    <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">
                      {isMr ? `चरण ${currentStep} / ${STEPS.length}` : isHi ? `चरण ${currentStep} / ${STEPS.length}` : `Step ${currentStep} of ${STEPS.length}`}
                    </span>
                    <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-0.5">
                      {isMr ? STEPS[currentStep - 1].titleMr : isHi ? STEPS[currentStep - 1].titleHi : STEPS[currentStep - 1].titleEn}
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                      {currentStep === 1 && (isMr ? 'कृपया आपले नाव, जन्मतारीख व संपर्क माहिती अचूक भरा.' : isHi ? 'कृपया अपना नाम, जन्म तिथि एवं संपर्क विवरण सही-सही भरें।' : 'Provide your personal details, Aadhaar and PAN for identity verification.')}
                      {currentStep === 2 && (isMr ? 'आपल्या व्यवसायाची व दुकानाची माहिती भरा.' : isHi ? 'अपने व्यवसाय एवं दुकान का विवरण भरें।' : 'Provide your business & shop details to check eligibility.')}
                      {currentStep === 3 && (isMr ? 'कर्ज रक्कम व परतफेड योजना निवडा.' : isHi ? 'ऋण राशि एवं पुनर्भुगतान योजना चुनें।' : 'Select loan amount and repayment schedule.')}
                      {currentStep === 4 && (isMr ? 'जामीनदाराची माहिती भरणे अनिवार्य आहे.' : isHi ? 'गारंटर का विवरण भरना अनिवार्य है।' : 'Guarantor details are compulsory. Please provide all details.')}
                      {currentStep === 5 && (isMr ? 'उपलब्ध असलेल्या कागदपत्रांवर टिक करा.' : isHi ? 'उपलब्ध दस्तावेज़ों पर सही का निशान लगाएं।' : 'Confirm documents available for KYC verification.')}
                      {currentStep === 6 && (isMr ? 'घोषणा वाचा व डिजिटल स्वाक्षरी करा.' : isHi ? 'घोषणा पढ़ें और डिजिटल हस्ताक्षर करें।' : 'Review declaration and provide your digital signature.')}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[10px] font-mono text-slate-400 block">{isMr ? 'अर्ज क्र.:' : isHi ? 'आवेदन क्र.:' : 'ID:'} {formData.applicationNo}</span>
                    <span className="text-[10px] text-slate-500 font-mono">{formData.applicationDate}</span>
                  </div>
                </div>

                {/* Progress bar and Step Bubbles */}
                <div className="flex items-center justify-between gap-1 mt-4">
                  {STEPS.map((step, idx) => {
                    const isCompleted = currentStep > step.id;
                    const isActive = currentStep === step.id;
                    return (
                      <React.Fragment key={step.id}>
                        <button
                          type="button"
                          onClick={() => {
                            if (step.id < currentStep) setCurrentStep(step.id);
                          }}
                          disabled={step.id > currentStep}
                          className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold transition-all ${isCompleted
                              ? 'bg-blue-600 text-white cursor-pointer hover:bg-blue-500'
                              : isActive
                                ? 'bg-blue-500 text-white ring-4 ring-blue-500/20 shadow-lg scale-105'
                                : 'bg-[#192744] text-slate-400 border border-[#263c68]'
                            }`}
                          title={isMr ? step.titleMr : isHi ? step.titleHi : step.titleEn}
                        >
                          {isCompleted ? <Check size={14} /> : step.id}
                        </button>
                        {idx < STEPS.length - 1 && (
                          <div
                            className={`h-0.5 flex-1 transition-all duration-300 ${isCompleted ? 'bg-blue-500' : 'bg-slate-700'
                              }`}
                          />
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>

              {/* ═══════════════════════════════════════════════════════════ */}
              {/* STEP 1: PERSONAL DETAILS                                    */}
              {/* ═══════════════════════════════════════════════════════════ */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <div className="bg-blue-950/40 border border-blue-800/40 rounded-2xl p-3.5 flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-[10px] font-black">i</span>
                    </div>
                    <p className="text-xs text-blue-200 font-medium leading-relaxed font-devanagari">
                      {isMr
                        ? 'कृपया आपले नाव, जन्मतारीख व पत्ता आधार कार्डप्रमाणेच भरा. अचूक माहितीमुळे पडताळणी प्रक्रिया सुलभ होते.'
                        : isHi
                        ? 'कृपया अपना नाम, जन्म तिथि और पता आधार कार्ड के अनुसार ही भरें। सटीक जानकारी से सत्यापन प्रक्रिया सरल होती है।'
                        : 'Please fill details exactly as per your Aadhaar & PAN Card for seamless identity verification.'}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <Field label={isMr ? 'पूर्ण नाव (आधार कार्डप्रमाणे)' : isHi ? 'पूरा नाम (आधार कार्ड के अनुसार)' : 'Full Name (as per Aadhaar)'} required error={formErrors.fullName}>
                        <div className="relative flex items-center">
                          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                            <User size={17} />
                          </div>
                          <input
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            placeholder={isMr ? 'पूर्ण नाव प्रविष्ट करा' : isHi ? 'पूरा नाम दर्ज करें' : 'Enter full name'}
                            className={inputCls(formErrors.fullName) + ' pl-10'}
                          />
                        </div>
                      </Field>
                    </div>

                    <Field label={isMr ? 'वडिलांचे / पतीचे नाव' : isHi ? 'पिता / पति का नाम' : 'Father / Husband Name'} required error={formErrors.fatherHusbandName}>
                      <input
                        type="text"
                        name="fatherHusbandName"
                        value={formData.fatherHusbandName}
                        onChange={handleChange}
                        placeholder={isMr ? 'वडिलांचे / पतीचे नाव प्रविष्ट करा' : isHi ? 'पिता / पति का नाम दर्ज करें' : 'Enter father or husband name'}
                        className={inputCls(formErrors.fatherHusbandName)}
                      />
                    </Field>

                    <Field label={isMr ? 'जन्मतारीख' : isHi ? 'जन्म तिथि' : 'Date of Birth'} required error={formErrors.dob}>
                      <input
                        type="date"
                        name="dob"
                        value={formData.dob}
                        onChange={handleChange}
                        className={inputCls(formErrors.dob) + ' font-mono [color-scheme:dark]'}
                      />
                    </Field>

                    {/* Mobile Number with +91 Prefix — format: XX-XXX-XXX-XX (70-580-612-64) */}
                    <Field label={isMr ? 'मोबाइल नंबर (१० अंकी)' : isHi ? 'मोबाइल नंबर (१० अंक)' : 'Mobile Number (10-digit)'} sublabel={isMr ? '१० अंकी मोबाइल' : isHi ? '१० अंकों का मोबाइल' : '10-digit mobile'} required error={formErrors.mobileNumber}>
                      <div className="relative flex items-center">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-300 font-semibold text-sm">
                          <span>+91</span>
                          <span className="text-slate-500 mx-2">|</span>
                        </div>
                        <input
                          type="tel"
                          name="mobileNumber"
                          value={formData.mobileNumber}
                          onChange={handleMobileChange}
                          inputMode="numeric"
                          autoComplete="tel"
                          placeholder={isMr ? 'मोबाईल नंबर प्रविष्ट करा' : isHi ? 'मोबाइल नंबर दर्ज करें' : 'Enter mobile number'}
                          maxLength={14}
                          className={inputCls(formErrors.mobileNumber) + ' pl-16 pr-10 font-mono tracking-wider'}
                        />
                        <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400">
                          <Phone size={16} />
                        </div>
                      </div>
                    </Field>

                    {/* Aadhaar Number */}
                    <Field label={isMr ? 'आधार कार्ड नंबर (१२ अंकी)' : isHi ? 'आधार कार्ड नंबर (१२ अंक)' : 'Aadhaar Number (12-digit)'} required error={formErrors.aadhaarNumber}>
                      <input
                        type="text"
                        name="aadhaarNumber"
                        value={formData.aadhaarNumber}
                        onChange={handleAadhaarChange}
                        inputMode="numeric"
                        pattern="[0-9 ]*"
                        placeholder={isMr ? '१२ अंकी आधार क्रमांक प्रविष्ट करा' : isHi ? '१२ अंकों का आधार नंबर दर्ज करें' : 'Enter 12-digit Aadhaar number'}
                        maxLength={14}
                        className={inputCls(formErrors.aadhaarNumber) + ' font-mono tracking-wider'}
                      />
                    </Field>

                    {/* PAN Number */}
                    <div className="sm:col-span-2">
                      <Field label={isMr ? 'पॅन कार्ड नंबर (१० अंकी)' : isHi ? 'पैन कार्ड नंबर (१० अक्षर)' : 'PAN Number (10-digit)'} required error={formErrors.panNumber}>
                        <div className="relative flex items-center">
                          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                            <CreditCard size={17} />
                          </div>
                          <input
                            type="text"
                            name="panNumber"
                            value={formData.panNumber}
                            onChange={handleChange}
                            inputMode="text"
                            autoCapitalize="characters"
                            spellCheck={false}
                            placeholder={isMr ? '१० अंकी पॅन क्रमांक प्रविष्ट करा' : isHi ? '१० अंकों का पैन नंबर दर्ज करें' : 'Enter 10-character PAN'}
                            maxLength={10}
                            className={inputCls(formErrors.panNumber) + ' pl-10 font-mono uppercase tracking-widest'}
                          />
                        </div>
                      </Field>
                    </div>

                    <div className="sm:col-span-2">
                      <Field label={isMr ? 'पूर्ण निवासी पत्ता' : isHi ? 'पूरा आवासीय पता' : 'Full Residential Address'} required error={formErrors.fullAddress}>
                        <textarea
                          name="fullAddress"
                          rows={2}
                          value={formData.fullAddress}
                          onChange={handleChange}
                          placeholder={isMr ? 'संपूर्ण निवासी पत्ता प्रविष्ट करा' : isHi ? 'पूरा आवासीय पता दर्ज करें' : 'Enter full residential address'}
                          className={inputCls(formErrors.fullAddress) + ' resize-none'}
                        />
                      </Field>
                    </div>
                  </div>
                </div>
              )}

              {/* ═══════════════════════════════════════════════════════════ */}
              {/* STEP 2: BUSINESS INFORMATION                                */}
              {/* ═══════════════════════════════════════════════════════════ */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  <div className="bg-blue-950/40 border border-blue-800/40 rounded-2xl p-3.5 flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                      <Briefcase size={11} />
                    </div>
                    <p className="text-xs text-blue-200 font-medium leading-relaxed font-devanagari">
                      {isMr
                        ? 'आपल्या व्यवसायाची माहिती भरा. यामुळे कर्ज पात्रता तपासण्यास मदत होईल.'
                        : isHi
                        ? 'अपने व्यवसाय का विवरण भरें। इससे ऋण पात्रता जांचने में आसानी होगी।'
                        : 'Fill in your business details. This helps us assess your loan eligibility faster.'}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label={isMr ? 'व्यवसायाचे / दुकानाचे नाव' : isHi ? 'व्यवसाय / दुकान का नाम' : 'Business / Shop Name'} required error={formErrors.businessName}>
                      <input
                        type="text"
                        name="businessName"
                        value={formData.businessName}
                        onChange={handleChange}
                        placeholder={isMr ? 'व्यवसायाचे नाव प्रविष्ट करा' : isHi ? 'व्यवसाय का नाम दर्ज करें' : 'Enter business name'}
                        className={inputCls(formErrors.businessName)}
                      />
                    </Field>

                    <Field label={isMr ? 'व्यवसायाचा प्रकार' : isHi ? 'व्यवसाय का प्रकार' : 'Type of Business'} required error={formErrors.typeOfBusiness}>
                      <input
                        type="text"
                        name="typeOfBusiness"
                        value={formData.typeOfBusiness}
                        onChange={handleChange}
                        placeholder={isMr ? 'व्यवसायाचा प्रकार प्रविष्ट करा' : isHi ? 'व्यवसाय का प्रकार दर्ज करें' : 'Enter type of business'}
                        className={inputCls(formErrors.typeOfBusiness)}
                      />
                    </Field>

                    <div className="sm:col-span-2">
                      <Field label={isMr ? 'व्यवसायाचा / दुकानाचा पत्ता' : isHi ? 'व्यवसाय / दुकान का पता' : 'Business / Shop Address'} required error={formErrors.businessAddress}>
                        <input
                          type="text"
                          name="businessAddress"
                          value={formData.businessAddress}
                          onChange={handleChange}
                          placeholder={isMr ? 'व्यवसायाचा पत्ता प्रविष्ट करा' : isHi ? 'व्यवसाय का पता दर्ज करें' : 'Enter business address'}
                          className={inputCls(formErrors.businessAddress)}
                        />
                      </Field>
                    </div>

                    <div className="sm:col-span-2">
                      <Field label={isMr ? 'व्यवसायातील अनुभव (वर्षे)' : isHi ? 'व्यवसाय में अनुभव (वर्ष)' : 'Years in Business'}>
                        <div className="flex items-center gap-4">
                          <input
                            type="number"
                            name="yearsInBusiness"
                            min={0}
                            max={50}
                            inputMode="numeric"
                            value={formData.yearsInBusiness}
                            onChange={handleChange}
                            className={inputCls() + ' w-28 font-mono text-center'}
                          />
                          <span className="text-xs text-slate-400 font-devanagari">
                            {isMr ? 'वर्षे सलग व्यवसाय चालू' : isHi ? 'वर्षों से निरंतर कार्यरत व्यवसाय' : 'years in continuous operation'}
                          </span>
                        </div>
                      </Field>
                    </div>
                  </div>
                </div>
              )}

              {/* ═══════════════════════════════════════════════════════════ */}
              {/* STEP 3: LOAN DETAILS & REPAYMENT                            */}
              {/* ═══════════════════════════════════════════════════════════ */}
              {currentStep === 3 && (() => {
                const currentPlan = LOAN_PLANS.find(p => p.loanAmount === Number(formData.requiredLoanAmount)) || LOAN_PLANS[4];
                const activeIndex = LOAN_PLANS.findIndex(p => p.loanAmount === Number(formData.requiredLoanAmount));
                const safeIndex = activeIndex >= 0 ? activeIndex : 4;

                return (
                  <div className="space-y-5">
                    <Field
                      label={isMr ? 'आवश्यक कर्ज योजना निवडा' : isHi ? 'आवश्यक ऋण योजना चुनें' : 'Select Official Loan Scheme'}
                      sublabel={isMr ? '१४ अधिकृत योजनांपैकी एक निवडा (किमान ₹९,००० ते कमाल ₹४,५०,०००)' : isHi ? '१४ आधिकारिक योजनाओं में से चुनें (न्यूनतम ₹९,००० से अधिकतम ₹४,५०,०००)' : 'Choose from 14 standard loan schemes (min ₹9,000 to max ₹4,50,000)'}
                      required
                      error={formErrors.requiredLoanAmount}
                    >
                      {/* 14 Plan Amount Chips */}
                      <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4">
                        {LOAN_PLANS.map((plan) => (
                          <button
                            key={plan.loanAmount}
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, requiredLoanAmount: plan.loanAmount.toString() }))}
                            className={`px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl text-xs font-bold font-mono transition-all border cursor-pointer ${
                              formData.requiredLoanAmount === plan.loanAmount.toString()
                                ? 'bg-blue-600 text-white border-blue-500 shadow-md ring-2 ring-blue-400/40 scale-105'
                                : 'bg-[#122247] border-[#263c68] text-slate-300 hover:border-blue-400 hover:text-white'
                            }`}
                          >
                            ₹{plan.loanAmount >= 100000 ? `${(plan.loanAmount / 100000).toFixed(1)}L` : `${plan.loanAmount / 1000}k`}
                          </button>
                        ))}
                      </div>

                      {/* Snap Slider between 14 plans */}
                      <div className="bg-[#122247] border border-[#263c68] rounded-2xl p-4 mb-3 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                            {isMr ? `योजना ${safeIndex + 1} / १४` : isHi ? `योजना ${safeIndex + 1} / १४` : `Tier ${safeIndex + 1} of 14`}
                          </span>
                          <span className="text-xl sm:text-2xl font-black font-mono text-white">
                            ₹ {currentPlan.loanAmount.toLocaleString('en-IN')}/-
                          </span>
                        </div>
                        <input
                          type="range"
                          min={0}
                          max={13}
                          step={1}
                          value={safeIndex}
                          onChange={(e) => {
                            const newPlan = LOAN_PLANS[Number(e.target.value)];
                            if (newPlan) {
                              setFormData(prev => ({ ...prev, requiredLoanAmount: newPlan.loanAmount.toString() }));
                            }
                          }}
                          className="w-full accent-blue-500 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                        />
                        <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                          <span>₹9k</span>
                          <span>₹4.5L</span>
                        </div>
                      </div>
                    </Field>

                    <Field label={isMr ? 'कर्जाचा हेतू' : isHi ? 'ऋण का उद्देश्य' : 'Purpose of Loan'}>
                      <input
                        type="text"
                        name="purposeOfLoan"
                        value={formData.purposeOfLoan}
                        onChange={handleChange}
                        placeholder={isMr ? 'कर्जाचा हेतू प्रविष्ट करा' : isHi ? 'ऋण का उद्देश्य दर्ज करें' : 'Enter purpose of loan'}
                        className={inputCls()}
                      />
                    </Field>

                    <Field label={isMr ? 'परतफेड योजना निवडा' : isHi ? 'पुनर्भुगतान योजना चुनें' : 'Select Repayment Plan'} required error={formErrors.repaymentPlan}>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {[
                          { key: 'Daily', mr: 'दैनिक', hi: 'दैनिक', en: 'Daily', desc: isMr ? 'दर दिवशी परतफेड (१०० दिवस)' : isHi ? 'प्रतिदिन पुनर्भुगतान (१०० दिन)' : 'Repay every day (100 days)', rate: `₹${currentPlan.dailyEmi.toLocaleString('en-IN')}/दिवस` },
                          { key: 'Weekly', mr: 'साप्ताहिक', hi: 'साप्ताहिक', en: 'Weekly', desc: isMr ? 'दर आठवड्याला परतफेड' : isHi ? 'प्रति सप्ताह पुनर्भुगतान' : 'Repay every week', rate: `₹${currentPlan.weeklyEmi.toLocaleString('en-IN')}/आठवडा` },
                        ].map(plan => {
                          const isSelected = formData.repaymentPlan === plan.key;
                          return (
                            <button
                              key={plan.key}
                              type="button"
                              onClick={() => setFormData(prev => ({ ...prev, repaymentPlan: plan.key as any }))}
                              className={`relative flex flex-col p-4 rounded-2xl border text-left transition-all duration-200 cursor-pointer ${isSelected
                                  ? 'border-blue-500 bg-blue-600/20 text-white shadow-lg ring-1 ring-blue-500/50'
                                  : 'border-slate-700/80 bg-[#122247] hover:border-slate-500 text-slate-300'
                                }`}
                            >
                              {isSelected && (
                                <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center shadow-sm">
                                  <Check size={12} className="text-white" />
                                </div>
                              )}
                              <span className={`text-sm font-black mb-0.5 ${isSelected ? 'text-white' : 'text-slate-200'}`}>
                                {isMr ? plan.mr : isHi ? plan.hi : plan.en}
                              </span>
                              <span className={`text-[10px] font-medium mb-1 ${isSelected ? 'text-blue-200' : 'text-slate-400'}`}>
                                {plan.desc}
                              </span>
                              <span className={`text-xs font-bold font-mono ${isSelected ? 'text-amber-300' : 'text-blue-400'}`}>
                                {plan.rate}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </Field>

                    {/* Live EMI Preview with Official Plan Numbers */}
                    {formData.requiredLoanAmount && formData.repaymentPlan && (
                      <div className="bg-[#122247] border border-blue-500/30 rounded-2xl p-4 sm:p-5">
                        <p className="text-blue-300 text-[10px] font-bold uppercase tracking-widest mb-3">
                          {isMr ? 'हप्ता व फी सारांश' : isHi ? 'किस्त एवं शुल्क सारांश' : 'Repayment & Fee Preview'}
                        </p>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                          {[
                            {
                              label: isMr ? 'प्रोसेसिंग फी (१%)' : isHi ? 'प्रोसेसिंग शुल्क (१%)' : 'Fee (1%)',
                              val: `₹ ${currentPlan.processingFee.toLocaleString('en-IN')}/-`,
                              highlight: false
                            },
                            {
                              label: isMr ? 'दैनिक हप्ता' : isHi ? 'दैनिक किस्त' : 'Daily EMI',
                              val: `₹ ${currentPlan.dailyEmi.toLocaleString('en-IN')}`,
                              highlight: formData.repaymentPlan === 'Daily'
                            },
                            {
                              label: isMr ? 'साप्ताहिक हप्ता' : isHi ? 'साप्ताहिक किस्त' : 'Weekly EMI',
                              val: `₹ ${currentPlan.weeklyEmi.toLocaleString('en-IN')}`,
                              highlight: formData.repaymentPlan === 'Weekly'
                            },
                            {
                              label: isMr ? 'एकूण परतफेड' : isHi ? 'कुल पुनर्भुगतान' : 'Total Repayment',
                              val: `₹ ${currentPlan.totalRepayment.toLocaleString('en-IN')}/-`,
                              highlight: false
                            }
                          ].map(item => (
                            <div key={item.label} className={`text-center p-3 rounded-xl ${item.highlight ? 'bg-blue-600/30 border border-blue-500/50' : 'bg-[#192744]'}`}>
                              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">{item.label}</p>
                              <p className={`text-sm sm:text-base font-black mt-1 font-mono ${item.highlight ? 'text-blue-300' : 'text-white'}`}>{item.val}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* ═══════════════════════════════════════════════════════════ */}
              {/* STEP 4: GUARANTOR DETAILS (COMPULSORY)                      */}
              {/* ═══════════════════════════════════════════════════════════ */}
              {currentStep === 4 && (
                <div className="space-y-4">
                  <div className="bg-blue-950/40 border border-blue-800/40 rounded-2xl p-3.5 flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                      <Users size={11} />
                    </div>
                    <p className="text-xs text-blue-200 font-medium leading-relaxed font-devanagari">
                      {isMr
                        ? 'जामीनदाराची माहिती भरणे अनिवार्य आहे. कृपया सर्व माहिती अचूक भरा.'
                        : isHi
                        ? 'गारंटर का विवरण भरना अनिवार्य है। कृपया सभी जानकारी सही-सही भरें।'
                        : 'Guarantor details are compulsory. Please provide accurate guarantor information.'}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label={isMr ? 'जामीनदाराचे पूर्ण नाव' : isHi ? 'गारंटर का पूरा नाम' : 'Guarantor Full Name'} required error={formErrors.guarantorName}>
                      <input
                        type="text"
                        name="guarantorName"
                        value={formData.guarantorName}
                        onChange={handleChange}
                        placeholder={isMr ? 'जामीनदाराचे पूर्ण नाव प्रविष्ट करा' : isHi ? 'गारंटर का पूरा नाम दर्ज करें' : 'Enter guarantor full name'}
                        className={inputCls(formErrors.guarantorName)}
                      />
                    </Field>

                    <Field label={isMr ? 'जामीनदाराचा मोबाइल नंबर' : isHi ? 'गारंटर का मोबाइल नंबर' : 'Guarantor Mobile'} sublabel={isMr ? '१० अंकी मोबाइल' : isHi ? '१० अंकों का मोबाइल' : '10-digit mobile'} required error={formErrors.guarantorMobile}>
                      <div className="relative flex items-center">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-300 font-semibold text-sm">
                          <span>+91</span>
                          <span className="text-slate-500 mx-2">|</span>
                        </div>
                        <input
                          type="tel"
                          name="guarantorMobile"
                          value={formData.guarantorMobile}
                          onChange={handleGuarantorMobileChange}
                          inputMode="numeric"
                          autoComplete="tel"
                          placeholder={isMr ? 'मोबाईल नंबर प्रविष्ट करा' : isHi ? 'मोबाइल नंबर दर्ज करें' : 'Enter mobile number'}
                          maxLength={14}
                          className={inputCls(formErrors.guarantorMobile) + ' pl-16 pr-10 font-mono tracking-wider'}
                        />
                        <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400">
                          <Phone size={16} />
                        </div>
                      </div>
                    </Field>

                    {/* Guarantor Aadhaar Number — Compulsory */}
                    <Field label={isMr ? 'जामीनदाराचा आधार नंबर (१२ अंकी)' : isHi ? 'गारंटर का आधार नंबर (१२ अंक)' : 'Guarantor Aadhaar Number (12-digit)'} required error={formErrors.guarantorAadhaar}>
                      <input
                        type="text"
                        name="guarantorAadhaar"
                        value={formData.guarantorAadhaar}
                        onChange={(e) => {
                          // Only allow digits and spaces
                          const raw = e.target.value.replace(/[^\d]/g, '').slice(0, 12);
                          const formatted = raw.replace(/(\d{4})(\d{0,4})(\d{0,4})/, (_m, a, b, c) =>
                            [a, b, c].filter(Boolean).join(' ')
                          );
                          setFormData(prev => ({ ...prev, guarantorAadhaar: formatted }));
                          if (formErrors.guarantorAadhaar) setFormErrors(prev => { const u = { ...prev }; delete u.guarantorAadhaar; return u; });
                        }}
                        inputMode="numeric"
                        placeholder={isMr ? '१२ अंकी आधार क्रमांक प्रविष्ट करा' : isHi ? '१२ अंकों का आधार नंबर दर्ज करें' : 'Enter 12-digit Aadhaar number'}
                        maxLength={14}
                        className={inputCls(formErrors.guarantorAadhaar) + ' font-mono tracking-wider'}
                      />
                    </Field>

                    <Field label={isMr ? 'नातेसंबंध' : isHi ? 'संबंध' : 'Relation with Guarantor'} required error={formErrors.guarantorRelation}>
                      <input
                        type="text"
                        name="guarantorRelation"
                        value={formData.guarantorRelation}
                        onChange={handleChange}
                        placeholder={isMr ? 'नातेसंबंध प्रविष्ट करा' : isHi ? 'संबंध दर्ज करें' : 'Enter relation with guarantor'}
                        className={inputCls(formErrors.guarantorRelation)}
                      />
                    </Field>
                  </div>
                </div>
              )}

              {/* ═══════════════════════════════════════════════════════════ */}
              {/* STEP 5: DOCUMENTS UPLOAD & GOOGLE DRIVE                     */}
              {/* ═══════════════════════════════════════════════════════════ */}
              {currentStep === 5 && (
                <div className="space-y-4">
                  {/* Top Notice */}
                  <div className="bg-blue-950/40 border border-blue-800/40 rounded-2xl p-3.5 flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                      <FileText size={11} />
                    </div>
                    <div className="text-xs text-blue-200 font-medium leading-relaxed font-devanagari space-y-1">
                      <p>
                        {isMr
                          ? 'कृपया तुमची मूळ कागदपत्रे स्पष्ट फोटो किंवा PDF स्वरूपात अपलोड करा. ही कागदपत्रे थेट सुरक्षित Google Drive वर सेव्ह केली जातील.'
                          : isHi
                          ? 'कृपया अपने मूल दस्तावेज़ स्पष्ट फोटो या पीडीएफ प्रारूप में अपलोड करें। ये दस्तावेज़ सीधे सुरक्षित Google Drive पर सहेजे जाएंगे।'
                          : 'Please upload clear photos or PDF of your documents. They will be saved securely to your Google Drive.'}
                      </p>
                    </div>
                  </div>

                  {/* Upload Error banner if any */}
                  {uploadError && (
                    <div className="bg-red-500/10 border border-red-500/40 rounded-xl p-3 flex items-center gap-2 text-red-300 text-xs">
                      <AlertCircle size={15} className="shrink-0" />
                      <span>{uploadError}</span>
                    </div>
                  )}

                  {/* Document Upload Cards */}
                  <div className="space-y-3">
                    {[
                      {
                        docKey: 'aadhaarDoc' as const,
                        flagKey: 'docAadhaar' as const,
                        mr: 'आधार कार्ड प्रत (दोन्ही बाजू)',
                        hi: 'आधार कार्ड प्रति (दोनों तरफ)',
                        en: 'Aadhaar Card Copy (Front & Back)',
                        subMr: 'दोन्ही बाजूंची स्पष्ट फोटो प्रत किंवा PDF',
                        subHi: 'दोनों तरफ की स्पष्ट फोटो या पीडीएफ',
                        subEn: 'Clear copy of front & back side or PDF',
                        icon: '🪪',
                        mandatory: true,
                      },
                      {
                        docKey: 'panDoc' as const,
                        flagKey: 'docPan' as const,
                        mr: 'पॅन कार्ड प्रत',
                        hi: 'पैन कार्ड प्रति',
                        en: 'PAN Card Copy',
                        subMr: 'स्पष्ट फोटोकॉपी किंवा PDF',
                        subHi: 'स्पष्ट फोटोकॉपी या पीडीएफ',
                        subEn: 'Clear copy or PDF',
                        icon: '💳',
                        mandatory: true,
                      },
                      {
                        docKey: 'photoDoc' as const,
                        flagKey: 'docPhoto' as const,
                        mr: 'अर्जदाराचा पासपोर्ट फोटो / सेल्फी',
                        hi: 'आवेदक का पासपोर्ट फोटो / सेल्फी',
                        en: 'Applicant Passport Photo / Selfie',
                        subMr: 'स्पष्ट चेहरा दिसणारा फोटो',
                        subHi: 'स्पष्ट चेहरा दिखने वाला फोटो',
                        subEn: 'Clear photo showing face',
                        icon: '📷',
                        mandatory: false,
                      },
                      {
                        docKey: 'businessProofDoc' as const,
                        flagKey: 'docBusinessProof' as const,
                        mr: 'व्यवसाय पुरावा / दुकानाचा फोटो',
                        hi: 'व्यवसाय प्रमाण / दुकान का फोटो',
                        en: 'Business Proof / Shop Photo',
                        subMr: 'दुकानाचे बोर्ड, भाडेकरार, किंवा जीएसटी / उद्यम',
                        subHi: 'दुकान का बोर्ड, रेंट एग्रीमेंट या उद्योग प्रमाण',
                        subEn: 'Shop board, rent deed or business registration',
                        icon: '🏪',
                        mandatory: false,
                      },
                    ].map((doc) => {
                      const file = formData[doc.docKey];
                      const isUploadingThis = uploadingDocKey === doc.docKey;
                      const hasError = formErrors[doc.docKey];

                      return (
                        <div
                          key={doc.docKey}
                          className={`rounded-2xl border transition-all p-4 ${
                            file
                              ? 'bg-[#0b241c]/80 border-emerald-500/60 shadow-md'
                              : hasError
                              ? 'bg-red-500/5 border-red-500/50'
                              : 'bg-[#122247] border-slate-700/80 hover:border-slate-500'
                          }`}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            {/* Left: Info */}
                            <div className="flex items-start gap-3">
                              <div className="text-2xl mt-0.5">{doc.icon}</div>
                              <div className="space-y-0.5">
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className="text-sm font-bold text-white">
                                    {isMr ? doc.mr : isHi ? doc.hi : doc.en}
                                  </span>
                                  {doc.mandatory ? (
                                    <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 border border-amber-500/40 text-amber-300 px-2 py-0.5 rounded-md flex items-center gap-1">
                                      <Lock size={9} /> {isMr ? 'अनिवार्य' : isHi ? 'अनिवार्य' : 'Mandatory'}
                                    </span>
                                  ) : (
                                    <span className="text-[10px] font-medium text-slate-400 bg-slate-800 px-2 py-0.5 rounded-md">
                                      {isMr ? 'ऐच्छिक' : isHi ? 'वैकल्पिक' : 'Optional'}
                                    </span>
                                  )}
                                </div>
                                <p className="text-[11px] text-slate-400 font-devanagari">
                                  {isMr ? doc.subMr : isHi ? doc.subHi : doc.subEn}
                                </p>
                              </div>
                            </div>

                            {/* Right: Uploaded state OR Action buttons */}
                            {file ? (
                              <div className="flex items-center gap-2 bg-[#103328] border border-emerald-500/40 rounded-xl p-2 sm:ml-auto">
                                {file.mimeType.startsWith('image/') ? (
                                  <img
                                    src={file.base64}
                                    alt={file.name}
                                    className="w-10 h-10 rounded-lg object-cover border border-emerald-500/50 shrink-0"
                                  />
                                ) : (
                                  <div className="w-10 h-10 rounded-lg bg-red-600/20 border border-red-500/40 text-red-300 flex items-center justify-center font-bold text-[10px] shrink-0">
                                    PDF
                                  </div>
                                )}
                                <div className="text-left pr-2 min-w-[100px] max-w-[150px]">
                                  <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-400">
                                    <CheckCircle2 size={11} className="shrink-0" />
                                    <span>{isMr ? 'जोडली' : isHi ? 'संलग्न' : 'Attached'}</span>
                                  </div>
                                  <p className="text-[11px] text-white font-mono truncate font-medium">
                                    {file.name}
                                  </p>
                                  <p className="text-[9px] text-slate-400 font-mono">
                                    {formatFileSize(file.size)}
                                  </p>
                                </div>

                                <div className="flex items-center gap-1">
                                  <label
                                    title={isMr ? 'दुसरी फाईल निवडा' : isHi ? 'दूसरी फाइल चुनें' : 'Replace file'}
                                    className="p-2 rounded-lg bg-[#184537] hover:bg-[#205b49] text-slate-200 cursor-pointer transition"
                                  >
                                    <FileUp size={14} />
                                    <input
                                      type="file"
                                      accept={doc.docKey === 'photoDoc' ? 'image/*' : 'image/*,application/pdf'}
                                      className="hidden"
                                      onChange={(e) => handleFileUpload(e, doc.docKey, doc.flagKey)}
                                    />
                                  </label>
                                  <button
                                    type="button"
                                    title={isMr ? 'फाईल हटवा' : isHi ? 'फाइल हटाएं' : 'Remove file'}
                                    onClick={() => handleRemoveDoc(doc.docKey, doc.flagKey)}
                                    className="p-2 rounded-lg bg-[#184537] hover:bg-red-950 hover:text-red-300 text-slate-400 cursor-pointer transition"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2 sm:ml-auto">
                                {isUploadingThis ? (
                                  <div className="px-4 py-2 rounded-xl bg-blue-900/40 border border-blue-600 text-blue-300 text-xs flex items-center gap-2">
                                    <Loader2 size={14} className="animate-spin" />
                                    <span>{isMr ? 'प्रक्रिया चालू...' : isHi ? 'प्रोसेसिंग...' : 'Processing...'}</span>
                                  </div>
                                ) : (
                                  <>
                                    {/* Choose File Button */}
                                    <label className="cursor-pointer px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-bold text-xs flex items-center gap-1.5 transition shadow shadow-blue-600/30">
                                      <Upload size={13} />
                                      <span>{isMr ? 'फाईल निवडा' : isHi ? 'फाइल चुनें' : 'Choose File'}</span>
                                      <input
                                        type="file"
                                        accept={doc.docKey === 'photoDoc' ? 'image/*' : 'image/*,application/pdf'}
                                        className="hidden"
                                        onChange={(e) => handleFileUpload(e, doc.docKey, doc.flagKey)}
                                      />
                                    </label>

                                    {/* Camera Button for quick phone capture */}
                                    <label
                                      title={isMr ? 'थेट कॅमेऱ्याने फोटो काढा' : isHi ? 'सीधे कैमरे से फोटो लें' : 'Snap photo with camera'}
                                      className="cursor-pointer px-3 py-2 rounded-xl bg-[#192744] hover:bg-slate-700 active:scale-95 text-slate-200 border border-slate-600 font-bold text-xs flex items-center gap-1.5 transition"
                                    >
                                      <Camera size={13} />
                                      <span className="hidden xs:inline">{isMr ? 'कॅमेरा' : isHi ? 'कैमरा' : 'Camera'}</span>
                                      <input
                                        type="file"
                                        accept="image/*"
                                        capture="environment"
                                        className="hidden"
                                        onChange={(e) => handleFileUpload(e, doc.docKey, doc.flagKey)}
                                      />
                                    </label>
                                  </>
                                )}
                              </div>
                            )}
                          </div>

                          {/* Inline validation error message */}
                          {hasError && (
                            <p className="text-xs font-semibold text-red-400 mt-2 flex items-center gap-1 font-devanagari">
                              <AlertCircle size={12} className="shrink-0" />
                              <span>{hasError}</span>
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Fallback to WhatsApp option toggle */}
                  <div className="bg-[#122247] border border-blue-800/40 rounded-2xl p-4 flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="skipUploadCheckbox"
                      checked={skipUploadToWhatsApp}
                      onChange={(e) => {
                        setSkipUploadToWhatsApp(e.target.checked);
                        if (e.target.checked) {
                          setFormErrors(prev => {
                            const u = { ...prev };
                            delete u.aadhaarDoc;
                            delete u.panDoc;
                            return u;
                          });
                        }
                      }}
                      className="mt-1 w-4 h-4 rounded accent-blue-500 cursor-pointer"
                    />
                    <label htmlFor="skipUploadCheckbox" className="text-xs text-slate-300 font-devanagari cursor-pointer select-none leading-relaxed">
                      <span className="font-bold text-white block">
                        {isMr ? 'कागदपत्रे आता सोबत नाहीत? नंतर WhatsApp वर पाठवा' : isHi ? 'दस्तावेज़ अभी साथ नहीं हैं? बाद में व्हाट्सएप पर भेजें' : 'Cannot upload right now? Send later on WhatsApp'}
                      </span>
                      {isMr
                        ? 'यावर टिक केल्यास तुम्ही आता कागदपत्रे अपलोड न करताही पुढील स्वाक्षरी पायरी पूर्ण करू शकता.'
                        : isHi
                        ? 'इस पर टिक करने से आप अभी दस्तावेज़ अपलोड किए बिना भी अगला हस्ताक्षर चरण पूरा कर सकते हैं।'
                        : 'Checking this allows you to proceed to the signature step and provide physical/WhatsApp documents later.'}
                    </label>
                  </div>

                  {/* Info notice about Google Drive */}
                  <div className="bg-emerald-950/30 border border-emerald-800/30 rounded-2xl p-3.5 flex items-start gap-2.5 text-emerald-300 text-xs">
                    <FolderCheck size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                    <p className="font-devanagari leading-relaxed text-slate-300 text-[11px]">
                      {isMr
                        ? 'अपलोड केलेली सर्व कागदपत्रे थेट तुमच्या वैयक्तिक Google Drive मधील स्वतंत्र अर्जदार फोल्डरमध्ये सुरक्षितपणे साठवली जातील.'
                        : isHi
                        ? 'अपलोड किए गए सभी दस्तावेज़ सीधे आपके व्यक्तिगत Google Drive के समर्पित आवेदक फोल्डर में सुरक्षित रूप से सहेजे जाएंगे।'
                        : 'All uploaded documents are directly stored inside your personal Google Drive dedicated applicant folder.'}
                    </p>
                  </div>
                </div>
              )}

              {/* STEP 6: DECLARATION & SIGNATURE                             */}
              {/* ═══════════════════════════════════════════════════════════ */}
              {currentStep === 6 && (
                <div className="space-y-4">
                  {/* Declaration box */}
                  <div className="bg-[#122247]/60 border border-slate-700/80 rounded-2xl p-5 text-slate-300 space-y-3">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                      {isMr ? 'अर्जदाराची घोषणा' : isHi ? 'आवेदक की घोषणा' : 'Applicant Declaration'}
                    </p>
                    {isMr ? (
                      <p className="text-xs text-slate-300 leading-relaxed font-devanagari">
                        "मी येथे घोषित करतो/करते की वरील सर्व माहिती माझ्या माहितीनुसार खरी आणि अचूक आहे. कोणतीही माहिती खोटी आढळल्यास संस्थेला माझा अर्ज नाकारण्याचा अधिकार आहे."
                      </p>
                    ) : isHi ? (
                      <p className="text-xs text-slate-300 leading-relaxed font-medium">
                        "मैं एतद्द्वारा घोषित करता/करती हूँ कि उपरोक्त सभी जानकारी मेरे ज्ञान के अनुसार सत्य एवं सही है। यदि कोई भी जानकारी असत्य पाई जाती है, तो संस्था को मेरा आवेदन अस्वीकार करने का पूर्ण अधिकार है।"
                      </p>
                    ) : (
                      <p className="text-xs text-slate-300 leading-relaxed font-medium">
                        "I hereby declare that all the information provided above is true and correct to the best of my knowledge. If any information is found to be false, the company has the right to reject my loan application."
                      </p>
                    )}

                    <label className={`flex items-center gap-3 mt-3 p-3.5 rounded-xl border cursor-pointer transition-all ${formData.declarationAccepted ? 'border-blue-500 bg-blue-600/20' : 'border-slate-700 bg-[#192744]'
                      }`}>
                      <input type="checkbox" name="declarationAccepted" checked={formData.declarationAccepted} onChange={handleChange} className="sr-only" />
                      <div className={`w-5 h-5 rounded-lg border flex items-center justify-center shrink-0 transition-all ${formData.declarationAccepted ? 'border-blue-500 bg-blue-600' : 'border-slate-600 bg-[#101c36]'
                        }`}>
                        {formData.declarationAccepted && <Check size={12} className="text-white stroke-[3]" />}
                      </div>
                      <span className="text-xs font-bold text-white">
                        {isMr ? 'मला ही घोषणा मान्य व स्वीकार आहे *' : isHi ? 'मुझे यह घोषणा स्वीकार एवं मान्य है *' : 'I accept this declaration *'}
                      </span>
                    </label>
                    {formErrors.declarationAccepted && (
                      <p className="text-[11px] text-red-400 mt-1 flex items-center gap-1 font-medium">
                        <AlertCircle size={12} /> {formErrors.declarationAccepted}
                      </p>
                    )}
                  </div>

                  {/* Signature */}
                  <div>
                    <Field
                      label={isMr ? 'अर्जदाराची स्वाक्षरी' : isHi ? 'आवेदक के हस्ताक्षर' : 'Applicant Signature'}
                      required
                      error={formErrors.applicantSignature}
                    >
                      <SignaturePad
                        signature={formData.applicantSignature}
                        signatureType={formData.signatureType}
                        onChange={handleSignatureChange}
                        fullName={formData.fullName}
                      />
                    </Field>
                  </div>

                  {/* Submission guide */}
                  <div className="bg-[#122247] border border-slate-700/80 rounded-2xl p-4 space-y-1.5">
                    <p className="text-[10px] font-bold text-blue-300 uppercase tracking-widest flex items-center gap-1.5">
                      <ShieldCheck size={14} className="text-blue-400" />
                      <span>{isMr ? 'अर्ज सादर करण्यासंबंधी सूचना' : isHi ? 'आवेदन जमा करने संबंधी निर्देश' : 'Application Submission Guide'}</span>
                    </p>
                    <p className="text-xs text-slate-300 leading-relaxed font-devanagari">
                      {isMr
                        ? '"अर्ज सादर करा" बटणावर क्लिक केल्यावर — तुमचा स्वाक्षरी केलेला अर्ज तयार होईल व व्हॉट्सॲप डेस्क उघडेल. व्हॉट्सॲपमध्ये 📎 Attach → Document मधून डाऊनलोड केलेली फाईल निवडून पाठवा.'
                        : isHi
                        ? '"आवेदन जमा करें" बटन पर क्लिक करने पर — आपका हस्ताक्षरित आवेदन पत्र तैयार होगा और व्हाट्सएप डेस्क खुल जाएगा। व्हाट्सएप में 📎 Attach → Document से डाउनलोड की गई फाइल चुनकर भेजें।'
                        : 'Click "Submit Application" — your signed application docket will be generated and WhatsApp desk will open. In WhatsApp, tap 📎 Attach → Document → Select the application file → Send.'}
                    </p>
                  </div>

                  {/* Application summary */}
                  <div className="bg-[#122247] border border-blue-500/30 rounded-2xl p-4 sm:p-5">
                    <p className="text-blue-300 text-[10px] font-bold uppercase tracking-widest mb-3">
                      {isMr ? 'अर्ज सारांश' : isHi ? 'आवेदन सारांश' : 'Application Summary'}
                    </p>
                    <div className="grid grid-cols-2 gap-y-2.5 gap-x-4">
                      {[
                        { label: isMr ? 'अर्ज क्र.' : isHi ? 'आवेदन क्र.' : 'App ID', val: formData.applicationNo },
                        { label: isMr ? 'तारीख' : isHi ? 'दिनांक' : 'Date', val: formData.applicationDate },
                        { label: isMr ? 'अर्जदार' : isHi ? 'आवेदक' : 'Applicant', val: formData.fullName || '—' },
                        { label: isMr ? 'मोबाइल' : isHi ? 'मोबाइल' : 'Mobile', val: formData.mobileNumber || '—' },
                        { label: isMr ? 'पॅन' : isHi ? 'पैन' : 'PAN', val: formData.panNumber || '—' },
                        { label: isMr ? 'कर्ज रक्कम' : isHi ? 'ऋण राशि' : 'Loan Amount', val: formData.requiredLoanAmount ? `₹ ${Number(formData.requiredLoanAmount).toLocaleString('en-IN')}/-` : '—' },
                        { label: isMr ? 'परतफेड' : isHi ? 'पुनर्भुगतान' : 'Repayment', val: formData.repaymentPlan ? (isMr ? (formData.repaymentPlan === 'Daily' ? 'दैनिक' : 'साप्ताहिक') : isHi ? (formData.repaymentPlan === 'Daily' ? 'दैनिक' : 'साप्ताहिक') : formData.repaymentPlan) : '—' },
                      ].map(item => (
                        <div key={item.label}>
                          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">{item.label}</p>
                          <p className="text-white text-xs font-bold font-mono truncate">{item.val}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ── Navigation Footer for Steps 1 to 6 ──────────────────────── */}
              <div className="mt-8 pt-6 border-t border-slate-700/60 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={handleBack}
                  disabled={currentStep === 1}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-slate-700 bg-[#132247] hover:bg-[#1b2f60] text-slate-300 text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer min-h-[46px]"
                >
                  <ChevronLeft size={16} />
                  <span>{isMr ? 'मागे' : isHi ? 'पीछे' : 'Back'}</span>
                </button>

                <div className="hidden sm:flex items-center gap-1.5">
                  {STEPS.map(s => (
                    <div
                      key={s.id}
                      className={`rounded-full transition-all duration-300 ${s.id === currentStep ? 'w-5 h-2 bg-blue-500' : s.id < currentStep ? 'w-2 h-2 bg-blue-600' : 'w-2 h-2 bg-slate-700'
                        }`}
                    />
                  ))}
                </div>

                {currentStep < 6 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs sm:text-sm font-semibold uppercase tracking-wider shadow-lg shadow-blue-600/30 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer min-h-[46px]"
                  >
                    <span>{isMr ? 'पुढे जा' : isHi ? 'आगे बढ़ें' : 'Continue'}</span>
                    <ArrowRight size={16} />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isGeneratingPdf}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold uppercase tracking-wider shadow-lg shadow-emerald-600/30 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 cursor-pointer min-h-[46px]"
                  >
                    {isGeneratingPdf ? (
                      <span>{isMr ? 'तयार होत आहे...' : isHi ? 'तैयार हो रहा है...' : 'Generating...'}</span>
                    ) : (
                      <>
                        <Send size={15} />
                        <span>{isMr ? 'अर्ज सादर करा' : isHi ? 'आवेदन जमा करें' : 'Submit Application'}</span>
                      </>
                    )}
                  </button>
                )}
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* ─── Bottom Anti-Fraud Warning Ticker Bar ─── */}
      <div className="bg-[#091530] border-t border-[#15274d] overflow-hidden py-3 mt-14">
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

      {/* Hidden PDF render target */}
      <div style={{ position: 'fixed', top: 0, left: 0, width: '794px', minWidth: '794px', maxWidth: '794px', backgroundColor: '#ffffff', zIndex: -99999, opacity: 1, pointerEvents: 'none' }}>
        <PdfDocument formData={formData} id="offscreen-pdf-render-target" />
      </div>
    </div>
  );
};

