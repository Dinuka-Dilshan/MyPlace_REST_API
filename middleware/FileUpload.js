const multer = require("multer");
const { v4: uuidv4 } = require('uuid');

const MIME_TYPES = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/images");
  },
  filename: (req, file, cb) => {
    const extention = MIME_TYPES[file.mimetype];
    cb(null, `${uuidv4()}.${extention}`);
  },
});

const fileFilter = (req, file, cb) => {
  const isValid = MIME_TYPES[file.mimetype];
  const error = isValid ? null : new Error("Unsupported file format");

  cb(error, isValid);
};

const fileUpload = multer({
  storage: storage,
  limits: 5e6,
  fileFilter: fileFilter,
});

module.exports = fileUpload;
