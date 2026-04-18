"use client";
import React, { memo } from "react";
import { Globe, Award, FolderGit2 } from "lucide-react";
import Section from "@/components/ui/Section";
import { Input, Textarea, AddBtn, RemoveBtn } from "@/components/ui/FormElements";
import { SortableList, SortableItem } from "@/components/ui/SortableWrapper";

const PROFICIENCY = ["Native", "Fluent", "Professional", "Conversational", "Basic"];

export const LanguageSection = memo(({ languages = [], updateArrayItem, addArrayItem, removeArrayItem, reorderArrayItem }) => (
  <Section icon={Globe} color="#06b6d4" title="ภาษา / Languages" defaultOpen={false}>
    <div className="space-y-3">
      <SortableList items={languages} onReorder={(oldIndex, newIndex) => reorderArrayItem("languages", oldIndex, newIndex)}>
        {languages.map((lang, idx) => (
          <SortableItem key={lang.id} id={lang.id}>
            <div className="flex items-center gap-3 ml-4 lg:ml-0 bg-white p-2 rounded-xl border border-gray-100 shadow-sm">
              <Input 
                placeholder="e.g. English" 
                value={lang.language || ""}
                onChange={(e) => updateArrayItem("languages", idx, "language", e.target.value)} 
                className="flex-1"
              />
              <select 
                value={lang.level || "Professional"}
                className="w-1/2 border border-gray-200 bg-white rounded-xl px-3.5 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                onChange={(e) => updateArrayItem("languages", idx, "level", e.target.value)}
              >
                {PROFICIENCY.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
              <RemoveBtn onClick={() => removeArrayItem("languages", idx)} />
            </div>
          </SortableItem>
        ))}
      </SortableList>
      <AddBtn onClick={() => addArrayItem("languages")} label="เพิ่มภาษา" color="#06b6d4" />
    </div>
  </Section>
));

export const CertificationSection = memo(({ certifications = [], updateArrayItem, addArrayItem, removeArrayItem, reorderArrayItem }) => (
  <Section icon={Award} color="#f59e0b" title="ใบรับรอง / Certifications" defaultOpen={false}>
    <div className="space-y-4">
      {certifications.length === 0 && (
        <p className="text-xs text-gray-400 italic">เช่น AWS Certified, Google Analytics, TOEIC, etc.</p>
      )}
      <SortableList items={certifications} onReorder={(oldIndex, newIndex) => reorderArrayItem("certifications", oldIndex, newIndex)}>
        {certifications.map((cert, idx) => (
          <SortableItem key={cert.id} id={cert.id}>
            <div className="border border-amber-100 rounded-xl p-4 bg-amber-50/40 ml-4 lg:ml-0">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-black text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-full uppercase">ใบรับรองที่ {idx + 1}</span>
                <RemoveBtn onClick={() => removeArrayItem("certifications", idx)} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="md:col-span-2">
                  <Input 
                    label="ชื่อใบรับรอง" 
                    placeholder="e.g. AWS Solutions Architect Associate" 
                    value={cert.name || ""}
                    onChange={(e) => updateArrayItem("certifications", idx, "name", e.target.value)} 
                  />
                </div>
                <Input 
                  label="องค์กรที่ออกใบ" 
                  placeholder="e.g. Amazon Web Services" 
                  value={cert.issuer || ""}
                  onChange={(e) => updateArrayItem("certifications", idx, "issuer", e.target.value)} 
                />
                <Input 
                  label="วันที่ได้รับ" 
                  type="month" 
                  value={cert.issueDate || ""}
                  onChange={(e) => updateArrayItem("certifications", idx, "issueDate", e.target.value)} 
                />
                <div className="md:col-span-2">
                  <Input 
                    label="Credential ID (ถ้ามี)" 
                    placeholder="e.g. ABC123XYZ" 
                    value={cert.credentialId || ""}
                    onChange={(e) => updateArrayItem("certifications", idx, "credentialId", e.target.value)} 
                  />
                </div>
              </div>
            </div>
          </SortableItem>
        ))}
      </SortableList>
      <AddBtn onClick={() => addArrayItem("certifications")} label="เพิ่มใบรับรอง" color="#f59e0b" />
    </div>
  </Section>
));

export const ProjectSection = memo(({ projects = [], updateArrayItem, addArrayItem, removeArrayItem, reorderArrayItem }) => (
  <Section icon={FolderGit2} color="#ec4899" title="โปรเจกต์ / Projects" defaultOpen={false}>
    <div className="space-y-4">
      {projects.length === 0 && (
        <p className="text-xs text-gray-400 italic">เพิ่มโปรเจกต์ที่ภูมิใจ — side projects, open-source, หรืองาน freelance</p>
      )}
      <SortableList items={projects} onReorder={(oldIndex, newIndex) => reorderArrayItem("projects", oldIndex, newIndex)}>
        {projects.map((proj, idx) => (
          <SortableItem key={proj.id} id={proj.id}>
            <div className="border border-pink-100 rounded-xl p-4 bg-pink-50/40 ml-4 lg:ml-0">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-black text-pink-700 bg-pink-100 px-2.5 py-0.5 rounded-full uppercase">โปรเจกต์ที่ {idx + 1}</span>
                <RemoveBtn onClick={() => removeArrayItem("projects", idx)} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Input 
                  label="ชื่อโปรเจกต์" 
                  placeholder="e.g. SmartPersona Resume Builder" 
                  value={proj.name || ""}
                  onChange={(e) => updateArrayItem("projects", idx, "name", e.target.value)} 
                />
                <Input 
                  label="บทบาทของคุณ" 
                  placeholder="e.g. Lead Developer" 
                  value={proj.role || ""}
                  onChange={(e) => updateArrayItem("projects", idx, "role", e.target.value)} 
                />
                <Input 
                  label="เทคโนโลยีที่ใช้" 
                  placeholder="e.g. React, Next.js, MySQL" 
                  value={proj.tech || ""}
                  onChange={(e) => updateArrayItem("projects", idx, "tech", e.target.value)} 
                />
                <Input 
                  label="URL / GitHub Link" 
                  type="url" 
                  placeholder="https://github.com/..." 
                  value={proj.url || ""}
                  onChange={(e) => updateArrayItem("projects", idx, "url", e.target.value)} 
                />
                <div className="md:col-span-2">
                  <Textarea 
                    label="รายละเอียด" 
                    rows={3} 
                    value={proj.description || ""}
                    placeholder={"e.g. A full-stack resume builder with 7 professional templates, PDF export, and shareable public links. Built for 50+ active users."}
                    onChange={(e) => updateArrayItem("projects", idx, "description", e.target.value)} 
                  />
                </div>
              </div>
            </div>
          </SortableItem>
        ))}
      </SortableList>
      <AddBtn onClick={() => addArrayItem("projects")} label="เพิ่มโปรเจกต์" color="#ec4899" />
    </div>
  </Section>
));
LanguageSection.displayName = "LanguageSection";
CertificationSection.displayName = "CertificationSection";
ProjectSection.displayName = "ProjectSection";
