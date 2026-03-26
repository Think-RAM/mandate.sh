"use client";

import StatusBadge from "../messages/StatusBadge";
import MessageList from "../messages/MessageList";
import ChatInput from "../messages/ChatInput";

export default function RightPanel(props: {
  companyProfile: any;
  status: any;

  messages: any[];
  input: string;
  setInput: (v: string) => void;

  onSubmit: (e: React.FormEvent) => void;

  isSubmitting: boolean;
  isStreaming: boolean;

  error?: string;
}) {
  const {
    companyProfile,
    status,
    messages,
    input,
    setInput,
    onSubmit,
    isSubmitting,
    isStreaming,
    error,
  } = props;

  return (
    <div className="flex flex-col h-full w-full max-w-5xl mx-auto bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-zinc-800 overflow-hidden">
      {/* HEADER */}
      <div className="bg-white dark:bg-zinc-900 border-b border-gray-100 dark:border-zinc-800 shadow-sm z-10 shrink-0">
        <div className="px-6 py-5 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                AI Governance Assistant
              </h1>

              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {companyProfile?.name
                  ? `Building policy for ${companyProfile.name}`
                  : "Get personalised AI compliance guidance"}
              </p>
            </div>

            <StatusBadge status={status} />
          </div>
        </div>
      </div>

      {/* MESSAGES */}
      <MessageList
        messages={messages}
        isStreaming={isStreaming}
        error={error}
      />

      {/* INPUT */}
      {status === "interrupt" && (
        <ChatInput
          input={input}
          setInput={setInput}
          onSubmit={onSubmit}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
}