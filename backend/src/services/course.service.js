import Course from "../entity/course.js";
import { AppDataSource } from "..//data-source.js"; // Ajusta la ruta según tu estructura

// Crear curso
const createCourse = async (courseData) => {
  try {
    // Verifica qué datos recibes en el backend
    console.log("Datos del curso recibidos en el backend:", courseData);

    const { title, description, startDate, endDate, createdBy } = courseData;

    // Validación de datos
    if (!title || !description || !startDate || !endDate) {
      throw new Error("Faltan campos obligatorios.");
    }

    // Asegúrate de que el curso sea privado al crearlo
    const courseRepository = AppDataSource.getRepository(Course);
    const course = courseRepository.create({
      ...courseData,
      isPublic: false, // Asegura que el curso sea privado al momento de la creación
    });
    const savedCourse = await courseRepository.save(course);

    console.log("Curso guardado:", savedCourse);
    return savedCourse;
  } catch (error) {
    console.error("Error al guardar el curso:", error);
    return { error: error.message };
  }
};

// Obtener todos los cursos
const getCourses = async () => {
  try {
    const courseRepository = AppDataSource.getRepository(Course); // Usar la conexión activa
    const courses = await courseRepository.find({ relations: ["createdBy"] }); // Obtener todos los cursos con la relación de usuario
    return courses;
  } catch (error) {
    console.error("Error al obtener los cursos:", error);
    return { error: error.message }; // Devuelve el error para depuración
  }
};

// Obtener curso por ID
const getCourseById = async (id) => {
  try {
    const courseRepository = AppDataSource.getRepository(Course); // Usar la conexión activa
    const course = await courseRepository.findOne({ where: { id }, relations: ["createdBy"] }); // Obtener curso por ID con la relación de usuario
    if (!course) {
      return { error: "Curso no encontrado" }; // Si no existe el curso
    }
    return course;
  } catch (error) {
    console.error("Error al obtener el curso:", error);
    return { error: error.message }; // Devuelve el error para depuración
  }
};

// Actualizar curso
const updateCourse = async (id, courseData) => {
  try {
    const courseRepository = AppDataSource.getRepository(Course); // Usar la conexión activa
    const course = await courseRepository.findOne({ where: { id } }); // Buscar el curso por ID

    if (!course) {
      return { error: "Curso no encontrado" }; // Si no existe el curso
    }

    // Actualizar el curso
    courseRepository.merge(course, courseData); // Merge de los nuevos datos con el curso existente
    const updatedCourse = await courseRepository.save(course); // Guardar los cambios
    return updatedCourse;
  } catch (error) {
    console.error("Error al actualizar el curso:", error);
    return { error: error.message }; // Devuelve el error para depuración
  }
};

// Eliminar curso
const deleteCourse = async (id) => {
  try {
    const courseRepository = AppDataSource.getRepository(Course); // Usar la conexión activa
    const result = await courseRepository.delete(id); // Eliminar el curso por ID

    if (result.affected === 0) {
      return { error: "Curso no encontrado" }; // Si no se eliminó ningún curso
    }

    return { message: "Curso eliminado exitosamente" }; // Si se eliminó correctamente
  } catch (error) {
    console.error("Error al eliminar el curso:", error);
    return { error: error.message }; // Devuelve el error para depuración
  }
};

const toggleCourseVisibility = async (courseId) => {
  try {
    const courseRepository = AppDataSource.getRepository(Course); // Usar el repositorio de la entidad Course

    // Buscar el curso por su ID
    const course = await courseRepository.findOne({ where: { id: courseId } });

    if (!course) {
      return { error: "Curso no encontrado." }; // Si no se encuentra el curso, devuelve un error
    }

    // Alternar el estado de visibilidad
    course.isPublic = !course.isPublic;

    // Guardar los cambios en la base de datos
    const updatedCourse = await courseRepository.save(course);

    return updatedCourse;
  } catch (error) {
    console.error("Error al alternar la visibilidad del curso:", error);
    throw new Error("No se pudo alternar la visibilidad del curso.");
  }
};


// Obtener solo los cursos públicos
const getPublicCourses = async () => {
  try {
    const courseRepository = AppDataSource.getRepository(Course); // Usar la conexión activa
    const publicCourses = await courseRepository.find({
      where: { isPublic: true }, // Solo cursos públicos
      relations: ["createdBy"], // Incluir relación con el creador del curso
    });
    return publicCourses;
  } catch (error) {
    console.error("Error al obtener los cursos públicos:", error);
    return { error: error.message }; // Devuelve el error para depuración
  }
};


const validateCourseData = (data) => {
  const { title, description, category, startDate, endDate } = data;
  if (!title || !description || !category || !startDate || !endDate) {
    throw { statusCode: 400, message: "Todos los campos son obligatorios." };
  }

  // Validar formato de las fechas (opcional)
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/; // YYYY-MM-DD
  if (!dateRegex.test(startDate) || !dateRegex.test(endDate)) {
    throw { statusCode: 400, message: "Formato de fecha inválido." };
  }
};


export default { createCourse, getCourses, getCourseById, updateCourse, deleteCourse, toggleCourseVisibility, getPublicCourses, validateCourseData };
