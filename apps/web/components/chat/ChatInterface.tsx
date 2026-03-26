"use client";
import { useState, useEffect, useRef } from "react";
import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input";
import { Skeleton } from "@repo/ui/skeleton";
import {
  Bot,
  User,
  Info,
  Send,
  CheckCircle2,
  Loader2,
  Search,
  Cpu,
  Zap,
  ChevronDown,
  ChevronUp,
  FileText,
  Download,
  Copy,
} from "lucide-react";
import { cn } from "@repo/ui/lib/utils";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  CompanyProfile,
  LiveEvent,
  Message,
  WorkflowStatus,
} from "@/utils/types";
import { STAGE_ORDER } from "@/utils/constants";
import ChatLayout from "./layout/ChatLayout";
import LeftPanel from "./layout/LeftPanel";
import RightPanel from "./layout/RightPanel";

type ChatInterfaceProps = {
  threadId: string;
  initialStatus: WorkflowStatus;
  initialQuestion?: string;
  initialPolicies?: string;
  errorMessage?: string;
  companyProfile?: CompanyProfile;
  initialMessages?: Message[];
  initialDrafts?: Record<string, string>;
  initialStagesComplete?: string[];
  initialActiveStage?: string | null;
};

// ─── ChatInterface ────────────────────────────────────────────────────────────
export function ChatInterface({
  threadId,
  initialStatus,
  initialQuestion,
  initialPolicies,
  errorMessage,
  companyProfile,
  initialMessages = [], // Defaults
  initialDrafts = {},
  initialStagesComplete = [],
  initialActiveStage = null,
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<WorkflowStatus>(initialStatus);
  const [policies, setPolicies] = useState<string | undefined>(initialPolicies);
  const [error, setError] = useState<string | undefined>(errorMessage);
  const [copiedPolicies, setCopiedPolicies] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false); // <-- NEW STATE FOR PDF

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Live event state
  const [liveEvents, setLiveEvents] = useState<LiveEvent[]>([]);
  const [currentNode, setCurrentNode] = useState<string | null>(null);
  const [streamingText, setStreamingText] = useState<string>("");
  const [isStreaming, setIsStreaming] = useState(false);

  // 2. Initialize Stage Progress from DB History
  const [stagesComplete, setStagesComplete] = useState<Set<string>>(
    new Set(initialStagesComplete),
  );
  const [activeStage, setActiveStage] = useState<string | null>(
    initialActiveStage,
  );
  const [questionCount, setQuestionCount] = useState(initialQuestion ? 1 : 0);
  const [backendDrafts, setBackendDrafts] =
    useState<Record<string, string>>(initialDrafts);

  // ─── Options selection state: { [messageId]: { "Q26": "chosen option", ... } }
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, Record<string, string>>
  >({});
  // Track which message ids have been submitted via options panel
  const [submittedOptionMessages, setSubmittedOptionMessages] = useState<
    Set<string>
  >(() => {
    const set = new Set<string>();
    if (initialMessages.length > 0) {
      initialMessages.forEach((m, idx) => {
        // Mark all assistant messages as submitted EXCEPT the very last one (if we are interrupted)
        if (m.role === "assistant" && idx < initialMessages.length - 1) {
          set.add(m.id);
        }
      });
    }
    return set;
  });

  // 5. Update the initialQuestion effect to avoid duplicate messages on refresh
  useEffect(() => {
    if (initialQuestion) {
      // const questionBlocks = parseQuestionBlocks(initialQuestion);
      setMessages([
        {
          id: "init",
          role: "assistant",
          content: initialQuestion,
          // questionBlocks: questionBlocks.length > 0 ? questionBlocks : undefined,
          timestamp: new Date(),
        },
      ]);
    }
  }, [initialQuestion]);

  useEffect(() => {
    if (initialStatus === "running") connectToStream("start", undefined);
    return () => {
      abortRef.current?.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function connectToStream(
    action: "start" | "resume",
    userInput: string | undefined,
  ) {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setIsStreaming(true);
    setStatus("running");
    setStreamingText("");
    setCurrentNode(null);
    if (action === "start") setLiveEvents([]);

    (async () => {
      try {
        const res = await fetch("/api/mandate/stream", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ threadId, action, input: userInput }),
          signal: controller.signal,
        });
        if (!res.ok || !res.body)
          throw new Error(`Stream request failed: ${res.status}`);

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const parts = buffer.split("\n\n");
          buffer = parts.pop() ?? "";
          for (const part of parts) {
            if (!part.trim()) continue;
            let eventName = "message";
            let dataLine = "";
            for (const line of part.split("\n")) {
              if (line.startsWith("event: ")) eventName = line.slice(7).trim();
              if (line.startsWith("data: ")) dataLine = line.slice(6).trim();
            }
            if (!dataLine) continue;
            try {
              handleSseEvent(eventName, JSON.parse(dataLine));
            } catch {
              continue;
            }
          }
        }
      } catch (err: any) {
        if (err?.name === "AbortError") return;
        setError(err.message ?? "Stream connection failed");
        setStatus("error");
      } finally {
        setIsStreaming(false);
        setCurrentNode(null);
        setActiveStage(null);
      }
    })();
  }

  function handleSseEvent(eventName: string, data: any) {
    // 🔥 RECURSIVE SEARCH: Extract state modifications no matter where the API hides them
    const extractDraftsDeep = (obj: any) => {
      if (!obj || typeof obj !== "object") return;
      for (const [key, val] of Object.entries(obj)) {
        if (key.startsWith("draft_policy_") && typeof val === "string") {
          setBackendDrafts((prev) => {
            if (prev[key] === val) return prev;
            return { ...prev, [key]: val };
          });
        } else if (typeof val === "object") {
          extractDraftsDeep(val);
        }
      }
    };
    extractDraftsDeep(data);

    switch (eventName) {
      case "node_start":
        setCurrentNode(data.node);
        setStreamingText("");
        setLiveEvents((prev) => [...prev, { type: "node_start", ...data }]);
        if (STAGE_ORDER.includes(data.node)) setActiveStage(data.node);
        break;

      case "node_complete":
        setCurrentNode((cur) => (cur === data.node ? null : cur));
        setLiveEvents((prev) => [...prev, { type: "node_complete", ...data }]);
        if (STAGE_ORDER.includes(data.node)) {
          setStagesComplete((prev) => new Set(prev).add(data.node));
        }
        break;

      case "token":
        setStreamingText((prev) => {
          const next = prev + data.text;
          return next.length > 300 ? next.slice(-300) : next;
        });
        break;

      case "tool_start":
        setLiveEvents((prev) => [...prev, { type: "tool_start", ...data }]);
        break;

      case "tool_complete":
        setLiveEvents((prev) => [...prev, { type: "tool_complete", ...data }]);
        break;

      case "status": {
        const newStatus: WorkflowStatus =
          data.status === "interrupt"
            ? "interrupt"
            : data.status === "completed"
              ? "completed"
              : data.status === "error"
                ? "error"
                : "running";
        setStatus(newStatus);

        if (newStatus === "interrupt" && data.question) {
          pushMessage({ role: "assistant", content: data.question });
          setQuestionCount((c) => c + 1);
        }
        if (newStatus === "completed" && data.policies) {
          setPolicies(data.policies);
          pushMessage({
            role: "system",
            content:
              "Your AI governance policies are ready. Review the full document in the panel on the left.",
          });
        }
        break;
      }

      case "error":
        setError(data.message ?? "An error occurred in the stream");
        setStatus("error");
        break;

      case "done":
        setIsStreaming(false);
        break;
    }
  }

  function pushMessage(msg: Omit<Message, "id" | "timestamp">) {
    // const questionBlocks =
    //   msg.role === "assistant" ? parseQuestionBlocks(msg.content) : undefined;
    setMessages((prev) => [
      ...prev,
      {
        ...msg,
        // questionBlocks:
        //   questionBlocks && questionBlocks.length > 0
        //     ? questionBlocks
        //     : undefined,
        id: `msg-${Date.now()}-${Math.random()}`,
        timestamp: new Date(),
      },
    ]);
  }

  const submitAnswer = (text: string) => {
    setInput("");
    setError(undefined);
    setIsSubmitting(true);
    pushMessage({ role: "user", content: text });
    connectToStream("resume", text);
    setIsSubmitting(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userText = input;
    submitAnswer(userText);
  };

  const handleCopyPolicies = () => {
    if (policies) {
      navigator.clipboard.writeText(policies);
      setCopiedPolicies(true);
      setTimeout(() => setCopiedPolicies(false), 2000);
    }
  };
  // ─── NEW: PDF DOWNLOAD HANDLER ──────────────────────────────────────────────
  const handleDownloadPdf = async () => {
    // setIsDownloading(true);
    // try {
    //   const element = document.getElementById("final-policy-document");
    //   if (!element) throw new Error("Document element not found");

    //   // Dynamically import to bypass Next.js SSR document/window errors
    //   const html2pdf = (await import("html2pdf.js")).default;

    //   const fileName = companyProfile?.name
    //     ? `${companyProfile.name.replace(/\s+/g, "_")}_AI_Policy.pdf`
    //     : "AI_Governance_Policy.pdf";

    //   const opt = {
    //     // Fix: Use 'as const' to tell TypeScript this is exactly a 4-number tuple
    //     margin:[15, 15, 15, 15] as [number, number, number, number],
    //     filename: fileName,
    //     image: { type: "jpeg" as const, quality: 0.98 },
    //     html2canvas: {
    //       scale: 2,
    //       useCORS: true,
    //       logging: false,
    //       windowWidth: 1024 // Forces desktop rendering of tailwind classes
    //     },
    //     jsPDF: { unit: "mm" as const, format: "a4" as const, orientation: "portrait" as const }
    //   };

    //   await html2pdf().set(opt).from(element).save();
    // } catch (err) {
    //   console.error("Error generating PDF:", err);
    // } finally {
    //   setIsDownloading(false);
    // }
    window.print();
  };

  return (
    <ChatLayout
      left={
        <LeftPanel
          policies={policies}
          companyProfile={companyProfile}
          isStreaming={isStreaming}
          activeStage={activeStage}
          stagesComplete={stagesComplete}
          questionCount={questionCount}
          backendDrafts={backendDrafts}
          liveEvents={liveEvents}
          currentNode={currentNode}
          streamingText={streamingText}
          copiedPolicies={copiedPolicies}
          isDownloading={isDownloading}
          onCopy={handleCopyPolicies}
          onDownload={handleDownloadPdf}
        />
      }
      right={
        <RightPanel
          companyProfile={companyProfile}
          status={status}
          messages={messages}
          input={input}
          setInput={setInput}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          isStreaming={isStreaming}
          error={error}
        />
      }
    />
  );
}
