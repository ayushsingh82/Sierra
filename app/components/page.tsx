"use client";

import { useState } from "react";

const componentCategories = [
  {
    id: "core",
    name: "Core Components",
    description: "Fundamental building blocks of the Merkle proof system",
    components: [
      {
        name: "Merkle Tree Manager",
        file: "src/core/merkle_tree.c/h",
        description: "Efficient Merkle tree construction and management",
        features: [
          "Binary Merkle tree implementation",
          "O(log n) proof generation",
          "Batch construction support",
          "Dynamic tree updates",
        ],
      },
      {
        name: "Proof Generator",
        file: "src/core/proof_functions.c",
        description: "Generate Merkle inclusion proofs efficiently",
        features: [
          "Optimized sibling node collection",
          "Proof compression for large trees",
          "Cache-friendly traversal",
          "Batch proof processing",
        ],
      },
      {
        name: "Memory Pool",
        file: "src/core/memory_pool.c",
        description: "Custom memory allocation for tree nodes",
        features: [
          "Pre-allocated node pool",
          "Reduced allocation overhead",
          "Memory usage tracking",
          "Fragmentation prevention",
        ],
      },
    ],
  },
  {
    id: "hash",
    name: "Hash Functions",
    description: "Cryptographic hash implementations with RISC-V optimizations",
    components: [
      {
        name: "SHA-256",
        file: "src/hash/sha256.c",
        description: "Primary hash function for Merkle tree construction",
        features: [
          "RISC-V assembly optimized",
          "Bit manipulation using B-extension",
          "Vector processing support",
          "Constant-time operations",
        ],
      },
      {
        name: "Blake2b",
        file: "src/hash/blake2b.c",
        description: "Alternative high-performance hash function",
        features: [
          "Faster than SHA-256 on some workloads",
          "Optimized for 64-bit platforms",
          "RISC-V vector extensions support",
          "High security margin",
        ],
      },
      {
        name: "Hash Interface",
        file: "src/hash/hash_functions.h",
        description: "Unified interface for hash operations",
        features: [
          "Abstract hash function type",
          "Easy hash function swapping",
          "Initialization and cleanup",
          "Hash state management",
        ],
      },
    ],
  },
  {
    id: "spi",
    name: "SPI Interface",
    description: "Succinct Proof Interface for external communication",
    components: [
      {
        name: "SPI Interface",
        file: "src/spi/spi_interface.c/h",
        description: "Clean API for proof submission and verification",
        features: [
          "Protocol buffer support",
          "gRPC interface wrapper",
          "JSON-RPC for web clients",
          "Rate limiting and validation",
        ],
      },
      {
        name: "Benchmark Driver",
        file: "src/spi/main_bench.c",
        description: "Performance benchmarking suite",
        features: [
          "Proof generation benchmarks",
          "Verification benchmarks",
          "Memory usage profiling",
          "Throughput measurements",
        ],
      },
    ],
  },
  {
    id: "tests",
    name: "Testing",
    description: "Comprehensive test suite for correctness validation",
    components: [
      {
        name: "Main Test Suite",
        file: "src/main_test.c",
        description: "Unity test framework integration",
        features: [
          "Unit tests for each component",
          "Integration tests",
          "Edge case coverage",
          "Performance regression tests",
        ],
      },
    ],
  },
];

export default function ComponentsPage() {
  const [activeCategory, setActiveCategory] = useState("core");

  const currentCategory = componentCategories.find((c) => c.id === activeCategory);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="py-20 border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center animate-fadeIn">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              <span className="text-white">System</span>{" "}
              <span className="gradient-text">Components</span>
            </h1>
            <p className="max-w-2xl mx-auto text-lg text-zinc-400">
              Detailed breakdown of all components in our RISC-V Merkle proof system
            </p>
          </div>
        </div>
      </section>

      {/* Category Navigation */}
      <section className="py-8 sticky top-16 bg-black/90 backdrop-blur-md z-40 border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-2">
            {componentCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeCategory === category.id
                    ? "bg-cyan-500 text-black"
                    : "bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Components List */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-white mb-2">{currentCategory?.name}</h2>
            <p className="text-zinc-400">{currentCategory?.description}</p>
          </div>

          <div className="grid gap-6">
            {currentCategory?.components.map((component, index) => (
              <div
                key={component.name}
                className="card-hover p-8 rounded-xl bg-zinc-900/50 border border-zinc-800 animate-fadeIn"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                  {/* Component Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                        <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-white">{component.name}</h3>
                        <code className="text-sm text-zinc-500">{component.file}</code>
                      </div>
                    </div>
                    <p className="text-zinc-400 mb-4">{component.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {component.features.map((feature) => (
                        <span
                          key={feature}
                          className="px-3 py-1 text-sm rounded-full bg-zinc-800 text-zinc-300"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="flex lg:flex-col gap-2">
                    <a
                      href={`/code?file=${component.file}`}
                      className="px-4 py-2 rounded-lg bg-cyan-500/10 text-cyan-400 text-sm font-medium hover:bg-cyan-500/20 transition-colors"
                    >
                      View Code
                    </a>
                    <a
                      href={`/benchmarks?component=${component.name.toLowerCase().replace(/\s+/g, "-")}`}
                      className="px-4 py-2 rounded-lg bg-zinc-800 text-zinc-300 text-sm font-medium hover:bg-zinc-700 transition-colors"
                    >
                      Benchmarks
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Architecture Overview */}
      <section className="py-20 bg-zinc-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="section-title">Component Interactions</h2>
            <p className="section-subtitle">
              How components work together in the system
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="card-hover p-6 rounded-xl bg-zinc-900/50 border border-zinc-800">
              <div className="w-12 h-12 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400 mb-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Proof Generation</h3>
              <p className="text-zinc-400 text-sm mb-4">
                User request → SPI Interface → Tree Manager → Proof Generator → Hash Functions → Output
              </p>
              <div className="text-xs text-zinc-500">
                Components: SPI, Merkle Tree, Proof Functions, Hash
              </div>
            </div>

            <div className="card-hover p-6 rounded-xl bg-zinc-900/50 border border-zinc-800">
              <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 mb-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Proof Verification</h3>
              <p className="text-zinc-400 text-sm mb-4">
                Proof input → SPI Interface → Verification Engine → Hash Computation → Result
              </p>
              <div className="text-xs text-zinc-500">
                Components: SPI, Verification Engine, Hash
              </div>
            </div>

            <div className="card-hover p-6 rounded-xl bg-zinc-900/50 border border-zinc-800">
              <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400 mb-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Performance Optimization</h3>
              <p className="text-zinc-400 text-sm mb-4">
                All operations → RISC-V Optimizer → Assembly Kernels → Cache Manager → Output
              </p>
              <div className="text-xs text-zinc-500">
                Components: RISC-V Optimizer, Memory Pool, Cache Manager
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

