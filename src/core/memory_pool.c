#include "merkle_tree.h"
#include <stdlib.h>
#include <string.h>
#include <assert.h>

// Memory pool implementation
memory_pool_t* memory_pool_create(size_t size) {
    memory_pool_t* pool = (memory_pool_t*)malloc(sizeof(memory_pool_t));
    if (!pool) return NULL;
    
    pool->pool = (uint8_t*)malloc(size);
    if (!pool->pool) {
        free(pool);
        return NULL;
    }
    
    pool->size = size;
    pool->used = 0;
    pool->next = NULL;
    
    return pool;
}

void memory_pool_destroy(memory_pool_t* pool) {
    if (!pool) return;
    
    if (pool->pool) {
        free(pool->pool);
    }
    
    if (pool->next) {
        memory_pool_destroy(pool->next);
    }
    
    free(pool);
}

void* memory_pool_alloc(memory_pool_t* pool, size_t size) {
    if (!pool) return NULL;
    
    // Align to 8-byte boundary
    size_t aligned_size = (size + 7) & ~7;
    
    if (pool->used + aligned_size > pool->size) {
        // Try to allocate from next pool
        if (pool->next) {
            return memory_pool_alloc(pool->next, size);
        }
        
        // Create new pool
        pool->next = memory_pool_create(pool->size);
        if (!pool->next) {
            return NULL;
        }
        
        return memory_pool_alloc(pool->next, size);
    }
    
    void* ptr = pool->pool + pool->used;
    pool->used += aligned_size;
    
    return ptr;
}

void memory_pool_reset(memory_pool_t* pool) {
    if (!pool) return;
    
    pool->used = 0;
    
    if (pool->next) {
        memory_pool_reset(pool->next);
    }
}

// Utility functions
uint8_t calculate_tree_depth(uint64_t num_leaves) {
    uint8_t depth = 0;
    uint64_t size = 1;
    
    while (size < num_leaves && depth < MAX_TREE_DEPTH) {
        size <<= 1;
        depth++;
    }
    
    return depth;
}

bool is_power_of_two(uint64_t num) {
    return (num & (num - 1)) == 0;
}

merkle_error_t validate_tree_parameters(uint64_t num_leaves, hash_type_t hash_type) {
    if (num_leaves == 0 || num_leaves > (1ULL << MAX_TREE_DEPTH)) {
        return MERKLE_ERROR_INVALID_SIZE;
    }
    
    if (!is_power_of_two(num_leaves)) {
        return MERKLE_ERROR_INVALID_SIZE;
    }
    
    if (hash_type >= HASH_CUSTOM) {
        return MERKLE_ERROR_INVALID_HASH_TYPE;
    }
    
    return MERKLE_SUCCESS;
}

// Performance monitoring implementation
static void performance_reset_internal(merkle_tree_t* tree) {
    if (!tree) return;
    
    // Reset performance counters (implement based on your performance monitoring needs)
    // This is a placeholder - you'll need to implement actual performance tracking
}

void merkle_performance_reset(merkle_tree_t* tree) {
    performance_reset_internal(tree);
}

merkle_performance_metrics_t merkle_performance_get_metrics(merkle_tree_t* tree) {
    merkle_performance_metrics_t metrics = {0};
    
    if (!tree) return metrics;
    
    // This is a placeholder implementation
    // You need to implement actual performance tracking
    metrics.construction_time_ns = 0;
    metrics.proof_generation_time_ns = 0;
    metrics.verification_time_ns = 0;
    metrics.peak_memory_usage = 0;
    metrics.cache_misses = 0;
    metrics.cache_hits = 0;
    
    return metrics;
}

