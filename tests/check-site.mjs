import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { extname, join, relative, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const pages = readdirSync(root)
  .filter((name) => extname(name) === '.html')
  .map((name) => join(root, name));
const imageFolders = ['assets/img', 'assets/portfolio'];
const parsedPages = new Map();
const errors = [];

function decode(value, page, line) {
  try {
    return decodeURIComponent(value);
  } catch {
    errors.push(`${relative(root, page)}:${line}: invalid URL encoding in ${value}`);
    return value;
  }
}

function parsePage(page) {
  const source = readFileSync(page, 'utf8');
  const ids = new Set();
  const tags = new Set();
  const references = [];
  const idPattern = /\s(id)\s*=\s*(["'])(.*?)\2/gi;
  const tagPattern = /<([a-z][\w:-]*)\b([^<>]*)>/gi;
  let tag;

  if (!/^<!doctype html>/i.test(source.trimStart())) {
    errors.push(`${relative(root, page)}: missing HTML5 doctype`);
  }

  while ((tag = tagPattern.exec(source)) !== null) {
    const tagName = tag[1].toLowerCase();
    tags.add(tagName);
    if (tagName === 'img' && !/\salt\s*=/i.test(tag[2])) {
      errors.push(`${relative(root, page)}:${lineAt(source, tag.index)}: image is missing alt text`);
    }

    let attribute;
    idPattern.lastIndex = 0;
    while ((attribute = idPattern.exec(tag[2])) !== null) {
      if (ids.has(attribute[3])) {
        errors.push(`${relative(root, page)}:${lineAt(source, tag.index)}: duplicate id #${attribute[3]}`);
      }
      ids.add(attribute[3]);
    }

    const attributePattern = /\s(href|src|action|srcset)\s*=\s*(["'])(.*?)\2/gi;
    let match;
    while ((match = attributePattern.exec(tag[2])) !== null) {
      if (match[1].toLowerCase() === 'srcset') {
        match[3].split(',').forEach((item) => {
          const url = item.trim().split(/\s+/)[0];
          if (url) references.push({ url, line: lineAt(source, tag.index) });
        });
      } else {
        references.push({ url: match[3], line: lineAt(source, tag.index) });
      }
    }
  }

  if (!tags.has('title')) errors.push(`${relative(root, page)}: missing page title`);
  if (!tags.has('main')) errors.push(`${relative(root, page)}: missing main landmark`);
  if (!/<html\b[^>]*\blang\s*=/i.test(source)) {
    errors.push(`${relative(root, page)}: missing document language`);
  }
  return { ids, references };
}

function lineAt(source, index) {
  return source.slice(0, index).split('\n').length;
}

function getParsedPage(page) {
  if (!parsedPages.has(page)) parsedPages.set(page, parsePage(page));
  return parsedPages.get(page);
}

function checkImageVariants() {
  const manifestPath = join(root, 'assets/image-sizes.js');
  if (!existsSync(manifestPath)) {
    errors.push('assets/image-sizes.js: missing responsive image manifest');
    return;
  }

  const source = readFileSync(manifestPath, 'utf8').trim();
  const prefix = 'window.IMAGE_SIZES = ';
  if (!source.startsWith(prefix) || !source.endsWith(';')) {
    errors.push('assets/image-sizes.js: invalid manifest format');
    return;
  }

  let manifest;
  try {
    manifest = JSON.parse(source.slice(prefix.length, -1));
  } catch (error) {
    errors.push(`assets/image-sizes.js: invalid JSON: ${error.message}`);
    return;
  }

  const originals = new Set();
  for (const folder of imageFolders) {
    for (const name of readdirSync(join(root, folder))) {
      if (!name.toLowerCase().endsWith('.jpg')) continue;
      const original = `${folder}/${name}`;
      originals.add(original);
      const variants = manifest[original];
      if (!variants) {
        errors.push(`${original}: missing entry in responsive image manifest`);
        continue;
      }
      if (!variants.small || !variants.full) {
        errors.push(`${original}: incomplete responsive image manifest entry`);
        continue;
      }
      if (variants.small.width > 640 || variants.full.width !== variants.width) {
        errors.push(`${original}: invalid responsive image widths`);
      }
      for (const variant of [variants.small, variants.full]) {
        const variantPath = variant.path ? resolve(root, variant.path) : '';
        if (!variantPath.startsWith(`${root}/`) || !existsSync(variantPath)) {
          errors.push(`${original}: missing WebP variant ${variant.path || '(no path)'}`);
        }
      }
    }
  }

  for (const original of Object.keys(manifest)) {
    if (!originals.has(original)) errors.push(`${original}: stale entry in responsive image manifest`);
  }
}

for (const page of pages) {
  const parsed = getParsedPage(page);
  for (const reference of parsed.references) {
    if (/^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(reference.url)) continue;
    const url = new URL(reference.url, pathToFileURL(page));
    const decodedPath = decode(url.pathname, page, reference.line);
    let target = reference.url.startsWith('/')
      ? resolve(root, decodedPath.slice(1))
      : resolve(decodedPath);
    if (target === root && !decodedPath.endsWith('.html')) target = join(root, 'index.html');
    if (existsSync(target) && statSync(target).isDirectory()) target = join(target, 'index.html');

    if (!target.startsWith(`${root}/`) && target !== root) {
      errors.push(`${relative(root, page)}:${reference.line}: path escapes the site root: ${reference.url}`);
      continue;
    }

    if (!existsSync(target) || !statSync(target).isFile()) {
      errors.push(`${relative(root, page)}:${reference.line}: broken local reference ${reference.url}`);
      continue;
    }

    const fragment = decode(url.hash.slice(1), page, reference.line);
    if (fragment && !getParsedPage(target).ids.has(fragment)) {
      errors.push(`${relative(root, page)}:${reference.line}: missing anchor #${fragment} in ${relative(root, target)}`);
    }
  }
}

checkImageVariants();

if (errors.length) {
  console.error(errors.join('\n'));
  process.exitCode = 1;
} else {
  console.log(`Checked ${pages.length} HTML pages and responsive image variants: links, anchors, IDs and basic document structure are valid.`);
}
