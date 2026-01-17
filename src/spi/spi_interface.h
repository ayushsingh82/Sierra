#ifndef SPI_INTERFACE_H
#define SPI_INTERFACE_H

#include <stdint.h>
#include <stdbool.h>
#include <stddef.h>

// SPI (Succinct Proof Interface) definitions
#define SPI_MAX_TREE_SIZE (1ULL << 24)  // 16M leaves maximum
#define SPI_MAX_BATCH_SIZE 1000         // Maximum batch operations
#define SPI_MAX_PROOF_SIZE 8192         // Maximum proof size in bytes

// SPI request/response structures
typedef enum {
    SPI_REQUEST_PROOF_GENERATION = 1,
    SPI_REQUEST_PROOF_VERIFICATION = 2,
    SPI_REQUEST_BATCH_GENERATION = 3,
    SPI_REQUEST_BATCH_VERIFICATION = 4,
    SPI_REQUEST_TREE_INFO = 5
} spi_request_type_t;

typedef enum {
    SPI_RESPONSE_SUCCESS = 0,
    SPI_RESPONSE_ERROR_INVALID_REQUEST = 1,
    SPI_RESPONSE_ERROR_INVALID_TREE = 2,
    SPI_RESPONSE_ERROR_OUT_OF_MEMORY = 3,
    SPI_RESPONSE_ERROR_INVALID_PROOF = 4,
    SPI_RESPONSE_ERROR_TIMEOUT = 5,
    SPI_RESPONSE_ERROR_NOT_IMPLEMENTED = 6
} spi_response_status_t;

// SPI request structure
typedef struct {
    uint32_t request_id;                    // Unique request identifier
    spi_request_type_t request_type;        // Type of request
    uint64_t tree_id;                       // Tree identifier
    uint64_t leaf_index;                    // Leaf index (for single operations)
    uint64_t batch_size;                    // Number of operations in batch
    uint64_t leaf_indices[SPI_MAX_BATCH_SIZE]; // Leaf indices for batch operations
    uint8_t* leaf_data;                     // Leaf data (if provided)
    uint64_t leaf_data_size;                // Size of leaf data
    uint32_t timeout_ms;                    // Request timeout in milliseconds
    uint8_t reserved[32];                   // Reserved for future use
} spi_request_t;

// SPI response structure
typedef struct {
    uint32_t request_id;                    // Corresponding request identifier
    spi_response_status_t status;           // Response status
    uint64_t processing_time_ns;            // Processing time in nanoseconds
    uint64_t memory_used;                   // Memory used in bytes
    uint64_t proof_size;                    // Size of proof data
    uint8_t* proof_data;                    // Proof data (if applicable)
    uint64_t verification_result;           // Verification result (boolean as 0/1)
    uint64_t batch_results[SPI_MAX_BATCH_SIZE]; // Batch operation results
    uint8_t reserved[32];                   // Reserved for future use
} spi_response_t;

// SPI context structure
typedef struct {
    uint64_t max_tree_size;                 // Maximum supported tree size
    uint64_t supported_hash_types;          // Bitmask of supported hash types
    uint64_t performance_score;             // Current performance score
    uint32_t max_concurrent_requests;       // Maximum concurrent requests
    uint64_t total_requests_processed;      // Total requests processed
    uint64_t total_proofs_generated;        // Total proofs generated
    uint64_t total_proofs_verified;         // Total proofs verified
    uint8_t version_major;                  // SPI interface version
    uint8_t version_minor;                  // SPI interface version
    uint8_t version_patch;                  // SPI interface version
    uint8_t reserved[30];                   // Reserved for future use
} spi_context_t;

// SPI interface functions
spi_context_t* spi_init(uint64_t max_tree_size);
void spi_shutdown(spi_context_t* ctx);
spi_response_t* spi_process_request(spi_context_t* ctx, spi_request_t* request);
void spi_free_response(spi_response_t* response);

// High-level API functions
typedef struct {
    uint64_t tree_id;
    uint64_t num_leaves;
    uint64_t depth;
    uint8_t hash_type;
    uint8_t reserved[32];
} spi_tree_info_t;

typedef struct {
    uint64_t generation_time_ns;
    uint64_t verification_time_ns;
    uint64_t memory_usage_mb;
    double cache_hit_rate;
    uint64_t throughput_proofs_per_sec;
} spi_performance_metrics_t;

// Tree management
spi_tree_info_t* spi_create_tree(spi_context_t* ctx, uint64_t num_leaves, uint8_t hash_type);
bool spi_destroy_tree(spi_context_t* ctx, uint64_t tree_id);
bool spi_update_tree_data(spi_context_t* ctx, uint64_t tree_id, const uint8_t* data, uint64_t size);

// Proof operations
bool spi_generate_proof(spi_context_t* ctx, uint64_t tree_id, uint64_t leaf_index, 
                       uint8_t* proof_data, uint64_t* proof_size);
bool spi_verify_proof(spi_context_t* ctx, uint64_t tree_id, uint64_t leaf_index,
                     const uint8_t* proof_data, uint64_t proof_size, bool* result);

// Batch operations
bool spi_generate_proofs_batch(spi_context_t* ctx, uint64_t tree_id,
                              uint64_t* leaf_indices, uint64_t num_indices,
                              uint8_t* proofs_data, uint64_t* total_proof_size);
bool spi_verify_proofs_batch(spi_context_t* ctx, uint64_t tree_id,
                            uint64_t* leaf_indices, uint8_t* proofs_data,
                            uint64_t* proof_sizes, uint64_t num_proofs,
                            bool* results);

// Performance monitoring
spi_performance_metrics_t spi_get_performance_metrics(spi_context_t* ctx);
void spi_reset_performance_metrics(spi_context_t* ctx);

// JSON-RPC interface (for web API)
const char* spi_jsonrpc_process_request(const char* json_request);

// gRPC service functions (for high-performance communication)
bool spi_grpc_server_start(uint16_t port);
void spi_grpc_server_stop(void);
bool spi_grpc_process_batch(spi_request_t* requests, spi_response_t* responses, uint64_t count);

// Utility functions
uint32_t spi_calculate_performance_score(const spi_performance_metrics_t* metrics);
bool spi_validate_request(const spi_request_t* request);
void spi_log_request(const spi_request_t* request, const spi_response_t* response);

// Error handling
const char* spi_error_string(spi_response_status_t status);
void spi_set_error_callback(void (*error_callback)(const char* error_msg));

#endif // SPI_INTERFACE_H

