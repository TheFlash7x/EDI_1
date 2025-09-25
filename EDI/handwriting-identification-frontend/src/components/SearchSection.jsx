import React, { useState } from "react";
import styled from "styled-components";
import { FaSearch, FaFilter, FaDownload, FaCheck } from "react-icons/fa";

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

const SearchContainer = styled.div`
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(0, 255, 0, 0.3);
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
`;

const SearchRow = styled.div`
  display: flex;
  gap: 15px;
  align-items: center;
  margin-bottom: 15px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const SearchInput = styled.input`
  flex: 1;
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(0, 255, 0, 0.3);
  color: #00ff00;
  padding: 12px 15px;
  border-radius: 4px;
  font-size: 14px;

  &::placeholder {
    color: rgba(0, 255, 0, 0.5);
  }

  &:focus {
    outline: none;
    border-color: #00bfff;
    box-shadow: 0 0 10px rgba(0, 191, 255, 0.3);
  }
`;

const Select = styled.select`
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(0, 255, 0, 0.3);
  color: #00ff00;
  padding: 12px 15px;
  border-radius: 4px;
  font-size: 14px;
  min-width: 150px;

  &:focus {
    outline: none;
    border-color: #00bfff;
    box-shadow: 0 0 10px rgba(0, 191, 255, 0.3);
  }

  option {
    background: rgba(0, 0, 0, 0.9);
    color: #00ff00;
  }
`;

const SearchButton = styled.button`
  background: linear-gradient(
    135deg,
    rgba(0, 255, 0, 0.1),
    rgba(0, 191, 255, 0.1)
  );
  border: 2px solid #00bfff;
  color: #00bfff;
  padding: 12px 25px;
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
    background: linear-gradient(
      135deg,
      rgba(0, 191, 255, 0.2),
      rgba(0, 255, 0, 0.2)
    );
    border-color: #00ff00;
    color: #00ff00;
  }
`;

const ResultsContainer = styled.div`
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(0, 255, 0, 0.3);
  border-radius: 8px;
  padding: 20px;
`;

const ResultsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const ResultsTitle = styled.h3`
  color: #00ff00;
  margin: 0;
  font-size: 1.4rem;
  text-transform: uppercase;
  letter-spacing: 2px;
`;

const ResultsCount = styled.span`
  color: #00bfff;
  font-size: 14px;
  opacity: 0.8;
`;

const PersonCard = styled.div`
  background: ${(props) =>
    props.selected
      ? "linear-gradient(135deg, rgba(0, 255, 0, 0.1), rgba(0, 191, 255, 0.1))"
      : "linear-gradient(135deg, rgba(20, 20, 20, 0.8), rgba(31, 31, 31, 0.8))"};
  border: 2px solid
    ${(props) => (props.selected ? "#00ff00" : "rgba(0, 255, 0, 0.3)")};
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 15px;
  transition: all 0.3s ease;
  cursor: ${(props) => (props.selectable ? "pointer" : "default")};
  position: relative;

  &:hover {
    transform: ${(props) => (props.selectable ? "translateY(-2px)" : "none")};
    box-shadow: 0 5px 15px rgba(0, 255, 0, 0.2);
  }

  &:last-child {
    margin-bottom: 0;
  }
`;

const PersonHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 15px;
`;

const PersonInfo = styled.div`
  flex: 1;
`;

const PersonName = styled.h4`
  color: #00ff00;
  margin: 0 0 5px 0;
  font-size: 1.2rem;
  font-weight: 600;
`;

const PersonDetails = styled.p`
  color: rgba(0, 255, 0, 0.7);
  margin: 0 0 10px 0;
  font-size: 14px;
`;

const PersonStats = styled.div`
  display: flex;
  gap: 15px;
  margin-bottom: 15px;
`;

const Stat = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StatValue = styled.span`
  color: #00bfff;
  font-weight: 600;
  font-size: 16px;
`;

const StatLabel = styled.span`
  color: rgba(0, 255, 0, 0.6);
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const SelectionIndicator = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: ${(props) =>
    props.selected ? "#00ff00" : "rgba(0, 255, 0, 0.2)"};
  border: 2px solid
    ${(props) => (props.selected ? "#00ff00" : "rgba(0, 255, 0, 0.5)")};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(props) => (props.selected ? "#000" : "rgba(0, 255, 0, 0.5)")};
  font-size: 12px;
`;

const NoResults = styled.div`
  text-align: center;
  color: rgba(0, 255, 0, 0.6);
  font-size: 16px;
  padding: 40px 20px;
`;

const SearchSection = ({
  persons,
  currentCase,
  onPersonSelect,
  selectedSuspects,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState("name");
  const [ageFilter, setAgeFilter] = useState("");
  const [occupationFilter, setOccupationFilter] = useState("");
  const [results, setResults] = useState([]);

  const handleSearch = () => {
    let filteredResults = [...persons];

    // Apply search term filter
    if (searchTerm.trim()) {
      switch (searchType) {
        case "name":
          filteredResults = filteredResults.filter((person) =>
            person.name.toLowerCase().includes(searchTerm.toLowerCase())
          );
          break;
        case "occupation":
          filteredResults = filteredResults.filter((person) =>
            person.occupation?.toLowerCase().includes(searchTerm.toLowerCase())
          );
          break;
        case "notes":
          filteredResults = filteredResults.filter((person) =>
            person.notes?.toLowerCase().includes(searchTerm.toLowerCase())
          );
          break;
        default:
          break;
      }
    }

    // Apply age filter
    if (ageFilter) {
      const age = parseInt(ageFilter);
      if (!isNaN(age)) {
        filteredResults = filteredResults.filter(
          (person) => person.age === age
        );
      }
    }

    // Apply occupation filter
    if (occupationFilter) {
      filteredResults = filteredResults.filter((person) =>
        person.occupation
          ?.toLowerCase()
          .includes(occupationFilter.toLowerCase())
      );
    }

    setResults(filteredResults);
  };

  const handlePersonClick = (person) => {
    if (currentCase && onPersonSelect) {
      onPersonSelect(person);
    }
  };

  const isPersonSelected = (person) => {
    return selectedSuspects.some((p) => p.id === person.id);
  };

  const handleExport = () => {
    // Export search results to CSV
    const csvContent = [
      ["Name", "Age", "Occupation", "Notes", "Samples", "Cases"],
      ...results.map((person) => [
        person.name,
        person.age || "",
        person.occupation || "",
        person.notes || "",
        person.sample_count || 0,
        person.case_count || 0,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "search_results.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <Container>
      <Header>
        <Title>Advanced Search</Title>
        <Controls>
          <Button
            className="secondary"
            onClick={handleExport}
            disabled={results.length === 0}
          >
            <FaDownload /> Export Results
          </Button>
        </Controls>
      </Header>

      <SearchContainer>
        <SearchRow>
          <SearchInput
            type="text"
            placeholder={`Search by ${searchType}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Select
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
          >
            <option value="name">Name</option>
            <option value="occupation">Occupation</option>
            <option value="notes">Notes</option>
          </Select>
          <SearchButton onClick={handleSearch}>
            <FaSearch /> Search
          </SearchButton>
        </SearchRow>

        <SearchRow>
          <Select
            value={ageFilter}
            onChange={(e) => setAgeFilter(e.target.value)}
          >
            <option value="">Any Age</option>
            <option value="18">18-25</option>
            <option value="26">26-35</option>
            <option value="36">36-45</option>
            <option value="46">46-55</option>
            <option value="56">56+</option>
          </Select>
          <SearchInput
            type="text"
            placeholder="Filter by occupation..."
            value={occupationFilter}
            onChange={(e) => setOccupationFilter(e.target.value)}
          />
        </SearchRow>
      </SearchContainer>

      <ResultsContainer>
        <ResultsHeader>
          <ResultsTitle>Search Results</ResultsTitle>
          <ResultsCount>
            {results.length > 0
              ? `${results.length} result(s) found`
              : "No search performed"}
          </ResultsCount>
        </ResultsHeader>

        {results.length === 0 ? (
          <NoResults>
            {searchTerm || ageFilter || occupationFilter
              ? "No persons match your search criteria"
              : "Enter search criteria and click Search to find persons"}
          </NoResults>
        ) : (
          results.map((person) => (
            <PersonCard
              key={person.id}
              selected={isPersonSelected(person)}
              selectable={!!currentCase}
              onClick={() => handlePersonClick(person)}
            >
              {currentCase && (
                <SelectionIndicator selected={isPersonSelected(person)}>
                  {isPersonSelected(person) && <FaCheck />}
                </SelectionIndicator>
              )}

              <PersonHeader>
                <PersonInfo>
                  <PersonName>{person.name}</PersonName>
                  <PersonDetails>
                    {person.age && `${person.age} years old`}
                    {person.occupation && ` • ${person.occupation}`}
                  </PersonDetails>
                </PersonInfo>
              </PersonHeader>

              <PersonStats>
                <Stat>
                  <StatValue>{person.sample_count || 0}</StatValue>
                  <StatLabel>Samples</StatLabel>
                </Stat>
                <Stat>
                  <StatValue>{person.case_count || 0}</StatValue>
                  <StatLabel>Cases</StatLabel>
                </Stat>
              </PersonStats>
            </PersonCard>
          ))
        )}
      </ResultsContainer>
    </Container>
  );
};

export default SearchSection;
