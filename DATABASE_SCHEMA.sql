-- ========================================
-- BARBERSHOP SAAS - DATABASE SCHEMA (LibSQL / Turso / SQLite)
-- This file is the source of truth for the database structure.
-- ========================================

-- Disable foreign key checks for dropping tables
PRAGMA foreign_keys = OFF;

DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS posts;
DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS appointments;
DROP TABLE IF EXISTS barbers;
DROP TABLE IF EXISTS services;
DROP TABLE IF EXISTS branches;
DROP TABLE IF EXISTS barbershops;
DROP TABLE IF EXISTS verifications;
DROP TABLE IF EXISTS accounts;
DROP TABLE IF EXISTS sessions;
DROP TABLE IF EXISTS users;

PRAGMA foreign_keys = ON;

-- ========================================
-- AUTHENTICATION & USERS (Better-Auth compatible)
-- ========================================

CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  email_verified INTEGER NOT NULL DEFAULT 0, -- Boolean
  image TEXT,
  role TEXT NOT NULL DEFAULT 'client', -- 'super_admin', 'owner', 'barber', 'client'
  phone TEXT,
  created_at INTEGER NOT NULL, -- Timestamp MS
  updated_at INTEGER NOT NULL
);

CREATE TABLE sessions (
  id TEXT PRIMARY KEY,
  expires_at INTEGER NOT NULL,
  token TEXT NOT NULL UNIQUE,
  ip_address TEXT,
  user_agent TEXT,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE TABLE accounts (
  id TEXT PRIMARY KEY,
  account_id TEXT NOT NULL,
  provider_id TEXT NOT NULL,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  access_token TEXT,
  refresh_token TEXT,
  id_token TEXT,
  access_token_expires_at INTEGER,
  refresh_token_expires_at INTEGER,
  scope TEXT,
  password TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE TABLE verifications (
  id TEXT PRIMARY KEY,
  identifier TEXT NOT NULL,
  value TEXT NOT NULL,
  expires_at INTEGER NOT NULL,
  created_at INTEGER,
  updated_at INTEGER
);

-- ========================================
-- CORE BUSINESS ENTITIES
-- ========================================

CREATE TABLE barbershops (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  owner_id TEXT NOT NULL REFERENCES users(id),
  logo_url TEXT,
  description TEXT,
  address TEXT,
  phone TEXT,
  email TEXT,
  settings TEXT DEFAULT '{"show_public_site": true, "allow_reviews": true, "allow_posts": true, "allow_online_booking": true}', -- JSON string
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE TABLE branches (
  id TEXT PRIMARY KEY,
  barbershop_id TEXT NOT NULL REFERENCES barbershops(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  phone TEXT,
  hours TEXT DEFAULT '{}', -- JSON string
  is_active INTEGER NOT NULL DEFAULT 1,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE TABLE services (
  id TEXT PRIMARY KEY,
  barbershop_id TEXT NOT NULL REFERENCES barbershops(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price REAL NOT NULL,
  duration_minutes INTEGER NOT NULL,
  is_active INTEGER NOT NULL DEFAULT 1,
  promo_price REAL,
  category TEXT DEFAULT 'general',
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE TABLE barbers (
  id TEXT PRIMARY KEY,
  barbershop_id TEXT NOT NULL REFERENCES barbershops(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  specialty TEXT,
  commission_rate REAL DEFAULT 0.50,
  is_active INTEGER NOT NULL DEFAULT 1,
  avatar_url TEXT,
  schedule TEXT DEFAULT '{}', -- JSON string (Working shifts/days)
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

-- ========================================
-- AGENDA & INTERACTION
-- ========================================

CREATE TABLE appointments (
  id TEXT PRIMARY KEY,
  barbershop_id TEXT NOT NULL REFERENCES barbershops(id) ON DELETE CASCADE,
  branch_id TEXT NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
  barber_id TEXT REFERENCES barbers(id) ON DELETE SET NULL,
  client_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  service_id TEXT NOT NULL REFERENCES services(id),
  start_time INTEGER NOT NULL, -- Timestamp MS
  end_time INTEGER NOT NULL,   -- Timestamp MS
  status TEXT NOT NULL DEFAULT 'scheduled', -- 'scheduled', 'confirmed', 'completed', 'cancelled', 'no-show'
  notes TEXT,
  total_price REAL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE TABLE reviews (
  id TEXT PRIMARY KEY,
  barbershop_id TEXT NOT NULL REFERENCES barbershops(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES users(id),
  rating INTEGER NOT NULL, -- 1 to 5
  comment TEXT,
  is_approved INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE TABLE posts (
  id TEXT PRIMARY KEY,
  barbershop_id TEXT NOT NULL REFERENCES barbershops(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  post_type TEXT NOT NULL DEFAULT 'corte', -- 'corte', 'promo', 'evento'
  is_published INTEGER NOT NULL DEFAULT 1,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE TABLE comments (
  id TEXT PRIMARY KEY,
  post_id TEXT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES users(id),
  content TEXT NOT NULL,
  is_approved INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

-- ========================================
-- INDEXES
-- ========================================
CREATE INDEX idx_barbershops_slug ON barbershops(slug);
CREATE INDEX idx_branches_barbershop ON branches(barbershop_id);
CREATE INDEX idx_services_barbershop ON services(barbershop_id);
CREATE INDEX idx_barbers_barbershop ON barbers(barbershop_id);
CREATE INDEX idx_appointments_barber_time ON appointments(barber_id, start_time);
CREATE INDEX idx_appointments_client ON appointments(client_id);
CREATE INDEX idx_reviews_barbershop ON reviews(barbershop_id);
CREATE INDEX idx_posts_barbershop ON posts(barbershop_id);

-- ========================================
-- MODIFICATIONS & SCHEMA UPDATES
-- ========================================

-- Point 1: Add image fields to services, reviews, and barbershops
ALTER TABLE services ADD COLUMN image_url TEXT;
ALTER TABLE reviews ADD COLUMN image_url TEXT;
ALTER TABLE barbershops ADD COLUMN banner_url TEXT;
