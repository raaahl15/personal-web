import type { Metadata } from "next";
import { ComingSoon } from "@/components/lifeos/coming-soon";

export const metadata: Metadata = { title: "Invest" };

export default function InvestPage() {
  return (
    <ComingSoon
      title="Invest"
      phase="Fase 5 (setelah Money dasar)"
      description="Portofolio trading & investasi: forex, saham, crypto, dan instrumen lain."
      features={[
        "Catat trade beli/jual atau long/short, harga, fee, akun broker",
        "Posisi terbuka, rata-rata harga, P/L terealisasi",
        "Jurnal trading: alasan masuk dan pelajaran",
        "Harga diisi manual dulu; integrasi API harga menyusul",
      ]}
    />
  );
}