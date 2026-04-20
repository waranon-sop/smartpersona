"use client";

import { useState, useEffect } from "react";
import { Copy, Trash2, Eye, Check, Loader2, Share2 } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function DashboardClient({ resumeId, accentColor = "#667eea" }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDuplicating, setIsDuplicating] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [isPublic, setIsPublic] = useState(false);
  const router = useRouter();

  // Check if resume is public on mount
  useEffect(() => {
    const checkPublicStatus = async () => {
      try {
        const res = await fetch(`/api/resume/publish?resumeId=${resumeId}`);
        if (res.ok) {
          const data = await res.json();
          setIsPublic(data.isPublic);
        }
      } catch (err) {
        console.error("Error checking public status:", err);
      }
    };
    checkPublicStatus();
  }, [resumeId]);

  const handleCopyLink = () => {
    const url = `${window.location.origin}/resume/${resumeId}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const handleDelete = async () => {
    if (!deleteConfirm) {
      setDeleteConfirm(true);
      setTimeout(() => setDeleteConfirm(false), 3000);
      return;
    }
    setIsDeleting(true);
    setDeleteConfirm(false);
    try {
      const res = await fetch(`/api/resume/delete?id=${resumeId}`, { method: "DELETE" });
      if (res.ok) router.refresh();
    } catch (err) {
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDuplicate = async () => {
    setIsDuplicating(true);
    try {
      const res = await fetch(`/api/resume/duplicate?id=${resumeId}`, { method: "POST" });
      if (res.ok) router.refresh();
    } catch (err) {
      console.error(err);
    } finally {
      setIsDuplicating(false);
    }
  };

  const handlePublishToggle = async () => {
    setIsPublishing(true);
    try {
      if (isPublic) {
        // Unpublish
        const res = await fetch(`/api/resume/publish`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ resumeId }),
        });
        if (res.ok) {
          setIsPublic(false);
          toast.success("ยกเลิกการเผยแพร่ Resume เรียบร้อย");
        } else {
          toast.error("เกิดข้อผิดพลาดในการยกเลิก");
        }
      } else {
        // Publish
        const res = await fetch(`/api/resume/publish`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ resumeId }),
        });
        if (res.ok) {
          setIsPublic(true);
          toast.success("เผยแพร่ Resume เรียบร้อย! คนอื่นสามารถค้นหา Resume นี้ได้");
        } else {
          const data = await res.json();
          toast.error(data.message || "เกิดข้อผิดพลาดในการเผยแพร่");
        }
      }
    } catch (err) {
      console.error(err);
      toast.error("เกิดข้อผิดพลาด");
    } finally {
      setIsPublishing(false);
    }
  };


  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex items-center gap-2">
        <button
          onClick={handlePublishToggle}
          disabled={isPublishing}
          title={isPublic ? "ยกเลิกการเผยแพร่" : "เผยแพร่ Resume"}
          className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 disabled:opacity-50"
          style={{
            background: isPublic ? "#10b98120" : "rgba(99,102,241,0.12)",
            color: isPublic ? "#059669" : accentColor,
            border: isPublic ? "1px solid #10b98140" : `1px solid ${accentColor}30`,
          }}
        >
          {isPublishing ? <Loader2 size={14} className="animate-spin" /> : <Eye size={16} />}
        </button>

        <button
          onClick={handleDuplicate}
          disabled={isDuplicating}
          title="คัดลอกเรซูเม่"
          className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 disabled:opacity-50"
          style={{ background: "rgba(99,102,241,0.12)", color: accentColor, border: `1px solid ${accentColor}30` }}
        >
          {isDuplicating ? <Loader2 size={14} className="animate-spin" /> : <Copy size={16} />}
        </button>

        <button
          onClick={handleDelete}
          disabled={isDeleting}
          title={deleteConfirm ? "คลิกอีกครั้งเพื่อยืนยันการลบ" : "ลบเรซูเม่"}
          className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 disabled:opacity-50"
          style={deleteConfirm ? { background: "#ef4444", color: "#ffffff", border: "1px solid rgba(239,68,68,0.35)" } : { background: "rgba(0,0,0,0.05)", color: "#6b7280", border: "1px solid rgba(0,0,0,0.08)" }}
        >
          {isDeleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={16} />}
        </button>
      </div>

      <button
        onClick={handleCopyLink}
        title="คัดลอกลิงก์แชร์"
        className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95"
        style={{
          background: copied ? "#10b98120" : "rgba(99,102,241,0.12)",
          color: copied ? "#059669" : accentColor,
          border: copied ? "1px solid #10b98140" : `1px solid ${accentColor}30`,
        }}
      >
        {copied ? <Check size={16} /> : <Share2 size={16} />}
      </button>
    </div>
  );
}
