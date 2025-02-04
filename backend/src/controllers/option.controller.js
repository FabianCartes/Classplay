import optionService from "../services/option.service.js";

const { createOption, getOptionsByQuestion, updateOption, deleteOption } = optionService;

// 📌 Crear una nueva opción
const createOptionController = async (req, res) => {
  try {
    const option = await createOption(req.body);

    if (option.error) {
      return res.status(400).json({ message: option.error });
    }

    return res.status(201).json(option);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// 📌 Obtener todas las opciones de una pregunta
const getOptionsByQuestionController = async (req, res) => {
  try {
    const { questionId } = req.params;

    if (!questionId) {
      return res.status(400).json({ message: "Question ID is required." });
    }

    const options = await getOptionsByQuestion(questionId);

    return res.status(200).json(options);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// 📌 Actualizar una opción
const updateOptionController = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedOption = await updateOption(id, req.body);

    if (updatedOption.error) {
      return res.status(404).json({ message: updatedOption.error });
    }

    return res.status(200).json(updatedOption);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// 📌 Eliminar una opción
const deleteOptionController = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await deleteOption(id);

    if (result.error) {
      return res.status(404).json({ message: result.error });
    }

    return res.status(200).json({ message: result.message });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export default {
  createOptionController,
  getOptionsByQuestionController,
  updateOptionController,
  deleteOptionController,
};
