"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface FileInfo {
  name: string;
  path: string;
  size: number;
  category: string;
}

const sourceFiles: FileInfo[] = [
  // Core
  { name: "merkle_tree.c", path: "src/core/merkle_tree.c", size: 0, category: "core" },
  { name: "merkle_tree.h", path: "src/core/merkle_tree.h", size: 0, category: "core" },
  { name: "proof_functions.c", path: "src/core/proof_functions.c", size: 0, category: "core" },
  { name: "memory_pool.c", path: "src/core/memory_pool.c", size: 0, category: "core" },
  // Hash
  { name: "sha256.c", path: "src/hash/sha256.c", size: 0, category: "hash" },
  { name: "blake2b.c", path: "src/hash/blake2b.c", size: 0, category: "hash" },
  { name: "hash_functions.h", path: "src/hash/hash_functions.h", size: 0, category: "hash" },
  // SPI
  { name: "spi_interface.c", path: "src/spi/spi_interface.c", size: 0, category: "spi" },
  { name: "spi_interface.h", path: "src/spi/spi_interface.h", size: 0, category: "spi" },
  { name: "main_bench.c", path: "src/spi/main_bench.c", size: 0, category: "spi" },
  // Tests
  { name: "main_test.c", path: "src/main_test.c", size: 0, category: "tests" },
  // Build
  { name: "Makefile", path: "Makefile", size: 0, category: "build" },
];

const categoryLabels: Record<string, { label: string; color: string }> = {
  core: { label: "Core", color: "bg-cyan-500/20 text-cyan-400" },
  hash: { label: "Hash", color: "bg-purple-500/20 text-purple-400" },
  spi: { label: "SPI", color: "bg-blue-500/20 text-blue-400" },
  tests: { label: "Tests", color: "bg-green-500/20 text-green-400" },
  build: { label: "Build", color: "bg-orange-500/20 text-orange-400" },
};

const cKeywords = [
  "auto", "break", "case", "char", "const", "continue", "default", "do",
  "double", "else", "enum", "extern", "float", "for", "goto", "if",
  "int", "long", "register", "return", "short", "signed", "sizeof", "static",
  "struct", "switch", "typedef", "union", "unsigned", "void", "volatile", "while",
  "define", "include", "ifdef", "ifndef", "endif", "pragma", "define",
];

const cTypes = [
  "uint8_t", "uint16_t", "uint32_t", "uint64_t", "int8_t", "int16_t", "int32_t", "int64_t",
  "size_t", "ssize_t", "ptrdiff_t", "intptr_t", "uintptr_t", "bool", "true", "false", "NULL",
];

function highlightCode(code: string): string {
  let highlighted = code
    .replace(/&/g, "&amp;")
    .replace(/</g, "<")
    .replace(/>/g, ">");

  // Strings
  highlighted = highlighted.replace(/"[^"]*"/g, '<span class="text-green-400">$&</span>');
  highlighted = highlighted.replace(/'[^']*'/g, '<span class="text-green-400">$&</span>');

  // Keywords
  cKeywords.forEach((kw) => {
    const regex = new RegExp(`\\b${kw}\\b`, "g");
    highlighted = highlighted.replace(regex, `<span class="text-cyan-400">${kw}</span>`);
  });

  // Types
  cTypes.forEach((type) => {
    const regex = new RegExp(`\\b${type}\\b`, "g");
    highlighted = highlighted.replace(regex, `<span class="text-purple-400">${type}</span>`);
  });

  // Preprocessor directives
  highlighted = highlighted.replace(/#\w+/g, '<span class="text-orange-400">$&</span>');

  // Comments (single line)
  highlighted = highlighted.replace(/\/\/.*$/gm, '<span class="text-zinc-500">$&</span>');

  // Comments (multi-line)
  highlighted = highlighted.replace(/\/\*[\s\S]*?\*\//g, '<span class="text-zinc-500">$&</span>');

  // Numbers
  highlighted = highlighted.replace(/\b(\d+\.?\d*)\b/g, '<span class="text-yellow-400">$1</span>');

  return highlighted;
}

export default function CodePage() {
  const [selectedFile, setSelectedFile] = useState<FileInfo | null>(null);
  const [fileContent, setFileContent] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("all");

  const filteredFiles = filter === "all"
    ? sourceFiles
    : sourceFiles.filter((f) => f.category === filter);

  useEffect(() => {
    if (selectedFile) {
      setLoading(true);
      fetch(`/${selectedFile.path}`)
        .then((res) => {
          if (!res.ok) throw new Error("File not found");
          return res.text();
        })
        .then((content) => {
          setFileContent(content);
        })
        .catch(() => {
          setFileContent("// File content not available\n// This is a demo UI - in production, file contents would be loaded dynamically");
        })
        .finally(() => setLoading(false));
    }
  }, [selectedFile]);

  const lines = fileContent.split("\n");

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="py-20 border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center animate-fadeIn">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              <span className="text-white">Source</span>{" "}
              <span className="gradient-text">Code</span>
            </h1>
            <p className="max-w-2xl mx-auto text-lg text-zinc-400">
              Browse and explore the C source code for our RISC-V Merkle proof system
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row min-h-[calc(100vh-16rem)]">
        {/* File List Sidebar */}
        <div className="w-full lg:w-80 border-r border-zinc-800 bg-zinc-900/30">
          {/* Filter Tabs */}
          <div className="p-4 border-b border-zinc-800">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilter("all")}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  filter === "all"
                    ? "bg-cyan-500 text-black"
                    : "bg-zinc-800 text-zinc-400 hover:text-white"
                }`}
              >
                All
              </button>
              {Object.entries(categoryLabels).map(([key, { label }]) => (
                <button
                  key={key}
                  onClick={() => setFilter(key)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    filter === key
                      ? "bg-cyan-500 text-black"
                      : "bg-zinc-800 text-zinc-400 hover:text-white"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* File List */}
          <div className="overflow-y-auto max-h-[600px]">
            {filteredFiles.map((file) => (
              <button
                key={file.path}
                onClick={() => setSelectedFile(file)}
                className={`w-full px-4 py-3 text-left border-b border-zinc-800/50 transition-colors ${
                  selectedFile?.path === file.path
                    ? "bg-cyan-500/10 border-l-2 border-l-cyan-500"
                    : "hover:bg-zinc-800/50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-sm font-medium ${
                    selectedFile?.path === file.path ? "text-cyan-400" : "text-white"
                  }`}>
                    {file.name}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-xs ${
                    categoryLabels[file.category]?.color || "bg-zinc-700 text-zinc-300"
                  }`}>
                    {categoryLabels[file.category]?.label}
                  </span>
                </div>
                <div className="text-xs text-zinc-500 mt-1">{file.path}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Code Viewer */}
        <div className="flex-1 flex flex-col">
          {selectedFile ? (
            <>
              {/* File Header */}
              <div className="flex items-center justify-between p-4 border-b border-zinc-800 bg-zinc-900/30">
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <div>
                    <div className="text-white font-medium">{selectedFile.name}</div>
                    <div className="text-xs text-zinc-500">{selectedFile.path}</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <span className={`px-2 py-1 rounded text-xs ${
                    categoryLabels[selectedFile.category]?.color || "bg-zinc-700 text-zinc-300"
                  }`}>
                    {categoryLabels[selectedFile.category]?.label}
                  </span>
                </div>
              </div>

              {/* Code Content */}
              <div className="flex-1 overflow-auto">
                {loading ? (
                  <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500" />
                  </div>
                ) : (
                  <div className="code-block">
                    <div className="flex">
                      {/* Line Numbers */}
                      <div className="flex-shrink-0 w-12 py-4 text-right pr-3 bg-zinc-900/50 border-r border-zinc-800">
                        {lines.map((_, i) => (
                          <div key={i} className="text-xs text-zinc-600 font-mono leading-6">
                            {i + 1}
                          </div>
                        ))}
                      </div>
                      {/* Code */}
                      <pre className="flex-1 py-4 pl-2 overflow-x-auto">
                        <code
                          className="text-sm text-zinc-300 font-mono leading-6"
                          dangerouslySetInnerHTML={{
                            __html: highlightCode(fileContent || "// No content"),
                          }}
                        />
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <svg className="w-16 h-16 text-zinc-700 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="text-lg font-medium text-white mb-2">No File Selected</h3>
                <p className="text-zinc-400">Select a file from the sidebar to view its contents</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <section className="py-12 border-t border-zinc-800 bg-zinc-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-cyan-400">{sourceFiles.filter(f => f.category === "core").length}</div>
              <div className="text-sm text-zinc-400">Core Files</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">{sourceFiles.filter(f => f.category === "hash").length}</div>
              <div className="text-sm text-zinc-400">Hash Files</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">{sourceFiles.filter(f => f.category === "spi").length}</div>
              <div className="text-sm text-zinc-400">SPI Files</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">{sourceFiles.filter(f => f.category === "tests").length}</div>
              <div className="text-sm text-zinc-400">Test Files</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-400">{sourceFiles.length}</div>
              <div className="text-sm text-zinc-400">Total Files</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

