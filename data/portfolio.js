import project1Img from "../public/Gemini_Generated_Image_lh7y8olh7y8olh7y.png";
import project2Img from "../public/Gemini_Generated_Image_hgtlmvhgtlmvhgtl.png";
import project3Img from "../public/Gemini_Generated_Image_aak1x6aak1x6aak1.png";
import project4Img from "../public/Gemini_Generated_Image_oyoorxoyoorxoyoo.png";

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
      "Firebase Authentication",
      "JWT Authorization",
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
    id: "volt-store",
    name: "Volt Store — Premium Electronics E-Commerce",
    image: project4Img,
    shortDescription:
      "A polished, full-featured electronics e-commerce platform with authentication, protected routes, dark/light mode, and a premium Dark Tech UI theme.",
    description:
      "Volt Store is a premium electronics e-commerce application built with Next.js 15 App Router. It features a complete authentication system powered by NextAuth.js supporting both Google OAuth and credentials-based login. The platform includes protected dashboard routes for adding and managing products, a live product search and filter system with category chips and sorting, and a fully responsive layout across all screen sizes. The UI adopts a Dark Tech theme with a deep navy black background, electric blue primary accents, and cyan highlights. Smooth user experiences are achieved through GSAP hero animations, Framer Motion page transitions and modals, and Lenis smooth scrolling. Product management is handled through dedicated dashboard pages with confirmation modals and toast notifications for all actions.",
    techStack: [
      "Next",
      "NextAuth",
      "Tailwind",
      "MongoDb",
      "GSAP",
      "Lenis",
      "next-themes",
      "react-hot-toast",
      "lucide-react",
    ],
    liveLink: "https://volt-store-one.vercel.app/",
    githubLink: "https://github.com/tuser579/Volt_Store",
    challenges: [
      "Implementing secure authentication with NextAuth.js supporting both Google OAuth and credentials providers simultaneously",
      "Building protected dashboard routes that seamlessly redirect unauthenticated users to login while preserving intended destinations",
      "Orchestrating multiple animation libraries (GSAP, Framer Motion, Lenis) together without conflicts or performance degradation",
      "Designing a persistent dark/light mode system using next-themes that survives page reloads and respects system preferences",
      "Creating a live product search and filter system with category chips and sorting that remains performant across large catalogs",
    ],
    improvements: [
      "Integrate a real database (PostgreSQL or MongoDB) to replace static product data with persistent storage",
      "Add a full shopping cart and checkout flow with Stripe payment processing",
      "Implement product reviews and ratings with moderation tools for admins",
      "Add real-time inventory tracking and low-stock alerts for store managers",
      "Build a wishlist feature with shareable links for social commerce",
      "Introduce AI-powered product recommendations based on browsing and purchase history",
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
      "Firebase Authentication",
      "JWT Authorization",
    ],
    liveLink: "https://react-firebase-auth-defdc.web.app/",
    githubLink: "https://github.com/tuser579/Client_Assignment_10",
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
  {
    id: "skillswap",
    name: "SkillSwap – Local Skill Exchange Platform",
    image: project3Img,
    shortDescription:
      "A community-driven platform to share and learn skills locally. Offer lessons, find learning opportunities, and connect with others nearby.",
    description:
      "SkillSwap is a local skill exchange platform designed to help people share and learn skills within their community. Users can offer lessons, find learning opportunities, and connect with others nearby, making learning more personal, affordable, and community-driven. The platform features a comprehensive authentication system, public and private routes, a dynamic navbar, and a protected footer. It allows users to browse popular skills like Guitar Lessons, Python Programming, and Web Design, and connect with top-rated providers.",
    techStack: [
      "React",
      "Vite",
      "Tailwind CSS",
      "DaisyUI",
      "React Router",
      "Firebase Authentication",
      "Swiper.js",
      "React Hot Toast",
      "React Toastify",
      "Animate.css",
      "Lucide React",
    ],
    liveLink: "https://skillswaptuser579.netlify.app",
    githubLink: "https://github.com/tuser579/Assignment_9_SkillSwap",
    challenges: [
      "Implementing a secure and seamless authentication system with Firebase",
      "Creating dynamic and private routes to protect user-specific content",
      "Building a responsive and interactive UI with Tailwind CSS and DaisyUI that works across all devices",
      "Integrating smooth animations and transitions using Animate.css and Swiper.js for a modern user experience",
      "Managing application state effectively across different routes and components",
    ],
    improvements: [
      "Add a real-time messaging system for users to communicate directly",
      "Implement a review and rating system for skills and providers",
      "Create a user profile page with skill listings and past exchanges",
      "Add a search and filter functionality to find skills by category or location",
      "Integrate a calendar for scheduling lessons or sessions",
      "Implement a points or reputation system to encourage positive contributions",
    ],
  },
];

// ─── Skills ─────────────────────────────────────────────────
export const skills = [
  { name: "HTML/CSS", level: 90, category: "frontend" },
  { name: "Tailwind CSS", level: 90, category: "frontend" },
  { name: "JavaScript (ES6+)", level: 80, category: "frontend" },
  { name: "React", level: 80, category: "frontend" },
  { name: "Next.js", level: 70, category: "frontend" },
  //   { name: "TypeScript",         level: 80, category: "frontend"  },
  { name: "Node.js", level: 60, category: "backend" },
  { name: "Express.js", level: 70, category: "backend" },
  { name: "REST APIs", level: 75, category: "backend" },
  { name: "MongoDB", level: 85, category: "database" },
  { name: "Firebase", level: 60, category: "database" },
  { name: "Vercel", level: 85, category: "tools" },
  { name: "Netlify", level: 80, category: "tools" },
  { name: "Git/GitHub", level: 70, category: "tools" },
  { name: "VS Code", level: 82, category: "tools" },
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
    institution: "Daffodil International University (DIU)",
    duration: "2024 — Present",
    description:
      "Focused on software engineering, data structures, and web technologies. Graduated with honors.",
  },
];

// Cerficate
export
  const certifications = [
    {
      title: "Participated — Unlock the Algorithm Contest",
      issuer: "Daffodil CPC Club",
      date: "Spring 2025",
      description: "Secured 9th position out of 700+ students.",
      credentialUrl: "https://drive.google.com/file/d/1uJljQwQD6rjtP5NIRepXvPEAGc6-sXBp/view?usp=drive_link",
    },
    {
      title: "Participated — DIU BreakOut Algorithm Programming Contest",
      issuer: "Daffodil SWE Club",
      date: "Spring 2025",
      description: "Secured 5th position out of 150+ students.",
      credentialUrl: "https://drive.google.com/file/d/1pTkHkPkntcBpnNDSq7YTr3SComSJIYzR/view?usp=drive_link",
    },
  ];
