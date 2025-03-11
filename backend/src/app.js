import "reflect-metadata";
import express, { json, urlencoded } from "express";
import { join } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import createError from "http-errors";
import { AppDataSource } from "./data-source.js";
import indexRouter from "./routes/index.routes.js";
import userRoutes from "./routes/users.routes.js";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";
import cors from "cors";
import courseRoutes from "./routes/course.routes.js";
import sectionRoutes from "./routes/section.routes.js";
import questionRoutes from "./routes/question.routes.js";
import optionRoutes from "./routes/option.routes.js";
import inscriptionRoutes from "./routes/inscription.routes.js";
import user_answerRoutes from "./routes/user_answer.routes.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

// Configurar CORS para permitir peticiones solo desde el frontend
app.use(
  cors({
    origin: "https://classplay.cl", // Permitir solicitudes solo desde este origen
    methods: ["GET","POST","PUT","DELETE","OPTIONS","PATCH"], // Métodos permitidos
    allowedHeaders: "Content-Type,Authorization", // Encabezados permitidos
  })
);

// Obtener el directorio actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuración de middlewares y rutas
app.set("views", join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(join(__dirname, "public")));
app.use(express.json());

// Rutas
app.use("/", indexRouter);
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/sections", sectionRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/options", optionRoutes);
app.use("/api/inscriptions", inscriptionRoutes);
app.use("/api/user_answers", user_answerRoutes);


// Manejo de errores 404
app.use((req, res, next) => {
  next(createError(404));
});

// Middleware de manejo de errores
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    error: {
      message: err.message || "Error interno del servidor",
    },
  });
});

// Inicializar la conexión a la base de datos y luego iniciar el servidor
const initializeDatabase = async () => {
  try {
    await AppDataSource.initialize();   
    console.log("✅ Conexión a la base de datos establecida exitosamente");

    // Iniciar el servidor después de una conexión exitosa
    app.listen(port, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${port}`);
    });
  } catch (error) {
    console.error("❌ Error al conectar a la base de datos:", error);
    process.exit(1); // Salir del proceso con código de error
  }
};

initializeDatabase();

export default app;
