#!/usr/bin/env bun

/**
 * Database Initialization Script
 *
 * This script initializes the database with the required schema and sample data.
 * It creates the database file if it doesn't exist and runs the database setup.
 */

import { spawn } from 'child_process';
import { existsSync } from 'fs';

function runCommand(cmd: string, args: string[]): Promise<string> {
  return new Promise((resolve, reject) => {
    console.log(`🔧 Running: ${cmd} ${args.join(' ')}`);

    const process = spawn(cmd, args, { stdio: 'pipe' });
    let output = '';
    let errorOutput = '';

    process.stdout?.on('data', (data) => {
      output += data.toString();
    });

    process.stderr?.on('data', (data) => {
      errorOutput += data.toString();
    });

    process.on('close', (code) => {
      if (code === 0) {
        resolve(output);
      } else {
        reject(new Error(`Command failed with code ${code}: ${errorOutput}`));
      }
    });

    process.on('error', (error) => {
      reject(error);
    });
  });
}

async function initializeDatabase(): Promise<void> {
  console.log("🚀 Initializing database...");

  try {
    // Compile and run the database initialization
    console.log("📦 Compiling Rust backend...");
    await runCommand("cargo", ["check", "--manifest-path", "src-tauri/Cargo.toml"]);

    // The database will be created when the application first runs
    // Let's run a simple test to trigger database initialization
    console.log("🗄️ Triggering database initialization...");

    // Create a temporary main to run database initialization
    const tempMain = `
use shortcuts_app::database::init_database;

#[tokio::main]
async fn main() -> Result<(), String> {
    println!("Initializing database...");
    let pool = init_database().await?;
    println!("Database initialized successfully!");
    println!("Database file created at: ./shortcuts.db");
    Ok(())
}
`;

    // Write temporary main
    await Bun.write("src-tauri/src/temp_init_db.rs", tempMain);

    // Update Cargo.toml to include our temp main temporarily
    const cargoToml = await Bun.file("src-tauri/Cargo.toml").text();
    const tempCargoToml = cargoToml.replace(
      '[[bin]]\nname = "shortcuts-app"\npath = "src/main.rs"',
      '[[bin]]\nname = "shortcuts-app"\npath = "src/main.rs"\n\n[[bin]]\nname = "init-db"\npath = "src/temp_init_db.rs"'
    );
    await Bun.write("src-tauri/Cargo.toml", tempCargoToml);

    // Run the initialization
    await runCommand("cargo", ["run", "--manifest-path", "src-tauri/Cargo.toml", "--bin", "init-db"]);

    // Restore original Cargo.toml
    await Bun.write("src-tauri/Cargo.toml", cargoToml);

    // Clean up temp file
    await Bun.remove("src-tauri/src/temp_init_db.rs");

    console.log("✅ Database initialization completed!");

  } catch (error) {
    console.error("❌ Database initialization failed:", error instanceof Error ? error.message : String(error));
    throw error;
  }
}

async function main(): Promise<void> {
  // Check if database already exists
  if (existsSync("src-tauri/shortcuts.db")) {
    console.log("📁 Database file already exists. Skipping initialization.");
    return;
  }

  await initializeDatabase();
}

main().catch(error => {
  console.error("❌ Initialization script failed:", error);
  process.exit(1);
});