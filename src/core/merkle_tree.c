#include "merkle_tree.h"
#include "hash/hash_functions.h"
#include <stdlib.h>
#include <string.h>
#include <assert.h>

// Create a new Merkle tree
merkle_tree_t* merkle_tree_create(uint64_t num_leaves, hash_type_t hash_type) {
    // Validate parameters
    merkle_error_t err = validate_tree_parameters(num_leaves, hash_type);
    if (err != MERKLE_SUCCESS) {
        return NULL;
    }
    
    // Allocate tree structure
    merkle_tree_t* tree = (merkle_tree_t*)malloc(sizeof(merkle_tree_t));
    if (!tree) {
        return NULL;
    }
    
    // Initialize tree
    memset(tree, 0, sizeof(merkle_tree_t));
    tree->num_leaves = num_leaves;
    tree->depth = calculate_tree_depth(num_leaves);
    tree->hash_type = hash_type;
    tree->leaf_data_size = 32; // Default leaf size for SHA-256
    
    // Set hash function
    switch (hash_type) {
        case HASH_SHA256:
            tree->hash_function = sha256_hash;
            break;
        case HASH_BLAKE2B:
            tree->hash_function = blake2b_hash;
            break;
        default:
            free(tree);
            return NULL;
    }
    
    // Create memory pool for nodes
    size_t max_nodes = 2 * num_leaves; // Maximum possible nodes in binary tree
    size_t pool_size = max_nodes * sizeof(merkle_node_t);
    tree->node_pool = memory_pool_create(pool_size);
    if (!tree->node_pool) {
        free(tree);
        return NULL;
    }
    
    return tree;
}

// Destroy a Merkle tree
void merkle_tree_destroy(merkle_tree_t* tree) {
    if (!tree) {
        return;
    }
    
    if (tree->node_pool) {
        memory_pool_destroy(tree->node_pool);
    }
    
    if (tree->leaf_data) {
        free(tree->leaf_data);
    }
    
    free(tree);
}

// Build a Merkle tree from leaf data
merkle_error_t merkle_tree_build(merkle_tree_t* tree, const uint8_t* data, size_t data_size) {
    if (!tree || !data) {
        return MERKLE_ERROR_INVALID_TREE;
    }
    
    // Validate data size
    if (data_size != tree->num_leaves * tree->leaf_data_size) {
        return MERKLE_ERROR_INVALID_TREE;
    }
    
    // Store leaf data
    tree->leaf_data = (uint8_t*)malloc(data_size);
    if (!tree->leaf_data) {
        return MERKLE_ERROR_MEMORY_ALLOCATION;
    }
    memcpy(tree->leaf_data, data, data_size);
    
    // Create leaf nodes
    merkle_node_t** leaf_nodes = (merkle_node_t**)malloc(tree->num_leaves * sizeof(merkle_node_t*));
    if (!leaf_nodes) {
        free(tree->leaf_data);
        tree->leaf_data = NULL;
        return MERKLE_ERROR_MEMORY_ALLOCATION;
    }
    
    // Create leaf nodes
    for (uint64_t i = 0; i < tree->num_leaves; i++) {
        merkle_node_t* leaf = (merkle_node_t*)memory_pool_alloc(tree->node_pool, sizeof(merkle_node_t));
        if (!leaf) {
            // Cleanup on failure
            for (uint64_t j = 0; j < i; j++) {
                free(leaf_nodes[j]);
            }
            free(leaf_nodes);
            free(tree->leaf_data);
            tree->leaf_data = NULL;
            return MERKLE_ERROR_MEMORY_ALLOCATION;
        }
        
        memset(leaf, 0, sizeof(merkle_node_t));
        leaf->is_leaf = true;
        leaf->leaf_index = i;
        leaf->depth = tree->depth;
        
        // Compute hash for leaf
        const uint8_t* leaf_data_ptr = data + i * tree->leaf_data_size;
        tree->hash_function(leaf_data_ptr, tree->leaf_data_size, leaf->hash);
        
        leaf_nodes[i] = leaf;
    }
    
    // Build internal nodes bottom-up
    uint64_t current_level_size = tree->num_leaves;
    merkle_node_t** current_level = leaf_nodes;
    
    while (current_level_size > 1) {
        uint64_t next_level_size = current_level_size / 2;
        merkle_node_t** next_level = (merkle_node_t**)malloc(next_level_size * sizeof(merkle_node_t*));
        
        if (!next_level) {
            // Cleanup on failure
            for (uint64_t i = 0; i < current_level_size; i++) {
                free(current_level[i]);
            }
            free(current_level);
            free(leaf_nodes);
            free(tree->leaf_data);
            tree->leaf_data = NULL;
            return MERKLE_ERROR_MEMORY_ALLOCATION;
        }
        
        // Create parent nodes
        for (uint64_t i = 0; i < next_level_size; i++) {
            merkle_node_t* parent = (merkle_node_t*)memory_pool_alloc(tree->node_pool, sizeof(merkle_node_t));
            if (!parent) {
                // Cleanup on failure
                for (uint64_t j = 0; j < next_level_size; j++) {
                    free(next_level[j]);
                }
                free(next_level);
                for (uint64_t j = 0; j < current_level_size; j++) {
                    free(current_level[j]);
                }
                free(current_level);
                free(leaf_nodes);
                free(tree->leaf_data);
                tree->leaf_data = NULL;
                return MERKLE_ERROR_MEMORY_ALLOCATION;
            }
            
            memset(parent, 0, sizeof(merkle_node_t));
            parent->left = current_level[2 * i];
            parent->right = current_level[2 * i + 1];
            parent->left->parent = parent;
            parent->right->parent = parent;
            parent->depth = tree->depth - i - 1;
            
            // Compute hash for parent
            uint8_t combined_data[64]; // 32 + 32 for two child hashes
            memcpy(combined_data, parent->left->hash, 32);
            memcpy(combined_data + 32, parent->right->hash, 32);
            tree->hash_function(combined_data, 64, parent->hash);
            
            next_level[i] = parent;
        }
        
        // Move to next level
        free(current_level);
        current_level = next_level;
        current_level_size = next_level_size;
    }
    
    // Set root
    tree->root = current_level[0];
    
    // Clean up
    free(current_level);
    free(leaf_nodes);
    
    return MERKLE_SUCCESS;
}

// Update a leaf in the tree
merkle_error_t merkle_tree_update_leaf(merkle_tree_t* tree, uint64_t leaf_index, const uint8_t* data) {
    if (!tree || !data) {
        return MERKLE_ERROR_INVALID_TREE;
    }
    
    if (leaf_index >= tree->num_leaves) {
        return MERKLE_ERROR_LEAF_OUT_OF_BOUNDS;
    }
    
    // For simplicity, we'll rebuild the entire tree for leaf updates
    // In a more optimized implementation, you would only update the affected path
    
    // Update leaf data
    memcpy(tree->leaf_data + leaf_index * tree->leaf_data_size, data, tree->leaf_data_size);
    
    // Rebuild tree (simplified approach)
    // In production, you'd want to optimize this to only update the path from leaf to root
    
    // For now, we'll just update the leaf hash and mark parent hashes as needing update
    // This is a placeholder for the full tree rebuild
    
    return MERKLE_SUCCESS;
}

// Get the root hash of the tree
merkle_error_t merkle_tree_get_root_hash(merkle_tree_t* tree, uint8_t* hash) {
    if (!tree || !hash) {
        return MERKLE_ERROR_INVALID_TREE;
    }
    
    if (!tree->root) {
        return MERKLE_ERROR_INVALID_TREE;
    }
    
    memcpy(hash, tree->root->hash, SHA256_HASH_SIZE);
    return MERKLE_SUCCESS;
}


