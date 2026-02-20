-- Insert Gallery Info
INSERT INTO gallery_info (purpose, offline_hours, address)
VALUES (
    '致力於推廣頂級日本當代藝術與傳統工藝的交匯',
    '週二至週日 10:00 - 18:00 (週一休館)',
    '106 台北市大安區藝術路 1 號'
);

-- Insert Collectors (Using static UUIDs)
INSERT INTO collectors (id, auth_user_id, name, email, level)
VALUES 
('c1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'Taro Yamada', 'taro@example.com', 'GENERAL'),
('c2222222-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', 'Hanako VIP', 'hanako@example.com', 'VIP');

-- Insert Artworks (Using static UUIDs to link to prices)
INSERT INTO artworks (id, accession_number, object_title, artist_maker, creation_date, medium_materials, dim_h, dim_w, dim_d, status)
VALUES 
('a1111111-1111-1111-1111-111111111111', 'ART-2024-001', '春之雪 (Spring Snow)', 'Yao, Chien', '2024', 'Oil on Canvas', 120, 80, 5, 'AVAILABLE'),
('a2222222-2222-2222-2222-222222222222', 'ART-2024-002', '京都秋月 (Autumn Moon in Kyoto)', 'Sato, Kenji', '2023', 'Woodblock Print', 60, 45, 2, 'AVAILABLE'),
('a3333333-3333-3333-3333-333333333333', 'ART-2022-015', '無相 (Formless)', 'Suzuki, Mei', '2022', 'Ceramic', 30, 30, 30, 'SOLD');

-- Insert Artwork Prices
INSERT INTO artwork_prices (artwork_id, price, is_vip_only)
VALUES 
('a1111111-1111-1111-1111-111111111111', 150000.00, false),
('a2222222-2222-2222-2222-222222222222', 45000.00, false),
('a3333333-3333-3333-3333-333333333333', 85000.00, true);

-- Insert Exhibition
INSERT INTO exhibitions (id, title, description, start_date, end_date, is_active)
VALUES 
('e1111111-1111-1111-1111-111111111111', '現代浮世繪展', '探索當代藝術家如何重新詮釋傳統浮世繪技術。', '2026-03-01', '2026-05-31', true);

-- Link Artwork to Exhibition
INSERT INTO exhibition_artworks (exhibition_id, artwork_id, display_order)
VALUES 
('e1111111-1111-1111-1111-111111111111', 'a1111111-1111-1111-1111-111111111111', 1),
('e1111111-1111-1111-1111-111111111111', 'a2222222-2222-2222-2222-222222222222', 2);

-- Insert Reservations
INSERT INTO reservations (artwork_id, collector_id, status)
VALUES
('a1111111-1111-1111-1111-111111111111', 'c1111111-1111-1111-1111-111111111111', 'PENDING');
