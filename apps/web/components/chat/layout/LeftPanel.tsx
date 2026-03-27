"use client";

import { FileText, Loader2, Copy, Download, CheckCircle2, Sparkles } from "lucide-react";
import { StageProgressBar } from "../policy/StageProgressBar";
import { DraftPolicy } from "../policy/DraftPolicy";
import { AgentActivityStrip } from "../agent/AgentActivityStrip";

export default function LeftPanel(props: {
  policies?: string;
  companyProfile: any;
  isStreaming: boolean;

  activeStage: string | null;
  stagesComplete: Set<string>;
  questionCount: number;

  backendDrafts: Record<string, string>;

  liveEvents: any[];
  currentNode: string | null;
  streamingText: string;

  copiedPolicies: boolean;
  isDownloading: boolean;

  onCopy: () => void;
  onDownload: () => void;

  onGenerateSummary: () => void;
  isGeneratingSummary: boolean;
}) {
  const {
    policies,
    companyProfile,
    isStreaming,
    activeStage,
    stagesComplete,
    questionCount,
    backendDrafts,
    liveEvents,
    currentNode,
    streamingText,
    copiedPolicies,
    isDownloading,
    onCopy,
    onDownload,
    onGenerateSummary,
    isGeneratingSummary,
  } = props;

  const leftPanelTitle = policies ? "AI Governance Policies" : "Policy Draft";

  const leftPanelSubtitle = policies
    ? "Your final AI governance document"
    : questionCount > 0
      ? `${questionCount} question${questionCount !== 1 ? "s" : ""} answered — draft updates as you go`
      : "Sections fill in as you answer questions";

  return (
    <>
      {/* HEADER */}
      <div className="py-4 px-5 border-b border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shrink-0 print:hidden">
        <div className="flex items-center justify-between">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary shrink-0" />

              <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                {leftPanelTitle}
              </h2>

              {policies && (
                <div className="flex items-center gap-2 ml-2">
                  <button
                    onClick={onCopy}
                    className="text-[11px] font-medium flex items-center gap-1 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 border border-gray-200 dark:border-zinc-700 rounded px-2.5 py-1 transition-colors"
                  >
                    {copiedPolicies ? (
                      <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                    {copiedPolicies ? "Copied" : "Copy"}
                  </button>

                  <button
                    onClick={onDownload}
                    disabled={isDownloading}
                    className="text-[11px] font-medium flex items-center gap-1 bg-gray-50 dark:bg-zinc-800 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 border border-gray-200 dark:border-zinc-700 rounded px-2.5 py-1 transition-colors disabled:opacity-50"
                  >
                    {isDownloading ? (
                      <Loader2 className="h-3 w-3 animate-spin text-primary" />
                    ) : (
                      <Download className="h-3 w-3" />
                    )}
                    {isDownloading ? "Saving..." : "PDF"}
                  </button>

                  <button
                    onClick={onGenerateSummary}
                    disabled={isGeneratingSummary}
                    className="text-[11px] font-medium flex items-center gap-1 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 border border-emerald-200 dark:border-emerald-500/30 rounded px-2.5 py-1 transition-colors disabled:opacity-50"
                  >
                    {isGeneratingSummary ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <Sparkles className="h-3 w-3" />
                    )}
                    {isGeneratingSummary ? "Generating..." : "Summary"}
                  </button>
                </div>
              )}
            </div>

            <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5 truncate">
              {leftPanelSubtitle}
            </p>
          </div>

          {isStreaming && (
            <div className="flex items-center gap-1 text-xs text-primary shrink-0 ml-3">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              <span>Updating...</span>
            </div>
          )}
        </div>
      </div>

      {/* STAGE BAR */}
      {!policies && (
        <StageProgressBar
          activeStage={activeStage}
          stagesComplete={stagesComplete}
        />
      )}

      {/* POLICY */}
      <DraftPolicy
        companyProfile={companyProfile}
        activeStage={activeStage}
        stagesComplete={stagesComplete}
        questionCount={questionCount}
        finalPolicy={policies}
        backendDrafts={backendDrafts}
      />

      {/* AGENT STRIP */}
      {!policies && (
        <AgentActivityStrip
          liveEvents={liveEvents}
          currentNode={currentNode}
          streamingText={streamingText}
          isStreaming={isStreaming}
        />
      )}
    </>
  );
}
