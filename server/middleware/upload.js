const multer = require('multer');
const path = require('path');
const fs = require('fs');

// 确保上传目录存在
const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

// 电子书文件存储
const bookStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '..', 'uploads', 'books');
    ensureDir(dir);
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext);
  },
});

// 封面图片存储
const coverStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '..', 'uploads', 'covers');
    ensureDir(dir);
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext);
  },
});

// 文件类型过滤
const bookFilter = (req, file, cb) => {
  const allowedTypes = ['.pdf', '.epub', '.mobi', '.txt', '.doc', '.docx'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedTypes.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('不支持的文件格式，仅支持: PDF, EPUB, MOBI, TXT, DOC, DOCX'), false);
  }
};

const imageFilter = (req, file, cb) => {
  const allowedTypes = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedTypes.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('不支持的图片格式，仅支持: JPG, PNG, GIF, WEBP'), false);
  }
};

// 电子书上传 (book文件 + cover封面)
const uploadBook = multer({
  storage: bookStorage,
  fileFilter: bookFilter,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
});

const uploadCover = multer({
  storage: coverStorage,
  fileFilter: imageFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

// 组合上传中间件
const uploadFields = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      let dir;
      if (file.fieldname === 'bookFile') {
        dir = path.join(__dirname, '..', 'uploads', 'books');
      } else if (file.fieldname === 'coverFile') {
        dir = path.join(__dirname, '..', 'uploads', 'covers');
      }
      ensureDir(dir);
      cb(null, dir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = path.extname(file.originalname);
      cb(null, uniqueSuffix + ext);
    },
  }),
  limits: { fileSize: 50 * 1024 * 1024 },
}).fields([
  { name: 'bookFile', maxCount: 1 },
  { name: 'coverFile', maxCount: 1 },
]);

module.exports = { uploadBook, uploadCover, uploadFields };
