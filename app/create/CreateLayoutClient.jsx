"use client";
import { usePathname } from "next/navigation";
import { ResumeProvider } from "@/contexts/ResumeContext";
import CreateNavbar from "@/components/create/CreateNavbar";

export default function CreateLayout({ children }) {
  const pathname = usePathname();
  const isDashboard = pathname === "/create/dashboard";

  return (
    <ResumeProvider>
      <div className="bg-gray-50 min-h-screen flex flex-col">
        <CreateNavbar />
        <div className={`flex-1 ${isDashboard ? "pt-8" : ""}`}>
          {children}
        </div>
      </div>
    </ResumeProvider>
  );
}