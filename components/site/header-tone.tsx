"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Navbar bergaya gelap selama berada di atas section ber-atribut `data-dark-section`
 * (mis. hero Welcome). Gaya awal sudah gelap lewat CSS (globals.css, `body:has(...)`),
 * jadi tidak ada kedip saat load; di sini hanya atribut `data-tone` yang diubah saat scroll
 * (tanpa state React). Warna bertransisi halus lewat kelas transition di navbar.
 */
export function HeaderTone({ targetId }: { targetId: string }) {
  const pathname = usePathname();

  useEffect(() => {
    const nav = document.getElementById(targetId);
    const sections = document.querySelectorAll<HTMLElement>("[data-dark-section]");
    if (!nav || sections.length === 0) return;

    const over = new Set<Element>();
    // Pita setinggi navbar (±8% teratas layar) dicek terhadap section gelap.
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) over.add(e.target);
          else over.delete(e.target);
        }
        nav.dataset.tone = over.size > 0 ? "dark" : "light";
      },
      { rootMargin: "0px 0px -92% 0px" },
    );
    sections.forEach((s) => io.observe(s));
    return () => {
      io.disconnect();
      delete nav.dataset.tone;
    };
  }, [pathname, targetId]);

  return null;
}
