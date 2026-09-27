import fs from 'fs';
import katex from 'katex';

const lines = fs.readFileSync('src/data.ts', 'utf8').split('\n');

lines.forEach((line, lineIdx) => {
  const regex = /\$\$([\s\S]*?)\$\$|\$([^$]+?)\$/g;
  let match;
  while ((match = regex.exec(line)) !== null) {
    const formula = match[1] || match[2];
    try {
      katex.renderToString(formula.trim(), {
        throwOnError: true,
        strict: (errorCode, errorMsg) => {
          console.warn(`[WARN line ${lineIdx + 1}]: "${formula}" -> ${errorCode}: ${errorMsg}`);
        }
      });
    } catch (err) {
      console.error(`[ERROR line ${lineIdx + 1}]: "${formula}"\n -> ${err.message}`);
    }
  }
});
