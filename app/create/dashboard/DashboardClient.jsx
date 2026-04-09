"use client";

import { useState } from "react";
import { Copy, Trash2, ExternalLink, Check, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function DashboardClient({ resumeId, accentColor = "#667eea" }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDuplicating, setIsDuplicating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const router = useRouter();

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

  return (
    <div className="flex items-center justify-between gap-2">
      {/* Icon Actions */}
      <div className="flex items-center gap-1.5">
        {/* Duplicate */}
        <button
          onClick={handleDuplicate}
          disabled={isDuplicating}
          title="คัดลอกเรซูเม่"
          className="w-8 h-8 flex items-center justify-center rounded-xl transition-all duration-200 hover:scale-110 active:scale-95 disabled:opacity-50"
          style={{ background: `${accentColor}18`, color: accentColor }}
        >
          {isDuplicating
            ? <Loader2 size={13} className="animate-spin" />
            : <Copy size={13} />
          }
        </button>

        {/* Delete — two-stage confirm */}
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          title={deleteConfirm ? "คลิกอีกครั้งเพื่อยืนยันการลบ" : "ลบเรซูเม่"}
          className="w-8 h-8 flex items-center justify-center rounded-xl transition-all duration-300 hover:scale-110 active:scale-95 disabled:opacity-50 group/del"
          style={
            deleteConfirm
              ? { background: "#ef4444", color: "#ffffff", boxShadow: "0 4px 12px rgba(239, 68, 68, 0.3)" }
              : { background: "rgba(0,0,0,0.04)", color: "#9ca3af" }
          }
        >
          {isDeleting
            ? <Loader2 size={13} className="animate-spin text-red-100" />
            : <Trash2 size={13} className={deleteConfirm ? "scale-110" : "group-hover/del:text-red-500"} />
          }
        </button>
      </div>

      {/* Share / Copy Link Button */}
      <button
        onClick={handleCopyLink}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 hover:scale-105 active:scale-95"
        style={{
          background: copied ? "#10b98118" : `${accentColor}15`,
          color: copied ? "#10b981" : accentColor,
          border: `1px solid ${copied ? "#10b98135" : `${accentColor}28`}`,
        }}
      >
        {copied ? <Check size={11} /> : <ExternalLink size={11} />}
        {copied ? "คัดลอกแล้ว!" : "แชร์ลิงก์"}
      </button>
    </div>
  );
}
