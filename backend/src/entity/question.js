import { EntitySchema } from "typeorm";
import Section from "./section.js";
import Option from "./option.js"; // Asegúrate de importar Option

const Question = new EntitySchema({
  name: "Question",
  tableName: "questions",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    type: {
      type: "varchar", // Tipo de pregunta: 'alternativa', 'verdadero_falso'
      nullable: false,
    },
    statement: {
      type: "text", // Enunciado de la pregunta
      nullable: false,
    },
    score: {
      type: "int", // Puntaje asignado a la pregunta
      default: 0,
    },
    imageUrl: {
      type: "varchar", // URL de una imagen asociada (opcional)
      nullable: true,
    },
    videoUrl: {
      type: "varchar", // URL de un video asociado (opcional)
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
      type: "one-to-many", // Relación uno a muchos
      inverseSide: "question", // Nombre del lado inverso en la entidad Option
      cascade: true, // Para permitir cascada de operaciones
    },
  },
});

export default Question;
