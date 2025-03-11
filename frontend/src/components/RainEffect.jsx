import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";

const RainEffect = () => {
  const particlesInit = async (engine) => {
    console.log("Particles cargado", engine);
    await loadSlim(engine);
  };

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      options={{
        fullScreen: { enable: true, zIndex: 0 },
        background: { color: "#8EC3E8" }, // 🔹 Azul celeste más intenso
        particles: {
          number: { value: 180 },
          move: { 
            enable: true,
            direction: "bottom",
            speed: 0.4,
            straight: false,
            random: false,
          },
          shape: { type: "circle" },
          size: { value: { min: 2, max: 4 } },
          opacity: { value: 0.7 }, // 🔹 Un poco menos translúcido
          color: { value: ["#497D99", "#2C5A75"] }, // 🔹 Azul medio y celeste oscuro
          stroke: { width: 1, color: "#497D99" }, // 🔹 Bordes azul más oscuro
        }
      }}
    />
  );
};

export default RainEffect;
