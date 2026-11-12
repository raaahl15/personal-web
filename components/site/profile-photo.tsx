import Image from "next/image";
import portraitSrc from "@/public/images/rahul-portrait.jpg";
import avatarSrc from "@/public/images/rahul-avatar.jpg";
import type { Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

/*
 * Foto profil (dikirim Rahul 2026-11-12). File di public/images/ sudah dipotong & dikompres dari
 * aslinya (4000×6000): potret 1200×1440 (5:6) dan avatar wajah 256×256. next/image membuat
 * srcset WebP/AVIF sesuai `sizes`.
 */

const PORTRAIT_ALT: Record<Locale, string> = {
  en: "Rahul Ghulam Hidayatulloh smiling, wearing a navy UGM Engineering shirt",
  id: "Rahul Ghulam Hidayatulloh tersenyum, mengenakan kemeja biru tua Fakultas Teknik UGM",
};

/** Potret mengisi bingkai induk (induk wajib `relative` + ukuran/aspect). */
export function ProfilePortrait({
  lang,
  sizes,
  preload = false,
  className,
}: {
  lang: Locale;
  sizes: string;
  /** true hanya bila foto terlihat saat halaman pertama dibuka (LCP). */
  preload?: boolean;
  className?: string;
}) {
  return (
    <Image
      src={portraitSrc}
      alt={PORTRAIT_ALT[lang]}
      fill
      sizes={sizes}
      preload={preload}
      placeholder="blur"
      className={cn("object-cover object-[50%_20%]", className)}
    />
  );
}

/** Avatar bulat. Dekoratif bila nama ditulis di sebelahnya (alt kosong). */
export function ProfileAvatar({ className = "size-11", alt = "" }: { className?: string; alt?: string }) {
  return (
    <Image
      src={avatarSrc}
      alt={alt}
      width={88}
      height={88}
      sizes="56px"
      className={cn("shrink-0 rounded-full bg-sky-200 object-cover", className)}
    />
  );
}
