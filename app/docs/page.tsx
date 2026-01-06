"use client";

import { useState } from "react";
import Link from "next/link";

interface DocFile {
  name: string;
  path: string;
  description: string;
  category: string;
  icon: React.ReactNode;
}

const documentationFiles: DocFile[] = [
  {
    name: "README",
    path: "README.md",
    description: "Project overview, quick start guide, and main documentation",
    category: "Getting Started",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    name: "Challenge B Plan",
    path: "challenge-b-plan.md",
    description: "High-level strategy and implementation approach for Challenge B",
    category: "Planning",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
      </svg>
    ),
  },
  {
    name: "Technical Architecture",
    path: "technical-architecture.md",
    description: "Detailed system architecture, components, and data flow diagrams",
    category: "Architecture",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    ),
  },
  {
    name: "Implementation Roadmap",
    path: "implementation-roadmap.md",
    description: "Timeline and milestone planning for project execution",
    category: "Planning",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    name: "Development Guide",
    path: "development-guide.md",
    description: "Setup instructions, development workflow, and best practices",
    category: "Getting Started",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
  },
  {
    name: "Developer Docs",
    path: "developer-docs.md",
    description: "Developer documentation, API references, and coding standards",
    category: "Reference",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    name: "Rules",
    path: "rules.md",
    description: "Official hackathon rules, regulations, and submission requirements",
    category: "Reference",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  {
    name: "TODO",
    path: "TODO.md",
    description: "Comprehensive task checklist and development progress tracking",
    category: "Planning",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
  },
];

const categories = ["All", "Getting Started", "Planning", "Architecture", "Reference"];

export default function DocsPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredDocs = documentationFiles.filter((doc) => {
    const matchesCategory = selectedCategory === "All" || doc.category === selectedCategory;
    const matchesSearch =
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="py-20 border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center animate-fadeIn">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              <span className="text-white">Project</span>{" "}
              <span className="gradient-text">Documentation</span>
            </h1>
            <p className="max-w-2xl mx-auto text-lg text-zinc-400">
              Complete documentation for the RISC-V Merkle Proof System
            </p>
          </div>
        </div>
      </section>

      {/* Search and Filter */}
      <section className="py-8 sticky top-16 bg-black/90 backdrop-blur-md z-40 border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative w-full md:w-96">
              <svg
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-zinc-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                placeholder="Search documentation..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    selectedCategory === category
                      ? "bg-cyan-500 text-black"
                      : "bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Documentation List */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-white mb-2">
              {selectedCategory === "All" ? "All Documents" : selectedCategory}
            </h2>
            <p className="text-zinc-400">
              {filteredDocs.length} document{filteredDocs.length !== 1 ? "s" : ""} found
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {filteredDocs.map((doc, index) => (
              <div
                key={doc.path}
                className="card-hover p-6 rounded-xl bg-zinc-900/50 border border-zinc-800 animate-fadeIn"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400 flex-shrink-0">
                    {doc.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold text-white">{doc.name}</h3>
                      <span className="px-2 py-0.5 text-xs rounded bg-zinc-800 text-zinc-400">
                        {doc.category}
                      </span>
                    </div>
                    <p className="text-zinc-400 text-sm mb-4">{doc.description}</p>
                    <a
                      href={`/${doc.path}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      View Document
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredDocs.length === 0 && (
            <div className="text-center py-12">
              <svg
                className="w-16 h-16 text-zinc-700 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="text-lg font-medium text-white mb-2">No Documents Found</h3>
              <p className="text-zinc-400">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-20 bg-zinc-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title">Quick Links</h2>
            <p className="section-subtitle">
              Jump to other sections of the project
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: "Architecture", href: "/architecture", desc: "System design overview" },
              { title: "Components", href: "/components", desc: "Component breakdown" },
              { title: "Source Code", href: "/code", desc: "Browse source files" },
              { title: "Benchmarks", href: "/benchmarks", desc: "Performance metrics" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group p-6 rounded-xl bg-zinc-900/50 border border-zinc-800 card-hover"
              >
                <h3 className="text-lg font-semibold text-white group-hover:text-cyan-400 transition-colors mb-2">
                  {link.title}
                </h3>
                <p className="text-zinc-400 text-sm">{link.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Documentation Stats */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center p-6 rounded-xl bg-zinc-900/50 border border-zinc-800">
              <div className="text-3xl font-bold text-cyan-400 mb-2">{documentationFiles.length}</div>
              <div className="text-sm text-zinc-400">Total Documents</div>
            </div>
            <div className="text-center p-6 rounded-xl bg-zinc-900/50 border border-zinc-800">
              <div className="text-3xl font-bold text-purple-400 mb-2">
                {documentationFiles.filter((d) => d.category === "Getting Started").length}
              </div>
              <div className="text-sm text-zinc-400">Getting Started</div>
            </div>
            <div className="text-center p-6 rounded-xl bg-zinc-900/50 border border-zinc-800">
              <div className="text-3xl font-bold text-blue-400 mb-2">
                {documentationFiles.filter((d) => d.category === "Planning").length}
              </div>
              <div className="text-sm text-zinc-400">Planning</div>
            </div>
            <div className="text-center p-6 rounded-xl bg-zinc-900/50 border border-zinc-800">
              <div className="text-3xl font-bold text-green-400 mb-2">
                {documentationFiles.filter((d) => d.category === "Reference").length}
              </div>
              <div className="text-sm text-zinc-400">Reference</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

