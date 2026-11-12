/**
 * Work history shown on the home page timeline.
 * Source: LinkedIn profile export (Profile.pdf), November 2026.
 * Keep this in sync with LinkedIn when roles change.
 */

export type Role = {
  title: string;
  /** Display range, e.g. "Jul 2026 – Present". */
  period: string;
};

export type Experience = {
  company: string;
  /** Short context line under the company name. */
  context?: string;
  location?: string;
  current?: boolean;
  roles: Role[];
  highlights: string[];
  tags: string[];
};

export const EXPERIENCE: Experience[] = [
  {
    company: "Proxta Global Systems",
    context: "UtilConnect, a cloud-native utility billing platform",
    location: "Remote",
    current: true,
    roles: [{ title: "Founding Technical Lead", period: "Jul 2026 – Present" }],
    highlights: [
      "Own technical architecture, product development and release management end to end.",
      "Drive cloud, security and scalability strategy; lead technical discovery and solution design for customers.",
      "Set engineering standards and mentor the team as it scales toward a larger leadership structure.",
    ],
    tags: ["Architecture", "Cloud", "Leadership"],
  },
  {
    company: "Freelance",
    location: "Pune",
    roles: [{ title: "Software Engineering Consultant", period: "Jan 2026 – Jul 2026" }],
    highlights: [
      "Structured front-end applications in React and Angular and set up CI/CD.",
      "Handled deployments, monitoring and telemetry, and guided teams to maintain them.",
      "Pre-sales: estimated project flows and managed engineering artifacts.",
    ],
    tags: ["React", "Angular", "CI/CD"],
  },
  {
    company: "EPAM Systems",
    context: "Insurance domain client",
    location: "Pune",
    roles: [{ title: "Senior Software Engineer III", period: "Jun 2022 – Aug 2025" }],
    highlights: [
      "Independently led an engineering pod: sprint planning, stakeholder handoffs, 1:1s and coaching.",
      "Introduced 20+ tech-debt initiatives across performance, security and accessibility.",
      "Delivered a digital forms transformation, Cypress E2E testing and performance optimisations.",
    ],
    tags: ["React", "TypeScript", "Cypress"],
  },
  {
    company: "Excellarate",
    location: "Pune",
    roles: [
      { title: "Team Lead", period: "Jan 2021 – Jun 2022" },
      { title: "Senior Software Engineer", period: "May 2019 – Jan 2022" },
    ],
    highlights: [
      "Led a team of 5 full-stack developers through a resource crunch, acting as Scrum Master.",
      "Shipped a façade microservice to address security concerns; built APIs for PDF export and Excel import; managed AWS environments.",
      "Built React features with MobX and GraphQL, a Node.js PDF microservice, and an Angular real-time dashboard with Socket.IO.",
    ],
    tags: ["React", "Node.js", "AWS"],
  },
  {
    company: "Training & mentoring",
    context: "Skill-Lync · Monjin · Cybage",
    roles: [
      { title: "Frontend & cloud track trainer, Skill-Lync", period: "Jan 2022 – Nov 2022" },
      { title: "JavaScript SME & interviewer, Monjin", period: "Apr 2021 – Apr 2022" },
      { title: "Technical trainer, Cybage", period: "Apr 2016 – Aug 2019" },
    ],
    highlights: [
      "Designed and delivered frontend and cloud training with live sessions and project-based mentoring.",
      "Ran technical interviews and candidate evaluations as a JavaScript subject-matter expert.",
      "Trained graduates and lateral hires for production work and built a talent pipeline.",
    ],
    tags: ["Teaching", "Hiring", "JavaScript"],
  },
  {
    company: "Cybage Software",
    context: "athenahealth · TravelClick",
    location: "Pune",
    roles: [
      { title: "Senior Software Engineer", period: "Mar 2016 – Apr 2019" },
      { title: "Software Engineer", period: "Oct 2012 – Mar 2016" },
    ],
    highlights: [
      "Led a team of 4 developers delivering complex UI modules in Angular 5.",
      "Built reusable JavaScript libraries and advanced UI with Canvas, SVG, D3.js and Chart.js.",
      "Started as a Perl developer on web applications for athenahealth.",
    ],
    tags: ["Angular", "JavaScript", "D3.js"],
  },
];

export const EDUCATION = [
  { name: "C-DAC", detail: "Postgraduate diploma, Computer Science", period: "2011 – 2012" },
  { name: "Pune University", detail: "B.E., Electrical, Electronic & Communications Engineering", period: "2007 – 2011" },
];

export const CERTIFICATIONS = [
  "Scrum Master Certificate of Proficiency",
  "JavaScript: Patterns",
  "HackerRank React (Basic)",
  "Learning the OWASP Top 10",
];

/** Numbers shown in the stats strip. Every figure comes from the LinkedIn profile. */
export const STATS = [
  { value: "10+", label: "years building for the web" },
  { value: "20+", label: "tech-debt initiatives led at EPAM" },
  { value: "5", label: "engineers led as team lead" },
  { value: "3", label: "training programs delivered" },
];
