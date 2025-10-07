import { promises as fs } from 'fs';
import path from 'path';

const resolvePath = (relativePath) => path.resolve(process.cwd(), relativePath);

const DATA_DIR = resolvePath('data/prompts');
const OUTPUT_PATH = resolvePath('public/prompts.json');

async function readPromptDefinitions() {
  const files = (await fs.readdir(DATA_DIR)).filter((file) => file.endsWith('.json')).sort();

  const definitions = [];

  for (const file of files) {
    const filePath = path.join(DATA_DIR, file);
    const raw = await fs.readFile(filePath, 'utf-8');

    let definition;

    try {
      definition = JSON.parse(raw);
    } catch (error) {
      throw new Error(`Failed to parse prompt file ${file}: ${error.message}`);
    }

    if (!definition?.name || !definition?.title || !definition?.description || !definition?.messages) {
      throw new Error(`Prompt file ${file} is missing required fields.`);
    }

    definitions.push(definition);
  }

  return definitions;
}

async function buildPromptData() {
  const definitions = await readPromptDefinitions();

  const prompts = definitions.map(({ name, title, description, arguments: args }) => ({
    name,
    title,
    description,
    ...(Array.isArray(args) && args.length > 0 ? { arguments: args } : {}),
  }));

  const definitionMap = definitions.reduce((acc, definition) => {
    acc[definition.name] = definition;
    return acc;
  }, {});

  const payload = {
    prompts,
    definitions: definitionMap,
  };

  await fs.writeFile(OUTPUT_PATH, `${JSON.stringify(payload, null, 2)}\n`, 'utf-8');
}

buildPromptData().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
