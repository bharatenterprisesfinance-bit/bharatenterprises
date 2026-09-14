// ─────────────────────────────────────────────────────────────────────────────
// Bharat Enterprises Finance Services — Google Apps Script Web App
// ─────────────────────────────────────────────────────────────────────────────
// Instructions:
// 1. Paste this entire code into your Google Apps Script editor:
//    (In your Google Sheet: click Extensions → Apps Script).
// 2. Set SHEET_ID to your Google Sheet ID (or full Google Sheet URL).
// 3. Set DRIVE_FOLDER_ID to your Google Drive Folder ID (or full Drive URL).
// 4. Click "Deploy" (top right) → "Manage deployments" → ✏️ Edit → Version: "New version" → "Deploy".
// ─────────────────────────────────────────────────────────────────────────────

var SHEET_ID = 'YOUR_SHEET_ID_HERE';               // ← Paste your Google Sheet ID (or full Sheet URL) here
var DRIVE_FOLDER_ID = 'YOUR_DRIVE_FOLDER_ID_HERE'; // ← Paste your Google Drive Folder ID (or full Drive URL) here
var SHEET_NAME = 'Loan Applications';              // ← Tab name inside the spreadsheet

// Spreadsheet Column Headers
var HEADERS = [
  'Timestamp (IST)',
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
  'Years in Business',
  'Business Address',
  'Loan Amount (₹)',
  'Purpose of Loan',
  'Repayment Plan',
  'Guarantor Name',
  'Guarantor Mobile',
  'Guarantor Aadhaar',
  'Guarantor Relation',
  'Language',
  // Document Links in Google Drive
  'Application Form PDF Link',
  'Aadhaar Card File Link',
  'PAN Card File Link',
  'Applicant Photo Link',
  'Business Proof Link',
  'Applicant Drive Folder Link'
];

// Helper to extract clean alphanumeric ID if user pasted full URL
function extractIdFromInput(input) {
  if (!input) return null;
  var str = input.toString().trim();
  // Check if full URL containing /d/ or /folders/
  var matchSheet = str.match(/\/d\/([a-zA-Z0-9-_]+)/);
  if (matchSheet && matchSheet[1]) return matchSheet[1];
  var matchFolder = str.match(/\/folders\/([a-zA-Z0-9-_]+)/);
  if (matchFolder && matchFolder[1]) return matchFolder[1];
  return str;
}

// ── Utility: get or create target sheet tab with styled header row ────────────
function getOrCreateSheet() {
  var ss = null;
  var cleanSheetId = extractIdFromInput(SHEET_ID);

  // 1. Try by SHEET_ID if provided
  if (cleanSheetId && cleanSheetId !== 'YOUR_SHEET_ID_HERE') {
    try {
      ss = SpreadsheetApp.openById(cleanSheetId);
    } catch (e) {
      Logger.log('Could not open by SHEET_ID: ' + e);
    }
  }

  // 2. If opened from within Google Sheet (Extensions -> Apps Script), auto-detect
  if (!ss) {
    try {
      ss = SpreadsheetApp.getActiveSpreadsheet();
    } catch (e) {
      Logger.log('No active spreadsheet: ' + e);
    }
  }

  if (!ss) {
    throw new Error('Spreadsheet not found. Please paste your SHEET_ID at the top of Code.gs.');
  }

  // 3. Find or create the target tab
  var sheet = ss.getSheetByName(SHEET_NAME);

  if (!sheet) {
    var allSheets = ss.getSheets();
    // If the spreadsheet only has the default empty Sheet1, reuse and rename it
    if (allSheets.length === 1 && allSheets[0].getLastRow() === 0) {
      sheet = allSheets[0];
      sheet.setName(SHEET_NAME);
    } else {
      sheet = ss.insertSheet(SHEET_NAME);
    }
    sheet.appendRow(HEADERS);
    var headerRange = sheet.getRange(1, 1, 1, HEADERS.length);
    headerRange.setBackground('#0F3876');
    headerRange.setFontColor('#FFFFFF');
    headerRange.setFontWeight('bold');
    headerRange.setFontSize(10);
    sheet.setFrozenRows(1);
    sheet.autoResizeColumns(1, HEADERS.length);
  }

  return sheet;
}

// ── Utility: Decode base64 file and save directly to applicant's Drive folder ───
function saveFileToApplicantFolder(applicantFolder, fileObj, docTypePrefix) {
  if (!fileObj || !fileObj.base64) {
    return 'Not Uploaded';
  }

  try {
    var rawData = fileObj.base64;
    // Strip data URL prefix if present (e.g. data:application/pdf;base64,...)
    if (rawData.indexOf(',') !== -1) {
      rawData = rawData.split(',')[1];
    }

    var decodedBytes = Utilities.base64Decode(rawData);
    var mimeType = fileObj.mimeType || 'application/octet-stream';
    var originalName = fileObj.name || (docTypePrefix + '.pdf');
    var cleanName = originalName.replace(/[^a-zA-Z0-9._-]/g, '_');
    var finalFileName = docTypePrefix + '_' + cleanName;

    var blob = Utilities.newBlob(decodedBytes, mimeType, finalFileName);
    var driveFile = applicantFolder.createFile(blob);

    return driveFile.getUrl();
  } catch (err) {
    return 'Upload Error: ' + err.toString();
  }
}

// ── Handle GET (health check / browser test) ─────────────────────────────────
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({
      status: 'ok',
      message: 'Bharat Enterprises Loan Form & Google Drive API is active.'
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

// ── Handle POST (form submission + document uploads) ──────────────────────────
function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);

    var appPdfLink = 'Not Uploaded';
    var aadhaarLink = 'Not Uploaded';
    var panLink = 'Not Uploaded';
    var photoLink = 'Not Uploaded';
    var businessProofLink = 'Not Uploaded';
    var folderUrl = '';

    var cleanFolderId = extractIdFromInput(DRIVE_FOLDER_ID);

    // 1. If Google Drive folder ID is configured, create an applicant sub-folder
    if (cleanFolderId && cleanFolderId !== 'YOUR_DRIVE_FOLDER_ID_HERE') {
      try {
        var rootFolder = DriveApp.getFolderById(cleanFolderId);

        // ── Safeguard: Prevent nesting inside applicant subfolders ──────────
        // If DRIVE_FOLDER_ID was accidentally set to an applicant subfolder (e.g. starts with BEFS-),
        // automatically climb up to the main parent folder so folders are always created at the root level!
        while (rootFolder.getName().indexOf('BEFS-') !== -1 && rootFolder.getParents().hasNext()) {
          rootFolder = rootFolder.getParents().next();
        }

        var appNo = data.applicationNo || ('BEFS-' + Utilities.formatDate(new Date(), 'Asia/Kolkata', 'yyyyMMdd-HHmmss'));
        var subFolderName = appNo + ' - ' + (data.fullName || 'Applicant');

        // Reuse folder if already exists for this exact application ID, otherwise create new
        var existingFolders = rootFolder.getFoldersByName(subFolderName);
        var applicantFolder;
        if (existingFolders.hasNext()) {
          applicantFolder = existingFolders.next();
        } else {
          applicantFolder = rootFolder.createFolder(subFolderName);
        }
        folderUrl = applicantFolder.getUrl();

        // 2. Save Signed Application Form PDF into applicant's folder
        if (data.applicationPdfDoc) {
          appPdfLink = saveFileToApplicantFolder(applicantFolder, data.applicationPdfDoc, 'Application_Form');
        }

        // 3. Save KYC documents
        if (data.aadhaarDoc) {
          aadhaarLink = saveFileToApplicantFolder(applicantFolder, data.aadhaarDoc, 'Aadhaar');
        }
        if (data.panDoc) {
          panLink = saveFileToApplicantFolder(applicantFolder, data.panDoc, 'PAN');
        }
        if (data.photoDoc) {
          photoLink = saveFileToApplicantFolder(applicantFolder, data.photoDoc, 'Photo');
        }
        if (data.businessProofDoc) {
          businessProofLink = saveFileToApplicantFolder(applicantFolder, data.businessProofDoc, 'BusinessProof');
        }
      } catch (driveErr) {
        folderUrl = 'Drive Error: ' + driveErr.toString();
      }
    }

    // 4. Prepare row data for Google Sheets
    var row = [
      new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }), // Timestamp (IST)
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
      data.yearsInBusiness      || '',
      data.businessAddress      || '',
      data.requiredLoanAmount   || '',
      data.purposeOfLoan        || '',
      data.repaymentPlan        || '',
      data.guarantorName        || '',
      data.guarantorMobile      || '',
      data.guarantorAadhaar     || '',
      data.guarantorRelation    || '',
      data.language             || '',
      appPdfLink,
      aadhaarLink,
      panLink,
      photoLink,
      businessProofLink,
      folderUrl
    ];

    // 5. Append row to Google Sheets
    var sheetResult = 'saved';
    try {
      var sheet = getOrCreateSheet();
      sheet.appendRow(row);
    } catch (sheetErr) {
      sheetResult = 'Sheet error: ' + sheetErr.toString();
      Logger.log('Error writing to sheet: ' + sheetErr);
    }

    return ContentService
      .createTextOutput(JSON.stringify({
        result: 'success',
        appNo: data.applicationNo,
        folderUrl: folderUrl,
        sheetResult: sheetResult
      }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({
        result: 'error',
        message: err.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ── Utility: Run this function directly from Apps Script editor to update row 1 headers in your existing sheet
function updateSheetHeaders() {
  var sheet = getOrCreateSheet();
  var headerRange = sheet.getRange(1, 1, 1, HEADERS.length);
  headerRange.setValues([HEADERS]);
  headerRange.setBackground('#0F3876');
  headerRange.setFontColor('#FFFFFF');
  headerRange.setFontWeight('bold');
  headerRange.setFontSize(10);
  sheet.setFrozenRows(1);
  sheet.autoResizeColumns(1, HEADERS.length);
  Logger.log('Header row successfully updated with ' + HEADERS.length + ' columns.');
}

