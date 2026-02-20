-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enum for Collector Level
CREATE TYPE collector_level AS ENUM ('GENERAL', 'VIP');

-- Enum for Artwork Status
CREATE TYPE artwork_status AS ENUM ('AVAILABLE', 'RESERVED', 'SOLD');

-- 1. Collector (藏家)
CREATE TABLE collectors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    auth_user_id UUID UNIQUE NOT NULL, -- References Supabase auth.users
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    level collector_level DEFAULT 'GENERAL',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Artwork (藝術品)
CREATE TABLE artworks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    accession_number VARCHAR(100) UNIQUE NOT NULL,
    object_title VARCHAR(255) NOT NULL,
    artist_maker VARCHAR(255) NOT NULL,
    creation_date VARCHAR(100),
    medium_materials VARCHAR(255),
    
    -- Dimensions (stored separately or as JSONB)
    dim_h NUMERIC,
    dim_w NUMERIC,
    dim_d NUMERIC,
    
    status artwork_status DEFAULT 'AVAILABLE',
    price NUMERIC(12, 2), -- Optional/Nullable for private pricing
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Exhibition (展覽)
CREATE TABLE exhibitions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_active BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Exhibition & Artwork Relation (Many-to-Many)
CREATE TABLE exhibition_artworks (
    exhibition_id UUID REFERENCES exhibitions(id) ON DELETE CASCADE,
    artwork_id UUID REFERENCES artworks(id) ON DELETE CASCADE,
    display_order INTEGER DEFAULT 0,
    PRIMARY KEY (exhibition_id, artwork_id)
);

-- 4. Gallery Info (關於我們 - Singleton pattern in DB via single row check)
CREATE TABLE gallery_info (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    purpose TEXT NOT NULL,
    offline_hours TEXT NOT NULL,
    address TEXT NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- Ensure only one row exists
CREATE UNIQUE INDEX gallery_info_singleton_idx ON gallery_info((true));
