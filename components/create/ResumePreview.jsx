"use client";
import { useDeferredValue } from "react";
import { useResume } from "@/contexts/ResumeContext";
import ResumeRenderer from "@/components/features/resume/ResumeRenderer";

export default function ResumePreview() {
  const { data } = useResume();
  // ชะลอการ render preview — ฟอร์มจะไม่หน่วงแม้ preview ยังค้างอยู่
  const deferredData = useDeferredValue(data);
  return <ResumeRenderer data={deferredData} />;
}