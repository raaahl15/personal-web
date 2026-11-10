import { Suspense } from "react";
import { BottomNav, BottomNavStatic, Sidebar, SidebarStatic } from "@/components/lifeos/nav";
import { AvatarFallback, UserAvatar } from "@/components/lifeos/user";

// Shell Life OS: sidebar pil (desktop) + bottom nav (HP). Proteksi utama di proxy.ts; bagian
// yang membaca sesi (avatar, sapaan) dan pathname streaming di dalam <Suspense>, sehingga
// kerangka halaman tetap prerender statis dan langsung tampil.
export default function LifeOsLayout({ children }: { children: React.ReactNode }) {
  const avatar = (
    <Suspense fallback={<AvatarFallback />}>
      <UserAvatar />
    </Suspense>
  );
  return (
    <div className="relative isolate min-h-dvh overflow-x-clip">
      <div aria-hidden className="pointer-events-none fixed -top-40 right-[-10%] -z-10 h-[34rem] w-[44rem] rounded-full bg-backdrop opacity-60 blur-[120px]" />
      <div aria-hidden className="pointer-events-none fixed bottom-[-20%] left-[10%] -z-10 h-[30rem] w-[40rem] rounded-full bg-backdrop opacity-40 blur-[120px]" />

      <Suspense fallback={<SidebarStatic avatar={avatar} />}>
        <Sidebar avatar={avatar} />
      </Suspense>
      <main className="animate-page px-4 pt-8 pb-32 sm:px-6 md:pt-8 md:pr-6 md:pb-10 md:pl-[128px]">
        <div className="mx-auto max-w-[1288px]">{children}</div>
      </main>
      <Suspense fallback={<BottomNavStatic />}>
        <BottomNav />
      </Suspense>
    </div>
  );
}
