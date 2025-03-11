import { useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const videos = [
  { src: "/videos/curso_edit_pagina.mp4", text: "¡Inscríbete al curso que quieras!" },
  { src: "/videos/question_edicion_pagina.mp4", text: "¡Responde preguntas para poner a prueba tu conocimiento!" },
  { src: "/videos/resultados_edit_pagina.mp4", text: "¡Analiza tus resultados y ve tu nivel!" },
];

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext);
  const [currentVideo, setCurrentVideo] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(username, password);
    if (!success) {
      alert("Credenciales inválidas");
    }
  };

  const nextVideo = () => {
    setIsPlaying(false);
    setTimeout(() => {
      setCurrentVideo((prev) => (prev + 1) % videos.length);
      setIsPlaying(true);
    }, 300);
  };

  const prevVideo = () => {
    setIsPlaying(false);
    setTimeout(() => {
      setCurrentVideo((prev) => (prev === 0 ? videos.length - 1 : prev - 1));
      setIsPlaying(true);
    }, 300);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#142850] to-[#00A8CC] flex flex-col">
      <header className="w-full bg-white text-[#142850] py-4 text-center text-xl font-bold shadow-md">
        Classplay
      </header>
  
      <div className="relative flex flex-col items-center justify-center min-h-screen px-4 md:px-6">
        <div className="relative flex flex-col md:flex-row w-full max-w-6xl bg-white shadow-2xl rounded-2xl overflow-hidden">
          
          {/* Sección izquierda con forma personalizada en escritorio */}
          <div className="relative w-full md:w-1/2 flex flex-col items-center justify-center bg-[#27496D] text-white p-6 md:p-12 
  md:[clip-path:polygon(0_0,90%_0,100%_50%,90%_100%,0_100%)]">

            <div className="relative w-full max-w-3xl z-10">
              <AnimatePresence mode="wait">
                {isPlaying && (
                  <motion.div
                    key={videos[currentVideo].src}
                    initial={{ opacity: 0, x: 200 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.5 }}
                    className="w-full"
                  >
                    <video
                      key={videos[currentVideo].src}
                      className="rounded-lg shadow-lg w-full h-auto max-h-[200px] md:max-h-none"
                      autoPlay
                      muted
                      loop={false}
                      onEnded={nextVideo}
                    >
                      <source src={videos[currentVideo].src} type="video/mp4" />
                      Tu navegador no soporta videos.
                    </video>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
  
            <div className="w-full flex flex-col items-center mt-4 z-10">
              <div className="flex space-x-2">
                {videos.map((_, index) => (
                  <div
                    key={index}
                    className={`w-3 h-3 md:w-4 md:h-4 rounded-full transition-all duration-300 ${
                      index === currentVideo ? "bg-white scale-110" : "bg-gray-400"
                    }`}
                  />
                ))}
              </div>
              <p className="mt-2 md:mt-4 text-lg md:text-xl font-semibold text-white text-center">
                {videos[currentVideo].text}
              </p>
            </div>
          </div>
  
          {/* Sección derecha */}
          <div className="w-full md:w-1/2 flex items-center justify-center bg-white p-6 md:p-12">
            <div className="w-full max-w-lg bg-white p-6 md:p-10 rounded-lg shadow-2xl">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 md:mb-6 text-[#00A8CC]">
                Iniciar Sesión
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
                <div>
                  <label htmlFor="username" className="block text-sm md:text-base font-medium text-gray-700">
                    Usuario
                  </label>
                  <input
                    id="username"
                    type="text"
                    placeholder="Ingresa tu usuario"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="mt-1 block w-full px-4 py-2 md:px-5 md:py-3 border border-gray-300 rounded-md shadow-sm focus:ring-[#00A8CC] focus:border-[#00A8CC]"
                  />
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm md:text-base font-medium text-gray-700">
                    Contraseña
                  </label>
                  <input
                    id="password"
                    type="password"
                    placeholder="Ingresa tu contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-1 block w-full px-4 py-2 md:px-5 md:py-3 border border-gray-300 rounded-md shadow-sm focus:ring-[#00A8CC] focus:border-[#00A8CC]"
                  />
                </div>
                <button type="submit" className="w-full py-3 md:py-4 bg-[#00A8CC] text-white rounded-md font-semibold hover:bg-[#0C7B93] transition duration-300">
                  Iniciar Sesión
                </button>
              </form>
              <p className="mt-6 md:mt-8 text-center text-sm md:text-base text-gray-600">
                ¿No tienes una cuenta?{" "}
                <a href="/register" className="text-[#142850] hover:underline">Regístrate aquí</a>
              </p>
            </div>
          </div>
  
        </div>
      </div>
    </div>
  );
  
  
}

export default Login;
