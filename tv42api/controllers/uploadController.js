//programlar   -   anasayfa
//canlı yayın   -   künye->dökümanlar   -   basın   -   anasayfa

const path = require('path');
const fs = require('fs');
const multer = require('multer');

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Always use query param for destination
    let destination = req.query.destination || 'uploads';
    const uploadDir = path.join(process.cwd(), 'public', destination);

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const fileExtension = path.extname(file.originalname);
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 15)}${fileExtension}`;
    cb(null, fileName);
  }
});

const upload = multer({ storage });

exports.uploadFile = [
  upload.single('file'),
  (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: 'Dosya bulunamadı' });
    }

    // Use query param for destination in response as well
    const destination = req.query.destination || 'uploads';
    const fileUrl = `http://localhost:3001/${destination}/${req.file.filename}`;
    res.json({
      success: true,
      filePath: fileUrl,
      originalName: req.file.originalname,
    });
  }
];