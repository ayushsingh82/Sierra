#ifndef MERKLE_TREE_H
#define MERKLE_TREE_H

#include <stdint.h>
#include <stdbool.h>
#include <stddef.h>

// Maximum tree depth (supports up to 2^32 leaves)
#define MAX_TREE_DEPTH 32

// Hash size for SHA-256
#define SHA256_HASH_SIZE 32

// Memory pool configuration
#define MEMORY_POOL_SIZE (1024 * 1024)  // 1MB pool

// Hash function types
typedef enum {
    HASH_SHA256,
    HASH_BLAKE2B,
    HASH_CUSTOM
} hash_type_t;

// Forward declarations
typedef struct merkle_node merkle_node_t;
typedef struct merkle_tree merkle_tree_t;
typedef struct merkle_proof merkle_proof_t;
typedef struct memory_pool memory_pool_t;

// Hash function interface
typedef void (*hash_func_t)(const uint8_t* data, size_t len, uint8_t* output);

// Memory pool for efficient allocation
struct memory_pool {
    uint8_t* pool;
    size_t size;
    size_t used;
    struct memory_pool* next;
};

// Merkle tree node structure
struct merkle_node {
    uint8_t hash[SHA256_HASH_SIZE];  // Hash value
    merkle_node_t* left;             // Left child
    merkle_node_t* right;            // Right child
    merkle_node_t* parent;           // Parent node
    bool is_leaf;                    // Is this a leaf node?
    uint64_t leaf_index;             // Index if leaf node
    uint8_t depth;                   // Depth in tree
};

// Merkle tree structure
struct merkle_tree {
    merkle_node_t* root;             // Root node
    uint64_t num_leaves;             // Number of leaf nodes
    uint8_t depth;                   // Tree depth
    hash_func_t hash_function;       // Hash function to use
    hash_type_t hash_type;           // Type of hash function
    memory_pool_t* node_pool;        // Memory pool for nodes
    uint8_t* leaf_data;              // Leaf data buffer
    size_t leaf_data_size;           // Size of each leaf
};

// Merkle proof structure
struct merkle_proof {
    uint8_t leaf_hash[SHA256_HASH_SIZE]; // Hash of the leaf
    uint64_t leaf_index;                 // Index of the leaf
    uint8_t* sibling_hashes;             // Array of sibling hashes
    uint64_t num_siblings;               // Number of sibling nodes
    uint8_t root_hash[SHA256_HASH_SIZE]; // Expected root hash
    uint64_t proof_size;                 // Total proof size in bytes
};

// Error codes
typedef enum {
    MERKLE_SUCCESS = 0,
    MERKLE_ERROR_INVALID_SIZE,
    MERKLE_ERROR_MEMORY_ALLOCATION,
    MERKLE_ERROR_INVALID_HASH_TYPE,
    MERKLE_ERROR_INVALID_TREE,
    MERKLE_ERROR_LEAF_OUT_OF_BOUNDS,
    MERKLE_ERROR_INVALID_PROOF
} merkle_error_t;

// Memory pool functions
memory_pool_t* memory_pool_create(size_t size);
void memory_pool_destroy(memory_pool_t* pool);
void* memory_pool_alloc(memory_pool_t* pool, size_t size);
void memory_pool_reset(memory_pool_t* pool);

// Merkle tree functions
merkle_tree_t* merkle_tree_create(uint64_t num_leaves, hash_type_t hash_type);
void merkle_tree_destroy(merkle_tree_t* tree);
merkle_error_t merkle_tree_build(merkle_tree_t* tree, const uint8_t* data, size_t data_size);
merkle_error_t merkle_tree_update_leaf(merkle_tree_t* tree, uint64_t leaf_index, const uint8_t* data);
merkle_error_t merkle_tree_get_root_hash(merkle_tree_t* tree, uint8_t* hash);

// Proof generation and verification
merkle_proof_t* merkle_proof_create(merkle_tree_t* tree, uint64_t leaf_index);
void merkle_proof_destroy(merkle_proof_t* proof);
merkle_error_t merkle_proof_serialize(merkle_proof_t* proof, uint8_t* buffer, size_t buffer_size);
merkle_error_t merkle_proof_deserialize(const uint8_t* buffer, size_t buffer_size, merkle_proof_t* proof);

// Verification functions
bool merkle_proof_verify(merkle_proof_t* proof, const uint8_t* leaf_data);
bool merkle_proof_verify_batch(merkle_proof_t** proofs, const uint8_t** leaf_data, size_t num_proofs);

// Utility functions
uint8_t calculate_tree_depth(uint64_t num_leaves);
bool is_power_of_two(uint64_t num);
merkle_error_t validate_tree_parameters(uint64_t num_leaves, hash_type_t hash_type);

// Performance monitoring
typedef struct {
    uint64_t construction_time_ns;
    uint64_t proof_generation_time_ns;
    uint64_t verification_time_ns;
    size_t peak_memory_usage;
    uint64_t cache_misses;
    uint64_t cache_hits;
} merkle_performance_metrics_t;

void merkle_performance_reset(merkle_tree_t* tree);
merkle_performance_metrics_t merkle_performance_get_metrics(merkle_tree_t* tree);

#endif // MERKLE_TREE_H

