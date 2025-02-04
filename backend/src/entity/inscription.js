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
    },
    userId: {
      type: "int",
      nullable: false,
    },
    courseId: {
      type: "int",
      nullable: false,
    },
    createdAt: {
      type: "timestamp",
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
      columns: ["userId", "courseId"], // Evita que un usuario se inscriba dos veces en el mismo curso
    },
  ],
});

export default Inscription;
