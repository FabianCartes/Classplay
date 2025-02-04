import Question from "../entity/question.js";
import Option from "../entity/option.js";
import { AppDataSource } from "../data-source.js";
import fs from "fs";
import path from "path";

// Crear una nueva pregunta con imagen opcional
const createQuestion = async (questionData, file) => {
  try {
    const { type, statement, score, videoUrl, sectionId, options } = questionData;

    if (!type || !statement || score === undefined || !sectionId) {
      throw new Error("Faltan campos obligatorios.");
    }

    const questionRepository = AppDataSource.getRepository(Question);
    const optionRepository = AppDataSource.getRepository(Option);

    const imageUrl = file ? `/uploads/${file.filename}` : null; // Si hay imagen, se guarda la URL

    const newQuestion = questionRepository.create({
      type,
      statement,
      score,
      imageUrl,
      videoUrl,
      section: { id: sectionId },
    });

    const savedQuestion = await questionRepository.save(newQuestion);

    // Guardar opciones según el tipo de pregunta
    if ((type === "alternativa" || type === "verdadero_falso") && options?.length) {
      const optionsToSave = options.map((opt) => ({
        text: opt.text,
        isCorrect: opt.isCorrect,
        question: savedQuestion,
      }));

      await optionRepository.save(optionsToSave);
    }

    return savedQuestion;
  } catch (error) {
    console.error("Error al crear la pregunta:", error);
    return { error: error.message };
  }
};

// Obtener todas las preguntas de una sección con sus opciones
const getQuestionsBySection = async (sectionId) => {
  try {
    const questionRepository = AppDataSource.getRepository(Question);

    const questions = await questionRepository.find({
      where: { section: { id: sectionId } },
      relations: ["options"],
    });

    return questions;
  } catch (error) {
    console.error("Error al obtener las preguntas:", error);
    return { error: error.message };
  }
};

// Actualizar una pregunta con imagen opcional
const updateQuestion = async (id, questionData, file) => {
  try {
    const { type, statement, score, videoUrl, options } = questionData;
    const questionRepository = AppDataSource.getRepository(Question);
    const optionRepository = AppDataSource.getRepository(Option);

    const question = await questionRepository.findOne({ where: { id }, relations: ["options"] });

    if (!question) {
      return { error: "Pregunta no encontrada." };
    }

    // Actualizar los datos de la pregunta
    question.type = type;
    question.statement = statement;
    question.score = score;
    question.videoUrl = videoUrl;

    if (file) {
      question.imageUrl = `/uploads/${file.filename}`;
    }

    const updatedQuestion = await questionRepository.save(question);

    // Manejo de opciones si aplica
    if ((type === "alternativa" || type === "verdadero_falso") && options?.length) {
      await optionRepository.delete({ question: { id } });

      const optionsToSave = options.map((opt) => ({
        text: opt.text,
        isCorrect: opt.isCorrect,
        question: updatedQuestion,
      }));

      await optionRepository.save(optionsToSave);
    }

    return updatedQuestion;
  } catch (error) {
    console.error("Error al actualizar la pregunta:", error);
    return { error: error.message };
  }
};

// Eliminar una pregunta junto con sus opciones
const deleteQuestion = async (id) => {
  try {
    const questionRepository = AppDataSource.getRepository(Question);
    const result = await questionRepository.delete(id);

    if (result.affected === 0) {
      return { error: "Pregunta no encontrada." };
    }

    return { message: "Pregunta eliminada correctamente." };
  } catch (error) {
    console.error("Error al eliminar la pregunta:", error);
    return { error: error.message };
  }
};

const removeQuestionImage = async (id) => {
  try {
    const questionRepository = AppDataSource.getRepository(Question);

    const question = await questionRepository.findOne({ where: { id } });

    if (!question) {
      return { error: "Pregunta no encontrada." };
    }

    question.imageUrl = null; // Eliminar la URL de la imagen
    await questionRepository.save(question);

    return { message: "Imagen eliminada correctamente." };
  } catch (error) {
    console.error("Error al eliminar la imagen:", error);
    return { error: error.message };
  }
};


export default { createQuestion, getQuestionsBySection, updateQuestion, deleteQuestion, removeQuestionImage };
