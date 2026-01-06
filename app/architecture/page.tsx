const architectureLayers = [
  {
    name: "SPI Interface Layer",
    description: "Standard interface for proof submission and retrieval",
    components: [
      "submit_proof_request()",
      "get_proof()",
      "verify_proof()",
      "batch_process_requests()",
    ],
    color: "from-cyan-500 to-blue-500",
  },
  {
    name: "Core Components",
    description: "Merkle tree management and proof operations",
    components: [
      "Merkle Tree Manager",
      "Proof Generator",
      "Verification Engine",
    ],
    color: "from-blue-500 to-purple-500",
  },
  {
    name: "Hash Functions",
    description: "Optimized cryptographic hash implementations",
    components: ["SHA-256", "Blake2b", "Custom RISC-V Optimized"],
    color: "from-purple-500 to-pink-500",
  },
  {
    name: "RISC-V Layer",
    description: "Platform-specific optimizations",
    components: [
      "Assembly Kernels",
      "Cache Manager",
      "Memory Manager",
      "Vector Extensions",
    ],
    color: "from-pink-500 to-cyan-500",
  },
];

const dataFlow = [
  { step: 1, from: "User Request", to: "SPI Interface", description: "Proof request submitted" },
  { step: 2, from: "SPI Interface", to: "Tree Manager", description: "Request routed to handler" },
  { step: 3, from: "Tree Manager", to: "Proof Generator", description: "Tree traversal initiated" },
  { step: 4, from: "Proof Generator", to: "RISC-V Optimizer", description: "Optimization applied" },
  { step: 5, from: "RISC-V Optimizer", to: "Output", description: "Proof generated & returned" },
];

export default function ArchitecturePage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="py-20 border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center animate-fadeIn">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              <span className="text-white">System</span>{" "}
              <span className="gradient-text">Architecture</span>
            </h1>
            <p className="max-w-2xl mx-auto text-lg text-zinc-400">
              A comprehensive view of our RISC-V optimized Merkle proof system architecture
            </p>
          </div>
        </div>
      </section>

      {/* Architecture Diagram */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="section-title">System Layers</h2>
            <p className="section-subtitle">
              Four-tier architecture optimized for RISC-V performance
            </p>
          </div>

          <div className="relative">
            {/* Connection lines */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gradient-to-b from-cyan-500 via-blue-500 via-purple-500 to-pink-500 opacity-30" />

            <div className="space-y-8">
              {architectureLayers.map((layer, index) => (
                <div
                  key={layer.name}
                  className="relative flex items-center animate-fadeIn"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  {/* Layer card */}
                  <div className="flex-1 max-w-md mx-auto">
                    <div className="card-hover p-6 rounded-xl bg-zinc-900/50 border border-zinc-800">
                      <div className={`w-full h-1 rounded-t-lg mb-4 bg-gradient-to-r ${layer.color}`} />
                      <h3 className="text-lg font-semibold text-white mb-2">{layer.name}</h3>
                      <p className="text-zinc-400 text-sm mb-4">{layer.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {layer.components.map((comp) => (
                          <span
                            key={comp}
                            className="px-2 py-1 text-xs rounded bg-zinc-800 text-zinc-300"
                          >
                            {comp}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Step number */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-10 h-10 rounded-full bg-black border-2 border-cyan-500 flex items-center justify-center z-10">
                    <span className="text-cyan-400 font-bold text-sm">{index + 1}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Data Flow */}
      <section className="py-20 bg-zinc-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="section-title">Data Flow</h2>
            <p className="section-subtitle">
              How data flows through the system during proof generation
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            {dataFlow.map((flow, index) => (
              <div
                key={flow.step}
                className="flex items-center animate-fadeIn"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="card-hover p-4 rounded-xl bg-zinc-900/50 border border-zinc-800 text-center">
                  <div className="text-xs text-zinc-500 mb-1">Step {flow.step}</div>
                  <div className="text-sm font-medium text-white mb-1">{flow.from}</div>
                  <div className="text-xs text-cyan-400">→</div>
                  <div className="text-sm font-medium text-white mt-1">{flow.to}</div>
                </div>
                {index < dataFlow.length - 1 && (
                  <div className="hidden sm:block text-zinc-600 px-2">→</div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-8 p-4 rounded-lg bg-zinc-900/50 border border-zinc-800 max-w-2xl mx-auto">
            <p className="text-sm text-zinc-400 text-center">{dataFlow[4].description}</p>
          </div>
        </div>
      </section>

      {/* Component Details */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="section-title">Key Components</h2>
            <p className="section-subtitle">
              Detailed breakdown of each architectural component
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* SPI Interface */}
            <div className="card-hover p-8 rounded-xl bg-zinc-900/50 border border-zinc-800">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                  <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">SPI Interface</h3>
                  <p className="text-sm text-zinc-400">Succinct Proof Interface</p>
                </div>
              </div>
              <p className="text-zinc-400 mb-4">
                Standard interface for proof submission and retrieval. Supports protocol buffer/gRPC 
                interface, internal C API, and JSON-RPC wrapper for web-based submissions.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2 text-zinc-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  submit_proof_request(tree_id, leaf_index, data)
                </li>
                <li className="flex items-center gap-2 text-zinc-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  get_proof(tree_id, leaf_index)
                </li>
                <li className="flex items-center gap-2 text-zinc-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  verify_proof(proof, root_hash, leaf_data)
                </li>
              </ul>
            </div>

            {/* Merkle Tree Manager */}
            <div className="card-hover p-8 rounded-xl bg-zinc-900/50 border border-zinc-800">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">Merkle Tree Manager</h3>
                  <p className="text-sm text-zinc-400">Binary Merkle Tree</p>
                </div>
              </div>
              <p className="text-zinc-400 mb-4">
                Efficient Merkle tree construction and management with support for large datasets.
                Implements optimized tree operations with O(log n) complexity.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2 text-zinc-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                  merkle_tree_create(size, hash_func)
                </li>
                <li className="flex items-center gap-2 text-zinc-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                  merkle_tree_insert(tree, leaf_data, index)
                </li>
                <li className="flex items-center gap-2 text-zinc-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                  merkle_tree_get_root(tree)
                </li>
              </ul>
            </div>

            {/* Hash Functions */}
            <div className="card-hover p-8 rounded-xl bg-zinc-900/50 border border-zinc-800">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">Hash Functions</h3>
                  <p className="text-sm text-zinc-400">SHA-256 & Blake2b</p>
                </div>
              </div>
              <p className="text-zinc-400 mb-4">
                Optimized cryptographic hash implementations with RISC-V assembly optimizations
                for maximum performance using B-extension and V-extension instructions.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2 text-zinc-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                  SHA-256 (primary hash function)
                </li>
                <li className="flex items-center gap-2 text-zinc-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                  Blake2b (alternative)
                </li>
                <li className="flex items-center gap-2 text-zinc-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                  RISC-V optimized assembly kernels
                </li>
              </ul>
            </div>

            {/* RISC-V Optimizer */}
            <div className="card-hover p-8 rounded-xl bg-zinc-900/50 border border-zinc-800">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-lg bg-pink-500/10 flex items-center justify-center">
                  <svg className="w-6 h-6 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">RISC-V Optimizer</h3>
                  <p className="text-sm text-zinc-400">Platform-specific tuning</p>
                </div>
              </div>
              <p className="text-zinc-400 mb-4">
                Assembly-level optimizations for critical paths including memory layout optimization,
                branch prediction, and instruction scheduling for pipeline efficiency.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2 text-zinc-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-pink-400" />
                  Assembly micro-optimizations
                </li>
                <li className="flex items-center gap-2 text-zinc-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-pink-400" />
                  Cache-aware memory access
                </li>
                <li className="flex items-center gap-2 text-zinc-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-pink-400" />
                  Vector processing (RISC-V V extension)
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Performance Targets */}
      <section className="py-20 bg-gradient-to-r from-cyan-500/10 via-blue-600/10 to-purple-500/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="section-title">Performance Targets</h2>
            <p className="section-subtitle">
              Our optimization goals for 1M leaf Merkle trees
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { metric: "Proof Generation", target: "< 100ms", status: "Target" },
              { metric: "Proof Verification", target: "< 50ms", status: "Target" },
              { metric: "Memory Usage", target: "< 100MB", status: "Target" },
              { metric: "Cache Efficiency", target: "> 90% L1", status: "Target" },
            ].map((item) => (
              <div key={item.metric} className="card-hover p-6 rounded-xl bg-black/50 border border-zinc-800 text-center">
                <div className="text-2xl font-bold text-cyan-400 mb-2">{item.target}</div>
                <div className="text-sm text-white font-medium">{item.metric}</div>
                <div className="text-xs text-zinc-500 mt-1">{item.status}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

