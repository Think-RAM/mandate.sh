"use client";

import { Message } from "@/utils/types";
import { cn } from "@repo/ui/lib/utils";
import { Bot, User, Info } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type Props = {
  message: Message;
};

export default function MessageItem({ message: msg }: Props) {
  return (
    <div
      className={cn(
        "flex gap-4 animate-in fade-in-50 slide-in-from-bottom-3 duration-500",
        msg.role === "user" && "flex-row-reverse",
        msg.role === "system" && "justify-center"
      )}
    >
      {/* Avatar */}
      {msg.role !== "system" && (
        <div
          className={cn(
            "flex h-10 w-10 lg:h-12 lg:w-12 shrink-0 items-center justify-center rounded-full shadow-md",
            msg.role === "user"
              ? "bg-primary text-primary-foreground"
              : "bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700"
          )}
        >
          {msg.role === "user" ? (
            <User className="h-5 w-5 lg:h-6 lg:w-6" />
          ) : (
            <Bot className="h-5 w-5 lg:h-6 lg:w-6 text-gray-700 dark:text-gray-300" />
          )}
        </div>
      )}

      {/* Message Bubble */}
      <div
        className={cn(
          "max-w-[85%] lg:max-w-[75%] rounded-3xl px-5 py-4 shadow-sm transition-all hover:shadow-md",
          msg.role === "user" &&
            "bg-primary text-primary-foreground rounded-br-sm",
          msg.role === "assistant" &&
            "bg-white dark:bg-zinc-800 text-gray-800 dark:text-gray-200 rounded-bl-sm border border-gray-100 dark:border-zinc-700",
          msg.role === "system" &&
            "bg-blue-50/80 text-blue-900 dark:bg-blue-900/20 dark:text-blue-200 max-w-md mx-auto border border-blue-100 dark:border-blue-900"
        )}
      >
        {/* System Header */}
        {msg.role === "system" && (
          <div className="flex items-center gap-2 mb-2">
            <Info className="h-4 w-4" />
            <span className="text-xs font-bold uppercase tracking-wider">
              System
            </span>
          </div>
        )}

        {/* Markdown Content */}
        <div className="prose prose-sm max-w-none text-[15px] leading-relaxed dark:prose-invert [&>p]:mb-0 [&>p:not(:last-child)]:mb-4">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({ node, ...props }) => (
                <h1
                  className="text-2xl font-extrabold text-gray-900 dark:text-gray-100 mt-10 mb-6 pb-2 border-b-2 border-gray-100 dark:border-zinc-800"
                  {...props}
                />
              ),
              h2: ({ node, ...props }) => (
                <h2
                  className="text-xl font-bold text-gray-800 dark:text-gray-200 mt-10 mb-4 tracking-tight"
                  {...props}
                />
              ),
              h3: ({ node, ...props }) => (
                <h3
                  className="text-lg font-semibold text-gray-800 dark:text-gray-300 mt-8 mb-3"
                  {...props}
                />
              ),
              p: ({ node, ...props }) => (
                <p
                  className="text-[15px] text-gray-600 dark:text-gray-400 leading-relaxed mb-5"
                  {...props}
                />
              ),
              ul: ({ node, ...props }) => (
                <ul
                  className="list-disc pl-6 mb-6 space-y-2 text-[15px] text-gray-600 dark:text-gray-400 marker:text-emerald-500"
                  {...props}
                />
              ),
              ol: ({ node, ...props }) => (
                <ol
                  className="list-decimal pl-6 mb-6 space-y-2 text-[15px] text-gray-600 dark:text-gray-400 marker:text-emerald-500 font-medium"
                  {...props}
                />
              ),
              li: ({ node, ...props }) => (
                <li className="pl-1 leading-relaxed" {...props} />
              ),
              strong: ({ node, ...props }) => (
                <strong
                  className="font-semibold text-gray-900 dark:text-gray-200"
                  {...props}
                />
              ),
              blockquote: ({ node, ...props }) => (
                <blockquote
                  className="border-l-4 border-emerald-500/50 bg-emerald-50/50 dark:bg-emerald-500/10 pl-5 py-3 my-6 rounded-r-lg italic text-gray-700 dark:text-gray-300"
                  {...props}
                />
              ),
              a: ({ node, ...props }) => (
                <a
                  className="text-emerald-600 dark:text-emerald-400 hover:underline font-medium"
                  {...props}
                />
              ),
              table: ({ node, ...props }) => (
                <div className="overflow-x-auto my-6 border border-gray-200 dark:border-zinc-700 rounded-lg">
                  <table
                    className="w-full text-left text-sm text-gray-600 dark:text-gray-400"
                    {...props}
                  />
                </div>
              ),
              thead: ({ node, ...props }) => (
                <thead
                  className="bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-gray-200 font-semibold"
                  {...props}
                />
              ),
              th: ({ node, ...props }) => (
                <th
                  className="px-4 py-3 border-b border-gray-200 dark:border-zinc-700"
                  {...props}
                />
              ),
              td: ({ node, ...props }) => (
                <td
                  className="px-4 py-3 border-b border-gray-100 dark:border-zinc-800/50"
                  {...props}
                />
              ),
            }}
          >
            {msg.content}
          </ReactMarkdown>
        </div>

        {/* Timestamp */}
        <span
          className={cn(
            "mt-2.5 block text-xs font-medium",
            msg.role === "user"
              ? "text-primary-foreground/70"
              : "text-gray-400 dark:text-gray-500"
          )}
        >
          {msg.timestamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>
    </div>
  );
}