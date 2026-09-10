import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'mr' | 'hi';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Nav
    'nav.home': 'Home',
    'nav.loanPlans': 'Loan Plans',
    'nav.about': 'About Us',
    'nav.portal': 'Application Portal',
    'nav.contact': 'Contact Us',
    'nav.apply': 'Apply Online',
    'nav.applyPdf': 'Apply Online',
    'nav.whatsAppDesk': 'WhatsApp Desk',
    'nav.topStrip': 'Daily & Weekly Micro Financing for Small Businesses',
    'nav.slogan': 'Small Loan for Big Growth',
    'nav.call': 'Call',

    // Hero
    'hero.badge': 'Transparent Micro Finance',
    'hero.title1': 'Empowering Local Commerce with',
    'hero.title2': 'Accessible Micro Finance.',
    'hero.slogan': '"Small Loan for Big Growth" — Your Trust, Our Support',
    'hero.desc': 'Bharat Enterprises provides structured working capital, daily collection loans from ₹ 100/day, and flexible weekly financing up to ₹ 4,50,000 for shop owners, traders, and entrepreneurs with minimal paperwork.',
    'hero.feat1Title': 'Easy Application',
    'hero.feat1Desc': 'Transparent verification & direct disbursement.',
    'hero.feat2Title': '₹ 100/Day Plan',
    'hero.feat2Desc': '100-day structured daily repayments.',
    'hero.feat3Title': 'Minimal KYC',
    'hero.feat3Desc': 'Aadhaar & PAN basic documentation.',
    'hero.ctaPrimary': 'Apply for Loan',
    'hero.ctaSecondary': 'View Repayment Schedule',
    'hero.helpline': 'Direct Helpline:',
    'hero.cardTag': 'Featured Scheme',
    'hero.cardScheme': 'Daily Collection Plan',
    'hero.cardPlan': '₹ 45k Plan',
    'hero.cardSub': 'Standard Working Capital Loan',
    'hero.cardTenure': 'Tenure: 14 Weeks 2 Days (100 Days total)',
    'hero.cardDaily': 'Daily Installment',
    'hero.cardWeekly': 'Weekly Installment',
    'hero.cardTotal': 'Total Net Repayment',
    'hero.cardRepay1': 'Repay via PhonePe, QR Code, or Doorstep collector',
    'hero.cardRepay2': 'Flat 1% Processing Fee & Zero Surcharges',
    'hero.cardApply': 'Apply for this Loan Plan',

    // About
    'about.badge': 'About Bharat Enterprises Finance Services',
    'about.title1': 'Empowering Small Businesses with',
    'about.title2': 'Accessible & Reliable Capital.',
    'about.desc1': 'Bharat Enterprises Finance Services provides accessible and transparent micro-loans to small enterprise owners, retail merchants, shopkeepers, and self-employed individuals who need timely working capital.',
    'about.desc2': 'We believe that every small business has the potential for tremendous growth. That is why we offer "Small Loan for Big Growth" — without cumbersome paperwork and easy daily or weekly installments!',
    'about.pillar1': '100% Transparent',
    'about.pillar1Desc': 'No hidden fees, flat 1% processing fee, clear daily & weekly fixed repayment schedule.',
    'about.pillar2': 'Growth Capital',
    'about.pillar2Desc': 'From ₹ 9,000 up to ₹ 4,50,000 tailored for inventory and business needs.',
    'about.pillar3': 'Community Focused',
    'about.pillar3Desc': 'Dedicated support and convenient repayment assistance for shop owners.',
    'about.pillar4': 'Digital Processing',
    'about.pillar4Desc': 'Online loan application & direct WhatsApp desk assistance.',

    // Calculator & Plans
    'plans.badge': 'Standard 14-Tier Financing Structure',
    'plans.title': 'Small Loan for Big Growth (Daily & Weekly Loan Plans)',
    'plans.sub': 'Fixed 100-day daily & weekly installment plans designed for vendors, retailers, and local businesses.',
    'plans.stat1': 'Disbursement Process',
    'plans.stat2': 'Standard Tenure',
    'plans.stat3': 'Collection Mode',
    'plans.calcTitle': 'Quick Loan Calculator',
    'plans.calcSub': 'Adjust the loan amount to inspect the exact daily/weekly repayment schedule and processing fee',
    'plans.calcAmount': 'Select Amount:',
    'plans.calcDaily': 'Daily',
    'plans.calcWeekly': 'Weekly',
    'plans.calcTotal': 'Total',
    'plans.calcFee': 'Fee 1% (Processing)',
    'plans.calcForDays': 'for 100 days',
    'plans.calcForWks': 'for 14.2 wks',
    'plans.calcNet': 'Net repayment',
    'plans.calcIncludes': 'Includes flat 1% processing fee & prompt doorstep or UPI collection',
    'plans.calcApply': 'Apply for this Amount',
    'plans.tableHeader': '14-Tier Standard Repayment Schedule',
    'plans.swipe': '👉 Swipe table horizontally',
    'plans.thSn': 'SN',
    'plans.thLoan': 'LOAN AMOUNT',
    'plans.thProcessingFee': 'FEE 1% (PROCESSING)',
    'plans.thDaily': 'DAILY EMI',
    'plans.thWeekly': 'WEEKLY EMI',
    'plans.thTotal': 'TOTAL PAYABLE',
    'plans.thAction': 'ACTION',
    'plans.btnDaily': 'Apply Daily',
    'plans.btnWeekly': 'Apply Weekly',

    // Form
    'form.badge': 'Loan Application Portal',
    'form.title': 'Loan Application Form',
    'form.sub': 'Fill out the form below to complete your application and submit it directly to our desk on WhatsApp',
    'form.btnAutofill': 'Auto Fill Sample Data',
    'form.btnNewApp': 'New App ID',
    'form.tabEdit': '1. Edit Details',
    'form.tabPreview': '2. Live Document Preview',
    'form.btnSavePdf': 'Save Application',
    'form.btnSendWhatsApp': 'Submit Application to WhatsApp (+91 91302 30233)',
    'form.tipTitle': 'Important Tip for Application Submission:',
    'form.tipBody': 'When you click the green button below, your loan details will be pre-filled automatically and your signed application document will download to your device. In your WhatsApp chat with Admin (+91 91302 30233), simply click the 📎 (Paperclip) / ➕ icon → select Document → attach the downloaded file and hit Send!',
    'form.sec1': '1. Personal Information',
    'form.fullName': 'Full Name',
    'form.father': 'Father / Husband Name',
    'form.dob': 'Date of Birth',
    'form.mobile': 'Mobile Number',
    'form.aadhaar': 'Aadhaar Number',
    'form.pan': 'PAN Number (Optional)',
    'form.address': 'Full Residential Address',
    'form.sec2': '2. Business Information',
    'form.bizName': 'Business Name',
    'form.bizType': 'Type of Business',
    'form.bizAddress': 'Business Address',
    'form.bizYears': 'Years in Business',
    'form.sec3': '3. Loan Details',
    'form.reqAmount': 'Required Loan Amount',
    'form.purpose': 'Purpose of Loan',
    'form.repayPlan': 'Repayment Plan',
    'form.sec4': '4. Guarantor Details (Compulsory)',
    'form.gName': 'Guarantor Name',
    'form.gMobile': 'Guarantor Mobile Number',
    'form.gAddress': 'Guarantor Address',
    'form.gRelation': 'Relationship',
    'form.sec5': '5. Required Documents',
    'form.sec6': '6. Declaration & Signature',
    'form.declaration': '"I hereby declare that all the above information provided by me is true and correct. If any information found wrong, the company has the right to reject my loan application."',
    'form.declarationAccept': 'I accept this declaration *',
    'form.signatureLabel': 'Applicant Signature',

    // Contact
    'contact.badge': 'Contact & Support',
    'contact.title': 'Get in Touch with Bharat Enterprises',
    'contact.sub': 'Have questions about our daily/weekly loan plans or need assistance with your application? Connect with us directly on WhatsApp or Phone.',
    'contact.sendInquiry': 'Send a Loan Inquiry',
  },
  mr: {
    // Nav
    'nav.home': 'मुख्यपृष्ठ',
    'nav.loanPlans': 'कर्ज योजना',
    'nav.about': 'आमच्याबद्दल',
    'nav.portal': 'अर्ज पोर्टल',
    'nav.contact': 'संपर्क',
    'nav.apply': 'ऑनलाइन अर्ज',
    'nav.applyPdf': 'ऑनलाइन अर्ज',
    'nav.whatsAppDesk': 'व्हॉट्सॲप डेस्क',
    'nav.topStrip': 'लहान व्यवसायांसाठी दैनिक व साप्ताहिक मायक्रो फायनान्स सेवा',
    'nav.slogan': 'मोठ्या प्रगतीसाठी लहान कर्ज',
    'nav.call': 'कॉल करा',

    // Hero
    'hero.badge': 'पारदर्शक मायक्रो फायनान्स',
    'hero.title1': 'स्थानिक व्यापाराला गती देणारी',
    'hero.title2': 'सुलभ मायक्रो फायनान्स सेवा.',
    'hero.slogan': '"मोठ्या प्रगतीसाठी लहान कर्ज" — तुमचा विश्वास, आमची साथ',
    'hero.desc': 'भारत एंटरप्राइजेस सर्व छोटे व्यापारी, दुकानदार व व्यावसायिकांसाठी ₹ १००/दिवस पासून सुरू होणारे सुलभ दैनिक व साप्ताहिक खेळत्या भांडवलाचे कर्ज ₹ ४,५०,००० पर्यंत अत्यंत सोप्या कागदपत्रांवर उपलब्ध करून देते.',
    'hero.feat1Title': 'सोपी अर्ज प्रक्रिया',
    'hero.feat1Desc': 'सुलभ पडताळणी व थेट वितरण.',
    'hero.feat2Title': '₹ १००/दिवस योजना',
    'hero.feat2Desc': '१०० दिवसांचे सुलभ दैनिक हप्ते.',
    'hero.feat3Title': 'किमान कागदपत्रे',
    'hero.feat3Desc': 'आधार व पॅन कार्ड मूलभूत पडताळणी.',
    'hero.ctaPrimary': 'कर्ज अर्ज करा',
    'hero.ctaSecondary': 'परतफेड वेळापत्रक पहा',
    'hero.helpline': 'थेट हेल्पलाईन:',
    'hero.cardTag': 'विशेष योजना',
    'hero.cardScheme': 'दैनिक संकलन योजना',
    'hero.cardPlan': '₹ ४५ हजार योजना',
    'hero.cardSub': 'प्रमाणित खेळते भांडवल कर्ज',
    'hero.cardTenure': 'मुदत: १४ आठवडे २ दिवस (एकूण १०० दिवस)',
    'hero.cardDaily': 'दैनिक हप्ता',
    'hero.cardWeekly': 'साप्ताहिक हप्ता',
    'hero.cardTotal': 'एकूण परतफेड रक्कम',
    'hero.cardRepay1': 'फोनपे, क्यूआर कोड किंवा थेट कॅश संकलन',
    'hero.cardRepay2': 'फ्लॅट १% प्रोसेसिंग फी आणि कोणतेही छुपे शुल्क नाही',
    'hero.cardApply': 'या योजनेसाठी अर्ज करा',

    // About
    'about.badge': 'भारत एंटरप्राइजेस फायनान्स सर्व्हिसेस बद्दल',
    'about.title1': 'छोट्या व्यवसायांना भरारी देणारे',
    'about.title2': 'विश्वसनीय आणि सुलभ भांडवल.',
    'about.desc1': 'भारत एंटरप्राइजेस फायनान्स सर्व्हिसेसची स्थापना एकाच उद्देशाने झाली: स्थानिक लहान व्यावसायिक, किरकोळ दुकानदार व स्वयंरोजगार करणाऱ्यांना वेळेवर खेळते भांडवल उपलब्ध करून देणे.',
    'about.desc2': 'आमचा विश्वास आहे की प्रत्येक छोट्या व्यवसायामध्ये मोठी भरारी घेण्याची क्षमता असते. म्हणूनच आम्ही घेऊन आलो आहोत "मोठ्या प्रगतीसाठी लहान कर्ज" — किचकट कागदपत्रांशिवाय आणि सोपे रोजचे किंवा आठवड्याचे हप्ते!',
    'about.pillar1': '१००% पारदर्शक',
    'about.pillar1Desc': 'कोणतेही लपलेले शुल्क नाही, १% प्रोसेसिंग फी, स्पष्ट दैनिक व साप्ताहिक हप्ते.',
    'about.pillar2': 'विकास भांडवल',
    'about.pillar2Desc': '₹ ९,००० पासून ₹ ४,५०,००० पर्यंत आवश्यकतेनुसार कर्ज.',
    'about.pillar3': 'स्थानिक सेवा',
    'about.pillar3Desc': 'लहान व्यावसायिकांसाठी थेट दारोदारी व डिजिटल संकलन सेवा.',
    'about.pillar4': 'डिजिटल प्रक्रिया',
    'about.pillar4Desc': 'सोपी डिजिटल अर्ज प्रक्रिया व थेट व्हॉट्सॲप डेस्क साहाय्यता.',

    // Calculator & Plans
    'plans.badge': 'प्रमाणित १४-स्तरीय कर्ज रचना',
    'plans.title': 'मोठ्या प्रगतीसाठी लहान कर्ज (दैनिक व साप्ताहिक कर्ज योजना)',
    'plans.sub': 'विक्रेते, किरकोळ दुकानदार व स्थानिक दुकानांसाठी १०० दिवसांचे दैनिक व साप्ताहिक हप्ते.',
    'plans.stat1': 'वितरण प्रक्रिया',
    'plans.stat2': 'प्रमाणित मुदत',
    'plans.stat3': 'संकलन पद्धत',
    'plans.calcTitle': 'कर्ज कॅल्क्युलेटर',
    'plans.calcSub': 'कर्जाची रक्कम निवडून अचूक दैनिक/साप्ताहिक हप्ते आणि १% प्रोसेसिंग फी पहा',
    'plans.calcAmount': 'रक्कम निवडा:',
    'plans.calcDaily': 'दैनिक हप्ता',
    'plans.calcWeekly': 'साप्ताहिक हप्ता',
    'plans.calcTotal': 'एकूण परतफेड',
    'plans.calcFee': 'प्रोसेसिंग फी (१%)',
    'plans.calcForDays': '१०० दिवसांसाठी',
    'plans.calcForWks': '१४.२ आठवड्यांसाठी',
    'plans.calcNet': 'एकूण परतफेड रक्कम',
    'plans.calcIncludes': 'फ्लॅट १% प्रोसेसिंग फी व सुलभ कॅश अथवा यूपीआय संकलन समाविष्ट',
    'plans.calcApply': 'या रकमेसाठी अर्ज करा',
    'plans.tableHeader': '१४-स्तरीय प्रमाणित परतफेड वेळापत्रक',
    'plans.swipe': '👉 संपूर्ण तक्ता पाहण्यासाठी डावीकडे/उजवीकडे स्वाइप करा',
    'plans.thSn': 'क्र.',
    'plans.thLoan': 'कर्ज रक्कम',
    'plans.thProcessingFee': 'प्रोसेसिंग फी (१%)',
    'plans.thDaily': 'दैनिक हप्ता',
    'plans.thWeekly': 'साप्ताहिक हप्ता',
    'plans.thTotal': 'एकूण रक्कम',
    'plans.thAction': 'कृती',
    'plans.btnDaily': 'दैनिक अर्ज',
    'plans.btnWeekly': 'साप्ताहिक अर्ज',

    // Form
    'form.badge': 'कर्ज अर्ज पोर्टल',
    'form.title': 'कर्ज अर्ज',
    'form.sub': 'खालील फॉर्म भरा आणि तुमचा कर्ज अर्ज थेट आमच्या व्हॉट्सॲप डेस्ककडे पाठवा',
    'form.btnAutofill': 'माहिती भरा',
    'form.btnNewApp': 'नवीन अर्ज क्रमांक',
    'form.tabEdit': '१. माहिती भरा / संपादित करा',
    'form.tabPreview': '२. थेट अर्ज पूर्वावलोकन',
    'form.btnSavePdf': 'अर्ज सेव्ह करा',
    'form.btnSendWhatsApp': 'व्हॉट्सॲपवर अर्ज सादर करा (+91 91302 30233)',
    'form.tipTitle': 'व्हॉट्सॲप सबमिशनसाठी महत्त्वाची सूचना:',
    'form.tipBody': 'खालील हिरव्या बटनावर क्लिक केल्यावर तुमची संपूर्ण माहिती आपोआप व्हॉट्सॲपमध्ये भरली जाईल आणि स्वाक्षरी केलेला अर्ज डाऊनलोड होईल. व्हॉट्सॲप चॅटमध्ये फक्त 📎 / ➕ चिन्हावर क्लिक करून डाऊनलोड केलेली फाईल जोडा आणि पाठवा!',
    'form.sec1': '१. वैयक्तिक माहिती',
    'form.fullName': 'पूर्ण नाव (आधार कार्डप्रमाणे)',
    'form.father': 'वडिलांचे / पतीचे नाव',
    'form.dob': 'जन्मतारीख',
    'form.mobile': 'मोबाइल नंबर',
    'form.aadhaar': 'आधार कार्ड नंबर',
    'form.pan': 'पॅन कार्ड नंबर (असल्यास)',
    'form.address': 'पूर्ण निवासी पत्ता',
    'form.sec2': '२. व्यवसाय माहिती',
    'form.bizName': 'व्यवसायाचे / दुकानाचे नाव',
    'form.bizType': 'व्यवसायाचा प्रकार (उदा. किरकोळ, टेलर, स्टॉल)',
    'form.bizAddress': 'व्यवसायाचा / दुकानाचा पत्ता',
    'form.bizYears': 'व्यवसायातील अनुभव (वर्षे)',
    'form.sec3': '३. कर्ज तपशील',
    'form.reqAmount': 'आवश्यक कर्ज रक्कम (रुपये)',
    'form.purpose': 'कर्जाचा हेतू (उदा. स्टॉक खरेदी, व्यवसाय विस्तार)',
    'form.repayPlan': 'परतफेड योजना (दैनिक / साप्ताहिक)',
    'form.sec4': '४. जामीनदार माहिती (अनिवार्य)',
    'form.gName': 'जामीनदाराचे पूर्ण नाव',
    'form.gMobile': 'जामीनदाराचा मोबाइल नंबर',
    'form.gAddress': 'जामीनदाराचा पत्ता',
    'form.gRelation': 'नातेसंबंध (उदा. भाऊ, मित्र)',
    'form.sec5': '५. आवश्यक कागदपत्रे',
    'form.sec6': '६. घोषणा व स्वाक्षरी',
    'form.declaration': '"मी घोषित करतो/करते की मी दिलेली वरील सर्व माहिती खरी आणि अचूक आहे. कोणतीही माहिती खोटी आढळल्यास संस्था माझा अर्ज नाकारू शकते."',
    'form.declarationAccept': 'मला ही घोषणा मान्य व स्वीकार आहे *',
    'form.signatureLabel': 'अर्जदाराची स्वाक्षरी',

    // Contact
    'contact.badge': 'संपर्क व साहाय्यता',
    'contact.title': 'भारत एंटरप्राइजेसशी संपर्क साधा',
    'contact.sub': 'आमच्या कर्ज योजनांबद्दल काही प्रश्न असल्यास किंवा मदतीसाठी व्हॉट्सॲप किंवा फोनवर संपर्क साधा.',
    'contact.sendInquiry': 'कर्ज विचारणा पाठवा',
  },
  hi: {
    // Nav
    'nav.home': 'मुख्य पृष्ठ',
    'nav.loanPlans': 'ऋण योजनाएं',
    'nav.about': 'हमारे बारे में',
    'nav.portal': 'आवेदन पोर्टल',
    'nav.contact': 'संपर्क करें',
    'nav.apply': 'ऑनलाइन आवेदन',
    'nav.applyPdf': 'ऑनलाइन आवेदन',
    'nav.whatsAppDesk': 'व्हाट्सएप डेस्क',
    'nav.topStrip': 'छोटे व्यवसायों के लिए दैनिक एवं साप्ताहिक माइक्रो फाइनेंस सेवाएं',
    'nav.slogan': 'बड़ी तरक्की के लिए छोटा कर्ज',
    'nav.call': 'कॉल करें',

    // Hero
    'hero.badge': 'पारदर्शी माइक्रो फाइनेंस',
    'hero.title1': 'स्थानीय व्यापार को गति देने वाली',
    'hero.title2': 'सुलभ माइक्रो फाइनेंस सेवा।',
    'hero.slogan': '"बड़ी तरक्की के लिए छोटा कर्ज" — विश्वास आपका, साथ हमारा',
    'hero.desc': 'भारत एंटरप्राइजेज सभी छोटे व्यापारियों, दुकानदारों और व्यवसायियों के लिए ₹ १००/दिन से शुरू होने वाले सुलभ दैनिक एवं साप्ताहिक कार्यशील पूंजी ऋण ₹ ४,५०,००० तक न्यूनतम दस्तावेज़ों पर उपलब्ध कराता है।',
    'hero.feat1Title': 'आसान आवेदन प्रक्रिया',
    'hero.feat1Desc': 'सुलभ सत्यापन एवं प्रत्यक्ष वितरण।',
    'hero.feat2Title': '₹ १००/दिन योजना',
    'hero.feat2Desc': '१०० दिनों की संरचित दैनिक किस्तें।',
    'hero.feat3Title': 'न्यूनतम दस्तावेज़',
    'hero.feat3Desc': 'आधार और पैन कार्ड द्वारा बुनियादी सत्यापन।',
    'hero.ctaPrimary': 'ऋण के लिए आवेदन करें',
    'hero.ctaSecondary': 'पुनर्भुगतान सारणी देखें',
    'hero.helpline': 'सीधी हेल्पलाइन:',
    'hero.cardTag': 'विशेष योजना',
    'hero.cardScheme': 'दैनिक संग्रह योजना',
    'hero.cardPlan': '₹ ४५ हजार योजना',
    'hero.cardSub': 'मानक कार्यशील पूंजी ऋण',
    'hero.cardTenure': 'अवधि: १४ सप्ताह २ दिन (कुल १०० दिन)',
    'hero.cardDaily': 'दैनिक किस्त',
    'hero.cardWeekly': 'साप्ताहिक किस्त',
    'hero.cardTotal': 'कुल पुनर्भुगतान राशि',
    'hero.cardRepay1': 'फोनपे, क्यूआर कोड अथवा नकद संग्रह द्वारा भुगतान',
    'hero.cardRepay2': 'सपाट १% प्रोसेसिंग शुल्क और शून्य छिपा हुआ शुल्क',
    'hero.cardApply': 'इस योजना के लिए आवेदन करें',

    // About
    'about.badge': 'भारत एंटरप्राइजेज फाइनेंस सर्विसेज के बारे में',
    'about.title1': 'छोटे व्यवसायों को नई उड़ान देने वाली',
    'about.title2': 'विश्वसनीय और सुलभ पूंजी।',
    'about.desc1': 'भारत एंटरप्राइजेज फाइनेंस सर्विसेज की स्थापना एक ही उद्देश्य से हुई: स्थानीय छोटे व्यवसायियों, खुदरा दुकानदारों और स्वरोजगार करने वालों को समय पर कार्यशील पूंजी उपलब्ध कराना।',
    'about.desc2': 'हमारा विश्वास है कि प्रत्येक छोटे व्यवसाय में बड़ी प्रगति करने की क्षमता होती है। इसीलिए हम लेकर आए हैं "बड़ी तरक्की के लिए छोटा कर्ज" — बिना जटिल कागजी कार्रवाई और आसान दैनिक या साप्ताहिक किस्तों में!',
    'about.pillar1': '१००% पारदर्शी',
    'about.pillar1Desc': 'कोई छिपा हुआ शुल्क नहीं, सपाट १% प्रोसेसिंग शुल्क, स्पष्ट दैनिक और साप्ताहिक किस्तें।',
    'about.pillar2': 'विकास पूंजी',
    'about.pillar2Desc': '₹ ९,००० से ₹ ४,५०,००० तक आवश्यकतानुसार व्यावसायिक ऋण।',
    'about.pillar3': 'स्थानीय सेवा',
    'about.pillar3Desc': 'दुकानदारों के लिए सुविधाजनक संग्रह और समर्पित सहायता सेवा।',
    'about.pillar4': 'डिजिटल प्रक्रिया',
    'about.pillar4Desc': 'सरल ऑनलाइन आवेदन प्रक्रिया एवं सीधा व्हाट्सएप डेस्क सहयोग।',

    // Calculator & Plans
    'plans.badge': 'मानक १४-स्तरीय ऋण संरचना',
    'plans.title': 'बड़ी तरक्की के लिए छोटा कर्ज (दैनिक एवं साप्ताहिक ऋण योजनाएं)',
    'plans.sub': 'दुकानदारों, खुदरा विक्रेताओं और स्थानीय व्यवसायों के लिए १०० दिनों की दैनिक एवं साप्ताहिक किस्त योजनाएं।',
    'plans.stat1': 'वितरण प्रक्रिया',
    'plans.stat2': 'मानक अवधि',
    'plans.stat3': 'संग्रह पद्धति',
    'plans.calcTitle': 'ऋण ईएमआई कैलकुलेटर',
    'plans.calcSub': 'ऋण राशि चुनकर सटीक दैनिक/साप्ताहिक किस्त और १% प्रोसेसिंग शुल्क देखें',
    'plans.calcAmount': 'राशि चुनें:',
    'plans.calcDaily': 'दैनिक किस्त',
    'plans.calcWeekly': 'साप्ताहिक किस्त',
    'plans.calcTotal': 'कुल पुनर्भुगतान',
    'plans.calcFee': 'प्रोसेसिंग शुल्क (१%)',
    'plans.calcForDays': '१०० दिनों के लिए',
    'plans.calcForWks': '१४.२ सप्ताह के लिए',
    'plans.calcNet': 'कुल देय राशि',
    'plans.calcIncludes': 'सपाट १% प्रोसेसिंग शुल्क एवं सुलभ नकद अथवा यूपीआई संग्रह सम्मिलित',
    'plans.calcApply': 'इस राशि के लिए आवेदन करें',
    'plans.tableHeader': '१४-स्तरीय मानक पुनर्भुगतान अनुसूची',
    'plans.swipe': '👉 पूरी तालिका देखने के लिए दाएं/बाएं स्वाइप करें',
    'plans.thSn': 'क्र.',
    'plans.thLoan': 'ऋण राशि',
    'plans.thProcessingFee': 'प्रोसेसिंग शुल्क (१%)',
    'plans.thDaily': 'दैनिक किस्त',
    'plans.thWeekly': 'साप्ताहिक किस्त',
    'plans.thTotal': 'कुल राशि',
    'plans.thAction': 'कार्रवाई',
    'plans.btnDaily': 'दैनिक आवेदन',
    'plans.btnWeekly': 'साप्ताहिक आवेदन',

    // Form
    'form.badge': 'ऋण आवेदन पोर्टल',
    'form.title': 'ऋण आवेदन फॉर्म',
    'form.sub': 'नीचे दिया गया फॉर्म भरें और अपना ऋण आवेदन सीधे हमारे व्हाट्सएप डेस्क पर जमा करें',
    'form.btnAutofill': 'नमूना डेटा भरें',
    'form.btnNewApp': 'नया आवेदन क्रमांक',
    'form.tabEdit': '१. जानकारी भरें / संपादित करें',
    'form.tabPreview': '२. लाइव आवेदन पूर्वावलोकन',
    'form.btnSavePdf': 'आवेदन सुरक्षित करें',
    'form.btnSendWhatsApp': 'व्हाट्सएप पर आवेदन जमा करें (+91 91302 30233)',
    'form.tipTitle': 'व्हाट्सएप पर आवेदन जमा करने संबंधी महत्वपूर्ण सूचना:',
    'form.tipBody': 'नीचे दिए गए हरे बटन पर क्लिक करने पर आपका हस्ताक्षरित आवेदन पत्र डाउनलोड हो जाएगा और व्हाट्सएप चैट खुल जाएगी। व्हाट्सएप में केवल 📎 / ➕ आइकन पर क्लिक करके डाउनलोड की गई फाइल चुनें और भेजें!',
    'form.sec1': '१. व्यक्तिगत जानकारी',
    'form.fullName': 'पूरा नाम (आधार कार्ड के अनुसार)',
    'form.father': 'पिता / पति का नाम',
    'form.dob': 'जन्म तिथि',
    'form.mobile': 'मोबाइल नंबर',
    'form.aadhaar': 'आधार कार्ड नंबर',
    'form.pan': 'पैन कार्ड नंबर (वैकल्पिक)',
    'form.address': 'पूरा आवासीय पता',
    'form.sec2': '२. व्यवसाय विवरण',
    'form.bizName': 'दुकान / व्यवसाय का नाम',
    'form.bizType': 'व्यवसाय का प्रकार',
    'form.bizAddress': 'व्यवसाय का पता',
    'form.bizYears': 'व्यवसाय में अनुभव (वर्ष)',
    'form.sec3': '३. ऋण विवरण',
    'form.reqAmount': 'आवश्यक ऋण राशि',
    'form.purpose': 'ऋण का उद्देश्य',
    'form.repayPlan': 'पुनर्भुगतान योजना (दैनिक अथवा साप्ताहिक)',
    'form.sec4': '४. गारंटर विवरण (अनिवार्य)',
    'form.gName': 'गारंटर का पूरा नाम',
    'form.gMobile': 'गारंटर का मोबाइल नंबर',
    'form.gAddress': 'गारंटर का पता',
    'form.gRelation': 'गारंटर से संबंध',
    'form.sec5': '५. आवश्यक दस्तावेज़',
    'form.sec6': '६. घोषणा एवं हस्ताक्षर',
    'form.declaration': '"मैं एतद्द्वारा घोषित करता/करती हूँ कि मेरे द्वारा दी गई उपरोक्त सभी जानकारी सत्य एवं सही है। यदि कोई भी जानकारी असत्य पाई जाती है, तो कंपनी को मेरा ऋण आवेदन अस्वीकार करने का पूर्ण अधिकार है।"',
    'form.declarationAccept': 'मुझे यह घोषणा स्वीकार एवं मान्य है *',
    'form.signatureLabel': 'आवेदक के हस्ताक्षर',

    // Contact
    'contact.badge': 'संपर्क एवं सहायता',
    'contact.title': 'भारत एंटरप्राइजेज से संपर्क करें',
    'contact.sub': 'हमारी ऋण योजनाओं के संबंध में कोई प्रश्न हो अथवा सहायता के लिए व्हाट्सएप या फोन पर सीधे संपर्क करें।',
    'contact.sendInquiry': 'ऋण पूछताछ भेजें',
  }
};

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => { },
  toggleLanguage: () => { },
  t: (key: string) => key,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('befs_lang');
      return (saved === 'mr' || saved === 'en' || saved === 'hi') ? (saved as Language) : 'en';
    } catch {
      return 'en';
    }
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('befs_lang', lang);
    } catch (e) {
      console.warn('Could not save language preference:', e);
    }
  };

  const toggleLanguage = () => {
    if (language === 'en') setLanguage('hi');
    else if (language === 'hi') setLanguage('mr');
    else setLanguage('en');
  };

  const t = (key: string): string => {
    return translations[language]?.[key] || translations.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
