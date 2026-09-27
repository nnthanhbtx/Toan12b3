import fs from 'fs';
import katex from 'katex';

const dataFile = fs.readFileSync('src/data.ts', 'utf8');

// Extract all strings inside dollar signs: $...$ and $$...$$
const regex = /\$\$([\s\S]*?)\$\$|\$([^$]+?)\$/g;
let match;
let total = 0;
let errors = 0;

while ((match = regex.exec(dataFile)) !== null) {
  const formula = match[1] || match[2];
  total++;
  try {
    katex.renderToString(formula.trim(), { throwOnError: true });
  } catch (err) {
    errors++;
    console.error(`Error in formula #${total}: "${formula}"\nMessage: ${err.message}\n`);
  }
}

console.log(`Checked ${total} LaTeX formulas. Total KaTeX errors: ${errors}`);
