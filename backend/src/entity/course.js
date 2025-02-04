import { EntitySchema } from "typeorm";
import User from "./user.js"; // Asegúrate de que la ruta sea correcta

const Course = new EntitySchema({
  name: "Course",
  tableName: "courses",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    title: {
      type: "varchar",
      nullable: false,
    },
    description: {
      type: "text", // Usamos "text" para descripciones largas
      nullable: false,
    },
    category: {
      type: "varchar",
      nullable: false,
    },
    startDate: {
      type: "date",
      nullable: false,
    },
    endDate: {
      type: "date",
      nullable: false,
    },
    file: {
      type: "varchar", // Puede ser el nombre del archivo o la ruta
      nullable: true, // Si no es obligatorio subir un archivo
    },
    createdBy: {
      type: "int",
      nullable: false,
    },
    isPublic: {
      type: "boolean",
      default: false, // Los cursos serán privados por defecto
    },
  },
  relations: {
    // Relación muchos a uno con la tabla de usuarios
    createdBy: {
      target: User, // Relacion con la tabla "users"
      type: "many-to-one", // Un moderador puede crear muchos cursos
      joinColumn: { name: "createdBy" }, // La columna "createdBy" hace referencia a la columna "id" de la tabla "users"
      onDelete: "CASCADE", // Si un usuario (moderador) se elimina, también se eliminan sus cursos
    },
  },
});

export default Course;
