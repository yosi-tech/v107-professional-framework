import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Sparkles } from "lucide-react";
import ReactMarkdown from 'react-markdown';

export default function FullReportSection({ reportMarkdown, language }) {
  if (!reportMarkdown) return null;

  const isHebrew = language === 'he';

  // Split markdown by headings to create sections
  const sections = reportMarkdown.split(/(?=^#{1,3}\s)/m).filter(s => s.trim());

  return (
    <Card className="mb-8 border-none shadow-2xl bg-gradient-to-br from-indigo-50 to-purple-50">
      <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white rounded-t-lg">
        <CardTitle className="text-3xl flex items-center gap-3 font-black">
          <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
            <Sparkles className="w-7 h-7" />
          </div>
          {isHebrew ? '📄 הדוח המלא והמעמיק' : '📄 Full In-Depth Report'}
        </CardTitle>
        <p className="text-white/90 mt-2 text-lg">
          {isHebrew 
            ? 'ניתוח מקיף ומפורט של כל היבטי העסק שלך' 
            : 'Comprehensive and detailed analysis of all aspects of your business'}
        </p>
      </CardHeader>
      <CardContent className="p-8">
        <div className="space-y-6">
          {sections.map((section, index) => {
            const lines = section.trim().split('\n');
            const firstLine = lines[0];
            const isMainHeading = firstLine.startsWith('# ');
            const isSubHeading = firstLine.startsWith('## ');
            const isMinorHeading = firstLine.startsWith('### ');
            
            return (
              <Card 
                key={index}
                className={`border-2 shadow-lg hover:shadow-xl transition-all bg-white overflow-hidden ${
                  isMainHeading ? 'border-indigo-400' :
                  isSubHeading ? 'border-purple-400' :
                  'border-gray-300'
                }`}
              >
                <CardContent className="p-6">
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
                      h3: ({ children }) => (
                        <h3 className="text-2xl font-bold mb-4 text-gray-900">
                          {children}
                        </h3>
                      ),
                      h4: ({ children }) => (
                        <h4 className="text-xl font-bold mb-3 text-gray-800">
                          {children}
                        </h4>
                      ),
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
                        <blockquote className="border-r-4 border-indigo-400 bg-indigo-50 pr-6 py-4 my-4 rounded-lg">
                          {children}
                        </blockquote>
                      ),
                      code: ({ inline, children }) => {
                        if (inline) {
                          return (
                            <code className="bg-gray-100 text-indigo-700 px-2 py-1 rounded text-base font-mono">
                              {children}
                            </code>
                          );
                        }
                        return (
                          <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto my-4">
                            <code className="text-sm font-mono">{children}</code>
                          </pre>
                        );
                      },
                      hr: () => (
                        <hr className="my-8 border-t-2 border-gray-300" />
                      ),
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
                    {section}
                  </ReactMarkdown>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}