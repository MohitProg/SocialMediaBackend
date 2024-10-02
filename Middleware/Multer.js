import multer from "multer";
import path from "path";

const maxfileSize = 20 * 1024 * 1024; // 20 mb

//!  need to learn it very improtant
const fileFilter = (req, file, cb) => {
  // *Accept both video and image files
  const allowedTypes = /mp4|mkv|avi|mov|jpg|jpeg|png|gif/;
  const mimeType = allowedTypes.test(file.mimetype);
  const extName = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );

  if (mimeType && extName) {
    cb(null, true); // Accept the file if it matches the allowed types
  } else {
    cb(new Error("Only video and image files are allowed!"));
  }
};
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/profileImages");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: maxfileSize },
  fileFilter: fileFilter,
});

export { upload };
