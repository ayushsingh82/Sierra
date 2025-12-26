# Makefile for Challenge B - Merkle Proof RISC-V Implementation

.PHONY: all clean test benchmark sim native help

# Variables
CC = gcc
CFLAGS = -O3 -ffast-math -Wall -Wextra -std=c11
LDFLAGS = -lm -lpthread
BUILD_DIR = build
SRC_DIR = src

# Default target
all: native

# Native build (for testing on host)
native:
	@$(MAKE) BUILD_TYPE=native $(MAKECMDGOALS)

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

# Benchmark
benchmark: native
	$(BUILD_DIR)/native/merkle_bench

# Clean build artifacts
clean:
	rm -rf $(BUILD_DIR)
	@echo "Cleaned build artifacts"

# Help
help:
	@echo "Available targets:"
	@echo "  all       - Build native version"
	@echo "  native    - Build for native x86_64 testing"
	@echo "  debug     - Build debug version"
	@echo "  release   - Build optimized release version"
	@echo "  test      - Build test version"
	@echo "  test-run  - Build and run tests"
	@echo "  benchmark - Run performance benchmarks"
	@echo "  clean     - Clean build artifacts"

# Source files
CORE_SOURCES = $(wildcard $(SRC_DIR)/core/*.c)
HASH_SOURCES = $(wildcard $(SRC_DIR)/hash/*.c)
SPI_SOURCES = $(wildcard $(SRC_DIR)/spi/*.c)
TEST_SOURCES = $(wildcard $(SRC_DIR)/tests/*.c)

# Header files
CORE_HEADERS = $(wildcard $(SRC_DIR)/core/*.h)
HASH_HEADERS = $(wildcard $(SRC_DIR)/hash/*.h)
SPI_HEADERS = $(wildcard $(SRC_DIR)/spi/*.h)

# Object files
CORE_OBJECTS = $(CORE_SOURCES:$(SRC_DIR)/%.c=$(BUILD_DIR)/%.o)
HASH_OBJECTS = $(HASH_SOURCES:$(SRC_DIR)/%.c=$(BUILD_DIR)/%.o)
SPI_OBJECTS = $(SPI_SOURCES:$(SRC_DIR)/%.c=$(BUILD_DIR)/%.o)
TEST_OBJECTS = $(TEST_SOURCES:$(SRC_DIR)/tests/%.c=$(BUILD_DIR)/%.o)

# Include directories
INCLUDES = -I$(SRC_DIR)/core -I$(SRC_DIR)/hash -I$(SRC_DIR)/spi

# Build type specific settings
ifeq ($(BUILD_TYPE),debug)
    CFLAGS += -g -DDEBUG -O0
    BUILD_SUBDIR = debug
else ifeq ($(BUILD_TYPE),test)
    CFLAGS += -DTEST $(INCLUDES) -Wall -Wextra
    BUILD_SUBDIR = test
else ifeq ($(BUILD_TYPE),native)
    CC = gcc
    CFLAGS = -march=native -O3 -ffast-math -Wall -Wextra -std=c11
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
	mkdir -p $(dir $(CORE_OBJECTS) $(HASH_OBJECTS) $(SPI_OBJECTS))

# Generic compilation rule
$(BUILD_DIR)/%.o: $(SRC_DIR)/%.c $(BUILD_PATH)
	@mkdir -p $(dir $@)
	$(CC) $(CFLAGS) $(INCLUDES) -c $< -o $@

$(BUILD_DIR)/tests/%.o: $(SRC_DIR)/tests/%.c $(BUILD_PATH)
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

# Quick test without dependencies
quick-test: native
	@echo "Running quick native test..."
	./$(BUILD_DIR)/native/merkle_test

# Benchmark with different sizes
benchmark-all: native
	@echo "Running comprehensive benchmarks..."
	@for size in 1024 16384 262144 1048576; do \
		echo "Testing tree size: $$size"; \
		$(BUILD_DIR)/native/merkle_bench --tree-size=$$size --iterations=10; \
	done

# Submit to hackathon (placeholder)
submit: native
	@echo "Preparing submission..."
	@mkdir -p submission
	@cp $(BUILD_DIR)/native/merkle_bench submission/
	@cp -r $(SRC_DIR) submission/src
	@cp README.md submission/
	@echo "Submission prepared in ./submission directory"
	@echo "Remember to upload to hackathon platform!"

# Installation targets (for future RISC-V cross-compilation)
install-deps:
	@echo "Note: For RISC-V compilation, install:"
	@echo "  - RISC-V GCC toolchain"
	@echo "  - Spike RISC-V simulator"
	@echo "  - QEMU RISC-V"

