const multer = require('multer');
const path   = require('path');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');

const UPLOAD_PATH = process.env.UPLOAD_PATH || './uploads';

// Ensure upload directories exist
['aadhaar', 'land_documents', 'field_reports', 'maps'].forEach(dir => {
  const full = path.join(UPLOAD_PATH, dir);
  if (!fs.existsSync(full)) fs.mkdirSync(full, { recursive: true });
});

// ── Disk Storage Configuration ────────────────────────────────
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = 'misc';
    if (file.fieldname.includes('aadhaar'))       folder = 'aadhaar';
    else if (file.fieldname.includes('land'))     folder = 'land_documents';
    else if (file.fieldname.includes('report'))   folder = 'field_reports';
    else if (file.fieldname.includes('map'))      folder = 'maps';
    
    const targetDir = path.join(UPLOAD_PATH, folder);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }
    cb(null, targetDir);
  },
  filename: (req, file, cb) => {
    let ext  = path.extname(file.originalname).toLowerCase();
    
    if (!ext) {
      if (file.mimetype === 'application/pdf') ext = '.pdf';
      else if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg') ext = '.jpg';
      else if (file.mimetype === 'image/png') ext = '.png';
    }
    
    const uuid = uuidv4();
    cb(null, `${uuid}${ext}`);
  }
});

// ── File Type Filter ──────────────────────────────────────────
const fileFilter = (req, file, cb) => {
  const allowedMimes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
  const allowedExts = ['.pdf', '.jpg', '.jpeg', '.png'];
  
  const ext = path.extname(file.originalname).toLowerCase();
  
  // Verify using either extension or mimetype (handles cases where prod proxy strips extensions)
  if (allowedExts.includes(ext) || allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only PDF, JPG, JPEG, PNG files are allowed.'), false);
  }
};

// ── Multer Instance ───────────────────────────────────────────
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024 }, // 5MB
});

module.exports = upload;
