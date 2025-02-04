import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();

// Obtener la ruta actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import userRoutes from "./users.routes.js";
import authRoutes from "./auth.routes.js";
import courseRoutes from "./course.routes.js";
import sectionRoutes from "./section.routes.js";
import questionRoutes from "./question.routes.js";
import optionRoutes from "./option.routes.js";
import inscriptionRoutes from "./inscription.routes.js";
import user_answerRoutes from "./user_answer.routes.js";

// Ruta principal de usuarios
router.use("/users", userRoutes);
router.use("/auth", authRoutes);
router.use("/course", courseRoutes);
router.use("/section", sectionRoutes);
router.use("/question", questionRoutes);
router.use("/option", optionRoutes);
router.use("/inscription", inscriptionRoutes);
router.use("/user_answer", user_answerRoutes);

// Servir los archivos estáticos desde la carpeta 'uploads'
router.use('/uploads', express.static(path.join(__dirname, '../../uploads')));


export default router;
