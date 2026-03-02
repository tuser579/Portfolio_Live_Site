import project1Img from "../public/Screenshot_2026_03_02_103034 (2).png";
import project2Img from "../public/Gemini_Generated_Image_hgtlmvhgtlmvhgtl.png";
import project3Img from "../public/vercel.svg";

// ─── Projects ───────────────────────────────────────────────
export const projects = [
  {
    id: "cityfix",
    name: "CityFix — Public Issue Reporting",
    image: project1Img,
    shortDescription:
      "Empower citizens to report and track infrastructure issues — bridging communities and municipal services for faster, transparent resolutions.",
    description:
      "CityFix is a full-stack public issue reporting platform that connects citizens with municipal authorities. Users can report infrastructure problems (potholes, broken streetlights, garbage buildup, etc.), attach photos, and track the status of their reports in real-time. The platform features role-based access control with three user types: citizens, municipal staff, and admins. Citizens can vote on important issues to prioritize municipal actions, while staff can update issue statuses (Pending → In-Progress → Working → Resolved → Closed). The system includes email notifications, an analytics dashboard for city administrators, and a gamification system that rewards active community participants with badges and recognition.",
    techStack: [
      "React",
      "Node.js",
      "Express.js",
      "MongoDB",
      "Tailwind CSS",
      "JWT Authentication",
      "React Query",
      "Framer Motion",
      "React Leaflet",
    ],
    liveLink: "https://city-fix-assignment-11.web.app",
    githubLink: "https://github.com/tuser579/client_side_assignment-11",
    challenges: [
      "Implementing complex role-based access control with three distinct user types (citizen, staff, admin) and different permissions",
      "Building a real-time status tracking system with a multi-stage workflow (Pending → In-Progress → Working → Resolved → Closed)",
      "Integrating map functionality with React Leaflet for visualizing issue locations across different regions",
      "Designing a voting system that prioritizes issues based on community engagement without enabling abuse",
      "Creating a gamification system with badges and recognition that encourages sustained participation",
    ],
    improvements: [
      "Add real-time notifications using WebSockets for instant status updates",
      "Implement AI-powered issue categorization and duplicate detection",
      "Add mobile app versions using React Native",
      "Integrate with government systems for automated ticket creation",
      "Add offline support for reporting issues in areas with poor connectivity",
      "Implement predictive analytics to identify infrastructure trends before they become critical",
    ],
  },
  {
    id: "carrental",
    name: "RentWheels – Car Rental Platform",
    image: project2Img,
    shortDescription:
      "A comprehensive car rental platform with real-time booking, vehicle tracking, and secure payments.",
    description:
      "RentWheels is a full-stack car rental platform that allows users to browse available vehicles, make reservations, and manage their rentals. Features include real-time vehicle availability, secure payment processing, booking history, and admin dashboard for fleet management. Users can filter cars by type, price, and location, with integrated Google Maps for pickup/dropoff locations.",
    techStack: [
      "React",
      "Node.js",
      "Express.js",
      "MongoDB",
      "JWT Authentication",
    ],
    liveLink: "https://rentwheels-demo.vercel.app/",
    githubLink: "https://github.com/username/rentwheels",
    challenges: [
      "Implementing real-time vehicle availability updates to prevent double bookings",
      "Integrating secure payment processing with Stripe",
      "Building a responsive admin dashboard for fleet management",
      "Optimizing search and filter functionality for large vehicle databases",
    ],
    improvements: [
      "Add real-time vehicle tracking with GPS integration",
      "Implement a loyalty program with rewards and discounts",
      "Add multi-language support for international users",
      "Integrate AI-powered vehicle recommendations",
    ],
  },
];

// ─── Skills ─────────────────────────────────────────────────
export const skills = [
  { name: "HTML/CSS", level: 95, category: "frontend" },
  { name: "Tailwind CSS", level: 90, category: "frontend" },
  { name: "JavaScript (ES6+)", level: 95, category: "frontend" },
  { name: "React", level: 92, category: "frontend" },
  { name: "Next.js", level: 85, category: "frontend" },
  //   { name: "TypeScript",         level: 80, category: "frontend"  },
  { name: "Node.js", level: 88, category: "backend" },
  { name: "Express.js", level: 87, category: "backend" },
  { name: "REST APIs", level: 90, category: "backend" },
  { name: "MongoDB", level: 85, category: "database" },
  { name: "Firebase", level: 78, category: "database" },
  { name: "Vercel", level: 85, category: "tools" },
  { name: "Netlify", level: 80, category: "tools" },
  { name: "Git/GitHub", level: 90, category: "tools" },
  { name: "VS Code", level: 92, category: "tools" },
];

// ─── Experience ──────────────────────────────────────────────
export const experiences = [
  {
    role: "Full Stack Developer",
    company: "Tech Solutions Inc.",
    duration: "Jan 2023 — Present",
    description:
      "Building scalable web applications using the MERN stack. Leading frontend architecture decisions and mentoring junior developers.",
    highlights: [
      "Led migration to Next.js improving performance by 40%",
      "Built REST APIs serving 10K+ daily users",
      "Implemented CI/CD pipelines with GitHub Actions",
    ],
  },
  {
    role: "Frontend Developer Intern",
    company: "StartupHub",
    duration: "Jun 2022 — Dec 2022",
    description:
      "Developed responsive web interfaces and contributed to the company's design system.",
    highlights: [
      "Created reusable component library with 30+ components",
      "Reduced bundle size by 35% through code splitting",
      "Collaborated with UX team on accessibility improvements",
    ],
  },
];

// ─── Education ───────────────────────────────────────────────
export const education = [
  {
    degree: "Bachelor of Science in Computer Science",
    institution: "Daffodil International University",
    duration: "2024 — Present",
    description:
      "Focused on software engineering, data structures, and web technologies. Graduated with honors.",
  },
  {
    degree: "Higher Secondary Certificate (HSC)",
    institution: "Shah Mokhdum College",
    duration: "2020 — 2021",
    description:
      "Science stream with a focus on Mathematics and Computer Science.",
  },
];
