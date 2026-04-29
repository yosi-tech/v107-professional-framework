import React from "react";
import ReactMarkdown from 'react-markdown';
import { Card, CardContent } from "@/components/ui/card";

export default function FullReportSection({ markdownContent }) {
  if (!markdownContent) return null;

  return (
    <Card className="border-2 shadow-lg bg-white overflow-hidden border-indigo-300">
      <CardContent className="p-8">
        <ReactMarkdown
          className="prose prose-lg max-w-none"
          components={{
            h1: ({ children }) => (
              <h1 className="text-4xl font-black mb-6 text-indigo-900 border-b-4 border-indigo-400 pb-4">
                {children}
              </h1>
            ),
            h2: ({ children }) => (
              <h2 className="text-3xl font-black mb-5 text-purple-900 flex items-center gap-3">
                <div className="w-2 h-8 bg-purple-500 rounded"></div>
                {children}
              </h2>
            ),
            h3: ({ children }) => {
              const text = String(children);
              const isFramedBox = text.includes('📋') || text.includes('🗺️') || text.includes('📊');
              if (isFramedBox) {
                return (
                  <div className="border-2 border-indigo-800 bg-indigo-50/50 rounded-xl p-5 my-6 shadow-md">
                    <h3 className="text-2xl font-black text-indigo-900 m-0">
                      {children}
                    </h3>
                  </div>
                );
              }
              return (
                <h3 className="text-2xl font-bold mb-4 text-gray-900">
                  {children}
                </h3>
              );
            },
            p: ({ children }) => (
              <p className="text-gray-700 leading-relaxed mb-4 text-lg">
                {children}
              </p>
            ),
            ul: ({ children }) => (
              <ul className="space-y-3 mb-4 mr-6">
                {children}
              </ul>
            ),
            ol: ({ children }) => (
              <ol className="space-y-3 mb-4 mr-6 list-decimal">
                {children}
              </ol>
            ),
            li: ({ children }) => (
              <li className="text-gray-700 text-lg leading-relaxed flex items-start gap-3">
                <span className="w-2 h-2 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></span>
                <span className="flex-1">{children}</span>
              </li>
            ),
            strong: ({ children }) => (
              <strong className="font-black text-indigo-900">
                {children}
              </strong>
            ),
            em: ({ children }) => (
              <em className="text-purple-800 font-semibold not-italic">
                {children}
              </em>
            ),
            blockquote: ({ children }) => (
              <blockquote className="border-r-4 border-[#FF8F00] bg-amber-50 pr-6 pl-4 py-4 my-6 rounded-lg shadow-sm">
                {children}
              </blockquote>
            ),
            hr: () => null,
            table: ({ children }) => (
              <div className="overflow-x-auto my-6">
                <table className="min-w-full border-2 border-gray-300">
                  {children}
                </table>
              </div>
            ),
            thead: ({ children }) => (
              <thead className="bg-indigo-100">
                {children}
              </thead>
            ),
            th: ({ children }) => (
              <th className="border border-gray-300 px-4 py-3 text-right font-bold text-indigo-900">
                {children}
              </th>
            ),
            td: ({ children }) => (
              <td className="border border-gray-300 px-4 py-3 text-right text-gray-700">
                {children}
              </td>
            ),
          }}
        >
          {markdownContent}
        </ReactMarkdown>
      </CardContent>
    </Card>
  );
}