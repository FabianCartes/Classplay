import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Pie, Bar } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from "chart.js";
import RainEffect from "../components/RainEffect";
import { motion } from "framer-motion";

Chart.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

function Results() {
  const { sectionId } = useParams();
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [incorrectAnswers, setIncorrectAnswers] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [obtainedScore, setObtainedScore] = useState(0);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchResults = async () => {
      try {
        // 🔹 Obtener todas las preguntas de la sección
        const questionsResponse = await fetch(`https://classplay.cl/api/question/GetQuestionBySection/${sectionId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const questionsData = await questionsResponse.json();

        if (!questionsData || questionsData.length === 0) return;

        setTotalQuestions(questionsData.length);

        // 🔹 Calcular puntaje total de todas las preguntas
        const totalScoreCalc = questionsData.reduce((acc, q) => acc + q.score, 0);
        setTotalScore(totalScoreCalc);

        // 🔹 Obtener respuestas del usuario
        const userAnswersResponse = await fetch(`https://classplay.cl/api/user_answer/GetUserAnswersBySection/${user.id}/${sectionId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const userAnswersData = await userAnswersResponse.json();

        let correctCount = 0;
        let incorrectCount = 0;
        let obtainedScoreCalc = 0;
        const incorrectQuestions = new Set(); // 🔹 Guardará las preguntas falladas

        userAnswersData.forEach(answer => {
          if (answer.option.isCorrect) {
            correctCount++;
            obtainedScoreCalc += answer.question.score; // Sumar el puntaje de la pregunta
          } else {
            incorrectQuestions.add(answer.question.id); // Guardar la pregunta fallada
          }
        });

        // 🔹 Contar preguntas falladas o no respondidas correctamente
        incorrectCount = incorrectQuestions.size;


        setCorrectAnswers(correctCount);
        setIncorrectAnswers(incorrectCount);
        setObtainedScore(obtainedScoreCalc);
      } catch (error) {
        console.error("Error al obtener los resultados:", error);
      }
    };

    fetchResults();
  }, [sectionId, user.id]);

  const data = {
    labels: ["Correctas", "Incorrectas"],
    datasets: [
      {
        data: [correctAnswers, incorrectAnswers],
        backgroundColor: ["#58d68d", "#ec7063"],
        hoverBackgroundColor: ["#2ecc71", "#e74c3c"],
      },
    ],
  };

  const scoreData = {
    labels: ["Puntaje Total", "Puntaje Obtenido"],
    datasets: [
      {
        label: "Puntaje",
        data: [totalScore, obtainedScore],
        backgroundColor: ["#3498db", "#9b59b6"],
        hoverBackgroundColor: ["#2980b9", "#8e44ad"],
      },
    ],
  };
  

  const feedbackMessage = () => {
    const percentage = (correctAnswers / totalQuestions) * 100;
    if (percentage >= 80) return "¡Excelente trabajo! Sigue así 💪";
    if (percentage >= 50) return "¡Vas por buen camino! Puedes mejorar 🚀";
    return "¡Sigue practicando! La clave es la constancia 🔥";
  };

  const handleReturnToCourse = async () => {
    try {
      const response = await fetch(`https://classplay.cl/api/section/GetCourseIdBySection/${sectionId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      if (!response.ok) throw new Error("Error al obtener el courseId");

      const data = await response.json();
      if (data.courseId) {
        navigate(`/Course/${data.courseId}`);
      } else {
        console.error("No se encontró courseId en la respuesta");
      }
    } catch (error) {
      console.error("Error al obtener el courseId:", error);
    }
  };

  const feedbackForQuestions = () => {
    const percentage = (correctAnswers / totalQuestions) * 100;
    if (percentage >= 80) return "¡Increíble! Tienes un gran dominio de este tema 🎉";
    if (percentage >= 50) return "¡Buen trabajo! Pero aún puedes mejorar 💡";
    return "No te preocupes, sigue practicando y mejorarás pronto 🔥";
  };
  
  const feedbackForScore = () => {
    const percentage = (obtainedScore / totalScore) * 100;
    if (percentage >= 80) return "¡Puntuación excelente! Sigue así 🏆";
    if (percentage >= 50) return "No está mal, pero hay margen para mejorar 📈";
    return "Necesitas mejorar tu puntaje, ¡tú puedes! 💪";
  };
  


  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const hoverEffect = {
    scale: 1.1,
    boxShadow: "0px 4px 10px rgba(100, 150, 200, 0.3)",
    transition: { duration: 0.3 }
  };
  

  return (
    <div className="min-h-screen flex flex-col bg-transparent relative overflow-hidden">
      {/* 🌧️ Efecto de lluvia */}
      <RainEffect />
  
      {/* Barra superior con transparencia */}
      <header className="bg-white/70 backdrop-blur-md text-gray-700 py-4 shadow-lg fixed top-0 left-0 w-full z-20">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <button
            onClick={handleReturnToCourse}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:scale-105 text-white px-5 py-2 rounded-lg font-semibold shadow-md transition-all duration-300"
          >
            ⬅ Volver al curso
          </button>
        </div>
      </header>
  
      {/* Contenedor principal */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 mt-20 relative z-10">
        <h1 className="text-5xl font-extrabold text-white drop-shadow-lg animate-fadeIn">
          🏆 TUS RESULTADOS 🏆
        </h1>
  
        {/* Contenedor de resultados */}
        <div className="bg-white/80 p-8 rounded-xl shadow-xl w-full max-w-5xl flex flex-col md:flex-row gap-8 mt-6 animate-fadeInSlow">
          
          {/* 🔹 Sección izquierda - Preguntas */}
          <div className="w-full md:w-1/2 flex flex-col items-center">
            <h2 className="text-3xl font-bold text-gray-700 mb-4 text-center">📋 Preguntas</h2>
            <div className="space-y-4 text-left w-full">
              <motion.p 
                whileHover={{ scale: 1.05 }} 
                className="text-lg font-semibold text-gray-700 bg-gray-200 px-5 py-3 rounded-lg shadow-md">
                Total Preguntas: <span className="font-bold">{totalQuestions}</span>
              </motion.p>
              <motion.p 
                whileHover={{ scale: 1.05 }} 
                className="text-lg font-semibold text-green-600 bg-green-200 px-5 py-3 rounded-lg shadow-md">
                Correctas: <span className="font-bold">{correctAnswers}</span>
              </motion.p>
              <motion.p 
                whileHover={{ scale: 1.05 }} 
                className="text-lg font-semibold text-red-600 bg-red-200 px-5 py-3 rounded-lg shadow-md">
                Falladas o Nulas: <span className="font-bold">{incorrectAnswers}</span>
              </motion.p>
            </div>
            <div className="mt-6 flex justify-center h-[300px] w-full">
              <Pie data={data} />
            </div>
            <p className="mt-6 text-lg font-semibold text-gray-800 text-center">{feedbackForQuestions()}</p>
          </div>
  
          {/* 🔹 Sección derecha - Puntajes */}
          <div className="w-full md:w-1/2 flex flex-col items-center">
            <h2 className="text-3xl font-bold text-gray-700 mb-4 text-center">📊 Puntajes</h2>
            <div className="space-y-4 text-left w-full">
              <motion.p 
                whileHover={{ scale: 1.05 }} 
                className="text-lg font-semibold text-blue-600 bg-blue-200 px-5 py-3 rounded-lg shadow-md">
                Puntaje Total: <span className="font-bold">{totalScore}</span>
              </motion.p>
              <motion.p 
                whileHover={{ scale: 1.05 }} 
                className="text-lg font-semibold text-purple-600 bg-purple-200 px-5 py-3 rounded-lg shadow-md">
                Puntaje Obtenido: <span className="font-bold">{obtainedScore}</span>
              </motion.p>
            </div>
            <div className="mt-6 md:mt-16 flex justify-center w-full h-[280px]">
              <Bar data={scoreData} />
            </div>
            <p className="mt-6 text-lg font-semibold text-gray-800 text-center">{feedbackForScore()}</p>
          </div>
  
        </div>
      </div>
    </div>
  );
  
}

export default Results;
