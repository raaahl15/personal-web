"use client";

import { useLayoutEffect, useRef } from "react";

/**
 * Konten muncul (fade + naik 20px) saat masuk viewport.
 * - Elemen yang sudah terlihat saat halaman dibuka TIDAK disembunyikan (tidak ada kedip
 *   menunggu JavaScript); mereka ikut animasi masuk halaman (template.tsx).
 * - Elemen di bawah layar diberi `data-pending` sebelum paint, lalu dilepas saat terlihat.
 * Status disimpan di atribut DOM (bukan state React) supaya tidak ada render ulang.
 */
export function Reveal({
  children,
  delay = 0,
  className,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "section" | "li" | "article";
}) {
  const ref = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (el.getBoundingClientRect().top < window.innerHeight * 0.92) return;

    el.setAttribute("data-pending", "");
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        // Satu frame jeda agar transisi benar-benar diputar dari state tersembunyi.
        requestAnimationFrame(() => el.removeAttribute("data-pending"));
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      el.removeAttribute("data-pending");
    };
  }, []);

  return (
    <Tag
      ref={ref as React.Ref<never>}
      data-reveal=""
      className={className}
      style={{ "--reveal-delay": `${delay}ms` } as React.CSSProperties}
    >
      {children}
    </Tag>
  );
}
