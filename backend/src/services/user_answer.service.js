import { AppDataSource } from "../data-source.js";
import UserAnswer from "../entity/user_answer.js";
import User from "../entity/user.js";
import Question from "../entity/question.js";
import Option from "../entity/option.js";

// Guardar o actualizar respuesta del usuario
const saveUserAnswer = async (userId, questionId, optionId) => {
  try {
    const userAnswerRepository = AppDataSource.getRepository(UserAnswer);

    // Verificar si el usuario ya respondió esta pregunta
    const existingAnswer = await userAnswerRepository.findOne({
      where: { user: { id: userId }, question: { id: questionId } },
    });

    if (existingAnswer) {
      // Si ya respondió, actualizamos la opción seleccionada
      existingAnswer.option = { id: optionId };
      await userAnswerRepository.save(existingAnswer);
      return { message: "Respuesta actualizada correctamente." };
    } else {
      // Si no respondió, creamos un nuevo registro
      const newAnswer = userAnswerRepository.create({
        user: { id: userId },
        question: { id: questionId },
        option: { id: optionId },
      });

      await userAnswerRepository.save(newAnswer);
      return { message: "Respuesta guardada correctamente." };
    }
  } catch (error) {
    console.error("Error al guardar la respuesta:", error);
    return { error: error.message };
  }
};

// Obtener respuestas de un usuario
const getUserAnswers = async (userId) => {
  try {
    const userAnswerRepository = AppDataSource.getRepository(UserAnswer);
    const answers = await userAnswerRepository.find({
      where: { user: { id: userId } },
      relations: ["question", "option"], // Traemos la pregunta y la opción elegida
    });

    return answers;
  } catch (error) {
    console.error("Error al obtener las respuestas:", error);
    return { error: error.message };
  }
};

// Obtener respuestas de un usuario en una sección específica
const getUserAnswersBySection = async (userId, sectionId) => {
  try {
    const userAnswerRepository = AppDataSource.getRepository(UserAnswer);

    const answers = await userAnswerRepository
      .createQueryBuilder("userAnswer")
      .innerJoinAndSelect("userAnswer.question", "question")
      .innerJoinAndSelect("userAnswer.option", "option")
      .where("userAnswer.userId = :userId", { userId })
      .andWhere("question.sectionId = :sectionId", { sectionId })
      .getMany();

    return answers;
  } catch (error) {
    console.error("Error al obtener respuestas por sección:", error);
    return { error: error.message };
  }
};

export default { saveUserAnswer, getUserAnswers, getUserAnswersBySection };
