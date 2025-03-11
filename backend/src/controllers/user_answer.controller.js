import userAnswerService from "../services/user_answer.service.js";
const { saveUserAnswer, getUserAnswers, getUserAnswersBySection, getTopUsersByCourse } = userAnswerService;

const saveUserAnswerController = async (req, res) => {
  try {
    console.log('Datos recibidos:', req.body); // Verifica los datos recibidos

    const { answers } = req.body;

    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({ message: "Se requieren respuestas." });
    }

    // Guardar todas las respuestas
    const savedAnswers = await Promise.all(
      answers.map(answer =>
        saveUserAnswer(answer.userId, answer.questionId, answer.optionId)
      )
    );

    return res.status(201).json(savedAnswers);
  } catch (error) {
    console.error("Error en saveUserAnswerController:", error);
    return res.status(500).json({ message: "Error interno al guardar las respuestas." });
  }
};


// 📌 Obtener todas las respuestas de un usuario
const getUserAnswersController = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: "User ID requerido." });
    }

    const answers = await getUserAnswers(userId);

    if (answers.error) {
      return res.status(404).json({ message: answers.error });
    }

    return res.status(200).json(answers);
  } catch (error) {
    console.error("Error en getUserAnswersController:", error);
    return res.status(500).json({ message: "Error al obtener las respuestas." });
  }
};

// 📌 Obtener respuestas de un usuario en una sección específica
const getUserAnswersBySectionController = async (req, res) => {
  try {
    const { userId, sectionId } = req.params;

    if (!userId || !sectionId) {
      return res.status(400).json({ message: "User ID y Section ID requeridos." });
    }

    const answers = await getUserAnswersBySection(userId, sectionId);

    if (answers.error) {
      return res.status(404).json({ message: answers.error });
    }

    return res.status(200).json(answers);
  } catch (error) {
    console.error("Error en getUserAnswersBySectionController:", error);
    return res.status(500).json({ message: "Error al obtener respuestas en la sección." });
  }
};

// 🎯 Obtener Top de Usuarios por Curso
const getTopUsersByCourseController = async (req, res) => {
  try {
    const { courseId } = req.params;

    if (!courseId) {
      return res.status(400).json({ message: "Course ID requerido." });
    }

    const topUsers = await getTopUsersByCourse(courseId);

    if (topUsers.error) {
      return res.status(404).json({ message: topUsers.error });
    }

    return res.status(200).json(topUsers);
  } catch (error) {
    console.error("Error en getTopUsersByCourseController:", error);
    return res.status(500).json({ message: "Error al obtener el top de usuarios." });
  }
};

export default {
  saveUserAnswerController,
  getUserAnswersController,
  getUserAnswersBySectionController,
  getTopUsersByCourseController,
};
