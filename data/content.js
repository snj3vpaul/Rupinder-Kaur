/**
 * Content-first portfolio. Edit facts here instead of editing JSX.
 * Public work descriptions are distilled from the previous portfolio.
 * Do not add numerical achievements, job details or endorsements without evidence.
 */
export const site = {
  name: "Rupinder Kaur",
  initials: "RK",
  role: "Software Engineer in Test",
  location: "Ottawa, Canada",
  email: "rupinder88uiet@gmail.com",
  linkedin: "https://www.linkedin.com/in/rupinderkkaur",
  // Add ONLY a real, publicly accessible personal account or resume URL.
  github: "",
  resume: "",
  url: "https://rupinder-kaur-pi.vercel.app",
};

export const philosophy = [
  { number: "01", title: "Understand the risk", description: "Translate product behaviour and requirements into purposeful test coverage." },
  { number: "02", title: "Build the signal", description: "Use automation and repeatable checks to make changes easier to validate." },
  { number: "03", title: "Find the friction", description: "Look beyond happy paths: data consistency, defects and performance constraints." },
  { number: "04", title: "Support confident releases", description: "Bring actionable quality feedback into everyday delivery workflows." },
];

export const projects = [
  {
    number: "01", category: "Systems modernization", title: "Safeguarding a legacy-to-modern migration",
    overview: "Helping maintain expected system behaviour as legacy COBOL and DB2 components moved toward C# and SQL.",
    challenge: "A modernization effort must preserve business behaviour and data meaning—not just move code into a new stack.",
    contribution: "Contributed to COBOL-to-C# modernization, database migration validation, behavioural comparisons and defect verification.",
    focus: "Behavioural parity · Data validation · Regression thinking",
    tools: ["COBOL", "C#", "DB2 / SQL", "Azure DevOps"],
    theme: "blue"
  },
  {
    number: "02", category: "Test automation", title: "Making end-to-end checks repeatable",
    overview: "Creating frontend test coverage and connecting automated validation with development workflows.",
    challenge: "Teams need regression feedback they can repeat as features and dependencies evolve.",
    contribution: "Worked with Playwright and Protractor for end-to-end scenarios, alongside Azure DevOps CI/CD delivery processes.",
    focus: "Critical journeys · Automation maintainability · CI/CD feedback",
    tools: ["Playwright", "Protractor", "JavaScript", "CI/CD"],
    theme: "ochre"
  },
  {
    number: "03", category: "Performance & reliability", title: "Looking beyond functional correctness",
    overview: "Using performance tests and system resource analysis to spot potential bottlenecks.",
    challenge: "Passing a functional check is not enough if a system slows or becomes unstable under load.",
    contribution: "Used k6 and JMeter for performance testing and examined CPU and memory behaviour to understand reliability risks.",
    focus: "Load behaviour · Resource profiling · Early risk discovery",
    tools: ["k6", "JMeter", "CPU / Memory", "Azure DevOps"],
    theme: "sage"
  }
];

export const capabilities = [
  { number: "A", title: "Automation & test design", description: "Functional coverage built around real user paths and product requirements.", tools: ["Playwright", "Protractor", "Postman", "API testing", "End-to-end testing"] },
  { number: "B", title: "Performance thinking", description: "Understand how a system behaves when demand and resource constraints change.", tools: ["k6", "JMeter", "CPU profiling", "Memory profiling"] },
  { number: "C", title: "Engineering fluency", description: "Bridge testing and implementation in modern and legacy technology environments.", tools: ["C#", "JavaScript", "Angular", "SQL", "COBOL migration"] },
  { number: "D", title: "Delivery collaboration", description: "Work within iterative teams and make test feedback part of the release process.", tools: ["Azure DevOps", "CI/CD", "AWS", "Agile / Scrum"] },
];

export const experience = [
  { role: "Software Engineer in Test", company: "JSI", period: "Sep 2025 — Present", location: "Ottawa, ON", highlights: [] },
  { role: "Software Test Engineer", company: "Core Migration", period: "Sep 2024 — Sep 2025", location: "Greater Ottawa, ON", highlights: [
    "Mapped requirements into test coverage and test plans.",
    "Executed manual and automated checks; reproduced and verified defects.",
    "Surfaced product gaps during design and test cycles."
  ] },
  { role: "Consultant — Software Developer in Test", company: "Alithya (for Amazon Web Services)", period: "May 2022 — Jan 2024", location: "Montreal, QC", highlights: [
    "Contributed to COBOL-to-C# modernization and database migration validation.",
    "Built frontend test cases with Protractor and maintained Azure DevOps pipelines.",
    "Collaborated with an Agile development team."
  ] },
  { role: "Software Developer in Test", company: "GAOTek Inc.", period: "Dec 2021 — Mar 2022", location: "Toronto, ON", highlights: [] }
];

export const education = [
  { school: "Concordia University", degree: "M.Eng · Electrical, Electronics & Communications Engineering", period: "2020 — 2021" },
  { school: "UIET, Panjab University", degree: "B.E. · Information Technology", period: "2015 — 2019" }
];

export const certifications = [
  "AWS Certified Cloud Practitioner",
  "Microsoft Certified: M365 Fundamentals",
  "CCSK v5",
  "GradProSkills Leadership Essentials",
  "Certificate of Training in Software Development"
];

export const outsideWork = [
  { title: "Fusion cooking", text: "Experimenting with Indo-Chinese-Italian flavour combinations." },
  { title: "Interior design", text: "Finding balance in layouts, colour and visual detail." },
  { title: "Gardening", text: "A reminder that patient, consistent care makes things grow." }
];

export const learning = ["AI-assisted testing", "Scalable test architecture", "Modern Quality Engineering"];

/**
 * Toolbelt for the scrolling tools section. Only tools already evidenced above.
 * `kind` is the short label shown next to each tool.
 */
export const toolbelt = [
  { name: "Playwright", kind: "E2E" },
  { name: "Protractor", kind: "E2E" },
  { name: "Postman", kind: "API" },
  { name: "k6", kind: "PERF" },
  { name: "JMeter", kind: "PERF" },
  { name: "Azure DevOps", kind: "CI/CD" },
  { name: "AWS", kind: "CLOUD" },
  { name: "C#", kind: "LANG" },
  { name: "JavaScript", kind: "LANG" },
  { name: "Angular", kind: "UI" },
  { name: "SQL", kind: "DATA" },
  { name: "DB2", kind: "DATA" },
  { name: "COBOL", kind: "LEGACY" },
  { name: "CPU / Memory profiling", kind: "PERF" },
  { name: "Agile / Scrum", kind: "TEAM" },
];

/**
 * Metrics. RULE (enforced by tests/validate.mjs): every metric needs a `source`
 * saying where the number can be checked. A metric whose value is null is not shown.
 * Rupinder: fill in the null ones with real numbers and their source to publish them.
 */
export const metrics = [
  { value: 4, suffix: "+", label: "Years in software testing", source: "Experience timeline, Dec 2021 to present" },
  { value: 4, suffix: "", label: "Teams shipped quality for", source: "Experience timeline" },
  { value: 15, suffix: "", label: "Tools in the toolkit", source: "Toolbelt list" },
  { value: 5, suffix: "", label: "Certifications earned", source: "Certifications list" },
  { value: null, suffix: "+", label: "Test cases authored", source: "" },
  { value: null, suffix: "+", label: "Defects logged and verified", source: "" },
];
