# Sierra

**High-Performance Merkle Proof Generation and Verification System**

## 🚀 Quick Start

This repository contains our implementation for Challenge B of the Amadeus Genesis Hackathon, focusing on building the fastest Merkle proof system optimized for RISC-V architecture.

### 📋 What We're Building

- **Merkle Proof Generation**: Lightning-fast proof generation for large datasets
- **Proof Verification**: Optimized verification algorithms with minimal overhead
- **RISC-V Optimizations**: Assembly-level optimizations for maximum performance
- **SPI Interface**: Clean API for proof submission and verification

### 🎯 Performance Targets

| Metric | Target | 
|--------|--------|
| Proof Generation (1M leaves) | < 100ms |
| Proof Verification (1M leaves) | < 50ms |
| Memory Usage | < 100MB |
| Cache Efficiency | > 90% L1 hit rate |

## 📁 Project Structure

```
riscv-2/
├── README.md                 # This file - overview and quick start
├── rules.md                  # Official hackathon rules and regulations
├── challenge-b-plan.md       # High-level strategy and approach
├── technical-architecture.md # Detailed system architecture
├── implementation-roadmap.md # Timeline and milestone planning
├── TODO.md                   # Comprehensive task checklist
├── development-guide.md      # Setup and development instructions
├── resources.md              # Links and references
└── src/                      # Source code (to be created)
    ├── core/                 # Core Merkle tree implementation
    ├── hash/                 # Hash function implementations
    ├── riscv/                # RISC-V specific optimizations
    ├── spi/                  # SPI interface implementation
    └── tests/                # Comprehensive test suite
```

## 🏁 Challenge Overview

### What is Challenge B?
Implement SPI proof computation that runs efficiently on RISC-V, focusing on generating the fastest verifiable Merkle proof generation and verification system.

### Why Merkle Proofs?
Merkle proofs are fundamental to blockchain technology, providing efficient verification of data inclusion without revealing the entire dataset. Performance optimization is critical for:
- Blockchain scalability
- Efficient light clients
- Data availability proofs
- Decentralized storage systems

### Why RISC-V?
RISC-V is an open-source instruction set architecture that offers:
- Clean, simple instruction set for optimization
- Extensible architecture (vector, bit manipulation extensions)
- Growing ecosystem for high-performance computing
- Open hardware implementations

## 🚦 Getting Started

### Prerequisites
- RISC-V GCC toolchain
- Spike simulator or QEMU RISC-V
- TensTorrent Blackhole™ p150a access (provided by hackathon)
- Development environment (Linux/macOS recommended)

### Quick Setup
1. **Read the rules**: Start with `rules.md` to understand hackathon requirements
2. **Review the plan**: Check `challenge-b-plan.md` for our overall strategy
3. **Study architecture**: Read `technical-architecture.md` for implementation details
4. **Follow the roadmap**: Use `implementation-roadmap.md` for timeline guidance
5. **Track progress**: Use `TODO.md` for daily task management

### Development Workflow
```bash
# 1. Set up environment (see development-guide.md)
# 2. Start with basic Merkle tree implementation
# 3. Add hash functions with RISC-V optimizations
# 4. Implement proof generation and verification
# 5. Add SPI interface and performance optimizations
# 6. Test, benchmark, and optimize
```

## 📚 Documentation Overview

| Document | Purpose | When to Read |
|----------|---------|--------------|
| `rules.md` | Official hackathon rules | Before starting |
| `challenge-b-plan.md` | Strategy and high-level approach | Before development |
| `technical-architecture.md` | Detailed system design | During implementation |
| `implementation-roadmap.md` | Timeline and milestones | Planning phase |
| `TODO.md` | Daily task management | Every day |
| `development-guide.md` | Setup and development help | When setting up |
| `resources.md` | Links and references | Throughout development |

## 🔧 Technology Stack

### Core Technologies
- **Language**: C with RISC-V assembly optimizations
- **Hash Functions**: SHA-256, Blake2b (RISC-V optimized)
- **Architecture**: RISC-V 64-bit with extensions (B, V)
- **Testing**: Unity test framework
- **Build System**: Makefile with cross-compilation support

### Development Tools
- **Compiler**: RISC-V GCC with optimization flags
- **Simulator**: Spike RISC-V ISA simulator
- **Emulator**: QEMU RISC-V
- **Profiling**: perf, valgrind, custom profiling tools
- **Hardware**: TensTorrent Blackhole™ p150a

### Optimization Focus
- **Assembly Kernels**: Critical path optimization
- **Cache Optimization**: L1/L2/L3 cache-aware algorithms
- **Memory Management**: Efficient allocation and access patterns
- **Parallel Processing**: Multi-threading where applicable
- **Vector Processing**: RISC-V vector extensions

## 📊 Success Metrics

### Performance Benchmarks
- **Proof Generation Speed**: Measured in proofs per second
- **Verification Speed**: Measured in verifications per second
- **Memory Efficiency**: Peak memory usage during operations
- **Cache Performance**: Hit rates and memory bandwidth utilization

### Code Quality
- **Test Coverage**: >95% code coverage target
- **Documentation**: Complete API and architecture documentation
- **Correctness**: 100% accurate proof generation and verification
- **Reproducibility**: Docker container for consistent results

### Competition Metrics
- **Speed Ranking**: Fastest proof generation among submissions
- **Efficiency**: Best performance per unit of resources
- **Innovation**: Novel optimization techniques and approaches
- **Documentation**: Clear explanation of methods and results

## 🚨 Important Dates

| Event | Date | Notes |
|-------|------|-------|
| Registration Opens | Dec 4, 2024 | Register for API access |
| Registration Closes | Dec 25, 2024 | Don't miss this! |
| Opening Ceremony | Dec 19, 2024 | Technical details revealed |
| Submission Deadline | Jan 15, 2025 | Final submission due |
| Judging Period | Jan 16-22, 2025 | Judges evaluate submissions |
| Winners Announced | Jan 23, 2025 | Results revealed |





### Success Factors
- **Early Start**: Begin development immediately after registration
- **Focused Approach**: Prioritize core functionality over advanced features
- **Performance First**: Optimize for speed from the beginning
- **Thorough Testing**: Ensure correctness while maintaining performance
- **Good Documentation**: Help judges understand your approach



### Technical Resources
- **RISC-V ISA Manual**: Official specification documentation
- **TensTorrent Docs**: Hardware-specific optimization guides
- **SPI Specification**: Protocol documentation
- **Hash Function Test Vectors**: Verification data

### Hardware Access
- **TensTorrent Blackhole™ p150a**: Provided cloud access for all participants
- **Setup Support**: Available from TensTorrent team
- **Performance Tools**: Access to specialized profiling tools

## 🎯 Our Competitive Advantages

### Technical Differentiators
1. **RISC-V Assembly Expertise**: Deep optimization of critical paths
2. **Cache-Aware Algorithms**: Optimized for RISC-V cache hierarchy
3. **Novel Tree Layouts**: Innovative memory organization strategies
4. **Parallel Processing**: Multi-threaded proof generation

### Implementation Quality
1. **Production-Ready Code**: Clean, maintainable, well-documented
2. **Comprehensive Testing**: Extensive test coverage and validation
3. **Performance Analysis**: Detailed benchmarking and optimization documentation
4. **Reproducibility**: Full Docker containerization

### Strategic Approach
1. **Early Hardware Access**: Secure TensTorrent access immediately
2. **Incremental Optimization**: Build correctness first, optimize continuously
3. **Multiple Strategies**: Implement several optimization approaches in parallel
4. **Performance Focus**: Every decision evaluated for performance impact

## 📝 Next Steps

### Immediate Actions (Next 24 Hours)
1. **Read all documentation** in this repository
2. **Set up development environment** following `development-guide.md`
3. **Secure TensTorrent access** and test connectivity
4. **Register for API keys** and understand submission requirements
5. **Join community channels** for support and updates

### This Week
1. **Complete Phase 1**: Research and architecture finalization
2. **Start core implementation**: Begin with Merkle tree basics
3. **Set up benchmarking**: Establish performance measurement framework
4. **Test on simulator**: Validate approach before hardware access

### Ongoing
1. **Daily progress tracking** using TODO.md checklist
2. **Performance optimization** throughout development
3. **Continuous documentation** updates
4. **Regular team synchronization** and planning sessions





