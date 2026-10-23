# Carina Pessôa — Landing page editorial (V9 — Responsividade)

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
- `js/main.js` — scroll horizontal, animação da hero, navbar e interações
- `assets/img/` — fotografias e posts fornecidos
- `assets/svg/` — logotipos

Publicação jurídica: verifique inscrição profissional e textos legais antes de colocar o site no ar.


## Atualização V6 — favicon, FAQ e hero

- Favicon substituído pelo SVG original fornecido e com versão `?v=6` no link, para diminuir problemas de cache.
- `Perguntas frequentes` + descrição mantidos visíveis enquanto o usuário percorre os itens no desktop (`position: sticky` sem novo pin do GSAP); no mobile, layout natural para facilitar a leitura.
- `ADVOGADA` distribuída horizontalmente atrás da foto na hero, ampliando a legibilidade das letras laterais; versão alternativa funciona sem GSAP/JavaScript de animação.
- Demais conteúdos, imagens e animações da V5 preservados.


## SEO e Google Search Console

Leia `SEO-GOOGLE-SEARCH-CONSOLE.md`. Quando definir o domínio definitivo, configure a URL real:

```bash
node scripts/configurar-seo.mjs https://SEU-DOMINIO.com.br
node scripts/verificar-seo.mjs
```

**O domínio definitivo ainda não foi informado**; o arquivo distribuído inicialmente usa uma URL de exemplo `.invalid` e precisa desse passo para ter sitemap/canonical corretos.

## Versão 9 — responsividade e interações

- Até **900 px**, o capítulo **Serviços** passa a ter **scroll horizontal vinculado à rolagem vertical**: painel fixo (`position: sticky`), contador e barra de progresso, com cards dimensionados para a largura do aparelho. O efeito foi implementado com `requestAnimationFrame`, sem um segundo `pin` do GSAP, para evitar conflito com gestos touch e Lenis.
- No desktop acima de 900 px, o `ScrollTrigger` com `pin` e `scrub` original continua. Em navegadores sem JavaScript ou com **redução de movimento** ativa, os cards podem ser lidos em sequência vertical.
- A seção **Atendimento** recebeu correções de `min-width`, grid e tamanho tipográfico para impedir cortes no título e nos passos, inclusive em larguras a partir de 320 px.
- As demais seções tiveram reflow corrigido em larguras pequenas, evitando rolagem horizontal indesejada na página.
- Links internos, botões de menu e FAQ, botões de WhatsApp e endereços foram auditados; consulte `QA-RESPONSIVIDADE.md`.

**Aviso:** antes de enviar o sitemap ao Google, substitua o domínio de exemplo `dominio-pendente.invalid` (o domínio definitivo ainda não foi fornecido).
