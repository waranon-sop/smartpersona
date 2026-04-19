"use client";
import { createContext, useState, useContext, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";

const ResumeContext = createContext();

// Default blank entries
const blankExperience    = () => ({ id: uuidv4(), position: "", company: "", location: "", startDate: "", endDate: "", isCurrent: false, details: "" });
const blankEducation     = () => ({ id: uuidv4(), degree: "", field: "", institution: "", location: "", startYear: "", gradYear: "", gpa: "", activities: "" });
const blankCertification = () => ({ id: uuidv4(), name: "", issuer: "", issueDate: "", credentialId: "" });
const blankProject       = () => ({ id: uuidv4(), name: "", role: "", tech: "", url: "", description: "" });
const blankLanguage      = () => ({ id: uuidv4(), language: "", level: "Professional" });

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
  const [lang, setLang] = useState("th");

  const toggleLang = useCallback(() => {
    setLang((prev) => (prev === "th" ? "en" : "th"));
  }, []);

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

  // Reorder an item in an array section
  const reorderArrayItem = useCallback((section, oldIndex, newIndex) => {
    setData((prev) => {
      const arr = [...(prev[section] || [])];
      if (oldIndex < 0 || oldIndex >= arr.length || newIndex < 0 || newIndex >= arr.length) return prev;
      const [movedItem] = arr.splice(oldIndex, 1);
      arr.splice(newIndex, 0, movedItem);
      return { ...prev, [section]: arr };
    });
  }, []);

  // Load saved data — migrate old single-object format to array format if needed
  const setInitialData = useCallback((newData) => {
    const migrated = { ...defaultData(), ...newData };

    // Migrate legacy experience object → array
    if (newData.experience && !newData.experiences) {
      migrated.experiences = [{ id: uuidv4(), ...newData.experience }];
    } else if (!Array.isArray(migrated.experiences) || migrated.experiences.length === 0) {
      migrated.experiences = [blankExperience()];
    }

    // Migrate legacy education object → array
    if (newData.education && !newData.educations) {
      migrated.educations = [{ id: uuidv4(), ...newData.education }];
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
      reorderArrayItem,
      setInitialData,
      resumeId,
      setResumeId,
      resetResume,
      lang,
      toggleLang,
    }}>
      {children}
    </ResumeContext.Provider>
  );
}

export function useResume() {
  return useContext(ResumeContext);
}