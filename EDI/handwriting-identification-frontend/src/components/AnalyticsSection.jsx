import React, { useState } from "react";
import styled from "styled-components";
import {
  FaChartBar,
  FaUsers,
  FaFileAlt,
  FaRobot,
  FaClock,
  FaCheckCircle,
  FaExclamationTriangle,
  FaDownload,
  FaCalendarAlt,
  FaArrowUp,
  FaTrophy,
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
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const MetricCard = styled.div`
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

const MetricIcon = styled.div`
  font-size: 3rem;
  color: #00ff00;
  margin-bottom: 15px;
`;

const MetricValue = styled.div`
  font-size: 2.5rem;
  font-weight: 700;
  color: #00ff00;
  text-shadow: 0 0 10px #00ff00;
  margin-bottom: 5px;
`;

const MetricLabel = styled.div`
  font-size: 14px;
  color: #00bfff;
  text-transform: uppercase;
  letter-spacing: 1px;
  opacity: 0.8;
`;

const MetricChange = styled.div`
  font-size: 12px;
  color: ${(props) => (props.positive ? "#00ff00" : "#ff4444")};
  margin-top: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
`;

const ChartContainer = styled.div`
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(0, 255, 0, 0.3);
  border-radius: 8px;
  padding: 25px;
  margin-bottom: 25px;
`;

const ChartTitle = styled.h3`
  color: #00ff00;
  margin: 0 0 20px 0;
  font-size: 1.4rem;
  text-transform: uppercase;
  letter-spacing: 2px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const ChartPlaceholder = styled.div`
  height: 300px;
  background: linear-gradient(
    135deg,
    rgba(0, 255, 0, 0.1),
    rgba(0, 191, 255, 0.1)
  );
  border: 2px dashed rgba(0, 255, 0, 0.3);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(0, 255, 0, 0.6);
  font-size: 16px;
  text-transform: uppercase;
  letter-spacing: 1px;
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

const AnalyticsSection = ({
  persons,
  evidenceSamples,
  currentCase,
  matchingResults,
}) => {
  const [timeRange, setTimeRange] = useState("7d");

  // Calculate analytics data
  const totalPersons = persons.length;
  const totalSamples = persons.reduce(
    (sum, person) => sum + (person.sample_count || 0),
    0
  );
  const totalMatches = matchingResults.length;
  const avgAccuracy = totalMatches > 0 ? 87.5 : 0; // Mock accuracy

  // Mock performance metrics
  const performanceMetrics = [
    {
      label: "Response Time",
      value: "2.3s",
      change: -12,
      positive: true,
    },
    {
      label: "Match Accuracy",
      value: `${avgAccuracy}%`,
      change: 5,
      positive: true,
    },
    {
      label: "System Uptime",
      value: "99.8%",
      change: 0.2,
      positive: true,
    },
    {
      label: "Error Rate",
      value: "0.02%",
      change: -0.01,
      positive: true,
    },
  ];

  const handleExport = () => {
    const data = {
      metrics: performanceMetrics,
      persons: totalPersons,
      samples: totalSamples,
      matches: totalMatches,
      timestamp: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `analytics_report_${
      new Date().toISOString().split("T")[0]
    }.json`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <Container>
      <Header>
        <Title>Analytics Dashboard</Title>
        <Controls>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            style={{
              background: "rgba(0, 0, 0, 0.5)",
              border: "1px solid rgba(0, 255, 0, 0.3)",
              color: "#00ff00",
              padding: "8px 12px",
              borderRadius: "4px",
            }}
          >
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
          </select>
          <Button className="secondary" onClick={handleExport}>
            <FaDownload /> Export Report
          </Button>
        </Controls>
      </Header>

      <MetricsGrid>
        <MetricCard>
          <MetricIcon>
            <FaUsers />
          </MetricIcon>
          <MetricValue>{totalPersons}</MetricValue>
          <MetricLabel>Total Persons</MetricLabel>
          <MetricChange positive={true}>
            <FaArrowUp />
            +12% from last month
          </MetricChange>
        </MetricCard>

        <MetricCard>
          <MetricIcon>
            <FaFileAlt />
          </MetricIcon>
          <MetricValue>{totalSamples}</MetricValue>
          <MetricLabel>Total Samples</MetricLabel>
          <MetricChange positive={true}>
            <FaArrowUp />
            +8% from last month
          </MetricChange>
        </MetricCard>

        <MetricCard>
          <MetricIcon>
            <FaRobot />
          </MetricIcon>
          <MetricValue>{totalMatches}</MetricValue>
          <MetricLabel>AI Matches</MetricLabel>
          <MetricChange positive={true}>
            <FaArrowUp />
            +15% from last month
          </MetricChange>
        </MetricCard>

        <MetricCard>
          <MetricIcon>
            <FaTrophy />
          </MetricIcon>
          <MetricValue>{avgAccuracy}%</MetricValue>
          <MetricLabel>Match Accuracy</MetricLabel>
          <MetricChange positive={true}>
            <FaArrowUp />
            +2.3% from last month
          </MetricChange>
        </MetricCard>
      </MetricsGrid>

      <ChartContainer>
        <ChartTitle>
          <FaChartBar />
          Performance Trends
        </ChartTitle>
        <ChartPlaceholder>
          Interactive Chart Would Be Displayed Here
        </ChartPlaceholder>
      </ChartContainer>

      <ChartContainer>
        <ChartTitle>
          <FaClock />
          System Performance
        </ChartTitle>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "20px",
          }}
        >
          {performanceMetrics.map((metric, index) => (
            <div
              key={index}
              style={{
                padding: "20px",
                background: "rgba(0, 0, 0, 0.3)",
                borderRadius: "8px",
              }}
            >
              <div
                style={{
                  color: "#00bfff",
                  fontSize: "14px",
                  marginBottom: "10px",
                }}
              >
                {metric.label}
              </div>
              <div
                style={{
                  color: "#00ff00",
                  fontSize: "24px",
                  fontWeight: "700",
                  marginBottom: "10px",
                }}
              >
                {metric.value}
              </div>
              <MetricChange positive={metric.positive}>
                {metric.positive ? (
                  <FaArrowUp />
                ) : (
                  <FaArrowUp style={{ transform: "rotate(180deg)" }} />
                )}
                {metric.change > 0 ? "+" : ""}
                {metric.change}
                {typeof metric.change === "number" && metric.change % 1 !== 0
                  ? "%"
                  : ""}
              </MetricChange>
            </div>
          ))}
        </div>
      </ChartContainer>

      <ChartContainer>
        <ChartTitle>
          <FaCalendarAlt />
          Recent Activity Summary
        </ChartTitle>
        <Table>
          <thead>
            <TableHeader>Date</TableHeader>
            <TableHeader>Activity</TableHeader>
            <TableHeader>Count</TableHeader>
            <TableHeader>Status</TableHeader>
          </thead>
          <tbody>
            <TableRow>
              <TableCell>{new Date().toLocaleDateString()}</TableCell>
              <TableCell>Person Records Added</TableCell>
              <TableCell>5</TableCell>
              <TableCell>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <FaCheckCircle style={{ color: "#00ff00" }} />
                  <span style={{ color: "#00ff00" }}>Completed</span>
                </div>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                {new Date(Date.now() - 86400000).toLocaleDateString()}
              </TableCell>
              <TableCell>Samples Processed</TableCell>
              <TableCell>23</TableCell>
              <TableCell>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <FaCheckCircle style={{ color: "#00ff00" }} />
                  <span style={{ color: "#00ff00" }}>Completed</span>
                </div>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                {new Date(Date.now() - 172800000).toLocaleDateString()}
              </TableCell>
              <TableCell>AI Matching Operations</TableCell>
              <TableCell>12</TableCell>
              <TableCell>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <FaExclamationTriangle style={{ color: "#ffc107" }} />
                  <span style={{ color: "#ffc107" }}>In Progress</span>
                </div>
              </TableCell>
            </TableRow>
          </tbody>
        </Table>
      </ChartContainer>

      <ChartContainer>
        <ChartTitle>
          <FaArrowUp />
          Usage Statistics
        </ChartTitle>
        <div style={{ marginBottom: "20px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "10px",
            }}
          >
            <span style={{ color: "#00bfff" }}>Daily Active Users</span>
            <span style={{ color: "#00ff00" }}>85%</span>
          </div>
          <ProgressBar>
            <ProgressFill percentage={85} />
          </ProgressBar>
        </div>

        <div style={{ marginBottom: "20px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "10px",
            }}
          >
            <span style={{ color: "#00bfff" }}>System Load</span>
            <span style={{ color: "#00ff00" }}>67%</span>
          </div>
          <ProgressBar>
            <ProgressFill percentage={67} />
          </ProgressBar>
        </div>

        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "10px",
            }}
          >
            <span style={{ color: "#00bfff" }}>Storage Utilization</span>
            <span style={{ color: "#00ff00" }}>42%</span>
          </div>
          <ProgressBar>
            <ProgressFill percentage={42} />
          </ProgressBar>
        </div>
      </ChartContainer>
    </Container>
  );
};

export default AnalyticsSection;
