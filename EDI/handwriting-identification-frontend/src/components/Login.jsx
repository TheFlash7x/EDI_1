import React, { useState } from "react";
import styled from "styled-components";
import { MatrixBackground } from "./MatrixBackground.jsx";

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.5s ease-out;
`;

const LoginBox = styled.div`
  background: linear-gradient(
    135deg,
    rgba(15, 15, 15, 0.95),
    rgba(26, 26, 26, 0.95)
  );
  border: 2px solid #00ff00;
  box-shadow: 0 0 40px rgba(0, 255, 0, 0.6), inset 0 0 40px rgba(0, 255, 0, 0.1);
  padding: 50px 40px;
  border-radius: 12px;
  text-align: center;
  max-width: 450px;
  width: 90%;
  position: relative;
  animation: slideIn 0.5s ease-out;
`;

const LoginBoxBefore = styled.div`
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  background: linear-gradient(45deg, #00ff00, #00bfff, #00ff00, #00bfff);
  border-radius: 14px;
  z-index: -1;
  opacity: 0.4;
  animation: rotate 4s linear infinite;
`;

const Title = styled.h2`
  margin-bottom: 30px;
  color: #00ff00;
  font-size: 2.2rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 2px;
  text-shadow: 0 0 10px #00ff00, 0 0 20px #00ff00, 0 0 30px #00bfff;
  animation: flicker 3s infinite;
`;

const InputGroup = styled.div`
  margin-bottom: 25px;
  position: relative;
`;

const Input = styled.input`
  width: 100%;
  padding: 15px 20px;
  background: linear-gradient(
    135deg,
    rgba(20, 20, 20, 0.9),
    rgba(31, 31, 31, 0.9)
  );
  border: 2px solid #00ff00;
  color: #00ff00;
  font-size: 16px;
  font-family: "Courier Prime", monospace;
  border-radius: 8px;
  outline: none;
  transition: all 0.3s ease;
  box-shadow: inset 0 0 15px rgba(0, 255, 0, 0.1);

  &:focus {
    border-color: #00bfff;
    box-shadow: 0 0 20px rgba(0, 191, 255, 0.6),
      inset 0 0 20px rgba(0, 191, 255, 0.2);
    background: linear-gradient(
      135deg,
      rgba(25, 25, 25, 0.9),
      rgba(36, 36, 36, 0.9)
    );
  }

  &::placeholder {
    color: rgba(0, 255, 0, 0.6);
    font-style: italic;
  }
`;

const InputIcon = styled.div`
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #00ff00;
  font-size: 18px;
  opacity: 0.7;
`;

const Button = styled.button`
  width: 100%;
  padding: 16px 24px;
  margin-top: 30px;
  background: linear-gradient(
    135deg,
    rgba(0, 255, 0, 0.1),
    rgba(0, 191, 255, 0.1)
  );
  border: 2px solid #00ff00;
  color: #00ff00;
  font-size: 16px;
  font-weight: 700;
  font-family: "Courier Prime", monospace;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 0 15px rgba(0, 255, 0, 0.4), inset 0 0 15px rgba(0, 255, 0, 0.1);
  border-radius: 8px;
  position: relative;
  overflow: hidden;
  text-transform: uppercase;
  letter-spacing: 2px;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.3),
      transparent
    );
    transition: left 0.6s ease;
  }

  &:hover::before {
    left: 100%;
  }

  &:hover {
    color: #00bfff;
    border-color: #00bfff;
    box-shadow: 0 0 25px rgba(0, 191, 255, 0.8),
      inset 0 0 25px rgba(0, 191, 255, 0.2);
    transform: translateY(-3px);
  }

  &:active {
    transform: translateY(-1px);
    box-shadow: 0 0 10px rgba(0, 191, 255, 0.8),
      inset 0 0 10px rgba(0, 191, 255, 0.2);
  }
`;

const StatusMessage = styled.div`
  margin-top: 20px;
  padding: 10px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const ErrorMessage = styled(StatusMessage)`
  background: rgba(255, 0, 0, 0.1);
  border: 1px solid #ff0000;
  color: #ff6666;
  box-shadow: 0 0 10px rgba(255, 0, 0, 0.3);
`;

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Simulate API call
    setTimeout(() => {
      if (username.trim() && password.trim()) {
        setIsLoading(false);
        onLogin(username);
      } else {
        setIsLoading(false);
        setError("Please enter both username and password");
      }
    }, 1500);
  };

  return (
    <>
      <MatrixBackground />
      <Overlay>
        <LoginBox>
          <LoginBoxBefore />
          <Title>Access Granted?</Title>
          <form onSubmit={handleSubmit}>
            <InputGroup>
              <Input
                type="text"
                placeholder="Enter Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                disabled={isLoading}
              />
              <InputIcon>👤</InputIcon>
            </InputGroup>
            <InputGroup>
              <Input
                type="password"
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
              <InputIcon>🔒</InputIcon>
            </InputGroup>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Authenticating..." : "Login"}
            </Button>
            {error && <ErrorMessage>{error}</ErrorMessage>}
          </form>
        </LoginBox>
      </Overlay>
    </>
  );
};

export default Login;
