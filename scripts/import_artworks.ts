import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import { parse } from 'csv-parse/sync';

// 環境變數檢查：因為這是一支管理員腳本，需要直接寫入受 RLS 保護的表格，
// 必須使用 Service Role Key (Bypass RLS) 或在本地端預設即可。
// 你可以在指令前面加上變數例如：
// SUPABASE_URL="http://127.0.0.1:54321" SUPABASE_SERVICE_KEY="..." npx tsx scripts/import_artworks.ts sample_artworks.csv
const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("❌ 錯誤：找不到 Supabase URL 或 Service Role Key 環境變數！");
    console.error("請在執行前設定 SUPABASE_URL 和 SUPABASE_SERVICE_ROLE_KEY。");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function importArtworks(filePath: string) {
    console.log(`📂 正在讀取 CSV 檔案: ${filePath}`);

    // 讀取與解析 CSV
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const records = parse(fileContent, {
        columns: true, // 將第一行作為 Object Key
        skip_empty_lines: true,
        trim: true,
    });

    console.log(`✅ 成功解析 CSV，共 ${records.length} 筆資料準備匯入...`);
    let successCount = 0;
    let errorCount = 0;

    for (const row of records) {
        try {
            console.log(`正在處理: [${row.accession_number}] ${row.object_title}...`);

            // 1. 寫入 artworks 基本資料表
            const { data: artwork, error: artworkError } = await supabase
                .from('artworks')
                .insert({
                    accession_number: row.accession_number,
                    object_title: row.object_title,
                    artist_maker: row.artist_maker,
                    creation_date: row.creation_date || null,
                    medium_materials: row.medium_materials || null,
                    dim_h: row.dim_h ? parseFloat(row.dim_h) : null,
                    dim_w: row.dim_w ? parseFloat(row.dim_w) : null,
                    dim_d: row.dim_d ? parseFloat(row.dim_d) : null,
                    status: row.status || 'AVAILABLE',
                })
                .select('id')
                .single();

            if (artworkError) throw new Error(`[Artworks Table] ${artworkError.message}`);

            // 2. 寫入 artwork_prices 價格關聯資料表 (如果有提供價格)
            if (row.price && row.price.trim() !== "") {
                const isVip = String(row.is_vip_only).toUpperCase() === 'TRUE';

                const { error: priceError } = await supabase
                    .from('artwork_prices')
                    .insert({
                        artwork_id: artwork.id,
                        price: parseFloat(row.price),
                        is_vip_only: isVip
                    });

                if (priceError) throw new Error(`[Artwork Prices Table] ${priceError.message}`);
            }

            successCount++;
        } catch (err: any) {
            console.error(`❌ 匯入失敗 [${row.accession_number}]: ${err.message}`);
            errorCount++;
        }
    }

    console.log(`\n🎉 匯入完成！`);
    console.log(`✅ 成功: ${successCount} 筆`);
    console.log(`❌ 失敗: ${errorCount} 筆`);
}

// 取得命令列傳入的檔案路徑
const args = process.argv.slice(2);
if (args.length === 0) {
    console.error("❌ 錯誤：請提供 CSV 檔案路徑！");
    console.error("範例: npx tsx scripts/import_artworks.ts sample_artworks.csv");
    process.exit(1);
}

importArtworks(args[0]).catch(console.error);
