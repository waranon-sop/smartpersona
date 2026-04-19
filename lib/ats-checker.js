  // lib/ats-checker.js

/**
 * Common Keywords for ATS Optimization
 */
const KEYWORDS = {
  hard_skills: [
    "React", "Node.js", "JavaScript", "TypeScript", "Python", "SQL", "AWS", 
    "Docker", "Kubernetes", "Git", "Project Management", "Agile", "Scrum",
    "Data Analysis", "UI/UX Design", "Figma", "Cloud Computing", "Java", "C++",
    "Tailwind CSS", "Next.js", "Express.js", "PostgreSQL", "MongoDB", "NoSQL"
  ],
  soft_skills: [
    "Leadership", "Communication", "Problem Solving", "Teamwork", "Adaptability",
    "Time Management", "Critical Thinking", "Collaboration", "Emotional Intelligence",
    "Negotiation", "Public Speaking", "Creativity"
  ],
  action_verbs: [
    "Developed", "Led", "Managed", "Implemented", "Improved", "Optimized",
    "Analyzed", "Coordinated", "Designed", "Executed", "Simplified", "Streamlined",
    "Resolved", "Increased", "Decreased", "Achieved", "Spearheaded"
  ]
};

/**
 * Checks resume content against common ATS keywords and returns a score/feedback.
 * @param {Object} resumeData - The full resume object
 * @returns {Object} - { score, matched_keywords, feedback }
 */
export function checkATSScore(resumeData) {
  const content = JSON.stringify(resumeData).toLowerCase();
  const results = {
    score: 0,
    matched_keywords: [],
    feedback: []
  };

  let totalPossible = 0;
  let matches = 0;

  // 1. Check Hard Skills
  KEYWORDS.hard_skills.forEach(skill => {
    totalPossible += 1;
    if (content.includes(skill.toLowerCase())) {
      matches += 1;
      results.matched_keywords.push(skill);
    }
  });

  // 2. Check Action Verbs (Weighted more for experience)
  KEYWORDS.action_verbs.forEach(verb => {
    totalPossible += 0.5;
    if (content.includes(verb.toLowerCase())) {
      matches += 0.5;
    }
  });

  // 3. Section Completeness Check
  const sections = ['personal', 'education', 'experience', 'skills', 'summary'];
  sections.forEach(sec => {
    if (resumeData[sec] && Object.keys(resumeData[sec]).length > 0) {
      matches += 5;
      totalPossible += 5;
    } else {
      results.feedback.push(`เพิ่มข้อมูลในส่วน ${sec} เพื่อเพิ่มความน่าเชื่อถือ`);
      totalPossible += 5;
    }
  });

  // Calculate percentage
  results.score = Math.min(100, Math.round((matches / totalPossible) * 100 + 30)); // Base 30 for starting

  if (results.score < 50) {
    results.feedback.push("เพิ่มทักษะเฉพาะทาง (Hard Skills) ให้มากขึ้นเพื่อให้ระบบคัดกรองตรวจพบ");
  } else if (results.score < 80) {
    results.feedback.push("ใช้คำกริยาแสดงการกระทำ (Action Verbs) เช่น 'Developed', 'Managed' ในส่วนของประสบการณ์ทำงาน");
  } else {
    results.feedback.push("ยอดเยี่ยม! เรซูเม่ของคุณมีคีย์เวิร์ดที่ครบถ้วนและเหมาะสมกับระบบ ATS");
  }

  return results;
}
