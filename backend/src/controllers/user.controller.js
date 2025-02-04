import userService from "../services/user.service.js";
const { createUser, getUsers, getUserById, updateUser, deleteUser } = userService;
import { validateUserData } from "../validation/user.validation.js"; // Importas la función de validación

// Crear un nuevo usuario
const createUserController = async (req, res) => {
  try {
    // Validar los datos del body antes de crear el usuario
    validateUserData(req.body);

    // Llamar al servicio para crear el usuario
    const user = await createUser(req.body);
    return res.status(201).json(user); // Retorna el usuario creado
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message });
  }
};

// Obtener todos los usuarios
const getUsersController = async (req, res) => {
  try {
    const users = await getUsers();
    return res.status(200).json(users);
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message });
  }
};

// Obtener un usuario por ID
const getUserByIdController = async (req, res) => {
  try {
    const user = await getUserById(req.params.id);
    return res.status(200).json(user);
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message });
  }
};

// Actualizar un usuario
const updateUserController = async (req, res) => {
  try {
    // Validar los datos del body antes de actualizar el usuario
    validateUserData(req.body);

    // Llamar al servicio para actualizar el usuario
    const updatedUser = await updateUser(req.params.id, req.body);
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found." });
    }
    return res.status(200).json(updatedUser);
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message });
  }
};

// Eliminar un usuario
const deleteUserController = async (req, res) => {
  try {
    const success = await deleteUser(req.params.id);
    if (!success) {
      return res.status(404).json({ message: "User not found." });
    }
    return res.status(200).json({ message: "User deleted successfully." });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message });
  }
};

export default { createUserController, getUsersController, getUserByIdController, updateUserController, deleteUserController };
