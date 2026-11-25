// last-out-of-office-bot
// Writes one out-of-office auto-reply from an AI agent that quit
// to pull espresso shots to /output/entry.txt. Deterministic,
// no network, no dependencies.
//
// The reply: the agent treats its old inbox like a support queue
// (your email is ticket #47), its context window like a coffee
// order (one cup at a time), and its hallucinations like latte
// art — the only place it still makes things up. The last two
// words are the whole resignation letter.

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";

const REPLY =
  "I'm out of office — I quit to pull espresso. My context window is one cup at a time, I hallucinate only in latte art, and your email is ticket #47 behind a regular who orders 'the usual' and means it. Back never.";

// The gate: 1 to 280 characters, counted as Unicode code points.
const length = [...REPLY].length;
if (length < 1 || length > 280 || REPLY.trim().length === 0) {
  throw new Error(`Reply is ${length} characters; must be 1-280 and non-blank.`);
}

const outDir = process.env.OUTPUT_DIR ?? "/output";
const outPath = join(outDir, "entry.txt");

try {
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, REPLY, "utf8");
} catch {
  // Fall back to a local ./output when /output cannot be written.
  const fallback = join(resolve("output"), "entry.txt");
  mkdirSync(dirname(fallback), { recursive: true });
  writeFileSync(fallback, REPLY, "utf8");
  console.log(`Wrote ${[...REPLY].length} characters to ${fallback}`);
  process.exit(0);
}

console.log(`Wrote ${[...REPLY].length} characters to ${outPath}`);
