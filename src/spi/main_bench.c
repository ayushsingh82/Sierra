#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <time.h>
#include <getopt.h>
#include "core/merkle_tree.h"
#include "hash/hash_functions.h"
#include "spi/spi_interface.h"

// Benchmark configuration
typedef struct {
    uint64_t tree_size;
    uint64_t num_iterations;
    bool test_verification;
    bool test_batch_operations;
    uint64_t batch_size;
} benchmark_config_t;

// Performance measurement utilities
static inline uint64_t get_time_ns(void) {
    struct timespec ts;
    clock_gettime(CLOCK_MONOTONIC, &ts);
    return (uint64_t)ts.tv_sec * 1000000000ULL + ts.tv_nsec;
}

// Benchmark functions
void benchmark_tree_creation(benchmark_config_t* config) {
    printf("=== Tree Creation Benchmark ===\n");
    
    for (uint64_t size = 1024; size <= config->tree_size; size *= 2) {
        uint64_t total_time = 0;
        uint64_t iterations = config->num_iterations;
        
        for (uint64_t i = 0; i < iterations; i++) {
            uint64_t start = get_time_ns();
            
            merkle_tree_t* tree = merkle_tree_create(size, HASH_SHA256);
            if (!tree) {
                printf("Failed to create tree of size %llu\n", (unsigned long long)size);
                continue;
            }
            
            uint64_t end = get_time_ns();
            total_time += (end - start);
            
            merkle_tree_destroy(tree);
        }
        
        double avg_time_ms = (double)total_time / iterations / 1000000.0;
        printf("Tree size: %8llu leaves | Avg creation time: %8.3f ms\n", 
               (unsigned long long)size, avg_time_ms);
    }
}

void benchmark_proof_generation(benchmark_config_t* config) {
    printf("=== Proof Generation Benchmark ===\n");
    
    // Create a tree for testing
    merkle_tree_t* tree = merkle_tree_create(config->tree_size, HASH_SHA256);
    if (!tree) {
        printf("Failed to create tree\n");
        return;
    }
    
    // Generate test data
    uint8_t* leaf_data = (uint8_t*)malloc(config->tree_size * 32);
    if (!leaf_data) {
        printf("Failed to allocate test data\n");
        merkle_tree_destroy(tree);
        return;
    }
    
    // Fill with random data
    srand(42);  // Fixed seed for reproducibility
    for (uint64_t i = 0; i < config->tree_size * 32; i++) {
        leaf_data[i] = rand() & 0xFF;
    }
    
    // Build tree
    uint64_t build_start = get_time_ns();
    merkle_error_t err = merkle_tree_build(tree, leaf_data, config->tree_size * 32);
    uint64_t build_end = get_time_ns();
    
    if (err != MERKLE_SUCCESS) {
        printf("Failed to build tree: %d\n", err);
        free(leaf_data);
        merkle_tree_destroy(tree);
        return;
    }
    
    double build_time_ms = (double)(build_end - build_start) / 1000000.0;
    printf("Tree build time: %.3f ms\n", build_time_ms);
    
    // Benchmark proof generation
    printf("Generating proofs for %llu iterations...\n", (unsigned long long)config->num_iterations);
    
    uint64_t total_proof_time = 0;
    for (uint64_t i = 0; i < config->num_iterations; i++) {
        uint64_t leaf_idx = rand() % config->tree_size;
        uint8_t* leaf_ptr = leaf_data + leaf_idx * 32;
        
        uint64_t start = get_time_ns();
        merkle_proof_t* proof = merkle_proof_create(tree, leaf_idx);
        uint64_t end = get_time_ns();
        
        if (proof) {
            total_proof_time += (end - start);
            merkle_proof_destroy(proof);
        }
    }
    
    double avg_proof_time_ms = (double)total_proof_time / config->num_iterations / 1000000.0;
    double proofs_per_sec = 1000.0 / avg_proof_time_ms;
    
    printf("Proof generation: avg %.3f ms | %.0f proofs/sec\n", 
           avg_proof_time_ms, proofs_per_sec);
    
    // Clean up
    free(leaf_data);
    merkle_tree_destroy(tree);
}

void benchmark_proof_verification(benchmark_config_t* config) {
    printf("=== Proof Verification Benchmark ===\n");
    
    // Create and build tree
    merkle_tree_t* tree = merkle_tree_create(config->tree_size, HASH_SHA256);
    if (!tree) {
        printf("Failed to create tree\n");
        return;
    }
    
    uint8_t* leaf_data = (uint8_t*)malloc(config->tree_size * 32);
    if (!leaf_data) {
        printf("Failed to allocate test data\n");
        merkle_tree_destroy(tree);
        return;
    }
    
    srand(42);
    for (uint64_t i = 0; i < config->tree_size * 32; i++) {
        leaf_data[i] = rand() & 0xFF;
    }
    
    merkle_tree_build(tree, leaf_data, config->tree_size * 32);
    
    // Generate and store proofs
    merkle_proof_t** proofs = (merkle_proof_t**)malloc(config->num_iterations * sizeof(merkle_proof_t*));
    uint8_t** leaf_data_ptrs = (uint8_t**)malloc(config->num_iterations * sizeof(uint8_t*));
    
    for (uint64_t i = 0; i < config->num_iterations; i++) {
        uint64_t leaf_idx = rand() % config->tree_size;
        leaf_data_ptrs[i] = leaf_data + leaf_idx * 32;
        proofs[i] = merkle_proof_create(tree, leaf_idx);
    }
    
    // Benchmark verification
    uint64_t total_verify_time = 0;
    uint64_t correct_verifications = 0;
    
    for (uint64_t i = 0; i < config->num_iterations; i++) {
        uint64_t start = get_time_ns();
        bool result = merkle_proof_verify(proofs[i], leaf_data_ptrs[i]);
        uint64_t end = get_time_ns();
        
        total_verify_time += (end - start);
        if (result) correct_verifications++;
    }
    
    double avg_verify_time_ms = (double)total_verify_time / config->num_iterations / 1000000.0;
    double verifications_per_sec = 1000.0 / avg_verify_time_ms;
    double success_rate = (double)correct_verifications / config->num_iterations * 100.0;
    
    printf("Proof verification: avg %.3f ms | %.0f verifications/sec | %.1f%% success\n", 
           avg_verify_time_ms, verifications_per_sec, success_rate);
    
    // Clean up
    for (uint64_t i = 0; i < config->num_iterations; i++) {
        if (proofs[i]) merkle_proof_destroy(proofs[i]);
    }
    free(proofs);
    free(leaf_data_ptrs);
    free(leaf_data);
    merkle_tree_destroy(tree);
}

void benchmark_spi_interface(benchmark_config_t* config) {
    printf("=== SPI Interface Benchmark ===\n");
    
    // Initialize SPI
    spi_context_t* ctx = spi_init(config->tree_size);
    if (!ctx) {
        printf("Failed to initialize SPI\n");
        return;
    }
    
    // Create tree via SPI
    spi_tree_info_t* tree_info = spi_create_tree(ctx, config->tree_size, HASH_SHA256);
    if (!tree_info) {
        printf("Failed to create tree via SPI\n");
        spi_shutdown(ctx);
        return;
    }
    
    printf("Created tree via SPI: ID=%llu, Leaves=%llu\n", 
           (unsigned long long)tree_info->tree_id,
           (unsigned long long)tree_info->num_leaves);
    
    // Benchmark SPI operations
    spi_request_t request = {0};
    request.request_id = 1;
    request.request_type = SPI_REQUEST_TREE_INFO;
    request.tree_id = tree_info->tree_id;
    
    uint64_t total_spi_time = 0;
    for (uint64_t i = 0; i < config->num_iterations; i++) {
        uint64_t start = get_time_ns();
        spi_response_t* response = spi_process_request(ctx, &request);
        uint64_t end = get_time_ns();
        
        total_spi_time += (end - start);
        
        if (response) {
            spi_free_response(response);
        }
    }
    
    double avg_spi_time_ms = (double)total_spi_time / config->num_iterations / 1000000.0;
    printf("SPI request processing: avg %.3f ms\n", avg_spi_time_ms);
    
    // Get performance metrics
    spi_performance_metrics_t metrics = spi_get_performance_metrics(ctx);
    printf("SPI Performance Metrics:\n");
    printf("  Generation time: %llu ns\n", (unsigned long long)metrics.generation_time_ns);
    printf("  Verification time: %llu ns\n", (unsigned long long)metrics.verification_time_ns);
    printf("  Memory usage: %llu MB\n", (unsigned long long)metrics.memory_usage_mb);
    printf("  Cache hit rate: %.2f%%\n", metrics.cache_hit_rate * 100.0);
    printf("  Throughput: %.0f proofs/sec\n", metrics.throughput_proofs_per_sec);
    
    // Clean up
    free(tree_info);
    spi_shutdown(ctx);
}

void print_usage(const char* program_name) {
    printf("Usage: %s [options]\n", program_name);
    printf("Options:\n");
    printf("  -s, --tree-size <size>     Tree size (default: 16384)\n");
    printf("  -i, --iterations <count>   Number of iterations (default: 100)\n");
    printf("  -v, --verify               Test verification (default: no)\n");
    printf("  -b, --batch <size>         Test batch operations (default: no)\n");
    printf("  -h, --help                 Show this help message\n");
}

int main(int argc, char* argv[]) {
    benchmark_config_t config = {
        .tree_size = 16384,
        .num_iterations = 100,
        .test_verification = false,
        .test_batch_operations = false,
        .batch_size = 10
    };
    
    // Parse command line arguments
    static struct option long_options[] = {
        {"tree-size", required_argument, 0, 's'},
        {"iterations", required_argument, 0, 'i'},
        {"verify", no_argument, 0, 'v'},
        {"batch", required_argument, 0, 'b'},
        {"help", no_argument, 0, 'h'},
        {0, 0, 0, 0}
    };
    
    int opt;
    int option_index = 0;
    
    while ((opt = getopt_long(argc, argv, "s:i:vb:h", long_options, &option_index)) != -1) {
        switch (opt) {
            case 's':
                config.tree_size = strtoull(optarg, NULL, 10);
                break;
            case 'i':
                config.num_iterations = strtoull(optarg, NULL, 10);
                break;
            case 'v':
                config.test_verification = true;
                break;
            case 'b':
                config.test_batch_operations = true;
                config.batch_size = strtoull(optarg, NULL, 10);
                break;
            case 'h':
                print_usage(argv[0]);
                return 0;
            default:
                print_usage(argv[0]);
                return 1;
        }
    }
    
    printf("Challenge B - Merkle Proof RISC-V Benchmark\n");
    printf("===========================================\n");
    printf("Configuration:\n");
    printf("  Tree size: %llu leaves\n", (unsigned long long)config.tree_size);
    printf("  Iterations: %llu\n", (unsigned long long)config.num_iterations);
    printf("  Test verification: %s\n", config.test_verification ? "yes" : "no");
    printf("  Test batch operations: %s\n", config.test_batch_operations ? "yes" : "no");
    printf("\n");
    
    // Run benchmarks
    benchmark_tree_creation(&config);
    printf("\n");
    
    benchmark_proof_generation(&config);
    printf("\n");
    
    if (config.test_verification) {
        benchmark_proof_verification(&config);
        printf("\n");
    }
    
    benchmark_spi_interface(&config);
    printf("\n");
    
    printf("Benchmark completed successfully!\n");
    
    return 0;
}


