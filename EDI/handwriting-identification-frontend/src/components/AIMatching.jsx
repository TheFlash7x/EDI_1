import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { FaPlay, FaPause, FaRedo, FaSearch } from "react-icons/fa";
import { matchSamples } from "../services/api.js";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px;
  min-height: 400px;
  position: relative;
`;

const Title = styled.h2`
  color: #00ff00;
  margin: 0 0 30px 0;
  font-size: 1.8rem;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 2px;
  text-shadow: 0 0 10px #00ff00;
`;

const RadarContainer = styled.div`
  position: relative;
  width: 300px;
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 30px;
`;

const RadarCircle = styled.div`
  position: absolute;
  border: 2px solid rgba(0, 255, 0, ${(props) => 0.8 - props.level * 0.2});
  border-radius: 50%;
  width: ${(props) => 50 + props.level * 50}px;
  height: ${(props) => 50 + props.level * 50}px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const RadarGrid = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background: radial-gradient(
    circle,
    transparent 40%,
    rgba(0, 255, 0, 0.1) 41%,
    rgba(0, 255, 0, 0.1) 42%,
    transparent 43%
  );
`;

const rotate = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const RadarSweep = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  border-left: 2px solid #00bfff;
  border-radius: 50%;
  animation: ${rotate} ${(props) => props.speed}s linear infinite;
  animation-play-state: ${(props) => (props.isActive ? "running" : "paused")};
  transform-origin: center;
  box-shadow: 0 0 10px #00bfff;
`;

const CenterDot = styled.div`
  position: absolute;
  width: 8px;
  height: 8px;
  background: #00ff00;
  border-radius: 50%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0 0 15px #00ff00;
`;

const MatchPoint = styled.div`
  position: absolute;
  width: ${(props) => props.size}px;
  height: ${(props) => props.size}px;
  background: ${(props) => props.color};
  border-radius: 50%;
  top: ${(props) => props.y}%;
  left: ${(props) => props.x}%;
  transform: translate(-50%, -50%);
  box-shadow: 0 0 10px ${(props) => props.color};
  animation: ${(props) => (props.pulse ? pulse : "none")} 2s infinite;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translate(-50%, -50%) scale(1.2);
  }
`;

const pulse = keyframes`
  0% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
  50% { transform: translate(-50%, -50%) scale(1.2); opacity: 0.7; }
  100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
`;

const MatchInfo = styled.div`
  position: absolute;
  background: rgba(0, 0, 0, 0.9);
  border: 1px solid #00bfff;
  border-radius: 6px;
  padding: 8px 12px;
  font-size: 12px;
  color: #00ff00;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.3s ease;
  white-space: nowrap;
  z-index: 10;

  &.visible {
    opacity: 1;
  }
`;

const Controls = styled.div`
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
`;

const ControlButton = styled.button`
  background: rgba(0, 255, 0, 0.1);
  border: 2px solid #00ff00;
  color: #00ff00;
  padding: 12px 20px;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-size: 12px;

  &:hover {
    background: rgba(0, 255, 0, 0.2);
    border-color: #00bfff;
    color: #00bfff;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ProgressText = styled.div`
  color: #00bfff;
  font-size: 14px;
  text-align: center;
  margin-bottom: 10px;
  font-weight: 600;
`;

const ResultsContainer = styled.div`
  width: 100%;
  max-width: 600px;
`;

const ResultItem = styled.div`
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(0, 255, 0, 0.3);
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s ease;

  &:hover {
    border-color: #00bfff;
    background: rgba(0, 191, 255, 0.1);
  }
`;

const ResultInfo = styled.div`
  flex: 1;
`;

const ResultName = styled.div`
  color: #00ff00;
  font-weight: 600;
  font-size: 14px;
`;

const ResultScore = styled.div`
  color: #00bfff;
  font-size: 12px;
  margin-top: 4px;
`;

const ConfidenceBar = styled.div`
  width: 100px;
  height: 8px;
  background: rgba(0, 255, 0, 0.2);
  border-radius: 4px;
  overflow: hidden;
  margin-left: 15px;
`;

const ConfidenceFill = styled.div`
  height: 100%;
  background: ${(props) =>
    props.score > 0.8 ? "#00ff00" : props.score > 0.6 ? "#ffff00" : "#ff6666"};
  width: ${(props) => props.score * 100}%;
  transition: width 1s ease;
`;

const StatusMessage = styled.div`
  text-align: center;
  padding: 20px;
  color: #00bfff;
  font-size: 16px;
  font-weight: 600;
`;

const AIMatching = ({ evidenceSampleId, suspectIds, onMatchingComplete }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [matches, setMatches] = useState([]);
  const [hoveredMatch, setHoveredMatch] = useState(null);
  const [status, setStatus] = useState("Ready to scan");

  // Generate random positions for match points on radar
  const generateMatchPoints = (matches) => {
    return matches.map((match, index) => ({
      ...match,
      x: 40 + Math.random() * 20, // Random position within radar
      y: 40 + Math.random() * 20,
      size: Math.max(4, match.similarity_score * 12),
      color:
        match.similarity_score > 0.8
          ? "#00ff00"
          : match.similarity_score > 0.6
          ? "#ffff00"
          : "#ff6666",
    }));
  };

  const [matchPoints, setMatchPoints] = useState([]);

  const startMatching = async () => {
    if (!evidenceSampleId || suspectIds.length === 0) {
      setStatus("No evidence or suspects selected");
      return;
    }

    setIsScanning(true);
    setProgress(0);
    setMatches([]);
    setMatchPoints([]);
    setStatus("Initializing scan...");

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + Math.random() * 15;
        });
      }, 500);

      setStatus("Analyzing handwriting patterns...");

      // Call the matching API
      const response = await matchSamples(evidenceSampleId, suspectIds);

      clearInterval(progressInterval);
      setProgress(100);
      setStatus("Scan complete");

      const results = response.data.matches || [];
      setMatches(results);
      setMatchPoints(generateMatchPoints(results));

      if (onMatchingComplete) {
        onMatchingComplete(results);
      }

      setTimeout(() => {
        setIsScanning(false);
        setStatus("Ready to scan");
      }, 2000);
    } catch (error) {
      console.error("Matching error:", error);
      setStatus("Scan failed - please try again");
      setIsScanning(false);
      setProgress(0);
    }
  };

  const resetScan = () => {
    setIsScanning(false);
    setProgress(0);
    setMatches([]);
    setMatchPoints([]);
    setStatus("Ready to scan");
  };

  return (
    <Container>
      <Title>AI Handwriting Analysis</Title>

      <Controls>
        <ControlButton onClick={startMatching} disabled={isScanning}>
          <FaPlay /> {isScanning ? "Scanning..." : "Start Scan"}
        </ControlButton>
        <ControlButton onClick={resetScan} disabled={isScanning}>
          <FaRedo /> Reset
        </ControlButton>
      </Controls>

      <ProgressText>{status}</ProgressText>

      <RadarContainer>
        <RadarGrid />
        {[1, 2, 3, 4, 5].map((level) => (
          <RadarCircle key={level} level={level} />
        ))}
        <RadarSweep isActive={isScanning} speed={2} />
        <CenterDot />

        {matchPoints.map((point, index) => (
          <MatchPoint
            key={index}
            x={point.x}
            y={point.y}
            size={point.size}
            color={point.color}
            pulse={point.similarity_score > 0.7}
            onMouseEnter={() => setHoveredMatch(index)}
            onMouseLeave={() => setHoveredMatch(null)}
          />
        ))}

        {hoveredMatch !== null && matchPoints[hoveredMatch] && (
          <MatchInfo
            className="visible"
            style={{
              left: `${matchPoints[hoveredMatch].x}%`,
              top: `${matchPoints[hoveredMatch].y - 10}%`,
            }}
          >
            {matchPoints[hoveredMatch].person_details?.name || "Unknown"}
            <br />
            {(matchPoints[hoveredMatch].similarity_score * 100).toFixed(1)}%
            match
          </MatchInfo>
        )}
      </RadarContainer>

      {matches.length > 0 && (
        <ResultsContainer>
          <h3
            style={{
              color: "#00bfff",
              textAlign: "center",
              marginBottom: "20px",
            }}
          >
            Matching Results
          </h3>
          {matches.map((match, index) => (
            <ResultItem key={index}>
              <ResultInfo>
                <ResultName>
                  {match.person_details?.name || "Unknown Person"}
                </ResultName>
                <ResultScore>
                  Similarity: {(match.similarity_score * 100).toFixed(1)}%
                </ResultScore>
              </ResultInfo>
              <ConfidenceBar>
                <ConfidenceFill score={match.similarity_score} />
              </ConfidenceBar>
            </ResultItem>
          ))}
        </ResultsContainer>
      )}

      {matches.length === 0 && !isScanning && progress === 0 && (
        <StatusMessage>
          <FaSearch style={{ marginRight: "10px" }} />
          Select evidence and suspects to begin analysis
        </StatusMessage>
      )}
    </Container>
  );
};

export { AIMatching };
