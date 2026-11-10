import { Suspense } from "react";
import { BottomNav, Sidebar } from "@/components/lifeos/nav";
import { AvatarFallback, UserAvatar } from "@/components/lifeos/user";

// Shell Life OS (Fase 2): sidebar pil (desktop) + bottom nav (HP). Proteksi utama ada di
// proxy.ts; bagian yang membaca sesi (avatar, sapaan) streaming di dalam <Suspense>,
// sehingga kerangka halaman tetap prerender statis dan langsung tampil.
export default function LifeOsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative isolate min-h-dvh overflow-x-clip">
      <div aria-hidden className="pointer-events-none fixed -top-40 right-[-10%] -z-10 h-[34rem] w-[44rem] rounded-full bg-backdrop opacity-60 blur-[120px]" />
      <div aria-hidden className="pointer-events-none fixed bottom-[-20%] left-[10%] -z-10 h-[30rem] w-[40rem] rounded-full bg-backdrop opacity-40 blur-[120px]" />

      <Sidebar
        avatar={
          <Suspense fallback={<AvatarFallback />}>
            <UserAvatar />
          </Suspense>
        }
      />
      <main className="animate-page px-4 pt-8 pb-32 sm:px-6 md:pt-8 md:pr-6 md:pb-10 md:pl-[128px]">
        <div className="mx-auto max-w-[1288px]">{children}</div>
      </main>
      <BottomNav />
    </div>
  );
}
