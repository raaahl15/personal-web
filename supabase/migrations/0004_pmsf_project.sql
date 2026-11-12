-- ============================================================================
-- Sesi 13 — Project PMSF (Pembelajaran Mesin untuk Sistem Fisis) di Portfolio
-- Jalankan di Supabase → SQL Editor → New query → Run (setelah 0001 & 0002).
-- Aman dijalankan ulang: bila slug sudah ada, data TIDAK ditimpa.
-- Folder Drive kelompok sengaja tidak ditautkan (akses link = Editor) — MASTER.md K-40.
-- ============================================================================

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
    (owner, 'pmsf-hydraulic-valve',
     '{"en": "Hydraulic Valve Monitoring — Machine Learning for Physical Systems (PMSF)", "id": "Monitoring Katup Hidrolik — Pembelajaran Mesin untuk Sistem Fisis (PMSF)"}',
     '{"en": "Group project for the Machine Learning for Physical Systems (PMSF) course, UGM: classifying the condition of a hydraulic valve from multi-sensor test-rig data with scikit-learn. I led the five-person team as Project Lead.", "id": "Project kelompok mata kuliah Pembelajaran Mesin untuk Sistem Fisis (PMSF), UGM: klasifikasi kondisi katup hidrolik dari data multi-sensor rig uji dengan scikit-learn. Saya memimpin tim lima orang sebagai Project Lead."}',
     '{"en": ["Project Lead of a five-person team: work orders, an experiment log, and a one-day sprint from dataset selection to the final report.", "Combined physics-based features with 68 statistical sensor features; with the physics features even Logistic Regression reached an F1-macro of 1.000 on the held-out test set (450 cycles), versus 0.878 for the best statistical-feature model.", "Leak-free validation with a grouped split by 50-cycle blocks (StratifiedGroupKFold), showing that a random split overstates the score (Random Forest F1 0.982 random vs 0.804 grouped).", "Compared seven scikit-learn models, tuned with GridSearchCV, and interpreted with permutation importance — pressure-sensor features ranked highest."], "id": ["Project Lead tim lima orang: work order, log eksperimen, dan sprint satu hari dari pemilihan dataset sampai laporan akhir.", "Menggabungkan fitur fisis dengan 68 fitur statistik sensor; dengan fitur fisis, Logistic Regression pun mencapai F1-macro 1,000 di data uji terpisah (450 siklus), dibanding 0,878 untuk model terbaik berfitur statistik.", "Validasi bebas kebocoran dengan split berkelompok per blok 50 siklus (StratifiedGroupKFold), yang menunjukkan split acak membuat skor terlalu optimis (Random Forest F1 0,982 acak vs 0,804 berkelompok).", "Membandingkan tujuh model scikit-learn, tuning dengan GridSearchCV, dan interpretasi dengan permutation importance — fitur sensor tekanan paling berpengaruh."]}',
     '{"en": "Test F1-macro 1.000 with physics-based features", "id": "F1-macro uji 1,000 dengan fitur fisis"}',
     'Machine Learning', 'done', 'pulse',
     array['Python', 'scikit-learn', 'pandas', 'matplotlib', 'Google Colab'],
     '[{"label": "Dataset (UCI)", "url": "https://archive.ics.uci.edu/dataset/447/condition+monitoring+of+hydraulic+systems"}]',
     true, false, '2026-11-03', '2026-11-05')
  on conflict (user_id, slug) do nothing;
end;
$$;
