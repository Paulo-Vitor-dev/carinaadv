#!/usr/bin/env node
/** Valida os arquivos estaticos de SEO antes do deploy. */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = file => fs.readFileSync(path.join(root,file),'utf8');
const html=read('index.html'), robots=read('robots.txt'), sitemap=read('sitemap.xml');
const issues=[];
const tagAttr=(tag,name)=>new RegExp(`${name}="([^"]+)"`).exec(tag)?.[1] || '';
const tags=[...html.matchAll(/<(?:meta|link)\b[^>]*>/g)].map(m=>m[0]);
function meta(name,property=false) { const x=tags.find(t=>tagAttr(t,property?'property':'name')===name); return x ? tagAttr(x,'content') : ''; }
const canonicalTag=tags.find(t=>tagAttr(t,'rel')==='canonical');
const canonical=canonicalTag ? tagAttr(canonicalTag,'href') : '';
const matches=html.match(/<h1\b/g)||[];
if(matches.length !== 1) issues.push('index.html deve ter exatamente um h1, recebeu '+matches.length);
if (!canonical) issues.push('canonical ausente');
if (canonical.includes('.invalid') || sitemap.includes('.invalid') || robots.includes('.invalid')) issues.push('DOMINIO DE PRODUCAO NAO CONFIGURADO. Execute scripts/configurar-seo.mjs com o dominio real');
if (canonical && !sitemap.includes(`<loc>${canonical}</loc>`)) issues.push('sitemap nao coincide com canonical');
if (canonical && !robots.includes(`Sitemap: ${canonical}sitemap.xml`)) issues.push('robots Sitemap nao coincide com canonical');
if (!meta('description')) issues.push('meta description ausente');
if (!meta('robots').startsWith('index, follow')) issues.push('robots meta nao autoriza indexacao');
if (meta('og:url',true)!==canonical) issues.push('og:url difere do canonical');
if (meta('og:image',true)!==canonical+'assets/img/og-carina.webp') issues.push('og:image nao e absoluta ou esta incorreta');
if (meta('twitter:card')!=='summary_large_image') issues.push('twitter card ausente');
const schema=html.match(/<script type="application\/ld\+json" id="seo-structured-data">([\s\S]*?)<\/script>/)?.[1];
if(!schema) issues.push('json-ld ausente');
else {
 try { const d=JSON.parse(schema); const graph=d['@graph']||[];
  if (!graph.find(o=>o['@type']==='Attorney')) issues.push('schema Attorney ausente');
  if (!graph.find(o=>o['@type']==='FAQPage')) issues.push('schema FAQPage ausente');
  const atty=graph.find(o=>o['@type']==='Attorney');
  if(atty?.location?.length!==4) issues.push('sao esperadas 4 unidades no schema');
  if(atty?.url!==canonical) issues.push('schema url difere do canonical');
 } catch(e) {issues.push('JSON-LD invalido: '+e.message)}
}
for (const x of ['robots.txt','sitemap.xml','404.html','assets/img/og-carina.webp','assets/svg/favicon.svg']) {
 if(!fs.existsSync(path.join(root,x))) issues.push(x+' nao existe');
}
if (issues.length) {console.error('VALIDACAO SEO: PENDENTE\n- '+issues.join('\n- ')); process.exitCode=1;}
else console.log('VALIDACAO SEO: OK\nCanonical: '+canonical+'\nSitemap: '+canonical+'sitemap.xml');
