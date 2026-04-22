"use client";
import React, { memo } from "react";
import { THEMES } from "./themes";

/* ── Date formatter ── */
const fmtDate = (val, isCurrent) => {
  if (isCurrent) return "Present";
  if (!val) return "";
  const parts = val.split("-");
  if (parts.length === 1) return parts[0];
  const [year, month] = parts;
  const m = ["","Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][parseInt(month, 10)] || month;
  return m ? `${m} ${year}` : year;
};

/* ── Parse bullet lines from text ── */
const renderDetails = (text, color) => {
  if (!text) return null;
  const lines = text.split('\n').filter(l => l.trim());
  return (
    <div style={{ fontSize: 11.5, lineHeight: 1.6, color }}>
      {lines.map((line, i) => {
        const trimmed = line.trim();
        const isBullet = /^[•\-\*]/.test(trimmed);
        if (isBullet) {
          return (
            <div key={i} style={{ display: 'flex', gap: 6, marginTop: i > 0 ? 1 : 0 }}>
              <span style={{ flexShrink: 0, marginTop: 1 }}>•</span>
              <span>{trimmed.replace(/^[•\-\*]\s*/, '')}</span>
            </div>
          );
        }
        return <p key={i} style={{ marginTop: i > 0 ? 2 : 0 }}>{trimmed}</p>;
      })}
    </div>
  );
};

/* ═════════════════ ATS PROFESSIONAL RENDERER ═════════════════ */
const CleanSlateRenderer = memo(function CleanSlateRenderer({ data, theme }) {
  const p = data.personal || {};
  const s = data.summary || {};
  const sk = data.skills || {};
  const ex = (data.experiences || []).filter(e => e.position || e.company);
  const ed = (data.educations || []).filter(e => e.degree || e.institution);
  const proj = (data.projects || []).filter(pr => pr.name);
  const cert = (data.certifications || []).filter(c => c.name);

  const fullName = `${p.firstName || ""} ${p.lastName || ""}`.trim();
  const skills = sk.list ? sk.list.split(",").map(st => st.trim()).filter(Boolean) : [];

  const pageStyle = {
    fontFamily: theme.fontFamily || "'Inter', 'Helvetica Neue', sans-serif",
    backgroundColor: '#ffffff',
    color: '#111827',
    width: '100%',
    minHeight: '297mm',
    padding: '48px 56px',
    boxSizing: 'border-box',
    lineHeight: 1.6,
  };

  const sectionTitleStyle = {
    fontSize: 13,
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    color: '#000000',
    borderBottom: '1px solid #d1d5db',
    paddingBottom: 4,
    marginBottom: 12,
    marginTop: 20,
  };

  const contactText = [
    p.email,
    p.phone,
    p.address,
    p.linkedin && p.linkedin.replace(/^https?:\/\/(www\.)?/, ""),
    p.github && p.github.replace(/^https?:\/\/(www\.)?/, ""),
    p.portfolio && p.portfolio.replace(/^https?:\/\/(www\.)?/, ""),
  ].filter(Boolean).join("  •  ");

  return (
    <div style={pageStyle}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, margin: '0 0 4px 0', color: '#000', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{fullName || "YOUR NAME"}</h1>
        {p.jobTitle && <div style={{ fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{p.jobTitle}</div>}
        <div style={{ fontSize: 10.5, color: '#4b5563' }}>{contactText}</div>
      </div>

      {/* Summary */}
      {s.details && (
        <div style={{ marginBottom: 16 }}>
          <div style={sectionTitleStyle}>Professional Summary</div>
          <p style={{ fontSize: 11, margin: 0, textAlign: 'justify', color: '#374151' }}>{s.details}</p>
        </div>
      )}

      {/* Experience */}
      {ex.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <div style={sectionTitleStyle}>Work Experience</div>
          {ex.map((item, i) => (
            <div key={i} style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#111827' }}>{item.position}</div>
                <div style={{ fontSize: 11, fontWeight: 600, color: '#374151' }}>
                  {fmtDate(item.startDate)} – {fmtDate(item.endDate, item.isCurrent)}
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
                <div style={{ fontSize: 11, fontStyle: 'italic', color: '#4b5563' }}>{item.company}{item.location && `, ${item.location}`}</div>
              </div>
              {renderDetails(item.details, '#374151')}
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {ed.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <div style={sectionTitleStyle}>Education</div>
          {ed.map((item, i) => (
            <div key={i} style={{ marginBottom: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#111827' }}>{item.institution}{item.location && `, ${item.location}`}</div>
                <div style={{ fontSize: 11, fontWeight: 600, color: '#374151' }}>
                  {item.startYear ? `${fmtDate(item.startYear)} – ` : ""}{fmtDate(item.gradYear)}
                </div>
              </div>
              <div style={{ fontSize: 11, color: '#374151' }}>
                {item.degree}{item.field && ` in ${item.field}`}
                {item.gpa && `  •  GPA: ${item.gpa}`}
              </div>
              {item.activities && <div style={{ fontSize: 10.5, marginTop: 2, color: '#4b5563' }}>{item.activities}</div>}
            </div>
          ))}
        </div>
      )}

      {/* Projects */}
      {proj.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <div style={sectionTitleStyle}>Projects</div>
          {proj.map((item, i) => (
            <div key={i} style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 2 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#111827' }}>
                  {item.name}
                  {item.tech && <span style={{ fontWeight: 400, fontStyle: 'italic', color: '#4b5563' }}> | {item.tech}</span>}
                </div>
                {item.url && <div style={{ fontSize: 10, color: '#4b5563' }}>{item.url.replace(/^https?:\/\/(www\.)?/, "")}</div>}
              </div>
              {item.role && <div style={{ fontSize: 11, marginBottom: 2, color: '#374151' }}>Role: {item.role}</div>}
              {renderDetails(item.description, '#374151')}
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <div style={sectionTitleStyle}>Skills</div>
          <div style={{ fontSize: 11, color: '#374151', lineHeight: 1.8 }}>
            {skills.join("  •  ")}
          </div>
        </div>
      )}

      {/* Certifications */}
      {cert.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <div style={sectionTitleStyle}>Certifications</div>
          {cert.map((item, i) => (
            <div key={i} style={{ fontSize: 11, marginBottom: 4, color: '#374151' }}>
              <strong style={{ color: '#111827' }}>{item.name}</strong>
              {item.issuer && ` – ${item.issuer}`}
              {item.year && ` (${item.year})`}
            </div>
          ))}
        </div>
      )}
    </div>
  );
});

const ResumeRenderer = memo(function ResumeRenderer({ data }) {
  if (!data) return <div style={{ padding: 32, color: '#999', fontStyle: 'italic' }}>No data available</div>;

  const tplId = data.config?.template || "clean_slate";
  const t = THEMES[tplId] || THEMES.clean_slate;

  const p = data.personal || {};
  const s = data.summary || {};
  const sk = data.skills || {};
  const ex = (data.experiences || []).filter(e => e.position || e.company);
  const ed = (data.educations || []).filter(e => e.degree || e.institution);
  const lang = (data.languages || []).filter(l => l.language);
  const cert = (data.certifications || []).filter(c => c.name);
  const proj = (data.projects || []).filter(pr => pr.name);

  const fullName = `${p.firstName || ""} ${p.lastName || ""}`.trim();
  const skills = sk.list ? sk.list.split(",").map(s => s.trim()).filter(Boolean) : [];

  if (tplId === 'clean_slate') {
    return <CleanSlateRenderer data={data} theme={t} />;
  }

  /* ── Inline styles ── */
  const page = {
    fontFamily: t.fontFamily,
    backgroundColor: t.pageBg,
    color: t.mainTextColor,
    lineHeight: 1.5,
    fontSize: 12,
    width: '100%',
    minHeight: '297mm',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    overflow: 'hidden',
    ...(tplId === 'startup_vibe' 
      ? { borderTop: '16px solid #10b981' }
      : t.pageBorder 
        ? { border: t.pageBorder }
        : {}
    ),
    boxSizing: 'border-box',
  };

  const header = {
    background: t.headerBg,
    padding: '36px 28px 30px 35%',
    position: 'relative',
    zIndex: 0,
  };

  const sidebar = {
    width: '33%',
    background: t.sidebarBg,
    padding: p.profilePic ? '80px 20px 28px 20px' : '36px 20px 28px 20px',
    position: 'relative',
    flexShrink: 0,
    ...(tplId === 'clean_slate' ? { borderRight: '1px solid #e4e4e7' } : {}),
  };

  const main = {
    width: '67%',
    padding: '24px 28px 28px 28px',
    flexGrow: 1,
  };

  const sectionHeadingStyle = (color) => ({
    fontSize: 11.5,
    fontWeight: 800,
    textTransform: 'uppercase',
    letterSpacing: '0.12em',
    color,
    marginBottom: 8,
  });

  const accentBar = (color, width = 24) => ({
    width,
    height: 2.5,
    backgroundColor: color,
    borderRadius: 2,
    marginBottom: 10,
  });

  const mainSectionTitle = {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  };

  const iconCircle = {
    width: 26,
    height: 26,
    borderRadius: '50%',
    backgroundColor: t.mainAccent,
    color: t.pageBg === '#0a0a0a' ? '#000' : '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 11,
    flexShrink: 0,
  };

  const dot = {
    position: 'absolute',
    left: -19,
    top: 6,
    width: 7,
    height: 7,
    borderRadius: '50%',
    backgroundColor: t.dotBg,
    border: tplId === 'clean_slate' ? `2px solid ${t.dotBg}` : 'none',
    ...(tplId === 'clean_slate' ? { backgroundColor: '#fff' } : {}),
    ...(tplId === 'tech_innovator' ? { borderRadius: 0, boxShadow: `0 0 6px ${t.dotBg}` } : {}),
  };

  const contactItem = { display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 10, lineHeight: 1.5 };
  const contactIcon = { width: 14, textAlign: 'center', fontSize: 9, flexShrink: 0, marginTop: 1, color: t.sidebarAccent };

  return (
    <div style={page}>
      {/* ═════════════════ HEADER ═════════════════ */}
      <div style={header}>
        <h1 style={{
          fontSize: 28,
          fontWeight: 900,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          color: t.headerNameColor,
          lineHeight: 1.1,
          margin: 0,
        }}>
          {fullName || "YOUR NAME"}
        </h1>
        {p.jobTitle && (
          <p style={{
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: t.headerJobColor,
            marginTop: 6,
            margin: 0,
            marginTop: 6,
          }}>
            {p.jobTitle}
          </p>
        )}
      </div>

      {/* ═════════════════ BODY ═════════════════ */}
      <div style={{ display: 'flex', flex: 1 }}>

        {/* ─── SIDEBAR ─── */}
        <div style={sidebar}>
          {/* Profile Photo */}
          {p.profilePic && (
            <div style={{
              position: 'absolute',
              top: -56,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 112,
              height: 112,
              zIndex: 20,
            }}>
              <img src={p.profilePic} alt="Profile" style={{
                width: '100%', height: '100%', borderRadius: '50%',
                objectFit: 'cover', border: `5px solid ${t.photoBorderColor}`,
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              }} />
            </div>
          )}

          {/* Contact */}
          <div style={{ marginBottom: 20 }}>
            <div style={sectionHeadingStyle(t.sidebarHeadingColor)}>Contact</div>
            <div style={accentBar(t.sidebarAccent)} />
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 9, color: t.sidebarTextColor, fontSize: 11 }}>
              {p.phone && <li style={contactItem}><span style={contactIcon}>📞</span><span>{p.phone}</span></li>}
              {p.email && <li style={contactItem}><span style={contactIcon}>✉️</span><span style={{ wordBreak: 'break-word' }}>{p.email}</span></li>}
              {p.address && <li style={contactItem}><span style={contactIcon}>📍</span><span>{p.address}</span></li>}
              {p.linkedin && <li style={contactItem}><span style={contactIcon}>in</span><span style={{ wordBreak: 'break-word' }}>{(p.linkedin||"").replace(/^https?:\/\/(www\.)?/, "")}</span></li>}
              {p.github && <li style={contactItem}><span style={contactIcon}>⌨️</span><span style={{ wordBreak: 'break-word' }}>{(p.github||"").replace(/^https?:\/\/(www\.)?/, "")}</span></li>}
              {p.portfolio && <li style={contactItem}><span style={contactIcon}>🌐</span><span style={{ wordBreak: 'break-word' }}>{(p.portfolio||"").replace(/^https?:\/\/(www\.)?/, "")}</span></li>}
            </ul>
          </div>

          {/* Skills */}
          {skills.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <div style={sectionHeadingStyle(t.sidebarHeadingColor)}>Skills</div>
              <div style={accentBar(t.sidebarAccent)} />
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                {skills.map((s, i) => (
                  <span key={i} style={{
                    display: 'inline-block',
                    padding: '2px 8px',
                    borderRadius: 4,
                    fontSize: 10.5,
                    fontWeight: 600,
                    backgroundColor: t.skillBg,
                    color: t.skillText,
                  }}>{s}</span>
                ))}
              </div>
            </div>
          )}

          {/* Languages */}
          {lang.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <div style={sectionHeadingStyle(t.sidebarHeadingColor)}>Languages</div>
              <div style={accentBar(t.sidebarAccent)} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {lang.map((l, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 10, color: t.sidebarTextColor }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ width: 5, height: 5, borderRadius: '50%', backgroundColor: t.sidebarAccent, flexShrink: 0 }} />
                      <span style={{ fontWeight: 600 }}>{l.language}</span>
                    </div>
                    <span style={{ fontSize: 8.5, color: t.sidebarMutedText, backgroundColor: t.pageBg === '#0a0a0a' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)', padding: '1px 6px', borderRadius: 3 }}>{l.level}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certifications */}
          {cert.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <div style={sectionHeadingStyle(t.sidebarHeadingColor)}>Certifications</div>
              <div style={accentBar(t.sidebarAccent)} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {cert.map((c, i) => (
                  <div key={i} style={{ display: 'flex', gap: 6, fontSize: 10, color: t.sidebarTextColor }}>
                    <span style={{ width: 5, height: 5, borderRadius: '50%', backgroundColor: t.sidebarAccent, flexShrink: 0, marginTop: 5 }} />
                    <div style={{ lineHeight: 1.4 }}>
                      <div style={{ fontWeight: 700 }}>{c.name}</div>
                      <div style={{ fontSize: 9, color: t.sidebarMutedText, marginTop: 1 }}>
                        {c.issuer}{c.issueDate && ` · ${fmtDate(c.issueDate)}`}
                      </div>
                      {c.credentialId && <div style={{ fontSize: 8.5, color: t.sidebarMutedText, marginTop: 1 }}>ID: {c.credentialId}</div>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ─── MAIN CONTENT ─── */}
        <div style={main}>

          {/* Profile / Objective */}
          {s.details && (
            <div style={{ marginBottom: 20 }}>
              <div style={mainSectionTitle}>
                <div style={iconCircle}>👤</div>
                <span style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.18em', color: t.mainHeadingColor }}>Profile</span>
                <div style={{ flex: 1, height: 1, backgroundColor: t.dividerColor }} />
              </div>
              <p style={{ fontSize: 10.5, lineHeight: 1.75, color: t.mainSubText, margin: 0, paddingLeft: 34 }}>{s.details}</p>
            </div>
          )}

          {/* Work Experience */}
          {ex.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <div style={mainSectionTitle}>
                <div style={iconCircle}>💼</div>
                <span style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.18em', color: t.mainHeadingColor }}>Work Experience</span>
                <div style={{ flex: 1, height: 1, backgroundColor: t.dividerColor }} />
              </div>
              <div style={{ paddingLeft: 34, borderLeft: `2px solid ${t.dividerColor}`, marginLeft: 12, display: 'flex', flexDirection: 'column', gap: 16 }}>
                {ex.map((item, i) => (
                  <div key={i} style={{ position: 'relative' }}>
                    <div style={dot} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', marginBottom: 2 }}>
                      <h4 style={{ fontSize: 12, fontWeight: 700, color: t.mainHeadingColor, margin: 0 }}>{item.position}</h4>
                      <span style={{ fontSize: 9, fontWeight: 600, color: t.mainMutedText, flexShrink: 0 }}>
                        {fmtDate(item.startDate)} – {fmtDate(item.endDate, item.isCurrent)}
                      </span>
                    </div>
                    <p style={{ fontSize: 10, fontWeight: 600, color: t.mainAccent, margin: '0 0 4px 0', opacity: 0.8 }}>
                      {item.company}{item.location && ` · ${item.location}`}
                    </p>
                    {renderDetails(item.details, t.mainSubText)}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {ed.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <div style={mainSectionTitle}>
                <div style={iconCircle}>🎓</div>
                <span style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.18em', color: t.mainHeadingColor }}>Education</span>
                <div style={{ flex: 1, height: 1, backgroundColor: t.dividerColor }} />
              </div>
              <div style={{ paddingLeft: 34, borderLeft: `2px solid ${t.dividerColor}`, marginLeft: 12, display: 'flex', flexDirection: 'column', gap: 14 }}>
                {ed.map((item, i) => (
                  <div key={i} style={{ position: 'relative' }}>
                    <div style={dot} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', marginBottom: 2 }}>
                      <h4 style={{ fontSize: 12, fontWeight: 700, color: t.mainHeadingColor, margin: 0 }}>
                        {item.degree}{item.field && ` in ${item.field}`}
                      </h4>
                      <span style={{ fontSize: 9, fontWeight: 600, color: t.mainMutedText, flexShrink: 0 }}>
                        {item.startYear ? `${fmtDate(item.startYear)} – ` : ""}{fmtDate(item.gradYear)}
                      </span>
                    </div>
                    <p style={{ fontSize: 10, fontWeight: 600, color: t.mainAccent, margin: '0 0 3px 0', opacity: 0.8 }}>
                      {item.institution}{item.location && ` · ${item.location}`}
                    </p>
                    <div style={{ fontSize: 10.5, color: t.mainSubText, lineHeight: 1.6 }}>
                      {item.gpa && <p style={{ margin: 0 }}><span style={{ fontWeight: 600 }}>GPA:</span> {item.gpa}</p>}
                      {item.activities && <p style={{ margin: '2px 0 0 0' }}>{item.activities}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {proj.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <div style={mainSectionTitle}>
                <div style={iconCircle}>🚀</div>
                <span style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.18em', color: t.mainHeadingColor }}>Projects</span>
                <div style={{ flex: 1, height: 1, backgroundColor: t.dividerColor }} />
              </div>
              <div style={{ paddingLeft: 34, borderLeft: `2px solid ${t.dividerColor}`, marginLeft: 12, display: 'flex', flexDirection: 'column', gap: 14 }}>
                {proj.map((item, i) => (
                  <div key={i} style={{ position: 'relative' }}>
                    <div style={dot} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', marginBottom: 2 }}>
                      <h4 style={{ fontSize: 12, fontWeight: 700, color: t.mainHeadingColor, margin: 0 }}>
                        {item.name}
                        {item.tech && <span style={{ fontWeight: 400, fontSize: 10, color: t.mainMutedText, marginLeft: 6 }}>({item.tech})</span>}
                      </h4>
                      {item.url && (
                        <a href={item.url.includes('http') ? item.url : `https://${item.url}`} target="_blank" rel="noopener noreferrer"
                          style={{ fontSize: 9, fontWeight: 600, color: t.mainAccent, textDecoration: 'none' }}>
                          View ↗
                        </a>
                      )}
                    </div>
                    {item.role && <p style={{ fontSize: 10, fontWeight: 600, color: t.mainMutedText, margin: '0 0 3px 0' }}>Role: {item.role}</p>}
                    {renderDetails(item.description, t.mainSubText)}
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
