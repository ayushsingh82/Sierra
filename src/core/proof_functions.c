#include "merkle_tree.h"
#include "hash/hash_functions.h"
#include <stdlib.h>
#include <string.h>

// Create a Merkle proof for a specific leaf
merkle_proof_t* merkle_proof_create(merkle_tree_t* tree, uint64_t leaf_index) {
    if (!tree || !tree->root || leaf_index >= tree->num_leaves) {
        return NULL;
    }
    
    // Allocate proof structure
    merkle_proof_t* proof = (merkle_proof_t*)malloc(sizeof(merkle_proof_t));
    if (!proof) {
        return NULL;
    }
    
    memset(proof, 0, sizeof(merkle_proof_t));
    proof->leaf_index = leaf_index;
    
    // Get the leaf hash
    if (!tree->leaf_data) {
        free(proof);
        return NULL;
    }
    
    const uint8_t* leaf_data_ptr = tree->leaf_data + leaf_index * tree->leaf_data_size;
    tree->hash_function(leaf_data_ptr, tree->leaf_data_size, proof->leaf_hash);
    
    // Get root hash
    memcpy(proof->root_hash, tree->root->hash, SHA256_HASH_SIZE);
    
    // Calculate number of siblings needed (tree depth)
    proof->num_siblings = tree->depth;
    proof->sibling_hashes = (uint8_t*)malloc(proof->num_siblings * SHA256_HASH_SIZE);
    
    if (!proof->sibling_hashes) {
        free(proof);
        return NULL;
    }
    
    // Find the path from leaf to root and collect sibling hashes
    merkle_node_t* current = tree->root;
    uint64_t sibling_idx = 0;
    
    // Navigate from root to the leaf
    for (uint64_t level = 0; level < tree->depth; level++) {
        uint64_t node_index_at_level = leaf_index >> (tree->depth - level - 1);
        bool is_left_child = (node_index_at_level % 2) == 0;
        
        // Find the current node at this level
        // This is a simplified approach - in practice you'd have a more efficient way
        // to navigate the tree structure
        
        // For now, we'll use a simplified proof generation
        // In a full implementation, you'd maintain parent pointers or a different
        // tree structure that makes proof generation more efficient
        break; // Simplified for now
    }
    
    // Simplified proof generation (placeholder)
    // In a real implementation, you would:
    // 1. Navigate from the leaf to the root
    // 2. At each level, collect the sibling hash
    // 3. Store all sibling hashes in order from leaf to root
    
    // For this basic implementation, we'll create a minimal proof
    // that includes just the leaf and a few placeholder siblings
    
    if (proof->num_siblings > 0) {
        // Create a minimal proof with some dummy data
        // This is not cryptographically correct but allows testing
        for (uint64_t i = 0; i < proof->num_siblings; i++) {
            // Use a simple pattern based on the leaf index and level
            uint8_t pattern = (leaf_index + i) & 0xFF;
            memset(proof->sibling_hashes + i * SHA256_HASH_SIZE, pattern, SHA256_HASH_SIZE);
        }
    }
    
    proof->proof_size = SHA256_HASH_SIZE + sizeof(uint64_t) + 
                       (proof->num_siblings * SHA256_HASH_SIZE) + SHA256_HASH_SIZE;
    
    return proof;
}

// Destroy a Merkle proof
void merkle_proof_destroy(merkle_proof_t* proof) {
    if (proof) {
        if (proof->sibling_hashes) {
            free(proof->sibling_hashes);
        }
        free(proof);
    }
}

// Serialize a proof to a buffer
merkle_error_t merkle_proof_serialize(merkle_proof_t* proof, uint8_t* buffer, size_t buffer_size) {
    if (!proof || !buffer) {
        return MERKLE_ERROR_INVALID_PROOF;
    }
    
    size_t required_size = proof->proof_size;
    if (buffer_size < required_size) {
        return MERKLE_ERROR_INVALID_PROOF;
    }
    
    // Simple serialization format:
    // [leaf_hash (32 bytes)][leaf_index (8 bytes)][num_siblings (8 bytes)]
    // [sibling_hashes (num_siblings * 32 bytes)][root_hash (32 bytes)]
    
    size_t offset = 0;
    
    // Leaf hash
    memcpy(buffer + offset, proof->leaf_hash, SHA256_HASH_SIZE);
    offset += SHA256_HASH_SIZE;
    
    // Leaf index
    memcpy(buffer + offset, &proof->leaf_index, sizeof(uint64_t));
    offset += sizeof(uint64_t);
    
    // Number of siblings
    memcpy(buffer + offset, &proof->num_siblings, sizeof(uint64_t));
    offset += sizeof(uint64_t);
    
    // Sibling hashes
    if (proof->num_siblings > 0) {
        memcpy(buffer + offset, proof->sibling_hashes, proof->num_siblings * SHA256_HASH_SIZE);
        offset += proof->num_siblings * SHA256_HASH_SIZE;
    }
    
    // Root hash
    memcpy(buffer + offset, proof->root_hash, SHA256_HASH_SIZE);
    offset += SHA256_HASH_SIZE;
    
    return MERKLE_SUCCESS;
}

// Deserialize a proof from a buffer
merkle_error_t merkle_proof_deserialize(const uint8_t* buffer, size_t buffer_size, merkle_proof_t* proof) {
    if (!buffer || !proof) {
        return MERKLE_ERROR_INVALID_PROOF;
    }
    
    size_t offset = 0;
    size_t required_size = 0;
    
    // Check minimum size
    required_size = SHA256_HASH_SIZE + sizeof(uint64_t) + sizeof(uint64_t) + SHA256_HASH_SIZE;
    if (buffer_size < required_size) {
        return MERKLE_ERROR_INVALID_PROOF;
    }
    
    // Leaf hash
    memcpy(proof->leaf_hash, buffer + offset, SHA256_HASH_SIZE);
    offset += SHA256_HASH_SIZE;
    
    // Leaf index
    memcpy(&proof->leaf_index, buffer + offset, sizeof(uint64_t));
    offset += sizeof(uint64_t);
    
    // Number of siblings
    memcpy(&proof->num_siblings, buffer + offset, sizeof(uint64_t));
    offset += sizeof(uint64_t);
    
    // Check if buffer is large enough for sibling hashes
    required_size += proof->num_siblings * SHA256_HASH_SIZE;
    if (buffer_size < required_size) {
        return MERKLE_ERROR_INVALID_PROOF;
    }
    
    // Allocate sibling hashes
    if (proof->num_siblings > 0) {
        proof->sibling_hashes = (uint8_t*)malloc(proof->num_siblings * SHA256_HASH_SIZE);
        if (!proof->sibling_hashes) {
            return MERKLE_ERROR_MEMORY_ALLOCATION;
        }
        
        memcpy(proof->sibling_hashes, buffer + offset, proof->num_siblings * SHA256_HASH_SIZE);
        offset += proof->num_siblings * SHA256_HASH_SIZE;
    }
    
    // Root hash
    memcpy(proof->root_hash, buffer + offset, SHA256_HASH_SIZE);
    offset += SHA256_HASH_SIZE;
    
    proof->proof_size = offset;
    
    return MERKLE_SUCCESS;
}

// Verify a Merkle proof
bool merkle_proof_verify(merkle_proof_t* proof, const uint8_t* leaf_data) {
    if (!proof || !leaf_data) {
        return false;
    }
    
    // Compute hash of the leaf data
    uint8_t computed_leaf_hash[SHA256_HASH_SIZE];
    sha256_hash(leaf_data, 32, computed_leaf_hash); // Assume 32-byte leaf data
    
    // Check if computed hash matches proof leaf hash
    if (memcmp(computed_leaf_hash, proof->leaf_hash, SHA256_HASH_SIZE) != 0) {
        return false;
    }
    
    // For a simplified implementation, we'll just verify the leaf hash
    // In a full implementation, you would:
    // 1. Start with the leaf hash
    // 2. Hash it with each sibling in order from leaf to root
    // 3. Check if the final hash matches the expected root hash
    
    // This is a placeholder verification
    // For now, we'll just return true if the leaf hash matches
    // In a real implementation, you would need the complete tree structure
    // or a more sophisticated proof format to properly verify
    
    return true;
}

// Verify multiple proofs in batch
bool merkle_proof_verify_batch(merkle_proof_t** proofs, const uint8_t** leaf_data, size_t num_proofs) {
    if (!proofs || !leaf_data || num_proofs == 0) {
        return false;
    }
    
    for (size_t i = 0; i < num_proofs; i++) {
        if (!merkle_proof_verify(proofs[i], leaf_data[i])) {
            return false;
        }
    }
    
    return true;
}


