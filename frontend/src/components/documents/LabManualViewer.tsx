import React, { useRef, useState } from 'react';
import { useLabStore } from '../../stores/useLabStore';
import { FileText, Upload, Search, BookOpen, CheckCircle, ExternalLink } from 'lucide-react';

export const LabManualViewer: React.FC = () => {
  const { documents, addDocument, addLog } = useLabStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDocId, setSelectedDocId] = useState<string | null>(documents[0]?.id || null);

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    try {
      const response = await fetch('/api/documents/upload', { method: 'POST', body: formData });
      if (!response.ok) {
        const detail = await response.json().catch(() => null);
        throw new Error(detail?.detail || `Document API returned ${response.status}`);
      }
      const result = await response.json();
      const newDoc = {
        id: `doc-${Date.now()}`,
        filename: file.name,
        file_size_kb: Math.round(file.size / 1024),
        page_count: result.page_count || 1,
        upload_timestamp: new Date().toISOString(),
        extracted_text_snippet: 'Indexed locally. Run a diagnostic or document search to retrieve relevant excerpts.'
      };
      addDocument(newDoc);
      setSelectedDocId(newDoc.id);
      addLog(`Indexed document locally: ${file.name}`, 'success');
    } catch (error) {
      addLog(`Document was not indexed: ${error instanceof Error ? error.message : 'Unknown error'}`, 'warn');
    }
  };

  const activeDoc = documents.find(d => d.id === selectedDocId) || documents[0];

  return (
    <div className="bg-[#0f141d] border border-[#1d2738] rounded-lg p-4 flex flex-col h-full shadow-[0_4px_16px_rgba(0,0,0,0.5)] font-mono">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#1d2738] mb-4">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-cyan-400" />
          <h2 className="text-sm font-bold text-slate-200">
            LAB DOCUMENTS & LOCAL RAG RETRIEVAL ENGINE
          </h2>
        </div>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handlePdfUpload}
          accept=".pdf,.txt,.doc,.docx"
          className="hidden"
        />

        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-1.5 bg-[#162030] hover:bg-[#1f2d44] text-slate-200 px-3 py-1.5 rounded text-xs border border-[#263750] transition-colors"
        >
          <Upload className="w-3.5 h-3.5 text-cyan-400" />
          <span>UPLOAD PDF MANUAL</span>
        </button>
      </div>

      {/* Main Grid: Document List Left, Text & Search Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 flex-1">
        {/* Left Column: Documents List */}
        <div className="bg-[#0b0e16] p-3 rounded border border-[#1d2738] space-y-2">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center justify-between">
            <span>INGESTED DOCUMENTS</span>
            <span className="text-[10px] bg-cyan-950 text-cyan-300 px-1.5 py-0.5 rounded">
              {documents.length} FILES
            </span>
          </h3>

          <div className="space-y-1.5">
            {documents.map((doc) => {
              const isSelected = doc.id === selectedDocId;
              return (
                <div
                  key={doc.id}
                  onClick={() => setSelectedDocId(doc.id)}
                  className={`p-2.5 rounded border transition-all cursor-pointer text-xs ${
                    isSelected
                      ? 'bg-cyan-950/40 border-cyan-500/80 text-cyan-200 shadow'
                      : 'bg-[#121927] border-[#1e2a3f] text-slate-300 hover:bg-[#172235]'
                  }`}
                >
                  <div className="font-bold truncate flex items-center gap-1.5 mb-1">
                    <FileText className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span className="truncate">{doc.filename}</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span>{doc.file_size_kb} KB</span>
                    <span>{doc.page_count} PAGES</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Search & Extracted Text Preview */}
        <div className="lg:col-span-2 bg-[#0b0e16] p-3 rounded border border-[#1d2738] flex flex-col">
          {/* Local Search Input */}
          <div className="bg-[#070a0f] p-2 rounded border border-[#1d2738] flex items-center gap-2 mb-3">
            <Search className="w-4 h-4 text-cyan-400" />
            <input
              type="text"
              placeholder="Search lab manual citations (e.g., LED forward voltage, resistor color code)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-xs text-slate-200 focus:outline-none flex-1 font-mono"
            />
          </div>

          {/* Extracted Content Viewer */}
          {activeDoc ? (
            <div className="flex-1 overflow-y-auto space-y-3 p-3 bg-[#070a0f] rounded border border-[#172236] text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-[#182338] text-[11px] text-slate-400">
                <span className="font-bold text-slate-200">{activeDoc.filename}</span>
                  <span className="text-emerald-400 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  LOCAL INDEXED
                </span>
              </div>

              <div className="space-y-2">
                <h4 className="text-[11px] font-bold text-amber-400">EXTRACTED REFERENCE TEXT:</h4>
                <p className="text-slate-300 leading-relaxed font-sans text-xs bg-[#0f1726] p-3 rounded border border-[#1c2940]">
                  {activeDoc.extracted_text_snippet}
                </p>

                <p className="text-[11px] text-slate-500">
                  Retrieved excerpts and page citations appear in Diagnostic Result when a query matches indexed material.
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center p-8 text-slate-500 text-xs">
              Select a document from the left panel to inspect retrieved citations.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
