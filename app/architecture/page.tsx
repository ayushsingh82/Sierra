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
  },
  {
    name: "Core Components",
    description: "Merkle tree management and proof operations",
    components: [
      "Merkle Tree Manager",
      "Proof Generator",
      "Verification Engine",
    ],
  },
  {
    name: "Hash Functions",
    description: "Optimized cryptographic hash implementations",
    components: ["SHA-256", "Blake2b", "Custom Optimized"],
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
  },
];

const dataFlow = [
  { step: 1, from: "User Request", to: "SPI Interface", description: "Proof request submitted" },
  { step: 2, from: "SPI Interface", to: "Tree Manager", description: "Request routed to handler" },
  { step: 3, from: "Tree Manager", to: "Proof Generator", description: "Tree traversal initiated" },
  { step: 4, from: "Proof Generator", to: "Optimizer", description: "Optimization applied" },
  { step: 5, from: "Optimizer", to: "Output", description: "Proof generated & returned" },
];

export default function ArchitecturePage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center animate-fadeIn">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              <span className="text-black">System</span>{" "}
              <span className="text-black">Architecture</span>
            </h1>
            <p className="max-w-2xl mx-auto text-lg text-black/70">
              A comprehensive view of our high-performance Merkle proof system architecture
            </p>
          </div>
        </div>
      </section>

      {/* Architecture Diagram */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-black">System Layers</h2>
            <p className="text-lg text-black/70">
              Four-tier architecture optimized for maximum performance
            </p>
          </div>

          <div className="space-y-6">
            {architectureLayers.map((layer, index) => (
              <div
                key={layer.name}
                className="animate-fadeIn"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                {/* Step indicator */}
                <div className="flex items-center mb-2">
                  <div className="w-8 h-8 rounded-full bg-black border border-transparent flex items-center justify-center text-white text-sm font-bold mr-4">
                    {index + 1}
                  </div>
                </div>
                
                {/* Layer card */}
                <div className="ml-4 md:ml-12 p-6 rounded-xl bg-white border border-transparent">
                  <h3 className="text-lg font-semibold text-black mb-2">{layer.name}</h3>
                  <p className="text-black/70 text-sm mb-4">{layer.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {layer.components.map((comp) => (
                      <span
                        key={comp}
                        className="px-2 py-1 text-xs rounded bg-black text-white"
                      >
                        {comp}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Data Flow */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-black">Data Flow</h2>
            <p className="text-lg text-black/70">
              How data flows through the system during proof generation
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            {dataFlow.map((flow, index) => (
              <div
                key={flow.step}
                className="animate-fadeIn"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="card-hover p-4 rounded-xl bg-white border border-transparent text-center">
                  <div className="text-xs text-black/50 mb-1">Step {flow.step}</div>
                  <div className="text-sm font-medium text-black mb-1">{flow.from}</div>
                  <div className="text-xs text-black/40">→</div>
                  <div className="text-sm font-medium text-black mt-1">{flow.to}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 p-4 rounded-lg bg-white border border-transparent max-w-2xl mx-auto">
            <p className="text-sm text-black/70 text-center">{dataFlow[4].description}</p>
          </div>
        </div>
      </section>

      {/* Component Details */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-black">Key Components</h2>
            <p className="text-lg text-black/70">
              Detailed breakdown of each architectural component
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* SPI Interface */}
            <div className="card-hover p-8 rounded-xl bg-white border border-transparent">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-lg bg-black flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-black">SPI Interface</h3>
                  <p className="text-sm text-black/50">Succinct Proof Interface</p>
                </div>
              </div>
              <p className="text-black/70 mb-4">
                Standard interface for proof submission and retrieval. Supports protocol buffer/gRPC 
                interface, internal C API, and JSON-RPC wrapper for web-based submissions.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2 text-black">
                  <span className="w-1.5 h-1.5 rounded-full bg-black" />
                  submit_proof_request(tree_id, leaf_index, data)
                </li>
                <li className="flex items-center gap-2 text-black">
                  <span className="w-1.5 h-1.5 rounded-full bg-black" />
                  get_proof(tree_id, leaf_index)
                </li>
                <li className="flex items-center gap-2 text-black">
                  <span className="w-1.5 h-1.5 rounded-full bg-black" />
                  verify_proof(proof, root_hash, leaf_data)
                </li>
              </ul>
            </div>

            {/* Merkle Tree Manager */}
            <div className="card-hover p-8 rounded-xl bg-white border border-transparent">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-lg bg-black flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-black">Merkle Tree Manager</h3>
                  <p className="text-sm text-black/50">Binary Merkle Tree</p>
                </div>
              </div>
              <p className="text-black/70 mb-4">
                Efficient Merkle tree construction and management with support for large datasets.
                Implements optimized tree operations with O(log n) complexity.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2 text-black">
                  <span className="w-1.5 h-1.5 rounded-full bg-black" />
                  merkle_tree_create(size, hash_func)
                </li>
                <li className="flex items-center gap-2 text-black">
                  <span className="w-1.5 h-1.5 rounded-full bg-black" />
                  merkle_tree_insert(tree, leaf_data, index)
                </li>
                <li className="flex items-center gap-2 text-black">
                  <span className="w-1.5 h-1.5 rounded-full bg-black" />
                  merkle_tree_get_root(tree)
                </li>
              </ul>
            </div>

            {/* Hash Functions */}
            <div className="card-hover p-8 rounded-xl bg-white border border-transparent">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-lg bg-black flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-black">Hash Functions</h3>
                  <p className="text-sm text-black/50">SHA-256 & Blake2b</p>
                </div>
              </div>
              <p className="text-black/70 mb-4">
                Optimized cryptographic hash implementations with assembly optimizations
                for maximum performance using modern CPU extensions.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2 text-black">
                  <span className="w-1.5 h-1.5 rounded-full bg-black" />
                  SHA-256 (primary hash function)
                </li>
                <li className="flex items-center gap-2 text-black">
                  <span className="w-1.5 h-1.5 rounded-full bg-black" />
                  Blake2b (alternative)
                </li>
                <li className="flex items-center gap-2 text-black">
                  <span className="w-1.5 h-1.5 rounded-full bg-black" />
                  Optimized assembly kernels
                </li>
              </ul>
            </div>

            {/* RISC-V Optimizer */}
            <div className="card-hover p-8 rounded-xl bg-white border border-transparent">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-lg bg-black flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-black">Platform Optimizer</h3>
                  <p className="text-sm text-black/50">Platform-specific tuning</p>
                </div>
              </div>
              <p className="text-black/70 mb-4">
                Assembly-level optimizations for critical paths including memory layout optimization,
                branch prediction, and instruction scheduling for pipeline efficiency.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2 text-black">
                  <span className="w-1.5 h-1.5 rounded-full bg-black" />
                  Assembly micro-optimizations
                </li>
                <li className="flex items-center gap-2 text-black">
                  <span className="w-1.5 h-1.5 rounded-full bg-black" />
                  Cache-aware memory access
                </li>
                <li className="flex items-center gap-2 text-black">
                  <span className="w-1.5 h-1.5 rounded-full bg-black" />
                  Vector processing support
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Performance Targets */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-black">Performance Targets</h2>
            <p className="text-lg text-black/70">
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
              <div key={item.metric} className="card-hover p-6 rounded-xl bg-white border border-transparent text-center">
                <div className="text-2xl font-bold text-black mb-2">{item.target}</div>
                <div className="text-sm text-black font-medium">{item.metric}</div>
                <div className="text-xs text-black/50 mt-1">{item.status}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

