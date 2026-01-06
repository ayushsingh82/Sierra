"use client";

import { useState } from "react";

interface FileInfo {
  name: string;
  path: string;
  content: string;
  category: string;
}

const sourceFiles: FileInfo[] = [
  // Core
  {
    name: "merkle_tree.c",
    path: "src/core/merkle_tree.c",
    category: "core",
    content: `#include "merkle_tree.h"
#include "memory_pool.h"
#include <stdlib.h>
#include <string.h>

merkle_tree_t* merkle_tree_create(uint64_t num_leaves, hash_func_t hash_func) {
    merkle_tree_t* tree = malloc(sizeof(merkle_tree_t));
    if (!tree) return NULL;
    
    tree->num_leaves = num_leaves;
    tree->depth = 0;
    tree->hash_function = hash_func;
    tree->node_pool = memory_pool_create(num_leaves * 2);
    
    // Calculate tree depth
    uint64_t n = num_leaves;
    while (n > 1) {
        n = (n + 1) / 2;
        tree->depth++;
    }
    
    tree->root = NULL;
    return tree;
}

int merkle_tree_insert(merkle_tree_t* tree, uint8_t* data, uint64_t index) {
    if (!tree || !data) return -1;
    
    merkle_node_t* leaf = create_leaf_node(tree, data, index);
    if (!leaf) return -1;
    
    // Build tree bottom-up
    build_tree_levels(tree);
    
    return 0;
}

uint8_t* merkle_tree_get_root(merkle_tree_t* tree) {
    if (!tree || !tree->root) return NULL;
    return tree->root->hash;
}

void merkle_tree_destroy(merkle_tree_t* tree) {
    if (!tree) return;
    memory_pool_destroy(tree->node_pool);
    free(tree);
}`
  },
  {
    name: "merkle_tree.h",
    path: "src/core/merkle_tree.h",
    category: "core",
    content: `#ifndef MERKLE_TREE_H
#define MERKLE_TREE_H

#include <stdint.h>
#include <stdbool.h>
#include "hash_functions.h"

#define HASH_SIZE 32

typedef struct merkle_node {
    uint8_t hash[HASH_SIZE];
    struct merkle_node* left;
    struct merkle_node* right;
    struct merkle_node* parent;
    bool is_leaf;
    uint64_t leaf_index;
} merkle_node_t;

typedef struct merkle_tree {
    merkle_node_t* root;
    uint64_t num_leaves;
    uint64_t depth;
    hash_func_t hash_function;
    void* node_pool;
} merkle_tree_t;

merkle_tree_t* merkle_tree_create(uint64_t num_leaves, hash_func_t hash_func);
int merkle_tree_insert(merkle_tree_t* tree, uint8_t* data, uint64_t index);
uint8_t* merkle_tree_get_root(merkle_tree_t* tree);
void merkle_tree_destroy(merkle_tree_t* tree);

#endif`
  },
  {
    name: "proof_functions.c",
    path: "src/core/proof_functions.c",
    category: "core",
    content: `#include "merkle_tree.h"
#include <stdlib.h>

int generate_proof(merkle_tree_t* tree, uint64_t leaf_index, 
                   merkle_proof_t* proof) {
    if (!tree || !proof) return -1;
    
    // Find the leaf node
    merkle_node_t* leaf = find_leaf(tree, leaf_index);
    if (!leaf) return -1;
    
    // Collect sibling nodes
    proof->leaf_index = leaf_index;
    memcpy(proof->leaf_hash, leaf->hash, HASH_SIZE);
    
    // Traverse up to root collecting siblings
    merkle_node_t* current = leaf;
    uint64_t sibling_count = 0;
    
    while (current->parent) {
        merkle_node_t* sibling = get_sibling(current);
        if (sibling) {
            memcpy(proof->sibling_hashes[sibling_count], 
                   sibling->hash, HASH_SIZE);
            sibling_count++;
        }
        current = current->parent;
    }
    
    proof->num_siblings = sibling_count;
    memcpy(proof->root_hash, tree->root->hash, HASH_SIZE);
    
    return 0;
}

bool verify_proof(merkle_proof_t* proof, hash_func_t hash_func) {
    if (!proof) return false;
    
    uint8_t current_hash[HASH_SIZE];
    memcpy(current_hash, proof->leaf_hash, HASH_SIZE);
    
    // Compute hash up to root
    for (uint64_t i = 0; i < proof->num_siblings; i++) {
        uint8_t combined[64];
        memcpy(combined, current_hash, HASH_SIZE);
        memcpy(combined + HASH_SIZE, proof->sibling_hashes[i], HASH_SIZE);
        
        hash_func(combined, 64, current_hash);
    }
    
    return memcmp(current_hash, proof->root_hash, HASH_SIZE) == 0;
}`
  },
  {
    name: "memory_pool.c",
    path: "src/core/memory_pool.c",
    category: "core",
    content: `#include <stdlib.h>
#include <string.h>

typedef struct memory_pool {
    uint8_t* buffer;
    size_t total_size;
    size_t offset;
    size_t block_size;
} memory_pool_t;

memory_pool_t* memory_pool_create(size_t total_bytes) {
    memory_pool_t* pool = malloc(sizeof(memory_pool_t));
    if (!pool) return NULL;
    
    pool->buffer = calloc(1, total_bytes);
    if (!pool->buffer) {
        free(pool);
        return NULL;
    }
    
    pool->total_size = total_bytes;
    pool->offset = 0;
    pool->block_size = 0;
    
    return pool;
}

void* memory_pool_alloc(memory_pool_t* pool, size_t size) {
    if (!pool || pool->offset + size > pool->total_size) 
        return NULL;
    
    void* ptr = pool->buffer + pool->offset;
    pool->offset += size;
    return ptr;
}

void memory_pool_reset(memory_pool_t* pool) {
    if (pool) {
        memset(pool->buffer, 0, pool->offset);
        pool->offset = 0;
    }
}

void memory_pool_destroy(memory_pool_t* pool) {
    if (pool) {
        free(pool->buffer);
        free(pool);
    }
}`
  },
  // Hash
  {
    name: "sha256.c",
    path: "src/hash/sha256.c",
    category: "hash",
    content: `#include "hash_functions.h"
#include <string.h>

static const uint32_t k[64] = {
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5,
    0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    // ... more constants
};

void sha256_init(sha256_context* ctx) {
    ctx->h[0] = 0x6a09e667;
    ctx->h[1] = 0xbb67ae85;
    ctx->h[2] = 0x3c6ef372;
    ctx->h[3] = 0xa54ff53a;
    ctx->h[4] = 0x510e527f;
    ctx->h[5] = 0x9b05688c;
    ctx->h[6] = 0x1f83d9ab;
    ctx->h[7] = 0x5be0cd19;
    ctx->len = 0;
    ctx->tot_len = 0;
}

void sha256_update(sha256_context* ctx, const uint8_t* data, size_t len) {
    // Process input data
    uint32_t bitlen[2];
    bitlen[1] = len << 3;
    bitlen[0] = len >> 29;
    
    size_t block_len = 64 - (ctx->len % 64);
    size_t data_len = len < block_len ? len : block_len;
    
    memcpy(ctx->m + (ctx->len % 64), data, data_len);
    ctx->len += data_len;
    
    if (ctx->len % 64 >= 56) {
        sha256_transform(ctx);
        memset(ctx->m, 0, 56);
        memcpy(ctx->m + 56, bitlen, 8);
        sha256_transform(ctx);
    }
    
    ctx->tot_len += len;
}

void sha256_final(sha256_context* ctx, uint8_t* hash) {
    uint32_t bitlen[2];
    bitlen[1] = ctx->tot_len << 3;
    bitlen[0] = ctx->tot_len >> 29;
    
    size_t pad_len = 56 - (ctx->len % 64);
    if (pad_len < 56) pad_len += 64;
    
    uint8_t msg[64];
    memset(msg, 0, pad_len);
    msg[0] = 0x80;
    memcpy(msg + pad_len - 8, bitlen, 8);
    
    sha256_update(ctx, msg, pad_len);
    
    for (int i = 0; i < 8; i++)
        ((uint32_t*)hash)[i] = ctx->h[i];
}

void sha256_compute(const uint8_t* data, size_t len, uint8_t* hash) {
    sha256_context ctx;
    sha256_init(&ctx);
    sha256_update(&ctx, data, len);
    sha256_final(&ctx, hash);
}`
  },
  {
    name: "hash_functions.h",
    path: "src/hash/hash_functions.h",
    category: "hash",
    content: `#ifndef HASH_FUNCTIONS_H
#define HASH_FUNCTIONS_H

#include <stdint.h>
#include <stddef.h>

#define HASH_SIZE 32

typedef void (*hash_func_t)(const uint8_t*, size_t, uint8_t*);

// SHA-256
typedef struct sha256_context {
    uint32_t h[8];
    uint8_t m[64];
    uint64_t len;
    uint64_t tot_len;
} sha256_context_t;

void sha256_init(sha256_context_t* ctx);
void sha256_update(sha256_context_t* ctx, const uint8_t* data, size_t len);
void sha256_final(sha256_context_t* ctx, uint8_t* hash);
void sha256_compute(const uint8_t* data, size_t len, uint8_t* hash);

// Blake2b
void blake2b_compute(const uint8_t* data, size_t len, uint8_t* hash);

// Generic interface
void hash_init(void** ctx);
void hash_update(void* ctx, const uint8_t* data, size_t len);
void hash_final(void* ctx, uint8_t* hash);
void hash_destroy(void* ctx);

#endif`
  },
  // SPI
  {
    name: "spi_interface.c",
    path: "src/spi/spi_interface.c",
    category: "spi",
    content: `#include "spi_interface.h"
#include "merkle_tree.h"
#include <stdlib.h>

int spi_submit_proof_request(spi_context_t* ctx, 
                             spi_proof_request_t* request) {
    if (!ctx || !request) return -1;
    
    // Validate request
    if (request->leaf_index >= ctx->tree->num_leaves)
        return -1;
    
    // Queue request for processing
    request_queue_push(ctx->request_queue, request);
    
    return 0;
}

int spi_get_proof(spi_context_t* ctx, uint64_t tree_id, 
                  uint64_t leaf_index, spi_proof_response_t* response) {
    if (!ctx || !response) return -1;
    
    merkle_tree_t* tree = get_tree(ctx, tree_id);
    if (!tree) return -1;
    
    // Generate proof
    merkle_proof_t proof;
    int result = generate_proof(tree, leaf_index, &proof);
    
    if (result == 0) {
        response->success = true;
        response->proof_data = &proof;
    } else {
        response->success = false;
    }
    
    return result;
}

int spi_verify_proof(spi_context_t* ctx, spi_proof_t* proof) {
    if (!ctx || !proof) return -1;
    
    bool valid = verify_proof(&proof->proof, ctx->hash_func);
    return valid ? 0 : -1;
}`
  },
  {
    name: "spi_interface.h",
    path: "src/spi/spi_interface.h",
    category: "spi",
    content: `#ifndef SPI_INTERFACE_H
#define SPI_INTERFACE_H

#include <stdint.h>
#include <stdbool.h>
#include "hash_functions.h"

#define MAX_TREES 16
#define MAX_PROOF_SIZE 1024

typedef struct spi_context {
    void* trees[MAX_TREES];
    hash_func_t hash_func;
    void* request_queue;
    void* response_queue;
} spi_context_t;

typedef struct spi_proof_request {
    uint64_t tree_id;
    uint64_t leaf_index;
    uint8_t* data;
    size_t data_len;
} spi_proof_request_t;

typedef struct spi_proof_response {
    bool success;
    void* proof_data;
    uint64_t proof_size;
} spi_proof_response_t;

typedef struct spi_proof {
    uint64_t leaf_index;
    uint8_t root_hash[HASH_SIZE];
    uint8_t sibling_hashes[64][HASH_SIZE];
    uint64_t num_siblings;
    merkle_proof_t proof;
} spi_proof_t;

// Context management
spi_context_t* spi_create_context(hash_func_t hash_func);
void spi_destroy_context(spi_context_t* ctx);

// Tree management
int spi_create_tree(spi_context_t* ctx, uint64_t tree_id, uint64_t num_leaves);
int spi_destroy_tree(spi_context_t* ctx, uint64_t tree_id);

// Proof operations
int spi_submit_proof_request(spi_context_t* ctx, spi_proof_request_t* request);
int spi_get_proof(spi_context_t* ctx, uint64_t tree_id, uint64_t leaf_index, 
                  spi_proof_response_t* response);
int spi_verify_proof(spi_context_t* ctx, spi_proof_t* proof);

// Batch operations
int spi_batch_process(spi_context_t* ctx, spi_proof_request_t* requests, 
                      uint64_t count);

#endif`
  },
  {
    name: "main_bench.c",
    path: "src/spi/main_bench.c",
    category: "spi",
    content: `#include <stdio.h>
#include <stdlib.h>
#include <time.h>
#include "merkle_tree.h"
#include "hash_functions.h"

#define NUM_LEAVES 1000000
#define NUM_ITERATIONS 100

double get_time_ms() {
    struct timespec ts;
    clock_gettime(CLOCK_MONOTONIC, &ts);
    return ts.tv_sec * 1000.0 + ts.tv_nsec / 1000000.0;
}

int main() {
    printf("Sierra Performance Benchmark\\n");
    printf("==============================\\n\\n");
    
    // Create tree
    printf("Creating Merkle tree with %d leaves...\\n", NUM_LEAVES);
    double start = get_time_ms();
    merkle_tree_t* tree = merkle_tree_create(NUM_LEAVES, sha256_compute);
    double create_time = get_time_ms() - start;
    printf("Tree creation time: %.2f ms\\n", create_time);
    
    // Benchmark proof generation
    printf("\\nProof Generation Benchmarks:\\n");
    double total_proof_time = 0;
    
    for (int i = 0; i < NUM_ITERATIONS; i++) {
        uint64_t random_index = rand() % NUM_LEAVES;
        
        start = get_time_ms();
        merkle_proof_t proof;
        generate_proof(tree, random_index, &proof);
        double proof_time = get_time_ms() - start;
        
        total_proof_time += proof_time;
    }
    
    double avg_proof_time = total_proof_time / NUM_ITERATIONS;
    printf("Average proof generation: %.2f ms\\n", avg_proof_time);
    printf("Proofs per second: %.0f\\n", 1000.0 / avg_proof_time);
    
    // Benchmark verification
    printf("\\nProof Verification Benchmarks:\\n");
    double total_verify_time = 0;
    
    for (int i = 0; i < NUM_ITERATIONS; i++) {
        uint64_t random_index = rand() % NUM_LEAVES;
        
        merkle_proof_t proof;
        generate_proof(tree, random_index, &proof);
        
        start = get_time_ms();
        bool valid = verify_proof(&proof, sha256_compute);
        double verify_time = get_time_ms() - start;
        
        total_verify_time += verify_time;
    }
    
    double avg_verify_time = total_verify_time / NUM_ITERATIONS;
    printf("Average verification time: %.2f ms\\n", avg_verify_time);
    printf("Verifications per second: %.0f\\n", 1000.0 / avg_verify_time);
    
    // Cleanup
    merkle_tree_destroy(tree);
    
    printf("\\nBenchmark complete.\\n");
    return 0;
}`
  },
  {
    name: "main_test.c",
    path: "src/main_test.c",
    category: "tests",
    content: `#include <stdio.h>
#include <assert.h>
#include "merkle_tree.h"
#include "hash_functions.h"

void test_merkle_tree_creation() {
    printf("Testing Merkle tree creation...\\n");
    
    merkle_tree_t* tree = merkle_tree_create(8, sha256_compute);
    assert(tree != NULL);
    assert(tree->depth == 3);
    assert(tree->num_leaves == 8);
    
    printf("  ✓ Tree creation passed\\n");
    merkle_tree_destroy(tree);
}

void test_proof_generation() {
    printf("Testing proof generation...\\n");
    
    merkle_tree_t* tree = merkle_tree_create(4, sha256_compute);
    
    // Insert test data
    uint8_t data1[] = {0x01, 0x02, 0x03, 0x04};
    uint8_t data2[] = {0x05, 0x06, 0x07, 0x08};
    
    merkle_tree_insert(tree, data1, 0);
    merkle_tree_insert(tree, data2, 1);
    
    // Generate proof for leaf 0
    merkle_proof_t proof;
    int result = generate_proof(tree, 0, &proof);
    assert(result == 0);
    
    printf("  ✓ Proof generation passed\\n");
    merkle_tree_destroy(tree);
}

void test_proof_verification() {
    printf("Testing proof verification...\\n");
    
    merkle_tree_t* tree = merkle_tree_create(4, sha256_compute);
    
    uint8_t data[] = {0xaa, 0xbb, 0xcc, 0xdd};
    merkle_tree_insert(tree, data, 0);
    
    merkle_proof_t proof;
    generate_proof(tree, 0, &proof);
    
    bool valid = verify_proof(&proof, sha256_compute);
    assert(valid == true);
    
    printf("  ✓ Proof verification passed\\n");
    merkle_tree_destroy(tree);
}

void test_empty_tree() {
    printf("Testing edge cases...\\n");
    
    merkle_tree_t* tree = merkle_tree_create(1, sha256_compute);
    assert(tree != NULL);
    
    uint8_t data[] = {0x01};
    merkle_tree_insert(tree, data, 0);
    
    uint8_t* root = merkle_tree_get_root(tree);
    assert(root != NULL);
    
    printf("  ✓ Edge cases passed\\n");
    merkle_tree_destroy(tree);
}

int main() {
    printf("\\n=== Sierra Test Suite ===\\n\\n");
    
    test_merkle_tree_creation();
    test_proof_generation();
    test_proof_verification();
    test_empty_tree();
    
    printf("\\n✓ All tests passed!\\n\\n");
    return 0;
}`
  },
  {
    name: "Makefile",
    path: "Makefile",
    category: "build",
    content: `CC = gcc
CFLAGS = -O3 -march=native -Wall -Wextra
LDFLAGS = -lm

SRC = src/core/merkle_tree.c src/core/proof_functions.c \
      src/core/memory_pool.c src/hash/sha256.c \
      src/spi/spi_interface.c src/spi/main_bench.c src/main_test.c

OBJ = $(SRC:.c=.o)

TARGET = sierra
BENCH = benchmark
TEST = test

all: $(TARGET)

$(TARGET): $(OBJ)
	$(CC) $(CFLAGS) -o $@ $^ $(LDFLAGS)

$(BENCH): $(OBJ)
	$(CC) $(CFLAGS) -o $@ src/spi/main_bench.c $(OBJ) $(LDFLAGS)

$(TEST): $(OBJ)
	$(CC) $(CFLAGS) -o $@ src/main_test.c $(OBJ) $(LDFLAGS)

%.o: src/%.c
	$(CC) $(CFLAGS) -c -o $@ $<

clean:
	rm -f $(OBJ) $(TARGET) $(BENCH) $(TEST)

.PHONY: all clean benchmark test`
  },
];

const categoryLabels: Record<string, { label: string; color: string }> = {
  core: { label: "Core", color: "bg-zinc-800 text-white" },
  hash: { label: "Hash", color: "bg-zinc-700 text-zinc-300" },
  spi: { label: "SPI", color: "bg-zinc-600 text-zinc-200" },
  tests: { label: "Tests", color: "bg-zinc-500 text-white" },
  build: { label: "Build", color: "bg-zinc-400 text-black" },
};

function highlightCode(code: string): string {
  let highlighted = code
    .replace(/&/g, "&amp;")
    .replace(/</g, "<")
    .replace(/>/g, ">");

  // Strings
  highlighted = highlighted.replace(/"[^"]*"/g, '<span class="text-zinc-400">$&</span>');
  highlighted = highlighted.replace(/'[^']*'/g, '<span class="text-zinc-400">$&</span>');

  // Keywords
  const keywords = ["auto", "break", "case", "char", "const", "continue", "default", "do", "double", "else", "enum", "extern", "float", "for", "goto", "if", "int", "long", "register", "return", "short", "signed", "sizeof", "static", "struct", "switch", "typedef", "union", "unsigned", "void", "volatile", "while", "define", "include", "ifdef", "ifndef", "endif", "pragma", "true", "false", "NULL", "sizeof"];
  keywords.forEach((kw) => {
    const regex = new RegExp(`\\b${kw}\\b`, "g");
    highlighted = highlighted.replace(regex, `<span class="text-white font-medium">${kw}</span>`);
  });

  // Types
  const types = ["uint8_t", "uint16_t", "uint32_t", "uint64_t", "int8_t", "int16_t", "int32_t", "int64_t", "size_t", "bool"];
  types.forEach((type) => {
    const regex = new RegExp(`\\b${type}\\b`, "g");
    highlighted = highlighted.replace(regex, `<span class="text-zinc-300">${type}</span>`);
  });

  // Preprocessor
  highlighted = highlighted.replace(/#\w+/g, '<span class="text-zinc-500">$&</span>');

  // Comments
  highlighted = highlighted.replace(/\/\/.*$/gm, '<span class="text-zinc-600">$&</span>');
  highlighted = highlighted.replace(/\/\*[\s\S]*?\*\//g, '<span class="text-zinc-600">$&</span>');

  // Numbers
  highlighted = highlighted.replace(/\b(\d+\.?\d*)\b/g, '<span class="text-zinc-400">$1</span>');

  return highlighted;
}

export default function CodePage() {
  const [selectedFile, setSelectedFile] = useState<FileInfo | null>(null);
  const [filter, setFilter] = useState("all");

  const filteredFiles = filter === "all"
    ? sourceFiles
    : sourceFiles.filter((f) => f.category === filter);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="py-20 border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center animate-fadeIn">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              <span className="text-white">Source</span>{" "}
              <span className="gradient-text">Code</span>
            </h1>
            <p className="max-w-2xl mx-auto text-lg text-zinc-400">
              Browse and explore the C source code for Sierra
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row min-h-[calc(100vh-16rem)]">
        {/* File List Sidebar */}
        <div className="w-full lg:w-80 border-r border-zinc-800 bg-zinc-900/30">
          {/* Filter Tabs */}
          <div className="p-4 border-b border-zinc-800">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilter("all")}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  filter === "all" ? "bg-white text-black" : "bg-zinc-800 text-zinc-400 hover:text-white"
                }`}
              >
                All
              </button>
              {Object.entries(categoryLabels).map(([key, { label }]) => (
                <button
                  key={key}
                  onClick={() => setFilter(key)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    filter === key ? "bg-white text-black" : "bg-zinc-800 text-zinc-400 hover:text-white"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* File List */}
          <div className="overflow-y-auto max-h-[600px]">
            {filteredFiles.map((file) => (
              <button
                key={file.path}
                onClick={() => setSelectedFile(file)}
                className={`w-full px-4 py-3 text-left border-b border-zinc-800/50 transition-colors ${
                  selectedFile?.path === file.path
                    ? "bg-zinc-800 border-l-2 border-l-white"
                    : "hover:bg-zinc-800/50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-sm font-medium ${selectedFile?.path === file.path ? "text-white" : "text-zinc-300"}`}>
                    {file.name}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-xs ${categoryLabels[file.category]?.color || "bg-zinc-700 text-zinc-300"}`}>
                    {categoryLabels[file.category]?.label}
                  </span>
                </div>
                <div className="text-xs text-zinc-500 mt-1">{file.path}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Code Viewer */}
        <div className="flex-1 flex flex-col">
          {selectedFile ? (
            <>
              {/* File Header */}
              <div className="flex items-center justify-between p-4 border-b border-zinc-800 bg-zinc-900/30">
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <div>
                    <div className="text-white font-medium">{selectedFile.name}</div>
                    <div className="text-xs text-zinc-500">{selectedFile.path}</div>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded text-xs ${categoryLabels[selectedFile.category]?.color || "bg-zinc-700 text-zinc-300"}`}>
                  {categoryLabels[selectedFile.category]?.label}
                </span>
              </div>

              {/* Code Content */}
              <div className="flex-1 overflow-auto">
                <div className="code-block">
                  <div className="flex">
                    {/* Line Numbers */}
                    <div className="flex-shrink-0 w-12 py-4 text-right pr-3 bg-zinc-900/50 border-r border-zinc-800">
                      {selectedFile.content.split("\n").map((_, i) => (
                        <div key={i} className="text-xs text-zinc-600 font-mono leading-6">
                          {i + 1}
                        </div>
                      ))}
                    </div>
                    {/* Code */}
                    <pre className="flex-1 py-4 pl-2 overflow-x-auto">
                      <code
                        className="text-sm text-zinc-300 font-mono leading-6"
                        dangerouslySetInnerHTML={{
                          __html: highlightCode(selectedFile.content),
                        }}
                      />
                    </pre>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <svg className="w-16 h-16 text-zinc-700 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="text-lg font-medium text-white mb-2">No File Selected</h3>
                <p className="text-zinc-400">Select a file from the sidebar to view its contents</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <section className="py-12 border-t border-zinc-800 bg-zinc-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{sourceFiles.filter(f => f.category === "core").length}</div>
              <div className="text-sm text-zinc-400">Core Files</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-zinc-300">{sourceFiles.filter(f => f.category === "hash").length}</div>
              <div className="text-sm text-zinc-400">Hash Files</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-zinc-400">{sourceFiles.filter(f => f.category === "spi").length}</div>
              <div className="text-sm text-zinc-400">SPI Files</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-zinc-500">{sourceFiles.filter(f => f.category === "tests").length}</div>
              <div className="text-sm text-zinc-400">Test Files</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{sourceFiles.length}</div>
              <div className="text-sm text-zinc-400">Total Files</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

