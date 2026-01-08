import Link from "next/link";

const stats = [
  { label: "Proof Generation", value: "< 100ms", target: "Target for 1M leaves", color: "text-white" },
  { label: "Proof Verification", value: "< 50ms", target: "Target for 1M leaves", color: "text-zinc-300" },
  { label: "Memory Usage", value: "< 100MB", target: "Target for 1M leaves", color: "text-zinc-400" },
  { label: "Cache Efficiency", value: "> 90%", target: "L1 hit rate target", color: "text-zinc-500" },
];

const features = [
  {
    title: "Merkle Proof Generation",
    description: "Lightning-fast proof generation for large datasets using optimized algorithms.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: "Proof Verification",
    description: "Optimized verification algorithms with minimal computational overhead.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  {
    title: "RISC-V Optimizations",
    description: "Assembly-level optimizations for maximum performance on RISC-V architecture.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    title: "SPI Interface",
    description: "Clean API for proof submission and verification with gRPC support.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
];

const projectStructure = [
  { name: "Core", description: "Merkle tree implementation", files: ["merkle_tree.c", "merkle_tree.h", "proof_functions.c", "memory_pool.c"] },
  { name: "Hash", description: "SHA-256 & Blake2b implementations", files: ["sha256.c", "blake2b.c", "hash_functions.h"] },
  { name: "SPI", description: "Succinct Proof Interface", files: ["spi_interface.c", "spi_interface.h", "main_bench.c"] },
  { name: "Tests", description: "Test suite", files: ["main_test.c"] },
];

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 sm:py-32">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-900/50 via-transparent to-zinc-800/30" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-800/20 via-transparent to-transparent" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center animate-fadeIn">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900 border border-zinc-800 mb-8">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              <span className="text-sm text-zinc-400">High-Performance Merkle Proof System</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              <span className="text-white">Introducing</span>
              <br />
              <span className="gradient-text">Sierra</span>
            </h1>
            
            <p className="max-w-2xl mx-auto text-lg sm:text-xl text-zinc-400 mb-10">
              High-performance Merkle proof generation and verification system 
              optimized for modern architectures.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/architecture"
                className="px-6 py-3 rounded-lg bg-white text-black font-medium hover:bg-zinc-200 transition-colors"
              >
                View Architecture
              </Link>
              <Link
                href="/code"
                className="px-6 py-3 rounded-lg border border-zinc-700 text-white font-medium hover:bg-zinc-800 transition-colors"
              >
                Explore Code
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 border-y border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={stat.label} className="text-center card-hover p-6 rounded-xl bg-zinc-900/50 border border-zinc-800">
                <div className={`text-3xl sm:text-4xl font-bold mb-2 ${stat.color}`}>
                  {stat.value}
                </div>
                <div className="text-sm text-white font-medium mb-1">{stat.label}</div>
                <div className="text-xs text-zinc-500">{stat.target}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="section-title">Core Features</h2>
            <p className="section-subtitle">
              Everything you need for high-performance Merkle proof operations
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="card-hover p-6 rounded-xl bg-zinc-900/50 border border-zinc-800"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-12 h-12 rounded-lg bg-zinc-800 flex items-center justify-center text-white mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-zinc-400 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Project Structure Section */}
      <section className="py-20 bg-zinc-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="section-title">Project Structure</h2>
            <p className="section-subtitle">
              Organized for performance and maintainability
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {projectStructure.map((item) => (
              <div
                key={item.name}
                className="card-hover p-6 rounded-xl bg-zinc-900/50 border border-zinc-800"
              >
                <h3 className="text-lg font-semibold text-white mb-2">{item.name}</h3>
                <p className="text-zinc-400 text-sm mb-3">{item.description}</p>
                <div className="flex flex-wrap gap-2">
                  {item.files.map((file) => (
                    <span
                      key={file}
                      className="px-2 py-1 text-xs rounded bg-zinc-800 text-zinc-300"
                    >
                      {file}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Links Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title">Explore More</h2>
            <p className="section-subtitle">
              Navigate through different aspects of the project
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: "Architecture", href: "/architecture", desc: "System design & components" },
              { title: "Components", href: "/components", desc: "Detailed component breakdown" },
              { title: "Benchmarks", href: "/benchmarks", desc: "Performance metrics" },
              { title: "Documentation", href: "/docs", desc: "All project docs" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group p-6 rounded-xl bg-zinc-900/50 border border-zinc-800 card-hover"
              >
                <h3 className="text-lg font-semibold text-white group-hover:text-white transition-colors mb-2">
                  {link.title}
                </h3>
                <p className="text-zinc-400 text-sm">{link.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

