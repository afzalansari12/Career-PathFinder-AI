// frontend/src/app/roadmap/page.tsx
"use client";

import { useState, useCallback } from "react";
import AppShell from "@/components/layout/AppShell";
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  MarkerType,
} from "reactflow";
import "reactflow/dist/style.css";
import { CheckCircle2, ExternalLink, Sparkles, BookOpen } from "lucide-react";

interface Resource {
  title: string;
  url: string;
}

interface NodeData {
  label: string;
  category: string;
  completed: boolean;
  resources: Resource[];
}

const initialNodes: Node<NodeData>[] = [
  {
    id: "1",
    position: { x: 250, y: 0 },
    data: {
      label: "System Fundamentals",
      category: "Core",
      completed: true,
      resources: [
        { title: "OSI Model & Networking Basics", url: "https://developer.mozilla.org" },
        { title: "Concurrency & Process Memory", url: "https://cppreference.com" },
      ],
    },
    style: { background: "#ecfdf5", borderColor: "#059669", borderRadius: "12px", padding: "10px" },
  },
  {
    id: "2",
    position: { x: 100, y: 120 },
    data: {
      label: "High-Throughput APIs",
      category: "Backend",
      completed: true,
      resources: [
        { title: "Next.js App Router API Routes", url: "https://nextjs.org/docs" },
        { title: "Rate Limiting with Redis Sliding Window", url: "https://redis.io/docs" },
      ],
    },
    style: { background: "#ecfdf5", borderColor: "#059669", borderRadius: "12px", padding: "10px" },
  },
  {
    id: "3",
    position: { x: 400, y: 120 },
    data: {
      label: "System Design Trade-offs",
      category: "Architecture",
      completed: false,
      resources: [
        { title: "CAP Theorem & Database Sharding", url: "https://microservices.io" },
        { title: "WebSockets vs SSE for 50k Concurrent Connections", url: "https://nextjs.org" },
      ],
    },
    style: { background: "#f8fafc", borderColor: "#cbd5e1", borderRadius: "12px", padding: "10px" },
  },
  {
    id: "4",
    position: { x: 250, y: 250 },
    data: {
      label: "Distributed Caching & Microservices",
      category: "Advanced",
      completed: false,
      resources: [
        { title: "Redis Pub/Sub Architecture", url: "https://redis.io" },
        { title: "Docker Containerization & Kubernetes Basics", url: "https://docker.com" },
      ],
    },
    style: { background: "#f8fafc", borderColor: "#cbd5e1", borderRadius: "12px", padding: "10px" },
  },
];

const initialEdges: Edge[] = [
  { id: "e1-2", source: "1", target: "2", animated: true, markerEnd: { type: MarkerType.ArrowClosed } },
  { id: "e1-3", source: "1", target: "3", animated: true, markerEnd: { type: MarkerType.ArrowClosed } },
  { id: "e2-4", source: "2", target: "4", markerEnd: { type: MarkerType.ArrowClosed } },
  { id: "e3-4", source: "3", target: "4", markerEnd: { type: MarkerType.ArrowClosed } },
];

export default function RoadmapPage() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<Node<NodeData> | null>(initialNodes[0]);

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedNode(node as Node<NodeData>);
  }, []);

  const toggleNodeCompletion = (nodeId: string) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          const isCompleted = !node.data.completed;
          return {
            ...node,
            data: { ...node.data, completed: isCompleted },
            style: {
              ...node.style,
              background: isCompleted ? "#ecfdf5" : "#f8fafc",
              borderColor: isCompleted ? "#059669" : "#cbd5e1",
            },
          };
        }
        return node;
      })
    );

    if (selectedNode && selectedNode.id === nodeId) {
      setSelectedNode((prev) =>
        prev
          ? {
              ...prev,
              data: { ...prev.data, completed: !prev.data.completed },
            }
          : null
      );
    }
  };

  const completedCount = nodes.filter((n) => n.data.completed).length;
  const progressPercent = Math.round((completedCount / nodes.length) * 100);

  return (
    <AppShell>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div>
            <h1 className="text-xl font-heading font-bold text-foreground">
              Interactive Career Roadmap
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Software Engineering Target Track · Click nodes to view resources & log progress
            </p>
          </div>
          <div className="flex items-center gap-3 bg-card border border-border px-4 py-2 rounded-xl">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-bold text-foreground">
              {progressPercent}% Complete
            </span>
          </div>
        </div>

        {/* Graph Canvas & Side Detail Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* React Flow Viewport */}
          <div className="lg:col-span-8 bg-card border border-border rounded-2xl h-[520px] shadow-2xs relative overflow-hidden">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onNodeClick={onNodeClick}
              fitView
            >
              <Background gap={16} size={1} />
              <Controls />
            </ReactFlow>
          </div>

          {/* Selected Node Drawer */}
          <div className="lg:col-span-4 bg-card border border-border rounded-2xl p-6 shadow-2xs space-y-5">
            {selectedNode ? (
              <>
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                      {selectedNode.data.category}
                    </span>
                    <h3 className="font-heading font-bold text-base text-foreground mt-2">
                      {selectedNode.data.label}
                    </h3>
                  </div>

                  <button
                    onClick={() => toggleNodeCompletion(selectedNode.id)}
                    className={`p-2 rounded-xl transition cursor-pointer ${
                      selectedNode.data.completed
                        ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                        : "bg-secondary text-muted-foreground hover:text-foreground border border-border"
                    }`}
                    title="Toggle Status"
                  >
                    <CheckCircle2 className="w-5 h-5" />
                  </button>
                </div>

                <hr className="border-border" />

                <div className="space-y-3">
                  <span className="text-xs font-bold uppercase text-muted-foreground flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-primary" /> Learning Resources
                  </span>

                  <div className="space-y-2">
                    {selectedNode.data.resources.map((res, idx) => (
                      <a
                        key={idx}
                        href={res.url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-between p-3 bg-background hover:bg-accent/50 border border-border rounded-xl text-xs font-medium text-foreground transition group"
                      >
                        <span className="truncate group-hover:text-primary transition">
                          {res.title}
                        </span>
                        <ExternalLink className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary shrink-0" />
                      </a>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <p className="text-xs text-muted-foreground">Click a node on the map to view details.</p>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}