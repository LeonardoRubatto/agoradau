import { readFile, readdir, writeFile, mkdir, stat, unlink } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { Liquid } from "liquidjs";
import MarkdownIt from "markdown-it";
import { parse as parseYaml } from "yaml";

const root = fileURLToPath(new URL("../", import.meta.url));
const checkOnly = process.argv.includes("--check");
const at = (...parts) => join(root, ...parts);
const read = (file) => readFile(file, "utf8");
const markdown = new MarkdownIt({ html: true });
const generated = "<!-- Copie portable générée par npm run build. -->";
const maxAssetBytes = 25 * 1024 ** 2;

function frontMatter(raw) {
  const text = raw.replace(/^\uFEFF/, "").replace(/\r\n/g, "\n");
  const match = /^---\n([\s\S]*?)\n---(?:\n|$)/.exec(text);
  if (!match) return { data: {}, body: text };
  return { data: parseYaml(match[1]) || {}, body: text.slice(match[0].length) };
}

function headingId(title) {
  return title.toLocaleLowerCase("fr").replace(/[^\p{Letter}\p{Number}\s_-]/gu, "").trim().replace(/\s+/g, "-") || "section";
}

function renderMarkdown(value) {
  if (!value) return "";
  const tokens = markdown.parse(String(value), {});
  const seen = new Map();
  for (let i = 0; i < tokens.length - 1; i++) {
    if (tokens[i].type !== "heading_open") continue;
    const text = (tokens[i + 1].children || []).map((token) => token.content).join("");
    const base = headingId(text);
    const count = seen.get(base) || 0;
    tokens[i].attrSet("id", count ? base + "-" + count : base);
    seen.set(base, count + 1);
  }
  return markdown.renderer.render(tokens, markdown.options, {});
}

const engine = new Liquid({ root: at("_layouts"), partials: at("_includes"), jekyllInclude: true, strictFilters: true });
engine.registerFilter("jsonify", (value) => JSON.stringify(value ?? null));
engine.registerFilter("markdownify", renderMarkdown);
engine.registerFilter("strip_newlines", (s) => String(s ?? "").replace(/\r?\n/g, ""));

async function collection(name, pathPrefix, defaults = {}) {
  const directory = at("_" + name);
  const files = (await readdir(directory)).filter((file) => /\.md$/i.test(file));
  return Promise.all(files.map(async (file) => {
    const { data, body } = frontMatter(await read(join(directory, file)));
    const slug = file.slice(0, -3);
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) throw new Error("Nom de fichier invalide : " + file);
    return {
      ...defaults,
      ...data,
      slug,
      collection: name,
      relative_path: "_" + name + "/" + file,
      url: data.permalink || (pathPrefix ? "/" + pathPrefix + "/" + slug + "/" : null),
      content: renderMarkdown(data.body || body)
    };
  }));
}

function checkMetadata(item) {
  if (!item.title || !item.date || !/^\d{4}-\d{2}-\d{2}$/.test(String(item.date))) {
    throw new Error("Titre ou date manquante (AAAA-MM-JJ) : " + item.relative_path);
  }
  const prefix = "/" + item.collection + "/";
  if (item.url && (!item.url.startsWith(prefix) || !/^\/[a-z0-9-]+\/[a-z0-9-]+\/$/.test(item.url))) {
    throw new Error("Adresse inattendue : " + item.url);
  }
}

async function checkMedia(value, audio = false) {
  if (!value) return;
  const valid = audio ? /^\/media\/audio\/[a-zA-Z0-9][a-zA-Z0-9._-]*\.(mp3|m4a|wav|ogg|oga)$/i : /^\/(?!\/)(?!.*\.\.)(?!.*[?#])/;
  if (!valid.test(value)) throw new Error("Chemin de média invalide : " + value);
  const item = await stat(at(value.slice(1))).catch(() => null);
  if (!item?.isFile() || item.size === 0) throw new Error("Média manquant : " + value);
  if (item.size > maxAssetBytes) {
    throw new Error("Ce média dépasse la limite de 25 Mio par fichier sur Cloudflare Pages : " + value);
  }
}

async function validateContent(analyses, news, podcasts) {
  const urls = new Set();
  for (const item of [...analyses, ...news]) {
    checkMetadata(item);
    if (urls.has(item.url)) throw new Error("Adresse dupliquée : " + item.url);
    urls.add(item.url);
    await checkMedia(item.cover);
    await checkMedia(item.partner_logo);
  }

  const episodes = new Set();
  for (const episode of podcasts) {
    checkMetadata(episode);
    if (!Number.isInteger(episode.episode) || episode.episode < 1 || episodes.has(episode.episode)) {
      throw new Error("Numéro d’épisode invalide ou dupliqué : " + episode.relative_path);
    }
    episodes.add(episode.episode);
    await checkMedia(episode.cover);
    await checkMedia(episode.audio, true);
    for (const clip of episode.excerpts || []) {
      if (!clip.title || !clip.audio) throw new Error("Titre ou fichier manquant pour un extrait : " + episode.relative_path);
      await checkMedia(clip.audio, true);
    }
  }
}

async function readPages() {
  const files = (await readdir(at("_pages"))).filter((file) => /\.(html|xml)$/.test(file));
  return Promise.all(files.map(async (file) => {
    const { data, body } = frontMatter(await read(at("_pages", file)));
    return { ...data, body, url: data.permalink };
  }));
}

async function readData() {
  const data = {};
  for (const file of await readdir(at("_data"))) {
    if (!/\.(yml|json)$/.test(file)) continue;
    data[file.replace(/\.(yml|json)$/, "")] = parseYaml(await read(at("_data", file)));
  }
  return data;
}

async function audioSizeOutput() {
  const directory = at("media", "audio");
  const names = (await readdir(directory, { withFileTypes: true }))
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .sort();
  const sizes = Object.create(null);
  for (const name of names) {
    const { size } = await stat(join(directory, name));
    if (size > maxAssetBytes) {
      throw new Error("Ce média dépasse la limite de 25 Mio par fichier sur Cloudflare Pages : /media/audio/" + name);
    }
    sizes[name] = size;
  }
  return ["_data/audio-sizes.json", JSON.stringify(sizes, null, 2) + "\n"];
}

async function renderLayout(name, content, scope) {
  if (!name) return content;
  const { data, body } = frontMatter(await read(at("_layouts", name + ".html")));
  const output = await engine.parseAndRender(body, { ...scope, content });
  return renderLayout(data.layout, output, scope);
}

function outputPath(url) {
  return url.endsWith("/") ? url.slice(1) + "index.html" : url.slice(1);
}

const config = parseYaml(await read(at("_config.yml")));
const articleDefaults = config.defaults.find((entry) => entry.scope.type === "analyses").values;
const newsDefaults = config.defaults.find((entry) => entry.scope.type === "actualites").values;
const [analyses, actualites, podcasts, pages, data] = await Promise.all([
  collection("analyses", "analyses", articleDefaults),
  collection("actualites", "actualites", newsDefaults),
  collection("podcasts"),
  readPages(),
  readData()
]);
await validateContent(analyses, actualites, podcasts);
const site = { ...config, analyses, actualites, podcasts, pages, data };
const outputs = [];
for (const page of [...pages, ...analyses, ...actualites]) {
  const scope = { site, page, root: page.root || "./" };
  const content = page.collection ? page.content : await engine.parseAndRender(page.body, scope);
  const rendered = (await renderLayout(page.layout, content, scope)).trimStart();
  const marked = rendered.replace(/^(<!doctype html>|<\?xml[^?]*\?>)/i, "$1\n" + generated);
  outputs.push([outputPath(page.url), marked.endsWith("\n") ? marked : marked + "\n"]);
}

const pageCount = outputs.length;
outputs.push(await audioSizeOutput());
const expected = new Set(outputs.map(([file]) => file));
const staleRoutes = [];
for (const folder of ["analyses", "actualites"]) {
  const entries = await readdir(at(folder), { withFileTypes: true }).catch((error) => {
    if (error.code === "ENOENT") return [];
    throw error;
  });
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const file = folder + "/" + entry.name + "/index.html";
    if (expected.has(file)) continue;
    const contents = await read(at(file)).catch(() => "");
    if (contents.includes(generated)) staleRoutes.push(file);
  }
}

if (checkOnly) {
  const stale = [...staleRoutes];
  for (const [file, html] of outputs) {
    const current = await read(at(file)).catch(() => null);
    if (current !== html) stale.push(file);
  }
  if (stale.length) {
    throw new Error("Fichiers à régénérer avec npm run build : " + stale.join(", "));
  }
} else {
  for (const [file, html] of outputs) {
    const target = at(file);
    await mkdir(dirname(target), { recursive: true });
    await writeFile(target, html, "utf8");
  }
  for (const file of staleRoutes) await unlink(at(file));
}
console.log(`${pageCount} pages vérifiées, ${analyses.length} articles, ${actualites.length} actualités, ${podcasts.length} épisode(s).`);
