import multer from "multer";
import path from "path";
import fs from "fs";

// Configurar el almacenamiento de las imágenes
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "uploads/";

    // Verificar si la carpeta existe, si no, crearla
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }

    cb(null, uploadDir); // Aquí definimos la carpeta donde se guardarán las imágenes
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Le damos un nombre único a la imagen
  },
});

// Filtrar solo imágenes
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimeType = allowedTypes.test(file.mimetype);

  if (extname && mimeType) {
    return cb(null, true); // Acepta la imagen
  } else {
    return cb(new Error("Solo se permiten imágenes de tipo JPEG, PNG o GIF"), false); // Rechaza el archivo
  }
};

// Crear un middleware de multer
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limitar el tamaño de la imagen a 5MB
}).single("image"); // `image` es el nombre del campo en el formulario

export default upload;
