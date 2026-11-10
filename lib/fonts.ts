import { Inter, Instrument_Serif, Outfit } from "next/font/google";

// Font (K-10, K-24): Outfit judul, Inter isi, Instrument Serif Italic untuk 1–2 kata aksen.
// Dipakai oleh kedua root layout: situs publik (app/[lang]) dan area privat (app/(private)).
const outfit = Outfit({ variable: "--font-outfit", subsets: ["latin"] });
const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: "italic",
});

export const fontVariables = `${outfit.variable} ${inter.variable} ${instrumentSerif.variable}`;

// Dipasang sebelum paint: tema tanpa kedip (tersimpan → ikut sistem) + kelas .js.
export const themeScript = `(function(){var e=document.documentElement;e.classList.add("js");try{var t=localStorage.getItem("theme");var d=t?t==="dark":matchMedia("(prefers-color-scheme: dark)").matches;if(d)e.classList.add("dark")}catch(x){}})()`;
