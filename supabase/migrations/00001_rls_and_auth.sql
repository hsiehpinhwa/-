-- 1. Create Reservations Table (預約紀錄)
CREATE TYPE reservation_status AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED');

CREATE TABLE reservations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    artwork_id UUID REFERENCES artworks(id) ON DELETE CASCADE,
    collector_id UUID REFERENCES collectors(id) ON DELETE CASCADE,
    status reservation_status DEFAULT 'PENDING',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Extract Price into a separate table
-- 解釋：PostgreSQL 的 RLS 是「資料列 (Row)」層級。
-- 為了滿足「一般會員無法讀取 VIP 專屬藏品的詳細定價」，但仍能看到藝術品本身，
-- 將價格獨立成表套用 RLS 是最嚴謹且符合 Supabase 哲學的做法。
CREATE TABLE artwork_prices (
    artwork_id UUID PRIMARY KEY REFERENCES artworks(id) ON DELETE CASCADE,
    price NUMERIC(12, 2) NOT NULL,
    is_vip_only BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 將現有的 price 資料移轉至新表 (預設皆非 VIP 專屬)
INSERT INTO artwork_prices (artwork_id, price)
SELECT id, price FROM artworks WHERE price IS NOT NULL;

-- 安全地移除 artworks 表格的 price 欄位
ALTER TABLE artworks DROP COLUMN price;


-- 3. Enable RLS (啟用資料列安全政策)
ALTER TABLE collectors ENABLE ROW LEVEL SECURITY;
ALTER TABLE artworks ENABLE ROW LEVEL SECURITY;
ALTER TABLE exhibition_artworks ENABLE ROW LEVEL SECURITY;
ALTER TABLE exhibitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE artwork_prices ENABLE ROW LEVEL SECURITY;

-- 4. Supabase Auth Trigger (註冊時自動建立 Collector 紀錄)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.collectors (auth_user_id, name, email, level)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.email,
    'GENERAL'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Helper function: 取得當前請求使用者的 Collector ID
CREATE OR REPLACE FUNCTION public.get_current_collector_id()
RETURNS UUID AS $$
  SELECT id FROM collectors WHERE auth_user_id = auth.uid() LIMIT 1;
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Helper function: 取得當前請求使用者的 VIP 等級
CREATE OR REPLACE FUNCTION public.get_current_collector_level()
RETURNS collector_level AS $$
  SELECT level FROM collectors WHERE auth_user_id = auth.uid() LIMIT 1;
$$ LANGUAGE sql STABLE SECURITY DEFINER;


-- 5. 定義 RLS Policies

-- ==========================================
-- [Collectors 會員資料]
-- ==========================================
CREATE POLICY "Users can view own collector profile" 
ON collectors FOR SELECT 
USING (auth_user_id = auth.uid());

CREATE POLICY "Users can update own collector profile" 
ON collectors FOR UPDATE 
USING (auth_user_id = auth.uid());

-- ==========================================
-- [Artworks 藝術品]
-- ==========================================
-- 所有人皆可看見藝術品基本資訊
CREATE POLICY "Public artworks are viewable by everyone" 
ON artworks FOR SELECT 
USING (true);

-- ==========================================
-- [Artwork Prices 價格]
-- ==========================================
-- 所有人皆可看見一般價格
CREATE POLICY "General prices are viewable by everyone" 
ON artwork_prices FOR SELECT 
USING (NOT is_vip_only);

-- VIP 價格：僅限登入且為 VIP 等級的使用者可見
CREATE POLICY "VIP prices are viewable by VIPs only" 
ON artwork_prices FOR SELECT 
USING (
  is_vip_only AND public.get_current_collector_level() = 'VIP'::collector_level
);

-- ==========================================
-- [Reservations 預約紀錄]
-- ==========================================
-- 使用者只能看到自己的預約
CREATE POLICY "Users can view own reservations" 
ON reservations FOR SELECT 
USING (
  collector_id = public.get_current_collector_id()
);

-- 使用者只能建立屬於自己的預約
CREATE POLICY "Users can create own reservations" 
ON reservations FOR INSERT 
WITH CHECK (
  collector_id = public.get_current_collector_id()
);

-- ==========================================
-- [公開唯讀區：Exhibitions, Gallery Info]
-- ==========================================
CREATE POLICY "Exhibitions viewable by everyone" ON exhibitions FOR SELECT USING (true);
CREATE POLICY "Exhibition artworks viewable by everyone" ON exhibition_artworks FOR SELECT USING (true);
CREATE POLICY "Gallery info viewable by everyone" ON gallery_info FOR SELECT USING (true);
