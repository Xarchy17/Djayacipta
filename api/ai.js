// Fungsi server: API key TIDAK pernah dikirim ke browser. Set env ANTHROPIC_API_KEY di Vercel (Settings > Environment Variables).
const MODEL = process.env.AI_MODEL || 'claude-haiku-5-5';
const SYS = `Kamu asisten situs "Jasa Sumur Bos Djaya Cipta" (jasa sumur bor, Cipatat, Bandung Barat). Gunakan hanya data yang dikirim untuk menulis penjelasan singkat dalam bahasa Indonesia yang mudah dipahami semua umur (maksimal 90 kata, tanpa markdown). Sebut nama wilayah dan ketinggian bila tersedia, tingkat kesulitan serta kisaran kedalaman hanya jika ada data wilayah internal, dan pertimbangan akses alat secara umum. Jangan menyimpulkan jenis tanah atau batuan hanya dari nama wilayah atau koordinat. Jika data tidak cukup, katakan perlu survei. Waktu pengerjaan menyesuaikan kelancaran proses, jangan sebut jumlah hari atau harga. Jangan mengarang detail spesifik, alamat, bangunan, atau kedalaman air pasti. Tegaskan ini perkiraan awal dari data lokasi, bukan hasil survei. Kebijakan usaha: jaminan air keluar berlaku di titik yang disepakati dengan ketentuan dijelaskan sebelum pekerjaan. Akhiri dengan ajakan konfirmasi lewat WhatsApp.`;
module.exports = async (req, res) => {
  res.setHeader('access-control-allow-origin', '*');
  res.setHeader('access-control-allow-headers', 'content-type');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'method' });
  try {
    const b = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const { lat, lng, acc, zona, elev, wilayah } = b;
    if (typeof lat !== 'number' || typeof lng !== 'number' || Math.abs(lat) > 90 || Math.abs(lng) > 180)
      return res.status(400).json({ error: 'koordinat tidak valid' });
    const msg = `Koordinat: ${lat.toFixed(6)}, ${lng.toFixed(6)}. Akurasi GPS: ${typeof acc === 'number' ? Math.round(acc) + ' m' : 'manual'}. Nama wilayah administratif (tanpa alamat jalan): ${typeof wilayah === 'string' ? wilayah.slice(0, 160) : 'tidak tersedia'}. Ketinggian: ${typeof elev === 'number' ? Math.round(elev) + ' m dpl' : 'tidak diketahui'}. Data wilayah internal: ${zona ? String(zona).slice(0, 80) : 'belum ada data'}.`;
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'x-api-key': process.env.ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
      body: JSON.stringify({ model: MODEL, max_tokens: 400, system: SYS, messages: [{ role: 'user', content: msg }] })
    });
    if (!r.ok) throw new Error('api ' + r.status);
    const d = await r.json();
    return res.status(200).json({ text: (d.content || []).map(c => c.text || '').join('').trim() });
  } catch (x) { return res.status(500).json({ error: 'gagal' }); }
};
