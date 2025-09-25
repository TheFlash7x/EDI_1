import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { FaTimes, FaPlus, FaUpload } from "react-icons/fa";
import { createCase, getPersons, uploadSample } from "../services/api.js";

const ModalOverlay = styled.div`
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
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 0 30px rgba(0, 255, 0, 0.3);
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 15px;
  right: 15px;
  background: transparent;
  border: none;
  color: #ff6666;
  font-size: 20px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    color: #ff4444;
    transform: scale(1.1);
  }
`;

const Title = styled.h2`
  color: #00ff00;
  margin: 0 0 25px 0;
  font-size: 1.8rem;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 2px;
  text-shadow: 0 0 10px #00ff00;
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
  padding: 12px 15px;
  background: rgba(0, 0, 0, 0.5);
  border: 2px solid rgba(0, 255, 0, 0.3);
  border-radius: 6px;
  color: #00ff00;
  font-size: 14px;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #00bfff;
    box-shadow: 0 0 10px rgba(0, 191, 255, 0.3);
  }

  &::placeholder {
    color: rgba(0, 255, 0, 0.5);
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 12px 15px;
  background: rgba(0, 0, 0, 0.5);
  border: 2px solid rgba(0, 255, 0, 0.3);
  border-radius: 6px;
  color: #00ff00;
  font-size: 14px;
  min-height: 80px;
  resize: vertical;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #00bfff;
    box-shadow: 0 0 10px rgba(0, 191, 255, 0.3);
  }

  &::placeholder {
    color: rgba(0, 255, 0, 0.5);
  }
`;

const SuspectsSection = styled.div`
  margin-bottom: 20px;
`;

const SuspectItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  padding: 10px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 6px;
  border: 1px solid rgba(0, 255, 0, 0.2);
`;

const SuspectSelect = styled.select`
  flex: 1;
  padding: 8px 12px;
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(0, 255, 0, 0.3);
  border-radius: 4px;
  color: #00ff00;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: #00bfff;
  }
`;

const RemoveButton = styled.button`
  background: rgba(255, 68, 68, 0.2);
  border: 1px solid #ff4444;
  color: #ff6666;
  padding: 6px 10px;
  border-radius: 4px;
  cursor: pointer;
  margin-left: 10px;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 68, 68, 0.4);
    border-color: #ff6666;
  }
`;

const AddSuspectButton = styled.button`
  background: rgba(0, 255, 0, 0.1);
  border: 1px solid #00ff00;
  color: #00ff00;
  padding: 8px 15px;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(0, 255, 0, 0.2);
    border-color: #00bfff;
  }
`;

const EvidenceSection = styled.div`
  margin-bottom: 20px;
`;

const FileInput = styled.input`
  display: none;
`;

const FileInputLabel = styled.label`
  display: inline-block;
  padding: 12px 20px;
  background: rgba(0, 191, 255, 0.1);
  border: 2px solid #00bfff;
  border-radius: 6px;
  color: #00bfff;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-size: 12px;
  font-weight: 600;

  &:hover {
    background: rgba(0, 191, 255, 0.2);
    border-color: #00ff00;
  }
`;

const FileInfo = styled.div`
  margin-top: 10px;
  color: #00bfff;
  font-size: 14px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 15px;
  justify-content: flex-end;
  margin-top: 30px;
`;

const Button = styled.button`
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

const StatusMessage = styled.div`
  margin-top: 15px;
  padding: 10px;
  border-radius: 6px;
  text-align: center;
  font-weight: 600;

  &.success {
    background: rgba(0, 255, 0, 0.1);
    border: 1px solid #00ff00;
    color: #66ff66;
  }

  &.error {
    background: rgba(255, 68, 68, 0.1);
    border: 1px solid #ff4444;
    color: #ff6666;
  }
`;

const NewCaseModal = ({ isOpen, onClose, onCaseCreated }) => {
  const [formData, setFormData] = useState({
    case_name: "",
    description: "",
    investigator_name: "",
    suspects: [],
    evidence_file: null,
  });
  const [persons, setPersons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    if (isOpen) {
      fetchPersons();
    }
  }, [isOpen]);

  const fetchPersons = async () => {
    try {
      const response = await getPersons();
      setPersons(response.data);
    } catch (error) {
      console.error("Error fetching persons:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddSuspect = () => {
    setFormData((prev) => ({
      ...prev,
      suspects: [...prev.suspects, ""],
    }));
  };

  const handleSuspectChange = (index, value) => {
    setFormData((prev) => ({
      ...prev,
      suspects: prev.suspects.map((suspect, i) =>
        i === index ? value : suspect
      ),
    }));
  };

  const handleRemoveSuspect = (index) => {
    setFormData((prev) => ({
      ...prev,
      suspects: prev.suspects.filter((_, i) => i !== index),
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({
      ...prev,
      evidence_file: file,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      // First upload the evidence sample
      let evidenceSampleId = null;
      if (formData.evidence_file) {
        const uploadResponse = await uploadSample(formData.evidence_file);
        evidenceSampleId = uploadResponse.data.sample_id;
      }

      // Create the case
      const caseData = {
        case_name: formData.case_name,
        description: formData.description,
        investigator_name: formData.investigator_name,
        suspects: formData.suspects.filter((s) => s), // Remove empty suspects
        evidence_sample_id: evidenceSampleId,
      };

      const response = await createCase(caseData);

      setStatus({ type: "success", message: "Case created successfully!" });

      // Reset form
      setFormData({
        case_name: "",
        description: "",
        investigator_name: "",
        suspects: [],
        evidence_file: null,
      });

      // Notify parent component
      if (onCaseCreated) {
        onCaseCreated(response.data);
      }

      // Close modal after a delay
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      console.error("Error creating case:", error);
      setStatus({
        type: "error",
        message: error.response?.data?.detail || "Failed to create case",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose}>
          <FaTimes />
        </CloseButton>

        <Title>Create New Case</Title>

        <form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>Case Name</Label>
            <Input
              type="text"
              name="case_name"
              value={formData.case_name}
              onChange={handleInputChange}
              placeholder="Enter case name"
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>Description</Label>
            <TextArea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter case description"
            />
          </FormGroup>

          <FormGroup>
            <Label>Investigator Name</Label>
            <Input
              type="text"
              name="investigator_name"
              value={formData.investigator_name}
              onChange={handleInputChange}
              placeholder="Enter investigator name"
              required
            />
          </FormGroup>

          <SuspectsSection>
            <Label>Suspects</Label>
            {formData.suspects.map((suspect, index) => (
              <SuspectItem key={index}>
                <SuspectSelect
                  value={suspect}
                  onChange={(e) => handleSuspectChange(index, e.target.value)}
                >
                  <option value="">Select a person</option>
                  {persons.map((person) => (
                    <option key={person.person_id} value={person.person_id}>
                      {person.name} (ID: {person.gov_id})
                    </option>
                  ))}
                </SuspectSelect>
                <RemoveButton
                  type="button"
                  onClick={() => handleRemoveSuspect(index)}
                >
                  Remove
                </RemoveButton>
              </SuspectItem>
            ))}
            <AddSuspectButton type="button" onClick={handleAddSuspect}>
              <FaPlus /> Add Suspect
            </AddSuspectButton>
          </SuspectsSection>

          <EvidenceSection>
            <Label>Evidence Sample</Label>
            <FileInput
              type="file"
              id="evidence-file"
              accept="image/*"
              onChange={handleFileChange}
            />
            <FileInputLabel htmlFor="evidence-file">
              <FaUpload style={{ marginRight: "8px" }} />
              Choose Evidence File
            </FileInputLabel>
            {formData.evidence_file && (
              <FileInfo>Selected: {formData.evidence_file.name}</FileInfo>
            )}
          </EvidenceSection>

          <ButtonGroup>
            <Button type="button" className="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="primary" disabled={loading}>
              {loading ? "Creating..." : "Create Case"}
            </Button>
          </ButtonGroup>
        </form>

        {status && (
          <StatusMessage className={status.type}>
            {status.message}
          </StatusMessage>
        )}
      </ModalContent>
    </ModalOverlay>
  );
};

export { NewCaseModal };
