// Template dipasang ulang di setiap navigasi → konten halaman masuk dengan fade + naik 12px.
// Animasi murni CSS, jadi juga berjalan saat load pertama sebelum JS siap.
export default function PageTemplate({ children }: { children: React.ReactNode }) {
  return <div className="animate-page">{children}</div>;
}
