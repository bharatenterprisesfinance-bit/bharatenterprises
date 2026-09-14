export interface LoanFormData {
  applicationNo: string;
  // 1. Personal Information
  fullName: string;
  fatherHusbandName: string;
  dob: string;
  mobileNumber: string;
  aadhaarNumber: string;
  panNumber: string;
  fullAddress: string;

  // 2. Business Information
  businessName: string;
  typeOfBusiness: string;
  businessAddress: string;
  yearsInBusiness: string;

  // 3. Loan Details
  requiredLoanAmount: string;
  purposeOfLoan: string;
  repaymentPlan: 'Daily' | 'Weekly' | '';

  // 4. Guarantor Details
  guarantorName: string;
  guarantorMobile: string;
  guarantorAadhaar: string;
  guarantorRelation: string;

  // 5. Required Documents
  docAadhaar: boolean;
  docPan: boolean;
  docPhoto: boolean;
  docBusinessProof: boolean;
  aadhaarDoc?: UploadDocFile | null;
  panDoc?: UploadDocFile | null;
  photoDoc?: UploadDocFile | null;
  businessProofDoc?: UploadDocFile | null;
  applicationPdfDoc?: UploadDocFile | null;

  // 6. Declaration & Signature
  declarationAccepted: boolean;
  applicantSignature: string;
  signatureType: 'draw' | 'type';
  applicationDate: string;
}

export interface UploadDocFile {
  name: string;
  mimeType: string;
  base64: string;
  size: number;
}

export interface LoanPlan {
  sn: number;
  loanAmount: number;
  processingFee: number;
  dailyEmi: number;
  weeklyEmi: number;
  totalRepayment: number;
  durationText: string;
  isPopular?: boolean;
}

export const LOAN_PLANS: LoanPlan[] = [
  { sn: 1, loanAmount: 9000, processingFee: 90, dailyEmi: 100, weeklyEmi: 700, totalRepayment: 10000, durationText: "100 Days / 14 Weeks 2 Days" },
  { sn: 2, loanAmount: 18000, processingFee: 180, dailyEmi: 200, weeklyEmi: 1400, totalRepayment: 20000, durationText: "100 Days / 14 Weeks 2 Days" },
  { sn: 3, loanAmount: 27000, processingFee: 270, dailyEmi: 300, weeklyEmi: 2100, totalRepayment: 30000, durationText: "100 Days / 14 Weeks 2 Days" },
  { sn: 4, loanAmount: 36000, processingFee: 360, dailyEmi: 400, weeklyEmi: 2800, totalRepayment: 40000, durationText: "100 Days / 14 Weeks 2 Days" },
  { sn: 5, loanAmount: 45000, processingFee: 450, dailyEmi: 500, weeklyEmi: 3500, totalRepayment: 50000, durationText: "100 Days / 14 Weeks 2 Days", isPopular: true },
  { sn: 6, loanAmount: 54000, processingFee: 540, dailyEmi: 600, weeklyEmi: 4200, totalRepayment: 60000, durationText: "100 Days / 14 Weeks 2 Days" },
  { sn: 7, loanAmount: 63000, processingFee: 630, dailyEmi: 700, weeklyEmi: 4900, totalRepayment: 70000, durationText: "100 Days / 14 Weeks 2 Days" },
  { sn: 8, loanAmount: 72000, processingFee: 720, dailyEmi: 800, weeklyEmi: 5600, totalRepayment: 80000, durationText: "100 Days / 14 Weeks 2 Days" },
  { sn: 9, loanAmount: 81000, processingFee: 810, dailyEmi: 900, weeklyEmi: 6300, totalRepayment: 90000, durationText: "100 Days / 14 Weeks 2 Days" },
  { sn: 10, loanAmount: 90000, processingFee: 900, dailyEmi: 1000, weeklyEmi: 7000, totalRepayment: 100000, durationText: "100 Days / 14 Weeks 2 Days", isPopular: true },
  { sn: 11, loanAmount: 180000, processingFee: 1800, dailyEmi: 2000, weeklyEmi: 14000, totalRepayment: 200000, durationText: "100 Days / 14 Weeks 2 Days" },
  { sn: 12, loanAmount: 270000, processingFee: 2700, dailyEmi: 3000, weeklyEmi: 21000, totalRepayment: 300000, durationText: "100 Days / 14 Weeks 2 Days" },
  { sn: 13, loanAmount: 360000, processingFee: 3600, dailyEmi: 4000, weeklyEmi: 28000, totalRepayment: 400000, durationText: "100 Days / 14 Weeks 2 Days" },
  { sn: 14, loanAmount: 450000, processingFee: 4500, dailyEmi: 5000, weeklyEmi: 35000, totalRepayment: 500000, durationText: "100 Days / 14 Weeks 2 Days", isPopular: true },
];

export const COMPANY_DETAILS = {
  name: "BHARAT ENTERPRISES",
  subTitle: "FINANCE SERVICES",
  marathiName: "भारत एंटरप्राइजेस (फायनान्स)",
  hindiName: "भारत एंटरप्राइजेज (फाइनेंस सर्विसेज)",
  tagline: "SMALL LOAN FOR BIG GROWTH",
  taglineMarathi: "मोठ्या प्रगतीसाठी लहान कर्ज",
  taglineHindi: "बड़ी तरक्की के लिए छोटा कर्ज",
  sloganEnglish: "Your Trust, Our Support",
  sloganMarathi: "तुमचा विश्वास, आमची साथ",
  sloganHindi: "विश्वास आपका, साथ हमारा",
  phone: "+91 91-302-302-33",
  cleanPhone: "919130230233",
  displayPhone: "+91 91-302-302-33",
  email: "bharatenterprisesfinance@gmail.com",
  website: "bharatenterprises.vercel.app",
};
