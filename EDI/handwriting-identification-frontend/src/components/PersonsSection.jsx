import React, { useState } from "react";
import styled from "styled-components";
import {
  FaUser,
  FaPlus,
  FaSearch,
  FaCheck,
  FaUpload,
  FaEye,
} from "react-icons/fa";
import { createPerson } from "../services/api.js";
import { UploadEvidence } from "./UploadEvidence.jsx";

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
  padding: 15px;
  margin-bottom: 20px;
`;

const SearchInput = styled.input`
  width: 100%;
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(0, 255, 0, 0.3);
  color: #00ff00;
  padding: 10px 15px;
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

const PersonsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
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
  transition: all 0.3s ease;
  cursor: ${(props) => (props.selectable ? "pointer" : "default")};
  position: relative;

  &:hover {
    transform: ${(props) => (props.selectable ? "translateY(-2px)" : "none")};
    box-shadow: 0 5px 15px rgba(0, 255, 0, 0.2);
  }
`;

const PersonHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 15px;
`;

const PersonIcon = styled.div`
  font-size: 2rem;
  color: #00bfff;
  margin-right: 15px;
`;

const PersonInfo = styled.div`
  flex: 1;
`;

const PersonName = styled.h3`
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

const PersonActions = styled.div`
  display: flex;
  gap: 10px;
`;

const ActionButton = styled.button`
  background: rgba(0, 191, 255, 0.1);
  border: 1px solid #00bfff;
  color: #00bfff;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(0, 191, 255, 0.2);
    border-color: #00ff00;
    color: #00ff00;
  }
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

const AddPersonModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
`;

const ModalContent = styled.div`
  background: linear-gradient(
    135deg,
    rgba(20, 20, 20, 0.95),
    rgba(31, 31, 31, 0.95)
  );
  border: 2px solid #00ff00;
  border-radius: 12px;
  padding: 30px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 0 30px rgba(0, 255, 0, 0.3);
`;

const ModalTitle = styled.h3`
  color: #00ff00;
  margin: 0 0 20px 0;
  font-size: 1.5rem;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 2px;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  color: #00bfff;
  margin-bottom: 8px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-size: 12px;
`;

const Input = styled.input`
  width: 100%;
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(0, 255, 0, 0.3);
  color: #00ff00;
  padding: 12px 15px;
  border-radius: 6px;
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

const TextArea = styled.textarea`
  width: 100%;
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(0, 255, 0, 0.3);
  color: #00ff00;
  padding: 12px 15px;
  border-radius: 6px;
  font-size: 14px;
  resize: vertical;
  min-height: 80px;

  &::placeholder {
    color: rgba(0, 255, 0, 0.5);
  }

  &:focus {
    outline: none;
    border-color: #00bfff;
    box-shadow: 0 0 10px rgba(0, 191, 255, 0.3);
  }
`;

const ModalActions = styled.div`
  display: flex;
  gap: 15px;
  justify-content: flex-end;
  margin-top: 30px;
`;

const ModalButton = styled.button`
  padding: 12px 25px;
  border: 2px solid;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-size: 12px;
  transition: all 0.3s ease;
  min-width: 100px;

  &.primary {
    background: rgba(0, 255, 0, 0.1);
    border-color: #00ff00;
    color: #00ff00;

    &:hover {
      background: rgba(0, 255, 0, 0.2);
      border-color: #00bfff;
      color: #00bfff;
    }
  }

  &.secondary {
    background: rgba(255, 68, 68, 0.1);
    border-color: #ff4444;
    color: #ff6666;

    &:hover {
      background: rgba(255, 68, 68, 0.2);
      border-color: #ff6666;
    }
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const PersonsSection = ({
  persons,
  onPersonSelect,
  selectedSuspects,
  currentCase,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedPersonForUpload, setSelectedPersonForUpload] = useState(null);
  const [newPerson, setNewPerson] = useState({
    name: "",
    age: "",
    occupation: "",
    notes: "",
  });

  const filteredPersons = persons.filter((person) =>
    person.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddPerson = async () => {
    try {
      const response = await createPerson({
        name: newPerson.name,
        age: parseInt(newPerson.age) || null,
        occupation: newPerson.occupation || null,
        notes: newPerson.notes || null,
      });

      // Refresh persons list (you might want to pass a refresh function from parent)
      setShowAddModal(false);
      setNewPerson({ name: "", age: "", occupation: "", notes: "" });
    } catch (error) {
      console.error("Error adding person:", error);
    }
  };

  const handlePersonClick = (person) => {
    if (currentCase && onPersonSelect) {
      onPersonSelect(person);
    }
  };

  const isPersonSelected = (person) => {
    return selectedSuspects.some((p) => p.id === person.id);
  };

  return (
    <Container>
      <Header>
        <Title>Person Database</Title>
        <Controls>
          <Button onClick={() => setShowAddModal(true)}>
            <FaPlus /> Add Person
          </Button>
        </Controls>
      </Header>

      <SearchContainer>
        <SearchInput
          type="text"
          placeholder="Search persons..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </SearchContainer>

      {currentCase && (
        <div
          style={{
            background: "rgba(0, 191, 255, 0.1)",
            border: "1px solid #00bfff",
            borderRadius: "8px",
            padding: "15px",
            marginBottom: "20px",
          }}
        >
          <p style={{ color: "#00bfff", margin: 0, fontWeight: "600" }}>
            Case Mode: Select suspects for case "{currentCase.case_name}"
          </p>
        </div>
      )}

      <PersonsGrid>
        {filteredPersons.map((person) => (
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
              <PersonIcon>
                <FaUser />
              </PersonIcon>
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

            <PersonActions>
              <ActionButton
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedPersonForUpload(person);
                  setShowUploadModal(true);
                }}
              >
                <FaUpload /> Upload
              </ActionButton>
              <ActionButton
                onClick={(e) => {
                  e.stopPropagation();
                  // View person details (could open a modal)
                  console.log("View person:", person);
                }}
              >
                <FaEye /> View
              </ActionButton>
            </PersonActions>
          </PersonCard>
        ))}
      </PersonsGrid>

      {showAddModal && (
        <AddPersonModal onClick={() => setShowAddModal(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalTitle>Add New Person</ModalTitle>

            <FormGroup>
              <Label>Name *</Label>
              <Input
                type="text"
                placeholder="Enter full name"
                value={newPerson.name}
                onChange={(e) =>
                  setNewPerson({ ...newPerson, name: e.target.value })
                }
              />
            </FormGroup>

            <FormGroup>
              <Label>Age</Label>
              <Input
                type="number"
                placeholder="Enter age"
                value={newPerson.age}
                onChange={(e) =>
                  setNewPerson({ ...newPerson, age: e.target.value })
                }
              />
            </FormGroup>

            <FormGroup>
              <Label>Occupation</Label>
              <Input
                type="text"
                placeholder="Enter occupation"
                value={newPerson.occupation}
                onChange={(e) =>
                  setNewPerson({ ...newPerson, occupation: e.target.value })
                }
              />
            </FormGroup>

            <FormGroup>
              <Label>Notes</Label>
              <TextArea
                placeholder="Additional notes or information"
                value={newPerson.notes}
                onChange={(e) =>
                  setNewPerson({ ...newPerson, notes: e.target.value })
                }
              />
            </FormGroup>

            <ModalActions>
              <ModalButton
                className="secondary"
                onClick={() => setShowAddModal(false)}
              >
                Cancel
              </ModalButton>
              <ModalButton
                className="primary"
                onClick={handleAddPerson}
                disabled={!newPerson.name.trim()}
              >
                Add Person
              </ModalButton>
            </ModalActions>
          </ModalContent>
        </AddPersonModal>
      )}

      <UploadEvidence
        isOpen={showUploadModal}
        onClose={() => {
          setShowUploadModal(false);
          setSelectedPersonForUpload(null);
        }}
        onUploadComplete={(uploadedSamples) => {
          console.log(
            "Samples uploaded for person:",
            selectedPersonForUpload,
            uploadedSamples
          );
          setShowUploadModal(false);
          setSelectedPersonForUpload(null);
        }}
        personId={selectedPersonForUpload?.id}
      />
    </Container>
  );
};

export default PersonsSection;
