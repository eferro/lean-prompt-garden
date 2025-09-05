import { writeFileSync, mkdirSync } from 'node:fs';
import { chromium } from 'playwright';

const url = 'https://www.rebiun.org/observatorio-de-inteligencia-artificial/prompts';
const outDir = new URL('../snapshots/', import.meta.url).pathname;
mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });

// basic metadata
const metadata = await page.evaluate(() => ({
  title: document.title,
  h1: document.querySelector('h1')?.innerText || null,
  h2s: [...document.querySelectorAll('h2')].map(h=>h.innerText),
  links: [...document.querySelectorAll('a')].slice(0, 50).map(a=>({text:a.textContent?.trim(), href:a.href}))
}));

await page.screenshot({ path: `${outDir}/rebiun-prompts.png`, fullPage: true });
writeFileSync(`${outDir}/rebiun-prompts.json`, JSON.stringify(metadata, null, 2));

await browser.close();
console.log('Snapshot saved to snapshots/');
