import { Router } from "express";
const router = Router();
import verifyToken from "../middleware/authenticateToken.js";
import userAnswerController from "../controllers/user_answer.controller.js";

const {
  saveUserAnswerController,
  getUserAnswersController,
  getUserAnswersBySectionController,
  getTopUsersByCourseController,
} = userAnswerController;

// 📌 Ruta para guardar o actualizar una respuesta del usuario
router.post("/SaveUserAnswer", verifyToken, saveUserAnswerController);

// 📌 Ruta para obtener todas las respuestas de un usuario
router.get("/GetUserAnswers/:userId", verifyToken, getUserAnswersController);

// 📌 Ruta para obtener respuestas de un usuario en una sección específica
router.get("/GetUserAnswersBySection/:userId/:sectionId", verifyToken, getUserAnswersBySectionController);

// 🔥 Ruta para obtener el Top de Usuarios por Curso
router.get("/GetTopUsersByCourse/:courseId", verifyToken, getTopUsersByCourseController);

export default router;
