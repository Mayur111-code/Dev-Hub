import multer from "multer";

const storage = multer.memoryStorage(); // store file temporarily in RAM

const upload = multer({ storage });

export default upload;
