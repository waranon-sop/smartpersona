"use client";
import React, { memo } from "react";
import { GraduationCap } from "lucide-react";
import Section from "@/components/ui/Section";
import { Input, AddBtn, RemoveBtn } from "@/components/ui/FormElements";

import { SortableList, SortableItem } from "@/components/ui/SortableWrapper";

const EducationSection = memo(({ educations = [], updateArrayItem, addArrayItem, removeArrayItem, reorderArrayItem }) => {
  return (
    <Section icon={GraduationCap} color="#0ea5e9" title="การศึกษา">
      <div className="space-y-4">
        <SortableList items={educations} onReorder={(oldIndex, newIndex) => reorderArrayItem("educations", oldIndex, newIndex)}>
          {educations.map((edu, idx) => (
            <SortableItem key={edu.id} id={edu.id}>
              <div className="border border-sky-100 rounded-xl p-4 bg-sky-50/40 ml-4 lg:ml-0">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-black text-sky-700 bg-sky-100 px-2.5 py-0.5 rounded-full uppercase">ที่ {idx + 1}</span>
                  {educations.length > 1 && <RemoveBtn onClick={() => removeArrayItem("educations", idx)} />}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Input 
                    label="วุฒิการศึกษา / Degree" 
                    placeholder="e.g. Bachelor of Science" 
                    value={edu.degree || ""}
                    onChange={(e) => updateArrayItem("educations", idx, "degree", e.target.value)} 
                  />
                  <Input 
                    label="สาขาวิชา / Major" 
                    placeholder="e.g. Computer Engineering" 
                    value={edu.field || ""}
                    onChange={(e) => updateArrayItem("educations", idx, "field", e.target.value)} 
                  />
                  <div className="md:col-span-2">
                    <Input 
                      label="ชื่อสถาบัน / University" 
                      placeholder="e.g. Chulalongkorn University" 
                      value={edu.institution || ""}
                      onChange={(e) => updateArrayItem("educations", idx, "institution", e.target.value)} 
                    />
                  </div>
                  <Input 
                    label="ปีที่เริ่ม" 
                    placeholder="e.g. 2018" 
                    value={edu.startYear || ""}
                    onChange={(e) => updateArrayItem("educations", idx, "startYear", e.target.value)} 
                  />
                  <Input 
                    label="ปีที่จบ / Expected" 
                    placeholder="e.g. 2022" 
                    value={edu.gradYear || ""}
                    onChange={(e) => updateArrayItem("educations", idx, "gradYear", e.target.value)} 
                  />
                  <Input 
                    label="เกรดเฉลี่ย (GPA)" 
                    placeholder="e.g. 3.65" 
                    value={edu.gpa || ""}
                    onChange={(e) => updateArrayItem("educations", idx, "gpa", e.target.value)} 
                  />
                  <Input 
                    label="กิจกรรม / Honor (ถ้ามี)" 
                    placeholder="e.g. Honor Roll, Student Council" 
                    value={edu.activities || ""}
                    onChange={(e) => updateArrayItem("educations", idx, "activities", e.target.value)} 
                  />
                </div>
              </div>
            </SortableItem>
          ))}
        </SortableList>
        <AddBtn onClick={() => addArrayItem("educations")} label="เพิ่มประวัติการศึกษา" color="#0ea5e9" />
      </div>
    </Section>
  );
});

EducationSection.displayName = "EducationSection";
export default EducationSection;
