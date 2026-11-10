# Aturan Project

- `MASTER.md` adalah satu-satunya dokumen acuan: konsep, sistem, keputusan, history, saran.
- **Setiap sesi kerja WAJIB memperbarui `MASTER.md`** sebelum commit, mengikuti
  Bagian 14 (log pengerjaan, log keputusan, saran/langkah berikutnya, header status).
- Jangan membuat dokumen konsep terpisah; kalau perlu dipecah, tautkan dari `MASTER.md`.
- Ikuti stack & keputusan di Log Keputusan (Bagian 11) kecuali ada keputusan baru yang dicatat.
- Bahasa dokumen: Indonesia.

## Skill acuan: UI/UX Pro Max
- Skill project di `.claude/skills/ui-ux-pro-max/` (sumber: github.com/nextlevelbuilder/ui-ux-pro-max-skill,
  v2.15.0, commit `4f2dbb6`, MIT). Muat skill ini untuk setiap pekerjaan UI/UX: desain di FigCraft,
  membangun halaman/komponen, review tampilan, aksesibilitas, animasi.
- Jalankan dari root repo: `python .claude/skills/ui-ux-pro-max/scripts/search.py "<query>" --domain <domain>`
  (stack kita: `--stack nextjs`, `--stack shadcn`, `--stack html-tailwind`).
- **Keputusan di `MASTER.md` (Bagian 6, K-09–K-12) lebih tinggi daripada rekomendasi skill.**
  Gaya, palet, dan font sudah dikunci; pakai skill untuk aturan UX, aksesibilitas, kontras dark/light,
  preset animasi (GSAP), pedoman stack, dan Pre-Delivery Checklist.
- **Jangan pakai `--persist`** (membuat `design-system/.../MASTER.md` terpisah). Hasil skill yang dipakai
  dicatat di `MASTER.md` Bagian 6.
- Update skill: clone ulang repo sumber, salin hanya `SKILL.md`, `data/`, `references/`, `scripts/*.py`
  (tanpa tests/validate_data), lalu ganti `${CLAUDE_PLUGIN_ROOT}/` di `SKILL.md` menjadi path relatif.
