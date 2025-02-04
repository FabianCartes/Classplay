import Option from "../entity/option.js";
import { AppDataSource } from "../data-source.js";

// 🔹 Crear opciones para una pregunta
const createOption = async (optionData) => {
  try {
    const { text, isCorrect, questionId } = optionData;

    if (!text || isCorrect === undefined || !questionId) {
      throw new Error("Faltan campos obligatorios.");
    }

    const optionRepository = AppDataSource.getRepository(Option);
    const newOption = optionRepository.create({ text, isCorrect, question: { id: questionId } });

    return await optionRepository.save(newOption);
  } catch (error) {
    console.error("Error al crear la opción:", error);
    return { error: error.message };
  }
};

// 🔹 Obtener todas las opciones de una pregunta
const getOptionsByQuestion = async (questionId) => {
  try {
    const optionRepository = AppDataSource.getRepository(Option);
    return await optionRepository.find({ where: { question: { id: questionId } } });
  } catch (error) {
    console.error("Error al obtener opciones:", error);
    return { error: error.message };
  }
};

// 🔹 Actualizar una opción
const updateOption = async (id, optionData) => {
  try {
    const optionRepository = AppDataSource.getRepository(Option);
    const option = await optionRepository.findOne({ where: { id } });

    if (!option) {
      return { error: "Opción no encontrada." };
    }

    optionRepository.merge(option, optionData);
    return await optionRepository.save(option);
  } catch (error) {
    console.error("Error al actualizar la opción:", error);
    return { error: error.message };
  }
};

// 🔹 Eliminar una opción
const deleteOption = async (id) => {
  try {
    const optionRepository = AppDataSource.getRepository(Option);
    const result = await optionRepository.delete(id);

    if (result.affected === 0) {
      return { error: "Opción no encontrada." };
    }

    return { message: "Opción eliminada correctamente." };
  } catch (error) {
    console.error("Error al eliminar la opción:", error);
    return { error: error.message };
  }
};

export default { createOption, getOptionsByQuestion, updateOption, deleteOption };
