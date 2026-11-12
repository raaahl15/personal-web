import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { ProfileAvatar } from "@/components/site/profile-photo";

/** Avatar di sidebar. Membaca sesi → render di dalam <Suspense>. */
export async function UserAvatar() {
  const user = await getCurrentUser();
  return (
    <Link
      href="/app/settings"
      aria-label={`Akun: ${user.email}`}
      title={user.email}
      className="grid size-12 place-items-center rounded-full border-2 border-card outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <ProfileAvatar className="size-full" />
    </Link>
  );
}

export function AvatarFallback() {
  return <span aria-hidden className="size-12 animate-pulse rounded-full bg-muted" />;
}

/** Sapaan + tanggal hari ini (WIB). Membaca sesi → di dalam <Suspense>. */
export async function Greeting() {
  const user = await getCurrentUser();
  const now = new Date();
  const hour = Number(new Intl.DateTimeFormat("id-ID", { hour: "numeric", hour12: false, timeZone: "Asia/Jakarta" }).format(now));
  const salam = hour < 11 ? "Selamat pagi" : hour < 15 ? "Selamat siang" : hour < 18 ? "Selamat sore" : "Selamat malam";
  const date = new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Jakarta",
  }).format(now);

  return (
    <div>
      <p className="text-sm font-medium text-subtle">{date}</p>
      <h1 className="mt-1 text-[clamp(2rem,4vw,2.75rem)] leading-tight font-light">
        {salam}, {user.name}
      </h1>
    </div>
  );
}

export function GreetingFallback() {
  return (
    <div aria-hidden className="flex flex-col gap-3">
      <span className="h-4 w-56 animate-pulse rounded-full bg-muted" />
      <span className="h-10 w-80 max-w-full animate-pulse rounded-full bg-muted" />
    </div>
  );
}

/** Email akun untuk halaman Pengaturan. */
export async function AccountEmail() {
  const user = await getCurrentUser();
  return <span className="font-semibold break-all">{user.email || "—"}</span>;
}
