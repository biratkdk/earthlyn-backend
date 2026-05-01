CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE TABLE IF NOT EXISTS users (
  user_id BIGSERIAL PRIMARY KEY,
  email VARCHAR(320) NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  display_name VARCHAR(120) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT users_email_not_blank CHECK (length(trim(email)) > 0),
  CONSTRAINT users_display_name_not_blank CHECK (length(trim(display_name)) > 0)
);

CREATE TABLE IF NOT EXISTS user_preferences (
  user_id BIGINT PRIMARY KEY REFERENCES users(user_id) ON DELETE CASCADE,
  genres TEXT[] NOT NULL DEFAULT '{}',
  pace VARCHAR(40) NOT NULL DEFAULT '',
  length_preference VARCHAR(40) NOT NULL DEFAULT '',
  favorite_authors TEXT NOT NULL DEFAULT '',
  loved_books TEXT NOT NULL DEFAULT '',
  min_rating NUMERIC(3, 1) NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS books (
  book_id BIGSERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  author VARCHAR(255) NOT NULL,
  isbn VARCHAR(32) UNIQUE,
  genre VARCHAR(100) NOT NULL,
  shelf_location VARCHAR(100) NOT NULL,
  tags TEXT[] NOT NULL DEFAULT '{}',
  summary TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT books_title_author_unique UNIQUE (title, author),
  CONSTRAINT books_title_not_blank CHECK (length(trim(title)) > 0),
  CONSTRAINT books_author_not_blank CHECK (length(trim(author)) > 0),
  CONSTRAINT books_genre_not_blank CHECK (length(trim(genre)) > 0),
  CONSTRAINT books_shelf_location_not_blank CHECK (length(trim(shelf_location)) > 0)
);

CREATE TABLE IF NOT EXISTS scan_history (
  scan_id BIGSERIAL PRIMARY KEY,
  user_id BIGINT REFERENCES users(user_id) ON DELETE CASCADE,
  device_id VARCHAR(80) NOT NULL DEFAULT '',
  scan_method VARCHAR(60) NOT NULL,
  scanned_title TEXT NOT NULL DEFAULT '',
  scanned_author TEXT NOT NULL DEFAULT '',
  scanned_isbn VARCHAR(32) NOT NULL DEFAULT '',
  ocr_text TEXT NOT NULL DEFAULT '',
  matched_book_id BIGINT REFERENCES books(book_id) ON DELETE SET NULL,
  matched_confidence NUMERIC(8, 3),
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS reading_list (
  reading_list_id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  book_id BIGINT REFERENCES books(book_id) ON DELETE SET NULL,
  external_book_key VARCHAR(255) NOT NULL DEFAULT '',
  title VARCHAR(255) NOT NULL,
  author VARCHAR(255) NOT NULL DEFAULT '',
  cover_image TEXT,
  source VARCHAR(40) NOT NULL DEFAULT 'catalog',
  amazon_url TEXT,
  google_url TEXT,
  open_library_url TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT reading_list_unique_saved_book UNIQUE (user_id, title, author)
);

CREATE TABLE IF NOT EXISTS goodreads_imports (
  goodreads_import_id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  author VARCHAR(255) NOT NULL DEFAULT '',
  rating INTEGER,
  exclusive_shelf VARCHAR(80) NOT NULL DEFAULT '',
  date_read VARCHAR(80) NOT NULL DEFAULT '',
  raw_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS rate_limit_buckets (
  key TEXT PRIMARY KEY,
  hits INTEGER NOT NULL DEFAULT 0,
  reset_at TIMESTAMPTZ NOT NULL
);

CREATE INDEX IF NOT EXISTS books_title_idx ON books (title);
CREATE INDEX IF NOT EXISTS books_author_idx ON books (author);
CREATE INDEX IF NOT EXISTS books_genre_idx ON books (genre);
CREATE INDEX IF NOT EXISTS books_shelf_location_idx ON books (shelf_location);
CREATE INDEX IF NOT EXISTS books_tags_gin_idx ON books USING GIN (tags);
CREATE INDEX IF NOT EXISTS scan_history_user_idx ON scan_history (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS reading_list_user_idx ON reading_list (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS goodreads_imports_user_idx ON goodreads_imports (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_rate_limit_buckets_reset_at ON rate_limit_buckets(reset_at);

ALTER TABLE books ADD COLUMN IF NOT EXISTS summary TEXT;
ALTER TABLE books ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
ALTER TABLE books ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
ALTER TABLE scan_history ADD COLUMN IF NOT EXISTS user_id BIGINT REFERENCES users(user_id) ON DELETE CASCADE;
ALTER TABLE scan_history ADD COLUMN IF NOT EXISTS metadata JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE reading_list ADD COLUMN IF NOT EXISTS metadata JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE reading_list ADD COLUMN IF NOT EXISTS cover_image TEXT;
ALTER TABLE reading_list ADD COLUMN IF NOT EXISTS external_book_key VARCHAR(255) NOT NULL DEFAULT '';
ALTER TABLE goodreads_imports ADD COLUMN IF NOT EXISTS raw_payload JSONB NOT NULL DEFAULT '{}'::jsonb;

INSERT INTO books (title, author, isbn, genre, shelf_location, tags, summary)
VALUES
  ('1984', 'George Orwell', '9780451524935', 'Dystopian', 'Shelf B, Row 2', ARRAY['dystopia', 'classic']::TEXT[], 'A surveillance-state classic about truth, power, and control.'),
  ('Brave New World', 'Aldous Huxley', '9780060850524', 'Dystopian', 'Shelf B, Row 2', ARRAY['dystopia', 'science fiction']::TEXT[], 'A future society built on engineered comfort, caste, and obedience.'),
  ('To Kill a Mockingbird', 'Harper Lee', '9780061120084', 'Classic', 'Shelf A, Row 3', ARRAY['justice', 'classic']::TEXT[], 'A Southern coming-of-age novel centered on race, conscience, and courage.'),
  ('The Hobbit', 'J.R.R. Tolkien', '9780547928227', 'Fantasy', 'Shelf C, Row 1', ARRAY['fantasy', 'adventure']::TEXT[], 'Bilbo Baggins is pulled into a quest involving dwarves, dragons, and treasure.'),
  ('Dune', 'Frank Herbert', '9780441172719', 'Science Fiction', 'Shelf D, Row 2', ARRAY['desert', 'epic']::TEXT[], 'An epic political and ecological saga set on the desert planet Arrakis.'),
  ('Sapiens', 'Yuval Noah Harari', '9780062316110', 'Nonfiction', 'Shelf E, Row 1', ARRAY['history', 'civilization']::TEXT[], 'A sweeping history of humankind from prehistory to modern systems.'),
  ('Atomic Habits', 'James Clear', '9780735211292', 'Self-Help', 'Shelf E, Row 3', ARRAY['habits', 'productivity']::TEXT[], 'A practical guide to behavior change through small consistent improvements.'),
  ('The Handmaid''s Tale', 'Margaret Atwood', '9780385490818', 'Dystopian', 'Shelf B, Row 3', ARRAY['dystopia', 'classic']::TEXT[], 'A speculative novel about power, patriarchy, and resistance.'),
  ('Project Hail Mary', 'Andy Weir', '9780593135204', 'Science Fiction', 'Shelf D, Row 4', ARRAY['space', 'problem-solving', 'survival']::TEXT[], 'A lone astronaut wakes up with a scientific problem that decides Earth''s future.'),
  ('Circe', 'Madeline Miller', '9780316556347', 'Fantasy', 'Shelf C, Row 2', ARRAY['mythology', 'literary', 'retelling']::TEXT[], 'A mythic retelling centered on power, exile, and self-definition.'),
  ('The Song of Achilles', 'Madeline Miller', '9780062060624', 'Historical Fiction', 'Shelf C, Row 2', ARRAY['mythology', 'romance', 'retelling']::TEXT[], 'A lyrical retelling of Achilles and Patroclus through war, loyalty, and fate.'),
  ('The Midnight Library', 'Matt Haig', '9780525559474', 'Literary Fiction', 'Shelf A, Row 2', ARRAY['speculative', 'life choices', 'accessible']::TEXT[], 'A speculative novel about alternate lives and the weight of regret.'),
  ('Klara and the Sun', 'Kazuo Ishiguro', '9780593318171', 'Science Fiction', 'Shelf D, Row 3', ARRAY['literary', 'ai', 'quiet']::TEXT[], 'An artificial friend observes love, illness, and hope in a near-future world.'),
  ('The Seven Husbands of Evelyn Hugo', 'Taylor Jenkins Reid', '9781501161933', 'Historical Fiction', 'Shelf A, Row 4', ARRAY['celebrity', 'romance', 'book club']::TEXT[], 'A reclusive Hollywood icon reveals the story behind fame, love, and reinvention.'),
  ('A Gentleman in Moscow', 'Amor Towles', '9780143110439', 'Historical Fiction', 'Shelf A, Row 5', ARRAY['historical', 'character', 'elegant']::TEXT[], 'A Russian count builds a rich interior life while confined inside a grand hotel.'),
  ('The Thursday Murder Club', 'Richard Osman', '9781984880963', 'Mystery', 'Shelf F, Row 1', ARRAY['cozy mystery', 'humor', 'series']::TEXT[], 'Four retirees investigate cold cases and fresh trouble with warmth and wit.'),
  ('Gone Girl', 'Gillian Flynn', '9780307588371', 'Thriller', 'Shelf F, Row 2', ARRAY['psychological', 'twist', 'crime']::TEXT[], 'A sharp psychological thriller about a missing wife and an unstable public story.'),
  ('The Silent Patient', 'Alex Michaelides', '9781250301697', 'Thriller', 'Shelf F, Row 2', ARRAY['psychological', 'twist', 'fast read']::TEXT[], 'A therapist pursues the truth behind a silent artist accused of murder.'),
  ('Educated', 'Tara Westover', '9780399590504', 'Memoir', 'Shelf E, Row 2', ARRAY['memoir', 'education', 'resilience']::TEXT[], 'A memoir about family, isolation, education, and rebuilding a life.'),
  ('The Psychology of Money', 'Morgan Housel', '9780857197689', 'Nonfiction', 'Shelf E, Row 3', ARRAY['money', 'behavior', 'essays']::TEXT[], 'Short essays on wealth, behavior, risk, patience, and decision making.'),
  ('Deep Work', 'Cal Newport', '9781455586691', 'Self-Help', 'Shelf E, Row 3', ARRAY['focus', 'productivity', 'work']::TEXT[], 'A practical argument for focused work in a distracted environment.'),
  ('The Night Circus', 'Erin Morgenstern', '9780307744432', 'Fantasy', 'Shelf C, Row 3', ARRAY['magical realism', 'romance', 'atmospheric']::TEXT[], 'A dreamlike competition unfolds inside a mysterious traveling circus.'),
  ('Pachinko', 'Min Jin Lee', '9781455563937', 'Historical Fiction', 'Shelf A, Row 5', ARRAY['family saga', 'korea', 'literary']::TEXT[], 'A multigenerational family saga across Korea and Japan.'),
  ('The Martian', 'Andy Weir', '9780553418026', 'Science Fiction', 'Shelf D, Row 4', ARRAY['space', 'survival', 'humor']::TEXT[], 'A stranded astronaut uses engineering, humor, and persistence to survive Mars.')
ON CONFLICT (isbn) DO UPDATE SET
  title = EXCLUDED.title,
  author = EXCLUDED.author,
  genre = EXCLUDED.genre,
  shelf_location = EXCLUDED.shelf_location,
  tags = EXCLUDED.tags,
  summary = EXCLUDED.summary,
  updated_at = NOW();
