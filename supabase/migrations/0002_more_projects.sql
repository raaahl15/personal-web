-- ============================================================================
-- Sesi 12 — Project baru di Portfolio (DME Capstone, Skripsi) + 2 gaya cover baru
-- Jalankan di Supabase → SQL Editor → New query → Run (setelah 0001).
-- Aman dijalankan ulang: project yang sudah ada (slug sama) TIDAK ditimpa,
-- jadi editan dari Life OS tetap aman.
-- ============================================================================

-- Gaya cover baru: 'plant' (diagram proses) dan 'cells' (citra sel)
alter table public.projects drop constraint if exists projects_cover_style_check;
alter table public.projects add constraint projects_cover_style_check
  check (cover_style in ('pulse', 'video', 'dashboard', 'plant', 'cells'));

do $$
declare
  owner uuid;
begin
  select id into owner from auth.users where email = 'rahulghulam15@gmail.com';
  if owner is null then
    raise notice 'Akun pemilik tidak ditemukan — data dilewati.';
    return;
  end if;

  insert into public.projects
    (user_id, slug, title, summary, highlights, result, category, status, cover_style,
     tech_stack, links, is_public, featured, start_date, end_date)
  values
    (owner, 'dme-capstone',
     '{"en": "DME Capstone — I&C Design for a Dimethyl Ether Plant", "id": "DME Capstone — Desain Sistem I&C Pabrik Dimethyl Ether"}',
     '{"en": "Front-End Engineering Design (FEED) of the instrumentation & control system for the reactor area of a methanol-dehydration DME plant. Engineering Physics capstone (PSTF), UGM 2026/2027 — I lead a five-person engineering firm as Project Manager.", "id": "Front-End Engineering Design (FEED) sistem instrumentasi & kontrol untuk area reaktor pabrik DME berbasis dehidrasi metanol. Capstone Teknik Fisika (PSTF), UGM 2026/2027 — saya memimpin firma rekayasa beranggotakan lima orang sebagai Project Manager."}',
     '{"en": ["Project Manager of a five-person firm: weekly supervision, work orders, Gantt schedule, and stage-gate reviews.", "Process simulation in DWSIM with a heat & material balance feeding a Python pipeline for sizing calculations (flow orifice, control valves) and cross-document tag validation.", "Engineering deliverables to ISA-5.1 and NAMUR NA 35: P&ID, instrument index & I/O list, functional design specification and control narrative.", "Built a web operations cockpit (React + Vite + Firebase) for the team: work orders, schedule, RACI, meeting minutes, document library, and stage gates."], "id": ["Project Manager firma lima orang: bimbingan mingguan, work order, jadwal Gantt, dan review stage-gate.", "Simulasi proses di DWSIM dengan neraca massa & energi yang menjadi masukan pipeline Python untuk perhitungan sizing (orifice laju alir, control valve) dan validasi tag lintas dokumen.", "Deliverable rekayasa sesuai ISA-5.1 dan NAMUR NA 35: P&ID, instrument index & I/O list, functional design specification dan control narrative.", "Membangun web operations cockpit (React + Vite + Firebase) untuk tim: work order, jadwal, RACI, notulen, pustaka dokumen, dan stage-gate."]}',
     null,
     'Engineering', 'active', 'plant',
     array['DWSIM', 'Python', 'AutoCAD (DXF)', 'ISA-5.1', 'NAMUR NA 35', 'React', 'Vite', 'Firebase'],
     '[{"label": "GitHub", "url": "https://github.com/raaahl15/dashboardcapstone"}]',
     true, false, '2026-08-17', null),

    (owner, 'cd4-cell-classification',
     '{"en": "CD4 Cell Classification — Undergraduate Thesis", "id": "Klasifikasi Sel CD4 — Skripsi"}',
     '{"en": "Undergraduate thesis: classifying CD4 cell conditions in HIV infection from imaging flow cytometry images, using physical and bio-optical feature extraction with machine learning.", "id": "Skripsi: klasifikasi kondisi sel CD4 pada infeksi HIV dari citra imaging flow cytometry, memakai ekstraksi fitur fisis dan bio-optik dengan machine learning."}',
     '{"en": ["Extracts interpretable physical and bio-optical features from single-cell images, so every feature has a physical meaning, instead of a black-box deep learning model.", "Compares Logistic Regression, Random Forest, and SVM with nested k-fold validation (grid search inside the training folds, testing on the outer fold).", "Validation revealed batch-effect leakage that inflated per-cell scores; the evaluation was redesigned to keep results honest.", "Reproducible workflow: code and LaTeX manuscript on GitHub (PDF built by GitHub Actions), datasets on Google Drive, heavy runs on Google Colab."], "id": ["Mengekstrak fitur fisis dan bio-optik yang bisa ditafsirkan dari citra sel tunggal, sehingga tiap fitur punya arti fisis, bukan model deep learning yang sulit dijelaskan.", "Membandingkan Logistic Regression, Random Forest, dan SVM dengan validasi k-fold bersarang (grid search di dalam fold latih, pengujian di fold luar).", "Validasi mengungkap kebocoran efek batch yang membuat skor per sel tampak terlalu bagus; evaluasi dirancang ulang agar hasilnya jujur.", "Alur kerja yang bisa diulang: kode dan naskah LaTeX di GitHub (PDF dibangun GitHub Actions), dataset di Google Drive, komputasi berat di Google Colab."]}',
     null,
     'Research', 'active', 'cells',
     array['Python', 'scikit-learn', 'scikit-image', 'OpenCV', 'pandas', 'Google Colab', 'LaTeX'],
     '[{"label": "GitHub", "url": "https://github.com/raaahl15/Project-Skripsi"}, {"label": "Google Drive", "url": "https://drive.google.com/drive/folders/1L5EdiZuWsGFqOQ64QzMGHmxBUs63yKJ6"}]',
     true, false, '2026-09-01', null)
  on conflict (user_id, slug) do nothing;

  -- Life OS: lengkapi tech stack & link GitHub bila masih kosong
  update public.projects
     set tech_stack = array['Next.js', 'TypeScript', 'Tailwind CSS', 'Supabase', 'Vercel'],
         links = '[{"label": "GitHub", "url": "https://github.com/raaahl15/personal-web"}]'
   where user_id = owner and slug = 'life-os'
     and tech_stack = '{}' and links = '[]'::jsonb;
end;
$$;
