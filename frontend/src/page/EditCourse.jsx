import { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import AuthContext from "../context/AuthContext";
import ReactQuill from 'react-quill'; // Importa ReactQuill
import "react-quill/dist/quill.snow.css"; // Importar los estilos de Quill
import Quill from "quill"; // Asegúrate de importar Quill si aún no lo hiciste
import { Book, FileText, Tag, Calendar, Link, SortAsc} from "lucide-react";

function EditCourse() {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const { courseId } = useParams();
  const [courseData, setCourseData] = useState({
    title: "",
    description: "",
    category: "",
    startDate: "",
    endDate: "",
  });
  const [sections, setSections] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newSection, setNewSection] = useState(null);
  const [topUsers, setTopUsers] = useState([]); // Crea un estado para almacenar el top de usuarios

useEffect(() => {
  const fetchSections = async () => {
    const fetchedSections = await getSections(courseId);
    setSections(fetchedSections);
  };
  fetchSections();
}, [courseId]);

const createNewSection = () => {
  setNewSection({
    name: "",
    description: "",
    order: "",
    videoLink: "",
  });
};

const handleSectionChange = (index, field, value) => {
  setSections((prev) => {
    const updatedSections = [...prev];
    updatedSections[index][field] = value;
    return updatedSections;
  });
};

const handleNewSectionChange = (field, value) => {
  setNewSection((prev) => ({ ...prev, [field]: value }));
};

const saveSection = async (section, index) => {
  if (!section.name || !section.description || !section.order) {
    Swal.fire("Error", "Por favor, complete todos los campos obligatorios", "error");
    return;
  }

  const sectionData = {
    name: section.name,
    description: section.description,
    order: parseInt(section.order),
    videoLink: section.videoLink,
    courseId: Number(courseId),
  };

  await handleSaveSections(sectionData);
  if (index === -1) {
    setNewSection(null);
    setSections([...sections, sectionData]);
  }
};


  const handleLogout = () => {
      Swal.fire({
        title: "¿Estás seguro?",
        text: "Se cerrará tu sesión actual.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Sí, cerrar sesión",
        cancelButtonText: "Cancelar",
      }).then((result) => {
        if (result.isConfirmed) {
          logout();
          navigate("/login");
        }
      });
    };

    const fetchCourseData = async () => {
      try {
        const token = localStorage.getItem("token");
    
        // Obtener datos del curso
        const courseResponse = await fetch(
          `https://classplay.cl/api/course/GetCourse/${courseId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
    
        if (!courseResponse.ok) {
          throw new Error("Error al obtener los datos del curso");
        }
    
        const courseData = await courseResponse.json();
    
        // Obtener secciones asociadas al curso
        const sectionsResponse = await fetch(
          `https://classplay.cl/api/section/GetSectionsByCourse/${courseId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
    
        if (!sectionsResponse.ok) {
          throw new Error("Error al obtener las secciones del curso");
        }
    
        const sectionsData = await sectionsResponse.json();
    
        // Obtener el TOP de usuarios por curso
        const topUsersResponse = await fetch(
          `https://classplay.cl/api/user_answer/GetTopUsersByCourse/${courseId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
    
        if (!topUsersResponse.ok) {
          throw new Error("Error al obtener el TOP de usuarios");
        }
    
        const topUsersData = await topUsersResponse.json();
        setTopUsers(topUsersData); // Guardamos el top de usuarios en el estado
    
        // Actualizar estado con datos del curso y las secciones
        setCourseData({
          title: courseData.title || "",
          description: courseData.description || "",
          category: courseData.category || "",
          startDate: courseData.startDate || "",
          endDate: courseData.endDate || "",
        });
    
        setSections(sectionsData || []);
        setIsLoading(false);
      } catch (error) {
        console.error("Error al cargar los datos del curso:", error);
        setIsLoading(false);
      }
    };

  useEffect(() => {
    fetchCourseData();
  }, [courseId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCourseData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

   // Manejar cambios en ReactQuill para el Título
   const handleQuillTitleChange = (value) => {
    setCourseData((prevState) => ({
      ...prevState,
      title: value,
    }));
  };

  // Manejar cambios en ReactQuill para la Descripción
  const handleQuillDescriptionChange = (value) => {
    setCourseData((prevState) => ({
      ...prevState,
      description: value,
    }));
  };

      // Importa la clase de fuentes en Quill
    const Font = Quill.import("formats/font");

    // Define las fuentes permitidas
    Font.whitelist = [
      "sans-serif",
      "serif",
      "monospace",
    ];

    // Registra las fuentes en Quill
    Quill.register(Font, true);

    const modules = {
      toolbar: [
        [{ list: "ordered" }, { list: "bullet" }],
        [{ align: [] }], // Alineación (izquierda, centro, derecha, justificado)
        ["bold", "italic", "underline", "strike"],
        [{ color: [] }, { background: [] }], // Cambiar color de texto y fondo
        ["link"],
        ["blockquote", "code-block"],
        [{ script: "sub" }, { script: "super" }],
      ],
    };
    

    const handleSaveChanges = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `https://classplay.cl/api/course/UpdateCourse/${courseId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ ...courseData, sections }),
          }
        );
    
        if (!response.ok) {
          throw new Error("Error al guardar los cambios del curso");
        }
    
        Swal.fire("Éxito", "Los cambios se han guardado correctamente", "success");
      } catch (error) {
        console.error("Error al guardar cambios:", error);
        Swal.fire("Error", "Hubo un problema al guardar los cambios", "error");
      }
    };
    
    

  // Esta función ahora se asegura de enviar las secciones correctas al backend
  const handleSaveSections = async (section) => {
    try {
      const token = localStorage.getItem("token");
      const url = section.id
        ? `https://classplay.cl/api/section/UpdateSection/${section.id}` // Editar si tiene ID
        : "https://classplay.cl/api/section/CreateSection"; // Crear si no tiene ID
  
      const method = section.id ? "PUT" : "POST"; // PUT para actualizar, POST para crear
  
      console.log("Sección a guardar:", section);
  
      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(section),
      });
  
      const responseData = await response.json();
      console.log("Respuesta del backend:", responseData);
  
      if (!response.ok) {
        throw new Error(responseData.message || "Error al guardar la sección");
      }
  
      // Recargar las secciones solo si todo salió bien
      fetchCourseData();
  
      Swal.fire("Éxito", `Sección ${section.id ? "actualizada" : "creada"} correctamente`, "success");
    } catch (error) {
      console.error("Error al guardar la sección:", error);
      Swal.fire("Error", "Hubo un problema al guardar la sección", "error");
    }
  };



  const editSection = async (section) => {
    if (!section.id) {
      Swal.fire("Error", "No se puede encontrar el ID de la sección", "error");
      return;
    }
  
    try {
      const token = localStorage.getItem("token");
      const url = `https://classplay.cl/api/section/UpdateSection/${section.id}`;  // Usa el ID para actualizar
  
      const response = await fetch(url, {
        method: "PUT",  // Usamos PUT para actualizar
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(section),
      });
  
      const responseData = await response.json();
      console.log("Respuesta del backend:", responseData);
  
      if (!response.ok) {
        throw new Error(responseData.message || "Error al actualizar la sección");
      }
  
      // Recargar las secciones o actualizar el estado si todo salió bien
      fetchCourseData();
  
      Swal.fire("Éxito", "Sección actualizada correctamente", "success");
  
    } catch (error) {
      console.error("Error al actualizar la sección:", error);
      Swal.fire("Error", "Hubo un problema al actualizar la sección", "error");
    }
  };
  
  
  
  

  const deleteSection = (id) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta sección será eliminada permanentemente",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedSections = sections.filter((section) => section.id !== id);
        setSections(updatedSections);

        const token = localStorage.getItem("token");
        fetch(`https://classplay.cl/api/section/DeleteSection/${id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error("Error al eliminar la sección");
            }
            Swal.fire("Eliminado", "Sección eliminada correctamente", "success");
          })
          .catch((error) => {
            console.error("Error al eliminar la sección:", error);
            Swal.fire("Error", "Hubo un problema al eliminar la sección", "error");
          });
      }
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p className="text-xl font-semibold text-gray-700">Cargando...</p>
      </div>
    );
  }

  const getYouTubeID = (url) => {
    const regExp =
      /(?:youtube\.com\/(?:[^\/]+\/[^\/]+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regExp);
    return match ? match[1] : null;
  };

  const handleAddQuestions = (sectionId) => {
    // Redirige a la página CreateQuestion pasando el ID de la sección
    navigate(`/CreateQuestion/${sectionId}`);
  };
  


  return (
    <div className="min-h-screen bg-gradient-to-r from-[#6d90bd] via-[#7fb2d6] to-[#76bde4] text-[#1d293f]">
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-[#1d293f] ">Edición de Curso</h1>
          <button
            className="bg-[#00A8CC] hover:bg-[#3691a5] text-white px-4 py-2 rounded-md font-semibold shadow-lg"
            onClick={() => navigate(`/Course/${courseId}`)} // Asegúrate de que `courseId` esté definido
          >
            Ver el Curso 📚
          </button>

          <button
            onClick={handleLogout}
            className="bg-[#FF4C4C] hover:bg-[#FF3333] text-white px-4 py-2 rounded-md font-semibold"
          >
            Cerrar Sesión
          </button>
        </div>
      </header>
  
      <main className="px-4 py-10 space-y-10">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => navigate("/HomeMod")}
            className="bg-[#0A1F44] hover:bg-[#0c1320] text-white px-4 py-2 rounded-md font-semibold shadow-lg"
          >
            Volver Atrás
          </button>
        </div>
  
        <section className="bg-gradient-to-r from-[#144069] to-[#17566e] p-8 rounded-lg shadow-lg max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:space-x-8 space-y-6 md:space-y-0">
  {/* Sección de Resultados Inscritos (Arriba en móvil, Izquierda en escritorio) */}
  <div className="order-1 md:order-none w-full md:w-1/4 bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
    <h3 className="text-2xl font-bold text-center text-gray-800 mb-4">
      Resultados Inscritos
    </h3>
    {topUsers && topUsers.length > 0 ? (
      <div>
        {/* Nombres de los usuarios */}
        <div className="flex justify-between font-semibold text-gray-600 mb-2">
          <span>Nombre</span>
          <span>Puntaje</span>
        </div>
        <ul className="space-y-2">
          {topUsers.map((user, index) => {
            let backgroundColor = "";
            if (index === 0) backgroundColor = "bg-[#f9e4a0]";
            else if (index === 1) backgroundColor = "bg-[#d1d1d1]";
            else if (index === 2) backgroundColor = "bg-[#e2b97a]";

            return (
              <li key={index} className={`flex justify-between p-2 rounded-lg ${backgroundColor}`}>
                <span className="text-gray-600 font-bold">{user.username}</span>
                <span className="font-bold text-gray-800">{user.totalScore}</span>
              </li>
            );
          })}
        </ul>
      </div>
    ) : (
      <p className="text-center text-gray-600">No hay puntajes disponibles</p>
    )}
  </div>

    {/* Sección de Información Principal a la derecha */}
    <div className="w-full md:w-3/4">
    <h2 className="text-3xl font-bold text-white mb-6 text-center">
      Portada del curso
    </h2>
      <div className="space-y-6">
        {/* Título del curso */}
        <div className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
          <label
            htmlFor="title"
            className="flex items-center gap-2 text-lg font-bold bg-gradient-to-r from-cyan-700 to-cyan-700 text-transparent bg-clip-text uppercase tracking-wide border-b-2 border-cyan-800 pb-1"
          >
            <Book size={20} className="text-cyan-700" />
            Título del curso
          </label>
          <ReactQuill
            theme="snow"
            value={courseData.title}
            onChange={handleQuillTitleChange}
            className="w-full p-2 border border-[#d1d9e6] rounded-md mt-2"
            placeholder="Título del curso"
            modules={modules}
          />
        </div>

        {/* Descripción del curso */}
        <div className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
          <label
            htmlFor="description"
            className="flex items-center gap-2 text-lg font-bold bg-gradient-to-r from-cyan-700 to-cyan-700 text-transparent bg-clip-text uppercase tracking-wide border-b-2 border-cyan-800 pb-1"
          >
            <FileText size={20} className="text-cyan-700" />
            Descripción del curso
          </label>
          <ReactQuill
            theme="snow"
            value={courseData.description}
            onChange={handleQuillDescriptionChange}
            className="w-full p-2 border border-[#d1d9e6] rounded-md mt-2"
            placeholder="Descripción del curso"
            modules={modules}
          />
        </div>

        {/* Categoría */}
        <div className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
          <label
            htmlFor="category"
            className="flex items-center gap-2 text-lg font-bold bg-gradient-to-r from-cyan-700 to-cyan-700 text-transparent bg-clip-text uppercase tracking-wide border-b-2 border-cyan-800 pb-1"
          >
            <Tag size={20} className="text-cyan-700" />
            Categoría
          </label>
          <input
            type="text"
            name="category"
            value={courseData.category}
            onChange={handleChange}
            className="w-full p-2 border border-[#d1d9e6] rounded-md mt-2"
            placeholder="Categoría"
          />
        </div>

        {/* Fechas inicio y fin */}
        <div className="flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0">
          <div className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 w-full">
            <label
              htmlFor="startDate"
              className="flex items-center gap-2 text-lg font-bold bg-gradient-to-r from-teal-500 to-teal-500 text-transparent bg-clip-text uppercase tracking-wide border-b-2 border-teal-500 pb-1"
            >
              <Calendar size={20} className="text-teal-500" />
              Fecha de inicio
            </label>
            <input
              type="date"
              name="startDate"
              value={courseData.startDate}
              onChange={handleChange}
              className="w-full p-2 border border-[#d1d9e6] rounded-md mt-2"
            />
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 w-full">
            <label
              htmlFor="endDate"
              className="flex items-center gap-2 text-lg font-bold bg-gradient-to-r from-indigo-800 to-indigo-800 text-transparent bg-clip-text uppercase tracking-wide border-b-2 border-indigo-800 pb-1"
            >
              <Calendar size={20} className="text-indigo-800" />
              Fecha de fin
            </label>
            <input
              type="date"
              name="endDate"
              value={courseData.endDate}
              onChange={handleChange}
              className="w-full p-2 border border-[#d1d9e6] rounded-md mt-2"
            />
          </div>
        </div>
      </div>

      {/* Botón para guardar los cambios */}
      <div className="flex justify-center mt-8 pb-10 md:pb-0">
        <button
          onClick={handleSaveChanges}
          className="bg-[#00A8CC] hover:bg-[#3691a5] text-white px-6 py-3 rounded-md font-semibold shadow-lg transition-all duration-300"
        >
          Guardar Cambios
        </button>
      </div>
    </div>
  </div>
</section>



        {/* SECCIONES DEL CURSO */}
        <div className="flex flex-col items-center gap-6">
  <div className="w-full max-w-7xl mx-auto bg-gradient-to-r from-[#144069] to-[#17566e] p-8 rounded-xl shadow-lg">
    <h2 className="text-3xl font-bold text-white mb-6 text-center">Agregar y Modificar Secciones</h2>
    <div className="flex justify-center mb-6">
      <button
        onClick={createNewSection}
        className="bg-[#ffffff] hover:bg-[#00A8CC] text-[#00A8CC] hover:text-white px-8 py-3 rounded-lg font-semibold shadow-lg transition duration-300"
      >
        Añadir Sección
      </button>
    </div>

    {newSection && (
      <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
        
        {/* Título */}
        <div className="mb-6">
          <div className="flex items-center mb-2">
            <Book className="mr-2 text-[#00A8CC]" />
            <label className="font-semibold text-[#1d293f]">Título</label>
          </div>
          <ReactQuill
            theme="snow"
            value={newSection.name}
            onChange={(value) => handleNewSectionChange("name", value)}
            className="w-full p-3 border rounded-lg shadow-sm"
            modules={modules}
            placeholder="Título de la sección"
          />
        </div>
        
        {/* Descripción */}
        <div className="mb-6">
          <div className="flex items-center mb-2">
            <FileText className="mr-2 text-[#00A8CC]" />
            <label className="font-semibold text-[#1d293f]">Descripción</label>
          </div>
          <ReactQuill
            theme="snow"
            value={newSection.description}
            onChange={(value) => handleNewSectionChange("description", value)}
            className="w-full p-3 border rounded-lg shadow-sm"
            modules={modules}
            placeholder="Descripción de la sección"
          />
        </div>

        {/* Orden */}
        <div className="mb-6">
          <div className="flex items-center mb-2">
            <Tag className="mr-2 text-[#00A8CC]" />
            <label className="font-semibold text-[#1d293f]">Orden</label>
          </div>
          <input
            type="number"
            placeholder="Orden de la sección"
            value={newSection.order}
            onChange={(e) => handleNewSectionChange("order", e.target.value)}
            className="w-full p-3 border rounded-lg shadow-sm"
          />
        </div>
        
        {/* Video Link */}
        <div className="mb-6">
          <div className="flex items-center mb-2">
            <Calendar className="mr-2 text-[#00A8CC]" />
            <label className="font-semibold text-[#1d293f]">Enlace de video (opcional)</label>
          </div>
          <input
            type="text"
            placeholder="Enlace de video (opcional)"
            value={newSection.videoLink}
            onChange={(e) => handleNewSectionChange("videoLink", e.target.value)}
            className="w-full p-3 mb-4 border rounded-lg shadow-sm"
          />
        </div>

        <div className="flex justify-center">
          <button
            onClick={() => saveSection(newSection, -1)}
            className="bg-[#00A8CC] hover:bg-[#3691a5] text-white px-6 py-3 rounded-md font-semibold shadow-lg"
          >
            Guardar Sección
          </button>
        </div>
      </div>
    )}

    {sections.map((section, index) => (
      <div key={section.id} className="mb-8 p-6 bg-white rounded-lg shadow-md">
        <h3 className="text-2xl font-bold text-[#1d293f] mb-4">Sección {section.order}</h3>

        {/* Título */}
        <div className="mb-6">
          <div className="flex items-center mb-2">
            <Book className="mr-2 text-[#00A8CC]" />
            <label className="font-semibold text-[#1d293f]">Título</label>
          </div>
          <ReactQuill
            theme="snow"
            value={section.name}
            onChange={(value) => handleSectionChange(index, "name", value)}
            className="w-full p-3 border rounded-lg shadow-sm"
            modules={modules}
            placeholder="Título de la sección"
          />
        </div>

        {/* Descripción */}
        <div className="mb-6">
          <div className="flex items-center mb-2">
            <FileText className="mr-2 text-[#00A8CC]" />
            <label className="font-semibold text-[#1d293f]">Descripción</label>
          </div>
          <ReactQuill
            theme="snow"
            value={section.description}
            onChange={(value) => handleSectionChange(index, "description", value)}
            className="w-full p-3 mb-2 border rounded-lg shadow-sm"
            modules={modules}
            placeholder="Descripción de la sección"
          />
        </div>

        {/* Orden */}
        <div className="mb-6">
          <div className="flex items-center mb-2">
            <SortAsc className="mr-2 text-[#00A8CC]" />
            <label className="font-semibold text-[#1d293f]">Orden</label>
          </div>
          <input
            type="number"
            placeholder="Orden de la sección"
            value={section.order}
            onChange={(e) => handleSectionChange(index, "order", e.target.value)}
            className="w-full p-3 mb-2 border rounded-lg shadow-sm"
          />
        </div>

        {/* Video Link */}
        <div className="mb-6">
          <div className="flex items-center mb-2">
            <Link className="mr-2 text-[#00A8CC]" />
            <label className="font-semibold text-[#1d293f]">Enlace de video (opcional)</label>
          </div>
          <input
            type="text"
            placeholder="Enlace de video (opcional)"
            value={section.videoLink}
            onChange={(e) => handleSectionChange(index, "videoLink", e.target.value)}
            className="w-full p-3 mb-4 border rounded-lg shadow-sm"
          />
        </div>

        <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
          <button
            onClick={() => editSection(section)}
            className="bg-[#00A8CC] hover:bg-[#3691a5] text-white px-4 py-2 rounded-md font-semibold shadow-lg w-full md:w-auto"
          >
            Guardar Cambios
          </button>
          <button
            onClick={() => deleteSection(section.id)}
            className="bg-[#163364] hover:bg-[#0f1b30] text-white px-4 py-2 rounded-md font-semibold shadow-lg w-full md:w-auto"
          >
            Eliminar
          </button>
          <button
            onClick={() => handleAddQuestions(section.id)}
            className="bg-[#5862e9] hover:bg-[#4249b4] text-white px-4 py-2 rounded-md font-semibold shadow-lg w-full md:w-auto"
          >
            Agregar Preguntas
          </button>
        </div>

      </div>
    ))}
  </div>
</div>
      </main>
    </div>
  );
  
  
  
}


export default EditCourse;
