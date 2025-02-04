import { Router } from "express";
const router = Router();
import verifyToken from "../middleware/authenticateToken.js";
import sectionController from "../controllers/section.controller.js";

const {
  createSectionController,
  getSectionByIdController,
  getSectionsByCourseController,
  updateSectionController,
  updateSectionsController,
  deleteSectionController,
  getCourseIdBySectionController,
} = sectionController;

// Ruta para crear una seccion
router.post("/CreateSection", verifyToken, createSectionController);

// Ruta para obtener las secciones de un curso
router.get("/GetSectionsByCourse/:courseId", getSectionsByCourseController);

// Ruta para obtener una sección por ID
router.get('/GetSection/:sectionId', getSectionByIdController);

// Ruta para actualizar una seccion
router.put("/UpdateSection/:id", updateSectionController);

// Ruta para actualizar las secciones
router.put("/UpdateSections", updateSectionsController);

// Ruta para eliminar una seccion
router.delete("/DeleteSection/:id", deleteSectionController);

//Ruta para obtener el id del curso el cual esta la seccion
router.get("/GetCourseIdBySection/:sectionId", getCourseIdBySectionController);


export default router;
