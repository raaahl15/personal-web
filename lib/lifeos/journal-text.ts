/**
 * Teks polos dari blok BlockNote (rekursif, termasuk anak & sel tabel) — untuk pencarian & cuplikan.
 * Modul murni (tanpa impor BlockNote) supaya bisa dipakai sebelum editor dimuat.
 */
type LooseBlock = { content?: unknown; children?: LooseBlock[] };

const inline = (content: unknown): string => {
  if (!Array.isArray(content)) return "";
  return content
    .map((c) => {
      if (typeof c !== "object" || c === null) return "";
      if ("text" in c && typeof c.text === "string") return c.text;
      if ("content" in c) return inline(c.content); // link
      return "";
    })
    .join("");
};

export function blocksToText(blocks: unknown[]): string {
  const out: string[] = [];
  const walk = (list: LooseBlock[]) => {
    for (const b of list) {
      if (typeof b !== "object" || b === null) continue;
      const content = b.content;
      if (Array.isArray(content)) out.push(inline(content));
      else if (content && typeof content === "object" && "rows" in content && Array.isArray(content.rows)) {
        for (const row of content.rows as { cells?: unknown[] }[]) {
          out.push(
            (row.cells ?? [])
              .map((cell) => inline(typeof cell === "object" && cell && "content" in cell ? cell.content : cell))
              .join(" "),
          );
        }
      }
      if (Array.isArray(b.children) && b.children.length) walk(b.children);
    }
  };
  walk(blocks as LooseBlock[]);
  return out.filter(Boolean).join("\n");
}
