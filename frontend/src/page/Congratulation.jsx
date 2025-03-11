import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import canvasConfetti from "canvas-confetti";

function Congratulation() {
  const { sectionId } = useParams();
  const [sectionName, setSectionName] = useState("");
  const [userName, setUserName] = useState(""); // Cambiado a vacío por defecto
  const navigate = useNavigate();

  useEffect(() => {
    // Obtener el nombre del usuario desde localStorage
    const user = JSON.parse(localStorage.getItem("user")); // Aquí accedemos al objeto user completo
    if (user && user.username) {
      setUserName(user.username); // Accedemos a la propiedad 'username' en lugar de 'name'
    } else {
      setUserName("Usuario"); // Si no se encuentra el nombre, mostramos "Usuario" como fallback
    }
  }, []);

  useEffect(() => {
    const fetchSectionName = async () => {
      try {
        const response = await fetch(`https://classplay.cl/api/section/GetSection/${sectionId}`);
        const data = await response.json();
        if (data && data.name) {
          setSectionName(data.name);
        }
      } catch (error) {
        console.error("Error al obtener el nombre de la sección:", error);
      }
    };
    fetchSectionName();
  }, [sectionId]);

  // Lanzar confeti
  useEffect(() => {
    const canvas = document.getElementById("confetti-canvas");
    if (canvas) {
      canvasConfetti.create(canvas, {
        resize: true,
      })({
        particleCount: 200,
        spread: 90,
        origin: { y: 0.6 },
      });
    }
  }, []);

  // Navegar a resultados
  const handleViewResults = () => {
    navigate(`/Results/${sectionId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#6d90bd] via-[#7fb2d6] to-[#76bde4] flex flex-col relative overflow-hidden">
      {/* Barra superior con transparencia y efecto sutil */}
      <header className="bg-white/70 backdrop-blur-md text-white py-4 shadow-lg fixed top-0 left-0 w-full z-20">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <button 
            onClick={() => navigate('/home')} 
            className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg font-semibold shadow-md transition duration-300"
          >
            ⬅ Volver al inicio
          </button>
        </div>
      </header>
  
      {/* Contenedor principal */}
<div className="flex-1 flex flex-col justify-center items-center text-center py-20 mt-20 relative z-10">
  {/* Efecto de confeti en fondo */}
  <canvas id="confetti-canvas" className="absolute top-0 left-0 w-full h-full z-0 opacity-60"></canvas>

  {/* Mensaje de felicitaciones */}
  <h1 className="text-5xl font-extrabold text-white drop-shadow-lg animate-fadeIn"
    dangerouslySetInnerHTML={{ __html: `🎉 ¡FELICIDADES, ${userName || "Usuario"}! 🎉` }}
  />

  <p className="mt-4 text-lg text-gray-100 drop-shadow-md animate-fadeIn"
    dangerouslySetInnerHTML={{ __html: `Has completado las preguntas de la sección: <span className="font-semibold text-yellow-300">${sectionName}</span>` }}
  />

  {/* Pregunta sobre ver resultados */}
  <p className="mt-6 text-lg text-gray-200 animate-fadeInSlow"
    dangerouslySetInnerHTML={{ __html: "¿Quieres ver tus resultados?" }}
  />

  {/* Botón con gradiente y animación */}
  <div className="mt-6 animate-bounce">
    <button 
      onClick={handleViewResults} 
      className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-blue-500 text-white font-bold rounded-lg shadow-lg hover:scale-105 transition-transform duration-300"
    >
      📊 Ver resultados
    </button>
  </div>
</div>

    </div>
  );
  
}

export default Congratulation;
