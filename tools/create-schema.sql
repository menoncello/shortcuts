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

-- Get app IDs
-- Note: In SQLite, we'll use subqueries to get the IDs

-- Insert default categories for Neovim
INSERT OR IGNORE INTO categories (app_id, name, display_order)
VALUES ((SELECT id FROM apps WHERE name = 'Neovim'), 'Navigation', 1);

INSERT OR IGNORE INTO categories (app_id, name, display_order)
VALUES ((SELECT id FROM apps WHERE name = 'Neovim'), 'Editing', 2);

INSERT OR IGNORE INTO categories (app_id, name, display_order)
VALUES ((SELECT id FROM apps WHERE name = 'Neovim'), 'Search', 3);

-- Insert default categories for Aerospace
INSERT OR IGNORE INTO categories (app_id, name, display_order)
VALUES ((SELECT id FROM apps WHERE name = 'Aerospace'), 'Window Management', 1);

INSERT OR IGNORE INTO categories (app_id, name, display_order)
VALUES ((SELECT id FROM apps WHERE name = 'Aerospace'), 'Workspace', 2);

-- Insert Neovim Navigation shortcuts
INSERT OR IGNORE INTO shortcuts (app_id, category_id, keys, description, priority) VALUES
((SELECT id FROM apps WHERE name = 'Neovim'),
 (SELECT c.id FROM categories c JOIN apps a ON c.app_id = a.id WHERE c.name = 'Navigation' AND a.name = 'Neovim'),
 'h', 'Move cursor left', 1);

INSERT OR IGNORE INTO shortcuts (app_id, category_id, keys, description, priority) VALUES
((SELECT id FROM apps WHERE name = 'Neovim'),
 (SELECT c.id FROM categories c JOIN apps a ON c.app_id = a.id WHERE c.name = 'Navigation' AND a.name = 'Neovim'),
 'j', 'Move cursor down', 1);

INSERT OR IGNORE INTO shortcuts (app_id, category_id, keys, description, priority) VALUES
((SELECT id FROM apps WHERE name = 'Neovim'),
 (SELECT c.id FROM categories c JOIN apps a ON c.app_id = a.id WHERE c.name = 'Navigation' AND a.name = 'Neovim'),
 'k', 'Move cursor up', 1);

INSERT OR IGNORE INTO shortcuts (app_id, category_id, keys, description, priority) VALUES
((SELECT id FROM apps WHERE name = 'Neovim'),
 (SELECT c.id FROM categories c JOIN apps a ON c.app_id = a.id WHERE c.name = 'Navigation' AND a.name = 'Neovim'),
 'l', 'Move cursor right', 1);

INSERT OR IGNORE INTO shortcuts (app_id, category_id, keys, description, priority) VALUES
((SELECT id FROM apps WHERE name = 'Neovim'),
 (SELECT c.id FROM categories c JOIN apps a ON c.app_id = a.id WHERE c.name = 'Navigation' AND a.name = 'Neovim'),
 'w', 'Move to next word', 1);

INSERT OR IGNORE INTO shortcuts (app_id, category_id, keys, description, priority) VALUES
((SELECT id FROM apps WHERE name = 'Neovim'),
 (SELECT c.id FROM categories c JOIN apps a ON c.app_id = a.id WHERE c.name = 'Navigation' AND a.name = 'Neovim'),
 'b', 'Move to previous word', 1);

INSERT OR IGNORE INTO shortcuts (app_id, category_id, keys, description, priority) VALUES
((SELECT id FROM apps WHERE name = 'Neovim'),
 (SELECT c.id FROM categories c JOIN apps a ON c.app_id = a.id WHERE c.name = 'Navigation' AND a.name = 'Neovim'),
 '0', 'Move to start of line', 1);

INSERT OR IGNORE INTO shortcuts (app_id, category_id, keys, description, priority) VALUES
((SELECT id FROM apps WHERE name = 'Neovim'),
 (SELECT c.id FROM categories c JOIN apps a ON c.app_id = a.id WHERE c.name = 'Navigation' AND a.name = 'Neovim'),
 '$', 'Move to end of line', 1);

INSERT OR IGNORE INTO shortcuts (app_id, category_id, keys, description, priority) VALUES
((SELECT id FROM apps WHERE name = 'Neovim'),
 (SELECT c.id FROM categories c JOIN apps a ON c.app_id = a.id WHERE c.name = 'Navigation' AND a.name = 'Neovim'),
 'gg', 'Go to top of file', 1);

INSERT OR IGNORE INTO shortcuts (app_id, category_id, keys, description, priority) VALUES
((SELECT id FROM apps WHERE name = 'Neovim'),
 (SELECT c.id FROM categories c JOIN apps a ON c.app_id = a.id WHERE c.name = 'Navigation' AND a.name = 'Neovim'),
 'G', 'Go to bottom of file', 1);

-- Insert Neovim Editing shortcuts
INSERT OR IGNORE INTO shortcuts (app_id, category_id, keys, description, priority) VALUES
((SELECT id FROM apps WHERE name = 'Neovim'),
 (SELECT id FROM categories c JOIN apps a ON c.app_id = a.id WHERE c.name = 'Editing' AND a.name = 'Neovim'),
 'i', 'Enter insert mode', 1),
((SELECT id FROM apps WHERE name = 'Neovim'),
 (SELECT id FROM categories c JOIN apps a ON c.app_id = a.id WHERE c.name = 'Editing' AND a.name = 'Neovim'),
 'a', 'Append after cursor', 1),
((SELECT id FROM apps WHERE name = 'Neovim'),
 (SELECT id FROM categories c JOIN apps a ON c.app_id = a.id WHERE c.name = 'Editing' AND a.name = 'Neovim'),
 'o', 'Insert new line below', 1),
((SELECT id FROM apps WHERE name = 'Neovim'),
 (SELECT id FROM categories c JOIN apps a ON c.app_id = a.id WHERE c.name = 'Editing' AND a.name = 'Neovim'),
 'O', 'Insert new line above', 1),
((SELECT id FROM apps WHERE name = 'Neovim'),
 (SELECT id FROM categories c JOIN apps a ON c.app_id = a.id WHERE c.name = 'Editing' AND a.name = 'Neovim'),
 'dd', 'Delete line', 1),
((SELECT id FROM apps WHERE name = 'Neovim'),
 (SELECT id FROM categories c JOIN apps a ON c.app_id = a.id WHERE c.name = 'Editing' AND a.name = 'Neovim'),
 'yy', 'Copy line', 1),
((SELECT id FROM apps WHERE name = 'Neovim'),
 (SELECT id FROM categories c JOIN apps a ON c.app_id = a.id WHERE c.name = 'Editing' AND a.name = 'Neovim'),
 'p', 'Paste after cursor', 1),
((SELECT id FROM apps WHERE name = 'Neovim'),
 (SELECT id FROM categories c JOIN apps a ON c.app_id = a.id WHERE c.name = 'Editing' AND a.name = 'Neovim'),
 'P', 'Paste before cursor', 1),
((SELECT id FROM apps WHERE name = 'Neovim'),
 (SELECT id FROM categories c JOIN apps a ON c.app_id = a.id WHERE c.name = 'Editing' AND a.name = 'Neovim'),
 'u', 'Undo', 1),
((SELECT id FROM apps WHERE name = 'Neovim'),
 (SELECT id FROM categories c JOIN apps a ON c.app_id = a.id WHERE c.name = 'Editing' AND a.name = 'Neovim'),
 'Ctrl+r', 'Redo', 1);

-- Insert Neovim Search shortcuts
INSERT OR IGNORE INTO shortcuts (app_id, category_id, keys, description, priority) VALUES
((SELECT id FROM apps WHERE name = 'Neovim'),
 (SELECT id FROM categories c JOIN apps a ON c.app_id = a.id WHERE c.name = 'Search' AND a.name = 'Neovim'),
 '/', 'Search forward', 1),
((SELECT id FROM apps WHERE name = 'Neovim'),
 (SELECT id FROM categories c JOIN apps a ON c.app_id = a.id WHERE c.name = 'Search' AND a.name = 'Neovim'),
 '?', 'Search backward', 1),
((SELECT id FROM apps WHERE name = 'Neovim'),
 (SELECT id FROM categories c JOIN apps a ON c.app_id = a.id WHERE c.name = 'Search' AND a.name = 'Neovim'),
 'n', 'Next search result', 1),
((SELECT id FROM apps WHERE name = 'Neovim'),
 (SELECT id FROM categories c JOIN apps a ON c.app_id = a.id WHERE c.name = 'Search' AND a.name = 'Neovim'),
 'N', 'Previous search result', 1),
((SELECT id FROM apps WHERE name = 'Neovim'),
 (SELECT id FROM categories c JOIN apps a ON c.app_id = a.id WHERE c.name = 'Search' AND a.name = 'Neovim'),
 '*', 'Search word under cursor', 1),
((SELECT id FROM apps WHERE name = 'Neovim'),
 (SELECT id FROM categories c JOIN apps a ON c.app_id = a.id WHERE c.name = 'Search' AND a.name = 'Neovim'),
 '#', 'Search word under cursor backward', 1),
((SELECT id FROM apps WHERE name = 'Neovim'),
 (SELECT id FROM categories c JOIN apps a ON c.app_id = a.id WHERE c.name = 'Search' AND a.name = 'Neovim'),
 ':%s/old/new/g', 'Replace all occurrences', 1);

-- Insert Aerospace Window Management shortcuts
INSERT OR IGNORE INTO shortcuts (app_id, category_id, keys, description, priority) VALUES
((SELECT id FROM apps WHERE name = 'Aerospace'),
 (SELECT id FROM categories c JOIN apps a ON c.app_id = a.id WHERE c.name = 'Window Management' AND a.name = 'Aerospace'),
 'Alt-Shift-H', 'Focus window left', 1),
((SELECT id FROM apps WHERE name = 'Aerospace'),
 (SELECT id FROM categories c JOIN apps a ON c.app_id = a.id WHERE c.name = 'Window Management' AND a.name = 'Aerospace'),
 'Alt-Shift-L', 'Focus window right', 1),
((SELECT id FROM apps WHERE name = 'Aerospace'),
 (SELECT id FROM categories c JOIN apps a ON c.app_id = a.id WHERE c.name = 'Window Management' AND a.name = 'Aerospace'),
 'Alt-Shift-J', 'Focus window down', 1),
((SELECT id FROM apps WHERE name = 'Aerospace'),
 (SELECT id FROM categories c JOIN apps a ON c.app_id = a.id WHERE c.name = 'Window Management' AND a.name = 'Aerospace'),
 'Alt-Shift-K', 'Focus window up', 1),
((SELECT id FROM apps WHERE name = 'Aerospace'),
 (SELECT id FROM categories c JOIN apps a ON c.app_id = a.id WHERE c.name = 'Window Management' AND a.name = 'Aerospace'),
 'Alt-Shift-Enter', 'Swap window with main', 1),
((SELECT id FROM apps WHERE name = 'Aerospace'),
 (SELECT id FROM categories c JOIN apps a ON c.app_id = a.id WHERE c.name = 'Window Management' AND a.name = 'Aerospace'),
 'Alt-Shift-Ctrl-H', 'Move window left', 1),
((SELECT id FROM apps WHERE name = 'Aerospace'),
 (SELECT id FROM categories c JOIN apps a ON c.app_id = a.id WHERE c.name = 'Window Management' AND a.name = 'Aerospace'),
 'Alt-Shift-Ctrl-L', 'Move window right', 1),
((SELECT id FROM apps WHERE name = 'Aerospace'),
 (SELECT id FROM categories c JOIN apps a ON c.app_id = a.id WHERE c.name = 'Window Management' AND a.name = 'Aerospace'),
 'Alt-Shift-Ctrl-J', 'Move window down', 1),
((SELECT id FROM apps WHERE name = 'Aerospace'),
 (SELECT id FROM categories c JOIN apps a ON c.app_id = a.id WHERE c.name = 'Window Management' AND a.name = 'Aerospace'),
 'Alt-Shift-Ctrl-K', 'Move window up', 1),
((SELECT id FROM apps WHERE name = 'Aerospace'),
 (SELECT id FROM categories c JOIN apps a ON c.app_id = a.id WHERE c.name = 'Window Management' AND a.name = 'Aerospace'),
 'Alt-Shift-F', 'Toggle fullscreen', 1);

-- Insert Aerospace Workspace shortcuts
INSERT OR IGNORE INTO shortcuts (app_id, category_id, keys, description, priority) VALUES
((SELECT id FROM apps WHERE name = 'Aerospace'),
 (SELECT id FROM categories c JOIN apps a ON c.app_id = a.id WHERE c.name = 'Workspace' AND a.name = 'Aerospace'),
 'Alt-1', 'Focus workspace 1', 1),
((SELECT id FROM apps WHERE name = 'Aerospace'),
 (SELECT id FROM categories c JOIN apps a ON c.app_id = a.id WHERE c.name = 'Workspace' AND a.name = 'Aerospace'),
 'Alt-2', 'Focus workspace 2', 1),
((SELECT id FROM apps WHERE name = 'Aerospace'),
 (SELECT id FROM categories c JOIN apps a ON c.app_id = a.id WHERE c.name = 'Workspace' AND a.name = 'Aerospace'),
 'Alt-3', 'Focus workspace 3', 1),
((SELECT id FROM apps WHERE name = 'Aerospace'),
 (SELECT id FROM categories c JOIN apps a ON c.app_id = a.id WHERE c.name = 'Workspace' AND a.name = 'Aerospace'),
 'Alt-4', 'Focus workspace 4', 1),
((SELECT id FROM apps WHERE name = 'Aerospace'),
 (SELECT id FROM categories c JOIN apps a ON c.app_id = a.id WHERE c.name = 'Workspace' AND a.name = 'Aerospace'),
 'Alt-5', 'Focus workspace 5', 1),
((SELECT id FROM apps WHERE name = 'Aerospace'),
 (SELECT id FROM categories c JOIN apps a ON c.app_id = a.id WHERE c.name = 'Workspace' AND a.name = 'Aerospace'),
 'Alt-Shift-1', 'Move window to workspace 1', 1),
((SELECT id FROM apps WHERE name = 'Aerospace'),
 (SELECT id FROM categories c JOIN apps a ON c.app_id = a.id WHERE c.name = 'Workspace' AND a.name = 'Aerospace'),
 'Alt-Shift-2', 'Move window to workspace 2', 1),
((SELECT id FROM apps WHERE name = 'Aerospace'),
 (SELECT id FROM categories c JOIN apps a ON c.app_id = a.id WHERE c.name = 'Workspace' AND a.name = 'Aerospace'),
 'Alt-Shift-3', 'Move window to workspace 3', 1),
((SELECT id FROM apps WHERE name = 'Aerospace'),
 (SELECT id FROM categories c JOIN apps a ON c.app_id = a.id WHERE c.name = 'Workspace' AND a.name = 'Aerospace'),
 'Alt-Shift-4', 'Move window to workspace 4', 1),
((SELECT id FROM apps WHERE name = 'Aerospace'),
 (SELECT id FROM categories c JOIN apps a ON c.app_id = a.id WHERE c.name = 'Workspace' AND a.name = 'Aerospace'),
 'Alt-Shift-5', 'Move window to workspace 5', 1);