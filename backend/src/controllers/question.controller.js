import questionService from "../services/question.service.js";

const { createQuestion, getQuestionsBySection, updateQuestion, deleteQuestion, removeQuestionImage } = questionService;

// Crear una nueva pregunta con imagen opcional
const createQuestionController = async (req, res) => {
  try {
    console.log("Usuario autenticado en controlador:", req.user);

    const questionData = { ...req.body, sectionId: req.body.sectionId };
    const file = req.file; // Captura la imagen si se subió

    const question = await createQuestion(questionData, file);

    if (question.error) {
      return res.status(400).json({ message: question.error });
    }

    return res.status(201).json(question);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Obtener todas las preguntas de una sección con sus opciones
const getQuestionsBySectionController = async (req, res) => {
  try {
    const { sectionId } = req.params;

    if (!sectionId) {
      return res.status(400).json({ message: "Section ID is required." });
    }

    const questions = await getQuestionsBySection(sectionId);

    if (questions.error) {
      return res.status(404).json({ message: questions.error });
    }

    return res.status(200).json(questions);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Actualizar una pregunta con imagen opcional
const updateQuestionController = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Pregunta ID:', id);  // Verifica el valor del id

    if (!id) {
      return res.status(400).json({ message: "Question ID is required." });
    }

    const file = req.file; // Captura la imagen si se subió
    const updatedQuestion = await updateQuestion(id, req.body, file);

    if (updatedQuestion.error) {
      return res.status(404).json({ message: updatedQuestion.error });
    }

    return res.status(200).json(updatedQuestion);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Eliminar una pregunta
const deleteQuestionController = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Question ID is required." });
    }

    const result = await deleteQuestion(id);

    if (result.error) {
      return res.status(404).json({ message: result.error });
    }

    return res.status(200).json({ message: result.message });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Eliminar solo la imagen de una pregunta
const removeQuestionImageController = async (req, res) => {
  try {
    let { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Question ID is required." });
    }

    id = Number(id); // Convertimos a número

    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid Question ID." });
    }

    const result = await removeQuestionImage(id);

    if (result.error) {
      return res.status(404).json({ message: result.error });
    }

    return res.status(200).json({ message: result.message });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};



export default {
  createQuestionController,
  getQuestionsBySectionController,
  updateQuestionController,
  deleteQuestionController,
  removeQuestionImageController,
};
