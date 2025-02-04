import User from "../entity/user.js";
import { AppDataSource } from "../data-source.js"; // Ajusta la ruta según tu estructura

// Crear usuario
const createUser = async (userData) => {
  try {
    const { username, email, password, role } = userData;
    console.log(username, email, password, role);

    const userRepository = AppDataSource.getRepository(User); // Usar la conexión activa
    const user = userRepository.create(userData); // Crea la instancia del usuario
    const savedUser = await userRepository.save(user); // Guarda el usuario

    console.log("User saved:", savedUser); // Verifica que el usuario se guarda correctamente
    return savedUser;
  } catch (error) {
    console.error("Error al guardar el usuario:", error);
    return { error: error.message }; // Devuelve el error para depuración
  }
};
// Obtener todos los usuarios
const getUsers = async () => {
  try {
    const userRepository = AppDataSource.getRepository(User); // Usar la conexión activa
    const users = await userRepository.find(); // Obtener todos los usuarios
    return users;
  } catch (error) {
    console.error("Error al obtener los usuarios:", error);
    return { error: error.message }; // Devuelve el error para depuración
  }
};

// Obtener usuario por ID
const getUserById = async (id) => {
  try {
    const userRepository = AppDataSource.getRepository(User); // Usar la conexión activa
    const user = await userRepository.findOne({ where: { id } }); // Obtener usuario por ID
    if (!user) {
      return { error: "Usuario no encontrado" }; // Si no existe el usuario
    }
    return user;
  } catch (error) {
    console.error("Error al obtener el usuario:", error);
    return { error: error.message }; // Devuelve el error para depuración
  }
};

// Actualizar usuario
const updateUser = async (id, userData) => {
  try {
    const userRepository = AppDataSource.getRepository(User); // Usar la conexión activa
    const user = await userRepository.findOne({ where: { id } }); // Buscar el usuario por ID

    if (!user) {
      return { error: "Usuario no encontrado" }; // Si no existe el usuario
    }

    // Actualizar el usuario
    userRepository.merge(user, userData); // Merge de los nuevos datos con el usuario existente
    const updatedUser = await userRepository.save(user); // Guardar los cambios
    return updatedUser;
  } catch (error) {
    console.error("Error al actualizar el usuario:", error);
    return { error: error.message }; // Devuelve el error para depuración
  }
};

// Eliminar usuario
const deleteUser = async (id) => {
  try {
    const userRepository = AppDataSource.getRepository(User); // Usar la conexión activa
    const result = await userRepository.delete(id); // Eliminar el usuario por ID

    if (result.affected === 0) {
      return { error: "Usuario no encontrado" }; // Si no se eliminó ningún usuario
    }

    return { message: "Usuario eliminado exitosamente" }; // Si se eliminó correctamente
  } catch (error) {
    console.error("Error al eliminar el usuario:", error);
    return { error: error.message }; // Devuelve el error para depuración
  }
};

export default { createUser, getUsers, getUserById, updateUser, deleteUser };