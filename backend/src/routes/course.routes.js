import { Router } from "express";
const router = Router();
import courseController from "../controllers/course.controller.js";
import verifyToken from "../middleware/authenticateToken.js";
const {createCourseController,
     getCoursesController,
     getCourseByIdController,
     updateCourseController,
     deleteCourseController,
     toggleCourseVisibilityController,
     getPublicCoursesController} = courseController;

// Ruta para crear un curso
router.post("/CreateCourse", verifyToken, createCourseController);

// Ruta para obtener todos los cursos
router.get("/GetCourse", getCoursesController);

// Ruta para obtener un curso por ID
router.get("/GetCourse/:id", getCourseByIdController);

// Ruta para actualizar un curso
router.put("/UpdateCourse/:id", updateCourseController);

// Ruta para eliminar un curso
router.delete("/DeleteCourse/:id", deleteCourseController);

router.patch("/toggleVisibility/:id", toggleCourseVisibilityController);

router.get("/GetPublicCourses", getPublicCoursesController);

export default router;