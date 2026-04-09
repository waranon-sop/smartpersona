"use client";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

/**
 * Collapsible section card for forms
 */
export default function Section({ 
  icon: Icon, 
  color = "#6366f1", 
  title, 
  badge, 
  defaultOpen = true, 
  children 
}) {
  const [open, setOpen] = useState(defaultOpen);
  
  return (
    <div className="rounded-2xl overflow-hidden border" style={{ borderColor: `${color}20` }}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-5 py-3.5 text-left"
        style={{ background: `${color}08` }}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center shadow-sm"
            style={{ background: `linear-gradient(135deg,${color}cc,${color})` }}>
            <Icon size={14} className="text-white" />
          </div>
          <span className="font-black text-gray-800 text-sm">{title}</span>
          {badge && (
            <span className="text-[9px] font-black uppercase tracking-wide px-2 py-0.5 rounded-full text-white"
              style={{ background: color }}>{badge}</span>
          )}
        </div>
        <div className="text-gray-400">
          {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </div>
      </button>
      {open && <div className="bg-white px-5 py-5">{children}</div>}
    </div>
  );
}
