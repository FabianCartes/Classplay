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
      unsigned: true, // MySQL recomienda IDs sin signo
    },
    title: {
      type: "varchar",
      length: 255, // En MySQL es buena práctica definir un límite para varchar
      nullable: false,
    },
    description: {
      type: "longtext", // MySQL maneja "text" en varias versiones: tinytext, text, mediumtext, longtext
      nullable: false,
    },
    category: {
      type: "varchar",
      length: 100, // Definir un tamaño específico para evitar problemas de indexación
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
      type: "varchar",
      length: 500, // Si almacenas rutas de archivos, mejor darle más espacio
      nullable: true,
    },
    createdBy: {
      type: "int",
      unsigned: true, // ID sin signo para coincidir con la clave primaria de users
      nullable: false,
    },
    isPublic: {
      type: "tinyint",
      width: 1, // MySQL usa tinyint(1) en lugar de boolean
      default: 0, // En MySQL, false se representa con 0
    },
  },
  relations: {
    // Relación muchos a uno con la tabla de usuarios
    createdBy: {
      target: User, // Relación con la tabla "users"
      type: "many-to-one", // Un moderador puede crear muchos cursos
      joinColumn: { name: "createdBy" }, // La columna "createdBy" hace referencia a la columna "id" de la tabla "users"
      onDelete: "CASCADE", // Si un usuario (moderador) se elimina, también se eliminan sus cursos
    },
  },
});

export default Course;
