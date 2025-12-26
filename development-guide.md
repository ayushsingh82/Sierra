# Development Guide - Challenge B Implementation

## 🚀 Quick Setup Guide

This guide will help you set up your development environment for building the fastest Merkle proof system on RISC-V.

## 📋 Prerequisites

### System Requirements
- **Operating System**: Linux (Ubuntu 20.04+ recommended) or macOS
- **Memory**: Minimum 8GB RAM (16GB+ recommended for large tree testing)
- **Storage**: At least 10GB free space for toolchains and testing data
- **Network**: Stable internet for TensTorrent access and API submissions

### Required Software
- Git
- GCC compiler (for native compilation and testing)
- Make build system
- Python 3.8+ (for build scripts and testing utilities)
- Docker (for containerized testing)

## 🔧 RISC-V Development Environment Setup

### Step 1: Install RISC-V Toolchain

#### Option A: Pre-built Packages (Recommended)

**Ubuntu/Debian:**
```bash
# Add RISC-V repository
sudo apt update
sudo apt install build-essential

# Install RISC-V GCC toolchain
sudo apt install gcc-riscv64-unknown-elf

# Verify installation
riscv64-unknown-elf-gcc --version
```

**macOS:**
```bash
# Using Homebrew
brew install riscv-tools

# Verify installation
riscv64-unknown-elf-gcc --version
```

**Manual Installation (if packages not available):**
```bash
# Clone and build toolchain (takes 30-60 minutes)
git clone https://github.com/riscv/riscv-gnu-toolchain.git
cd riscv-gnu-toolchain
./configure --prefix=/opt/riscv
make -j$(nproc)
sudo make install

# Add to PATH
echo 'export PATH="/opt/riscv/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc
```

### Step 2: Install RISC-V Simulators

#### Spike Simulator
```bash
# Install Spike (RISC-V ISA Simulator)
sudo apt install device-tree-compiler  # Ubuntu/Debian
# or
brew install dtc  # macOS

# Clone and build Spike
git clone https://github.com/riscv-software-src/riscv-isa-sim.git
cd riscv-isa-sim
mkdir build && cd build
../configure --prefix=/opt/riscv
make -j$(nproc)
sudo make install
sudo ldconfig
```

#### QEMU RISC-V
```bash
# Install QEMU with RISC-V support
sudo apt install qemu-system-misc  # Ubuntu/Debian
# or
brew install qemu  # macOS

# Verify installation
qemu-system-riscv64 --version
```

### Step 3: Configure Development Environment

#### Create Project Directory
```bash
cd /Users/ayush/Desktop/riscv-2  # Your working directory
mkdir -p src/{core,hash,riscv,spi,tests}
mkdir -p build/{debug,release,benchmark}
mkdir -p data/{test,benchmark}
mkdir -p tools
```

#### Set Up Build Environment
```bash
# Create build configuration script
cat > setup-env.sh << 'EOF'
#!/bin/bash
export RISCV=/opt/riscv
export PATH=$RISCV/bin:$PATH

# Build flags
export RISCV_CFLAGS="-march=rv64gc -mtune=rocket -O3 -ffast-math"
export RISCV_CFLAGS_DEBUG="-march=rv64gc -mtune=rocket -O0 -g"
export RISCV_LDFLAGS="-static"

# Environment
export PROJECT_ROOT=$(pwd)
export BUILD_DIR=$PROJECT_ROOT/build
export SRC_DIR=$PROJECT_ROOT/src
export TOOLS_DIR=$PROJECT_ROOT/tools

echo "RISC-V environment configured"
echo "RISCV toolchain: $RISCV"
echo "Project root: $PROJECT_ROOT"
EOF

chmod +x setup-env.sh
source setup-env.sh
```

## 🛠️ Build System Setup

### Create Makefile Structure

#### Root Makefile
```makefile
# Makefile for Challenge B - Merkle Proof RISC-V Implementation

.PHONY: all clean test benchmark sim run debug help

# Variables
CC = riscv64-unknown-elf-gcc
CFLAGS = -march=rv64gc -mtune=rocket -O3 -ffast-math
LDFLAGS = -static
BUILD_DIR = build
SRC_DIR = src

# Default target
all: release test

# Debug build
debug:
	@$(MAKE) BUILD_TYPE=debug $(MAKECMDGOALS)

# Release build
release:
	@$(MAKE) BUILD_TYPE=release $(MAKECMDGOALS)

# Test build
test:
	@$(MAKE) BUILD_TYPE=test $(MAKECMDGOALS)

# Run tests
test-run: test
	$(BUILD_DIR)/test/merkle_test

# Simulation
sim: release
	spike $(BUILD_DIR)/release/merkle_bench

# Benchmark
benchmark: release
	$(BUILD_DIR)/release/merkle_bench

# Clean build artifacts
clean:
	rm -rf $(BUILD_DIR)

# Help
help:
	@echo "Available targets:"
	@echo "  all       - Build release version and run tests"
	@echo "  debug     - Build debug version"
	@echo "  release   - Build optimized release version"
	@echo "  test      - Build test version"
	@echo "  test-run  - Build and run tests"
	@echo "  sim       - Run on Spike simulator"
	@echo "  benchmark - Run performance benchmarks"
	@echo "  clean     - Clean build artifacts"
```

#### Component Makefiles
```makefile
# src/Makefile
include $(SRC_DIR)/common.mk

# Source files
CORE_SOURCES = $(wildcard core/*.c)
HASH_SOURCES = $(wildcard hash/*.c)
RISCV_SOURCES = $(wildcard riscv/*.c)
SPI_SOURCES = $(wildcard spi/*.c)
TEST_SOURCES = $(wildcard tests/*.c)

# Object files
CORE_OBJECTS = $(CORE_SOURCES:%.c=$(BUILD_DIR)/%.o)
HASH_OBJECTS = $(HASH_SOURCES:%.c=$(BUILD_DIR)/%.o)
RISCV_OBJECTS = $(RISCV_SOURCES:%.c=$(BUILD_DIR)/%.o)
SPI_OBJECTS = $(SPI_SOURCES:%.c=$(BUILD_DIR)/%.o)
TEST_OBJECTS = $(TEST_SOURCES:%.c=$(BUILD_DIR)/%.o)

# Include directories
INCLUDES = -I$(SRC_DIR)/include -I$(SRC_DIR)/core -I$(SRC_DIR)/hash -I$(SRC_DIR)/riscv -I$(SRC_DIR)/spi
```

### Create Common Build Configuration
```makefile
# src/common.mk
# Common build configuration

# Compiler settings
CC = riscv64-unknown-elf-gcc
CFLAGS = $(RISCV_CFLAGS) $(INCLUDES) -Wall -Wextra -Werror
LDFLAGS = $(RISCV_LDFLAGS)

# Debug settings
CFLAGS_DEBUG = $(RISCV_CFLAGS_DEBUG) $(INCLUDES) -Wall -DDEBUG
LDFLAGS_DEBUG = -g

# Test settings
CFLAGS_TEST = $(RISCV_CFLAGS) $(INCLUDES) -Wall -DTEST -Iunity
LDFLAGS_TEST = $(RISCV_LDFLAGS)

# Directories
BUILD_DIR = ../build
SRC_DIR = .
INCLUDE_DIR = include

# Build type specific settings
ifeq ($(BUILD_TYPE),debug)
    CFLAGS += $(CFLAGS_DEBUG)
    LDFLAGS += $(LDFLAGS_DEBUG)
    BUILD_SUBDIR = debug
else ifeq ($(BUILD_TYPE),test)
    CFLAGS += $(CFLAGS_TEST)
    LDFLAGS += $(LDFLAGS_TEST)
    BUILD_SUBDIR = test
else
    BUILD_SUBDIR = release
endif

# Final build directory
BUILD_PATH = $(BUILD_DIR)/$(BUILD_SUBDIR)

# Create build directory
$(BUILD_PATH):
	mkdir -p $(BUILD_PATH)
```

## 🔬 Testing Framework Setup

### Unity Test Framework Integration
```bash
# Download Unity testing framework
cd tools
git clone https://github.com/ThrowTheSwitch/Unity.git unity
cd unity
git checkout v2.5.2
```

### Create Basic Test Structure
```c
// src/tests/merkle_test.c
#include <stdio.h>
#include <unity.h>
#include "merkle_tree.h"
#include "hash_functions.h"

// Test setup and teardown
void setUp(void) {
    // Initialize test environment
}

void tearDown(void) {
    // Clean up after tests
}

// Test functions
void test_merkle_tree_creation(void) {
    merkle_tree_t* tree = merkle_tree_create(1024, SHA256);
    TEST_ASSERT_NOT_NULL(tree);
    TEST_ASSERT_EQUAL(1024, tree->num_leaves);
    merkle_tree_destroy(tree);
}

void test_proof_generation(void) {
    // Test proof generation
}

void test_proof_verification(void) {
    // Test proof verification
}

// Main test runner
int main(void) {
    UNITY_BEGIN();
    RUN_TEST(test_merkle_tree_creation);
    RUN_TEST(test_proof_generation);
    RUN_TEST(test_proof_verification);
    return UNITY_END();
}
```

## 🎯 TensTorrent Hardware Setup

### Access Request Process
1. **Register for Hardware Access**
   - Fill out TensTorrent access request form
   - Provide project details and use case
   - Specify development timeline

2. **Receive Access Credentials**
   - Cloud instance credentials
   - Hardware specifications
   - Access instructions

3. **Connect and Verify**
   ```bash
   # Connect to TensTorrent instance (example)
   ssh user@<tensorrent-ip>
   
   # Verify RISC-V capabilities
   cat /proc/cpuinfo
   
   # Test compilation
   echo 'int main() { return 0; }' > test.c
   riscv64-unknown-elf-gcc test.c -o test
   spike test
   ```

### Performance Profiling Tools
```bash
# Install performance analysis tools
sudo apt install linux-tools-generic  # perf
sudo apt install valgrind             # memory analysis
sudo apt install strace               # system call analysis

# Custom profiling setup
cd tools
git clone https://github.com/simonjjones/riscv-perf.git riscv-perf
```

## 🧪 Development Workflow

### Daily Development Cycle
1. **Morning Setup**
   ```bash
   source setup-env.sh
   make clean
   make all
   make test-run
   ```

2. **Implementation Cycle**
   - Write code
   - Test on simulator: `make sim`
   - Debug if needed: `make debug`
   - Benchmark: `make benchmark`

3. **End of Day**
   ```bash
   git add .
   git commit -m "Daily progress: [description]"
   make clean
   ```

### Performance Testing
```bash
# Create benchmark script
cat > run_benchmark.sh << 'EOF'
#!/bin/bash

echo "Running Merkle Proof Benchmark"
echo "=============================="

# Test different tree sizes
for size in 1024 16384 262144 1048576; do
    echo "Testing tree size: $size"
    ./merkle_bench --tree-size=$size --iterations=100
done

# Test different proof types
for type in generation verification batch; do
    echo "Testing $type performance"
    ./merkle_bench --test=$type
done
EOF

chmod +x run_benchmark.sh
```

## 🔧 IDE and Editor Setup

### VS Code Configuration
```json
// .vscode/settings.json
{
    "C_Cpp.default.includePath": [
        "${workspaceFolder}/src/**",
        "${workspaceFolder}/src/include/**"
    ],
    "C_Cpp.default.defines": [
        "RISCV=1",
        "OPTIMIZE_PERFORMANCE=1"
    ],
    "C_Cpp.default.compilerPath": "riscv64-unknown-elf-gcc",
    "C_Cpp.default.intelliSenseMode": "gcc-x64"
}
```

### Vim/Neovim Configuration
```vim
" .vimrc for RISC-V development
set path+=src/**,include/**
set wildmenu
set wildmode=longest:full,full

" RISC-V specific settings
autocmd FileType c setlocal makeprg=make\ -j4
autocmd FileType c nnoremap <F5> :make run<CR>
autocmd FileType c nnoremap <F6> :make test<CR>
autocmd FileType c nnoremap <F7> :make benchmark<CR>
```

## 📊 Performance Analysis Setup

### Profiling Configuration
```c
// src/utils/profiler.h
#ifndef PROFILER_H
#define PROFILER_H

#include <stdint.h>

typedef struct {
    const char* name;
    uint64_t start_cycles;
    uint64_t end_cycles;
    uint64_t total_cycles;
    uint32_t count;
} profile_entry_t;

void profiler_init(void);
void profiler_start(const char* name);
void profiler_end(const char* name);
void profiler_report(void);
uint64_t profiler_get_cycles(void);

#endif
```

### Benchmark Framework
```c
// src/tests/benchmark.c
#include <stdio.h>
#include <time.h>
#include "profiler.h"

typedef struct {
    const char* name;
    double time_ms;
    size_t operations;
    double ops_per_sec;
} benchmark_result_t;

void benchmark_merkle_proofs(size_t tree_size, size_t num_proofs);
void benchmark_verification(size_t tree_size, size_t num_verifications);
void print_benchmark_results(benchmark_result_t* results, size_t count);
```

## 🚨 Troubleshooting Guide

### Common Build Issues

**Toolchain Not Found:**
```bash
# Check PATH
echo $PATH
which riscv64-unknown-elf-gcc

# Reinstall if needed
export PATH="/opt/riscv/bin:$PATH"
```

**Compilation Errors:**
```bash
# Check RISC-V extensions support
riscv64-unknown-elf-gcc --print-multi-lib

# Use compatible flags
export RISCV_CFLAGS="-march=rv64gc -mtune=rocket -O2"
```

**Simulation Issues:**
```bash
# Test basic simulation
echo 'int main() { return 0; }' > test.c
riscv64-unknown-elf-gcc test.c -o test
spike test

# Check Spike installation
spike --help
```

### Performance Issues

**Slow Compilation:**
```bash
# Use parallel compilation
make -j$(nproc)

# Reduce optimization level for faster builds
export RISCV_CFLAGS="-march=rv64gc -O2"
```

**Memory Issues:**
```bash
# Monitor memory usage
watch -n 1 'free -h && ps aux --sort=-%mem | head -10'

# Adjust stack size
ulimit -s 65536
```

### Hardware Access Issues

**Connection Problems:**
```bash
# Test network connectivity
ping <tensorrent-ip>

# Check SSH configuration
ssh -v user@<tensorrent-ip>
```

**Performance Issues:**
```bash
# Check hardware specs
lscpu
free -h
df -h

# Monitor resource usage
top
htop
```

## 📚 Additional Resources

### RISC-V Resources
- [RISC-V ISA Specification](https://riscv.org/technical/specifications/)
- [RISC-V Assembly Programmer's Manual](https://github.com/riscv/riscv-asm-manual/blob/master/riscv-asm.md)
- [RISC-V GCC Documentation](https://gcc.gnu.org/onlinedocs/gcc/RISC-V-Options.html)

### Development Tools
- [Spike Simulator Documentation](https://github.com/riscv-software-src/riscv-isa-sim)
- [QEMU RISC-V Documentation](https://qemu.readthedocs.io/en/latest/target-riscv.html)
- [Unity Test Framework](https://github.com/ThrowTheSwitch/Unity)

### Optimization Resources
- [RISC-V Performance Optimization Guide](https://www.sifive.com/blog/2018/09/04/risc-v-performance-optimization/)
- [Cache Optimization Techniques](https://software.intel.com/content/www/us/en/develop/articles/optimization-techniques.html)

---

**Next Steps**: Once your environment is set up, start with the basic Merkle tree implementation following the TODO.md checklist. Remember to test frequently and optimize incrementally for the best performance results!

**Support**: If you encounter issues, check the troubleshooting section above or reach out through the hackathon community channels.
