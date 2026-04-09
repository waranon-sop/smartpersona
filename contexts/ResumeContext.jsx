"use client";
import { createContext, useState, useContext, useCallback } from "react";

const ResumeContext = createContext();

// Default blank entries
const blankExperience    = () => ({ id: Date.now() + Math.random(), position: "", company: "", location: "", startDate: "", endDate: "", isCurrent: false, details: "" });
const blankEducation     = () => ({ id: Date.now() + Math.random(), degree: "", field: "", institution: "", location: "", startYear: "", gradYear: "", gpa: "", activities: "" });
const blankCertification = () => ({ id: Date.now() + Math.random(), name: "", issuer: "", issueDate: "", credentialId: "" });
const blankProject       = () => ({ id: Date.now() + Math.random(), name: "", role: "", tech: "", url: "", description: "" });
const blankLanguage      = () => ({ id: Date.now() + Math.random(), language: "", level: "Professional" });

const blankFactories = {
  experiences:    blankExperience,
  educations:     blankEducation,
  certifications: blankCertification,
  projects:       blankProject,
  languages:      blankLanguage,
};

const defaultData = () => ({
  config:         { template: "classic" },
  personal:       {
    firstName: "", lastName: "", jobTitle: "", email: "", phone: "",
    address: "", nationality: "", dateOfBirth: "",
    linkedin: "", github: "", portfolio: "", profilePic: "",
  },
  summary:        { details: "" },
  experiences:    [blankExperience()],
  educations:     [blankEducation()],
  skills:         { list: "" },
  languages:      [blankLanguage()],
  certifications: [],
  projects:       [],
});

export function ResumeProvider({ children }) {
  const [resumeId, setResumeId] = useState(null);
  const [data, setData] = useState(defaultData());

  // Update plain section (personal, summary, skills, config)
  const updateData = useCallback((section, field, value) => {
    setData((prev) => ({
      ...prev,
      [section]: { ...prev[section], [field]: value },
    }));
  }, []);

  // Update a single field inside an array item by index
  const updateArrayItem = useCallback((section, index, field, value) => {
    setData((prev) => {
      const arr = [...(prev[section] || [])];
      arr[index] = { ...arr[index], [field]: value };
      return { ...prev, [section]: arr };
    });
  }, []);

  // Add a new blank item to an array section
  const addArrayItem = useCallback((section) => {
    const factory = blankFactories[section] || blankExperience;
    setData((prev) => ({
      ...prev,
      [section]: [...(prev[section] || []), factory()],
    }));
  }, []);

  // Remove an item from an array section by index (keep at least 1 for core sections)
  const removeArrayItem = useCallback((section, index) => {
    const coreSections = ["experiences", "educations"];
    setData((prev) => {
      const arr = prev[section] || [];
      if (coreSections.includes(section) && arr.length <= 1) return prev;
      return { ...prev, [section]: arr.filter((_, i) => i !== index) };
    });
  }, []);

  // Load saved data — migrate old single-object format to array format if needed
  const setInitialData = useCallback((newData) => {
    const migrated = { ...defaultData(), ...newData };

    // Migrate legacy experience object → array
    if (newData.experience && !newData.experiences) {
      migrated.experiences = [{ id: Date.now(), ...newData.experience }];
    } else if (!Array.isArray(migrated.experiences) || migrated.experiences.length === 0) {
      migrated.experiences = [blankExperience()];
    }

    // Migrate legacy education object → array
    if (newData.education && !newData.educations) {
      migrated.educations = [{ id: Date.now(), ...newData.education }];
    } else if (!Array.isArray(migrated.educations) || migrated.educations.length === 0) {
      migrated.educations = [blankEducation()];
    }

    // Ensure new optional arrays exist
    if (!Array.isArray(migrated.languages))      migrated.languages      = [blankLanguage()];
    if (!Array.isArray(migrated.certifications)) migrated.certifications = [];
    if (!Array.isArray(migrated.projects))       migrated.projects       = [];

    setData(migrated);
  }, []);

  // Reset context to default blank state
  const resetResume = useCallback(() => {
    setResumeId(null);
    setData(defaultData());
  }, []);

  return (
    <ResumeContext.Provider value={{
      data,
      updateData,
      updateArrayItem,
      addArrayItem,
      removeArrayItem,
      setInitialData,
      resumeId,
      setResumeId,
      resetResume,
    }}>
      {children}
    </ResumeContext.Provider>
  );
}

export function useResume() {
  return useContext(ResumeContext);
}