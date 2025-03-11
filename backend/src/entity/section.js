import { EntitySchema } from "typeorm";
import Course from "./course.js"; // Importar correctamente

const Section = new EntitySchema({
  name: "Section",
  tableName: "sections",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
      unsigned: true, // IDs sin signo en MySQL
    },
    name: {
      type: "varchar",
      length: 255, // Definir longitud máxima para el nombre
      nullable: false,
    },
    description: {
      type: "varchar",
      length: 1000, // Mejor rendimiento en MySQL que "text"
      nullable: true,
    },
    order: {
      type: "int",
      unsigned: true, // `order` no puede ser negativo
      default: 1,
    },
    videoLink: {
      type: "varchar",
      length: 500, // Limitar la longitud de la URL del video
      nullable: true,
    },
    totalTime: {
      type: "int", // Tiempo total en minutos
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
