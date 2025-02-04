import { Router } from "express";
const router = Router();
import userController from "../controllers/user.controller.js";
const {createUserController, getUsersController, getUserByIdController, updateUserController, deleteUserController } = userController;

// Ruta para crear un usuario
router.post("/CreateUsers", createUserController);

// Ruta para obtener todos los usuarios
router.get("/GetUsers", getUsersController);

// Ruta para obtener un usuario por ID
router.get("/GetUsers/:id", getUserByIdController);

// Ruta para actualizar un usuario
router.put("/UpdateUsers/:id", updateUserController);

// Ruta para eliminar un usuario
router.delete("/DeleteUsers/:id", deleteUserController);

export default router;