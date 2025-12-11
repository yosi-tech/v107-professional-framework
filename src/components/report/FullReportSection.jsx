import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Sparkles, ChevronRight, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import ReactMarkdown from 'react-markdown';

export default function FullReportSection({ reportMarkdown, language }) {
  const [currentPage, setCurrentPage] = useState(1);
  
  if (!reportMarkdown) return null;

  const isHebrew = language === 'he';

  // Split by [PAGE X] markers OR by main headings if markers don't exist
  let pages = reportMarkdown.split(/\[PAGE \d+\]/i).filter(p => p.trim());
  
  // If no page markers found, split by main headings (H1)
  if (pages.length === 1) {
    // Split by # heading but keep the heading with the content
    const sections = reportMarkdown.split(/(?=^# )/m).filter(s => s.trim());
    
    // Group sections into 4 pages
    if (sections.length >= 4) {
      pages = [
        sections[0] || '', // Page 1
        sections[1] || '', // Page 2
        sections[2] || '', // Page 3
        sections.slice(3).join('\n\n') // Page 4 - rest
      ];
    } else if (sections.length === 3) {
      pages = sections;
      pages.push(''); // Add empty 4th page
    } else if (sections.length === 2) {
      pages = [sections[0], sections[1], '', ''];
    } else {
      // Last resort: split by character count into 4 equal parts
      const chunkSize = Math.ceil(reportMarkdown.length / 4);
      pages = [
        reportMarkdown.substring(0, chunkSize),
        reportMarkdown.substring(chunkSize, chunkSize * 2),
        reportMarkdown.substring(chunkSize * 2, chunkSize * 3),
        reportMarkdown.substring(chunkSize * 3)
      ];
    }
  }
  
  const totalPages = 4;

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <Card className="mb-8 border-none shadow-2xl bg-gradient-to-br from-indigo-50 to-purple-50 relative">
      <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white rounded-t-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <FileText className="w-7 h-7" />
            </div>
            <div>
              <CardTitle className="text-3xl font-black">
                {isHebrew ? 'דוח V107 מקצועי' : 'V107 Professional Report'}
              </CardTitle>
              <p className="text-white/90 text-sm mt-1">
                {isHebrew ? `עמוד ${currentPage} מתוך ${totalPages}` : `Page ${currentPage} of ${totalPages}`}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={prevPage}
              disabled={currentPage === 1}
              variant="outline"
              size="sm"
              className="bg-white/20 border-white/30 text-white hover:bg-white/30 disabled:opacity-50"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
            <Button
              onClick={nextPage}
              disabled={currentPage === totalPages}
              variant="outline"
              size="sm"
              className="bg-white/20 border-white/30 text-white hover:bg-white/30 disabled:opacity-50"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-8 min-h-[600px]">
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
              {pages[currentPage - 1] || ''}
            </ReactMarkdown>
          </CardContent>
        </Card>
        
        {/* Page Navigation - Bottom */}
        <div className="flex items-center justify-between mt-6">
          <Button
            onClick={prevPage}
            disabled={currentPage === 1}
            variant="outline"
            className="disabled:opacity-50"
          >
            <ChevronRight className="w-5 h-5 ml-2" />
            {isHebrew ? 'עמוד קודם' : 'Previous Page'}
          </Button>
          <div className="flex gap-2">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-10 h-10 rounded-full font-bold transition-all ${
                  currentPage === i + 1
                    ? 'bg-indigo-600 text-white shadow-lg scale-110'
                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
          <Button
            onClick={nextPage}
            disabled={currentPage === totalPages}
            variant="outline"
            className="disabled:opacity-50"
          >
            {isHebrew ? 'עמוד הבא' : 'Next Page'}
            <ChevronLeft className="w-5 h-5 mr-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}