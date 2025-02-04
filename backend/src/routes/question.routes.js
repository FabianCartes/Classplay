import { Router } from "express";
import verifyToken from "../middleware/authenticateToken.js";
import questionController from "../controllers/question.controller.js";
import upload from "../config/multer.js"; // Importamos el middleware de multer

const { 
  createQuestionController, 
  getQuestionsBySectionController, 
  updateQuestionController, 
  deleteQuestionController, 
  removeQuestionImageController // Importamos la nueva función del controlador
} = questionController;

const router = Router();

// Ruta para crear una pregunta, con carga de imagen
router.post("/CreateQuestion", upload, verifyToken, createQuestionController);

// Ruta para obtener preguntas según la sección
router.get("/GetQuestionBySection/:sectionId", verifyToken, getQuestionsBySectionController);

// Ruta para actualizar una pregunta, con opción de nueva imagen
router.put("/UpdateQuestion/:id", upload, updateQuestionController);

// Ruta para eliminar una pregunta
router.delete("/DeleteQuestion/:id", deleteQuestionController);

// Nueva ruta: Eliminar solo la imagen de una pregunta
router.delete("/RemoveImage/:id", removeQuestionImageController);

export default router;


