import { createGlobalStyle, keyframes } from "styled-components";

const matrixScroll = keyframes`
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: 0 100%;
  }
`;

const flicker = keyframes`
  0%, 19%, 21%, 23%, 25%, 54%, 56%, 100% {
    opacity: 1;
    text-shadow:
      0 0 5px #00FF00,
      0 0 10px #00FF00,
      0 0 20px #00FF00,
      0 0 40px #00BFFF,
      0 0 80px #00BFFF;
  }
  20%, 22%, 24%, 55% {
    opacity: 0.4;
    text-shadow:
      0 0 2px #00FF00,
      0 0 5px #00FF00,
      0 0 10px #00FF00;
  }
`;

const glow = keyframes`
  0%, 100% {
    box-shadow: 0 0 5px #00ff00, 0 0 10px #00ff00, 0 0 15px #00ff00;
  }
  50% {
    box-shadow: 0 0 10px #00bfff, 0 0 20px #00bfff, 0 0 30px #00bfff;
  }
`;

export const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Courier+Prime:wght@400;700&display=swap');

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    scroll-behavior: smooth;
  }

  body {
    background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
    background-attachment: fixed;
    color: #00FF00;
    font-family: 'Courier Prime', monospace;
    overflow-x: hidden;
    position: relative;
    min-height: 100vh;
  }

  body::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background:
      radial-gradient(circle at 20% 80%, rgba(0, 255, 0, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(0, 191, 255, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 40% 40%, rgba(0, 255, 0, 0.05) 0%, transparent 50%);
    pointer-events: none;
    z-index: -1;
  }



  a {
    color: #00BFFF;
    text-decoration: none;
    transition: all 0.3s ease;
    position: relative;
  }

  a::before {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 0;
    height: 1px;
    background: linear-gradient(90deg, #00ff00, #00bfff);
    transition: width 0.3s ease;
  }

  a:hover::before {
    width: 100%;
  }

  .matrix-background {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background:
      linear-gradient(0deg, rgba(0,255,0,0.03) 0%, rgba(0,255,0,0.08) 100%),
      linear-gradient(
        0deg,
        transparent 24%,
        rgba(0,255,0,0.1) 25%,
        rgba(0,255,0,0.1) 26%,
        transparent 27%,
        transparent 74%,
        rgba(0,255,0,0.1) 75%,
        rgba(0,255,0,0.1) 76%,
        transparent 77%,
        transparent
      ),
      linear-gradient(
        90deg,
        transparent 24%,
        rgba(0,255,0,0.1) 25%,
        rgba(0,255,0,0.1) 26%,
        transparent 27%,
        transparent 74%,
        rgba(0,255,0,0.1) 75%,
        rgba(0,255,0,0.1) 76%,
        transparent 77%,
        transparent
      );
    background-size: 40px 40px;
    animation: ${matrixScroll} 20s linear infinite;
    pointer-events: none;
    z-index: -1;
  }

  .neon-text {
    color: #00FF00;
    text-shadow:
      0 0 5px #00FF00,
      0 0 10px #00FF00,
      0 0 20px #00FF00,
      0 0 40px #00BFFF,
      0 0 80px #00BFFF;
    animation: ${flicker} 4s infinite;
    font-weight: 700;
    letter-spacing: 1px;
  }

  .neon-border {
    border: 2px solid #00FF00;
    box-shadow:
      0 0 10px rgba(0, 255, 0, 0.5),
      inset 0 0 10px rgba(0, 255, 0, 0.1);
    animation: ${glow} 3s ease-in-out infinite;
  }

  button {
    background: linear-gradient(135deg, rgba(0, 255, 0, 0.1), rgba(0, 191, 255, 0.1));
    border: 2px solid #00FF00;
    color: #00FF00;
    padding: 12px 24px;
    font-family: 'Courier Prime', monospace;
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow:
      0 0 10px rgba(0, 255, 0, 0.3),
      inset 0 0 10px rgba(0, 255, 0, 0.1);
    border-radius: 4px;
    position: relative;
    overflow: hidden;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  button::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s ease;
  }

  button:hover::before {
    left: 100%;
  }

  button:hover {
    color: #00BFFF;
    border-color: #00BFFF;
    box-shadow:
      0 0 20px rgba(0, 191, 255, 0.6),
      inset 0 0 20px rgba(0, 191, 255, 0.2);
    transform: translateY(-2px);
  }

  button:active {
    transform: translateY(0);
    box-shadow:
      0 0 5px rgba(0, 191, 255, 0.6),
      inset 0 0 5px rgba(0, 191, 255, 0.2);
  }

  input, select, textarea {
    background: linear-gradient(135deg, rgba(15, 15, 15, 0.9), rgba(26, 26, 26, 0.9));
    border: 2px solid #00FF00;
    color: #00FF00;
    font-family: 'Courier Prime', monospace;
    font-size: 14px;
    padding: 12px 16px;
    outline: none;
    transition: all 0.3s ease;
    border-radius: 4px;
    box-shadow: inset 0 0 10px rgba(0, 255, 0, 0.1);
  }

  input:focus, select:focus, textarea:focus {
    border-color: #00BFFF;
    box-shadow:
      0 0 15px rgba(0, 191, 255, 0.5),
      inset 0 0 15px rgba(0, 191, 255, 0.2);
    background: linear-gradient(135deg, rgba(20, 20, 20, 0.9), rgba(31, 31, 31, 0.9));
  }

  input::placeholder, textarea::placeholder {
    color: rgba(0, 255, 0, 0.6);
    font-style: italic;
  }

  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.9);
    backdrop-filter: blur(8px);
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    animation: fadeIn 0.3s ease-out;
  }

  .modal-content {
    background: linear-gradient(135deg, rgba(15, 15, 15, 0.95), rgba(26, 26, 26, 0.95));
    border: 2px solid #00FF00;
    box-shadow:
      0 0 30px rgba(0, 255, 0, 0.5),
      inset 0 0 30px rgba(0, 255, 0, 0.1);
    padding: 30px;
    border-radius: 8px;
    max-width: 600px;
    width: 90%;
    color: #00FF00;
    font-family: 'Courier Prime', monospace;
    animation: slideIn 0.3s ease-out;
    position: relative;
  }

  .modal-content::before {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    background: linear-gradient(45deg, #00ff00, #00bfff, #00ff00);
    border-radius: 10px;
    z-index: -1;
    opacity: 0.3;
    animation: ${glow} 3s ease-in-out infinite;
  }

  .sidebar {
    background: linear-gradient(180deg, rgba(18, 18, 18, 0.95), rgba(26, 26, 26, 0.95));
    border-right: 2px solid #00FF00;
    width: 250px;
    height: 100vh;
    color: #00FF00;
    font-family: 'Courier Prime', monospace;
    display: flex;
    flex-direction: column;
    padding: 25px 20px;
    box-shadow: 2px 0 20px rgba(0, 255, 0, 0.2);
    position: relative;
    overflow: hidden;
  }

  .sidebar::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background:
      linear-gradient(90deg, transparent 49%, rgba(0, 255, 0, 0.05) 50%, transparent 51%),
      linear-gradient(0deg, transparent 49%, rgba(0, 255, 0, 0.05) 50%, transparent 51%);
    background-size: 20px 20px;
    animation: ${matrixScroll} 15s linear infinite;
    pointer-events: none;
  }

  .sidebar-item {
    padding: 18px 15px;
    cursor: pointer;
    border-left: 4px solid transparent;
    transition: all 0.3s ease;
    margin-bottom: 5px;
    border-radius: 0 8px 8px 0;
    position: relative;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1px;
    font-size: 13px;
  }

  .sidebar-item:hover {
    background: linear-gradient(90deg, rgba(0, 255, 0, 0.1), rgba(0, 191, 255, 0.1));
    border-left: 4px solid #00FF00;
    box-shadow:
      0 0 15px rgba(0, 255, 0, 0.4),
      inset 0 0 15px rgba(0, 255, 0, 0.1);
    transform: translateX(5px);
  }

  .sidebar-item.active {
    background: linear-gradient(90deg, rgba(0, 191, 255, 0.2), rgba(0, 255, 0, 0.2));
    border-left: 4px solid #00BFFF;
    box-shadow:
      0 0 20px rgba(0, 191, 255, 0.6),
      inset 0 0 20px rgba(0, 191, 255, 0.2);
    transform: translateX(8px);
  }

  .sidebar-item.active::before {
    content: '>';
    position: absolute;
    right: 15px;
    color: #00BFFF;
    font-weight: bold;
    animation: ${flicker} 2s infinite;
  }

  .dashboard {
    display: flex;
    height: 100vh;
    background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
    position: relative;
  }

  .main-content {
    flex-grow: 1;
    padding: 30px;
    overflow-y: auto;
    position: relative;
  }

  .main-content::before {
    content: '';
    position: fixed;
    top: 0;
    left: 250px;
    width: calc(100% - 250px);
    height: 100%;
    background:
      radial-gradient(circle at 30% 70%, rgba(0, 255, 0, 0.03) 0%, transparent 50%),
      radial-gradient(circle at 70% 30%, rgba(0, 191, 255, 0.03) 0%, transparent 50%);
    pointer-events: none;
    z-index: -1;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(-50px) scale(0.9);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    background: rgba(0, 255, 0, 0.1);
  }

  ::-webkit-scrollbar-thumb {
    background: linear-gradient(180deg, #00ff00, #00bfff);
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(180deg, #00bfff, #00ff00);
  }

  @media (max-width: 768px) {
    .sidebar {
      width: 200px;
    }

    .main-content {
      padding: 20px;
    }

    .modal-content {
      margin: 20px;
      padding: 20px;
    }
  }
`;
