// frontend/src/app/api/learning-path/generate/route.ts
import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";
import { LearnerProfile, StructuredLearningPath } from "@/types/learningPath";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || "dummy_key" });

function generateRoleSpecificPhases(roleName: string) {
  const r = roleName.toLowerCase();

  if (r.includes("ai") || r.includes("machine learning") || r.includes("ml") || r.includes("data scientist")) {
    return [
      {
        step: 1,
        title: "Phase 1: Mathematical Foundations & Python Data Science",
        description: "Master Linear Algebra, Vector Calculus, Probability, and high-performance Python with NumPy and Pandas.",
        duration: "2 Weeks",
        status: "completed" as const,
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
        status: "in_progress" as const,
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
        status: "pending" as const,
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
        status: "pending" as const,
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
        status: "pending" as const,
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
  } else if (r.includes("devops") || r.includes("cloud") || r.includes("site reliability") || r.includes("sre")) {
    return [
      {
        step: 1,
        title: "Phase 1: Linux Systems, Networking & Bash Automation",
        description: "Master Linux system administration, kernel process management, TCP/IP networking, and Bash automation.",
        duration: "2 Weeks",
        status: "completed" as const,
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
        status: "in_progress" as const,
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
        status: "pending" as const,
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
        status: "pending" as const,
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
        status: "pending" as const,
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
    return [
      {
        step: 1,
        title: "Phase 1: Modern JavaScript ESNext, TypeScript & Web APIs",
        description: "Master modern ECMAScript features, strict TypeScript generics, DOM mechanics, and browser performance APIs.",
        duration: "2 Weeks",
        status: "completed" as const,
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
        status: "in_progress" as const,
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
        status: "pending" as const,
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
        status: "pending" as const,
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
        status: "pending" as const,
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
  }

  // Default Software Engineer / Full Stack Engineering phases
  return [
    {
      step: 1,
      title: "Phase 1: Foundations & Computer Science Essentials",
      description: "Master core computer science principles, type safety, memory allocation, and foundational data structures required for production engineering.",
      duration: "2 Weeks",
      status: "completed" as const,
      prerequisites: ["Basic Syntax & Variables"],
      topics: ["Type Safety & Object-Oriented Patterns", "Data Structures & Time Complexity (Big-O)", "Memory Allocation & Event Loop Mechanics", "Clean Architecture Principles"],
      weeklyBreakdown: [
        { week: "Week 1", title: "Type Systems & Advanced Generics", description: "Implement strictly-typed interfaces, immutable data types, and compile-time validation schemas." },
        { week: "Week 2", title: "Data Structures & Big-O Optimization", description: "Master arrays, hash maps, binary search trees, and space-time complexity trade-offs." }
      ],
      projectIdea: `Build a modular, strongly-typed data validation engine with compile-time assertions for ${roleName}.`,
      codeExercise: "Implement an LRU Cache with O(1) time complexity for get and put operations.",
      interviewFocus: ["How does Big-O notation evaluate worst-case time complexity?", "Explain the difference between Stack and Heap memory."],
      recommendedBooks: ["Clean Code by Robert C. Martin", "Grokking Algorithms by Aditya Bhargava"],
      quiz: {
        quizTitle: "Phase 1 Foundations Verification",
        passingScore: 80,
        questions: [
          {
            id: "q1",
            question: "What is the average time complexity of looking up a key in a Hash Table?",
            options: ["O(1) Constant Time", "O(N) Linear Time", "O(log N) Logarithmic Time", "O(N^2) Quadratic Time"],
            correctIndex: 0,
            explanation: "Hash tables compute key array offsets directly via a hash function, yielding average O(1) lookup time."
          }
        ]
      }
    },
    {
      step: 2,
      title: "Phase 2: Core Stack Architecture & Database Engineering",
      description: "Deep dive into server-side rendering, REST/GraphQL API design, database indexing, and authentication middleware.",
      duration: "3 Weeks",
      status: "in_progress" as const,
      prerequisites: ["Phase 1 CS Essentials"],
      topics: ["Server-Side Rendering (SSR) & App Routers", "PostgreSQL Indexing & B-Tree Execution Plans", "Database Schema Migrations & ORMs", "OAuth2, JWT & RBAC Middleware"],
      weeklyBreakdown: [
        { week: "Week 3", title: "API Contract & Middleware Architecture", description: "Design RESTful and GraphQL endpoints with strict request validation and auth middleware." },
        { week: "Week 4", title: "Database Schema Design & Query Optimization", description: "Write B-Tree indexes, composite keys, and analyze SQL EXPLAIN ANALYZE query plans." },
        { week: "Week 5", title: "Server Components & Streaming Data", description: "Implement streaming SSR and React Server Components for ultra-low latency initial renders." }
      ],
      projectIdea: "Develop an enterprise database backend with PostgreSQL indexing, JWT authentication, and automated database migrations.",
      codeExercise: "Write a SQL query using composite indexing that optimizes a multi-table JOIN from 400ms down to 12ms.",
      interviewFocus: ["When should you use a B-Tree index vs a Hash index in SQL?", "How does SSR differ from Client-Side Hydration?"],
      recommendedBooks: ["Designing Data-Intensive Applications by Martin Kleppmann", "SQL Performance Explained by Markus Winand"],
      quiz: {
        quizTitle: "Phase 2 Database & API Mastery",
        passingScore: 80,
        questions: [
          {
            id: "q2",
            question: "Why is B-Tree composite indexing useful for SQL queries with WHERE and ORDER BY clauses?",
            options: [
              "Combines filtered column lookup with pre-sorted order evaluation without requiring a extra sort step",
              "Compresses database disk space automatically",
              "Disables foreign key constraints",
              "Replaces server memory completely"
            ],
            correctIndex: 0,
            explanation: "Composite indexes store tuple pairs in sorted order, matching WHERE filter predicates and eliminating filesort operations."
          }
        ]
      }
    },
    {
      step: 3,
      title: "Phase 3: High-Scale Systems & Distributed Caching",
      description: "Architect scalable microservices, distributed Redis caching, message queues, and vector search embeddings.",
      duration: "3 Weeks",
      status: "pending" as const,
      prerequisites: ["Phase 2 API & DB Architecture"],
      topics: ["Redis Caching & Sliding-Window Rate Limiting", "Message Queues (Kafka / RabbitMQ)", "Vector Embeddings & Semantic RAG Search", "Distributed Locks & Microservices"],
      weeklyBreakdown: [
        { week: "Week 6", title: "Redis Caching Patterns", description: "Implement Cache-Aside, Write-Through, and sliding-window rate limiters to shield databases." },
        { week: "Week 7", title: "Asynchronous Message Queues", description: "Decouple heavy tasks using Kafka or RabbitMQ event-driven background workers." },
        { week: "Week 8", title: "Vector Search & AI RAG Pipelines", description: "Implement vector embeddings and cosine similarity search using Pinecone / Qdrant." }
      ],
      projectIdea: "Architect a distributed high-throughput event processing platform with Redis caching, Kafka queues, and vector search.",
      codeExercise: "Implement a distributed sliding-window rate limiter in Redis to limit user IP requests to 100 requests/minute.",
      interviewFocus: ["How do you handle Cache Stampede (Thundering Herd) in Redis?", "Explain the CAP Theorem trade-offs in distributed systems."],
      recommendedBooks: ["System Design Interview by Alex Xu", "Database Internals by Alex Petrov"]
    },
    {
      step: 4,
      title: "Phase 4: DevOps, Cloud Infrastructure & CI/CD Pipelines",
      description: "Deploy auto-scaling containerized workloads with automated CI/CD pipelines, Terraform IaC, and observability telemetry.",
      duration: "3 Weeks",
      status: "pending" as const,
      prerequisites: ["Phase 3 High-Scale Infrastructure"],
      topics: ["Docker Containerization & Multi-Stage Builds", "Kubernetes Pod Orchestration", "Terraform Infrastructure as Code (IaC)", "Automated GitHub Actions CI/CD Pipelines"],
      weeklyBreakdown: [
        { week: "Week 9", title: "Production Docker & Container Hardening", description: "Write multi-stage Dockerfiles reducing image size from 1.2GB down to 60MB." },
        { week: "Week 10", title: "Kubernetes & Cloud Deployment", description: "Configure Kubernetes Deployments, Ingress controllers, and HPA auto-scaling on AWS / GCP." },
        { week: "Week 11", title: "CI/CD Pipelines & Telemetry Monitoring", description: "Automate linting, unit testing, docker build, and zero-downtime deployment pipelines." }
      ],
      projectIdea: "Deploy a containerized Kubernetes application on Cloud with automated CI/CD pipelines and Prometheus telemetry metrics.",
      codeExercise: "Write a multi-stage Dockerfile that builds a Next.js application into a minimal Alpine container.",
      interviewFocus: ["Difference between Kubernetes Deployment and StatefulSet?", "How does zero-downtime Rolling Update work?"],
      recommendedBooks: ["The DevOps Handbook by Gene Kim", "Kubernetes in Action by Marko Luksa"]
    },
    {
      step: 5,
      title: `Phase 5: Production Capstone & FAANG Interview Prep`,
      description: `Deliver a flagship production capstone project, master technical system design whiteboarding, and polish resume bullet metrics.`,
      duration: "3 Weeks",
      status: "pending" as const,
      prerequisites: ["Phase 4 Cloud & DevOps"],
      topics: ["End-to-End Flagship Capstone Build", "System Design Whiteboarding & Trade-Offs", "Algorithms & STAR Method Mock Interviews", "ATS Resume Metric Alignment"],
      weeklyBreakdown: [
        { week: "Week 12", title: "Flagship Capstone Development", description: "Complete end-to-end implementation of your custom production portfolio project." },
        { week: "Week 13", title: "System Design Mock Interviews", description: "Practice architectural whiteboarding for URL Shorteners, Newsfeeds, and Chat Applications." },
        { week: "Week 14", title: "FAANG Resume & Coding Drills", description: "Refine resume metrics (quantifiable impact) and practice high-frequency LeetCode algorithms." }
      ],
      projectIdea: `Complete and launch a production-grade ${roleName} SaaS platform deployed live with full documentation, live demo, and GitHub repository.`,
      codeExercise: "Conduct a full 45-minute live System Design mock interview whiteboarding session.",
      interviewFocus: ["Walk me through the architectural design of a distributed URL shortener.", "Describe your hardest technical bug and how you resolved it."],
      recommendedBooks: ["Cracking the Coding Interview by Gayle Laakmann McDowell", "System Design Interview Vol 2 by Alex Xu"]
    }
  ];
}

export async function POST(req: NextRequest) {
  try {
    let body;
    try {
      body = await req.json();
    } catch {
      body = {};
    }

    const profile: LearnerProfile = body.profile || {
      targetGoal: body.targetRole || "Full Stack AI Engineer",
      experienceLevel: body.experienceLevel || "Intermediate",
      knownSkills: [
        { name: "JavaScript", level: 4 },
        { name: "React", level: 3 },
        { name: "Python", level: 2 },
      ],
      targetSkills: [
        { name: "TypeScript", level: 4 },
        { name: "Next.js", level: 4 },
        { name: "LLMs & RAG Architectures", level: 4 },
        { name: "Vector Databases & Embeddings", level: 4 },
      ],
      interests: ["Generative AI", "Full Stack Development"],
      completedCourses: [],
      preferences: { pace: "Standard", style: "Project-Based", hoursPerWeek: 10 },
      skillGaps: [],
      lastUpdated: new Date().toISOString(),
    };

    const targetRoleName = profile.targetGoal || "Full Stack AI Engineer";

    if (process.env.GROQ_API_KEY) {
      try {
        const prompt = `You are an elite AI Senior Staff Architect.
Generate an ULTRA-DETAILED 5-phase career and engineering roadmap for a candidate targeting the role of "${targetRoleName}".
Current Skills: ${profile.knownSkills.map((s) => s.name).join(", ") || "Basics"}.
Level: ${profile.experienceLevel}. Style: ${profile.preferences.style}. Commitment: ${profile.preferences.hoursPerWeek} hrs/week.

Return STRICTLY a JSON object matching this schema without markdown formatting or code blocks:
{
  "id": "path-${Date.now()}",
  "targetRole": "${targetRoleName}",
  "overallDuration": "14 Weeks",
  "weeklyCommitment": "${profile.preferences.hoursPerWeek} Hours/Week",
  "learningPace": "${profile.preferences.pace}",
  "matchScore": 96,
  "prerequisiteFlow": [
    "Phase 1: Foundations & Core Concepts → Phase 2: Architecture & Specialized Stack",
    "Phase 2: Architecture & Specialized Stack → Phase 3: High-Scale Systems & Infrastructure",
    "Phase 3: High-Scale Systems & Infrastructure → Phase 4: DevOps, Cloud & CI/CD Pipelines",
    "Phase 4: DevOps, Cloud & CI/CD Pipelines → Phase 5: Production Capstone & FAANG Interview Prep"
  ],
  "aiSummary": "Comprehensive 5-phase engineering roadmap designed to bridge all skill gaps for ${targetRoleName} through production architecture labs, weekly module breakdowns, and interview whiteboarding.",
  "phases": [
    {
      "step": 1,
      "title": "Phase 1: Foundations & ${targetRoleName} Essentials",
      "description": "Master core computer science principles, type safety, memory allocation, and foundational data structures required for ${targetRoleName}.",
      "duration": "2 Weeks",
      "status": "completed",
      "prerequisites": ["Basic Syntax & Variables"],
      "topics": ["Core Architecture Patterns", "Data Structures & Time Complexity (Big-O)", "Memory Allocation & System Flow"],
      "weeklyBreakdown": [
        { "week": "Week 1", "title": "Foundation Concepts & Type Safety", "description": "Master core syntax, types, and architectural primitives for ${targetRoleName}." },
        { "week": "Week 2", "title": "Data Structures & Performance", "description": "Optimize algorithm complexity and memory allocation." }
      ],
      "projectIdea": "Build a modular, strongly-typed data validation engine with compile-time assertions.",
      "codeExercise": "Implement an LRU Cache with O(1) time complexity for get and put operations.",
      "interviewFocus": ["How does Big-O notation evaluate worst-case time complexity?", "Explain the difference between Stack and Heap memory."],
      "recommendedBooks": ["Clean Code by Robert C. Martin"]
    }
  ]
}`;

        const completion = await groq.chat.completions.create({
          messages: [{ role: "user", content: prompt }],
          model: "llama-3.3-70b-versatile",
          response_format: { type: "json_object" },
          temperature: 0.2,
        });

        const parsed = JSON.parse(completion.choices[0]?.message?.content || "{}");
        if (parsed.phases && Array.isArray(parsed.phases) && parsed.phases.length >= 3) {
          parsed.createdAt = new Date().toISOString();
          return NextResponse.json({ success: true, path: parsed });
        }
      } catch (groqErr) {
        console.warn("Groq execution failed, serving role-specific structured fallback:", groqErr);
      }
    }

    // Role-tailored dynamic fallback
    const roleSpecificPhases = generateRoleSpecificPhases(targetRoleName);

    const dynamicPath: StructuredLearningPath = {
      id: `path-${Date.now()}`,
      targetRole: targetRoleName,
      overallDuration: "14 Weeks",
      weeklyCommitment: `${profile.preferences.hoursPerWeek} Hours/Week`,
      learningPace: profile.preferences.pace,
      matchScore: 96,
      prerequisiteFlow: [
        "Phase 1: Foundations & Core Concepts → Phase 2: Architecture & Specialized Stack",
        "Phase 2: Architecture & Specialized Stack → Phase 3: High-Scale Systems & Infrastructure",
        "Phase 3: High-Scale Systems & Infrastructure → Phase 4: DevOps, Cloud & CI/CD Pipelines",
        "Phase 4: DevOps, Cloud & CI/CD Pipelines → Phase 5: Production Capstone & FAANG Interview Prep",
      ],
      aiSummary: `Detailed 5-phase engineering roadmap for ${targetRoleName} with weekly module breakdowns, hands-on lab code exercises, and technical interview whiteboarding.`,
      createdAt: new Date().toISOString(),
      phases: roleSpecificPhases,
    };

    return NextResponse.json({ success: true, path: dynamicPath });
  } catch (error: any) {
    console.error("Learning path API fatal error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to generate learning path",
      },
      { status: 200 }
    );
  }
}
