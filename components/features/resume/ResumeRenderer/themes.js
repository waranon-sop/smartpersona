export const THEMES = {
  classic: {
    font: "font-serif", wrapperBg: "bg-white", border: "", pageText: "text-slate-900",
    headerBg: "bg-[#1e3a8a]", sidebarBg: "bg-[#fdfbf7]", // Beige
    nameColor: "text-white", jobColor: "text-blue-200",
    headingText: "text-[#1e3a8a]", sidebarHeadingDiv: "bg-[#1e3a8a]",
    sidebarListIcon: "text-[#1e3a8a]", sidebarBullet: "bg-[#1e3a8a]",
    timelineLine: "bg-blue-100", iconBg: "bg-[#1e3a8a]", iconColor: "text-white",
    timelineDivider: "bg-blue-100", timelineDot: "rounded-sm transform rotate-45 bg-[#1e3a8a] border-none",
    itemTitleColor: "text-[#1e3a8a]", itemSubColor: "text-slate-500", itemBodyColor: "text-slate-700",
    photoBorder: "border-[#fdfbf7]", photoFallbackBg: "bg-[#e2e8f0]"
  },
  modern: {
    font: "font-sans", wrapperBg: "bg-white", border: "border-[12px] border-[#fbbf24]", pageText: "text-slate-800",
    headerBg: "bg-[#334155]", sidebarBg: "bg-[#e2e8f0]",
    nameColor: "text-white", jobColor: "text-slate-300",
    headingText: "text-slate-800", sidebarHeadingDiv: "bg-slate-800",
    sidebarListIcon: "text-slate-800", sidebarBullet: "bg-slate-800",
    timelineLine: "bg-slate-300", iconBg: "bg-[#334155]", iconColor: "text-white",
    timelineDivider: "bg-slate-200", timelineDot: "rounded-full border border-slate-400 bg-[#334155]",
    itemTitleColor: "text-slate-800", itemSubColor: "text-slate-500", itemBodyColor: "text-slate-700",
    photoBorder: "border-white", photoFallbackBg: "bg-[#94a3b8]"
  },
  tech_innovator: {
    font: "font-mono border border-zinc-800", wrapperBg: "bg-[#09090b]", border: "border-l-4 border-[#22c55e]", pageText: "text-zinc-300",
    headerBg: "bg-[#000000]", sidebarBg: "bg-[#18181b]",
    nameColor: "text-[#22c55e]", jobColor: "text-zinc-400",
    headingText: "text-[#22c55e]", sidebarHeadingDiv: "bg-zinc-800",
    sidebarListIcon: "text-[#22c55e]", sidebarBullet: "bg-[#22c55e]",
    timelineLine: "bg-zinc-700", iconBg: "bg-[#22c55e]", iconColor: "text-black",
    timelineDivider: "bg-zinc-800", timelineDot: "rounded-none shadow-[0_0_8px_rgba(34,197,94,0.6)] bg-[#22c55e] border-none",
    itemTitleColor: "text-white", itemSubColor: "text-zinc-500", itemBodyColor: "text-zinc-400",
    photoBorder: "border-[#18181b]", photoFallbackBg: "bg-zinc-800"
  },
  glass_modern: {
    font: "font-sans", wrapperBg: "bg-white", border: "", pageText: "text-slate-700",
    headerBg: "bg-gradient-to-r from-[#6366f1] to-[#a855f7]", sidebarBg: "bg-[#f8fafc]",
    nameColor: "text-white", jobColor: "text-indigo-100",
    headingText: "text-[#6366f1]", sidebarHeadingDiv: "bg-[#6366f1]",
    sidebarListIcon: "text-[#a855f7]", sidebarBullet: "bg-[#6366f1]",
    timelineLine: "bg-indigo-100", iconBg: "bg-gradient-to-tr from-[#6366f1] to-[#a855f7]", iconColor: "text-white shadow-lg",
    timelineDivider: "bg-indigo-50", timelineDot: "rounded-full border-2 border-white bg-[#8b5cf6] shadow-sm",
    itemTitleColor: "text-slate-800", itemSubColor: "text-indigo-500", itemBodyColor: "text-slate-600",
    photoBorder: "border-white", photoFallbackBg: "bg-indigo-200"
  },
  startup_vibe: {
    font: "font-sans tracking-tight", wrapperBg: "bg-[#fcfdfe]", border: "border-t-[16px] border-[#10b981]", pageText: "text-[#1f2937]",
    headerBg: "bg-[#1f2937]", sidebarBg: "bg-[#ecfdf5]",
    nameColor: "text-[#10b981]", jobColor: "text-gray-300",
    headingText: "text-[#1f2937]", sidebarHeadingDiv: "bg-[#10b981]",
    sidebarListIcon: "text-[#10b981]", sidebarBullet: "bg-[#10b981]",
    timelineLine: "border-l-2 border-dashed border-[#10b981]", iconBg: "bg-[#10b981]", iconColor: "text-white",
    timelineDivider: "bg-gray-100", timelineDot: "rounded-full bg-white border-4 border-[#10b981]",
    itemTitleColor: "text-[#1f2937]", itemSubColor: "text-[#10b981]", itemBodyColor: "text-gray-600",
    photoBorder: "border-[#ecfdf5]", photoFallbackBg: "bg-gray-800"
  },
  clean_slate: {
    font: "font-sans", wrapperBg: "bg-white", border: "", pageText: "text-black",
    headerBg: "bg-black", sidebarBg: "bg-white border-r border-gray-100",
    nameColor: "text-white", jobColor: "text-gray-400",
    headingText: "text-black", sidebarHeadingDiv: "bg-gray-200",
    sidebarListIcon: "text-gray-400", sidebarBullet: "bg-black",
    timelineLine: "bg-gray-200", iconBg: "bg-black", iconColor: "text-white",
    timelineDivider: "bg-transparent", timelineDot: "rounded-full border border-black bg-white",
    itemTitleColor: "text-black uppercase tracking-tight", itemSubColor: "text-gray-400", itemBodyColor: "text-gray-600",
    photoBorder: "border-white", photoFallbackBg: "bg-gray-200"
  },
  creative_agency: {
    font: "font-sans", wrapperBg: "bg-[#f8fafc]", border: "border-[8px] border-[#f97316]", pageText: "text-slate-800",
    headerBg: "bg-[#f97316]", sidebarBg: "bg-[#1e293b]",
    nameColor: "text-white", jobColor: "text-orange-900 border-2 border-white px-2 py-0.5 inline-block",
    headingText: "text-white", sidebarHeadingDiv: "bg-[#f97316]",
    sidebarListIcon: "text-[#f97316]", sidebarBullet: "bg-[#f97316]",
    timelineLine: "bg-slate-200", iconBg: "bg-[#f97316]", iconColor: "text-white",
    timelineDivider: "bg-orange-100", timelineDot: "rounded-lg bg-[#f97316]",
    itemTitleColor: "text-[#f97316] font-black", itemSubColor: "text-slate-400 uppercase tracking-widest", itemBodyColor: "text-slate-700",
    photoBorder: "border-[#1e293b]", photoFallbackBg: "bg-orange-400"
  }
};
