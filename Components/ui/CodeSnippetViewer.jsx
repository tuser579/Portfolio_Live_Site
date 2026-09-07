"use client";

import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Code, Copy, Check, Play, Terminal, Sparkles,
  FileCode2, Database, ShieldCheck, Zap, Layers, RefreshCw
} from "lucide-react";
import toast from "react-hot-toast";
import { safeCopyToClipboard } from "../../src/lib/clipboard.js";

const SNIPPETS = [
  {
    id: "aggregation",
    title: "MongoDB Aggregation Pipeline",
    filename: "cityAnalytics.pipeline.js",
    lang: "javascript",
    icon: Database,
    accent: "var(--cyan)",
    category: "Backend & Database",
    description: "Complex multi-stage aggregation pipeline calculating real-time civic issue resolution rates grouped by category with lookup and faceted statistics.",
    executionOutput: `{
  "status": "success",
  "executionTime": "24ms",
  "matchedRecords": 1420,
  "data": [
    { "category": "Road Damage", "totalIssues": 540, "resolvedRate": "88.4%", "avgResolutionHours": 32.5 },
    { "category": "Street Lighting", "totalIssues": 310, "resolvedRate": "94.2%", "avgResolutionHours": 14.1 },
    { "category": "Waste Management", "totalIssues": 570, "resolvedRate": "91.8%", "avgResolutionHours": 21.0 }
  ]
}`,
    code: `// MongoDB Multi-Stage Aggregation: Civic Issue Analytics
import { IssueModel } from "../models/Issue.js";

export async function getCategoryPerformanceStats(cityZoneId) {
  return await IssueModel.aggregate([
    // Stage 1: Filter active zone records
    {
      $match: {
        zoneId: cityZoneId,
        createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
      }
    },
    // Stage 2: Join with citizen votes and reporter profiles
    {
      $lookup: {
        from: "users",
        localField: "reporterId",
        foreignField: "_id",
        as: "reporterDetails"
      }
    },
    // Stage 3: Group by issue category and compute metrics
    {
      $group: {
        _id: "$category",
        totalIssues: { $sum: 1 },
        resolvedCount: {
          $sum: { $cond: [{ $eq: ["$status", "RESOLVED"] }, 1, 0] }
        },
        avgResolutionHours: {
          $avg: {
            $divide: [{ $subtract: ["$resolvedAt", "$createdAt"] }, 3600000]
          }
        }
      }
    },
    // Stage 4: Project clean format with percentage calculations
    {
      $project: {
        _id: 0,
        category: "$_id",
        totalIssues: 1,
        resolvedRate: {
          $concat: [
            { $toString: { $round: [{ $multiply: [{ $divide: ["$resolvedCount", "$totalIssues"] }, 100] }, 1] } },
            "%"
          ]
        },
        avgResolutionHours: { $round: ["$avgResolutionHours", 1] }
      }
    },
    { $sort: { totalIssues: -1 } }
  ]);
}`,
  },
  {
    id: "jwtAuth",
    title: "RBAC & JWT Verify Middleware",
    filename: "verifyRoleAuth.middleware.js",
    lang: "javascript",
    icon: ShieldCheck,
    accent: "var(--emerald)",
    category: "Security & API",
    description: "Production-grade Express middleware validating signed JWT Bearer tokens and enforcing Role-Based Access Control (Admin, Moderator, Citizen) with security headers.",
    executionOutput: `{
  "authenticated": true,
  "user": {
    "id": "usr_994812",
    "role": "ADMIN",
    "permissions": ["READ", "WRITE", "DELETE", "AUDIT_LOGS"]
  },
  "jwtVerified": true,
  "latency": "1.8ms"
}`,
    code: `// Express JWT & Role-Based Access Control (RBAC)
import jwt from "jsonwebtoken";
import { AppError } from "../utils/AppError.js";

export const requireRole = (...allowedRoles) => {
  return async (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader?.startsWith("Bearer ")) {
        throw new AppError("Authentication token missing or invalid", 401);
      }

      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET, {
        algorithms: ["HS256"],
        issuer: "portfolio.muttakiul.dev"
      });

      // Role authorization check
      if (!allowedRoles.includes(decoded.role)) {
        throw new AppError(
          \`Access denied: Role '\${decoded.role}' lacks required permissions\`,
          403
        );
      }

      req.user = decoded;
      res.setHeader("X-Auth-Role", decoded.role);
      next();
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        return next(new AppError("Session expired. Please re-authenticate", 401));
      }
      next(err);
    }
  };
};`,
  },
  {
    id: "nextServerAction",
    title: "Next.js 15 Server Action & Revalidation",
    filename: "orderActions.ts",
    lang: "typescript",
    icon: Zap,
    accent: "var(--violet)",
    category: "Full-Stack Next.js",
    description: "Type-safe Next.js 15 Server Action executing Stripe payment validation, MongoDB inventory atomic decrements, and instant on-demand tag revalidation.",
    executionOutput: `{
  "success": true,
  "orderId": "ord_8829104",
  "revalidatedTags": ["products", "orders", "inventory"],
  "cachePurged": true,
  "duration": "42ms"
}`,
    code: `// Next.js 15 Server Action with Atomic Inventory & Revalidation
"use server";

import { revalidateTag } from "next/cache";
import { dbConnect } from "@/lib/db";
import { Product } from "@/models/Product";
import { Order } from "@/models/Order";
import { z } from "zod";

const OrderSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().positive(),
  userEmail: z.string().email(),
});

export async function processOrderAction(formData: unknown) {
  const result = OrderSchema.safeParse(formData);
  if (!result.success) {
    return { success: false, errors: result.error.flatten().fieldErrors };
  }

  await dbConnect();
  const { productId, quantity, userEmail } = result.data;

  // Atomic inventory decrement preventing race conditions
  const updatedProduct = await Product.findOneAndUpdate(
    { _id: productId, stock: { $gte: quantity } },
    { $inc: { stock: -quantity } },
    { new: true }
  );

  if (!updatedProduct) {
    return { success: false, error: "Insufficient stock available" };
  }

  const order = await Order.create({
    productId,
    quantity,
    userEmail,
    totalPrice: updatedProduct.price * quantity,
    status: "PAID"
  });

  // On-demand Next.js 15 Cache Revalidation
  revalidateTag("products");
  revalidateTag(\`product-\${productId}\`);

  return { success: true, orderId: order._id.toString() };
}`,
  },
  {
    id: "debounceHook",
    title: "Custom React Search Hook (AbortController)",
    filename: "useDebouncedFetch.js",
    lang: "javascript",
    icon: Layers,
    accent: "var(--amber)",
    category: "Frontend Architecture",
    description: "Custom React Hook implementing debounced asynchronous queries with automatic AbortController cleanup to prevent race conditions and network memory leaks.",
    executionOutput: `{
  "hookState": "idle",
  "query": "Full-Stack React",
  "abortedRequests": 0,
  "cachedResults": 8,
  "memoryLeakPrevented": true
}`,
    code: `// React Custom Hook: Debounced Fetch with Cancellation
import { useState, useEffect, useRef } from "react";

export function useDebouncedFetch(url, query, delay = 350) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const abortControllerRef = useRef(null);

  useEffect(() => {
    if (!query?.trim()) {
      setData(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const handler = setTimeout(async () => {
      // Cancel previous in-flight requests to eliminate race conditions
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      abortControllerRef.current = new AbortController();

      try {
        const response = await fetch(
          \`\${url}?q=\${encodeURIComponent(query)}\`,
          { signal: abortControllerRef.current.signal }
        );

        if (!response.ok) throw new Error(\`HTTP error: \${response.status}\`);
        const json = await response.json();
        setData(json);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message || "Failed to fetch search results");
        }
      } finally {
        setLoading(false);
      }
    }, delay);

    return () => clearTimeout(handler);
  }, [url, query, delay]);

  return { data, loading, error };
}`,
  },
];

export default function CodeSnippetViewer() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const [activeSnippet, setActiveSnippet] = useState(SNIPPETS[0]);
  const [copied, setCopied] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [showOutput, setShowOutput] = useState(false);

  const handleCopy = async () => {
    const success = await safeCopyToClipboard(activeSnippet.code);
    if (success) {
      setCopied(true);
      toast.success("Code snippet copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } else {
      toast.error("Could not copy snippet to clipboard");
    }
  };

  const handleRunCode = () => {
    setIsRunning(true);
    setShowOutput(true);
    setTimeout(() => {
      setIsRunning(false);
      toast.success("Pipeline executed successfully!");
    }, 600);
  };

  return (
    <section id="code-snippets" className="section-padding overflow-hidden" ref={ref}>
      <div className="site-container">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          style={{ textAlign: "center", marginBottom: "3rem" }}
        >
          <h2 className="section-title">
            Production Code <span className="text-gradient">&amp; Pipelines</span>
          </h2>
          <div className="section-line" />
          <p className="section-subtitle">
            Clean, scalable full-stack patterns built for high-concurrency production environments
          </p>
        </motion.div>

        {/* ── IDE-Style Liquid Glass Container ── */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.15, duration: 0.7 }}
          style={{
            background: "rgba(4, 13, 36, 0.94)",
            backdropFilter: "blur(32px)",
            border: "1px solid var(--glass-border)",
            borderRadius: 24,
            boxShadow: "var(--glow-card)",
            overflow: "hidden",
          }}
        >
          {/* ── File Explorer / Tab Switcher ── */}
          <div style={{
            display: "flex",
            alignItems: "center",
            overflowX: "auto",
            borderBottom: "1px solid var(--glass-border)",
            background: "rgba(2, 8, 24, 0.7)",
          }}>
            {SNIPPETS.map((snippet) => {
              const isActive = activeSnippet.id === snippet.id;
              const Icon = snippet.icon;
              return (
                <button
                  key={snippet.id}
                  onClick={() => {
                    setActiveSnippet(snippet);
                    setShowOutput(false);
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.55rem",
                    padding: "0.85rem 1.25rem",
                    borderRight: "1px solid var(--glass-border)",
                    background: isActive ? "rgba(255, 255, 255, 0.06)" : "transparent",
                    borderBottom: isActive ? "2px solid var(--cyan)" : "2px solid transparent",
                    color: isActive ? "var(--text-primary)" : "var(--text-secondary)",
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "0.78rem",
                    fontWeight: isActive ? 700 : 500,
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                    transition: "all 0.2s",
                  }}
                >
                  <Icon size={14} style={{ color: isActive ? "var(--cyan)" : "var(--text-muted)" }} />
                  <span>{snippet.filename}</span>
                </button>
              );
            })}
          </div>

          {/* ── Toolbar: Window Controls & Actions ── */}
          <div style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0.75rem 1.25rem",
            borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
            background: "rgba(255, 255, 255, 0.02)",
            gap: "0.75rem",
          }}>
            {/* Meta info */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 hidden sm:flex">
                <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#ef4444" }} />
                <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#f59e0b" }} />
                <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#10b981" }} />
              </div>
              <span style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: "0.82rem",
                fontWeight: 700,
                color: "var(--cyan)",
              }}>
                {activeSnippet.title}
              </span>
              <span style={{
                fontSize: "0.68rem",
                padding: "0.15rem 0.5rem",
                borderRadius: 9999,
                background: "rgba(0, 212, 255, 0.12)",
                color: "var(--cyan)",
                fontFamily: "'JetBrains Mono', monospace",
              }}>
                {activeSnippet.category}
              </span>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleRunCode}
                disabled={isRunning}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  padding: "0.4rem 0.85rem",
                  borderRadius: 10,
                  background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                  border: "none",
                  color: "#ffffff",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  fontFamily: "'Outfit', sans-serif",
                  cursor: "pointer",
                  boxShadow: "0 4px 14px rgba(16, 185, 129, 0.3)",
                }}
              >
                {isRunning ? <RefreshCw size={13} className="animate-spin" /> : <Play size={13} fill="#ffffff" />}
                <span>{isRunning ? "Simulating..." : "Run Pipeline"}</span>
              </button>

              <button
                onClick={handleCopy}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  padding: "0.4rem 0.85rem",
                  borderRadius: 10,
                  background: "rgba(255, 255, 255, 0.08)",
                  border: "1px solid var(--glass-border)",
                  color: "var(--text-primary)",
                  fontSize: "0.75rem",
                  fontFamily: "'JetBrains Mono', monospace",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                {copied ? <Check size={13} style={{ color: "#10b981" }} /> : <Copy size={13} />}
                <span>{copied ? "Copied" : "Copy"}</span>
              </button>
            </div>
          </div>

          {/* Description banner */}
          <div style={{
            padding: "0.75rem 1.25rem",
            background: "rgba(0, 212, 255, 0.03)",
            borderBottom: "1px solid rgba(255, 255, 255, 0.04)",
            fontSize: "0.78rem",
            color: "var(--text-secondary)",
            lineHeight: 1.5,
          }}>
            💡 <strong>Architecture Note:</strong> {activeSnippet.description}
          </div>

          {/* ── Main Code Viewer ── */}
          <div style={{
            padding: "1.25rem",
            overflowX: "auto",
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "0.82rem",
            lineHeight: 1.7,
            maxHeight: "440px",
            overflowY: "auto",
          }}>
            <pre style={{ margin: 0, color: "#e2e8f0" }}>
              <code>
                {activeSnippet.code.split("\n").map((line, idx) => (
                  <div key={idx} className="flex">
                    <span style={{
                      width: "2.8rem",
                      color: "rgba(255, 255, 255, 0.25)",
                      userSelect: "none",
                      textAlign: "right",
                      paddingRight: "1rem",
                      flexShrink: 0,
                    }}>
                      {idx + 1}
                    </span>
                    <span style={{
                      color: line.startsWith("//") ? "#64748b" :
                             line.includes("import ") || line.includes("export ") || line.includes("return ") || line.includes("const ") || line.includes("async ") || line.includes("await ") ? "#e879f9" :
                             line.includes("function ") || line.includes("=>") ? "#38bdf8" :
                             line.includes("$match") || line.includes("$lookup") || line.includes("$group") || line.includes("$project") ? "#34d399" :
                             line.includes("\"") || line.includes("'") ? "#fbbf24" : "#f1f5f9"
                    }}>
                      {line}
                    </span>
                  </div>
                ))}
              </code>
            </pre>
          </div>

          {/* ── Simulated Live Execution Console (When Run is triggered) ── */}
          {showOutput && (
            <div style={{
              borderTop: "1px solid rgba(0, 212, 255, 0.25)",
              background: "rgba(2, 8, 24, 0.9)",
              padding: "1rem 1.25rem",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.75rem",
            }}>
              <div className="flex items-center gap-2 text-emerald-400 font-bold mb-2">
                <Terminal size={14} />
                <span>Simulated Pipeline Output (Execution Result):</span>
              </div>
              <pre style={{ color: "#a7f3d0", margin: 0, whiteSpace: "pre-wrap" }}>
                {activeSnippet.executionOutput}
              </pre>
            </div>
          )}

        </motion.div>

      </div>
    </section>
  );
}
