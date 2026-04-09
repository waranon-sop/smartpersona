"use client";
import React, { memo } from "react";
import { THEMES } from "./themes";

const fmtDate = (val, isCurrent) => {
  if (isCurrent) return "Present";
  if (!val) return "";
  const parts = val.split("-");
  if (parts.length === 1) return parts[0]; 
  const [year, month] = parts;
  const m = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][parseInt(month, 10)] || month;
  return m ? `${m} ${year}` : year;
};

const ResumeRenderer = memo(function ResumeRenderer({ data }) {
  if (!data) return <div className="text-gray-400 p-8 italic">No data available</div>;

  const tplId = data.config?.template || "modern";
  const theme = THEMES[tplId] || THEMES.modern;
  
  const p = data.personal || {};
  const s = data.summary || {};
  const sk = data.skills || {};
  const ex = data.experiences || [];
  const ed = data.educations || [];
  const lang = data.languages || [];
  const cert = data.certifications || [];
  const proj = data.projects || [];

  const fullName = `${p.firstName || ""} ${p.lastName || ""}`.trim();
  
  const getSubTitleClass = () => {
    if (tplId === "creative_agency") return "text-white mt-4 border-l-4 border-white pl-4";
    return "";
  }

  return (
    <div className={`${theme.wrapperBg} ${theme.font} ${theme.pageText} w-full min-h-[1056px] ${theme.border} flex flex-col relative overflow-hidden box-border`}>
      
      {/* HEADER AREA */}
      <div className={`w-full ${theme.headerBg} ${theme.nameColor} py-12 pr-12 pl-[38%] relative z-0`}>
        <h1 className="text-4xl font-black uppercase tracking-wider mb-1 leading-tight drop-shadow-sm">
          {fullName || "YOUR NAME"}
        </h1>
        {p.jobTitle && (
          <p className={`text-lg font-bold tracking-widest uppercase ${theme.jobColor} ${getSubTitleClass()}`}>
            {p.jobTitle}
          </p>
        )}
      </div>

      {/* 2-COLUMN LAYOUT */}
      <div className="flex flex-row flex-1 z-10">
        
        {/* LEFT COLUMN */}
        <div className={`w-[33%] ${theme.sidebarBg} ${tplId === "creative_agency" ? "text-slate-300" : ""} relative flex flex-col items-center pt-24 px-8 pb-12`}>
          
          {/* PROFILE PICTURE OVERLAP */}
          <div className="absolute top-[-80px] left-1/2 -translate-x-1/2 w-40 h-40">
            {p.profilePic ? (
              <img src={p.profilePic} alt="Profile" className={`w-full h-full rounded-full object-cover border-8 ${theme.photoBorder} shadow-lg relative z-10 bg-white`} />
            ) : (
              <div className={`w-full h-full rounded-full ${theme.photoFallbackBg} border-8 ${theme.photoBorder} flex items-center justify-center shadow-lg relative z-10 overflow-hidden`}>
                 <div className="mt-8 w-20 h-20 bg-black/20 rounded-full" />
              </div>
            )}
          </div>

          <div className="w-full space-y-10">
            {/* CONTACT */}
            <div className="w-full">
              <h3 className={`text-sm font-black uppercase tracking-[0.2em] ${tplId === "creative_agency" ? "text-white" : theme.headingText} mb-2`}>Contact</h3>
              <div className={`w-full h-[1.5px] ${theme.sidebarHeadingDiv} mb-4`} />
              <ul className={`space-y-4 text-[11px] ${tplId === "creative_agency" ? "text-slate-300" : "text-slate-700"} font-medium break-all`}>
                {p.phone && <li className="flex items-center gap-3"><span className={`w-4 flex justify-center text-[10px] ${theme.sidebarListIcon}`}>📞</span>{p.phone}</li>}
                {p.email && <li className="flex items-center gap-3"><span className={`w-4 flex justify-center text-[10px] ${theme.sidebarListIcon}`}>✉️</span><a href={`mailto:${p.email}`} className="hover:underline">{p.email}</a></li>}
                {p.address && <li className="flex items-center gap-3"><span className={`w-4 flex justify-center text-[10px] ${theme.sidebarListIcon}`}>📍</span>{p.address}</li>}
                {p.dateOfBirth && <li className="flex items-center gap-3"><span className={`w-4 flex justify-center text-[10px] ${theme.sidebarListIcon}`}>🎂</span>{fmtDate(p.dateOfBirth)}</li>}
                {p.nationality && <li className="flex items-center gap-3"><span className={`w-4 flex justify-center text-[10px] ${theme.sidebarListIcon}`}>🌍</span>{p.nationality}</li>}
                {p.linkedin && <li className="flex items-center gap-3"><span className={`w-4 flex justify-center text-[10px] ${theme.sidebarListIcon}`}>in</span><a href={p.linkedin.includes('http') ? p.linkedin : `https://${p.linkedin}`} target="_blank" rel="noopener noreferrer" className="hover:underline">{(p.linkedin || "").replace(/^https?:\/\/(www\.)?/, "")}</a></li>}
                {p.github && <li className="flex items-center gap-3"><span className={`w-4 flex justify-center text-[10px] ${theme.sidebarListIcon}`}>gh</span><a href={p.github.includes('http') ? p.github : `https://${p.github}`} target="_blank" rel="noopener noreferrer" className="hover:underline">{(p.github || "").replace(/^https?:\/\/(www\.)?/, "")}</a></li>}
                {p.portfolio && <li className="flex items-center gap-3"><span className={`w-4 flex justify-center text-[10px] ${theme.sidebarListIcon}`}>🌐</span><a href={p.portfolio.includes('http') ? p.portfolio : `https://${p.portfolio}`} target="_blank" rel="noopener noreferrer" className="hover:underline">{(p.portfolio || "").replace(/^https?:\/\/(www\.)?/, "")}</a></li>}
              </ul>
            </div>

            {/* CERTIFICATIONS */}
            {cert.length > 0 && (
              <div className="w-full">
                <h3 className={`text-sm font-black uppercase tracking-[0.2em] ${tplId === "creative_agency" ? "text-white" : theme.headingText} mb-2`}>Certifications</h3>
                <div className={`w-full h-[1.5px] ${theme.sidebarHeadingDiv} mb-4`} />
                <ul className={`space-y-4 text-[11px] ${tplId === "creative_agency" ? "text-slate-300" : "text-slate-700"} font-medium`}>
                  {cert.map((c, i) => (
                    <li key={i} className="flex gap-2">
                      <span className={`mt-1.5 w-1.5 h-1.5 rounded-full ${theme.sidebarBullet} flex-shrink-0`} />
                      <div>
                        <p className={`font-bold leading-tight ${tplId === "creative_agency" ? "text-white" : ""}`}>{c.name}</p>
                        <p className={`text-[10px] ${tplId === "creative_agency" ? "text-slate-400" : "text-slate-500"} mt-0.5`}>
                          {c.issuer} {c.issueDate && `| ${fmtDate(c.issueDate)}`}
                        </p>
                        {c.credentialId && <p className={`text-[9.5px] ${tplId === "creative_agency" ? "text-slate-500" : "text-slate-400"} mt-0.5`}>ID: {c.credentialId}</p>}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* LANGUAGES */}
            {lang.length > 0 && (
              <div className="w-full">
                <h3 className={`text-sm font-black uppercase tracking-[0.2em] ${tplId === "creative_agency" ? "text-white" : theme.headingText} mb-2`}>Languages</h3>
                <div className={`w-full h-[1.5px] ${theme.sidebarHeadingDiv} mb-4`} />
                <ul className={`space-y-3 text-[11px] ${tplId === "creative_agency" ? "text-slate-300" : "text-slate-700"} font-medium pl-1`}>
                  {lang.map((l, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className={`w-1.5 h-1.5 rounded-full ${theme.sidebarBullet} flex-shrink-0`} />
                      {l.language} <span className={`${tplId === "creative_agency" ? "text-slate-400" : "text-slate-500"}`}>({l.level})</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="w-[67%] p-10 space-y-8 pb-16">
          
          {/* OBJECTIVE */}
          {s.details && (
            <div className="relative pl-12">
              <div className={`absolute left-0 top-0 w-8 h-8 rounded-full ${theme.iconBg} ${theme.iconColor} flex items-center justify-center z-10 text-[10px]`}>👤</div>
              <div className={`absolute left-4 top-8 bottom-[-40px] ${tplId === 'startup_vibe' ? theme.timelineLine : `w-[1.5px] ${theme.timelineLine}`}`} />
              <div className="flex items-center gap-4 mb-4 pt-1.5">
                <h3 className={`text-sm font-black uppercase tracking-[0.2em] ${theme.headingText}`}>Career Objective</h3>
                <div className={`flex-1 h-[1.5px] ${theme.timelineDivider}`} />
              </div>
              <div className="relative">
                <div className={`absolute top-2 w-[5px] h-[5px] ${theme.timelineDot} z-10`} style={{ left: "-28.5px" }} />
                <p className={`text-[12px] ${theme.itemBodyColor} leading-relaxed font-medium`}>
                  {s.details}
                </p>
              </div>
            </div>
          )}

          {/* SKILLS */}
          {sk.list && (
            <div className="relative pl-12">
              <div className={`absolute left-0 top-0 w-8 h-8 rounded-full ${theme.iconBg} ${theme.iconColor} flex items-center justify-center z-10 text-[10px]`}>💡</div>
              <div className={`absolute left-4 top-8 bottom-[-40px] ${tplId === 'startup_vibe' ? theme.timelineLine : `w-[1.5px] ${theme.timelineLine}`}`} />
              <div className="flex items-center gap-4 mb-4 pt-1.5">
                <h3 className={`text-sm font-black uppercase tracking-[0.2em] ${theme.headingText}`}>Key Skills</h3>
                <div className={`flex-1 h-[1.5px] ${theme.timelineDivider}`} />
              </div>
              <div className="relative">
                <div className={`absolute top-2 w-[5px] h-[5px] ${theme.timelineDot} z-10`} style={{ left: "-28.5px" }} />
                <ul className={`text-[12px] ${theme.itemBodyColor} leading-relaxed font-medium list-disc pl-4 space-y-2`}>
                  {sk.list.split(",").map((s, i) => (
                    <li key={i}>{s.trim()}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* EDUCATION */}
          {ed.length > 0 && (
            <div className="relative pl-12">
              <div className={`absolute left-0 top-0 w-8 h-8 rounded-full ${theme.iconBg} ${theme.iconColor} flex items-center justify-center z-10 text-[10px]`}>🎓</div>
              <div className={`absolute left-4 top-8 bottom-[-40px] ${tplId === 'startup_vibe' ? theme.timelineLine : `w-[1.5px] ${theme.timelineLine}`}`} />
              <div className="flex items-center gap-4 mb-4 pt-1.5">
                <h3 className={`text-sm font-black uppercase tracking-[0.2em] ${theme.headingText}`}>Education</h3>
                <div className={`flex-1 h-[1.5px] ${theme.timelineDivider}`} />
              </div>
              <div className="space-y-6">
                {ed.map((item, i) => (
                  <div key={i} className="relative">
                    <div className={`absolute top-2 w-[5px] h-[5px] ${theme.timelineDot} z-10`} style={{ left: "-28.5px" }} />
                    <ul className={`text-[12px] ${theme.itemBodyColor} leading-relaxed font-medium list-disc pl-4 space-y-1`}>
                      <li>
                        <span className={`font-bold ${theme.itemTitleColor}`}>{item.degree}</span> {item.field ? `in ${item.field}` : ""} 
                        <span className={theme.itemSubColor}> | {item.institution}</span>
                        {item.location && <span className={theme.itemSubColor}> | {item.location}</span>}
                        <span className={theme.itemSubColor}> | {item.startYear ? `${fmtDate(item.startYear)} - ` : ""}{fmtDate(item.gradYear)}</span>
                      </li>
                      {item.gpa && <li><span className="font-semibold text-slate-500">CGPA:</span> {item.gpa}</li>}
                      {item.activities && <li>{item.activities}</li>}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ACADEMIC PROJECTS */}
          {proj.length > 0 && (
            <div className="relative pl-12">
              <div className={`absolute left-0 top-0 w-8 h-8 rounded-full ${theme.iconBg} ${theme.iconColor} flex items-center justify-center z-10 text-[10px]`}>🚀</div>
              <div className={`absolute left-4 top-8 bottom-[-40px] ${tplId === 'startup_vibe' ? theme.timelineLine : `w-[1.5px] ${theme.timelineLine}`}`} />
              <div className="flex items-center gap-4 mb-4 pt-1.5">
                <h3 className={`text-sm font-black uppercase tracking-[0.2em] ${theme.headingText}`}>Projects</h3>
                <div className={`flex-1 h-[1.5px] ${theme.timelineDivider}`} />
              </div>
              <div className="space-y-6">
                {proj.map((item, i) => (
                  <div key={i} className="relative">
                    <div className={`absolute top-2 w-[5px] h-[5px] ${theme.timelineDot} z-10`} style={{ left: "-28.5px" }} />
                    <div className="mb-1 flex justify-between items-baseline flex-wrap">
                      <p className={`text-[12px] font-bold ${theme.itemTitleColor}`}>
                        {item.name} {item.tech && <span className={`font-normal ${theme.itemSubColor}`}>({item.tech})</span>}
                      </p>
                      {item.url && (
                        <a href={item.url.includes('http') ? item.url : `https://${item.url}`} target="_blank" rel="noopener noreferrer" className={`text-[10.5px] font-semibold text-blue-500 hover:text-blue-700 hover:underline flex-shrink-0 mb-1 sm:mb-0`}>
                          View Project ↗
                        </a>
                      )}
                    </div>
                    {item.role && <p className={`text-[11px] font-semibold ${theme.itemSubColor} mb-1.5`}>Role: {item.role}</p>}
                    <p className={`text-[12px] ${theme.itemBodyColor} leading-relaxed font-medium whitespace-pre-wrap`}>{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* WORK EXPERIENCE */}
          {ex.length > 0 && (
            <div className="relative pl-12">
              <div className={`absolute left-0 top-0 w-8 h-8 rounded-full ${theme.iconBg} ${theme.iconColor} flex items-center justify-center z-10 text-[10px]`}>🏢</div>
              <div className={`absolute left-4 top-8 bottom-[20px] ${tplId === 'startup_vibe' ? theme.timelineLine : `w-[1.5px] ${theme.timelineLine}`}`} />
              <div className="flex items-center gap-4 mb-4 pt-1.5">
                <h3 className={`text-sm font-black uppercase tracking-[0.2em] ${theme.headingText}`}>Work Experience</h3>
                <div className={`flex-1 h-[1.5px] ${theme.timelineDivider}`} />
              </div>
              <div className="space-y-6">
                {ex.map((item, i) => (
                  <div key={i} className="relative">
                    <div className={`absolute top-2 w-[5px] h-[5px] ${theme.timelineDot} z-10`} style={{ left: "-28.5px" }} />
                    <h4 className={`text-[12px] font-bold ${theme.itemTitleColor}`}>{item.position} <span className={`font-normal ${theme.itemSubColor}`}>| {item.company}</span></h4>
                    <p className={`text-[10px] font-bold ${theme.itemSubColor} mb-1.5`}>{fmtDate(item.startDate)} - {fmtDate(item.endDate, item.isCurrent)} | {item.location}</p>
                    <p className={`text-[12px] ${theme.itemBodyColor} leading-relaxed font-medium whitespace-pre-wrap`}>{item.details}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

export default ResumeRenderer;
