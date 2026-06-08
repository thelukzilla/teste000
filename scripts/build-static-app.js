#!/usr/bin/env node
/**
 * Build estático para Vercel/CI.
 * Não usa bundler porque o app é pequeno; apenas valida referências e copia
 * os arquivos públicos para `dist`, evitando publicar scripts/configs internos.
 */
const { copyFileSync, mkdirSync, readFileSync, rmSync, writeFileSync } = require('node:fs');
const { join } = require('node:path');

const publicFiles = ['index.html', 'style.css', 'main.js'];
const outputDir = 'dist';

const html = readFileSync('index.html', 'utf8');
const missingReferences = ['style.css', 'main.js'].filter((asset) => !html.includes(asset));

if (missingReferences.length > 0) {
  throw new Error(`index.html não referencia: ${missingReferences.join(', ')}`);
}

rmSync(outputDir, { recursive: true, force: true });
mkdirSync(outputDir, { recursive: true });

publicFiles.forEach((file) => copyFileSync(file, join(outputDir, file)));

// Arquivo auxiliar para inspeção rápida do deploy gerado.
writeFileSync(join(outputDir, 'health.json'), `${JSON.stringify({ ok: true, app: 'gdg-bh-bolao-copa' })}\n`);

console.log('Aplicação estática validada e copiada para dist/.');
