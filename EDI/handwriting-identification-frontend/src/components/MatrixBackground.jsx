import React, { useEffect, useState } from "react";
import styled from "styled-components";

const MatrixContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: -1;
  overflow: hidden;
`;

const CircuitBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: url("https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80")
    no-repeat center center;
  background-size: cover;
  opacity: 0.1;
  filter: grayscale(100%) contrast(150%);
`;

const GridOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: linear-gradient(
    90deg,
    transparent 24%,
    rgba(0, 255, 0, 0.1) 25%,
    rgba(0, 255, 0, 0.1) 26%,
    transparent 27%,
    transparent 74%,
    rgba(0, 255, 0, 0.1) 75%,
    rgba(0, 255, 0, 0.1) 76%,
    transparent 77%,
    transparent
  );
  background-size: 40px 40px;
  animation: matrixScroll 20s linear infinite;
`;

const RadarRing = styled.div`
  position: absolute;
  border: 1px solid rgba(0, 191, 255, 0.3);
  border-radius: 50%;
  animation: radarPulse 3s ease-in-out infinite;
`;

const RadarRing1 = styled(RadarRing)`
  width: 200px;
  height: 200px;
  top: 20%;
  left: 10%;
  animation-delay: 0s;
`;

const RadarRing2 = styled(RadarRing)`
  width: 150px;
  height: 150px;
  top: 60%;
  right: 15%;
  animation-delay: 1s;
`;

const RadarRing3 = styled(RadarRing)`
  width: 100px;
  height: 100px;
  bottom: 20%;
  left: 70%;
  animation-delay: 2s;
`;

const RadarSweep = styled.div`
  position: absolute;
  width: 2px;
  height: 50%;
  background: linear-gradient(
    to top,
    transparent,
    rgba(0, 191, 255, 0.8),
    transparent
  );
  transform-origin: bottom center;
  animation: radarSweep 4s linear infinite;
`;

const RadarSweep1 = styled(RadarSweep)`
  top: 20%;
  left: calc(10% + 100px);
  animation-delay: 0s;
`;

const RadarSweep2 = styled(RadarSweep)`
  top: 60%;
  right: calc(15% + 75px);
  animation-delay: 1s;
`;

const RadarSweep3 = styled(RadarSweep)`
  bottom: 20%;
  left: calc(70% + 50px);
  animation-delay: 2s;
`;

const FloatingText = styled.div`
  position: absolute;
  color: rgba(0, 255, 0, 0.6);
  font-family: "Courier Prime", monospace;
  font-size: ${(props) => props.size || "12px"};
  font-weight: bold;
  white-space: nowrap;
  animation: floatAndFade 8s ease-in-out infinite;
  text-shadow: 0 0 5px rgba(0, 255, 0, 0.5);
`;

const FloatingNumber = styled(FloatingText)`
  color: rgba(0, 191, 255, 0.6);
  text-shadow: 0 0 5px rgba(0, 191, 255, 0.5);
`;

const Particle = styled.div`
  position: absolute;
  width: 2px;
  height: 2px;
  background: rgba(0, 255, 0, 0.8);
  border-radius: 50%;
  animation: particleFloat 6s ease-in-out infinite;
`;

const generateRandomPosition = () => ({
  top: Math.random() * 100 + "%",
  left: Math.random() * 100 + "%",
});

const generateRandomText = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
  return chars.charAt(Math.floor(Math.random() * chars.length));
};

const generateRandomNumber = () => {
  return Math.floor(Math.random() * 999999).toString();
};

const MatrixBackground = () => {
  const [floatingElements, setFloatingElements] = useState([]);

  useEffect(() => {
    const elements = [];
    for (let i = 0; i < 15; i++) {
      elements.push({
        id: i,
        type: Math.random() > 0.5 ? "text" : "number",
        content:
          Math.random() > 0.5 ? generateRandomText() : generateRandomNumber(),
        position: generateRandomPosition(),
        size: Math.random() * 20 + 10,
        delay: Math.random() * 8,
      });
    }
    setFloatingElements(elements);
  }, []);

  return (
    <MatrixContainer>
      <CircuitBackground />
      <GridOverlay />

      <RadarRing1 />
      <RadarRing2 />
      <RadarRing3 />

      <RadarSweep1 />
      <RadarSweep2 />
      <RadarSweep3 />

      {floatingElements.map((element) =>
        element.type === "text" ? (
          <FloatingText
            key={element.id}
            style={{
              top: element.position.top,
              left: element.position.left,
              fontSize: element.size,
              animationDelay: `${element.delay}s`,
            }}
          >
            {element.content}
          </FloatingText>
        ) : (
          <FloatingNumber
            key={element.id}
            style={{
              top: element.position.top,
              left: element.position.left,
              fontSize: element.size,
              animationDelay: `${element.delay}s`,
            }}
          >
            {element.content}
          </FloatingNumber>
        )
      )}

      {[...Array(20)].map((_, i) => (
        <Particle
          key={`particle-${i}`}
          style={{
            top: Math.random() * 100 + "%",
            left: Math.random() * 100 + "%",
            animationDelay: Math.random() * 6 + "s",
          }}
        />
      ))}

      <style jsx>{`
        @keyframes matrixScroll {
          0% {
            background-position: 0 0;
          }
          100% {
            background-position: 0 100%;
          }
        }

        @keyframes radarPulse {
          0%,
          100% {
            transform: scale(1);
            opacity: 0.3;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.8;
          }
        }

        @keyframes radarSweep {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        @keyframes floatAndFade {
          0%,
          100% {
            opacity: 0;
            transform: translateY(0px) translateX(0px);
          }
          10%,
          90% {
            opacity: 0.8;
          }
          50% {
            opacity: 1;
            transform: translateY(-20px) translateX(10px);
          }
        }

        @keyframes particleFloat {
          0%,
          100% {
            opacity: 0;
            transform: translateY(0px);
          }
          50% {
            opacity: 1;
            transform: translateY(-30px);
          }
        }
      `}</style>
    </MatrixContainer>
  );
};

export { MatrixBackground };
