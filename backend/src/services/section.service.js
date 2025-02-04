import Section from "../entity/section.js";
import { AppDataSource } from "../data-source.js";

// Crear sección
const createSection = async (sectionData) => {
  try {
    const { name, description, order, courseId, videoLink, totalTime } = sectionData;

    if (!name || !description || !order || !courseId) {
      throw new Error("Faltan campos obligatorios.");
    }

    const sectionRepository = AppDataSource.getRepository(Section);
    const newSection = sectionRepository.create({
      name, 
      description, 
      order, 
      course: { id: courseId }, // Relación con el curso
      videoLink, // Incluimos el videoLink opcional
      totalTime, // Incluimos el totalTime opcional
    });

    const savedSection = await sectionRepository.save(newSection);  // Esto guardará y generará el 'id'

    return savedSection;
  } catch (error) {
    console.error("Error al crear la sección:", error);
    return { error: error.message };
  }
};

// Obtener una sección por su ID
const getSectionById = async (id) => {
  try {
    const sectionRepository = AppDataSource.getRepository(Section);
    const section = await sectionRepository.findOne({
      where: { id },
    });

    if (!section) {
      return { error: "Sección no encontrada." }; // En caso de que no se encuentre la sección
    }

    return section; // Retorna los datos de la sección
  } catch (error) {
    console.error("Error al obtener la sección:", error);
    return { error: error.message };
  }
};

// Obtener todas las secciones de un curso
const getSectionsByCourse = async (courseId) => {
  try {
    const sectionRepository = AppDataSource.getRepository(Section);
    const sections = await sectionRepository.find({
      where: { course: { id: courseId } }, // Asegúrate de usar la relación
      order: { order: "ASC" }, // Ordenarlas por el campo `order`
    });

    return sections;
  } catch (error) {
    console.error("Error al obtener las secciones:", error);
    return { error: error.message };
  }
};

// Verificar si el ID es válido antes de proceder con la consulta
const updateSection = async (id, sectionData) => {
  try {
    const sectionRepository = AppDataSource.getRepository(Section);
    console.log("ID recibido para actualizar:", id); // Agregar log para verificar

    // Aquí ya no es necesario validar si el ID es un UUID, ya que estamos usando un entero autoincremental
    const section = await sectionRepository.findOne({ where: { id } });

    if (!section) {
      return { error: "Sección no encontrada." };
    }

    // Asegúrate de que el videoLink y totalTime se actualicen si se pasan
    if (sectionData.videoLink !== undefined) {
      section.videoLink = sectionData.videoLink;
    }
    if (sectionData.totalTime !== undefined) {
      section.totalTime = sectionData.totalTime;
    }

    sectionRepository.merge(section, sectionData);
    const updatedSection = await sectionRepository.save(section);

    return updatedSection;
  } catch (error) {
    console.error("Error al actualizar la sección:", error);
    return { error: error.message };
  }
};

// Eliminar sección
const deleteSection = async (id) => {
  try {
    const sectionRepository = AppDataSource.getRepository(Section);
    const result = await sectionRepository.delete(id);

    if (result.affected === 0) {
      return { error: "Sección no encontrada." };
    }

    return { message: "Sección eliminada correctamente." };
  } catch (error) {
    console.error("Error al eliminar la sección:", error);
    return { error: error.message };
  }
};

export default { createSection, getSectionById, getSectionsByCourse, updateSection, deleteSection };
