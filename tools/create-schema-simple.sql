-- Database Schema for Shortcuts Learning App
-- This script creates the required tables and sample data

-- Create apps table
CREATE TABLE IF NOT EXISTS apps (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    icon TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    app_id INTEGER,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (app_id) REFERENCES apps (id),
    UNIQUE(app_id, name)
);

-- Create shortcuts table
CREATE TABLE IF NOT EXISTS shortcuts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    app_id INTEGER NOT NULL,
    category_id INTEGER,
    keys TEXT NOT NULL,
    description TEXT NOT NULL,
    context TEXT,
    learned BOOLEAN DEFAULT FALSE,
    priority INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (app_id) REFERENCES apps (id),
    FOREIGN KEY (category_id) REFERENCES categories (id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_shortcuts_app_id ON shortcuts (app_id);
CREATE INDEX IF NOT EXISTS idx_shortcuts_category_id ON shortcuts (category_id);
CREATE INDEX IF NOT EXISTS idx_shortcuts_learned ON shortcuts (learned);

-- Insert default applications
INSERT OR IGNORE INTO apps (name, icon) VALUES ('Neovim', 'neovim');
INSERT OR IGNORE INTO apps (name, icon) VALUES ('Aerospace', 'aerospace');

-- Insert default categories for Neovim (ID = 1)
INSERT OR IGNORE INTO categories (app_id, name, display_order) VALUES (1, 'Navigation', 1);
INSERT OR IGNORE INTO categories (app_id, name, display_order) VALUES (1, 'Editing', 2);
INSERT OR IGNORE INTO categories (app_id, name, display_order) VALUES (1, 'Search', 3);

-- Insert default categories for Aerospace (ID = 2)
INSERT OR IGNORE INTO categories (app_id, name, display_order) VALUES (2, 'Window Management', 1);
INSERT OR IGNORE INTO categories (app_id, name, display_order) VALUES (2, 'Workspace', 2);

-- Insert Neovim Navigation shortcuts (app_id=1, category_id=1)
INSERT OR IGNORE INTO shortcuts (app_id, category_id, keys, description, priority) VALUES (1, 1, 'h', 'Move cursor left', 1);
INSERT OR IGNORE INTO shortcuts (app_id, category_id, keys, description, priority) VALUES (1, 1, 'j', 'Move cursor down', 1);
INSERT OR IGNORE INTO shortcuts (app_id, category_id, keys, description, priority) VALUES (1, 1, 'k', 'Move cursor up', 1);
INSERT OR IGNORE INTO shortcuts (app_id, category_id, keys, description, priority) VALUES (1, 1, 'l', 'Move cursor right', 1);
INSERT OR IGNORE INTO shortcuts (app_id, category_id, keys, description, priority) VALUES (1, 1, 'w', 'Move to next word', 1);
INSERT OR IGNORE INTO shortcuts (app_id, category_id, keys, description, priority) VALUES (1, 1, 'b', 'Move to previous word', 1);
INSERT OR IGNORE INTO shortcuts (app_id, category_id, keys, description, priority) VALUES (1, 1, '0', 'Move to start of line', 1);
INSERT OR IGNORE INTO shortcuts (app_id, category_id, keys, description, priority) VALUES (1, 1, '$', 'Move to end of line', 1);
INSERT OR IGNORE INTO shortcuts (app_id, category_id, keys, description, priority) VALUES (1, 1, 'gg', 'Go to top of file', 1);
INSERT OR IGNORE INTO shortcuts (app_id, category_id, keys, description, priority) VALUES (1, 1, 'G', 'Go to bottom of file', 1);

-- Insert Neovim Editing shortcuts (app_id=1, category_id=2)
INSERT OR IGNORE INTO shortcuts (app_id, category_id, keys, description, priority) VALUES (1, 2, 'i', 'Enter insert mode', 1);
INSERT OR IGNORE INTO shortcuts (app_id, category_id, keys, description, priority) VALUES (1, 2, 'a', 'Append after cursor', 1);
INSERT OR IGNORE INTO shortcuts (app_id, category_id, keys, description, priority) VALUES (1, 2, 'o', 'Insert new line below', 1);
INSERT OR IGNORE INTO shortcuts (app_id, category_id, keys, description, priority) VALUES (1, 2, 'O', 'Insert new line above', 1);
INSERT OR IGNORE INTO shortcuts (app_id, category_id, keys, description, priority) VALUES (1, 2, 'dd', 'Delete line', 1);
INSERT OR IGNORE INTO shortcuts (app_id, category_id, keys, description, priority) VALUES (1, 2, 'yy', 'Copy line', 1);
INSERT OR IGNORE INTO shortcuts (app_id, category_id, keys, description, priority) VALUES (1, 2, 'p', 'Paste after cursor', 1);
INSERT OR IGNORE INTO shortcuts (app_id, category_id, keys, description, priority) VALUES (1, 2, 'P', 'Paste before cursor', 1);
INSERT OR IGNORE INTO shortcuts (app_id, category_id, keys, description, priority) VALUES (1, 2, 'u', 'Undo', 1);
INSERT OR IGNORE INTO shortcuts (app_id, category_id, keys, description, priority) VALUES (1, 2, 'Ctrl+r', 'Redo', 1);

-- Insert Neovim Search shortcuts (app_id=1, category_id=3)
INSERT OR IGNORE INTO shortcuts (app_id, category_id, keys, description, priority) VALUES (1, 3, '/', 'Search forward', 1);
INSERT OR IGNORE INTO shortcuts (app_id, category_id, keys, description, priority) VALUES (1, 3, '?', 'Search backward', 1);
INSERT OR IGNORE INTO shortcuts (app_id, category_id, keys, description, priority) VALUES (1, 3, 'n', 'Next search result', 1);
INSERT OR IGNORE INTO shortcuts (app_id, category_id, keys, description, priority) VALUES (1, 3, 'N', 'Previous search result', 1);
INSERT OR IGNORE INTO shortcuts (app_id, category_id, keys, description, priority) VALUES (1, 3, '*', 'Search word under cursor', 1);
INSERT OR IGNORE INTO shortcuts (app_id, category_id, keys, description, priority) VALUES (1, 3, '#', 'Search word under cursor backward', 1);
INSERT OR IGNORE INTO shortcuts (app_id, category_id, keys, description, priority) VALUES (1, 3, ':%s/old/new/g', 'Replace all occurrences', 1);

-- Insert Aerospace Window Management shortcuts (app_id=2, category_id=4)
INSERT OR IGNORE INTO shortcuts (app_id, category_id, keys, description, priority) VALUES (2, 4, 'Alt-Shift-H', 'Focus window left', 1);
INSERT OR IGNORE INTO shortcuts (app_id, category_id, keys, description, priority) VALUES (2, 4, 'Alt-Shift-L', 'Focus window right', 1);
INSERT OR IGNORE INTO shortcuts (app_id, category_id, keys, description, priority) VALUES (2, 4, 'Alt-Shift-J', 'Focus window down', 1);
INSERT OR IGNORE INTO shortcuts (app_id, category_id, keys, description, priority) VALUES (2, 4, 'Alt-Shift-K', 'Focus window up', 1);
INSERT OR IGNORE INTO shortcuts (app_id, category_id, keys, description, priority) VALUES (2, 4, 'Alt-Shift-Enter', 'Swap window with main', 1);
INSERT OR IGNORE INTO shortcuts (app_id, category_id, keys, description, priority) VALUES (2, 4, 'Alt-Shift-Ctrl-H', 'Move window left', 1);
INSERT OR IGNORE INTO shortcuts (app_id, category_id, keys, description, priority) VALUES (2, 4, 'Alt-Shift-Ctrl-L', 'Move window right', 1);
INSERT OR IGNORE INTO shortcuts (app_id, category_id, keys, description, priority) VALUES (2, 4, 'Alt-Shift-Ctrl-J', 'Move window down', 1);
INSERT OR IGNORE INTO shortcuts (app_id, category_id, keys, description, priority) VALUES (2, 4, 'Alt-Shift-Ctrl-K', 'Move window up', 1);
INSERT OR IGNORE INTO shortcuts (app_id, category_id, keys, description, priority) VALUES (2, 4, 'Alt-Shift-F', 'Toggle fullscreen', 1);

-- Insert Aerospace Workspace shortcuts (app_id=2, category_id=5)
INSERT OR IGNORE INTO shortcuts (app_id, category_id, keys, description, priority) VALUES (2, 5, 'Alt-1', 'Focus workspace 1', 1);
INSERT OR IGNORE INTO shortcuts (app_id, category_id, keys, description, priority) VALUES (2, 5, 'Alt-2', 'Focus workspace 2', 1);
INSERT OR IGNORE INTO shortcuts (app_id, category_id, keys, description, priority) VALUES (2, 5, 'Alt-3', 'Focus workspace 3', 1);
INSERT OR IGNORE INTO shortcuts (app_id, category_id, keys, description, priority) VALUES (2, 5, 'Alt-4', 'Focus workspace 4', 1);
INSERT OR IGNORE INTO shortcuts (app_id, category_id, keys, description, priority) VALUES (2, 5, 'Alt-5', 'Focus workspace 5', 1);
INSERT OR IGNORE INTO shortcuts (app_id, category_id, keys, description, priority) VALUES (2, 5, 'Alt-Shift-1', 'Move window to workspace 1', 1);
INSERT OR IGNORE INTO shortcuts (app_id, category_id, keys, description, priority) VALUES (2, 5, 'Alt-Shift-2', 'Move window to workspace 2', 1);
INSERT OR IGNORE INTO shortcuts (app_id, category_id, keys, description, priority) VALUES (2, 5, 'Alt-Shift-3', 'Move window to workspace 3', 1);
INSERT OR IGNORE INTO shortcuts (app_id, category_id, keys, description, priority) VALUES (2, 5, 'Alt-Shift-4', 'Move window to workspace 4', 1);
INSERT OR IGNORE INTO shortcuts (app_id, category_id, keys, description, priority) VALUES (2, 5, 'Alt-Shift-5', 'Move window to workspace 5', 1);