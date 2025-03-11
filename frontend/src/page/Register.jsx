import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const videos = [
  { src: "/videos/VIDEO_CURSOS.mp4", text: "¡Inscríbete al curso que quieras!" },
  { src: "/videos/VIDEO_PREGUNTAS.mp4", text: "¡Responde preguntas para poner a prueba tu conocimiento!" },
  { src: "/videos/VIDEO_RESULTADO.mp4", text: "¡Analiza tus resultados y ve tu nivel!" },
];

function Register() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();
  const [currentVideo, setCurrentVideo] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  
  // Estado para el toast de éxito
  const [showToast, setShowToast] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }

    const success = await register(email, username, password);
    if (success) {
      // Mostrar el toast y redirigir al login después de un tiempo
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false); // Ocultar el toast
        navigate("/login");  // Redirigir a la página de login
      }, 3000); // El toast se muestra durante 3 segundos
    } else {
      alert("Error al registrar el usuario");
    }
  };

  const nextVideo = () => {
    setIsPlaying(false);
    setTimeout(() => {
      setCurrentVideo((prev) => (prev + 1) % videos.length);
      setIsPlaying(true);
    }, 300);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#142850] to-[#00A8CC] flex flex-col">
      <header className="w-full bg-white text-[#142850] py-4 text-center text-xl font-bold shadow-md">
        Classplay
      </header>

      {/* Toast de éxito centrado */}
      {showToast && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-green-500 text-white text-lg p-4 rounded-md shadow-lg animate-bounce">
            <p>¡Te has registrado con éxito!</p>
          </div>
        </div>
      )}

      <div className="flex flex-col items-center justify-center min-h-screen px-6 py-8">
        <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-2xl">
          <h2 className="text-3xl font-bold text-center mb-6 text-[#00A8CC]">Regístrate</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Correo Electrónico</label>
              <input
                id="email"
                type="email"
                placeholder="Ingresa tu correo"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-[#00A8CC] focus:border-[#00A8CC]"
              />
            </div>
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">Usuario</label>
              <input
                id="username"
                type="text"
                placeholder="Ingresa tu usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-[#00A8CC] focus:border-[#00A8CC]"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Contraseña</label>
              <input
                id="password"
                type="password"
                placeholder="Ingresa tu contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-[#00A8CC] focus:border-[#00A8CC]"
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirmar Contraseña</label>
              <input
                id="confirmPassword"
                type="password"
                placeholder="Confirma tu contraseña"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-[#00A8CC] focus:border-[#00A8CC]"
              />
            </div>
            <button type="submit" className="w-full py-3 bg-[#00A8CC] text-white rounded-md font-semibold hover:bg-[#0C7B93] transition duration-300">
              Regístrate
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-gray-600">
            ¿Ya tienes una cuenta? <a href="/login" className="text-[#142850] hover:underline">Inicia sesión aquí</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
