#ifndef HASH_FUNCTIONS_H
#define HASH_FUNCTIONS_H

#include <stddef.h>
#include <stdint.h>
#include <stdbool.h>
#include "../core/merkle_tree.h"

// Hash types - use definitions from merkle_tree.h

// SHA-256 definitions
#define SHA256_HASH_SIZE 32
#define SHA256_BLOCK_SIZE 64

typedef struct {
    uint32_t state[8];
    uint8_t buffer[64];
    size_t buffer_len;
    uint64_t bit_count;
} sha256_context_t;

// BLAKE2b definitions  
#define BLAKE2B_HASH_SIZE 32
#define BLAKE2B_BLOCK_SIZE 128

typedef struct {
    uint64_t state[8];
    uint8_t buffer[BLAKE2B_BLOCK_SIZE];
    size_t buffer_len;
    size_t out_len;
    uint64_t last_node;
    uint64_t last_node_index;
} blake2b_context_t;

// SHA-256 function declarations
void sha256_init(sha256_context_t* ctx);
void sha256_update(sha256_context_t* ctx, const uint8_t* data, size_t len);
void sha256_final(sha256_context_t* ctx, uint8_t* hash);
void sha256_hash(const uint8_t* data, size_t len, uint8_t* hash);

// BLAKE2b function declarations  
void blake2b_init(blake2b_context_t* ctx, size_t out_len);
void blake2b_update(blake2b_context_t* ctx, const uint8_t* data, size_t len);
void blake2b_final(blake2b_context_t* ctx, uint8_t* hash);

// Unified hash interface for merkle trees (always 32 bytes output)
void blake2b_hash(const uint8_t* data, size_t len, uint8_t* hash);
// RISC-V optimized versions
void blake2b_init_riscv(blake2b_context_t* ctx, size_t out_len);
void blake2b_update_riscv(blake2b_context_t* ctx, const uint8_t* data, size_t len);
void blake2b_final_riscv(blake2b_context_t* ctx, uint8_t* hash);
void blake2b_hash_riscv(const uint8_t* data, size_t len, uint8_t* hash);

// Hash algorithm interface
typedef void (*hash_init_func)(void* ctx);
typedef void (*hash_update_func)(void* ctx, const uint8_t* data, size_t len);
typedef void (*hash_final_func)(void* ctx, uint8_t* hash);
typedef void (*hash_direct_func)(const uint8_t* data, size_t len, uint8_t* hash);

typedef struct {
    hash_type_t type;
    size_t hash_size;
    hash_init_func init;
    hash_update_func update;
    hash_final_func final;
    hash_direct_func hash;
    size_t context_size;
} hash_algorithm_t;

// Hash registry
hash_algorithm_t* get_hash_algorithm(hash_type_t type);
hash_algorithm_t* get_riscv_optimized_hash(hash_type_t type);

// Hash utilities
void hash_concat(const uint8_t* left, const uint8_t* right, uint8_t* result, hash_type_t type);
bool hash_equals(const uint8_t* hash1, const uint8_t* hash2, hash_type_t type);
void hash_copy(const uint8_t* src, uint8_t* dst, hash_type_t type);

// Performance measurement
typedef struct {
    uint64_t total_cycles;
    uint64_t min_cycles;
    uint64_t max_cycles;
    uint64_t total_bytes;
    double avg_cycles_per_byte;
} hash_performance_t;

void hash_benchmark_init(hash_type_t type);
hash_performance_t hash_benchmark_run(const uint8_t* data, size_t len, size_t iterations);

// Test functions
bool sha256_test_vectors(void);
bool blake2b_test_vectors(void);
bool hash_test_all(void);

#endif // HASH_FUNCTIONS_H

