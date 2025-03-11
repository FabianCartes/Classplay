import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2"; // Importa SweetAlert2
import AuthContext from "../context/AuthContext";
import { FaExclamationTriangle } from 'react-icons/fa';

function HomeNormal() {
  const { logout, user } = useContext(AuthContext); // Usamos el método logout del contexto
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("available"); // Estado para controlar la pestaña activa
  const [courses, setCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);

  useEffect(() => {
    const checkAndUpdateCourses = async () => {
      const now = new Date();
      const todayEnd = new Date();
      todayEnd.setHours(23, 59, 59, 999); // 11:59:59 PM
  
      const token = localStorage.getItem("token");
  
      for (const course of courses) {
        const endDate = new Date(course.endDate);
        
        if (endDate <= todayEnd && course.isPublic) {
          try {
            const response = await fetch(`https://classplay.cl/api/course/toggleVisibility/${course.id}`, {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({ isPublic: false }), // Enviamos el nuevo estado
            });
  
            if (response.ok) {
              console.log(`El curso "${course.title}" ahora es privado.`);
              fetchCourses(); // Recargar los cursos actualizados
            } else {
              console.error(`Error al actualizar el curso "${course.title}".`);
            }
          } catch (error) {
            console.error("Error en la petición de actualización:", error);
          }
        }
      }
    };
  
    checkAndUpdateCourses();
  }, [courses]);
  

  // Obtener los cursos públicos desde el backend
  const fetchCourses = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("https://classplay.cl/api/course/GetPublicCourses", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Error al obtener los cursos públicos");
      }

      const data = await response.json();
      setCourses(data);
    } catch (error) {
      console.error("Error al cargar los cursos públicos:", error);
    }
  };

  // Obtener los cursos en los que el usuario está inscrito
  const fetchEnrolledCourses = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("https://classplay.cl/api/inscription/MyInscriptions", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        throw new Error("Error al obtener los cursos inscritos");
      }
  
      const data = await response.json();
      setEnrolledCourses(data);
    } catch (error) {
      console.error("Error al cargar los cursos inscritos:", error);
    }
  };
  

  const formatEndDate = (endDate) => {
    const date = new Date(endDate);
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const isOneDayLeft = (endDate) => {
    const now = new Date();
    const end = new Date(endDate);
    const diffTime = end - now;
    const oneDayInMs = 24 * 60 * 60 * 1000;
    return diffTime <= oneDayInMs && diffTime > 0;
  };

  useEffect(() => {
    fetchCourses();
    fetchEnrolledCourses();
  }, []);

  const renderCourses = (coursesList) => {
    return coursesList.length > 0 ? (
      <ul className="space-y-4">
        {coursesList.map((course) => {
          // Verifica si el usuario ya está inscrito en el curso
          const isEnrolled = enrolledCourses.some((enrolled) => enrolled.id === course.id);
  
          return (
            <li
              key={course.id}
              className="p-4 border border-gray-300 rounded-lg bg-gray-50 shadow-sm"
            >
              {/* Renderiza el título con formato HTML */}
              <h4
                className="text-xl font-bold text-gray-700"
                dangerouslySetInnerHTML={{ __html: course.title }}
              />
              
              {/* Renderiza la descripción con formato HTML */}
              <div
                className="ql-editor text-gray-600"
                dangerouslySetInnerHTML={{ __html: course.description }}
              />
          
              <div className="mt-2">
                <span
                  className={`text-sm font-semibold ${
                    isOneDayLeft(course.endDate) ? "text-red-500" : "text-gray-500"
                  }`}
                >
                  Fecha de término: {formatEndDate(course.endDate)}{" "}
                  <span className="font-normal">(11:59PM)</span>
                </span>
              </div>
          
              {activeTab !== "enrolled" && (
                <p className="text-sm text-gray-500">
                  Creado por: <strong>{course.createdBy?.username || "Desconocido"}</strong>
                </p>
              )}
          
              {activeTab === "available" && (
                <div className="flex justify-end mt-4">
                  {isEnrolled ? (
                    <button
                      className="bg-[#00A8CC] text-white px-6 py-3 rounded-md font-semibold shadow-lg cursor-not-allowed"
                      disabled
                    >
                      Ya estás inscrito
                    </button>
                  ) : (
                    <button
                      className="bg-[#00A8CC] hover:bg-[#3691a5] text-white px-6 py-3 rounded-md font-semibold shadow-lg"
                      onClick={() => handleEnrollConfirm(course)}
                    >
                      Inscribirme
                    </button>
                  )}
                </div>
              )}
          
              {activeTab === "enrolled" && (
                <div className="flex justify-between mt-4">
                  <button
                    className="bg-[#00A8CC] hover:bg-[#3691a5] text-white px-4 py-2 rounded-md font-semibold shadow-lg"
                    onClick={() => navigate(`/Course/${course.id}`)}
                  >
                    Entrar
                  </button>
                  <button
                    className="bg-[#244364] hover:bg-[#1a3149] text-white px-4 py-2 rounded-md font-semibold shadow-lg"
                    onClick={() => handleUnenrollConfirm(course.id)}
                  >
                    Desinscribirme
                  </button>
                </div>
              )}
            </li>
          );
          
        })}
      </ul>
    ) : (
      <p className="text-gray-600">No hay cursos disponibles.</p>
    );
  };
  
  
  

  const handleEnrollConfirm = (course) => {
    Swal.fire({
      title: `¿Quieres inscribirte en este curso?`,
      html: `
        <h3 class="text-xl font-bold text-gray-700">${course.title}</h3>
        <p class="text-lg text-gray-600 my-2">${course.description}</p>
        <p class="text-sm text-gray-500">Fecha de término: ${formatEndDate(course.endDate)}</p>
      `,
      showCancelButton: true,
      confirmButtonText: "Sí, inscribirme",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
    }).then((result) => {
      if (result.isConfirmed) {
        handleEnroll(course.id); // Inscribirse al curso
      }
    });
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
    }).then((result) => {
      if (result.isConfirmed) {
        logout(); // Llamamos a la función logout del contexto
        navigate("/login"); // Navegamos a la página de inicio de sesión
      }
    });
  };


  const handleEnroll = async (courseId) => {
    try {
      const token = localStorage.getItem("token");
  
      const response = await fetch("https://classplay.cl/api/inscription/Enroll", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ courseId }),
      });
  
      if (!response.ok) {
        throw new Error("Error al inscribirse en el curso");
      }
  
      Swal.fire("¡Inscripción exitosa!", "Te has inscrito en el curso.", "success");
  
      // Refrescar la lista de cursos inscritos
      fetchEnrolledCourses();
    } catch (error) {
      console.error("Error al inscribirse en el curso:", error);
      Swal.fire("Error", "No se pudo completar la inscripción.", "error");
    }
  };

  const handleUnenrollConfirm = (courseId) => {
    Swal.fire({
      title: "¿Seguro que quieres desinscribirte?",
      text: "Se eliminará tu inscripción en este curso.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, desinscribirme",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
    }).then((result) => {
      if (result.isConfirmed) {
        handleUnenroll(courseId);
      }
    });
  };

  const handleUnenroll = async (courseId) => {
    try {
      const token = localStorage.getItem("token");
  
      const response = await fetch(`https://classplay.cl/api/inscription/Unenroll/${courseId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        throw new Error("Error al desinscribirse del curso");
      }
  
      Swal.fire("¡Desinscripción exitosa!", "Has salido del curso.", "success");
  
      // Refrescar la lista de cursos inscritos
      fetchEnrolledCourses();
    } catch (error) {
      console.error("Error al desinscribirse:", error);
      Swal.fire("Error", "No se pudo completar la desinscripción.", "error");
    }
  };

  const getRemainingDays = (endDate) => {
    const today = new Date();
    const end = new Date(endDate);
    const diffTime = end - today;  // Diferencia en milisegundos
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Convertir a días
    return diffDays;
  };

  const handleReturnToAdmin = () => {
    // Redirige a la página de administración
    navigate('/HomeMod');
  };
  
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-r from-[#6d90bd] via-[#7fb2d6] to-[#76bde4] text-[#1d293f]">
       <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[#0A1F44]">
          Bienvenido a tu portal de cursos
        </h1>
        <nav className="flex items-center space-x-4">
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md font-semibold"
          >
            Cerrar Sesión
          </button>

          {user?.role === 'moderador' && (
            <button
              onClick={handleReturnToAdmin}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md font-semibold"
            >
              Volver a Administrar 👨‍💻
            </button>
          )}
        </nav>
      </div>
    </header>
  
      <main className="flex-1 px-6 py-10">
        <div className="relative bg-white bg-opacity-10 p-8 rounded-lg shadow-2xl max-w-3xl mx-auto text-center backdrop-blur-sm
                transition-all duration-300 ease-in-out hover:scale-105 hover:bg-opacity-20">
          <h2 className="text-5xl font-extrabold text-white drop-shadow-lg">
            ¡Hola, {user?.username}! 👋
          </h2>
          <p className="text-lg text-[#fafbfc] mt-4">
            Bienvenido a tu portal de aprendizaje. Aquí puedes gestionar tus cursos y seguir aprendiendo cada día. 📚
          </p>
        </div>
  
        <div className="flex border-b border-[#3b475a] mb-6">
          <button
            className={`relative px-6 py-3 font-semibold transition-all duration-300
              ${activeTab === "available"
                ? "text-white bg-[#26709b] shadow-md rounded-t-lg before:absolute before:top-0 before:left-0 before:w-full before:h-full before:bg-[#26709b] before:rounded-t-lg before:opacity-30 before:-z-10"
                : "text-[#3b485a] hover:text-[#26709b]"}`}
            onClick={() => setActiveTab("available")}
          >
            Cursos Disponibles
          </button>
          <button
            className={`relative px-6 py-3 font-semibold transition-all duration-300
              ${activeTab === "enrolled"
                ? "text-white bg-[#26709b] shadow-md rounded-t-lg before:absolute before:top-0 before:left-0 before:w-full before:h-full before:bg-[#26709b] before:rounded-t-lg before:opacity-30 before:-z-10"
                : "text-[#3b485a] hover:text-[#26709b]"}`}
            onClick={() => setActiveTab("enrolled")}
          >
            Cursos Inscritos
          </button>
        </div>
  
        <div className="transition-opacity duration-500 ease-in-out">
          {activeTab === "available" && (
            <section className="bg-white text-[#1d293f] p-6 rounded-lg shadow-lg">
              {courses.length > 0 ? (
                <ul className="space-y-4">
                  {courses.map((course) => {
                    const remainingDays = getRemainingDays(course.endDate);
                    const isWarning = remainingDays === 1;
                    const isEnrolled = enrolledCourses.some(enrolledCourse => enrolledCourse.id === course.id); // Verifica si ya estás inscrito en el curso
  
                    return (
                      <li key={course.id} className="p-4 border border-gray-300 rounded-lg bg-[#f8fbff] shadow-md">
                        {/* Renderiza el título con formato HTML */}
                        <h4
                          className="text-xl font-bold text-[#0A1F44] break-words"
                          dangerouslySetInnerHTML={{ __html: course.title }}
                        />
  
                        {/* Renderiza la descripción con formato HTML */}
                        <div
                          className="ql-editor"
                          dangerouslySetInnerHTML={{ __html: course.description }}
                        />
  
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
                          <div className="flex flex-col md:flex-row space-y-2 md:space-x-4 md:space-y-0">
                            {isEnrolled ? (
                              <button
                                className="bg-[#00A8CC] text-white px-4 py-2 rounded-md cursor-not-allowed"
                                disabled
                              >
                                Ya estás inscrito
                              </button>
                            ) : (
                              <button
                                className="bg-[#00A8CC] hover:bg-[#3691a5] text-white px-4 py-2 rounded-md"
                                onClick={() => handleEnrollConfirm(course)}
                              >
                                Inscribirme
                              </button>
                            )}
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
          )}
          {activeTab === "enrolled" && (
            <section className="bg-white text-[#1d293f] p-6 rounded-lg shadow-lg">
              {renderCourses(enrolledCourses)}
            </section>
          )}
        </div>
      </main>
  
      <footer className="text-center py-4 bg-[#0A1F44] text-[#d1d9e6]">
        © {new Date().getFullYear()} Mi Aplicación. Todos los derechos reservados.
      </footer>
    </div>
  );
  
  
  
}

export default HomeNormal;
