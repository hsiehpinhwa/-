-- Phase 5: Database Query Optimization (Indexes)

-- 藝術品查詢非常依賴狀態 (AVAILABLE/RESERVED/SOLD)
CREATE INDEX IF NOT EXISTS idx_artworks_status ON artworks (status);

-- 價格表上的 VIP 條件也是查詢時常用過濾條件
CREATE INDEX IF NOT EXISTS idx_artwork_prices_vip ON artwork_prices (is_vip_only);

-- 會員個人紀錄查詢相當頻繁
CREATE INDEX IF NOT EXISTS idx_reservations_collector_id ON reservations (collector_id);
