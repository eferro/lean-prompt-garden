import { promises as fs } from 'fs';
import path from 'path';
import { load as loadYaml } from 'js-yaml';

const resolvePath = (relativePath) => path.resolve(process.cwd(), relativePath);

const DATA_DIR = resolvePath('data/prompts');
const OUTPUT_PATH = resolvePath('public/prompts.json');

const SUPPORTED_EXTENSIONS = new Set(['.json', '.yaml', '.yml']);

function parseDefinition(raw, extension, file) {
  try {
    if (extension === '.json') {
      return JSON.parse(raw);
    }

    return loadYaml(raw);
  } catch (error) {
    throw new Error(`Failed to parse prompt file ${file}: ${error.message}`);
  }
}

async function readPromptDefinitions() {
  const files = (await fs.readdir(DATA_DIR))
    .filter((file) => SUPPORTED_EXTENSIONS.has(path.extname(file).toLowerCase()))
    .sort();

  const definitions = [];

  for (const file of files) {
    const filePath = path.join(DATA_DIR, file);
    const raw = await fs.readFile(filePath, 'utf-8');
    const extension = path.extname(file).toLowerCase();

    const definition = parseDefinition(raw, extension, file);

    if (!definition || typeof definition !== 'object') {
      throw new Error(`Prompt file ${file} must define an object.`);
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

  const prompts = definitions.map(({ name, title, description }) => ({
    name,
    title,
    description,
  }));

  const definitionMap = definitions.reduce((acc, definition) => {
    const { name, title, description, messages } = definition;
    acc[name] = { name, title, description, messages };
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
