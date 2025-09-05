import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';

function readJson(filePath) {
  try {
    const text = readFileSync(filePath, 'utf-8');
    return JSON.parse(text);
  } catch (error) {
    console.error('Failed to read JSON at', filePath);
    console.error(error?.message || error);
    process.exit(1);
  }
}

function extractVariablesFromTemplate(template) {
  if (!template || typeof template !== 'string') return [];
  const matches = template.matchAll(/\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g);
  const names = new Set();
  for (const match of matches) {
    if (match[1]) names.add(match[1]);
  }
  return Array.from(names);
}

function buildMcpPromptsModel(source) {
  const prompts = source?.prompts || [];
  const definitions = source?.definitions || {};

  const result = prompts.map((prompt) => {
    const name = prompt?.name;
    const title = prompt?.title || name;
    const description = prompt?.description || '';
    const def = definitions?.[name] || {};
    const firstMessage = def?.messages?.[0];
    const template = firstMessage?.content?.text || '';

    const variableNames = extractVariablesFromTemplate(template);

    const inputSchema = {
      type: 'object',
      properties: Object.fromEntries(variableNames.map((v) => [v, { type: 'string' }])),
      required: variableNames
    };

    if (!name) {
      console.warn('Skipping a prompt without name');
      return null;
    }

    return {
      name,
      title,
      description,
      input_schema: inputSchema,
      template
    };
  }).filter(Boolean);

  return { prompts: result };
}

function main() {
  const repoRoot = resolve(process.cwd());
  const srcPath = resolve(repoRoot, 'prompts.json');
  const outDir = resolve(repoRoot, 'docs');
  const outFile = resolve(outDir, 'prompts.mcp.json');

  const source = readJson(srcPath);
  const mcpModel = buildMcpPromptsModel(source);

  mkdirSync(outDir, { recursive: true });
  writeFileSync(outFile, JSON.stringify(mcpModel, null, 2));
  console.log('Wrote', outFile);
}

main();



