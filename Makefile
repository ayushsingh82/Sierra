# Makefile for Challenge B - Merkle Proof RISC-V Implementation

.PHONY: all clean test benchmark sim run debug help install-deps

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
	@if command -v spike >/dev/null 2>&1; then \
		spike $(BUILD_DIR)/release/merkle_bench; \
	else \
		echo "Spike simulator not found. Install RISC-V tools first."; \
	fi

# Benchmark
benchmark: release
	$(BUILD_DIR)/release/merkle_bench

# Native build (for testing on host)
native:
	@$(MAKE) BUILD_TYPE=native $(MAKECMDGOALS)

# Install dependencies
install-deps:
	@echo "Installing RISC-V toolchain dependencies..."
	@if command -v apt >/dev/null 2>&1; then \
		sudo apt update; \
		sudo apt install -y build-essential; \
	elif command -v brew >/dev/null 2>&1; then \
		brew install riscv-tools; \
	else \
		echo "Please install RISC-V toolchain manually from https://github.com/riscv/riscv-gnu-toolchain"; \
	fi

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
	@echo "  native    - Build for native x86_64 testing"
	@echo "  install-deps - Install RISC-V toolchain dependencies"
	@echo "  clean     - Clean build artifacts"

# Source files
CORE_SOURCES = $(wildcard $(SRC_DIR)/core/*.c)
HASH_SOURCES = $(wildcard $(SRC_DIR)/hash/*.c)
RISCV_SOURCES = $(wildcard $(SRC_DIR)/riscv/*.c)
SPI_SOURCES = $(wildcard $(SRC_DIR)/spi/*.c)

# Header files
CORE_HEADERS = $(wildcard $(SRC_DIR)/core/*.h)
HASH_HEADERS = $(wildcard $(SRC_DIR)/hash/*.h)
SPI_HEADERS = $(wildcard $(SRC_DIR)/spi/*.h)

# Object files
CORE_OBJECTS = $(CORE_SOURCES:$(SRC_DIR)/%.c=$(BUILD_DIR)/%.o)
HASH_OBJECTS = $(HASH_SOURCES:$(SRC_DIR)/%.c=$(BUILD_DIR)/%.o)
RISCV_OBJECTS = $(RISCV_SOURCES:$(SRC_DIR)/%.c=$(BUILD_DIR)/%.o)
SPI_OBJECTS = $(SPI_SOURCES:$(SRC_DIR)/%.c=$(BUILD_DIR)/%.o)

# Include directories
INCLUDES = -I$(SRC_DIR)/core -I$(SRC_DIR)/hash -I$(SRC_DIR)/spi

# Build type specific settings
ifeq ($(BUILD_TYPE),debug)
    CFLAGS += -g -DDEBUG -O0
    LDFLAGS += -g
    BUILD_SUBDIR = debug
else ifeq ($(BUILD_TYPE),test)
    CFLAGS += -DTEST $(INCLUDES) -Wall -Wextra
    LDFLAGS += -lm
    BUILD_SUBDIR = test
    # Add test-specific sources
    TEST_SOURCES = $(wildcard $(SRC_DIR)/tests/*.c)
    TEST_OBJECTS = $(TEST_SOURCES:$(SRC_DIR)/tests/%.c=$(BUILD_DIR)/%.o)
else ifeq ($(BUILD_TYPE),native)
    CC = gcc
    CFLAGS = -march=native -O3 -ffast-math -Wall -Wextra
    LDFLAGS = -lm -lpthread
    BUILD_SUBDIR = native
else
    BUILD_SUBDIR = release
endif

# Final build directory
BUILD_PATH = $(BUILD_DIR)/$(BUILD_SUBDIR)

# Create build directory
$(BUILD_PATH):
	mkdir -p $(BUILD_PATH)

# Generic compilation rule
$(BUILD_PATH)/%.o: $(SRC_DIR)/%.c $(BUILD_PATH)
	@mkdir -p $(dir $@)
	$(CC) $(CFLAGS) $(INCLUDES) -c $< -o $@

# Main programs
$(BUILD_PATH)/merkle_bench: $(BUILD_PATH)/main_bench.o $(CORE_OBJECTS) $(HASH_OBJECTS) $(SPI_OBJECTS) | $(BUILD_PATH)
	@mkdir -p $(dir $@)
	$(CC) $(CFLAGS) $^ -o $@ $(LDFLAGS)

$(BUILD_PATH)/merkle_test: $(BUILD_PATH)/main_test.o $(CORE_OBJECTS) $(HASH_OBJECTS) $(SPI_OBJECTS) | $(BUILD_PATH)
	@mkdir -p $(dir $@)
	$(CC) $(CFLAGS) $^ -o $@ $(LDFLAGS)

# Dependencies
$(BUILD_PATH)/main_bench.o: $(SRC_DIR)/main_bench.c $(CORE_HEADERS) $(HASH_HEADERS) $(SPI_HEADERS) | $(BUILD_PATH)
	$(CC) $(CFLAGS) $(INCLUDES) -c $(SRC_DIR)/main_bench.c -o $@

$(BUILD_PATH)/main_test.o: $(SRC_DIR)/main_test.c $(CORE_HEADERS) $(HASH_HEADERS) $(SPI_HEADERS) | $(BUILD_PATH)
	$(CC) $(CFLAGS) $(INCLUDES) -c $(SRC_DIR)/main_test.c -o $@

# Test-specific compilation
ifeq ($(BUILD_TYPE),test)
$(BUILD_PATH)/%.o: $(SRC_DIR)/tests/%.c | $(BUILD_PATH)
	$(CC) $(CFLAGS) $(INCLUDES) -c $< -o $@
endif

# Performance analysis targets
profile: release
	@echo "Running performance analysis..."
	@if command -v perf >/dev/null 2>&1; then \
		perf stat -d $(BUILD_PATH)/merkle_bench; \
	else \
		echo "perf not found. Install linux-tools-generic package."; \
	fi

valgrind: debug
	@echo "Running memory analysis..."
	@if command -v valgrind >/dev/null 2>&1; then \
		valgrind --tool=memcheck --leak-check=full $(BUILD_PATH)/merkle_test; \
	else \
		echo "valgrind not found. Install valgrind package."; \
	fi

# Quick test without RISC-V toolchain
quick-test: native
	@echo "Running quick native test..."
	./$(BUILD_DIR)/native/merkle_test

# Benchmark with different sizes
benchmark-all: release
	@echo "Running comprehensive benchmarks..."
	@for size in 1024 16384 262144 1048576; do \
		echo "Testing tree size: $$size"; \
		$(BUILD_PATH)/merkle_bench --tree-size=$$size --iterations=10; \
	done

# Submit to hackathon (placeholder)
submit: release
	@echo "Preparing submission..."
	@mkdir -p submission
	@cp $(BUILD_PATH)/merkle_bench submission/
	@cp -r $(SRC_DIR) submission/src
	@cp README.md submission/
	@echo "Submission prepared in ./submission directory"
	@echo "Remember to upload to hackathon platform!"

