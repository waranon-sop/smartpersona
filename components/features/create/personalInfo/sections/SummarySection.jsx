"use client";
import React, { memo } from "react";
import { Lightbulb } from "lucide-react";
import Section from "@/components/ui/Section";
import { Textarea } from "@/components/ui/FormElements";

const SummarySection = memo(({ details, updateData }) => {
  return (
    <Section icon={Lightbulb} color="#f59e0b" title="Professional Summary">
      <Textarea 
        label="แนะนำตัวสั้นๆ 2–4 ประโยค (สิ่งที่คุณเป็น + ประสบการณ์ + เป้าหมาย)"
        rows={4} 
        value={details || ""}
        placeholder={`e.g. Results-driven Software Engineer with 5+ years of experience building scalable web applications. Passionate about clean code and user-centric design. Seeking a senior role at a growth-stage company.`}
        onChange={(e) => updateData("summary", "details", e.target.value)} 
      />
      <p className="text-[10px] text-gray-400 mt-1.5">
        💡 เขียนเป็นภาษาอังกฤษเพื่อให้ HR ต่างชาติอ่านได้ หรือจะใช้ภาษาไทยก็ได้
      </p>
    </Section>
  );
});

SummarySection.displayName = "SummarySection";
export default SummarySection;
