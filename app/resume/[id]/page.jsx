"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { useReactToPrint } from "react-to-print";
import ResumeRenderer from "@/components/features/resume/ResumeRenderer";
import {
  incrementResumeView,
  incrementResumeDownload,
} from "@/app/actions/statsActions";
import Link from "next/link";
import Navbar from "@/components/navbar/page";

export default function PublicResumePage() {
  const params = useParams();
  const resumeId = params?.id;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const resumeRef = useRef(null);

  useEffect(() => {
    if (!resumeId) return;

    const fetchResume = async () => {
      try {
        const res = await fetch(`/api/resume/public?id=${resumeId}`);
        if (!res.ok) {
          if (res.status === 404) setError("ไม่พบ Resume นี้ในระบบ");
          else setError("เกิดข้อผิดพลาดในการโหลดข้อมูล");
          return;
        }
        const json = await res.json();

        const loadedData = json.data;
        if (loadedData.experience && !loadedData.experiences) {
          loadedData.experiences = [
            { id: Date.now(), ...loadedData.experience },
          ];
          delete loadedData.experience;
        }
        if (loadedData.education && !loadedData.educations) {
          loadedData.educations = [{ id: Date.now(), ...loadedData.education }];
          delete loadedData.education;
        }

        setData(loadedData);
        incrementResumeView(resumeId).catch(console.error);
      } catch (err) {
        setError("ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้");
      } finally {
        setLoading(false);
      }
    };
    fetchResume();
  }, [resumeId]);

  const handlePrintTrigger = useReactToPrint({
    contentRef: resumeRef,
    documentTitle: data?.personal?.firstName
      ? `${data.personal.firstName}_Resume`
      : "Resume",
  });

  const handlePrint = async () => {
    handlePrintTrigger();
    if (resumeId) {
      await incrementResumeDownload(resumeId).catch(console.error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center font-sans">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-600 font-medium tracking-wide">
          กำลังโหลด Resume...
        </p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center font-sans">
        <div className="bg-white p-8 rounded-2xl shadow-sm text-center max-w-md w-full border border-gray-200">
          <div className="text-red-500 text-6xl mb-4">😕</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Oops!</h1>
          <p className="text-gray-600 mb-6">
            {error || "ข้อมูลพังหรือไม่พร้อมใช้งาน"}
          </p>
          <Link
            href="/"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
          >
            กลับไปหน้าหลัก
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      {/* Top Navbar */}
      <div className="print:hidden">
        <Navbar />
      </div>

      {/* Resume Container */}
      <main className="py-10 px-4 flex flex-col items-center print:p-0">
        
        {/* Toolbar */}
        <div className="w-[794px] flex justify-end mb-4 print:hidden max-w-full">
          <button
            onClick={handlePrint}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-5 rounded-lg shadow-sm transition-all flex items-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
            ดาวน์โหลด PDF
          </button>
        </div>
        <div
          ref={resumeRef}
          className="w-[794px] min-h-[1123px] bg-white shadow-xl print:shadow-none"
        >
          <ResumeRenderer data={data} />
        </div>
      </main>
    </div>
  );
}
