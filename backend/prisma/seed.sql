-- PastelShop — Initial seed SQL
-- Run after creating the tables (via `manual_create.sql` or `prisma migrate deploy`)

-- Login admin diatur lewat .env (ADMIN_EMAIL / ADMIN_PASSWORD), bukan tabel database.
-- Tidak perlu insert ke tabel Admin.

-- Sample products
INSERT INTO "Product" (id, name, slug, category, description, "isActive", "sortOrder", "createdAt", "updatedAt")
VALUES
  ('prod_001', 'Netflix Premium', 'netflix-premium', 'Streaming', 'Akun Netflix Premium sharing. Nikmati film & series tanpa batas.', true, 1, NOW(), NOW()),
  ('prod_002', 'Spotify Premium', 'spotify-premium', 'Musik', 'Spotify Premium tanpa iklan, download lagu, kualitas tinggi.', true, 2, NOW(), NOW()),
  ('prod_003', 'YouTube Premium', 'youtube-premium', 'Streaming', 'YouTube tanpa iklan + YouTube Music gratis.', true, 3, NOW(), NOW()),
  ('prod_004', 'Canva Pro', 'canva-pro', 'Produktivitas', 'Canva Pro dengan semua template & fitur premium terbuka.', true, 4, NOW(), NOW())
ON CONFLICT (slug) DO NOTHING;

-- Sample options
INSERT INTO "ProductOption" (id, "productId", name, price, "isActive", "sortOrder", "createdAt", "updatedAt")
VALUES
  ('opt_001a', 'prod_001', '1 Bulan', 25000, true, 1, NOW(), NOW()),
  ('opt_001b', 'prod_001', '3 Bulan', 65000, true, 2, NOW(), NOW()),
  ('opt_002a', 'prod_002', '1 Bulan', 20000, true, 1, NOW(), NOW()),
  ('opt_002b', 'prod_002', '3 Bulan', 55000, true, 2, NOW(), NOW()),
  ('opt_003a', 'prod_003', '1 Bulan', 18000, true, 1, NOW(), NOW()),
  ('opt_004a', 'prod_004', '1 Bulan', 30000, true, 1, NOW(), NOW()),
  ('opt_004b', 'prod_004', '1 Tahun', 120000, true, 2, NOW(), NOW())
ON CONFLICT DO NOTHING;
