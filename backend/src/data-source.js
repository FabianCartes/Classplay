import { DataSource } from "typeorm";
import * as dotenv from "dotenv";
import User from "./entity/user.js";
import Course from "./entity/course.js";
import Section from "./entity/section.js";
import Question from "./entity/question.js";
import Option from "./entity/option.js";
import Inscription from "./entity/inscription.js";
import UserAnswer from "./entity/user_answer.js";

// Carga las variables de entorno del archivo .env
dotenv.config();


export const AppDataSource = new DataSource({
    type: "postgres", // El tipo de base de datos (postgres, mysql, etc.)
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || "5432"),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    synchronize: true, // Cambiar a "false" en producción
    logging: false,
    entities: [User, Course, Section, Question, Option, Inscription,UserAnswer],
    subscribers: [],
    migrations: [],
})

