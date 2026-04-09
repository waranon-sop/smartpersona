"use client";
import { ResumeProvider } from "@/contexts/ResumeContext";
import CreateNavbar from "@/components/create/CreateNavbar";

export default function CreateLayout({ children }) {
  return (
    <ResumeProvider>
      <div className="bg-gray-50 min-h-screen flex flex-col">
        <CreateNavbar />
        <div className="flex-1">
          {children}
        </div>
      </div>
    </ResumeProvider>
  );
}