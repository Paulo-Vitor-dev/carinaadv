#!/usr/bin/env node
/**
 * SEO estatico para Cloudflare Pages, GitHub Pages e outros hosts estaticos.
 * Uso: node scripts/configurar-seo.mjs https://dominio-oficial.com.br
 * Rode novamente se mudar dominio (idempotente).
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const placeholder = 'https://dominio-pendente.invalid';
const arg = process.argv[2] ?? '';
const allowModel = arg === '--modelo';
function validate(raw) {
  if (!raw) throw Error('Falta o dominio de producao. Uso: node scripts/configurar-seo.mjs https://seu-dominio.com.br');
  const u = new URL(raw);
  if (u.protocol !== 'https:' || u.username || u.password || u.port || u.search || u.hash || u.pathname !== '/') {
    throw Error('Informe somente a origem HTTPS, sem caminhos, parametros ou portas. Ex.: https://seu-dominio.com.br');
  }
  if (/(^|\.)localhost$|\.local$|\.test$|\.invalid$/i.test(u.hostname) || /^\d+\.\d+\.\d+\.\d+$/.test(u.hostname)) {
    throw Error('Use o dominio publico real, nao um endereco de teste.');
  }
  return u.origin;
}
const url = allowModel ? placeholder : validate(arg.trim());
const home = url + '/';
const image = url + '/assets/img/og-carina.webp';
const desc = 'Carina Pessôa Advogada: atuação em Direito Previdenciário, Trabalhista, Cível, Consumidor, Tributário e Família. Quatro unidades no RJ e atendimento online.';
const ogDesc = 'Orientação jurídica com atenção individual e atendimento presencial em Belford Roxo, Campos dos Goytacazes, Araruama e Barra da Tijuca, além do atendimento online.';
const title = 'Carina Pessôa Advogada | Previdenciário e Outras Áreas no RJ';
const socialTitle = 'Carina Pessôa Advogada | Atendimento Jurídico no RJ e Online';
const esc = (s) => s.replaceAll('&', '&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;');
const seoHead = `<!-- SEO-START -->
<meta name="description" content="${esc(desc)}">
<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
<meta name="googlebot" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
<meta name="author" content="Carina Pessôa Advogada">
<link rel="canonical" href="${esc(home)}">
<meta property="og:type" content="website">
<meta property="og:locale" content="pt_BR">
<meta property="og:site_name" content="Carina Pessôa Advogada">
<meta property="og:title" content="${esc(socialTitle)}">
<meta property="og:description" content="${esc(ogDesc)}">
<meta property="og:url" content="${esc(home)}">
<meta property="og:image" content="${esc(image)}">
<meta property="og:image:secure_url" content="${esc(image)}">
<meta property="og:image:type" content="image/webp">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="Carina Pessôa Advogada — identidade visual e retrato profissional">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(socialTitle)}">
<meta name="twitter:description" content="${esc(ogDesc)}">
<meta name="twitter:image" content="${esc(image)}">
<!-- SEO-END -->`;

const data = JSON.parse(fs.readFileSync(path.join(root, 'seo', 'dados-estruturados.json'), 'utf8'));
const graph = [
  {
    '@type':'WebSite', '@id':url+'/#website', 'url':home,
    'name':data.name, 'inLanguage':'pt-BR', 'publisher':{'@id':url+'/#escritorio'}
  },
  {
    '@type':'WebPage', '@id':url+'/#webpage', 'url':home,
    'name':title, 'description':desc, 'inLanguage':'pt-BR',
    'isPartOf':{'@id':url+'/#website'}, 'about':{'@id':url+'/#escritorio'},
    'primaryImageOfPage':{'@type':'ImageObject', 'url':image, 'width':1200, 'height':630}
  },
  {
    '@type':'Attorney', '@id':url+'/#escritorio', 'name':data.name,
    'url':home, 'description':data.description,
    'telephone':data.phone,
    'image':image,
    'logo':url+'/assets/svg/logo-horizontal.svg',
    'sameAs':[data.instagram],
    'areaServed': {'@type':'Country', 'name':'Brasil'},
    'knowsAbout':data.areas,
    'location': data.locations.map(loc => ({
      '@type':'Place', 'name':data.name+' — '+loc.name,
      'telephone':loc.phone,
      'address':{ '@type':'PostalAddress', 'streetAddress':loc.street,
        'addressLocality':loc.city, 'addressRegion':'RJ', 'addressCountry':'BR',
        ...(loc.district ? {'addressDistrict':loc.district}: {}) }
    }))
  },
  {
    '@type':'FAQPage', '@id':url+'/#faq',
    'isPartOf':{'@id':url+'/#webpage'}, 'inLanguage':'pt-BR',
    'mainEntity':data.faqs.map(({question,answer}) => ({
      '@type':'Question', 'name':question,
      'acceptedAnswer':{'@type':'Answer','text':answer}
    }))
  }
];
const ld = JSON.stringify({'@context':'https://schema.org','@graph':graph},null,2).replaceAll('<', '\\u003c');
const p = path.join(root,'index.html');
let html=fs.readFileSync(p,'utf8');
if (!html.includes('<!-- SEO-START -->')) {
  // Older project: insert block ahead of favicon if necessary
  html=html.replace(/(<link\b[^>]*rel="icon"[^>]*>)/,seoHead+'\n$1');
}
html = html.replace(/<!-- SEO-START -->[\s\S]*?<!-- SEO-END -->/, seoHead);
html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(title)}</title>`);
if (!/<script\s+type="application\/ld\+json"\s+id="seo-structured-data">[\s\S]*?<\/script>/.test(html)) throw Error('Bloco schema SEO nao encontrado em index.html');
html=html.replace(/<script\s+type="application\/ld\+json"\s+id="seo-structured-data">[\s\S]*?<\/script>/, `<script type="application/ld+json" id="seo-structured-data">\n${ld}\n</script>`);
fs.writeFileSync(p, html);
const sitemap=`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url>\n    <loc>${home.replaceAll('&', '&amp;')}</loc>\n  </url>\n</urlset>\n`;
fs.writeFileSync(path.join(root,'sitemap.xml'),sitemap);
fs.writeFileSync(path.join(root,'robots.txt'),`User-agent: *\nAllow: /\n\nSitemap: ${url}/sitemap.xml\n`);
fs.writeFileSync(path.join(root,'seo','url-configurada.txt'),allowModel ? `DOMINIO PENDENTE — nao publicar antes de executar configurar-seo.mjs com a URL real.\n` : `Dominio configurado: ${home}\n`);
console.log(allowModel ? 'Modelo de SEO gerado — URL PENDENTE. Substitua pelo dominio real antes de publicar.' : `SEO de producao configurado para ${home}`);
