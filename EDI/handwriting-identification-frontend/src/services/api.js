import axios from "axios";

const API_BASE_URL = "http://localhost:5501"; // Backend URL

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Persons
export const getPersons = () => api.get("/persons");
export const createPerson = (person) => api.post("/persons", person);
export const getPerson = (personId) => api.get(`/persons/${personId}`);

// Handwriting Samples
export const uploadSample = (file, personId = null, caseId = null) => {
  const formData = new FormData();
  formData.append("file", file);
  if (personId) formData.append("person_id", personId);
  if (caseId) formData.append("case_id", caseId);

  return api.post("/samples/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getSample = (sampleId) => api.get(`/samples/${sampleId}`);

// Cases
export const createCase = (caseData) => api.post("/cases", caseData);
export const getCase = (caseId) => api.get(`/cases/${caseId}`);

// Matching
export const matchSamples = (evidenceSampleId, suspectIds) =>
  api.post("/matching/match", {
    evidence_sample_id: evidenceSampleId,
    suspect_ids: suspectIds,
  });

// Root endpoint
export const getRoot = () => api.get("/");

export default api;
