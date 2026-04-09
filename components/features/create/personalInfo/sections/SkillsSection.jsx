"use client";
import React, { memo } from "react";
import { Lightbulb } from "lucide-react";
import Section from "@/components/ui/Section";
import { Textarea } from "@/components/ui/FormElements";

const SkillsSection = memo(({ list, updateData }) => {
  return (
    <Section icon={Lightbulb} color="#8b5cf6" title="ทักษะความสามารถ / Skills">
      <Textarea 
        label="ลิสต์ทักษะ — คั่นด้วย comma"
        rows={3} 
        value={list || ""}
        placeholder={"e.g. JavaScript, TypeScript, React, Node.js, Python, SQL, Git, Agile, Figma"}
        onChange={(e) => updateData("skills", "list", e.target.value)} 
      />
      <p className="text-[10px] text-gray-400 mt-1.5">
        💡 เรียงจากทักษะที่ถนัดที่สุดไปหาน้อยสุด — บางเทมเพลตจะแสดงเป็น chip tags โดยอัตโนมัติ
      </p>
    </Section>
  );
});

SkillsSection.displayName = "SkillsSection";
export default SkillsSection;
