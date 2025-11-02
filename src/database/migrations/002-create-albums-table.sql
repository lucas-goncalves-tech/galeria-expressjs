CREATE TABLE IF NOT EXISTS albums (
    id TEXT PRIMARY KEY,
    cover_image_key TEXT DEFAULT NULL,
    title TEXT NOT NULL,
    description TEXT,
    user_id TEXT NOT NULL,
    visibility TEXT DEFAULT 'PRIVATE' NOT NULL CHECK (visibility IN ('PUBLIC', 'PRIVATE')),
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) STRICT;