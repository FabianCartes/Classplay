import courseService from "../services/course.service.js";
const { createCourse, getCourses, getCourseById, updateCourse, deleteCourse, toggleCourseVisibility, getPublicCourses, validateCourseData } = courseService;

// Crear un nuevo curso
const createCourseController = async (req, res) => {
  try {
    console.log("Usuario autenticado en controlador:", req.user);
    // Aseguramos que el ID del usuario autenticado (req.user.id) se agregue al curso
    const courseData = { ...req.body, createdBy: req.user.id }; // Usamos el ID del usuario autenticado
    // Llamar al servicio para crear el curso
    const course = await createCourse(courseData);

    // Si el curso fue creado correctamente, respondemos con el curso creado
    return res.status(201).json(course);
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message });
  }
};

// Obtener todos los cursos
const getCoursesController = async (req, res) => {
  try {
    const courses = await getCourses();
    return res.status(200).json(courses);
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message });
  }
};

// Obtener un curso por ID
const getCourseByIdController = async (req, res) => {
  const { id } = req.params;

  // Verifica que el ID esté presente en la URL
  if (!id) {
    return res.status(400).json({ message: "Course ID is required." });
  }

  try {
    const course = await getCourseById(id); // Llama a la función para obtener el curso por ID
    if (!course) {
      return res.status(404).json({ message: "Course not found." });
    }
    return res.status(200).json(course);
  } catch (error) {
    console.error("Error al obtener el curso:", error);
    return res.status(error.statusCode || 500).json({ message: error.message });
  }
};


// Actualizar un curso
const updateCourseController = async (req, res) => {
  try {
    // Validar los datos del body antes de actualizar el curso
    if (validateCourseData) {
      validateCourseData(req.body);
    }

    // Llamar al servicio para actualizar el curso
    const updatedCourse = await updateCourse(req.params.id, req.body);
    if (!updatedCourse) {
      return res.status(404).json({ message: "Course not found." });
    }
    return res.status(200).json(updatedCourse);
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message });
  }
};

// Eliminar un curso
const deleteCourseController = async (req, res) => {
  try {
    const success = await deleteCourse(req.params.id);
    if (!success) {
      return res.status(404).json({ message: "Course not found." });
    }
    return res.status(200).json({ message: "Curso eliminado Exitosamente" });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message });
  }
};

// Alternar visibilidad de un curso
const toggleCourseVisibilityController = async (req, res) => {
  try {
    const courseId = req.params.id; // ID del curso a modificar

    // Llamar al servicio para alternar la visibilidad
    const updatedCourse = await courseService.toggleCourseVisibility(courseId);

    if (updatedCourse.error) {
      return res.status(404).json({ message: updatedCourse.error });
    }

    return res.status(200).json({
      message: "Estado de visibilidad del curso actualizado.",
      course: updatedCourse,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message });
  }
};


// Obtener solo los cursos públicos
const getPublicCoursesController = async (req, res) => {
  try {
    const publicCourses = await courseService.getPublicCourses();
    return res.status(200).json(publicCourses);
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message });
  }
};

export default {
  createCourseController,
  getCoursesController,
  getCourseByIdController,
  updateCourseController,
  deleteCourseController,
  toggleCourseVisibilityController,
  getPublicCoursesController,
};
