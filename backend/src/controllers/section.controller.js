import sectionService from "../services/section.service.js";
const { createSection, getSectionById, getSectionsByCourse, updateSection, deleteSection } = sectionService;
import { AppDataSource } from "../data-source.js"; // Asegúrate de que la ruta es correcta
import Section from "../entity/section.js";


// Crear una nueva sección
const createSectionController = async (req, res) => {
  try {
    console.log("Datos recibidos en el controlador:", req.body);

    const { name, description, order, courseId, videoLink, totalTime } = req.body; // Ahora incluimos totalTime

    if (!name || !description || !order || !courseId) {
      return res.status(400).json({ message: "Campos incompletos en la sección." });
    }

    // Crear la sección usando el servicio correspondiente
    const savedSection = await createSection({ name, description, order, courseId, videoLink, totalTime });

    return res.status(201).json(savedSection);
  } catch (error) {
    console.error("Error al crear la sección:", error);
    return res.status(500).json({ message: "Error interno al crear la sección." });
  }
};

// Obtener una sección por su ID
const getSectionByIdController = async (req, res) => {
  try {
    const { sectionId } = req.params;

    if (!sectionId) {
      return res.status(400).json({ message: "Section ID is required." });
    }

    const section = await getSectionById(sectionId);

    if (section.error) {
      return res.status(404).json({ message: section.error });
    }

    return res.status(200).json(section);
  } catch (error) {
    console.error("Error al obtener la sección:", error);
    return res.status(500).json({ message: "Error al obtener la sección." });
  }
};

// Obtener todas las secciones de un curso
const getSectionsByCourseController = async (req, res) => {
  try {
    const { courseId } = req.params;

    console.log("Course ID recibido en el controlador:", courseId);

    if (!courseId) {
      return res.status(400).json({ message: "Course ID is required." });
    }

    const sections = await getSectionsByCourse(courseId);

    if (sections.error) {
      return res.status(404).json({ message: sections.error });
    }

    return res.status(200).json(sections);
  } catch (error) {
    console.error("Error en getSectionsByCourseController:", error);
    return res.status(error.statusCode || 500).json({ message: error.message });
  }
};


// Actualizar una sección
const updateSectionController = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, order, videoLink, totalTime } = req.body; // Ahora incluimos totalTime

    if (!id) {
      return res.status(400).json({ message: "Section ID is required." });
    }

    const updatedSection = await updateSection(id, { name, description, order, videoLink, totalTime });

    if (updatedSection.error) {
      return res.status(404).json({ message: updatedSection.error });
    }

    return res.status(200).json(updatedSection);
  } catch (error) {
    console.error("Error al actualizar la sección:", error);
    return res.status(error.statusCode || 500).json({ message: error.message });
  }
};

// Actualizar múltiples secciones
const updateSectionsController = async (req, res) => {
  try {
    console.log("Datos recibidos en updateSectionsController:", req.body.sections);
    const sections = req.body.sections;

    if (!sections || !Array.isArray(sections)) {
      return res.status(400).json({ message: "Se requiere un arreglo de secciones." });
    }

    // Iterar y actualizar cada sección en la base de datos
    const promises = sections.map(async (section) => {
      const { id, name, description, order, videoLink, totalTime } = section; // Ahora incluimos totalTime
      return await updateSection(id, { name, description, order, videoLink, totalTime });
    });

    await Promise.all(promises);

    res.status(200).json({ message: "Secciones actualizadas correctamente." });
  } catch (error) {
    console.error("Error al actualizar las secciones:", error);
    res.status(500).json({ message: "Error al actualizar las secciones." });
  }
};

// Eliminar una sección
const deleteSectionController = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Section ID is required." });
    }

    const result = await deleteSection(id);

    if (result.error) {
      return res.status(404).json({ message: result.error });
    }

    return res.status(200).json({ message: result.message });
  } catch (error) {
    console.error("Error al eliminar la sección:", error);
    return res.status(error.statusCode || 500).json({ message: error.message });
  }
};

const getCourseIdBySectionController = async (req, res) => {
  try {
    const { sectionId } = req.params;

    const sectionRepository = AppDataSource.getRepository(Section);
    const section = await sectionRepository.findOne({
      where: { id: sectionId },
      relations: ["course"], // Asegura que la relación con "course" se cargue
    });

    if (!section || !section.course) {
      return res.status(404).json({ message: "No se encontró el curso de esta sección" });
    }

    res.json({ courseId: section.course.id }); // Asegúrate de acceder correctamente al courseId
  } catch (error) {
    console.error("Error al obtener el courseId:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};


export default {
  createSectionController,
  getSectionByIdController,
  getSectionsByCourseController,
  updateSectionController,
  updateSectionsController,
  deleteSectionController,
  getCourseIdBySectionController,
};
