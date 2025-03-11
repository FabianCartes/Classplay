import { EntitySchema } from "typeorm";
import Section from "./section.js";
import Option from "./option.js"; // Importar correctamente

const Question = new EntitySchema({
  name: "Question",
  tableName: "questions",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
      unsigned: true, // Claves primarias sin signo en MySQL
    },
    type: {
      type: "varchar",
      length: 50, // Tipo de pregunta: 'alternativa', 'verdadero_falso'
      nullable: false,
    },
    statement: {
      type: "varchar",
      length: 1000, // Mejor rendimiento en MySQL que "text"
      nullable: false,
    },
    score: {
      type: "int",
      unsigned: true, // El puntaje no debe ser negativo
      default: 0,
    },
    imageUrl: {
      type: "varchar",
      length: 500, // URL de imagen (opcional)
      nullable: true,
    },
    videoUrl: {
      type: "varchar",
      length: 500, // URL de video (opcional)
      nullable: true,
    },
  },
  relations: {
    section: {
      target: Section,
      type: "many-to-one",
      joinColumn: { name: "sectionId" },
      onDelete: "CASCADE",
    },
    options: {
      target: Option,
      type: "one-to-many", // Una pregunta tiene muchas opciones
      inverseSide: "question", // Relación inversa en la entidad Option
      cascade: true, // Propagar operaciones (crear, eliminar)
    },
  },
});

export default Question;
