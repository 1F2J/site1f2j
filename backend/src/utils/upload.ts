import multer from 'multer';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

const uploadDir = path.join(__dirname, '../uploads');
const productUploadDir = path.join(__dirname, '../uploadprod');

// Garantir que o diretório de upload existe
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
if (!fs.existsSync(productUploadDir)) {
  fs.mkdirSync(productUploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const hash = crypto.randomBytes(16).toString('hex');
    const ext = path.extname(file.originalname);
    cb(null, `${hash}${ext}`);
  }
});

const productStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, productUploadDir);
  },
  filename: (req, file, cb) => {
    const hash = crypto.randomBytes(16).toString('hex');
    const ext = path.extname(file.originalname);
    cb(null, `${hash}${ext}`);
  }
});

const fileFilter = (req: any, file: any, cb: any) => {
  // Permitir apenas imagens e alguns tipos de arquivo
  const allowedTypes = /jpeg|jpg|png|gif|pdf|ai|eps|svg/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Tipo de arquivo não permitido'));
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  }
});

export const productUpload = multer({
  storage: productStorage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  }
});

export const deleteFile = (storedPath: string): boolean => {
  try {
    const relativePath = storedPath.replace(new RegExp('^/(uploads|uploadprod)/'), '');
    const dir = storedPath.startsWith('/uploadprod/') ? productUploadDir : uploadDir;
    const filePath = path.join(dir, relativePath);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Erro ao deletar arquivo:', error);
    return false;
  }
};

