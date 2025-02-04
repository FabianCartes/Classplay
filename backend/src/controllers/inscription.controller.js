import inscriptionService from "../services/inscription.service.js";
const { enrollUserInCourse, getUserInscriptions, getUsersInCourse, unenrollUserFromCourse } = inscriptionService;

// Inscribir a un usuario en un curso
const enrollUserController = async (req, res) => {
  try {
    const userId = req.user.id; // ID del usuario autenticado
    const { courseId } = req.body;

    if (!courseId) {
      return res.status(400).json({ message: "El ID del curso es obligatorio." });
    }

    const inscription = await enrollUserInCourse(userId, courseId);
    
    if (inscription.error) {
      return res.status(400).json({ message: inscription.error });
    }

    return res.status(201).json(inscription);
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message });
  }
};

// Obtener los cursos en los que está inscrito un usuario
const getUserInscriptionsController = async (req, res) => {
  try {
    const userId = req.user.id; // ID del usuario autenticado
    const inscriptions = await getUserInscriptions(userId);
    
    return res.status(200).json(inscriptions);
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message });
  }
};

// Obtener los usuarios inscritos en un curso
const getUsersInCourseController = async (req, res) => {
  try {
    const { courseId } = req.params;

    if (!courseId) {
      return res.status(400).json({ message: "El ID del curso es obligatorio." });
    }

    const users = await getUsersInCourse(courseId);

    return res.status(200).json(users);
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message });
  }
};

// Desinscribir a un usuario de un curso
const unenrollUserController = async (req, res) => {
  try {
    const userId = req.user.id; // ID del usuario autenticado
    const { courseId } = req.params;

    if (!courseId) {
      return res.status(400).json({ message: "El ID del curso es obligatorio." });
    }

    const result = await unenrollUserFromCourse(userId, courseId);
    
    if (result.error) {
      return res.status(400).json({ message: result.error });
    }

    return res.status(200).json(result);
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message });
  }
};

export default {
  enrollUserController,
  getUserInscriptionsController,
  getUsersInCourseController,
  unenrollUserController,
};
