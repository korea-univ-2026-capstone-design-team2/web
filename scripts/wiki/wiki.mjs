#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const wikiRoot = path.join(root, "wiki");
const indexPath = path.join(wikiRoot, "index.md");
const logPath = path.join(wikiRoot, "log.md");

function nowParts() {
  const now = new Date();
  const date = now.toISOString().slice(0, 10);
  const timestamp = now.toISOString().replace(/:/g, "-").replace(/\..+$/, "");
  const pretty = `${date} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
  return { date, timestamp, pretty };
}

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (!token.startsWith("--")) continue;
    const key = token.slice(2);
    const next = argv[i + 1];
    if (!next || next.startsWith("--")) {
      args[key] = true;
      continue;
    }
    args[key] = next;
    i += 1;
  }
  return args;
}

function slugify(input) {
  return String(input)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9가-힣\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

async function ensureFile(filePath, content) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  try {
    await fs.access(filePath);
  } catch {
    await fs.writeFile(filePath, content, "utf8");
  }
}

async function appendLog(operation, title) {
  const { pretty } = nowParts();
  const line = `\n## [${pretty}] ${operation} | ${title}\n`;
  await ensureFile(logPath, "# Wiki Log\n");
  await fs.appendFile(logPath, line, "utf8");
}

function addIndexEntry(indexContent, sectionTitle, entryLine) {
  const lines = indexContent.split("\n");
  const sectionStart = lines.findIndex((line) => line.trim() === `## ${sectionTitle}`);
  if (sectionStart === -1) return indexContent;

  let insertAt = sectionStart + 1;
  while (insertAt < lines.length && !lines[insertAt].startsWith("## ")) {
    insertAt += 1;
  }

  let endAt = insertAt;
  while (endAt > sectionStart + 1 && lines[endAt - 1].trim() === "") {
    endAt -= 1;
  }

  const existing = lines.slice(sectionStart + 1, endAt);
  const hasEntry = existing.some((line) => line.trim() === entryLine.trim());
  if (hasEntry) return indexContent;

  const placeholderIndex = existing.findIndex((line) => line.includes("(작성 예정)"));
  if (placeholderIndex >= 0) {
    lines.splice(sectionStart + 1 + placeholderIndex, 1, entryLine);
  } else {
    lines.splice(endAt, 0, entryLine);
  }

  return lines.join("\n");
}

async function upsertIndex(section, entryLine) {
  await ensureFile(indexPath, "# Wiki Index\n");
  const content = await fs.readFile(indexPath, "utf8");
  const next = addIndexEntry(content, section, entryLine);
  if (next !== content) {
    await fs.writeFile(indexPath, next, "utf8");
  }
}

function sourceTemplate({ rawRelPath, title, date, type }) {
  return `---\nsource: ${rawRelPath}\nsource_type: ${type}\nconfidence: medium\nupdated_at: ${date}\n---\n\n# ${title}\n\n## Summary\n- \n\n## Key Facts\n- \n\n## Implications for oh-my-study\n- \n\n## Contradictions / Caveats\n- \n\n## Related\n- [[overview]]\n`;
}

function queryTemplate({ question, date }) {
  return `---\nasked_at: ${date}\nconfidence: medium\n---\n\n# ${question}\n\n## Answer\n- \n\n## Evidence\n- [[sources/<source-slug>]]\n\n## Follow-ups\n- \n`;
}

function sessionTemplate({ title, date }) {
  return `# ${title}\n\n## Date\n- ${date}\n\n## Context\n- \n\n## Changes\n- \n\n## Decisions\n- \n\n## Next\n- \n`;
}

async function ingest(args) {
  const title = args.title ? String(args.title).trim() : "Untitled Source";
  const slugBase = args.slug ? String(args.slug) : title;
  const slug = slugify(slugBase) || "source";
  const sourceType = args.type ? String(args.type) : "article";
  const { date } = nowParts();

  const rawFileName = `${date}-${slug}.md`;
  const rawRelPath = `raw/${rawFileName}`;
  const rawAbsPath = path.join(wikiRoot, rawRelPath);
  const sourceAbsPath = path.join(wikiRoot, "sources", `${slug}.md`);

  await ensureFile(
    rawAbsPath,
    `# ${title}\n\n## Metadata\n- captured_at: ${date}\n- type: ${sourceType}\n\n## Content\n<!-- paste source content here -->\n`
  );

  await ensureFile(
    sourceAbsPath,
    sourceTemplate({ rawRelPath, title, date, type: sourceType })
  );

  await upsertIndex("Sources", `- [[sources/${slug}]] - ${title}`);
  await appendLog("ingest", title);

  console.log(`Created/updated source scaffold:\n- ${rawRelPath}\n- sources/${slug}.md`);
}

async function query(args) {
  const question = args.question ? String(args.question).trim() : "Untitled question";
  const slugBase = args.slug ? String(args.slug) : question;
  const slug = slugify(slugBase) || "query";
  const { date } = nowParts();

  const fileName = `${date}-${slug}.md`;
  const absPath = path.join(wikiRoot, "queries", fileName);

  await ensureFile(absPath, queryTemplate({ question, date }));
  await upsertIndex("Queries", `- [[queries/${fileName.replace(/\.md$/, "")}]] - ${question}`);
  await appendLog("query", question);

  console.log(`Created query note: queries/${fileName}`);
}

async function session(args) {
  const title = args.title ? String(args.title).trim() : "Session note";
  const slugBase = args.slug ? String(args.slug) : title;
  const slug = slugify(slugBase) || "session";
  const { date } = nowParts();

  const fileName = `${date}-${slug}.md`;
  const absPath = path.join(wikiRoot, "sessions", fileName);

  await ensureFile(absPath, sessionTemplate({ title, date }));
  await upsertIndex("Sessions", `- [[sessions/${fileName.replace(/\.md$/, "")}]] - ${title}`);
  await appendLog("session", title);

  console.log(`Created session note: sessions/${fileName}`);
}

async function listMarkdown(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if (entry.name.startsWith(".")) continue;
    const abs = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      const nested = await listMarkdown(abs);
      files.push(...nested);
    } else if (entry.isFile() && entry.name.endsWith(".md")) {
      files.push(abs);
    }
  }
  return files;
}

function toWikiKey(absPath) {
  const rel = path.relative(wikiRoot, absPath).replace(/\\/g, "/");
  return rel.replace(/\.md$/, "");
}

function parseWikiLinks(content) {
  const matches = [...content.matchAll(/\[\[([^\]]+)\]\]/g)];
  return matches.map((m) => m[1].split("|")[0].trim()).filter(Boolean);
}

async function lint() {
  const { timestamp } = nowParts();
  const reportPath = path.join(wikiRoot, "lint", `${timestamp}.md`);

  const allMd = await listMarkdown(wikiRoot);
  const managed = allMd.filter((file) => {
    const rel = path.relative(wikiRoot, file).replace(/\\/g, "/");
    if (rel === "README.md") return false;
    if (rel.startsWith("raw/")) return false;
    if (rel.startsWith("templates/")) return false;
    if (rel.startsWith("schema/")) return false;
    if (rel.startsWith("insights/")) return false;
    return true;
  });

  const indexContent = await fs.readFile(indexPath, "utf8").catch(() => "");
  const indexedLinks = new Set(parseWikiLinks(indexContent));

  const pageKeys = managed
    .map(toWikiKey)
    .filter((key) => key !== "index" && key !== "log")
    .sort();

  const missingInIndex = pageKeys.filter((key) => !indexedLinks.has(key));

  const inbound = new Map(pageKeys.map((k) => [k, 0]));
  for (const file of managed) {
    const fileKey = toWikiKey(file);
    const content = await fs.readFile(file, "utf8");
    const links = parseWikiLinks(content);
    for (const link of links) {
      if (inbound.has(link) && link !== fileKey) {
        inbound.set(link, (inbound.get(link) ?? 0) + 1);
      }
    }
  }

  const orphanCandidates = [...inbound.entries()]
    .filter(([, count]) => count === 0)
    .map(([key]) => key)
    .filter((key) => key !== "overview" && !key.startsWith("lint/"));

  const sourcePages = managed.filter((file) => toWikiKey(file).startsWith("sources/"));
  const provenanceMissing = [];
  const staleSources = [];

  for (const file of sourcePages) {
    const content = await fs.readFile(file, "utf8");
    const sourceLine = content
      .split("\n")
      .find((line) => line.toLowerCase().startsWith("source:"));

    if (!sourceLine) {
      provenanceMissing.push(toWikiKey(file));
      continue;
    }

    const rawRel = sourceLine.slice("source:".length).trim();
    const rawAbs = path.join(wikiRoot, rawRel);
    try {
      const [rawStat, summaryStat] = await Promise.all([fs.stat(rawAbs), fs.stat(file)]);
      if (rawStat.mtimeMs > summaryStat.mtimeMs) {
        staleSources.push(`${toWikiKey(file)} (raw newer)`);
      }
    } catch {
      staleSources.push(`${toWikiKey(file)} (raw missing)`);
    }
  }

  const issues = missingInIndex.length + orphanCandidates.length + provenanceMissing.length + staleSources.length;

  const report = [
    `# Lint Report - ${timestamp}`,
    "",
    "## Summary",
    `- total_pages: ${pageKeys.length}`,
    `- issues: ${issues}`,
    "",
    "## Missing In Index",
    ...(missingInIndex.length ? missingInIndex.map((x) => `- ${x}`) : ["- none"]),
    "",
    "## Orphan Candidates",
    ...(orphanCandidates.length ? orphanCandidates.map((x) => `- ${x}`) : ["- none"]),
    "",
    "## Provenance Missing",
    ...(provenanceMissing.length ? provenanceMissing.map((x) => `- ${x}`) : ["- none"]),
    "",
    "## Stale Source Summaries",
    ...(staleSources.length ? staleSources.map((x) => `- ${x}`) : ["- none"]),
    "",
  ].join("\n");

  await fs.mkdir(path.dirname(reportPath), { recursive: true });
  await fs.writeFile(reportPath, report, "utf8");
  await upsertIndex("Lint", `- [[lint/${timestamp}]] - lint run`);
  await appendLog("lint", `issues=${issues}`);

  console.log(`Lint report written: lint/${timestamp}.md (issues=${issues})`);
}

function printUsage() {
  console.log(`Usage:
  node scripts/wiki/wiki.mjs ingest --title "<title>" [--slug <slug>] [--type article]
  node scripts/wiki/wiki.mjs query --question "<question>" [--slug <slug>]
  node scripts/wiki/wiki.mjs session --title "<title>" [--slug <slug>]
  node scripts/wiki/wiki.mjs lint`);
}

async function main() {
  const [, , command, ...rest] = process.argv;
  const args = parseArgs(rest);

  if (!command || command === "help" || command === "--help") {
    printUsage();
    return;
  }

  if (command === "ingest") {
    await ingest(args);
    return;
  }

  if (command === "query") {
    await query(args);
    return;
  }

  if (command === "session") {
    await session(args);
    return;
  }

  if (command === "lint") {
    await lint();
    return;
  }

  printUsage();
  process.exitCode = 1;
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
