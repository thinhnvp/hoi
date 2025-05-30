import 'dotenv/config';   
import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { createResource } from '../actions/resources';


/** Duyệt đệ quy lấy danh sách file .md */
async function* walk(dir: string): AsyncGenerator<string> {
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const res = path.resolve(dir, entry.name);
    if (entry.isDirectory()) yield* walk(res);
    else if (entry.name.endsWith(".md")) yield res;
  }
}

(async () => {
  const root = "data/raw";

  for await (const file of walk(root)) {
    const raw = await fs.readFile(file, "utf8");
    const { data, content } = matter(raw);

    // Lấy taxonomy từ đường dẫn nếu YAML thiếu
    const rel = path.relative(root, file).split(path.sep);
    const [cat, sub] = rel;                       // eg: '02-career', 'experience'
    const topic = path.basename(file, ".md");     // filename

    await createResource({
      category: data.category ?? cat ?? null,
      sub:      data.sub      ?? sub ?? null,
      topic:    data.topic    ?? topic ?? null,
      meta:     data ?? null,
      content:  content})
    .then(res => {
        if (!res) throw new Error("Missing return from createResource");
        console.log(`✅  ${file} - ${res}`);
    })
    .catch(err => console.error(`❌  ${file} - ${err}`));
  }

  console.log("✅  Ingest hoàn tất!");
  process.exit(0);
})();