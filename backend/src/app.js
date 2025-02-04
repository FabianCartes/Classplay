import 'reflect-metadata';
import express, { json, urlencoded } from 'express';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import createError from 'http-errors';
import { AppDataSource } from './data-source.js';
import indexRouter from './routes/index.routes.js';
import userRoutes from"./routes/users.routes.js";
import dotenv from 'dotenv';
import authRoutes from'./routes/auth.routes.js';
import cors from 'cors';
import courseRoutes from './routes/course.routes.js';
import sectionRoutes from "./routes/section.routes.js";
import questionRoutes from "./routes/question.routes.js";
import optionRoutes from "./routes/option.routes.js";
import inscriptionRoutes from "./routes/inscription.routes.js";
import user_answerRoutes from "./routes/user_answer.routes.js";
dotenv.config();

const app = express();
app.use(cors({
  origin: 'http://localhost:3000', // Permitir solicitudes solo desde este origen
  methods: 'GET,POST,PUT,DELETE,OPTIONS,PATCH', // Métodos permitidos
  allowedHeaders: 'Content-Type,Authorization', // Encabezados permitidos
}));
const port = 4000;

// Obtener el directorio actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


// Inicializar la conexión a la base de datos
const initializeDatabase = async () => {
  try {
    await AppDataSource.initialize();
    console.log('Conexión a la base de datos establecida exitosamente');

    // Iniciar el servidor Express después de una conexión exitosa
    app.listen(port, () => {
      console.log(`Aplicación escuchando en el puerto ${port}`);
    });
  } catch (error) {
    console.error('Error al conectar a la base de datos:', error);
    process.exit(1); // Salir del proceso con un código de error
  }
};
initializeDatabase();



// Configuración de middlewares y rutas
app.set('views', join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(join(__dirname, 'public')));
app.use(express.json());

app.use('/', indexRouter);
app.use("/api", userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api', courseRoutes);
app.use('/api', sectionRoutes);
app.use('/api', questionRoutes);
app.use('/api', optionRoutes);
app.use('/api', inscriptionRoutes);
app.use('/api', user_answerRoutes);


export default app;