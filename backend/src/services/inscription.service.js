import { AppDataSource } from "../data-source.js";
import Inscription from "../entity/inscription.js";
import User from "../entity/user.js";
import Course from "../entity/course.js";

// Inscribir a un usuario en un curso
const enrollUserInCourse = async (userId, courseId) => {
  try {
    const inscriptionRepository = AppDataSource.getRepository(Inscription);
    const userRepository = AppDataSource.getRepository(User);
    const courseRepository = AppDataSource.getRepository(Course);

    // Verificar si el usuario existe
    const user = await userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error("Usuario no encontrado.");
    }

    // Verificar si el curso existe y es público
    const course = await courseRepository.findOne({ where: { id: courseId, isPublic: true } });
    if (!course) {
      throw new Error("Curso no encontrado o no es público.");
    }

    // Verificar si el usuario ya está inscrito en el curso
    const existingInscription = await inscriptionRepository.findOne({ where: { userId, courseId } });
    if (existingInscription) {
      throw new Error("El usuario ya está inscrito en este curso.");
    }

    // Crear la inscripción
    const newInscription = inscriptionRepository.create({ userId, courseId });
    const savedInscription = await inscriptionRepository.save(newInscription);

    return savedInscription;
  } catch (error) {
    console.error("Error al inscribir al usuario:", error);
    return { error: error.message };
  }
};

// Obtener los cursos en los que está inscrito un usuario
const getUserInscriptions = async (userId) => {
  try {
    const inscriptionRepository = AppDataSource.getRepository(Inscription);
    const inscriptions = await inscriptionRepository.find({
      where: { userId },
      relations: ["course"], // Trae los detalles del curso
    });

    return inscriptions.map(inscription => inscription.course);
  } catch (error) {
    console.error("Error al obtener inscripciones del usuario:", error);
    return { error: error.message };
  }
};

// Obtener los usuarios inscritos en un curso
const getUsersInCourse = async (courseId) => {
  try {
    const inscriptionRepository = AppDataSource.getRepository(Inscription);
    const inscriptions = await inscriptionRepository.find({
      where: { courseId },
      relations: ["user"], // Trae los detalles del usuario
    });

    return inscriptions.map(inscription => inscription.user);
  } catch (error) {
    console.error("Error al obtener los usuarios inscritos:", error);
    return { error: error.message };
  }
};

// Desinscribir a un usuario de un curso
const unenrollUserFromCourse = async (userId, courseId) => {
  try {
    const inscriptionRepository = AppDataSource.getRepository(Inscription);

    const result = await inscriptionRepository.delete({ userId, courseId });

    if (result.affected === 0) {
      return { error: "Inscripción no encontrada." };
    }

    return { message: "Usuario desinscrito correctamente." };
  } catch (error) {
    console.error("Error al desinscribir usuario:", error);
    return { error: error.message };
  }
};

export default { enrollUserInCourse, getUserInscriptions, getUsersInCourse, unenrollUserFromCourse };
