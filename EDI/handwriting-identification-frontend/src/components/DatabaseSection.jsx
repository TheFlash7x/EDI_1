import React, { useState } from "react";
import styled from "styled-components";
import {
  FaDatabase,
  FaUsers,
  FaFileAlt,
  FaChartBar,
  FaDownload,
  FaTrash,
  FaSync,
  FaCheckCircle,
  FaExclamationTriangle,
} from "react-icons/fa";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const Title = styled.h2`
  color: #00ff00;
  margin: 0;
  font-size: 1.8rem;
  text-transform: uppercase;
  letter-spacing: 2px;
  text-shadow: 0 0 10px #00ff00;
`;

const Controls = styled.div`
  display: flex;
  gap: 15px;
`;

const Button = styled.button`
  background: rgba(0, 255, 0, 0.1);
  border: 2px solid #00ff00;
  color: #00ff00;
  padding: 10px 20px;
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

  &.secondary {
    background: rgba(0, 191, 255, 0.1);
    border-color: #00bfff;
    color: #00bfff;

    &:hover {
      background: rgba(0, 191, 255, 0.2);
      border-color: #00ff00;
      color: #00ff00;
    }
  }

  &.danger {
    background: rgba(255, 68, 68, 0.1);
    border-color: #ff4444;
    color: #ff6666;

    &:hover {
      background: rgba(255, 68, 68, 0.2);
      border-color: #ff6666;
    }
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const StatCard = styled.div`
  background: linear-gradient(
    135deg,
    rgba(20, 20, 20, 0.9),
    rgba(31, 31, 31, 0.9)
  );
  border: 2px solid rgba(0, 255, 0, 0.3);
  border-radius: 12px;
  padding: 25px;
  text-align: center;
  box-shadow: 0 0 20px rgba(0, 255, 0, 0.3);
  transition: all 0.3s ease;

  &:hover {
    border-color: #00bfff;
    box-shadow: 0 0 30px rgba(0, 191, 255, 0.5);
    transform: translateY(-2px);
  }
`;

const StatIcon = styled.div`
  font-size: 3rem;
  color: #00ff00;
  margin-bottom: 15px;
`;

const StatValue = styled.div`
  font-size: 2.5rem;
  font-weight: 700;
  color: #00ff00;
  text-shadow: 0 0 10px #00ff00;
  margin-bottom: 5px;
`;

const StatLabel = styled.div`
  font-size: 14px;
  color: #00bfff;
  text-transform: uppercase;
  letter-spacing: 1px;
  opacity: 0.8;
`;

const Section = styled.div`
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(0, 255, 0, 0.3);
  border-radius: 8px;
  padding: 25px;
  margin-bottom: 25px;
`;

const SectionTitle = styled.h3`
  color: #00ff00;
  margin: 0 0 20px 0;
  font-size: 1.4rem;
  text-transform: uppercase;
  letter-spacing: 2px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
`;

const TableHeader = styled.th`
  background: rgba(0, 255, 0, 0.1);
  color: #00ff00;
  padding: 15px;
  text-align: left;
  border-bottom: 2px solid rgba(0, 255, 0, 0.3);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-size: 12px;
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background: rgba(0, 255, 0, 0.05);
  }

  &:hover {
    background: rgba(0, 191, 255, 0.1);
  }
`;

const TableCell = styled.td`
  padding: 15px;
  border-bottom: 1px solid rgba(0, 255, 0, 0.2);
  color: #00bfff;
  font-size: 14px;
`;

const StatusIndicator = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;

  &.success {
    background: rgba(0, 255, 0, 0.2);
    color: #00ff00;
    border: 1px solid #00ff00;
  }

  &.warning {
    background: rgba(255, 193, 7, 0.2);
    color: #ffc107;
    border: 1px solid #ffc107;
  }

  &.error {
    background: rgba(255, 68, 68, 0.2);
    color: #ff4444;
    border: 1px solid #ff4444;
  }
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: rgba(0, 255, 0, 0.2);
  border-radius: 4px;
  overflow: hidden;
  margin-top: 10px;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: linear-gradient(90deg, #00ff00, #00bfff);
  width: ${(props) => props.percentage}%;
  transition: width 0.3s ease;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 20px;
`;

const DatabaseSection = ({ persons, evidenceSamples, currentCase }) => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Calculate statistics
  const totalPersons = persons.length;
  const totalSamples = persons.reduce(
    (sum, person) => sum + (person.sample_count || 0),
    0
  );
  const totalCases = persons.reduce(
    (sum, person) => sum + (person.case_count || 0),
    0
  );
  const avgSamplesPerPerson =
    totalPersons > 0 ? Math.round(totalSamples / totalPersons) : 0;

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate refresh
    setTimeout(() => {
      setIsRefreshing(false);
    }, 2000);
  };

  const handleBackup = () => {
    // Create backup functionality
    const data = {
      persons,
      evidenceSamples,
      timestamp: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `database_backup_${
      new Date().toISOString().split("T")[0]
    }.json`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleCleanup = () => {
    // Cleanup orphaned data
    console.log("Cleaning up database...");
  };

  return (
    <Container>
      <Header>
        <Title>Database Management</Title>
        <Controls>
          <Button onClick={handleRefresh} disabled={isRefreshing}>
            <FaSync className={isRefreshing ? "fa-spin" : ""} />
            {isRefreshing ? "Refreshing..." : "Refresh"}
          </Button>
          <Button className="secondary" onClick={handleBackup}>
            <FaDownload /> Backup
          </Button>
          <Button className="danger" onClick={handleCleanup}>
            <FaTrash /> Cleanup
          </Button>
        </Controls>
      </Header>

      <StatsGrid>
        <StatCard>
          <StatIcon>
            <FaUsers />
          </StatIcon>
          <StatValue>{totalPersons}</StatValue>
          <StatLabel>Total Persons</StatLabel>
        </StatCard>

        <StatCard>
          <StatIcon>
            <FaFileAlt />
          </StatIcon>
          <StatValue>{totalSamples}</StatValue>
          <StatLabel>Total Samples</StatLabel>
        </StatCard>

        <StatCard>
          <StatIcon>
            <FaDatabase />
          </StatIcon>
          <StatValue>{totalCases}</StatValue>
          <StatLabel>Total Cases</StatLabel>
        </StatCard>

        <StatCard>
          <StatIcon>
            <FaChartBar />
          </StatIcon>
          <StatValue>{avgSamplesPerPerson}</StatValue>
          <StatLabel>Avg Samples/Person</StatLabel>
        </StatCard>
      </StatsGrid>

      <Section>
        <SectionTitle>
          <FaDatabase />
          Database Tables
        </SectionTitle>
        <Table>
          <thead>
            <TableHeader>Table Name</TableHeader>
            <TableHeader>Records</TableHeader>
            <TableHeader>Status</TableHeader>
            <TableHeader>Last Updated</TableHeader>
          </thead>
          <tbody>
            <TableRow>
              <TableCell>Persons</TableCell>
              <TableCell>{totalPersons}</TableCell>
              <TableCell>
                <StatusIndicator className="success">
                  <FaCheckCircle />
                  Healthy
                </StatusIndicator>
              </TableCell>
              <TableCell>{new Date().toLocaleDateString()}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Samples</TableCell>
              <TableCell>{totalSamples}</TableCell>
              <TableCell>
                <StatusIndicator className="success">
                  <FaCheckCircle />
                  Healthy
                </StatusIndicator>
              </TableCell>
              <TableCell>{new Date().toLocaleDateString()}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Cases</TableCell>
              <TableCell>{totalCases}</TableCell>
              <TableCell>
                <StatusIndicator className="warning">
                  <FaExclamationTriangle />
                  Needs Review
                </StatusIndicator>
              </TableCell>
              <TableCell>{new Date().toLocaleDateString()}</TableCell>
            </TableRow>
          </tbody>
        </Table>
      </Section>

      <Section>
        <SectionTitle>
          <FaChartBar />
          Storage Usage
        </SectionTitle>
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "10px",
            }}
          >
            <span style={{ color: "#00bfff" }}>Database Size</span>
            <span style={{ color: "#00ff00" }}>2.4 GB / 10 GB</span>
          </div>
          <ProgressBar>
            <ProgressFill percentage={24} />
          </ProgressBar>
        </div>

        <div style={{ marginTop: "20px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "10px",
            }}
          >
            <span style={{ color: "#00bfff" }}>Sample Images</span>
            <span style={{ color: "#00ff00" }}>1.8 GB / 50 GB</span>
          </div>
          <ProgressBar>
            <ProgressFill percentage={3.6} />
          </ProgressBar>
        </div>
      </Section>

      <Section>
        <SectionTitle>
          <FaSync />
          Recent Activity
        </SectionTitle>
        <Table>
          <thead>
            <TableHeader>Action</TableHeader>
            <TableHeader>User</TableHeader>
            <TableHeader>Timestamp</TableHeader>
            <TableHeader>Status</TableHeader>
          </thead>
          <tbody>
            <TableRow>
              <TableCell>Person Added</TableCell>
              <TableCell>admin</TableCell>
              <TableCell>{new Date().toLocaleString()}</TableCell>
              <TableCell>
                <StatusIndicator className="success">
                  <FaCheckCircle />
                  Success
                </StatusIndicator>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Sample Uploaded</TableCell>
              <TableCell>admin</TableCell>
              <TableCell>
                {new Date(Date.now() - 3600000).toLocaleString()}
              </TableCell>
              <TableCell>
                <StatusIndicator className="success">
                  <FaCheckCircle />
                  Success
                </StatusIndicator>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Case Created</TableCell>
              <TableCell>admin</TableCell>
              <TableCell>
                {new Date(Date.now() - 7200000).toLocaleString()}
              </TableCell>
              <TableCell>
                <StatusIndicator className="success">
                  <FaCheckCircle />
                  Success
                </StatusIndicator>
              </TableCell>
            </TableRow>
          </tbody>
        </Table>
      </Section>

      <ActionButtons>
        <Button className="secondary">
          <FaDownload /> Export Report
        </Button>
        <Button>
          <FaSync /> Optimize Database
        </Button>
      </ActionButtons>
    </Container>
  );
};

export default DatabaseSection;
