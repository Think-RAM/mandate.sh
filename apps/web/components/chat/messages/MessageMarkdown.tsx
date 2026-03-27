"use client";

import { cn } from "@repo/ui/lib/utils";
import { type ComponentProps, memo } from "react";
import { Streamdown } from "streamdown";


type ResponseProps = ComponentProps<typeof Streamdown>;

export const MarkdownResponse = memo(
  ({ className, ...props }: ResponseProps) => (
    <Streamdown
      className={cn(
        `
        size-full
        wrap-anywhere
        [word-break:break-word]

        [&>*:first-child]:mt-0
        [&>*:last-child]:mb-0

        /* HEADINGS */
        [&_h1]:text-2xl
        [&_h1]:font-extrabold
        [&_h1]:text-gray-900
        dark:[&_h1]:text-gray-100
        [&_h1]:mt-10
        [&_h1]:mb-6
        [&_h1]:pb-2
        [&_h1]:border-b-2
        [&_h1]:border-gray-100
        dark:[&_h1]:border-zinc-800

        [&_h2]:text-xl
        [&_h2]:font-bold
        [&_h2]:text-gray-800
        dark:[&_h2]:text-gray-200
        [&_h2]:mt-10
        [&_h2]:mb-4
        [&_h2]:tracking-tight

        [&_h3]:text-lg
        [&_h3]:font-semibold
        [&_h3]:text-gray-800
        dark:[&_h3]:text-gray-300
        [&_h3]:mt-8
        [&_h3]:mb-3

        /* PARAGRAPHS */
        [&_p]:text-[15px]
        [&_p]:text-gray-600
        dark:[&_p]:text-gray-400
        [&_p]:leading-relaxed
        [&_p]:mb-5

        /* LISTS */
        [&_ul]:list-disc
        [&_ul]:pl-6
        [&_ul]:mb-6
        [&_ul]:space-y-2
        [&_ul]:text-[15px]
        [&_ul]:text-gray-600
        dark:[&_ul]:text-gray-400
        [&_ul]:marker:text-emerald-500

        [&_ol]:list-decimal
        [&_ol]:pl-6
        [&_ol]:mb-6
        [&_ol]:space-y-2
        [&_ol]:text-[15px]
        [&_ol]:text-gray-600
        dark:[&_ol]:text-gray-400
        [&_ol]:marker:text-emerald-500
        [&_ol]:font-medium

        [&_li]:pl-1
        [&_li]:leading-relaxed

        /* STRONG */
        [&_strong]:font-semibold
        [&_strong]:text-gray-900
        dark:[&_strong]:text-gray-200

        /* BLOCKQUOTE */
        [&_blockquote]:border-l-4
        [&_blockquote]:border-emerald-500/50
        [&_blockquote]:bg-emerald-50/50
        dark:[&_blockquote]:bg-emerald-500/10
        [&_blockquote]:pl-5
        [&_blockquote]:py-3
        [&_blockquote]:my-6
        [&_blockquote]:rounded-r-lg
        [&_blockquote]:italic
        [&_blockquote]:text-gray-700
        dark:[&_blockquote]:text-gray-300

        /* LINKS */
        [&_a]:text-emerald-600
        dark:[&_a]:text-emerald-400
        [&_a]:font-medium
        [&_a]:break-all
        [&_a:hover]:underline

        /* TABLE WRAPPER (simulate div wrapper) */
        [&_table]:w-full
        [&_table]:text-left
        [&_table]:text-sm
        [&_table]:text-gray-600
        dark:[&_table]:text-gray-400
        [&_table]:my-6
        [&_table]:border
        [&_table]:border-gray-200
        dark:[&_table]:border-zinc-700
        [&_table]:rounded-lg
        [&_table]:overflow-hidden
        [&_table]:block
        [&_table]:overflow-x-auto

        /* TABLE HEAD */
        [&_thead]:bg-gray-50
        dark:[&_thead]:bg-zinc-800
        [&_thead]:text-gray-900
        dark:[&_thead]:text-gray-200
        [&_thead]:font-semibold

        /* TABLE CELLS */
        [&_th]:px-4
        [&_th]:py-3
        [&_th]:border-b
        [&_th]:border-gray-200
        dark:[&_th]:border-zinc-700

        [&_td]:px-4
        [&_td]:py-3
        [&_td]:border-b
        [&_td]:border-gray-100
        dark:[&_td]:border-zinc-800/50

        `,
        className
      )}
      {...props}
    />
  ),
  (prev, next) => prev.children === next.children
);

MarkdownResponse.displayName = "MarkdownResponse";