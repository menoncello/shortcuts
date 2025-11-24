#!/usr/bin/env bun

/**
 * Data Validation Script for Shortcuts Learning App
 *
 * This script validates the database integrity and consistency of shortcuts data.
 * It checks for:
 * - Database schema integrity
 * - Duplicate shortcuts
 * - Orphaned records (shortcuts without valid categories/apps)
 * - Data consistency
 * - Required fields
 */

import { Database } from "bun:sqlite";

interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  summary: {
    totalApps: number;
    totalCategories: number;
    totalShortcuts: number;
    duplicateShortcuts: number;
    orphanedShortcuts: number;
  };
}

async function validateDatabase(): Promise<ValidationResult> {
  const db = new Database("src-tauri/shortcuts.db");
  const errors: string[] = [];
  const warnings: string[] = [];

  try {
    // Check if tables exist
    const tables = db.query("SELECT name FROM sqlite_master WHERE type='table'").all() as { name: string }[];
    const requiredTables = ["apps", "categories", "shortcuts"];

    for (const table of requiredTables) {
      if (!tables.find(t => t.name === table)) {
        errors.push(`Required table '${table}' does not exist`);
      }
    }

    if (errors.length > 0) {
      return {
        valid: false,
        errors,
        warnings,
        summary: { totalApps: 0, totalCategories: 0, totalShortcuts: 0, duplicateShortcuts: 0, orphanedShortcuts: 0 }
      };
    }

    // Get counts
    const totalApps = (db.query("SELECT COUNT(*) as count FROM apps").get() as { count: number }).count;
    const totalCategories = (db.query("SELECT COUNT(*) as count FROM categories").get() as { count: number }).count;
    const totalShortcuts = (db.query("SELECT COUNT(*) as count FROM shortcuts").get() as { count: number }).count;

    // Check for duplicate shortcuts (same keys in same app)
    const duplicateQuery = `
      SELECT s1.app_id, s1.keys, COUNT(*) as count
      FROM shortcuts s1
      GROUP BY s1.app_id, s1.keys
      HAVING COUNT(*) > 1
    `;
    const duplicates = db.query(duplicateQuery).all() as { app_id: number; keys: string; count: number }[];
    const duplicateShortcuts = duplicates.reduce((sum, d) => sum + d.count, 0);

    if (duplicates.length > 0) {
      warnings.push(`Found ${duplicates.length} groups of duplicate shortcuts with same keys`);
      for (const dup of duplicates) {
        warnings.push(`  - App ${dup.app_id}: '${dup.keys}' appears ${dup.count} times`);
      }
    }

    // Check for orphaned shortcuts (references to non-existent categories)
    const orphanedQuery = `
      SELECT COUNT(*) as count
      FROM shortcuts s
      LEFT JOIN categories c ON s.category_id = c.id
      WHERE s.category_id IS NOT NULL AND c.id IS NULL
    `;
    const orphanedShortcuts = (db.query(orphanedQuery).get() as { count: number }).count;

    if (orphanedShortcuts > 0) {
      errors.push(`Found ${orphanedShortcuts} shortcuts referencing non-existent categories`);
    }

    // Check for shortcuts with missing required fields
    const nullFields = db.query(`
      SELECT 'keys' as field, COUNT(*) as count FROM shortcuts WHERE keys IS NULL OR keys = ''
      UNION ALL
      SELECT 'description' as field, COUNT(*) as count FROM shortcuts WHERE description IS NULL OR description = ''
      UNION ALL
      SELECT 'app_id' as field, COUNT(*) as count FROM shortcuts WHERE app_id IS NULL
    `).all() as { field: string; count: number }[];

    for (const field of nullFields) {
      if (field.count > 0) {
        errors.push(`Found ${field.count} shortcuts with NULL or empty '${field.field}' field`);
      }
    }

    // Check for apps with no shortcuts
    const emptyApps = db.query(`
      SELECT a.id, a.name
      FROM apps a
      LEFT JOIN shortcuts s ON a.id = s.app_id
      WHERE s.id IS NULL
    `).all() as { id: number; name: string }[];

    if (emptyApps.length > 0) {
      warnings.push(`Found ${emptyApps.length} apps with no shortcuts:`);
      for (const app of emptyApps) {
        warnings.push(`  - ${app.name} (ID: ${app.id})`);
      }
    }

    // Check for categories with no shortcuts
    const emptyCategories = db.query(`
      SELECT c.id, c.name, a.name as app_name
      FROM categories c
      JOIN apps a ON c.app_id = a.id
      LEFT JOIN shortcuts s ON c.id = s.category_id
      WHERE s.id IS NULL
    `).all() as { id: number; name: string; app_name: string }[];

    if (emptyCategories.length > 0) {
      warnings.push(`Found ${emptyCategories.length} categories with no shortcuts:`);
      for (const cat of emptyCategories) {
        warnings.push(`  - ${cat.app_name}: ${cat.name} (ID: ${cat.id})`);
      }
    }

    // Validate shortcuts data format
    const invalidKeys = db.query(`
      SELECT id, keys FROM shortcuts
      WHERE keys LIKE '%  ' OR keys LIKE '  %' OR keys = ''
    `).all() as { id: number; keys: string }[];

    if (invalidKeys.length > 0) {
      warnings.push(`Found ${invalidKeys.length} shortcuts with potentially malformed key combinations:`);
      for (const shortcut of invalidKeys) {
        warnings.push(`  - ID ${shortcut.id}: '${shortcut.keys}'`);
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
      summary: {
        totalApps,
        totalCategories,
        totalShortcuts,
        duplicateShortcuts,
        orphanedShortcuts
      }
    };

  } catch (error) {
    errors.push(`Database validation failed: ${error instanceof Error ? error.message : String(error)}`);
    return {
      valid: false,
      errors,
      warnings,
      summary: { totalApps: 0, totalCategories: 0, totalShortcuts: 0, duplicateShortcuts: 0, orphanedShortcuts: 0 }
    };
  } finally {
    db.close();
  }
}

function printResults(result: ValidationResult): void {
  console.log("\n" + "=".repeat(60));
  console.log("🔍 DATABASE VALIDATION RESULTS");
  console.log("=".repeat(60));

  console.log(`\n📊 SUMMARY:`);
  console.log(`   Total Apps: ${result.summary.totalApps}`);
  console.log(`   Total Categories: ${result.summary.totalCategories}`);
  console.log(`   Total Shortcuts: ${result.summary.totalShortcuts}`);
  console.log(`   Duplicate Shortcuts: ${result.summary.duplicateShortcuts}`);
  console.log(`   Orphaned Shortcuts: ${result.summary.orphanedShortcuts}`);

  if (result.errors.length > 0) {
    console.log(`\n❌ ERRORS (${result.errors.length}):`);
    result.errors.forEach((error, index) => {
      console.log(`   ${index + 1}. ${error}`);
    });
  }

  if (result.warnings.length > 0) {
    console.log(`\n⚠️  WARNINGS (${result.warnings.length}):`);
    result.warnings.forEach((warning, index) => {
      console.log(`   ${index + 1}. ${warning}`);
    });
  }

  if (result.valid) {
    console.log(`\n✅ Database validation PASSED! No critical issues found.`);
  } else {
    console.log(`\n❌ Database validation FAILED! ${result.errors.length} error(s) need to be fixed.`);
  }

  console.log("=".repeat(60));
}

async function main(): Promise<void> {
  console.log("🚀 Starting database validation...");

  const result = await validateDatabase();
  printResults(result);

  // Exit with appropriate code for CI/CD
  process.exit(result.valid ? 0 : 1);
}

// Run the validation
main().catch(error => {
  console.error("❌ Validation script failed:", error);
  process.exit(1);
});