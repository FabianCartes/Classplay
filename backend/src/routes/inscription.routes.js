import { Router } from "express";
const router = Router();
import inscriptionController from "../controllers/inscription.controller.js";
import verifyToken from "../middleware/authenticateToken.js";

const { 
  enrollUserController, 
  getUserInscriptionsController, 
  getUsersInCourseController, 
  unenrollUserController 
} = inscriptionController;

// Ruta para inscribir a un usuario en un curso
router.post("/Enroll", verifyToken, enrollUserController);

// Ruta para obtener los cursos en los que está inscrito un usuario
router.get("/MyInscriptions", verifyToken, getUserInscriptionsController);

// Ruta para obtener los usuarios inscritos en un curso específico
router.get("/GetUsers/:courseId", verifyToken, getUsersInCourseController);

// Ruta para desinscribir a un usuario de un curso
router.delete("/Unenroll/:courseId", verifyToken, unenrollUserController);

export default router;
