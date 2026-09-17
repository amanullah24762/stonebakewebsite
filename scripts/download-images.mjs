import { readFile, writeFile } from "node:fs/promises";
const entries = Object.entries(
  JSON.parse(await readFile("public/images/sources.json", "utf8")),
);
await Promise.all(
  entries.map(async ([name, url]) => {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`${name}: ${response.status}`);
    await writeFile(
      `public/images/${name}.jpg`,
      Buffer.from(await response.arrayBuffer()),
    );
    console.log(`Downloaded ${name}`);
  }),
);
