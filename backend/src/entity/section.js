import { EntitySchema } from "typeorm";
import Course from "./course.js"; // Asegúrate de que la ruta sea correcta

const Section = new EntitySchema({
  name: "Section",
  tableName: "sections",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    name: {
      type: "varchar",
      nullable: false,
    },
    description: {
      type: "text",
      nullable: true,
    },
    order: {
      type: "int",
      default: 1,
    },
    videoLink: {
      type: "varchar",
      nullable: true,
    },
    totalTime: { // Tiempo total para responder todas las preguntas
      type: "int", // Guardará el tiempo en minutos
      nullable: true,
    },
  },
  relations: {
    course: {
      target: Course,
      type: "many-to-one",
      joinColumn: { name: "courseId" },
      onDelete: "CASCADE",
    },
  },
});


export default Section;
