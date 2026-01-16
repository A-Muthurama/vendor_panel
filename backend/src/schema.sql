CREATE TABLE IF NOT EXISTS vendors (
  id SERIAL PRIMARY KEY,
  shop_name VARCHAR(255) NOT NULL,
  owner_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(50) NOT NULL,
  password_hash TEXT NOT NULL,
  state VARCHAR(100),
  city VARCHAR(100),
  pincode VARCHAR(20),
  address TEXT,
  status VARCHAR(50) DEFAULT 'PENDING',
  rejection_reason TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS kyc_documents (
  id SERIAL PRIMARY KEY,
  vendor_id INTEGER REFERENCES vendors(id) ON DELETE CASCADE,
  doc_type VARCHAR(50) NOT NULL,
  file_url TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS subscriptions (
  id SERIAL PRIMARY KEY,
  vendor_id INTEGER REFERENCES vendors(id) ON DELETE CASCADE,
  plan_name VARCHAR(50) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  total_posts INTEGER NOT NULL,
  remaining_posts INTEGER NOT NULL,
  start_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expiry_date TIMESTAMP NOT NULL,
  status VARCHAR(20) DEFAULT 'ACTIVE' -- ACTIVE, EXPIRED
);

CREATE TABLE IF NOT EXISTS offers (
  id SERIAL PRIMARY KEY,
  vendor_id INTEGER REFERENCES vendors(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  poster_url TEXT NOT NULL,
  category VARCHAR(50) NOT NULL, -- Gold, Diamond, Silver, Collection
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  shop_address TEXT NOT NULL,
  map_link TEXT,
  status VARCHAR(20) DEFAULT 'PENDING', -- PENDING, APPROVED, REJECTED, EXPIRED
  rejection_reason TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
