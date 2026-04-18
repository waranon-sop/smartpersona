"use client";
import React, { memo } from "react";
import { Briefcase } from "lucide-react";
import Section from "@/components/ui/Section";
import { Input, Textarea, AddBtn, RemoveBtn, Lbl } from "@/components/ui/FormElements";

import { SortableList, SortableItem } from "@/components/ui/SortableWrapper";

const ExperienceSection = memo(({ experiences = [], updateArrayItem, addArrayItem, removeArrayItem, reorderArrayItem }) => {
  return (
    <Section icon={Briefcase} color="#10b981" title="ประสบการณ์ทำงาน">
      <div className="space-y-4">
        <SortableList items={experiences} onReorder={(oldIndex, newIndex) => reorderArrayItem("experiences", oldIndex, newIndex)}>
          {experiences.map((exp, idx) => (
            <SortableItem key={exp.id} id={exp.id}>
              <div className="border border-emerald-100 rounded-xl p-4 bg-emerald-50/40 ml-4 lg:ml-0">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-black text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full uppercase">
                    ประสบการณ์ที่ {idx + 1}
                  </span>
                  {experiences.length > 1 && (
                    <RemoveBtn onClick={() => removeArrayItem("experiences", idx)} />
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="md:col-span-2">
                    <Input 
                      label="ตำแหน่งงาน / Job Title" 
                      placeholder="e.g. Frontend Developer" 
                      value={exp.position || ""}
                      onChange={(e) => updateArrayItem("experiences", idx, "position", e.target.value)} 
                    />
                  </div>
                  <Input 
                    label="ชื่อบริษัท" 
                    placeholder="e.g. ABC Co., Ltd." 
                    value={exp.company || ""}
                    onChange={(e) => updateArrayItem("experiences", idx, "company", e.target.value)} 
                  />
                  <Input 
                    label="สถานที่" 
                    placeholder="e.g. Bangkok / Remote" 
                    value={exp.location || ""}
                    onChange={(e) => updateArrayItem("experiences", idx, "location", e.target.value)} 
                  />
                  <Input 
                    label="เริ่มงาน" 
                    type="month" 
                    value={exp.startDate || ""}
                    onChange={(e) => updateArrayItem("experiences", idx, "startDate", e.target.value)} 
                  />
                  <Input 
                    label="สิ้นสุด" 
                    type="month" 
                    value={exp.endDate || ""} 
                    disabled={exp.isCurrent}
                    className="disabled:bg-gray-50 disabled:text-gray-400"
                    onChange={(e) => updateArrayItem("experiences", idx, "endDate", e.target.value)} 
                  />
                  <div className="md:col-span-2">
                    <label className="flex items-center gap-2 cursor-pointer select-none mb-2">
                      <input 
                        type="checkbox" 
                        checked={exp.isCurrent || false}
                        className="w-4 h-4 accent-emerald-600"
                        onChange={(e) => {
                          updateArrayItem("experiences", idx, "isCurrent", e.target.checked);
                          if (e.target.checked) updateArrayItem("experiences", idx, "endDate", "");
                        }} 
                      />
                      <span className="text-xs font-bold text-gray-600">ยังทำงานอยู่ที่นี่ (Present)</span>
                    </label>
                  </div>
                  <div className="md:col-span-2">
                    <Textarea 
                      label="รายละเอียดงาน / Key Achievements" 
                      rows={4} 
                      value={exp.details || ""}
                      placeholder={"• Developed and maintained RESTful APIs serving 100K+ users\n• Reduced page load time by 40% through code optimization\n• Led a team of 3 to deliver project 2 weeks ahead of schedule"}
                      onChange={(e) => updateArrayItem("experiences", idx, "details", e.target.value)} 
                    />
                    <p className="text-[10px] text-gray-400 mt-1">💡 ใช้ bullet ขึ้นต้นแต่ละบรรทัด และเน้นตัวเลขผลลัพธ์เสมอ</p>
                  </div>
                </div>
              </div>
            </SortableItem>
          ))}
        </SortableList>
        <AddBtn onClick={() => addArrayItem("experiences")} label="เพิ่มประสบการณ์ทำงาน" color="#10b981" />
      </div>
    </Section>
  );
});

ExperienceSection.displayName = "ExperienceSection";
export default ExperienceSection;
