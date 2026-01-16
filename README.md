# Sierra

High-Performance Merkle Proof Generation and Verification System

## Overview

Sierra is a high-performance Merkle proof generation and verification system optimized for modern architectures, with a focus on RISC-V optimization.

<img width="1016" height="438" alt="Screenshot 2026-01-16 at 2 05 15 PM" src="https://github.com/user-attachments/assets/f4fed32b-7ab0-4b18-983d-0f1f61368d65" />


### Key Capabilities

- Merkle Proof Generation: Lightning-fast proof generation for large datasets
- Proof Verification: Optimized verification algorithms with minimal overhead
- RISC-V Optimizations: Assembly-level optimizations for maximum performance
- SPI Interface: Clean API for proof submission and verification

### Performance Targets

| Metric | Target | 
|--------|--------|
| Proof Generation (1M leaves) | < 100ms |
| Proof Verification (1M leaves) | < 50ms |
| Memory Usage | < 100MB |
| Cache Efficiency | > 90% L1 hit rate |

## Project Structure

```
my-app/
├── README.md                 # This file
├── app/                      # Next.js web application
│   ├── components/           # React components
│   │   └── Navbar.tsx        # Navigation component
│   ├── architecture/         # Architecture documentation
│   ├── benchmarks/           # Performance benchmarks
│   ├── code/                 # Source code documentation
│   ├── components/           # Component documentation
│   └── docs/                 # General documentation
├── public/                   # Static assets
│   └── logo.svg              # Sierra logo
├── src/                      # C source code
│   ├── core/                 # Core Merkle tree implementation
│   │   ├── merkle_tree.c     # Merkle tree operations
│   │   ├── merkle_tree.h     # Merkle tree header
│   │   ├── proof_functions.c # Proof generation/verification
│   │   └── memory_pool.c     # Memory management
│   ├── hash/                 # Hash function implementations
│   │   ├── sha256.c          # SHA-256 implementation
│   │   ├── blake2b.c         # Blake2b implementation
│   │   └── hash_functions.h  # Hash function interface
│   ├── spi/                  # SPI (Succinct Proof Interface)
│   │   ├── spi_interface.c   # SPI API implementation
│   │   ├── spi_interface.h   # SPI interface header
│   │   └── main_bench.c      # Benchmarking tool
│   └── tests/                # Test suite
└── package.json              # Node.js dependencies
```

## Technology Stack

### Core Technologies
- Language: C with RISC-V assembly optimizations
- Hash Functions: SHA-256, Blake2b (RISC-V optimized)
- Architecture: RISC-V 64-bit with extensions (B, V)
- Frontend: Next.js 14 with React and TypeScript
- Styling: Tailwind CSS

### Development Tools
- Compiler: RISC-V GCC with optimization flags
- Simulator: Spike RISC-V ISA simulator
- Emulator: QEMU RISC-V
- Framework: Next.js 14 with App Router

### Optimization Focus
- Assembly Kernels: Critical path optimization
- Cache Optimization: L1/L2/L3 cache-aware algorithms
- Memory Management: Efficient allocation and access patterns
- Vector Processing: RISC-V vector extensions

## Success Metrics

### Performance Benchmarks
- Proof Generation Speed: Measured in proofs per second
- Verification Speed: Measured in verifications per second
- Memory Efficiency: Peak memory usage during operations
- Cache Performance: Hit rates and memory bandwidth utilization

### Code Quality
- Test Coverage: >95% code coverage target
- Documentation: Complete API and architecture documentation
- Correctness: 100% accurate proof generation and verification

## Getting Started

### Web Application

```bash
cd my-app
npm install
npm run dev
```

Then open http://localhost:3000 in your browser.

### C Development

For RISC-V development:

```bash
# Install RISC-V toolchain
# Set up Spike simulator or QEMU

# Build the project
cd my-app/src
make

# Run tests
make test
```

## Documentation

| Document | Description |
|----------|-------------|
| Architecture | System design and components |
| Benchmarks | Performance metrics and results |
| Source Code | Code structure and organization |
| Components | Component breakdown |

## Use Cases

- Blockchain Scalability: Efficient light clients and state verification
- Data Availability Proofs: Prove data availability without full download
- Decentralized Storage: Verify inclusion in distributed storage systems
- Audit and Compliance: Cryptographic proof of data integrity

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License

---

Built with performance in mind.

