# Testes — V9

## O que foi validado

- Larguras simuladas: **320, 360, 390, 430, 768, 1024 e 1440 px**, com diferentes alturas; sem transbordamento horizontal do documento no teste.
- Serviços em 320, 360, 390 e 768 px: deslocamento da trilha entre o primeiro e o sexto card e contador; todos os seis títulos e descrições sem overflow de largura.
- Atendimento: sem overflow nos títulos e descrições, inclusive em 320 e 360 px.
- Menu mobile: abre e fecha; Escape fecha; links internos possuem destino válido.
- FAQ: abre e fecha, mantendo `aria-expanded` e `hidden` coerentes.
- **56 links**, **9 botões**: verificação estática de href, IDs/âncoras, aria-controls, número brasileiro do WhatsApp e `noopener` nos links que abrem nova aba. Sem links vazios ou âncoras quebradas.
- Teste de clique local dos CTAs do primeiro e último card de Serviços e do Atendimento em 320 e 390 px.
- Validação sintática do JavaScript com Node.js.

## Limitações dos testes

Os testes de navegação ocorreram em Chromium local com conteúdo e estilos carregados diretamente. As bibliotecas por CDN e os serviços externos (WhatsApp, Instagram, Google Maps) **não puderam ser consultados online**. O modo desktop com GSAP/ScrollTrigger e o comportamento em dispositivos físicos ainda exigem validação no deploy publicado.

## SEO pendente

A versão-base V8 usa `https://dominio-pendente.invalid/` como marcador no sitemap e nos metadados. Não envie esse sitemap ao Search Console antes de configurar o domínio real.
