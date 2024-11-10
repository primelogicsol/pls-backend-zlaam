import multer from "multer";
import path from "node:path";

const storage = multer.diskStorage({
  filename: function (_, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${file.originalname}-${uniqueSuffix}`);
  }
});

const upload = multer({
  storage,
  dest: path.resolve(__dirname, "public/temp"),
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 5
  }
});

export const fileUploader = upload.array("docs", 5);
