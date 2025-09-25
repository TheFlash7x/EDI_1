import React, { useState, useEffect } from "react";
import styled from "styled-components";
import {
  FaFileAlt,
  FaUser,
  FaSignOutAlt,
  FaSearch,
  FaPlus,
  FaChartBar,
  FaCog,
  FaDatabase,
  FaUpload,
  FaRobot,
} from "react-icons/fa";
import { MatrixBackground } from "./MatrixBackground.jsx";
import { NewCaseModal } from "./NewCaseModal.jsx";
import { UploadEvidence } from "./UploadEvidence.jsx";
import { AIMatching } from "./AIMatching.jsx";
import PersonsSection from "./PersonsSection.jsx";
import SearchSection from "./SearchSection.jsx";
import DatabaseSection from "./DatabaseSection.jsx";
import AnalyticsSection from "./AnalyticsSection.jsx";
import { getPersons, getRoot, getCases } from "../services/api.js";

const Container = styled.div`
  display: flex;
  height: 100vh;
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
`;

const Sidebar = styled.div`
  background: linear-gradient(
    180deg,
    rgba(18, 18, 18, 0.95),
    rgba(26, 26, 26, 0.95)
  );
  border-right: 2px solid #00ff00;
  width: 250px;
  color: #00ff00;
  display: flex;
  flex-direction: column;
  padding: 25px 20px;
  box-shadow: 2px 0 20px rgba(0, 255, 0, 0.2);
  position: relative;
  overflow: hidden;
`;

const SidebarHeader = styled.div`
  margin-bottom: 30px;
  text-align: center;
  border-bottom: 1px solid rgba(0, 255, 0, 0.3);
  padding-bottom: 20px;
`;

const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: #00ff00;
  text-shadow: 0 0 10px #00ff00;
  margin-bottom: 10px;
`;

const Subtitle = styled.div`
  font-size: 0.8rem;
  color: #00bfff;
  opacity: 0.8;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const SidebarItem = styled.div`
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
  display: flex;
  align-items: center;

  svg {
    margin-right: 12px;
    font-size: 16px;
  }

  &:hover {
    background: linear-gradient(
      90deg,
      rgba(0, 255, 0, 0.1),
      rgba(0, 191, 255, 0.1)
    );
    border-left: 4px solid #00ff00;
    box-shadow: 0 0 15px rgba(0, 255, 0, 0.4),
      inset 0 0 15px rgba(0, 255, 0, 0.1);
    transform: translateX(5px);
  }

  &.active {
    background: linear-gradient(
      90deg,
      rgba(0, 191, 255, 0.2),
      rgba(0, 255, 0, 0.2)
    );
    border-left: 4px solid #00bfff;
    box-shadow: 0 0 20px rgba(0, 191, 255, 0.6),
      inset 0 0 20px rgba(0, 191, 255, 0.2);
    transform: translateX(8px);
  }

  &.active::before {
    content: ">";
    position: absolute;
    right: 15px;
    color: #00bfff;
    font-weight: bold;
    animation: flicker 2s infinite;
  }
`;

const MainContent = styled.div`
  flex-grow: 1;
  padding: 30px;
  overflow-y: auto;
  position: relative;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid rgba(0, 255, 0, 0.3);
`;

const Title = styled.h1`
  color: #00ff00;
  margin: 0;
  font-size: 2rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 2px;
  text-shadow: 0 0 10px #00ff00;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  color: #00bfff;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const LogoutButton = styled.button`
  background: linear-gradient(
    135deg,
    rgba(255, 0, 0, 0.1),
    rgba(255, 100, 100, 0.1)
  );
  border: 2px solid #ff4444;
  color: #ff6666;
  padding: 10px 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 0 10px rgba(255, 68, 68, 0.3),
    inset 0 0 10px rgba(255, 68, 68, 0.1);
  border-radius: 6px;
  position: relative;
  overflow: hidden;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-size: 12px;
  font-weight: 700;
  margin-left: 20px;

  svg {
    margin-right: 8px;
  }

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
      rgba(255, 255, 255, 0.2),
      transparent
    );
    transition: left 0.5s ease;
  }

  &:hover::before {
    left: 100%;
  }

  &:hover {
    color: #ffffff;
    border-color: #ff6666;
    box-shadow: 0 0 20px rgba(255, 102, 102, 0.6),
      inset 0 0 20px rgba(255, 102, 102, 0.2);
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 0 5px rgba(255, 102, 102, 0.6),
      inset 0 0 5px rgba(255, 102, 102, 0.2);
  }
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 25px;
  margin-top: 30px;
`;

const Card = styled.div`
  background: linear-gradient(
    135deg,
    rgba(20, 20, 20, 0.9),
    rgba(31, 31, 31, 0.9)
  );
  border: 2px solid #00ff00;
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 0 20px rgba(0, 255, 0, 0.3), inset 0 0 20px rgba(0, 255, 0, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    border-color: #00bfff;
    box-shadow: 0 0 30px rgba(0, 191, 255, 0.5),
      inset 0 0 30px rgba(0, 191, 255, 0.2);
    transform: translateY(-5px);
  }
`;

const CardIcon = styled.div`
  font-size: 2.5rem;
  color: #00ff00;
  margin-bottom: 15px;
  text-align: center;
`;

const CardTitle = styled.h3`
  color: #00ff00;
  margin: 0 0 10px 0;
  font-size: 1.2rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  text-align: center;
`;

const CardDescription = styled.p`
  color: #00bfff;
  margin: 0;
  font-size: 14px;
  text-align: center;
  opacity: 0.8;
`;

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const StatCard = styled.div`
  background: linear-gradient(
    135deg,
    rgba(15, 15, 15, 0.9),
    rgba(26, 26, 26, 0.9)
  );
  border: 1px solid rgba(0, 255, 0, 0.5);
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  box-shadow: inset 0 0 10px rgba(0, 255, 0, 0.1);
`;

const StatNumber = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: #00ff00;
  text-shadow: 0 0 10px #00ff00;
  margin-bottom: 5px;
`;

const StatLabel = styled.div`
  font-size: 12px;
  color: #00bfff;
  text-transform: uppercase;
  letter-spacing: 1px;
  opacity: 0.8;
`;

const CaseWorkflowContainer = styled.div`
  background: linear-gradient(
    135deg,
    rgba(15, 15, 15, 0.9),
    rgba(26, 26, 26, 0.9)
  );
  border: 2px solid #00ff00;
  border-radius: 12px;
  padding: 25px;
  margin-bottom: 30px;
  box-shadow: 0 0 20px rgba(0, 255, 0, 0.3);
`;

const WorkflowTitle = styled.h3`
  color: #00ff00;
  margin: 0 0 20px 0;
  font-size: 1.4rem;
  text-transform: uppercase;
  letter-spacing: 2px;
  text-shadow: 0 0 10px #00ff00;
`;

const WorkflowSteps = styled.div`
  display: flex;
  gap: 30px;
  justify-content: space-between;
  flex-wrap: wrap;
`;

const WorkflowStep = styled.div`
  flex: 1;
  min-width: 200px;
  background: ${(props) =>
    props.completed
      ? "linear-gradient(135deg, rgba(0, 255, 0, 0.1), rgba(0, 191, 255, 0.1))"
      : props.active
      ? "linear-gradient(135deg, rgba(0, 191, 255, 0.1), rgba(0, 255, 0, 0.1))"
      : "linear-gradient(135deg, rgba(40, 40, 40, 0.5), rgba(20, 20, 20, 0.5))"};
  border: 2px solid
    ${(props) =>
      props.completed
        ? "#00ff00"
        : props.active
        ? "#00bfff"
        : "rgba(0, 255, 0, 0.3)"};
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 15px;
  transition: all 0.3s ease;
  position: relative;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 255, 0, 0.2);
  }

  &::before {
    content: "";
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    background: linear-gradient(45deg, #00ff00, #00bfff, #00ff00);
    border-radius: 12px;
    z-index: -1;
    opacity: ${(props) => (props.active ? 0.3 : 0)};
    transition: opacity 0.3s ease;
  }
`;

const StepIcon = styled.div`
  font-size: 2rem;
  color: ${(props) => (props.completed ? "#00ff00" : "#00bfff")};
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  border: 2px solid ${(props) => (props.completed ? "#00ff00" : "#00bfff")};
`;

const StepContent = styled.div`
  flex: 1;
`;

const StepTitle = styled.h4`
  color: #00ff00;
  margin: 0 0 8px 0;
  font-size: 1.1rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const StepDescription = styled.p`
  color: #00bfff;
  margin: 0 0 15px 0;
  font-size: 14px;
  opacity: 0.8;
`;

const StepButton = styled.button`
  background: ${(props) =>
    props.disabled
      ? "rgba(100, 100, 100, 0.2)"
      : "linear-gradient(135deg, rgba(0, 255, 0, 0.1), rgba(0, 191, 255, 0.1))"};
  border: 2px solid
    ${(props) => (props.disabled ? "rgba(100, 100, 100, 0.5)" : "#00bfff")};
  color: ${(props) => (props.disabled ? "#666" : "#00bfff")};
  padding: 8px 16px;
  border-radius: 6px;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-size: 12px;
  transition: all 0.3s ease;

  &:hover:not(:disabled) {
    background: linear-gradient(
      135deg,
      rgba(0, 191, 255, 0.2),
      rgba(0, 255, 0, 0.2)
    );
    border-color: #00ff00;
    color: #00ff00;
  }
`;

const Dashboard = ({ username, onLogout }) => {
  const [activeItem, setActiveItem] = useState("cases");
  const [persons, setPersons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showNewCaseModal, setShowNewCaseModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [currentCase, setCurrentCase] = useState(null);
  const [evidenceSamples, setEvidenceSamples] = useState([]);
  const [selectedSuspects, setSelectedSuspects] = useState([]);
  const [matchingResults, setMatchingResults] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [personsResponse] = await Promise.all([getPersons()]);
        setPersons(personsResponse.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to connect to backend");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSidebarClick = (item) => {
    setActiveItem(item);
  };

  return (
    <>
      <MatrixBackground />
      <Container>
        <Sidebar>
          <SidebarHeader>
            <Logo>HANDWRITING ID</Logo>
            <Subtitle>Forensic Analysis</Subtitle>
          </SidebarHeader>

          <SidebarItem
            className={activeItem === "cases" ? "active" : ""}
            onClick={() => handleSidebarClick("cases")}
          >
            <FaFileAlt />
            Cases
          </SidebarItem>

          <SidebarItem
            className={activeItem === "persons" ? "active" : ""}
            onClick={() => handleSidebarClick("persons")}
          >
            <FaUser />
            Persons
          </SidebarItem>

          <SidebarItem
            className={activeItem === "search" ? "active" : ""}
            onClick={() => handleSidebarClick("search")}
          >
            <FaSearch />
            Search
          </SidebarItem>

          <SidebarItem
            className={activeItem === "database" ? "active" : ""}
            onClick={() => handleSidebarClick("database")}
          >
            <FaDatabase />
            Database
          </SidebarItem>

          <SidebarItem
            className={activeItem === "analytics" ? "active" : ""}
            onClick={() => handleSidebarClick("analytics")}
          >
            <FaChartBar />
            Analytics
          </SidebarItem>

          <SidebarItem
            className={activeItem === "matching" ? "active" : ""}
            onClick={() => handleSidebarClick("matching")}
          >
            <FaRobot />
            AI Matching
          </SidebarItem>

          <SidebarItem
            className={activeItem === "settings" ? "active" : ""}
            onClick={() => handleSidebarClick("settings")}
          >
            <FaCog />
            Settings
          </SidebarItem>
        </Sidebar>

        <MainContent>
          <Header>
            <Title>
              {activeItem === "cases" && "Case Management"}
              {activeItem === "persons" && "Person Database"}
              {activeItem === "search" && "Advanced Search"}
              {activeItem === "database" && "Database Management"}
              {activeItem === "analytics" && "Analytics Dashboard"}
              {activeItem === "settings" && "System Settings"}
            </Title>
            <div style={{ display: "flex", alignItems: "center" }}>
              <UserInfo>Welcome, {username}</UserInfo>
              <LogoutButton onClick={onLogout}>
                <FaSignOutAlt />
                Logout
              </LogoutButton>
            </div>
          </Header>

          {activeItem === "cases" && (
            <>
              <StatsContainer>
                <StatCard>
                  <StatNumber>{loading ? "..." : "0"}</StatNumber>
                  <StatLabel>Active Cases</StatLabel>
                </StatCard>
                <StatCard>
                  <StatNumber>{loading ? "..." : "0"}</StatNumber>
                  <StatLabel>Total Samples</StatLabel>
                </StatCard>
                <StatCard>
                  <StatNumber>{loading ? "..." : "0%"}</StatNumber>
                  <StatLabel>Match Accuracy</StatLabel>
                </StatCard>
                <StatCard>
                  <StatNumber>{persons.length}</StatNumber>
                  <StatLabel>Persons in DB</StatLabel>
                </StatCard>
              </StatsContainer>

              {currentCase && (
                <CaseWorkflowContainer>
                  <WorkflowTitle>
                    Current Case: {currentCase.case_name}
                  </WorkflowTitle>

                  <WorkflowSteps>
                    <WorkflowStep
                      active={true}
                      completed={evidenceSamples.length > 0}
                    >
                      <StepIcon>
                        <FaUpload />
                      </StepIcon>
                      <StepContent>
                        <StepTitle>Evidence Upload</StepTitle>
                        <StepDescription>
                          {evidenceSamples.length > 0
                            ? `${evidenceSamples.length} sample(s) uploaded`
                            : "Upload handwriting evidence samples"}
                        </StepDescription>
                        <StepButton onClick={() => setShowUploadModal(true)}>
                          {evidenceSamples.length > 0
                            ? "Add More"
                            : "Upload Evidence"}
                        </StepButton>
                      </StepContent>
                    </WorkflowStep>

                    <WorkflowStep
                      active={evidenceSamples.length > 0}
                      completed={selectedSuspects.length > 0}
                    >
                      <StepIcon>
                        <FaUser />
                      </StepIcon>
                      <StepContent>
                        <StepTitle>Suspect Selection</StepTitle>
                        <StepDescription>
                          {selectedSuspects.length > 0
                            ? `${selectedSuspects.length} suspect(s) selected`
                            : "Select suspects from database"}
                        </StepDescription>
                        <StepButton
                          onClick={() => setActiveItem("persons")}
                          disabled={evidenceSamples.length === 0}
                        >
                          {selectedSuspects.length > 0
                            ? "Manage Suspects"
                            : "Select Suspects"}
                        </StepButton>
                      </StepContent>
                    </WorkflowStep>

                    <WorkflowStep
                      active={
                        evidenceSamples.length > 0 &&
                        selectedSuspects.length > 0
                      }
                      completed={matchingResults.length > 0}
                    >
                      <StepIcon>
                        <FaRobot />
                      </StepIcon>
                      <StepContent>
                        <StepTitle>AI Analysis</StepTitle>
                        <StepDescription>
                          {matchingResults.length > 0
                            ? `${matchingResults.length} matches found`
                            : "Run AI handwriting analysis"}
                        </StepDescription>
                        <StepButton
                          onClick={() => setActiveItem("matching")}
                          disabled={
                            evidenceSamples.length === 0 ||
                            selectedSuspects.length === 0
                          }
                        >
                          {matchingResults.length > 0
                            ? "View Results"
                            : "Start Analysis"}
                        </StepButton>
                      </StepContent>
                    </WorkflowStep>
                  </WorkflowSteps>
                </CaseWorkflowContainer>
              )}

              <ContentGrid>
                <Card onClick={() => setShowNewCaseModal(true)}>
                  <CardIcon>
                    <FaPlus />
                  </CardIcon>
                  <CardTitle>New Case</CardTitle>
                  <CardDescription>
                    Create a new handwriting analysis case
                  </CardDescription>
                </Card>

                <Card>
                  <CardIcon>
                    <FaFileAlt />
                  </CardIcon>
                  <CardTitle>Recent Cases</CardTitle>
                  <CardDescription>
                    View and manage recent cases
                  </CardDescription>
                </Card>

                <Card>
                  <CardIcon>
                    <FaSearch />
                  </CardIcon>
                  <CardTitle>Case Search</CardTitle>
                  <CardDescription>
                    Search through existing cases
                  </CardDescription>
                </Card>

                <Card>
                  <CardIcon>
                    <FaChartBar />
                  </CardIcon>
                  <CardTitle>Reports</CardTitle>
                  <CardDescription>Generate case reports</CardDescription>
                </Card>
              </ContentGrid>
            </>
          )}

          {activeItem === "persons" && (
            <PersonsSection
              persons={persons}
              onPersonSelect={(person) => {
                if (currentCase) {
                  setSelectedSuspects((prev) => {
                    const isSelected = prev.some((p) => p.id === person.id);
                    if (isSelected) {
                      return prev.filter((p) => p.id !== person.id);
                    } else {
                      return [...prev, person];
                    }
                  });
                }
              }}
              selectedSuspects={selectedSuspects}
              currentCase={currentCase}
            />
          )}

          {activeItem === "search" && (
            <SearchSection
              persons={persons}
              currentCase={currentCase}
              onPersonSelect={(person) => {
                if (currentCase) {
                  setSelectedSuspects((prev) => {
                    const isSelected = prev.some((p) => p.id === person.id);
                    if (isSelected) {
                      return prev.filter((p) => p.id !== person.id);
                    } else {
                      return [...prev, person];
                    }
                  });
                }
              }}
              selectedSuspects={selectedSuspects}
            />
          )}

          {activeItem === "database" && (
            <DatabaseSection
              persons={persons}
              evidenceSamples={evidenceSamples}
              currentCase={currentCase}
            />
          )}

          {activeItem === "analytics" && (
            <AnalyticsSection
              persons={persons}
              evidenceSamples={evidenceSamples}
              currentCase={currentCase}
              matchingResults={matchingResults}
            />
          )}

          {activeItem === "settings" && (
            <ContentGrid>
              <Card>
                <CardIcon>
                  <FaCog />
                </CardIcon>
                <CardTitle>System Settings</CardTitle>
                <CardDescription>
                  Configure system preferences and options
                </CardDescription>
              </Card>
            </ContentGrid>
          )}
        </MainContent>
      </Container>

      <NewCaseModal
        isOpen={showNewCaseModal}
        onClose={() => setShowNewCaseModal(false)}
        onCaseCreated={(newCase) => {
          setCurrentCase(newCase);
          setShowNewCaseModal(false);
        }}
      />

      <UploadEvidence
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onUploadComplete={(uploadedSamples) => {
          setEvidenceSamples((prev) => [...prev, ...uploadedSamples]);
        }}
        personId={null}
      />

      {activeItem === "matching" && (
        <AIMatching
          evidenceSampleId={
            evidenceSamples.length > 0 ? evidenceSamples[0].sample_id : null
          }
          suspectIds={selectedSuspects.map((s) => s.id)}
          onMatchingComplete={(results) => {
            setMatchingResults(results);
          }}
        />
      )}
    </>
  );
};

export default Dashboard;
