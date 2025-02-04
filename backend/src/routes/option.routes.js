import { Router } from "express";
const router = Router();
import verifyToken from "../middleware/authenticateToken.js";
import optionController from "../controllers/option.controller.js";
const { createOptionController, getOptionsByQuestionController, updateOptionController, deleteOptionController} = optionController;


// Ruta para crear una opcion
router.post("/CreateOption", verifyToken, createOptionController);

// Ruta para obtener una opcion segun la pregunta
router.get("/GetOption", getOptionsByQuestionController);

// Ruta para actualizar la opcion
router.put("/UpdateOption/:id", updateOptionController);

// Ruta para eliminar una opcion
router.delete("/DeleteOption/:id", deleteOptionController);


export default router;