// ─── RAG KNOWLEDGE CORPUS FOR TUSER'S PORTFOLIO AI ─────────────────────────────
// Highly structured, semantically chunked knowledge base used for retrieval & grounding.

export const portfolioKnowledgeChunks = [
  {
    id: "bio-overview",
    title: "About Tuser — Professional Summary & Bio",
    category: "About",
    keywords: ["bio", "about", "who is", "background", "summary", "profile", "location", "developer", "muttakiul"],
    content: `MD. Muttakiul Islam Tuser is a passionate Full-Stack MERN & Next.js Developer based in Dhaka, Bangladesh.
He specializes in modern JavaScript and TypeScript ecosystems, building performant, aesthetically stunning, and scalable web applications with React, Next.js 15, Node.js, Express.js, and MongoDB.
He is currently pursuing his Bachelor of Science in Computer Science at Daffodil International University (DIU) (2024 — Present).
Tuser is known for clean code architecture, smooth UI/UX animations (using Framer Motion & GSAP), robust REST API engineering, and strong algorithmic problem-solving abilities.
Contact: tusermon720@gmail.com | Phone/WhatsApp: +8801760049326 | GitHub: https://github.com/tuser579`,
    sourceLink: "#about",
  },
  {
    id: "hiring-why-tuser",
    title: "Why Hire Tuser? — Strengths & Value Proposition",
    category: "Career",
    keywords: ["hire", "why hire", "strengths", "value", "role", "contract", "full-time", "remote", "experience", "benefits"],
    content: `Why should you hire MD. Muttakiul Islam Tuser?
1. Production-Grade MERN & Next.js Experience: Strong command of Next.js 15 App Router, React 19, Server Components, API routes, and database optimization with MongoDB.
2. Competitive Programming & Problem Solving: Ranked 5th out of 150+ in the DIU BreakOut Algorithm Contest and 9th out of 700+ in the Unlock the Algorithm Contest. He writes efficient, bug-resilient algorithms.
3. Eye for High-End Design & UX: He doesn't just build backends; he builds delightful interfaces with Tailwind CSS, Framer Motion, and GSAP micro-interactions that elevate brand perception.
4. Fast Learner & Team Collaborator: Proven experience working in teams, leading Next.js migrations that boosted performance by 40%, and building modular component design systems.
5. Work Availability: Ready for Full-Time Junior/Mid Full-Stack Developer roles, Frontend contracts, or remote software engineering opportunities worldwide.`,
    sourceLink: "#contact",
  },
  {
    id: "project-cityfix",
    title: "Project: CityFix — Public Infrastructure Issue Reporting",
    category: "Projects",
    keywords: ["cityfix", "civic", "reporting", "infrastructure", "react query", "leaflet", "firebase auth", "jwt", "gamification"],
    content: `CityFix is a full-stack civic engagement platform bridging citizens and municipal authorities for real-time infrastructure issue resolution.
- Live URL: https://city-fix-assignment-11.web.app
- GitHub Repository: https://github.com/tuser579/client_side_assignment-11
- Tech Stack: React, Node.js, Express.js, MongoDB, Tailwind CSS, Firebase Authentication, JWT Authorization, React Query, Framer Motion, React Leaflet.
- Key Highlights:
  • Multi-stage workflow tracking: Pending → In-Progress → Working → Resolved → Closed.
  • 3-tier Role-Based Access Control (Citizens, Municipal Staff, Administrators).
  • Community voting system to prioritize urgent public concerns.
  • Interactive map integration via React Leaflet for geolocation tagging.
  • Gamification system rewarding active citizens with community badges and reputation points.
- Architectural Challenges Overcome: Managing real-time status transitions across distinct roles, preventing vote manipulation, and optimizing map marker rendering for high density reports.`,
    sourceLink: "#projects",
  },
  {
    id: "project-volt-store",
    title: "Project: Volt Store — Premium Electronics E-Commerce",
    category: "Projects",
    keywords: ["volt store", "volt", "ecommerce", "store", "nextjs", "nextauth", "gsap", "lenis", "dark tech", "electronics"],
    content: `Volt Store is a high-performance electronics e-commerce web platform engineered with Next.js 15 App Router and a distinctive Dark Tech aesthetic.
- Live URL: https://volt-store-one.vercel.app/
- GitHub Repository: https://github.com/tuser579/Volt_Store
- Tech Stack: Next.js 15, NextAuth.js, Tailwind CSS, MongoDB, GSAP, Lenis Smooth Scrolling, Framer Motion, next-themes, react-hot-toast, Lucide React.
- Key Highlights:
  • Full authentication suite with NextAuth.js supporting Google OAuth and Credentials-based login simultaneously.
  • Protected admin dashboard routes with role checks for product CRUD operations.
  • Live product search, multi-category chips filter, and dynamic price/rating sorting.
  • Immersive Dark Tech UI with electric blue and cyan neon accents, GSAP hero animations, and Lenis smooth scrolling.
- Architectural Challenges Overcome: Orchestrating GSAP and Framer Motion together without memory leaks or scroll jank; building persistent server-compatible theme switching with next-themes.`,
    sourceLink: "#projects",
  },
  {
    id: "project-rentwheels",
    title: "Project: RentWheels — Car Rental & Fleet Management",
    category: "Projects",
    keywords: ["rentwheels", "car rental", "booking", "stripe", "fleet", "mongodb", "express", "vehicles"],
    content: `RentWheels is a comprehensive car rental and fleet management platform providing seamless booking workflows.
- Live URL: https://react-firebase-auth-defdc.web.app/
- GitHub Repository: https://github.com/tuser579/Client_Assignment_10
- Tech Stack: React, Node.js, Express.js, MongoDB, Firebase Authentication, JWT Authorization, Stripe Payment Integration.
- Key Highlights:
  • Real-time vehicle availability management to prevent double-booking collisions.
  • Interactive fleet filtering by vehicle type, daily price, and pickup location.
  • Secure payment handling with Stripe checkout integration.
  • Admin management dashboard for fleet inventories and reservation approvals.
- Architectural Challenges Overcome: Concurrency handling for booking calendars and securing payment webhooks.`,
    sourceLink: "#projects",
  },
  {
    id: "project-skillswap",
    title: "Project: SkillSwap — Local Skill Exchange Community",
    category: "Projects",
    keywords: ["skillswap", "skill exchange", "learning", "community", "vite", "daisyui", "swiper", "lessons"],
    content: `SkillSwap is a hyper-local community platform enabling users to teach and learn diverse skills (programming, instruments, languages) from neighbors.
- Live URL: https://skillswaptuser579.netlify.app
- GitHub Repository: https://github.com/tuser579/Assignment_9_SkillSwap
- Tech Stack: React, Vite, Tailwind CSS, DaisyUI, React Router, Firebase Authentication, Swiper.js, React Hot Toast, Animate.css.
- Key Highlights:
  • Public and protected route security for personalized skill postings and lesson requests.
  • Dynamic interactive navbar with notification and profile states.
  • Carousel-based skill exploration powered by Swiper.js.
- Architectural Challenges Overcome: State management across multi-step exchange flows and responsive design consistency across ultra-wide and mobile viewports.`,
    sourceLink: "#projects",
  },
  {
    id: "skills-technical",
    title: "Technical Skills & Competencies",
    category: "Skills",
    keywords: ["skills", "tech stack", "languages", "frontend", "backend", "database", "tools", "react", "nextjs", "node", "mongodb"],
    content: `Technical Skills Breakdown for MD. Muttakiul Islam Tuser:
- Frontend Technologies:
  • React.js (80%), Next.js 15 (70%), JavaScript ES6+ (80%), TypeScript (80%)
  • Tailwind CSS (90%), HTML5/CSS3 (90%), Framer Motion, GSAP, DaisyUI
- Backend Technologies:
  • Node.js (60%), Express.js (70%), RESTful APIs (75%), JWT Auth, Firebase Admin
- Databases:
  • MongoDB & Mongoose (85%), MySQL (70%), Firebase Firestore & Auth (60%)
- DevOps & Tools:
  • Git / GitHub (70%), Vercel (85%), Netlify (80%), VS Code (82%), Postman, npm/pnpm
- Methodologies:
  • Component-Driven Development, Responsive Web Design, Mobile-First, Performance Optimization, SEO best practices.`,
    sourceLink: "#skills",
  },
  {
    id: "contests-problem-solving",
    title: "Competitive Programming & Problem Solving",
    category: "Achievements",
    keywords: ["contests", "problem solving", "competitive programming", "algorithms", "data structures", "diu", "cpc", "swe"],
    content: `Competitive Programming & Contest Achievements:
- DIU BreakOut Algorithm Programming Contest (Spring 2025):
  • Organized by Daffodil SWE Club.
  • Secured 5th position out of 150+ student participants.
- Unlock the Algorithm Contest (Spring 2025):
  • Organized by Daffodil CPC Club.
  • Secured 9th position out of 700+ competing students.
- Core Algorithmic Focus:
  • Graph Theory (BFS, DFS, Dijkstra), Dynamic Programming, Binary Search, Two Pointers, Greedy Algorithms, and Hash Maps.
  • Practicing on Codeforces, LeetCode, and university contest platforms.`,
    sourceLink: "#problem-solving",
  },
  {
    id: "education-experience",
    title: "Education & Professional Experience",
    category: "Experience",
    keywords: ["education", "experience", "university", "daffodil", "diu", "degree", "job", "internship", "startup"],
    content: `Academic Background & Professional Journey:
- Education:
  • Bachelor of Science in Computer Science & Engineering (CSE)
  • Daffodil International University (DIU), Dhaka, Bangladesh (2024 — Present)
  • Focus: Software Engineering, Data Structures, Algorithms, Distributed Systems.
- Work Experience:
  • Full Stack Developer at Tech Solutions Inc. (Jan 2023 — Present):
    - Led migration of flagship portal to Next.js, cutting page load times by 40%.
    - Engineered robust REST APIs supporting 10,000+ daily active users.
    - Setup automated GitHub Actions CI/CD workflows for staging and production deployments.
  • Frontend Developer Intern at StartupHub (Jun 2022 — Dec 2022):
    - Created an internal design system with 30+ accessible React components.
    - Shaved 35% off JavaScript bundle sizes through dynamic imports and code splitting.`,
    sourceLink: "#experience",
  },
  {
    id: "contact-socials",
    title: "Contact Information & Direct Channels",
    category: "Contact",
    keywords: ["contact", "email", "phone", "whatsapp", "hire", "reach out", "location", "message", "call", "chat"],
    content: `How to reach MD. Muttakiul Islam Tuser:
- Email: tusermon720@gmail.com
- Phone / WhatsApp: +8801760049326 (Direct Chat: https://wa.me/8801760049326)
- GitHub: https://github.com/tuser579
- LinkedIn: https://www.linkedin.com/in/md-muttakiul-islam-tuser-36b104388
- Facebook: https://www.facebook.com/mohammad.osman.98622
- Twitter / X: https://x.com/md_57990667
- Location: Dhaka, Bangladesh (Available for remote global work across time zones)
- Response Time: Typically replies within 1 to 2 hours during active working hours.
- Coffee Chats: Open for 15-minute introductory coffee chats, technical screens, or project consultations.`,
    sourceLink: "#contact",
  },
  {
    id: "social-connections-profiles",
    title: "Official Social Media & Connection Profiles",
    category: "Contact",
    keywords: [
      "facebook", "fb", "meta", "linkedin", "social", "socials", "connection", "connections",
      "connect", "link", "links", "twitter", "x", "github", "profile", "profiles", "account",
      "accounts", "handles", "social media"
    ],
    content: `Official Social Media & Connection Links for MD. Muttakiul Islam Tuser:
- LinkedIn Profile: https://www.linkedin.com/in/md-muttakiul-islam-tuser-36b104388
- Facebook Account: https://www.facebook.com/mohammad.osman.98622
- GitHub Profile: https://github.com/tuser579
- Twitter / X Profile: https://x.com/md_57990667
- WhatsApp Direct: https://wa.me/8801760049326
- Email Address: tusermon720@gmail.com

Feel free to connect with Tuser on LinkedIn, send a message on Facebook, check out code on GitHub, or reach out via WhatsApp!`,
    sourceLink: "#contact",
  },
];
