import type { Metadata } from "next";
import { ComingSoon } from "@/components/lifeos/coming-soon";

export const metadata: Metadata = { title: "Money" };

export default function MoneyPage() {
  return (
    <ComingSoon
      title="Money"
      phase="Fase 5"
      description="Pencatatan keuangan dengan dua mata uang: IDR dan USD."
      features={[
        "Akun: cash, bank, e-wallet, broker — masing-masing dengan mata uangnya",
        "Transaksi pemasukan, pengeluaran, transfer (dengan kurs tersirat IDR ↔ USD)",
        "Budget bulanan per kategori + peringatan hampir habis",
        "Grafik pengeluaran per kategori dan tren bulanan",
      ]}
    />
  );
}