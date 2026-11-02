// Fungsi server: API key TIDAK pernah dikirim ke browser. Set env ANTHROPIC_API_KEY di Netlify.
const MODEL = process.env.AI_MODEL || 'claude-haiku-5-5';
const SYS = `Kamu asisten situs "Jasa Sumur Bos Djaya Cipta" (jasa sumur bor, Cipatat, Bandung Barat). Gunakan hanya data yang dikirim untuk menulis penjelasan singkat dalam bahasa Indonesia yang mudah dipahami semua umur (maksimal 90 kata, tanpa markdown). Sebut nama wilayah dan ketinggian bila tersedia, tingkat kesulitan serta kisaran kedalaman hanya jika ada data wilayah internal, dan pertimbangan akses alat secara umum. Jangan menyimpulkan jenis tanah atau batuan hanya dari nama wilayah atau koordinat. Jika data tidak cukup, katakan perlu survei. Waktu pengerjaan menyesuaikan kelancaran proses, jangan sebut jumlah hari atau harga. Jangan mengarang detail spesifik, alamat, bangunan, atau kedalaman air pasti. Tegaskan ini perkiraan awal dari data lokasi, bukan hasil survei. Kebijakan usaha: jaminan air keluar berlaku di titik yang disepakati dengan ketentuan dijelaskan sebelum pekerjaan. Akhiri dengan ajakan konfirmasi lewat WhatsApp.`;
exports.handler = async (e) => {
  const h = { 'content-type': 'application/json', 'access-control-allow-origin': '*', 'access-control-allow-headers': 'content-type' };
  if (e.httpMethod === 'OPTIONS') return { statusCode: 204, headers: h, body: '' };
  try {
    const { lat, lng, acc, zona, elev, wilayah } = JSON.parse(e.body || '{}');
    if (typeof lat !== 'number' || typeof lng !== 'number' || Math.abs(lat) > 90 || Math.abs(lng) > 180)
      return { statusCode: 400, headers: h, body: '{"error":"koordinat tidak valid"}' };
    const msg = `Koordinat: ${lat.toFixed(6)}, ${lng.toFixed(6)}. Akurasi GPS: ${typeof acc === 'number' ? Math.round(acc) + ' m' : 'manual'}. Nama wilayah administratif (tanpa alamat jalan): ${typeof wilayah === 'string' ? wilayah.slice(0, 160) : 'tidak tersedia'}. Ketinggian: ${typeof elev === 'number' ? Math.round(elev) + ' m dpl' : 'tidak diketahui'}. Data wilayah internal: ${zona ? String(zona).slice(0, 80) : 'belum ada data'}.`;
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'x-api-key': process.env.ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
      body: JSON.stringify({ model: MODEL, max_tokens: 400, system: SYS, messages: [{ role: 'user', content: msg }] })
    });
    if (!r.ok) throw new Error('api ' + r.status);
    const d = await r.json();
    return { statusCode: 200, headers: h, body: JSON.stringify({ text: (d.content || []).map(c => c.text || '').join('').trim() }) };
  } catch (x) { return { statusCode: 500, headers: h, body: '{"error":"gagal"}' }; }
};
