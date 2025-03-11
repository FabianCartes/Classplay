import { EntitySchema } from "typeorm";
import User from "./user.js"; // Importamos el modelo de User
import Course from "./course.js"; // Importamos el modelo de Course

const Inscription = new EntitySchema({
  name: "Inscription",
  tableName: "inscriptions",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
      unsigned: true, // IDs sin signo en MySQL
    },
    userId: {
      type: "int",
      unsigned: true, // Relación con la tabla "users"
      nullable: false,
    },
    courseId: {
      type: "int",
      unsigned: true, // Relación con la tabla "courses"
      nullable: false,
    },
    createdAt: {
      type: "datetime", // MySQL maneja mejor DATETIME para fechas
      default: () => "CURRENT_TIMESTAMP", // Guarda la fecha de inscripción
    },
  },
  relations: {
    user: {
      target: User,
      type: "many-to-one", // Un usuario puede tener muchas inscripciones
      joinColumn: { name: "userId" },
      onDelete: "CASCADE",
    },
    course: {
      target: Course,
      type: "many-to-one", // Un curso puede tener muchas inscripciones
      joinColumn: { name: "courseId" },
      onDelete: "CASCADE",
    },
  },
  uniques: [
    {
      columns: ["userId", "courseId"], // Evita inscripciones duplicadas
    },
  ],
});

export default Inscription;
