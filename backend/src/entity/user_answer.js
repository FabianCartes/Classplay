import { EntitySchema } from "typeorm";
import User from "./user.js";
import Question from "./question.js";
import Option from "./option.js";

const UserAnswer = new EntitySchema({
  name: "UserAnswer",
  tableName: "user_answers",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    created_at: {
      type: "timestamp",
      default: () => "CURRENT_TIMESTAMP",
    },
  },
  relations: {
    user: {
      target: User,
      type: "many-to-one",
      joinColumn: { name: "userId" },
      onDelete: "CASCADE",
    },
    question: {
      target: Question,
      type: "many-to-one",
      joinColumn: { name: "questionId" },
      onDelete: "CASCADE",
    },
    option: {
      target: Option,
      type: "many-to-one",
      joinColumn: { name: "optionId" },
      onDelete: "CASCADE",
    },
  },
  uniques: [
    {
      columns: ["user", "question"], // Un usuario solo puede responder una vez por pregunta
    },
  ],
});

export default UserAnswer;
