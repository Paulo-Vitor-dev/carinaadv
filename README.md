# Carina Pessôa — landing page editorial (versão 4 — otimização de scroll)

Projeto em HTML, CSS e JavaScript. Conteúdo de quatro unidades; GSAP, ScrollTrigger, DrawSVG, Lenis, menu responsivo e FAQ mantidos.

## Ajuste de rolagem da versão 4

- Removidos **três parallax vinculados ao scroll da hero** (fundo, retrato e título). Entradas e DrawSVG mantidos.
- O pin horizontal de Serviços foi preservado. A distância do pin segue o deslocamento real da trilha, e o `scrub` passou de `1` para `0.35` para responder mais rapidamente ao scroll.
- Lenis: `lerp` de `0.09` para `0.14`, sem duplicar suavização por `duration`.
- Removido `backdrop-filter` da navbar sólida e `will-change` permanente de cada letra da hero.

**Nota:** no desktop, Serviços continua usando pin horizontal de propósito: rolar para baixo move os seis cards lateralmente. Isso não é travamento, mas a interação editorial definida no projeto.

## Atualização de imagens

Imagens do cliente incorporadas em todos os slots disponíveis. Consulte `MAPA-DAS-IMAGENS.md` para saber quais arquivos originais (p01–p17) foram usados e os únicos itens ainda pendentes.

## Abrir

Rode `python -m http.server 8080` nesta pasta e acesse `http://localhost:8080`. GSAP e fontes usam CDN e necessitam de conexão para funcionar.

## Organização

- `index.html` — HTML, metadados, JSON-LD, conteúdo
- `css/style.css` — estilo responsivo
- `js/main.js` — preloader, scroll, navbar e interações
- `assets/img/` — fotografias e posts fornecidos
- `assets/svg/` — logotipos

Publicação jurídica: verifique inscrição profissional e textos legais antes de colocar o site no ar.


## Atualização V6 — favicon, FAQ e hero

- Favicon substituído pelo SVG original fornecido e com versão `?v=6` no link, para diminuir problemas de cache.
- `Perguntas frequentes` + descrição mantidos visíveis enquanto o usuário percorre os itens no desktop (`position: sticky` sem novo pin do GSAP); no mobile, layout natural para facilitar a leitura.
- `ADVOGADA` distribuída horizontalmente atrás da foto na hero, ampliando a legibilidade das letras laterais; versão alternativa funciona sem GSAP/JavaScript de animação.
- Demais conteúdos, imagens e animações da V5 preservados.


## SEO e Google Search Console

Leia `SEO-GOOGLE-SEARCH-CONSOLE.md`. Antes de publicar, configure o domínio real:

```bash
node scripts/configurar-seo.mjs https://SEU-DOMINIO.com.br
node scripts/verificar-seo.mjs
```

**O domínio definitivo ainda não foi informado**; o arquivo distribuído inicialmente usa uma URL de exemplo `.invalid` e precisa desse passo para ter sitemap/canonical corretos.
