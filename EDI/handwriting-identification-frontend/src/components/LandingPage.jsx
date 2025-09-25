import React from "react";
import styled from "styled-components";
import { MatrixBackground } from "./MatrixBackground.jsx";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  text-align: center;
  padding: 20px;
`;

const Title = styled.h1`
  font-size: 3rem;
  margin-bottom: 20px;
  color: #00ff00;
  text-shadow: 0 0 10px #00ff00;
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  margin-bottom: 40px;
  color: #00bfff;
`;

const Button = styled.button`
  background: transparent;
  border: 1px solid #00ff00;
  color: #00ff00;
  padding: 15px 30px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #00ff00;
    color: #0f0f0f;
    box-shadow: 0 0 20px #00ff00;
  }
`;

const LandingPage = ({ onLogin }) => {
  return (
    <>
      <MatrixBackground />
      <Container>
        <Title>Handwriting Writer Identification</Title>
        <Subtitle>Advanced AI-powered forensic analysis</Subtitle>
        <Button onClick={onLogin}>Enter System</Button>
      </Container>
    </>
  );
};

export default LandingPage;
