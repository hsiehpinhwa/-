const { Client } = require('pg');

async function testConnection() {
    const client = new Client({
        connectionString: 'postgresql://postgres:postgres@127.0.0.1:54322/postgres',
    });

    try {
        await client.connect();
        console.log('Connected to local Supabase DB');

        const resArtworks = await client.query('SELECT object_title, price FROM artworks;');
        console.log('\n--- Artworks ---');
        console.table(resArtworks.rows);

        const resCollectors = await client.query('SELECT name, level FROM collectors;');
        console.log('\n--- Collectors ---');
        console.table(resCollectors.rows);

        const resExhibition = await client.query('SELECT title, start_date FROM exhibitions;');
        console.log('\n--- Exhibitions ---');
        console.table(resExhibition.rows);

    } catch (err) {
        console.error('Connection error', err.stack);
    } finally {
        await client.end();
    }
}

testConnection();
