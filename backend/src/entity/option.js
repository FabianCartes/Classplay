import { EntitySchema } from "typeorm";
import Question from "./question.js"; // Importar correctamente

const Option = new EntitySchema({
  name: "Option",
  tableName: "options",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
      unsigned: true, // IDs sin signo en MySQL
    },
    text: {
      type: "varchar",
      length: 500, // Mejor rendimiento en MySQL
      nullable: false,
    },
    isCorrect: {
      type: "tinyint",
      width: 1, // MySQL usa tinyint(1) en lugar de boolean
      default: 0, // false en MySQL se representa con 0
    },
  },
  relations: {
    question: {
      target: "Question",// Referencia correcta al modelo importado
      type: "many-to-one", // Una pregunta puede tener muchas opciones
      joinColumn: { name: "questionId" }, // FK hacia "questions"
      onDelete: "CASCADE", // Si se elimina una pregunta, se eliminan sus opciones
    },
  },
});

export default Option;
