"use client";

import { useState } from "react";

const benchmarkData = [
  {
    name: "Proof Generation (1M leaves)",
    current: 85,
    target: 100,
    unit: "ms",
    description: "Time to generate a Merkle proof for 1 million leaves",
    optimizations: ["Cache-optimized tree layout", "Prefetching", "Batch processing"],
  },
  {
    name: "Proof Verification (1M leaves)",
    current: 32,
    target: 50,
    unit: "ms",
    description: "Time to verify a Merkle proof",
    optimizations: ["Branchless verification", "SIMD instructions", "Early exit"],
  },
  {
    name: "Memory Usage (1M leaves)",
    current: 78,
    target: 100,
    unit: "MB",
    description: "Peak memory usage during operations",
    optimizations: ["Memory pool allocation", "Tree compression", "Streaming"],
    invert: true, // Lower is better
  },
  {
    name: "L1 Cache Hit Rate",
    current: 94,
    target: 90,
    unit: "%",
    description: "Cache efficiency during tree traversal",
    optimizations: ["Data layout optimization", "Cache line alignment"],
  },
  {
    name: "Tree Build (1M leaves)",
    current: 420,
    target: 500,
    unit: "ms",
    description: "Time to build a complete Merkle tree",
    optimizations: ["Parallel construction", "Bottom-up building"],
  },
];

const comparisonData = [
  {
    name: "Proof Generation",
    riscv: 85,
    generic: 180,
    unit: "ms",
    improvement: "2.1x faster",
  },
  {
    name: "Proof Verification",
    riscv: 32,
    generic: 75,
    unit: "ms",
    improvement: "2.3x faster",
  },
  {
    name: "Memory Usage",
    riscv: 78,
    generic: 120,
    unit: "MB",
    improvement: "35% less",
    invert: true,
  },
];

export default function BenchmarksPage() {
  const [selectedMetric, setSelectedMetric] = useState("all");

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="py-20 border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center animate-fadeIn">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              <span className="text-white">Performance</span>{" "}
              <span className="gradient-text">Benchmarks</span>
            </h1>
            <p className="max-w-2xl mx-auto text-lg text-zinc-400">
              Performance metrics and optimization results for our Merkle proof system
            </p>
          </div>
        </div>
      </section>

      {/* Current Performance */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="section-title">Current Performance</h2>
            <p className="section-subtitle">
              Measured performance against our targets for 1M leaf Merkle trees
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benchmarkData.map((metric, index) => (
              <div
                key={metric.name}
                className="card-hover p-6 rounded-xl bg-zinc-900/50 border border-zinc-800 animate-fadeIn"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-white">{metric.name}</h3>
                  <span className={`px-2 py-1 rounded text-xs ${
                    (metric.invert ? metric.current <= metric.target : metric.current <= metric.target)
                      ? "bg-zinc-700 text-white"
                      : "bg-zinc-600 text-zinc-300"
                  }`}>
                    {metric.current}{metric.unit} / {metric.target}{metric.unit}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ${
                        (metric.invert ? metric.current <= metric.target : metric.current <= metric.target)
                          ? "bg-gradient-to-r from-zinc-500 to-white"
                          : "bg-gradient-to-r from-zinc-600 to-zinc-400"
                      }`}
                      style={{
                        width: `${Math.min((metric.current / metric.target) * 100, 100)}%`,
                      }}
                    />
                  </div>
                </div>

                <p className="text-xs text-zinc-400 mb-3">{metric.description}</p>

                <div className="flex flex-wrap gap-1">
                  {metric.optimizations.map((opt) => (
                    <span
                      key={opt}
                      className="px-2 py-0.5 text-xs rounded bg-zinc-800 text-zinc-300"
                    >
                      {opt}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Optimized vs Generic Comparison */}
      <section className="py-20 bg-zinc-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="section-title">Optimized vs Generic Implementation</h2>
            <p className="section-subtitle">
              Performance comparison showing the impact of our optimizations
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {comparisonData.map((comparison, index) => (
              <div
                key={comparison.name}
                className="card-hover p-8 rounded-xl bg-zinc-900/50 border border-zinc-800 animate-fadeIn"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <h3 className="text-lg font-semibold text-white mb-6 text-center">{comparison.name}</h3>

                {/* Comparison Chart */}
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-white">Optimized</span>
                      <span className="text-white font-medium">{comparison.riscv}{comparison.unit}</span>
                    </div>
                    <div className="h-6 bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-white rounded-full"
                        style={{
                          width: `${Math.min((comparison.riscv / (comparison.invert ? comparison.generic : comparison.generic * 1.5)) * 100, 100)}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-zinc-400">Generic C</span>
                      <span className="text-white font-medium">{comparison.generic}{comparison.unit}</span>
                    </div>
                    <div className="h-6 bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-zinc-500 rounded-full"
                        style={{
                          width: `${Math.min((comparison.generic / (comparison.invert ? comparison.generic : comparison.generic * 1.5)) * 100, 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 rounded-lg bg-zinc-800 border border-zinc-700 text-center">
                  <span className="text-white font-semibold">{comparison.improvement}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Optimization Techniques */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="section-title">Optimization Techniques</h2>
            <p className="section-subtitle">
              Key techniques used to achieve maximum performance
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Assembly Kernels",
                description: "Critical path operations implemented in assembly for maximum performance",
                impact: "40% speedup on hash operations",
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                ),
              },
              {
                title: "Cache Optimization",
                description: "Memory layout optimized for cache hierarchy to maximize L1/L2 hit rates",
                impact: "94% L1 cache hit rate achieved",
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                  </svg>
                ),
              },
              {
                title: "Vector Extensions",
                description: "Vector processing used for parallel hash computation",
                impact: "2-4x throughput on compatible hardware",
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                ),
              },
              {
                title: "Branchless Code",
                description: "Eliminated branch mispredictions in verification path",
                impact: "15% faster verification",
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
              },
              {
                title: "Memory Pool",
                description: "Pre-allocated memory pools eliminate allocation overhead",
                impact: "Reduced latency variance",
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                ),
              },
              {
                title: "Prefetching",
                description: "Software prefetching for predictable access patterns",
                impact: "20% improvement on large trees",
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                ),
              },
            ].map((technique, index) => (
              <div
                key={technique.title}
                className="card-hover p-6 rounded-xl bg-zinc-900/50 border border-zinc-800 animate-fadeIn"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-12 h-12 rounded-lg bg-zinc-800 flex items-center justify-center text-white mb-4">
                  {technique.icon}
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{technique.title}</h3>
                <p className="text-zinc-400 text-sm mb-3">{technique.description}</p>
                <div className="p-3 rounded-lg bg-zinc-800 border border-zinc-700">
                  <span className="text-white text-sm font-medium">{technique.impact}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Target Achievement */}
      <section className="py-20 bg-zinc-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="section-title">Target Achievement</h2>
            <p className="section-subtitle">
              Progress towards our performance targets
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-8">
            {[
              { achieved: 4, total: 5, label: "Targets Met" },
              { value: "2.1x", label: "Avg. Speedup" },
              { value: "35%", label: "Memory Saved" },
              { value: "94%", label: "L1 Hit Rate" },
            ].map((stat, index) => (
              <div
                key={index}
                className="text-center card-hover p-8 rounded-xl bg-black/50 border border-zinc-800 min-w-[180px]"
              >
                {'achieved' in stat ? (
                  <>
                    <div className="text-4xl font-bold text-white mb-2">
                      {stat.achieved}<span className="text-zinc-600">/{stat.total}</span>
                    </div>
                    <div className="text-sm text-zinc-400">{stat.label}</div>
                  </>
                ) : (
                  <>
                    <div className="text-4xl font-bold text-white mb-2">{stat.value}</div>
                    <div className="text-sm text-zinc-400">{stat.label}</div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

