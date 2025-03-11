import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import AuthContext from "../context/AuthContext";
import { FaArrowLeft } from "react-icons/fa";

function Course() {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [sections, setSections] = useState([]);
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [topUsers, setTopUsers] = useState([]); // Nuevo estado para los usuarios top

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

  const fetchCourseDetails = async () => {
  try {
    const token = localStorage.getItem('token');
    const courseResponse = await fetch(`https://classplay.cl/api/course/GetCourse/${courseId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!courseResponse.ok) throw new Error('Error al obtener los detalles del curso');

    const courseData = await courseResponse.json();
    setCourse(courseData);

    const sectionResponse = await fetch(`https://classplay.cl/api/section/GetSectionsByCourse/${courseId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!sectionResponse.ok) throw new Error('Error al obtener las secciones del curso');

    const sectionsData = await sectionResponse.json();

    const sectionsWithQuestions = await Promise.all(
      sectionsData.map(async (section) => {
        const questionResponse = await fetch(`https://classplay.cl/api/question/GetQuestionBySection/${section.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const questions = await questionResponse.json();
        return { ...section, questions };
      })
    );

    setSections(sectionsWithQuestions);

    // 🔥 Nueva petición para traer el TOP de usuarios por curso
    const topUsersResponse = await fetch(`https://classplay.cl/api/user_answer/GetTopUsersByCourse/${courseId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!topUsersResponse.ok) throw new Error('Error al obtener el TOP de usuarios');

    const topUsersData = await topUsersResponse.json();
    setTopUsers(topUsersData); // Guardamos la info de los usuarios
  } catch (error) {
    console.error('Error al cargar los detalles del curso:', error);
    Swal.fire('Error', 'No se pudo cargar la información del curso.', 'error');
  }
};

  useEffect(() => {
    fetchCourseDetails();
  }, [courseId]);

  if (!course) {
    return <p>Cargando curso...</p>;
  }

  const formatEndDate = (endDate) => {
    const date = new Date(endDate);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const getVideoThumbnail = (videoUrl) => {
    const videoId = videoUrl.split('v=')[1];
    return `https://img.youtube.com/vi/${videoId}/0.jpg`;
  };


  
  const user = JSON.parse(localStorage.getItem('user')); 

  // Función para redirigir a la página de edición de curso
  const handleReturnToAdmin = () => {
    navigate(`/EditCourse/${courseId}`); // Redirige con el id del curso
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-r from-[#6d90bd] via-[#7fb2d6] to-[#76bde4] text-gray-800">
      <header className="bg-white shadow-md">
  <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
    <h1 className="text-2xl font-bold text-gray-700"></h1>
    {user?.role === 'moderador' && (
        <button
          onClick={handleReturnToAdmin}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md font-semibold"
        >
          Volver a la edicion de curso ⚙️
        </button>
      )}
    <button
      onClick={handleLogout}
      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md font-semibold"
    >
      Cerrar Sesión
    </button>
  </div>
</header>

  
      <main className="flex-1 px-6 py-10">
        <div className="max-w-7xl mx-auto">
          <section className="bg-white text-gray-800 p-6 pt-12 rounded-lg shadow-lg relative">
            <button
              onClick={() => navigate('/home')}
              className="absolute top-6 left-6 text-gray-600 hover:text-gray-800 text-2xl"
            >
              <FaArrowLeft />
            </button>
            <h2 className="text-4xl font-extrabold text-center text-[#0A1F44] mb-4" dangerouslySetInnerHTML={{ __html: course.title }} />
            <p className="text-lg text-[#1d293f] text-center mb-4" dangerouslySetInnerHTML={{ __html: course.description }} />
            <p className="text-center text-[#1d293f]">
              Categoría: <strong>{course.category || "No definida"}</strong>
            </p>
            <p className="text-center text-gray-500">
              Fecha de término: <strong>{formatEndDate(course.endDate)}</strong>
            </p>
  
            <div className="mt-6">
              <h3 className="text-2xl font-semibold text-[#1d293f] mb-4">Secciones</h3>
              {sections.length > 0 ? (
                <ul className="space-y-6">
                  {sections.map((section) => (
                    <li key={section.id} className="p-6 border border-gray-300 rounded-lg bg-gray-50 shadow-md relative hover:shadow-lg transition-shadow duration-300">
                      <h4 className="text-xl font-bold text-[#0A1F44] mb-2" dangerouslySetInnerHTML={{ __html: section.name }} />
                      <p className="text-gray-700 mb-4" dangerouslySetInnerHTML={{ __html: section.description }} />
                      {section.videoLink && (
                        <div className="mt-4 flex flex-col items-center">
                          <a href={section.videoLink} target="_blank" rel="noopener noreferrer">
                            <img
                              src={getVideoThumbnail(section.videoLink)}
                              alt="Miniatura del video"
                              className="w-50 h-50 object-cover rounded-md shadow-md cursor-pointer"
                            />
                          </a>
                          <p className="mt-2 mb-6 text-lg text-gray-600 text-center">
                            Haz clic para ver el video
                          </p>
                        </div>
                      )}

                      {section.questions && section.questions.length > 0 && (
                        <div className="mt-4 flex flex-col items-start sm:flex-row sm:justify-between sm:items-center">
                          <div className="text-base text-gray-700 font-semibold mb-2 sm:mb-0">
                            Tiempo de la sección:
                            <span className="bg-[#4442c1] text-white px-2 py-1 rounded-md ml-2">
                              {section.totalTime ? `${section.totalTime} min` : "Ninguno"}
                            </span>
                          </div>
                          <button
                            className="bg-[#4dcfec] hover:bg-[#4fb1c7] text-white px-6 py-3 rounded-md font-semibold shadow-lg w-full sm:w-auto"
                            onClick={() => {
                              Swal.fire({
                                title: "⚠️ Advertencia",
                                text:
                                  section.totalTime && section.totalTime > 0
                                    ? `¿Estás seguro de empezar a responder? Tienes ${section.totalTime} minutos para completar las preguntas.`
                                    : "¿Estás seguro de empezar a responder?",
                                icon: "warning",
                                showCancelButton: true,
                                confirmButtonText: "Sí, empezar",
                                cancelButtonText: "Cancelar",
                              }).then((result) => {
                                if (result.isConfirmed) {
                                  navigate(`/Question/${section.id}`);
                                }
                              });
                            }}
                          >
                            Empezar
                          </button>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-600">Este curso no tiene secciones.</p>
              )}
            </div>
          </section>

          <div className="mt-10">
  <ul className="bg-white shadow-lg p-6 rounded-lg max-w-2xl mx-auto">
    <li className="text-lg text-center mb-6 p-6 rounded-lg bg-gradient-to-r from-[#6d7bbb] via-[#00A8CC] to-[#6d7bbb] shadow-lg">
      <h3 className="text-3xl font-extrabold text-white mb-6">🏆 TOP Usuarios de este Curso</h3>
    </li>
    {topUsers.length > 0 ? (
      topUsers.map((user, index) => {
        let medal = ""; // Default medal is empty
        let medalStyle = "text-4xl"; // Default size for the medal
        let backgroundClass = ""; // Background class for each place
        let userStyle = "text-2xl"; // Default user style for normal users
        let containerStyle = "mb-6 p-6"; // Default container style for top users

        // Medals for top 3 users with bounce animation and colorful background
        if (index === 0) {
          medal = "🥇";
          medalStyle = "text-5xl animate-bounce"; // Bigger and adding bounce animation to the gold medal
          backgroundClass = "bg-gradient-to-r from-yellow-200 via-yellow-300 to-yellow-400"; // Softer gold-like color
        } else if (index === 1) {
          medal = "🥈";
          medalStyle = "text-4xl animate-bounce"; // Adding bounce animation to the silver medal
          backgroundClass = "bg-gradient-to-r from-gray-200 via-gray-300 to-gray-400"; // Softer silver-like color
        } else if (index === 2) {
          medal = "🥉";
          medalStyle = "text-4xl animate-bounce"; // Adding bounce animation to the bronze medal
          backgroundClass = "bg-gradient-to-r from-orange-200 via-orange-300 to-orange-400"; // Softer bronze-like color
        } else {
          // For users from the 4th place and onwards, reduce the size
          userStyle = "text-sm"; // Smaller text for users beyond 3rd place
          containerStyle = "mb-3 p-3"; // Smaller container for users beyond 3rd place
        }

        // For users beyond the 3rd place, display them in two columns
        const isAfterThird = index >= 3;

        return (
          <li
            key={user.userId}
            className={`text-lg text-center ${containerStyle} rounded-lg ${backgroundClass} shadow-lg ${isAfterThird ? 'w-1/2 inline-block' : ''}`} // Half-width for users after 3rd
          >
            <div className={`font-bold ${medalStyle} mb-3 ${userStyle}`}>
              {medal} {index + 1}°
            </div>
            <div className={`font-semibold text-[#ffffff] py-2 px-6 rounded-lg shadow-lg block mb-3 transition-all duration-300 ease-in-out transform hover:scale-105 ${userStyle}`} style={{ fontFamily: 'Playfair Display, serif', backgroundColor: 'rgba(0, 0, 0, 0.2)' }}>
              {user.username}
            </div>
            <div className={`text-[#ffffff] py-2 px-6 rounded-lg shadow-lg block transition-all duration-300 ease-in-out transform hover:scale-105 ${userStyle}`} style={{ fontFamily: 'Quicksand, sans-serif', backgroundColor: 'rgba(0, 0, 0, 0.2)' }}>
              {user.totalScore} puntos
            </div>
          </li>
        );
      })
    ) : (
      <p className="text-center text-gray-600 text-lg">Aún no hay usuarios con puntuaciones en este curso.</p>
    )}
  </ul>
</div>
        </div>
      </main>
  
      <footer className="text-center py-4 bg-gray-800 text-gray-400">
        © {new Date().getFullYear()} Mi Aplicación. Todos los derechos reservados.
      </footer>
    </div>
  );
}

export default Course;
