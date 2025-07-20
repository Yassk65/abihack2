-- Create database tables for Robi Marketplace

-- Table users (marchands et clients)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT CHECK (role IN ('marchand', 'client')) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table merchants (infos boutique)
CREATE TABLE merchants (
    user_id UUID PRIMARY KEY REFERENCES users(id),
    shop_name TEXT NOT NULL,
    shop_description TEXT
);

-- Table products (catalogue marchand)
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    merchant_id UUID NOT NULL REFERENCES merchants(user_id),
    name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    characteristics JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table bots (un bot par marchand)
CREATE TABLE bots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    merchant_id UUID NOT NULL REFERENCES merchants(user_id),
    name TEXT NOT NULL,
    personality_prompt TEXT NOT NULL,
    is_published BOOLEAN DEFAULT FALSE
);

-- Table conversations (historique chat)
CREATE TABLE conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES users(id),
    bot_id UUID NOT NULL REFERENCES bots(id),
    history JSONB DEFAULT '[]',
    created_at TIMESTAMPTZ DEFAULT NOW()
);