// =====================================================================
//  EDIT THIS FILE TO UPDATE THE WEBSITE
//  Everything shown on the site comes from here. No coding needed —
//  just change the text between the quotes. Add links when ready.
// =====================================================================

export const profile = {
  initials: "RK",
  name: "Rupinder Kaur",
  role: "Software Developer in Test",
  tagline: "Automation & Quality Engineering",
  location: "Ottawa, Canada",
  // These cycle through the animated typewriter under her name.
  roles: [
    "Software Developer in Test",
    "Automation Engineer",
    "Quality Engineer",
    "AI-Testing Explorer",
  ],
  // A short, warm intro paragraph for the hero.
  intro:
    "I build and automate end-to-end test solutions that make software reliable, fast, and trustworthy — blending engineering precision with a designer's eye for detail.",
  // A personal motto, shown as a large animated line. Edit freely.
  motto: "Quality is not an act, it's a habit — built one test at a time.",
};

// Add real links whenever you're ready. Leave as "" to hide a button.
export const links = {
  email: "rupinder88uiet@gmail.com",
  linkedin: "https://www.linkedin.com/in/rupinderkkaur",
  github: "",         // e.g. "https://github.com/username"
  resume: "",         // e.g. "/resume.pdf"  (drop the file in /public)
};

export const about = {
  heading: "About",
  body: [
    "Results-driven Software Test Engineer / SDET with 3+ years in Quality Assurance and a year of Business Analysis exposure — pairing strong technical testing skills with real business understanding.",
    "I specialize in building automated, end-to-end test frameworks with Playwright and Protractor, and run performance testing with K6 and JMeter inside Azure DevOps CI/CD pipelines. I've contributed to legacy modernization and core-system migration projects, thriving in Agile, cross-functional teams.",
    "I'm passionate about continuous learning — currently expanding into scalable automation frameworks and AI-driven approaches to modern Quality Engineering.",
  ],
};

// Her creative life — cooking leads, as her main passion.
export const hobbies = [
  {
    icon: "pan",
    title: "Fusion Cooking",
    blurb:
      "My main craft outside code. I make the best Indo-Chinese-Italian fusion — combining systems that 'shouldn't' work, until they do, beautifully.",
  },
  {
    icon: "room",
    title: "Interior Design",
    blurb:
      "Composing spaces with balance, color, and intention. Good architecture is good architecture — code or room.",
  },
  {
    icon: "leaf",
    title: "Gardening",
    blurb:
      "Growing things slowly and patiently — the same discipline that makes a good test suite flourish.",
  },
];

// =====================================================================
//  RECIPE GALLERY
//  To add a dish: drop a photo into  public/recipes/  then add an
//  entry below. Keep images ~1000px wide for fast loading.
// =====================================================================
export const recipes = [
  {
    img: "/recipes/noodle-chicken.jpg",
    title: "Herb-Crusted Chicken Noodles",
    cuisine: "Italian × Chinese",
    blurb:
      "Italian-herbed grilled chicken over wok-tossed noodles, finished with scallions and fresh coriander.",
  },
  {
    img: "/recipes/paneer-bowl.jpg",
    title: "Masala Paneer Rice Bowl",
    cuisine: "Indian",
    blurb:
      "Spiced paneer masala with fluffy basmati, cooling yogurt, and crisp cucumber-and-carrot batons.",
  },
];

export const skills = [
  {
    group: "Automation & Testing",
    items: ["Playwright", "Protractor", "Test Management", "Postman API", "End-to-End Testing"],
  },
  {
    group: "Performance",
    items: ["K6", "JMeter", "CPU / Memory Profiling"],
  },
  {
    group: "Languages & Frameworks",
    items: ["C#", "JavaScript", "Angular", "SQL", "COBOL → C# Migration"],
  },
  {
    group: "DevOps & Cloud",
    items: ["Azure DevOps", "CI/CD Pipelines", "AWS", "Infrastructure"],
  },
];

export const experience = [
  {
    company: "JSI",
    role: "Software Engineer in Test",
    period: "Sep 2025 — Present",
    location: "Ottawa, ON",
    points: [],
  },
  {
    company: "Core Migration",
    role: "Software Test Engineer",
    period: "Sep 2024 — Sep 2025",
    location: "Greater Ottawa, ON",
    points: [
      "Identified test requirements from specifications and designed test coverage plans.",
      "Executed and evaluated manual and automated test cases, reporting results.",
      "Proactively surfaced product gaps during feature design and testing phases.",
      "Isolated, replicated, reported, and verified defects against design specs.",
    ],
  },
  {
    company: "Alithya (for Amazon Web Services)",
    role: "Consultant — Software Developer in Test",
    period: "May 2022 — Jan 2024",
    location: "Montreal, QC",
    points: [
      "Modernized legacy COBOL to clean, efficient C# using internal tooling.",
      "Migrated SQL DB2 to SQL, comparing databases and validating legacy behaviour.",
      "Built and automated frontend test cases with Protractor; ran end-to-end testing.",
      "Maintained Azure DevOps CI/CD pipelines for fast, reliable delivery.",
      "Collaborated in a SCRUM team of 5–7, mentoring engineers and sharing knowledge.",
    ],
  },
  {
    company: "GAOTek Inc.",
    role: "Software Developer in Test",
    period: "Dec 2021 — Mar 2022",
    location: "Toronto, ON",
    points: [],
  },
];

export const projects = [
  {
    title: "Legacy Core System Migration",
    tag: "Modernization",
    blurb:
      "Migrated a finance client's legacy COBOL application to modern C#, including SQL DB2 → SQL database migration with rigorous behavioural comparison and defect verification.",
    stack: ["C#", "COBOL", "SQL", "Azure DevOps"],
  },
  {
    title: "End-to-End Automation Framework",
    tag: "Automation",
    blurb:
      "Designed and automated end-to-end test coverage with Playwright & Protractor, integrated into CI/CD pipelines for fast, reliable release validation.",
    stack: ["Playwright", "Protractor", "CI/CD"],
  },
  {
    title: "Performance & Reliability Testing",
    tag: "Performance",
    blurb:
      "Built performance test suites with K6 and JMeter, profiling CPU and memory usage to surface bottlenecks before they reached production.",
    stack: ["K6", "JMeter", "Azure DevOps"],
  },
];

export const certifications = [
  "AWS Certified Cloud Practitioner",
  "Microsoft Certified: M365 Fundamentals",
  "CCSK v5",
  "GradProSkills Leadership Essentials",
  "Certificate of Training in Software Development",
];

export const education = [
  {
    school: "Concordia University",
    degree: "M.Eng, Electrical, Electronics & Communications Engineering",
    period: "2020 — 2021",
  },
  {
    school: "UIET, Panjab University",
    degree: "B.E, Information Technology",
    period: "2015 — 2019",
  },
];

// Forward-looking "Currently exploring" strip.
export const learning = [
  "AI-powered Testing",
  "Scalable Automation Frameworks",
  "Modern Quality Engineering",
];

// Languages — shown with proficiency labels.
export const languages = [
  { name: "English", level: "Full Professional" },
  { name: "Hindi", level: "Native / Bilingual" },
  { name: "Punjabi", level: "Native / Bilingual" },
  { name: "French", level: "Elementary" },
];