// ─────────────────────────────────────────────────────────────────────────────
// Bharat Enterprises Finance Services — Google Apps Script Web App
// Paste this entire file into your Apps Script editor (Extensions → Apps Script)
// Replace YOUR_SHEET_ID_HERE with your actual Google Sheet ID from the URL.
// Deploy as Web App: Execute as "Me", Access "Anyone".
// ─────────────────────────────────────────────────────────────────────────────

var SHEET_ID = 'YOUR_SHEET_ID_HERE';    // ← Replace with your Sheet ID
var SHEET_NAME = 'Loan Applications';   // ← Tab name inside the spreadsheet

// Column headers — order must match the row array in doPost()
var HEADERS = [
  'Timestamp',
  'Application No',
  'Application Date',
  'Full Name',
  'Father / Husband Name',
  'Date of Birth',
  'Mobile Number',
  'Aadhaar Number',
  'PAN Number',
  'Full Address',
  'Business Name',
  'Business Type',
  'Business Vintage',
  'Business Address',
  'Loan Amount (₹)',
  'Repayment Plan',
  'Guarantor Name',
  'Guarantor Mobile',
  'Guarantor Aadhaar',
  'Guarantor Relation',
  'Guarantor Address',
  'Language',
];

// ── Utility: get or create the target sheet with header row ──────────────────
function getOrCreateSheet() {
  var ss = SpreadsheetApp.openById(SHEET_ID);
  var sheet = ss.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(HEADERS);
    // Style the header row
    var headerRange = sheet.getRange(1, 1, 1, HEADERS.length);
    headerRange.setBackground('#0F3876');
    headerRange.setFontColor('#FFFFFF');
    headerRange.setFontWeight('bold');
    headerRange.setFontSize(10);
    sheet.setFrozenRows(1);
    // Auto-resize columns
    sheet.autoResizeColumns(1, HEADERS.length);
  }

  return sheet;
}

// ── Handle GET (health check / browser test) ─────────────────────────────────
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok', message: 'Bharat Enterprises Loan Form endpoint is live.' }))
    .setMimeType(ContentService.MimeType.JSON);
}

// ── Handle POST (form submission) ────────────────────────────────────────────
function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);

    var row = [
      new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),   // Timestamp (IST)
      data.applicationNo        || '',
      data.applicationDate      || '',
      data.fullName             || '',
      data.fatherHusbandName    || '',
      data.dob                  || '',
      data.mobileNumber         || '',
      data.aadhaarNumber        || '',
      data.panNumber            || '',
      data.fullAddress          || '',
      data.businessName         || '',
      data.typeOfBusiness       || '',
      data.businessVintage      || '',
      data.businessAddress      || '',
      data.requiredLoanAmount   || '',
      data.repaymentPlan        || '',
      data.guarantorName        || '',
      data.guarantorMobile      || '',
      data.guarantorAadhaar     || '',
      data.guarantorRelation    || '',
      data.guarantorAddress     || '',
      data.language             || '',
    ];

    var sheet = getOrCreateSheet();
    sheet.appendRow(row);

    return ContentService
      .createTextOutput(JSON.stringify({ result: 'success', appNo: data.applicationNo }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'error', message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
