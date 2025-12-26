#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <assert.h>
#include "core/merkle_tree.h"
#include "hash/hash_functions.h"
#include "spi/spi_interface.h"

// Test utilities
#define TEST_ASSERT(condition, message) \
    do { \
        if (!(condition)) { \
            printf("FAIL: %s\n", message); \
            return false; \
        } \
    } while(0)

#define TEST_ASSERT_EQUAL(expected, actual, message) \
    do { \
        if ((expected) != (actual)) { \
            printf("FAIL: %s (expected %lld, got %lld)\n", message, (long long)(expected), (long long)(actual)); \
            return false; \
        } \
    } while(0)

bool test_memory_pool(void) {
    printf("Testing memory pool...\n");
    
    // Create memory pool
    memory_pool_t* pool = memory_pool_create(1024);
    TEST_ASSERT(pool != NULL, "Memory pool creation failed");
    
    // Test allocation
    void* ptr1 = memory_pool_alloc(pool, 100);
    TEST_ASSERT(ptr1 != NULL, "First allocation failed");
    
    void* ptr2 = memory_pool_alloc(pool, 200);
    TEST_ASSERT(ptr2 != NULL, "Second allocation failed");
    
    void* ptr3 = memory_pool_alloc(pool, 800);
    TEST_ASSERT(ptr3 != NULL, "Third allocation failed");
    
    // Test that pointers are different
    TEST_ASSERT(ptr1 != ptr2, "Pointers should be different");
    TEST_ASSERT(ptr2 != ptr3, "Pointers should be different");
    
    // Test reset
    memory_pool_reset(pool);
    void* ptr4 = memory_pool_alloc(pool, 100);
    TEST_ASSERT(ptr4 == ptr1, "Reset should reuse memory");
    
    // Cleanup
    memory_pool_destroy(pool);
    
    printf("  Memory pool tests passed!\n");
    return true;
}

bool test_tree_depth_calculation(void) {
    printf("Testing tree depth calculation...\n");
    
    // Test various sizes
    TEST_ASSERT_EQUAL(0, calculate_tree_depth(1), "Depth for 1 leaf");
    TEST_ASSERT_EQUAL(1, calculate_tree_depth(2), "Depth for 2 leaves");
    TEST_ASSERT_EQUAL(2, calculate_tree_depth(4), "Depth for 4 leaves");
    TEST_ASSERT_EQUAL(3, calculate_tree_depth(8), "Depth for 8 leaves");
    TEST_ASSERT_EQUAL(10, calculate_tree_depth(1024), "Depth for 1024 leaves");
    
    printf("  Tree depth calculation tests passed!\n");
    return true;
}

bool test_power_of_two(void) {
    printf("Testing power of two validation...\n");
    
    TEST_ASSERT(is_power_of_two(1) == true, "1 is power of 2");
    TEST_ASSERT(is_power_of_two(2) == true, "2 is power of 2");
    TEST_ASSERT(is_power_of_two(4) == true, "4 is power of 2");
    TEST_ASSERT(is_power_of_two(8) == true, "8 is power of 2");
    TEST_ASSERT(is_power_of_two(1024) == true, "1024 is power of 2");
    
    TEST_ASSERT(is_power_of_two(3) == false, "3 is not power of 2");
    TEST_ASSERT(is_power_of_two(5) == false, "5 is not power of 2");
    TEST_ASSERT(is_power_of_two(100) == false, "100 is not power of 2");
    
    printf("  Power of two validation tests passed!\n");
    return true;
}

bool test_parameter_validation(void) {
    printf("Testing parameter validation...\n");
    
    // Valid parameters
    merkle_error_t err = validate_tree_parameters(1024, HASH_SHA256);
    TEST_ASSERT(err == MERKLE_SUCCESS, "Valid parameters should pass");
    
    // Invalid sizes
    err = validate_tree_parameters(0, HASH_SHA256);
    TEST_ASSERT(err == MERKLE_ERROR_INVALID_SIZE, "Zero size should fail");
    
    err = validate_tree_parameters(1000, HASH_SHA256); // Not power of 2
    TEST_ASSERT(err == MERKLE_ERROR_INVALID_SIZE, "Non-power-of-2 size should fail");
    
    // Invalid hash type
    err = validate_tree_parameters(1024, HASH_CUSTOM);
    TEST_ASSERT(err == MERKLE_ERROR_INVALID_HASH_TYPE, "Invalid hash type should fail");
    
    printf("  Parameter validation tests passed!\n");
    return true;
}

bool test_sha256_basic(void) {
    printf("Testing SHA-256 basic functionality...\n");
    
    // Test known vector
    const char* test_msg = "abc";
    const uint8_t expected_hash[32] = {
        0xba, 0x78, 0x16, 0xbf, 0x8f, 0x01, 0xcf, 0xea,
        0x41, 0x41, 0x40, 0xde, 0x5d, 0xae, 0x22, 0x23,
        0xb0, 0x03, 0x61, 0xa3, 0x96, 0x17, 0x7a, 0x9c,
        0xb4, 0x10, 0xff, 0x61, 0xf2, 0x00, 0x15, 0xad
    };
    
    uint8_t computed_hash[32];
    sha256_hash((const uint8_t*)test_msg, strlen(test_msg), computed_hash);
    
    TEST_ASSERT(memcmp(computed_hash, expected_hash, 32) == 0, 
                "SHA-256 hash matches expected value");
    
    printf("  SHA-256 basic tests passed!\n");
    return true;
}

bool test_spi_basic(void) {
    printf("Testing SPI interface basic functionality...\n");
    
    // Initialize SPI
    spi_context_t* ctx = spi_init(1048576);
    TEST_ASSERT(ctx != NULL, "SPI initialization failed");
    
    // Create tree info
    spi_tree_info_t* tree_info = spi_create_tree(ctx, 1024, HASH_SHA256);
    TEST_ASSERT(tree_info != NULL, "Tree creation via SPI failed");
    
    TEST_ASSERT(tree_info->num_leaves == 1024, "Tree size mismatch");
    TEST_ASSERT(tree_info->hash_type == HASH_SHA256, "Hash type mismatch");
    
    // Test request processing
    spi_request_t request = {0};
    request.request_id = 1;
    request.request_type = SPI_REQUEST_TREE_INFO;
    request.tree_id = tree_info->tree_id;
    
    spi_response_t* response = spi_process_request(ctx, &request);
    TEST_ASSERT(response != NULL, "SPI request processing failed");
    TEST_ASSERT(response->request_id == 1, "Request ID mismatch");
    
    // Clean up
    free(tree_info);
    spi_free_response(response);
    spi_shutdown(ctx);
    
    printf("  SPI basic tests passed!\n");
    return true;
}

bool test_spi_performance_metrics(void) {
    printf("Testing SPI performance metrics...\n");
    
    spi_context_t* ctx = spi_init(1048576);
    TEST_ASSERT(ctx != NULL, "SPI initialization failed");
    
    spi_performance_metrics_t metrics = spi_get_performance_metrics(ctx);
    
    // These are placeholder values, just check they're reasonable
    TEST_ASSERT(metrics.generation_time_ns > 0, "Generation time should be positive");
    TEST_ASSERT(metrics.verification_time_ns > 0, "Verification time should be positive");
    TEST_ASSERT(metrics.cache_hit_rate >= 0.0 && metrics.cache_hit_rate <= 1.0, 
                "Cache hit rate should be between 0 and 1");
    
    uint32_t score = spi_calculate_performance_score(&metrics);
    TEST_ASSERT(score >= 0, "Performance score should be non-negative");
    
    spi_shutdown(ctx);
    
    printf("  SPI performance metrics tests passed!\n");
    return true;
}

bool test_error_handling(void) {
    printf("Testing error handling...\n");
    
    // Test SPI error strings
    const char* error_msg = spi_error_string(SPI_RESPONSE_ERROR_INVALID_REQUEST);
    TEST_ASSERT(error_msg != NULL, "Error string should not be NULL");
    
    error_msg = spi_error_string(999); // Invalid status
    TEST_ASSERT(error_msg != NULL, "Error string for invalid status should not be NULL");
    
    // Test NULL parameter handling
    memory_pool_t* null_pool = memory_pool_create(0);
    TEST_ASSERT(null_pool == NULL, "Creating pool with size 0 should fail");
    
    spi_context_t* null_ctx = spi_init(0);
    // This might succeed or fail depending on implementation
    if (null_ctx) {
        spi_shutdown(null_ctx);
    }
    
    printf("  Error handling tests passed!\n");
    return true;
}

int main(void) {
    printf("Challenge B - Merkle Proof RISC-V Test Suite\n");
    printf("============================================\n\n");
    
    int total_tests = 0;
    int passed_tests = 0;
    
    // Run all tests
    if (test_memory_pool()) passed_tests++;
    total_tests++;
    
    if (test_tree_depth_calculation()) passed_tests++;
    total_tests++;
    
    if (test_power_of_two()) passed_tests++;
    total_tests++;
    
    if (test_parameter_validation()) passed_tests++;
    total_tests++;
    
    if (test_sha256_basic()) passed_tests++;
    total_tests++;
    
    if (test_spi_basic()) passed_tests++;
    total_tests++;
    
    if (test_spi_performance_metrics()) passed_tests++;
    total_tests++;
    
    if (test_error_handling()) passed_tests++;
    total_tests++;
    
    // Results
    printf("\n============================================\n");
    printf("Test Results: %d/%d tests passed\n", passed_tests, total_tests);
    
    if (passed_tests == total_tests) {
        printf("All tests PASSED! ✓\n");
        return 0;
    } else {
        printf("Some tests FAILED! ✗\n");
        return 1;
    }
}


