import { EntitySchema } from "typeorm";
import Question from "./question.js";  // Importar sin llaves, ya que es exportado por defecto

const Option = new EntitySchema({
  name: "Option",
  tableName: "options",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    text: {
      type: "text", // Texto de la opción
      nullable: false,
    },
    isCorrect: {
      type: "boolean", // Indica si esta opción es la correcta
      default: false,
    },
  },
  relations: {
    question: {
      target: "Question", // Usar "Question" como string para evitar la referencia antes de la inicialización
      type: "many-to-one", // Una pregunta puede tener muchas opciones
      joinColumn: { name: "questionId" }, // La columna "questionId" apunta al id de "questions"
      onDelete: "CASCADE", // Si se elimina una pregunta, también se eliminan sus opciones
    },
  },
});

export default Option;
