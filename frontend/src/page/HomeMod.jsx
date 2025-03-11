import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2"; // Importa SweetAlert2
import AuthContext from "../context/AuthContext";
import { FaExclamationTriangle } from "react-icons/fa"; // Importamos el ícono de advertencia

function HomeMod() {
  const { logout, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [filter, setFilter] = useState('all'); // 'all', 'public', 'private'

  const fetchCourses = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("https://classplay.cl/api/course/GetCourse/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Error al obtener los cursos");
      }

      const data = await response.json();
      setCourses(data);
    } catch (error) {
      console.error("Error al cargar los cursos:", error);
    }
  };

  const handleDeleteCourse = async (courseId) => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Se eliminará el curso junto a los usuarios inscritos.  No podrás revertir esta acción.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminarlo",
      cancelButtonText: "Cancelar",
    });

    if (!result.isConfirmed) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`https://classplay.cl/api/course/DeleteCourse/${courseId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Error al eliminar el curso");
      }

      const data = await response.json();
      Swal.fire("Eliminado", data.message, "success");

      setCourses((prevCourses) => prevCourses.filter((course) => course.id !== courseId));
    } catch (error) {
      console.error("Error al eliminar el curso:", error);
      Swal.fire("Error", "No se pudo eliminar el curso.", "error");
    }
  };

  const handleLogout = () => {
    Swal.fire({
      title: "¿Estás seguro de cerrar sesión?",
      text: "Se cerrará tu sesión actual.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, cerrar sesión",
      cancelButtonText: "Cancelar",
      customClass: {
        popup: "animate__animated animate__fadeInDown",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        logout();
        navigate("/login");
      }
    });
  };

  const toggleCourseVisibility = async (courseId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`https://classplay.cl/api/course/toggleVisibility/${courseId}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Error al cambiar el estado del curso");
      }

      const data = await response.json();
      Swal.fire("Éxito", data.message, "success");

      // Actualizar la lista de cursos
      fetchCourses();
    } catch (error) {
      console.error("Error al cambiar el estado del curso:", error);
      Swal.fire("Error", "No se pudo cambiar el estado del curso.", "error");
    }
  };

  const handleCreateCourse = () => {
    navigate("/createCourse");
  };

  const handleEditCourse = (courseId) => {
    console.log("courseId recibido:", courseId); // Verifica el valor aquí
    navigate(`/editCourse/${courseId}`);
  };

  const getRemainingDays = (endDate) => {
    const today = new Date();
    const end = new Date(endDate);
    const diffTime = end - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Convierte de milisegundos a días
    return diffDays;
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleViewAsUser = () => {
    // Redirige a la página Home para ver la vista de usuario normal
    navigate('/home');
  };

  const filteredCourses = courses.filter(course => {
    if (filter === 'public') {
      return course.isPublic;
    } else if (filter === 'private') {
      return !course.isPublic;
    }
    return true; // 'all' muestra todos los cursos
  });

  // Función para manejar los clics en los filtros
  const handleFilterClick = (selectedFilter) => {
    // Cambia el filtro solo si el filtro seleccionado es diferente del actual
    setFilter(prevFilter => prevFilter === selectedFilter ? 'all' : selectedFilter);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-r from-[#6d90bd] via-[#7fb2d6] to-[#76bde4] text-[#1d293f]">
      <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[#0A1F44]">Panel de Moderador</h1>
        <nav className="flex items-center space-x-4">
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md font-semibold"
          >
            Cerrar Sesión
          </button>
          <button
            onClick={handleViewAsUser}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md font-semibold"
          >
            Ver como Usuario 👁️
          </button>
        </nav>
      </div>
    </header>
  
      {/* El main ahora ocupa el espacio disponible */}
      <main className="flex-1 px-6 py-10">
        <div className="relative bg-white bg-opacity-10 p-8 rounded-lg shadow-2xl max-w-3xl mx-auto text-center backdrop-blur-sm
                    transition-all duration-300 ease-in-out hover:scale-105 hover:bg-opacity-20">
          <h2 className="text-5xl font-extrabold text-white drop-shadow-lg">
            ¡Hola, {user?.username}! 👋
          </h2>
          <p className="text-lg text-[#fafbfc] mt-4">
            Aquí puedes gestionar los cursos que estarán disponibles para los usuarios. 📚
          </p>
        </div>
  
        <div className="flex justify-center mt-10">
          <button
            onClick={handleCreateCourse}
            className="bg-[#26709b] hover:bg-[#1d5c86] text-white px-6 py-3 rounded-md font-semibold shadow-lg transition-all"
          >
            Crear Nuevo Curso
          </button>
        </div>
  
        

        <section className="bg-white text-[#1d293f] p-6 rounded-lg shadow-lg mt-10">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-2xl font-bold text-[#0A1F44]">Tus Cursos Actuales</h3>

        <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
          <span className="text-sm text-gray-600">Filtros:</span>
          
          {/* Filtro Público */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Público</span>
            <button
              onClick={() => handleFilterClick('public')}
              className={`w-6 h-6 rounded-full border-2 ${filter === 'public' ? 'bg-blue-500 text-white' : 'bg-white border-blue-500'}`}
            />
          </div>

          {/* Filtro Privado */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Privado</span>
            <button
              onClick={() => handleFilterClick('private')}
              className={`w-6 h-6 rounded-full border-2 ${filter === 'private' ? 'bg-blue-500 text-white' : 'bg-white border-blue-500'}`}
            />
          </div>
        </div>
      </div>

      {filteredCourses.length > 0 ? (
        <ul className="space-y-4">
          {filteredCourses.map((course) => {
            const remainingDays = getRemainingDays(course.endDate);
            const isWarning = remainingDays === 1;
            return (
              <li key={course.id} className="p-4 border border-gray-300 rounded-lg bg-[#f8fbff] shadow-md">
                {/* Renderiza el título con formato HTML */}
                <h4
                  className="text-xl font-bold text-[#0A1F44] break-words"
                  dangerouslySetInnerHTML={{ __html: course.title }}
                />

                {/* Renderiza la descripción con formato HTML */}
                <div className="ql-editor" dangerouslySetInnerHTML={{ __html: course.description }} />
    
                <p
                  className={`text-sm ${isWarning ? "text-red-600" : "text-gray-500"} flex justify-end items-center mt-2`}
                >
                  {isWarning && <FaExclamationTriangle className="mr-2 text-red-600" />}
                  <span>
                    Fecha de Término: {new Date(course.endDate).toLocaleDateString("es-ES")}{" "}
                    <span>(11:59PM)</span>
                  </span>
                </p>
    
                <p className="text-sm text-gray-500">
                  Creado por: <strong>{course.createdBy?.username || "Desconocido"}</strong>
                </p>
    
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">
                      {course.isPublic ? "Público" : "Privado"}
                    </span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={course.isPublic}
                        className="sr-only peer"
                        onChange={() => toggleCourseVisibility(course.id)}
                      />
                      <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-[#79c1d1] peer-checked:bg-[#5dcbd3] peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                    </label>
                  </div>
    
                  <div className="flex flex-col md:flex-row space-y-2 md:space-x-4 md:space-y-0">
                    <button
                      className="bg-[#00A8CC] hover:bg-[#3691a5] text-white px-4 py-2 rounded-md"
                      onClick={() => handleEditCourse(course.id)}
                    >
                      Editar
                    </button>
                    <button
                      className="bg-[#244364] hover:bg-[#1a3149] text-white px-4 py-2 rounded-md"
                      onClick={() => handleDeleteCourse(course.id)}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="text-gray-600">No hay cursos disponibles.</p>
      )}
    </section>

      </main>
  
      <footer className="text-center py-4 bg-[#0A1F44] text-[#d1d9e6]">
        © {new Date().getFullYear()} Mi Aplicación. Todos los derechos reservados.
      </footer>
    </div>
  );
  
  
}

export default HomeMod;
