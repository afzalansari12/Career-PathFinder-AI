// frontend/src/lib/learningPathEngine.ts

import {
  LearnerProfile,
  StructuredLearningPath,
  SkillGap,
  CourseRecommendation,
  ProjectRecommendation,
  ResourceRecommendation,
  LearningStats,
  LearningPhase,
} from "@/types/learningPath";

const PROFILE_STORAGE_KEY = "pathfinder_learner_profile";
const PATH_STORAGE_KEY = "pathfinder_active_learning_path";

export const DEFAULT_PROFILE: LearnerProfile = {
  targetGoal: "Software Engineer",
  experienceLevel: "Intermediate",
  knownSkills: [
    { name: "JavaScript", level: 4, verified: true },
    { name: "React", level: 3, verified: true },
    { name: "HTML/CSS", level: 4, verified: true },
    { name: "Python", level: 2, verified: false },
    { name: "Node.js", level: 2, verified: false },
  ],
  targetSkills: [
    { name: "Data Structures & Algorithms", level: 4 },
    { name: "TypeScript & Object-Oriented Design", level: 4 },
    { name: "PostgreSQL & Database Indexing", level: 4 },
    { name: "System Design & Caching (Redis)", level: 4 },
    { name: "Microservices & Docker", level: 4 },
    { name: "CI/CD & Cloud Infrastructure", level: 4 },
  ],
  interests: ["Software Architecture", "Full Stack Development", "Distributed Systems"],
  completedCourses: [
    {
      id: "course-c1",
      title: "Complete Web Development Bootcamp",
      platform: "Udemy",
      dateCompleted: "2025-11-15",
      rating: 5,
      keySkillsLearned: ["HTML", "CSS", "JavaScript", "React Basics"],
    },
  ],
  preferences: {
    pace: "Standard",
    style: "Project-Based",
    hoursPerWeek: 10,
  },
  skillGaps: [],
  lastUpdated: new Date().toISOString(),
};

export function getRoleTargetSkills(role: string) {
  const r = role.toLowerCase();
  if (r.includes("ai") || r.includes("machine learning") || r.includes("ml")) {
    return [
      { name: "Python & Numerical Computing (NumPy/Pandas)", level: 5 },
      { name: "Deep Learning & PyTorch Models", level: 4 },
      { name: "LLMs & RAG Architectures (LangChain/LlamaIndex)", level: 4 },
      { name: "Vector Databases & Embeddings (Pinecone/Qdrant)", level: 4 },
      { name: "MLOps & Model Serving (FastAPI/Docker/Triton)", level: 4 },
    ];
  } else if (r.includes("devops") || r.includes("cloud") || r.includes("sre")) {
    return [
      { name: "Linux System Administration & Networking", level: 4 },
      { name: "Docker Containerization & Image Hardening", level: 5 },
      { name: "Infrastructure as Code (Terraform)", level: 4 },
      { name: "Kubernetes Orchestration & Helm", level: 5 },
      { name: "CI/CD Pipelines & Prometheus Telemetry", level: 4 },
    ];
  } else if (r.includes("frontend") || r.includes("web developer")) {
    return [
      { name: "Modern ESNext JavaScript & TypeScript", level: 5 },
      { name: "React 19 & Next.js App Router", level: 5 },
      { name: "Tailwind CSS & Component Architecture", level: 4 },
      { name: "Web Performance & Core Web Vitals (INP/LCP)", level: 4 },
      { name: "Design Systems & E2E Testing (Playwright)", level: 4 },
    ];
  } else if (r.includes("data") || r.includes("data scientist")) {
    return [
      { name: "SQL & Data Warehousing (BigQuery/Snowflake)", level: 5 },
      { name: "Feature Engineering & Scikit-Learn", level: 4 },
      { name: "Distributed Data Processing (Apache Spark)", level: 4 },
      { name: "Data Pipeline Orchestration (dbt/Airflow)", level: 4 },
      { name: "Statistical Modeling & A/B Testing", level: 4 },
    ];
  } else if (r.includes("mobile") || r.includes("android") || r.includes("ios")) {
    return [
      { name: "Swift / Kotlin & Mobile OOP Architecture", level: 5 },
      { name: "Cross-Platform Frameworks (React Native/Flutter)", level: 5 },
      { name: "Native Device APIs & Location Services", level: 4 },
      { name: "Offline Database Sync & SQLite", level: 4 },
      { name: "App Store Publishing & Mobile CI/CD", level: 4 },
    ];
  }

  // Default Software Engineer / Full Stack target skills
  return [
    { name: "Data Structures & Algorithms", level: 4 },
    { name: "TypeScript & Software Architecture", level: 4 },
    { name: "PostgreSQL & Database Systems", level: 4 },
    { name: "System Design & Distributed Caching (Redis)", level: 4 },
    { name: "Microservices & Cloud Deployment", level: 4 },
  ];
}

export function calculateSkillGaps(profile: LearnerProfile): SkillGap[] {
  const gaps: SkillGap[] = [];
  const targetSkills = profile.targetSkills && profile.targetSkills.length > 0
    ? profile.targetSkills
    : getRoleTargetSkills(profile.targetGoal);

  targetSkills.forEach((target) => {
    const known = (profile.knownSkills || []).find(
      (k) => k.name.toLowerCase().includes(target.name.toLowerCase()) || target.name.toLowerCase().includes(k.name.toLowerCase())
    );

    const currentLevel = known ? known.level : 0;
    const diff = target.level - currentLevel;

    if (diff > 0) {
      let severity: "Critical" | "Moderate" | "Minor" = "Minor";
      if (diff >= 3) severity = "Critical";
      else if (diff === 2) severity = "Moderate";

      gaps.push({
        skill: target.name,
        currentLevel,
        requiredLevel: target.level,
        gapSeverity: severity,
        description: `Current proficiency is level ${currentLevel}/5, target role (${profile.targetGoal}) requires level ${target.level}/5.`,
      });
    }
  });

  return gaps;
}

export function generateClientLearningPath(roleName: string, hoursPerWeek: number = 10, pace: string = "Standard"): StructuredLearningPath {
  const r = roleName.toLowerCase();
  let phases: LearningPhase[] = [];

  if (r.includes("ai") || r.includes("machine learning") || r.includes("ml") || r.includes("data scientist")) {
    phases = [
      {
        step: 1,
        title: "Phase 1: Mathematical Foundations & Python Data Science",
        description: "Master Linear Algebra, Vector Calculus, Probability, and high-performance Python with NumPy and Pandas.",
        duration: "2 Weeks",
        status: "completed",
        prerequisites: ["Python Syntax"],
        topics: ["Linear Algebra & Matrix Operations", "Probability & Bayesian Statistics", "NumPy & Pandas Data Manipulation", "Exploratory Data Analysis"],
        weeklyBreakdown: [
          { week: "Week 1", title: "Linear Algebra & Vector Math", description: "Matrix multiplication, eigenvalues, eigenvectors, and vector space transformations." },
          { week: "Week 2", title: "Python Data Pipelines", description: "Data cleaning, feature engineering, and statistical distribution modeling." },
        ],
        projectIdea: "Build an automated statistical data profiling tool in Python with NumPy and Pandas.",
        codeExercise: "Write a vector inner-product and cosine similarity calculator in pure NumPy.",
        interviewFocus: ["Difference between L1 (Lasso) and L2 (Ridge) regularization?", "Explain Bias-Variance tradeoff."],
        recommendedBooks: ["Hands-On Machine Learning with Scikit-Learn, Keras, and TensorFlow by Aurélien Géron"],
      },
      {
        step: 2,
        title: "Phase 2: Deep Learning Architectures & PyTorch Models",
        description: "Deep dive into Neural Networks, Convolutional Networks, Transformer Attention, and PyTorch model training.",
        duration: "3 Weeks",
        status: "in_progress",
        prerequisites: ["Phase 1 Math & Python"],
        topics: ["Multi-Layer Perceptrons & Backpropagation", "Transformer Architecture & Self-Attention Mechanisms", "PyTorch Custom Datasets & Training Loops", "Model Loss Functions & Optimizers (AdamW)"],
        weeklyBreakdown: [
          { week: "Week 3", title: "PyTorch Core & Neural Nets", description: "Implement forward pass, backpropagation gradient descent, and loss optimization." },
          { week: "Week 4", title: "Transformer Self-Attention", description: "Architect Multi-Head Attention mechanisms and positional encoding." },
          { week: "Week 5", title: "Fine-Tuning & Model Evaluation", description: "Fine-tune open-source models using LoRA / QLoRA parameter-efficient adaptation." },
        ],
        projectIdea: "Architect and train a PyTorch transformer classifier on domain-specific text datasets.",
        codeExercise: "Implement Multi-Head Scaled Dot-Product Attention from scratch in PyTorch.",
        interviewFocus: ["Explain how Self-Attention calculates Query, Key, and Value matrices.", "What is gradient vanishing and how do Residual connections fix it?"],
        recommendedBooks: ["Deep Learning by Ian Goodfellow", "Deep Learning with PyTorch by Eli Stevens"],
      },
      {
        step: 3,
        title: "Phase 3: LLMs, RAG Pipelines & Vector Databases",
        description: "Build enterprise Retrieval-Augmented Generation (RAG) engines, embedding stores, and agentic workflows.",
        duration: "3 Weeks",
        status: "pending",
        prerequisites: ["Phase 2 PyTorch"],
        topics: ["Vector Embeddings & Semantic Search", "Pinecone & Qdrant Vector Indexing", "LangChain & LlamaIndex RAG Orchestration", "Prompt Engineering & Guardrails"],
        weeklyBreakdown: [
          { week: "Week 6", title: "Vector Stores & Embeddings", description: "Generate dense vector embeddings and index them in Pinecone for HNSW similarity search." },
          { week: "Week 7", title: "RAG Retrieval Architecture", description: "Implement hybrid keyword + semantic search retrieval with reciprocal rank fusion." },
          { week: "Week 8", title: "Agentic AI Workflows", description: "Design autonomous AI agents capable of tool calls, API execution, and multi-step reasoning." },
        ],
        projectIdea: "Architect an enterprise document QA system using Next.js 16, LangChain, Pinecone, and Gemini API.",
        codeExercise: "Write a RAG chunking algorithm that splits markdown text while preserving header metadata.",
        interviewFocus: ["How does HNSW indexing enable ultra-fast vector search?", "How do you evaluate RAG accuracy and hallucination rate?"],
        recommendedBooks: ["Building LLM Applications by Ankur A. Patel"],
      },
      {
        step: 4,
        title: "Phase 4: MLOps, Model Serving & Containerization",
        description: "Deploy auto-scaling ML inference APIs with FastAPI, Docker, Triton Inference Server, and Prometheus monitoring.",
        duration: "3 Weeks",
        status: "pending",
        prerequisites: ["Phase 3 RAG & Vector DB"],
        topics: ["FastAPI Async Inference Endpoints", "Docker Containerization for ML Models", "vLLM / Ollama Model Serving Acceleration", "Model Drift & Telemetry Monitoring"],
        weeklyBreakdown: [
          { week: "Week 9", title: "Low-Latency Inference APIs", description: "Package PyTorch models inside FastAPI with async request batching." },
          { week: "Week 10", title: "GPU Containerization", description: "Write multi-stage Dockerfiles leveraging NVIDIA CUDA base images for low-footprint deployment." },
          { week: "Week 11", title: "MLOps Pipeline Automation", description: "Automate model retraining, versioning (MLflow), and cloud deployment." },
        ],
        projectIdea: "Deploy a low-latency vLLM inference server on Cloud with automated CI/CD and latency benchmarking.",
        codeExercise: "Write a multi-stage Dockerfile for a FastAPI ML model server optimized for CPU/GPU execution.",
        interviewFocus: ["Difference between batch inference and real-time streaming inference?", "How do you handle GPU memory overflow (OOM) during serving?"],
        recommendedBooks: ["Designing Machine Learning Systems by Chip Huyen"],
      },
      {
        step: 5,
        title: "Phase 5: Flagship AI Capstone & FAANG ML Interview",
        description: "Deliver a flagship AI portfolio application, pass system design whiteboarding for ML systems, and polish resume metrics.",
        duration: "3 Weeks",
        status: "pending",
        prerequisites: ["Phase 4 MLOps"],
        topics: ["End-to-End Autonomous AI SaaS Build", "ML System Design (Recommendation / Search)", "High-Frequency AI Coding Challenges", "Quantifiable AI Impact Resume Metrics"],
        weeklyBreakdown: [
          { week: "Week 12", title: "Production AI SaaS Launch", description: "Complete live deployment of your AI project with full docs and API endpoints." },
          { week: "Week 13", title: "ML System Design Interviewing", description: "Practice whiteboarding for Recommendation Systems, Search Ranking, and Image Generation." },
          { week: "Week 14", title: "FAANG AI Resume & Coding Drills", description: "Refine resume metrics and practice high-frequency AI algorithm questions." },
        ],
        projectIdea: "Launch a live production AI Career Accelerator SaaS platform deployed with full documentation and live demo.",
        codeExercise: "Conduct a 45-minute ML System Design mock whiteboarding session for a Newsfeed Recommendation System.",
        interviewFocus: ["Design an enterprise search recommendation engine for 100M active users.", "How do you mitigate data leakage in training pipelines?"],
        recommendedBooks: ["Machine Learning System Design Interview by Ali Aminian"],
      },
    ];
  } else if (r.includes("devops") || r.includes("cloud") || r.includes("sre")) {
    phases = [
      {
        step: 1,
        title: "Phase 1: Linux Systems, Networking & Bash Automation",
        description: "Master Linux system administration, kernel process management, TCP/IP networking, and Bash automation.",
        duration: "2 Weeks",
        status: "completed",
        prerequisites: ["Basic Command Line"],
        topics: ["Linux Kernel & Process Signal Handling", "TCP/IP, DNS, TLS & HTTP/3 Protocols", "Advanced Bash Scripting & System Automation", "Linux Security & File Permissions"],
        weeklyBreakdown: [
          { week: "Week 1", title: "Linux Internals & Process Isolation", description: "Manage systemd units, process signals, memory cgroups, and storage mounts." },
          { week: "Week 2", title: "Networking & Security Diagnostics", description: "Use tcpdump, netstat, dig, and iptables/nftables to diagnose network traffic." },
        ],
        projectIdea: "Build an automated Linux system health monitoring daemon with script alerting and log rotation.",
        codeExercise: "Write a Bash script that monitors CPU/RAM usage and sends webhook alerts when memory exceeds 90%.",
        interviewFocus: ["Explain what happens under the hood when a process receives SIGTERM vs SIGKILL.", "How does DNS resolution work step-by-step?"],
        recommendedBooks: ["UNIX and Linux System Administration Handbook by Evi Nemeth"],
      },
      {
        step: 2,
        title: "Phase 2: Docker Containerization & Infrastructure as Code (IaC)",
        description: "Master Docker container hardening, multi-stage builds, and declarative cloud provisioning with Terraform.",
        duration: "3 Weeks",
        status: "in_progress",
        prerequisites: ["Phase 1 Linux"],
        topics: ["Docker Multi-Stage Builds & Image Security", "Container Networking & Storage Volumes", "Terraform HCL Syntax & Remote State Locking", "Modular Cloud Infrastructure Provisioning"],
        weeklyBreakdown: [
          { week: "Week 3", title: "Production Docker & Image Hardening", description: "Build distroless and Alpine containers stripping unnecessary binary dependencies." },
          { week: "Week 4", title: "Terraform Infrastructure Provisioning", description: "Provision AWS VPCs, Subnets, Security Groups, and EC2 instances using Terraform modules." },
          { week: "Week 5", title: "Infrastructure State & Drift Management", description: "Manage Terraform S3 backend state locking with DynamoDB." },
        ],
        projectIdea: "Write Terraform modules to provision an enterprise AWS VPC network with private subnets and NAT Gateways.",
        codeExercise: "Write a multi-stage Dockerfile that compiles a Go binary into an 8MB scratch container image.",
        interviewFocus: ["How does Terraform manage state drift?", "Explain Docker layer caching optimization."],
        recommendedBooks: ["Terraform: Up & Running by Yevgeniy Brikman"],
      },
      {
        step: 3,
        title: "Phase 3: Kubernetes Orchestration & Service Mesh",
        description: "Architect production Kubernetes clusters, Ingress controllers, Helm charts, and Istio service mesh.",
        duration: "3 Weeks",
        status: "pending",
        prerequisites: ["Phase 2 Docker & Terraform"],
        topics: ["Kubernetes Architecture (Control Plane vs Worker Nodes)", "Deployments, StatefulSets & DaemonSets", "Ingress NGINX & Cert-Manager TLS", "Helm Chart Package Management"],
        weeklyBreakdown: [
          { week: "Week 6", title: "Kubernetes Core Resources", description: "Configure Pods, Services, Deployments, and ConfigMaps for microservice isolation." },
          { week: "Week 7", title: "Auto-Scaling & Storage Claims", description: "Set up Horizontal Pod Autoscaler (HPA) and Persistent Volume Claims." },
          { week: "Week 8", title: "Helm Templating & Ingress Routing", description: "Package application deployments into Helm charts with automated SSL certificate provisioning." },
        ],
        projectIdea: "Deploy an enterprise Kubernetes cluster with Helm, NGINX Ingress, Let's Encrypt TLS, and HPA auto-scaling.",
        codeExercise: "Write a Kubernetes HPA manifest that scales pods from 2 to 20 based on 70% CPU target utilization.",
        interviewFocus: ["Difference between Kubernetes Deployment and StatefulSet?", "How does Kube-Proxy handle service traffic routing?"],
        recommendedBooks: ["Kubernetes in Action by Marko Luksa"],
      },
      {
        step: 4,
        title: "Phase 4: CI/CD Pipelines & Telemetry Monitoring (Prometheus/Grafana)",
        description: "Automate GitHub Actions deployment pipelines, Prometheus metric collection, and Grafana dashboards.",
        duration: "3 Weeks",
        status: "pending",
        prerequisites: ["Phase 3 Kubernetes"],
        topics: ["Automated GitHub Actions / GitLab CI/CD", "Zero-Downtime Deployment Strategies (Canary / Blue-Green)", "Prometheus Metric Scraping & Alertmanager", "Grafana Dashboard Visualization"],
        weeklyBreakdown: [
          { week: "Week 9", title: "Production CI/CD Pipelines", description: "Build automated pipeline for testing, linting, building Docker images, and pushing to ECR." },
          { week: "Week 10", title: "Zero-Downtime Releases", description: "Configure ArgoCD GitOps for automated Kubernetes deployment sync." },
          { week: "Week 11", title: "Observability & Alerting", description: "Set up Prometheus blackbox exporters and PagerDuty alert triggers." },
        ],
        projectIdea: "Build an end-to-end GitOps deployment pipeline using GitHub Actions, ArgoCD, Prometheus, and Grafana.",
        codeExercise: "Write a GitHub Actions workflow that performs automated security scanning (Trivy) and deploys to Kubernetes.",
        interviewFocus: ["Explain Blue-Green vs Canary deployment strategies.", "What are the 4 Golden Signals of monitoring?"],
        recommendedBooks: ["The DevOps Handbook by Gene Kim", "Site Reliability Engineering by Google"],
      },
      {
        step: 5,
        title: "Phase 5: Cloud Architecture Capstone & SRE Interview Prep",
        description: "Deliver a production cloud infrastructure capstone, master SRE system design whiteboarding, and polish resume metrics.",
        duration: "3 Weeks",
        status: "pending",
        prerequisites: ["Phase 4 CI/CD & Observability"],
        topics: ["Multi-Region Cloud Architecture Build", "SRE System Design Whiteboarding", "Incident Management & Root Cause Analysis", "Quantifiable DevOps Impact Resume Metrics"],
        weeklyBreakdown: [
          { week: "Week 12", title: "Flagship Cloud Project Launch", description: "Launch full production infrastructure with 99.99% SLA uptime guarantees." },
          { week: "Week 13", title: "SRE System Design Whiteboarding", description: "Practice whiteboarding for multi-region failover, disaster recovery, and DDoS mitigation." },
          { week: "Week 14", title: "FAANG DevOps Resume & Interview Prep", description: "Refine resume metrics and practice technical scenario questions." },
        ],
        projectIdea: "Deploy a multi-region auto-scaling cloud platform with Terraform, Kubernetes, ArgoCD, and automated failover.",
        codeExercise: "Conduct a 45-minute live SRE System Design mock whiteboarding session for multi-region disaster recovery.",
        interviewFocus: ["Design a multi-region high-availability setup for 99.99% uptime.", "How do you handle a cascading failure during an outage?"],
        recommendedBooks: ["Building Secure & Reliable Systems by Google SRE Team"],
      },
    ];
  } else if (r.includes("frontend") || r.includes("web developer") || r.includes("react")) {
    phases = [
      {
        step: 1,
        title: "Phase 1: Modern JavaScript ESNext, TypeScript & Web APIs",
        description: "Master modern ECMAScript features, strict TypeScript generics, DOM mechanics, and browser performance APIs.",
        duration: "2 Weeks",
        status: "completed",
        prerequisites: ["HTML & CSS Basics"],
        topics: ["Advanced TypeScript & Strict Type Guards", "Event Loop, Microtasks & Async/Await", "Browser DOM Engine & Event Bubbling", "Modern CSS Architecture & Tailwind CSS"],
        weeklyBreakdown: [
          { week: "Week 1", title: "TypeScript & Generics Mastery", description: "Master utility types, conditional types, and compile-time type narrowing." },
          { week: "Week 2", title: "Async JavaScript & Web APIs", description: "Master Promises, Event Loop microtask queues, Fetch API, and AbortController cancellation." },
        ],
        projectIdea: "Build a modular, zero-dependency component library in TypeScript with Tailwind CSS.",
        codeExercise: "Write a custom TypeScript debounced search hook with cancellation support.",
        interviewFocus: ["Difference between Microtasks (Promises) and Macrotasks (setTimeout)?", "How does Event Delegation work in JavaScript?"],
        recommendedBooks: ["You Don't Know JS Yet by Kyle Simpson"],
      },
      {
        step: 2,
        title: "Phase 2: React 19 Architecture & Next.js App Router",
        description: "Deep dive into React 19 Server Components, Server Actions, Next.js App Router, and streaming SSR.",
        duration: "3 Weeks",
        status: "in_progress",
        prerequisites: ["Phase 1 JS & TypeScript"],
        topics: ["React Server Components (RSC) & Actions", "Next.js App Router Layout & Page Architecture", "Form Handling & Optimistic UI Updates", "Client-Side State Synchronization (Zustand/TanStack Query)"],
        weeklyBreakdown: [
          { week: "Week 3", title: "Server Components & Routing", description: "Architect layouts, parallel routes, and intercepted routes in Next.js." },
          { week: "Week 4", title: "Server Actions & Mutation", description: "Implement form mutations with optimistic UI updates and server validation." },
          { week: "Week 5", title: "State Management & Caching", description: "Manage global state using Zustand and server cache revalidation." },
        ],
        projectIdea: "Develop a full stack Next.js web application with Server Components, optimistic UI, and dark mode theme switching.",
        codeExercise: "Implement an optimistic UI mutation hook in React for instant item updates.",
        interviewFocus: ["How do React Server Components differ from Client Components?", "Explain React Fiber reconciliation."],
        recommendedBooks: ["Learning React by Alex Banks"],
      },
      {
        step: 3,
        title: "Phase 3: Web Performance, Core Web Vitals & WebSockets",
        description: "Master Largest Contentful Paint (LCP), Interaction to Next Paint (INP), WebSockets, and dynamic UI animations.",
        duration: "3 Weeks",
        status: "pending",
        prerequisites: ["Phase 2 React & Next.js"],
        topics: ["Core Web Vitals Optimization (LCP, INP, CLS)", "Image & Font Optimization (Next/Image)", "Real-Time WebSockets & Server-Sent Events", "Framer Motion & Micro-Interactions"],
        weeklyBreakdown: [
          { week: "Week 6", title: "Performance Auditing & CWV", description: "Optimize bundle splitting, dynamic imports, and eliminate Cumulative Layout Shift (CLS)." },
          { week: "Week 7", title: "Real-Time WebSockets", description: "Build real-time bi-directional streaming chat interfaces with WebSocket reconnection logic." },
          { week: "Week 8", title: "Advanced Animation & Micro-Interactions", description: "Create smooth 60fps UI transitions using Framer Motion." },
        ],
        projectIdea: "Build a real-time collaborative dashboard with WebSockets, sub-second INP response, and 100/100 Lighthouse performance.",
        codeExercise: "Optimize a slow React list rendering 10,000 items using windowing / virtualization (react-window).",
        interviewFocus: ["How do you fix high Interaction to Next Paint (INP) delays?", "Explain how Web Vitals measure user experience."],
        recommendedBooks: ["High Performance Web Sites by Steve Souders"],
      },
      {
        step: 4,
        title: "Phase 4: Component Design Systems & Automated Frontend Testing",
        description: "Build scalable component design systems, Storybook docs, and automated Playwright / Vitest test suites.",
        duration: "3 Weeks",
        status: "pending",
        prerequisites: ["Phase 3 Web Performance"],
        topics: ["Design System Token Architecture", "Accessible ARIA Components (Radix / Headless UI)", "Vitest Unit Testing & React Testing Library", "Playwright End-to-End Visual Regression Testing"],
        weeklyBreakdown: [
          { week: "Week 9", title: "Design System Architecture", description: "Design a reusable token-based component library with dark/light theme support." },
          { week: "Week 10", title: "Accessibility (a11y) & ARIA", description: "Ensure full keyboard navigation, screen reader support, and WCAG AA compliance." },
          { week: "Week 11", title: "Automated E2E Testing", description: "Write automated Playwright E2E tests for user authentication and checkout flows." },
        ],
        projectIdea: "Build and publish an accessible design system with Storybook documentation and automated Playwright CI tests.",
        codeExercise: "Write a accessible modal dialog component supporting ESC key, focus trap, and ARIA attributes.",
        interviewFocus: ["How do you implement a Focus Trap for accessible modals?", "Difference between Unit, Integration, and E2E testing?"],
        recommendedBooks: ["Refactoring UI by Adam Wathan"],
      },
      {
        step: 5,
        title: "Phase 5: Production Frontend Capstone & FAANG Interview Prep",
        description: "Deliver a flagship production frontend SaaS application, master frontend architecture whiteboarding, and polish resume metrics.",
        duration: "3 Weeks",
        status: "pending",
        prerequisites: ["Phase 4 Testing & Design Systems"],
        topics: ["End-to-End Production Web SaaS Launch", "Frontend System Design (Autocomplete / Feed / Modal)", "High-Frequency Frontend Coding Challenges", "Quantifiable UX Impact Resume Metrics"],
        weeklyBreakdown: [
          { week: "Week 12", title: "Flagship Web SaaS Launch", description: "Deploy a high-performance web application live with zero-downtime Vercel deployment." },
          { week: "Week 13", title: "Frontend System Design Whiteboarding", description: "Practice whiteboarding for Search Autocomplete, Infinite Scroll Feeds, and Rich Text Editors." },
          { week: "Week 14", title: "FAANG Frontend Resume & Interview Prep", description: "Refine resume metrics and practice high-frequency JavaScript algorithm questions." },
        ],
        projectIdea: "Complete and launch a flagship web application deployed live on Vercel with full documentation and responsive UI.",
        codeExercise: "Conduct a 45-minute Frontend System Design whiteboarding session for a Search Autocomplete Widget.",
        interviewFocus: ["Design a high-performance Search Autocomplete widget handling 1,000,000 queries.", "How do you measure and reduce JavaScript bundle size?"],
        recommendedBooks: ["Frontend System Design Fundamentals"],
      },
    ];
  } else {
    // Default Software Engineer / Full Stack Engineering phases
    phases = [
      {
        step: 1,
        title: `Phase 1: Foundations & ${roleName} Essentials`,
        description: `Master core computer science principles, type safety, memory allocation, and foundational data structures required for ${roleName}.`,
        duration: "2 Weeks",
        status: "completed",
        prerequisites: ["Basic Syntax & Variables"],
        topics: ["Type Safety & Object-Oriented Patterns", "Data Structures & Time Complexity (Big-O)", "Memory Allocation & Event Loop Mechanics", "Clean Architecture Principles"],
        weeklyBreakdown: [
          { week: "Week 1", title: "Type Systems & Advanced Generics", description: "Implement strictly-typed interfaces, immutable data types, and compile-time validation schemas." },
          { week: "Week 2", title: "Data Structures & Big-O Optimization", description: "Master arrays, hash maps, binary search trees, and space-time complexity trade-offs." },
        ],
        projectIdea: `Build a modular, strongly-typed data validation engine with compile-time assertions for ${roleName}.`,
        codeExercise: "Implement an LRU Cache with O(1) time complexity for get and put operations.",
        interviewFocus: ["How does Big-O notation evaluate worst-case time complexity?", "Explain the difference between Stack and Heap memory."],
        recommendedBooks: ["Clean Code by Robert C. Martin", "Grokking Algorithms by Aditya Bhargava"],
      },
      {
        step: 2,
        title: "Phase 2: Core Stack Architecture & Database Engineering",
        description: "Deep dive into server-side rendering, REST/GraphQL API design, database indexing, and authentication middleware.",
        duration: "3 Weeks",
        status: "in_progress",
        prerequisites: ["Phase 1 CS Essentials"],
        topics: ["Server-Side Rendering (SSR) & App Routers", "PostgreSQL Indexing & B-Tree Execution Plans", "Database Schema Migrations & ORMs", "OAuth2, JWT & RBAC Middleware"],
        weeklyBreakdown: [
          { week: "Week 3", title: "API Contract & Middleware Architecture", description: "Design RESTful and GraphQL endpoints with strict request validation and auth middleware." },
          { week: "Week 4", title: "Database Schema Design & Query Optimization", description: "Write B-Tree indexes, composite keys, and analyze SQL EXPLAIN ANALYZE query plans." },
          { week: "Week 5", title: "Server Components & Streaming Data", description: "Implement streaming SSR and React Server Components for ultra-low latency initial renders." },
        ],
        projectIdea: "Develop an enterprise database backend with PostgreSQL indexing, JWT authentication, and automated database migrations.",
        codeExercise: "Write a SQL query using composite indexing that optimizes a multi-table JOIN from 400ms down to 12ms.",
        interviewFocus: ["When should you use a B-Tree index vs a Hash index in SQL?", "How does SSR differ from Client-Side Hydration?"],
        recommendedBooks: ["Designing Data-Intensive Applications by Martin Kleppmann", "SQL Performance Explained by Markus Winand"],
      },
      {
        step: 3,
        title: "Phase 3: High-Scale Systems & Distributed Caching",
        description: "Architect scalable microservices, distributed Redis caching, message queues, and vector search embeddings.",
        duration: "3 Weeks",
        status: "pending",
        prerequisites: ["Phase 2 API & DB Architecture"],
        topics: ["Redis Caching & Sliding-Window Rate Limiting", "Message Queues (Kafka / RabbitMQ)", "Vector Embeddings & Semantic RAG Search", "Distributed Locks & Microservices"],
        weeklyBreakdown: [
          { week: "Week 6", title: "Redis Caching Patterns", description: "Implement Cache-Aside, Write-Through, and sliding-window rate limiters to shield databases." },
          { week: "Week 7", title: "Asynchronous Message Queues", description: "Decouple heavy tasks using Kafka or RabbitMQ event-driven background workers." },
          { week: "Week 8", title: "Vector Search & AI RAG Pipelines", description: "Implement vector embeddings and cosine similarity search using Pinecone / Qdrant." },
        ],
        projectIdea: "Architect a distributed high-throughput event processing platform with Redis caching, Kafka queues, and vector search.",
        codeExercise: "Implement a distributed sliding-window rate limiter in Redis to limit user IP requests to 100 requests/minute.",
        interviewFocus: ["How do you handle Cache Stampede (Thundering Herd) in Redis?", "Explain the CAP Theorem trade-offs in distributed systems."],
        recommendedBooks: ["System Design Interview by Alex Xu", "Database Internals by Alex Petrov"],
      },
      {
        step: 4,
        title: "Phase 4: DevOps, Cloud Infrastructure & CI/CD Pipelines",
        description: "Deploy auto-scaling containerized workloads with automated CI/CD pipelines, Terraform IaC, and observability telemetry.",
        duration: "3 Weeks",
        status: "pending",
        prerequisites: ["Phase 3 High-Scale Infrastructure"],
        topics: ["Docker Containerization & Multi-Stage Builds", "Kubernetes Pod Orchestration", "Terraform Infrastructure as Code (IaC)", "Automated GitHub Actions CI/CD Pipelines"],
        weeklyBreakdown: [
          { week: "Week 9", title: "Production Docker & Container Hardening", description: "Write multi-stage Dockerfiles reducing image size from 1.2GB down to 60MB." },
          { week: "Week 10", title: "Kubernetes & Cloud Deployment", description: "Configure Kubernetes Deployments, Ingress controllers, and HPA auto-scaling on AWS / GCP." },
          { week: "Week 11", title: "CI/CD Pipelines & Telemetry Monitoring", description: "Automate linting, unit testing, docker build, and zero-downtime deployment pipelines." },
        ],
        projectIdea: "Deploy a containerized Kubernetes application on Cloud with automated CI/CD pipelines and Prometheus telemetry metrics.",
        codeExercise: "Write a multi-stage Dockerfile that builds a Next.js application into a minimal Alpine container.",
        interviewFocus: ["Difference between Kubernetes Deployment and StatefulSet?", "How does zero-downtime Rolling Update work?"],
        recommendedBooks: ["The DevOps Handbook by Gene Kim", "Kubernetes in Action by Marko Luksa"],
      },
      {
        step: 5,
        title: `Phase 5: Production Capstone - ${roleName}`,
        description: `Deliver a flagship production capstone project, master technical system design whiteboarding, and polish resume bullet metrics.`,
        duration: "3 Weeks",
        status: "pending",
        prerequisites: ["Phase 4 Cloud & DevOps"],
        topics: ["End-to-End Flagship Capstone Build", "System Design Whiteboarding & Trade-Offs", "Algorithms & STAR Method Mock Interviews", "ATS Resume Metric Alignment"],
        weeklyBreakdown: [
          { week: "Week 12", title: "Flagship Capstone Development", description: "Complete end-to-end implementation of your custom production portfolio project." },
          { week: "Week 13", title: "System Design Mock Interviews", description: "Practice architectural whiteboarding for URL Shorteners, Newsfeeds, and Chat Applications." },
          { week: "Week 14", title: "FAANG Resume & Coding Drills", description: "Refine resume metrics (quantifiable impact) and practice high-frequency LeetCode algorithms." },
        ],
        projectIdea: `Complete and launch a production-grade ${roleName} SaaS platform deployed live with full documentation, live demo, and GitHub repository.`,
        codeExercise: "Conduct a full 45-minute live System Design mock interview whiteboarding session.",
        interviewFocus: ["Walk me through the architectural design of a distributed URL shortener.", "Describe your hardest technical bug and how you resolved it."],
        recommendedBooks: ["Cracking the Coding Interview by Gayle Laakmann McDowell", "System Design Interview Vol 2 by Alex Xu"],
      },
    ];
  }

  return {
    id: `path-${Date.now()}`,
    targetRole: roleName,
    overallDuration: "14 Weeks",
    weeklyCommitment: `${hoursPerWeek} Hours/Week`,
    learningPace: pace as any,
    matchScore: 96,
    prerequisiteFlow: [
      "Phase 1: Foundations & Core Concepts → Phase 2: Architecture & Specialized Stack",
      "Phase 2: Architecture & Specialized Stack → Phase 3: High-Scale Systems & Infrastructure",
      "Phase 3: High-Scale Systems & Infrastructure → Phase 4: DevOps, Cloud & CI/CD Pipelines",
      "Phase 4: DevOps, Cloud & CI/CD Pipelines → Phase 5: Production Capstone & FAANG Interview Prep",
    ],
    phases,
    aiSummary: `Detailed 5-phase engineering roadmap for ${roleName} with weekly module breakdowns, hands-on lab code exercises, and technical interview whiteboarding.`,
    createdAt: new Date().toISOString(),
  };
}

export function getRoleTailoredRecommendations(role: string): {
  courses: CourseRecommendation[];
  projects: ProjectRecommendation[];
  resources: ResourceRecommendation[];
} {
  const r = role.toLowerCase();

  if (r.includes("ai") || r.includes("machine learning") || r.includes("ml") || r.includes("data scientist")) {
    return {
      courses: [
        {
          id: "course-ai-1",
          title: "Deep Learning Specialization (Neural Networks & PyTorch)",
          provider: "DeepLearning.AI / Coursera (Andrew Ng)",
          duration: "40 Hours",
          level: "Intermediate",
          matchScore: 98,
          prerequisites: ["Python", "Linear Algebra"],
          skillsCovered: ["Neural Networks", "Transformer Architecture", "Attention Mechanisms", "PyTorch"],
          url: "https://www.coursera.org/specializations/deep-learning",
          whyRecommended: "Authoritative deep learning foundation for training and fine-tuning AI models.",
          category: "Core Foundation",
        },
        {
          id: "course-ai-2",
          title: "Building Applications with Vector Databases & RAG",
          provider: "DeepLearning.AI / Pinecone",
          duration: "12 Hours",
          level: "Advanced",
          matchScore: 96,
          prerequisites: ["Python", "OpenAI / Gemini API"],
          skillsCovered: ["Vector Embeddings", "HNSW Indexing", "LangChain", "RAG Pipelines"],
          url: "https://www.deeplearning.ai",
          whyRecommended: "Master enterprise document retrieval, vector search indexing, and contextual RAG search.",
          category: "Specialization",
        },
      ],
      projects: [
        {
          id: "proj-ai-1",
          title: "Enterprise AI Knowledge Base & RAG Retrieval Engine",
          description: "Build an enterprise document search engine using Next.js 16, Python FastAPI, Pinecone vector store, and Gemini embeddings.",
          difficulty: "Intermediate",
          estimatedHours: 25,
          techStack: ["Next.js", "FastAPI", "Pinecone", "Gemini API", "Tailwind CSS"],
          learningOutcomes: ["Chunking strategy implementation", "Semantic search indexing", "Streaming chat completions"],
          whyRecommended: "Combines full stack development with your target skill in Vector Databases and RAG pipelines.",
          matchScore: 99,
        },
      ],
      resources: [
        {
          id: "res-ai-1",
          title: "Hugging Face Transformers Documentation & Guides",
          type: "Documentation",
          provider: "Hugging Face",
          url: "https://huggingface.co/docs",
          whyRecommended: "Essential guide for loading, fine-tuning, and deploying open-source AI models.",
          matchScore: 94,
        },
      ],
    };
  } else if (r.includes("devops") || r.includes("cloud") || r.includes("sre")) {
    return {
      courses: [
        {
          id: "course-devops-1",
          title: "Kubernetes Certified Application Developer (CKAD)",
          provider: "Linux Foundation / Udemy",
          duration: "30 Hours",
          level: "Intermediate",
          matchScore: 97,
          prerequisites: ["Docker Basics"],
          skillsCovered: ["Pods & Deployments", "Ingress Controllers", "ConfigMaps & Secrets", "HPA Auto-Scaling"],
          url: "https://www.udemy.com",
          whyRecommended: "Industry-standard certification for mastering production Kubernetes cluster management.",
          category: "Core Foundation",
        },
        {
          id: "course-devops-2",
          title: "Terraform Infrastructure as Code (AWS / GCP)",
          provider: "HashiCorp Certified",
          duration: "20 Hours",
          level: "Intermediate",
          matchScore: 95,
          prerequisites: ["Linux Basics"],
          skillsCovered: ["Terraform HCL", "State Locking", "VPC Networking", "Modular IaC"],
          url: "https://developer.hashicorp.com/terraform",
          whyRecommended: "Provision scalable cloud infrastructure declaratively with Terraform modules.",
          category: "Specialization",
        },
      ],
      projects: [
        {
          id: "proj-devops-1",
          title: "Multi-Region Cloud GitOps Pipeline & Kubernetes Cluster",
          description: "Deploy an enterprise Kubernetes cluster on AWS using Terraform, GitHub Actions CI/CD, ArgoCD GitOps, and Prometheus telemetry.",
          difficulty: "Advanced",
          estimatedHours: 30,
          techStack: ["Kubernetes", "Terraform", "GitHub Actions", "ArgoCD", "Prometheus"],
          learningOutcomes: ["Declarative infrastructure provisioning", "GitOps deployment sync", "Metrics alerting"],
          whyRecommended: "Demonstrates production DevOps and SRE capabilities required for cloud engineering roles.",
          matchScore: 98,
        },
      ],
      resources: [
        {
          id: "res-devops-1",
          title: "Google Site Reliability Engineering (SRE) Book",
          type: "Book",
          provider: "Google",
          url: "https://sre.google/books/",
          whyRecommended: "Authoritative reference for system reliability, incident management, and 99.99% SLA availability.",
          matchScore: 96,
        },
      ],
    };
  } else if (r.includes("frontend") || r.includes("web developer")) {
    return {
      courses: [
        {
          id: "course-fe-1",
          title: "Next.js 16 & React 19 Full-Stack Architecture",
          provider: "Vercel Academy",
          duration: "20 Hours",
          level: "Intermediate",
          matchScore: 98,
          prerequisites: ["Modern JavaScript", "React Fundamentals"],
          skillsCovered: ["React Server Components", "Server Actions", "Streaming SSR", "App Router"],
          url: "https://nextjs.org/learn",
          whyRecommended: "Master modern server-side rendering and component architecture for frontend roles.",
          category: "Core Foundation",
        },
        {
          id: "course-fe-2",
          title: "Web Performance & Core Web Vitals Masterclass",
          provider: "Google Chrome Developers",
          duration: "15 Hours",
          level: "Advanced",
          matchScore: 95,
          prerequisites: ["React", "DOM APIs"],
          skillsCovered: ["Interaction to Next Paint (INP)", "LCP Optimization", "Bundle Splitting", "Virtualization"],
          url: "https://web.dev/learn/performance",
          whyRecommended: "Optimize web performance and eliminate rendering bottlenecks for sub-second UI interactions.",
          category: "Specialization",
        },
      ],
      projects: [
        {
          id: "proj-fe-1",
          title: "Accessible Design System & Storybook Component Library",
          description: "Build an accessible, themeable design system component library in TypeScript, Tailwind CSS, Radix UI, and Storybook.",
          difficulty: "Intermediate",
          estimatedHours: 20,
          techStack: ["React 19", "TypeScript", "Tailwind CSS", "Storybook", "Playwright"],
          learningOutcomes: ["Design token architecture", "Keyboard accessibility (a11y)", "Visual regression testing"],
          whyRecommended: "Showcases production frontend component design and automated UI testing skills.",
          matchScore: 97,
        },
      ],
      resources: [
        {
          id: "res-fe-1",
          title: "Web.dev Official Core Web Vitals & Accessibility Guides",
          type: "Documentation",
          provider: "Google",
          url: "https://web.dev",
          whyRecommended: "Essential guide for WCAG accessibility compliance and Lighthouse performance tuning.",
          matchScore: 95,
        },
      ],
    };
  }

  // Default Software Engineer / Full Stack recommendations
  return {
    courses: [
      {
        id: "course-def-1",
        title: "Next.js 16 & React 19 Full-Stack Architecture",
        provider: "Vercel Academy",
        duration: "15 Hours",
        level: "Intermediate",
        matchScore: 96,
        prerequisites: ["Modern JavaScript", "React Fundamentals"],
        skillsCovered: ["Next.js App Router", "Server Components", "Server Actions", "Streaming SSR"],
        url: "https://nextjs.org/learn",
        whyRecommended: "Bridges full stack development and modern server-side rendering for your target engineering goal.",
        category: "Core Foundation",
      },
      {
        id: "course-def-2",
        title: "System Design for High-Scalability Applications",
        provider: "ByteByteGo",
        duration: "25 Hours",
        level: "Advanced",
        matchScore: 93,
        prerequisites: ["REST APIs"],
        skillsCovered: ["Distributed Caching (Redis)", "Message Queues", "Microservices", "Load Balancing"],
        url: "https://bytebytego.com",
        whyRecommended: "Essential for mastering architectural trade-offs required in software engineering roles.",
        category: "Specialization",
      },
    ],
    projects: [
      {
        id: "proj-def-1",
        title: "Enterprise Full Stack Application & Database Architecture",
        description: "Build a high-performance web application with Next.js, PostgreSQL, Redis caching, and Docker containerization.",
        difficulty: "Intermediate",
        estimatedHours: 25,
        techStack: ["Next.js", "TypeScript", "PostgreSQL", "Redis", "Docker"],
        learningOutcomes: ["Full stack architecture", "Database indexing", "Caching strategy"],
        whyRecommended: "Demonstrates end-to-end software development capabilities for your target role.",
        matchScore: 96,
      },
    ],
    resources: [
      {
        id: "res-def-1",
        title: "Next.js Official Documentation & App Router Patterns",
        type: "Documentation",
        provider: "Vercel",
        url: "https://nextjs.org/docs",
        whyRecommended: "Authoritative reference for modern server components and scalable architecture.",
        matchScore: 95,
      },
    ],
  };
}

export function loadStoredProfile(): LearnerProfile {
  if (typeof window === "undefined") return DEFAULT_PROFILE;
  try {
    const data = localStorage.getItem(PROFILE_STORAGE_KEY);
    if (!data) return DEFAULT_PROFILE;
    const parsed = JSON.parse(data);
    parsed.skillGaps = calculateSkillGaps(parsed);
    return parsed;
  } catch (e) {
    return DEFAULT_PROFILE;
  }
}

export function saveStoredProfile(profile: LearnerProfile): void {
  if (typeof window === "undefined") return;
  profile.skillGaps = calculateSkillGaps(profile);
  profile.lastUpdated = new Date().toISOString();
  localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
}

export function loadStoredLearningPath(): StructuredLearningPath | null {
  if (typeof window === "undefined") return null;
  try {
    const data = localStorage.getItem(PATH_STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    return null;
  }
}

export function saveStoredLearningPath(path: StructuredLearningPath): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(PATH_STORAGE_KEY, JSON.stringify(path));
}

export function calculateStats(path: StructuredLearningPath | null): LearningStats {
  if (!path || !path.phases || path.phases.length === 0) {
    return {
      completedMilestones: 1,
      totalMilestones: 5,
      progressPercent: 20,
      hoursLogged: 14,
      streakDays: 4,
      skillsMasteredCount: 5,
      nextRecommendedAction: {
        title: "Complete Phase 2: Core Architecture",
        description: "Build high-throughput APIs and database models.",
        actionUrl: "/roadmap",
        type: "milestone",
      },
    };
  }

  const completed = path.phases.filter((p) => p.status === "completed").length;
  const total = path.phases.length;
  const progressPercent = Math.round((completed / total) * 100);

  const inProgressPhase = path.phases.find((p) => p.status === "in_progress") || path.phases[completed];

  return {
    completedMilestones: completed,
    totalMilestones: total,
    progressPercent,
    hoursLogged: completed * 15 + (inProgressPhase ? 6 : 0),
    streakDays: 5,
    skillsMasteredCount: completed * 3 + 2,
    nextRecommendedAction: {
      title: inProgressPhase ? `Phase ${inProgressPhase.step}: ${inProgressPhase.title}` : "All Phases Mastered!",
      description: inProgressPhase ? inProgressPhase.description : "You are ready for target role applications.",
      actionUrl: "/roadmap",
      type: "milestone",
    },
  };
}

export const FALLBACK_COURSES = getRoleTailoredRecommendations("Software Engineer").courses;
export const FALLBACK_PROJECTS = getRoleTailoredRecommendations("Software Engineer").projects;
export const FALLBACK_RESOURCES = getRoleTailoredRecommendations("Software Engineer").resources;
