# SEO e Google Search Console — Carina Pessôa Advogada

## 1. Passo obrigatório antes do deploy: configurar o domínio real

**Ainda não foi informado o domínio final do site.** Por segurança, o projeto usa temporariamente `https://dominio-pendente.invalid/` no sitemap, no canonical e nos metadados. **Não publique esse modelo sem configurar o domínio.**

No Windows, você também pode dar dois cliques em `CONFIGURAR-SEO-WINDOWS.bat` e informar a URL pública. Alternativamente, no terminal, dentro da pasta `carina-pessoa-site`, execute (substituindo o exemplo pelo domínio verdadeiro):

```bash
node scripts/configurar-seo.mjs https://SEU-DOMINIO.com.br
node scripts/verificar-seo.mjs
```

Use a versão exata que será pública: **com ou sem `www`**. O comando atualiza `index.html` (canonical, Open Graph e JSON-LD), `robots.txt` e `sitemap.xml`. Pode ser executado novamente quando o domínio mudar. Não instale pacotes npm: os scripts usam apenas o Node.js.

Uma verificação válida deve terminar com `VALIDACAO SEO: OK`. O script de verificação não aceita endereços temporários `.invalid`. Endereços `pages.dev` também podem ser usados temporariamente se esse for o endereço realmente publicado, porém **ao migrar para domínio próprio, execute novamente e configure redirecionamento permanente do antigo para o novo**.

## 2. Arquivos de SEO configurados

- `index.html`: título descritivo, meta description, `robots`, canonical, Open Graph absoluto, Twitter Card, `<h1>` semanticamente correto, `lang="pt-BR"`, dados estruturados e dimensões de imagens.
- `sitemap.xml`: somente a homepage (o site é uma landing page de URL única; `#sobre`, `#servicos` e `#faq` não são URLs independentes para sitemap).
- `robots.txt`: permite rastreamento e aponta para o sitemap no domínio configurado.
- `404.html`: página de erro personalizada com `noindex`.
- `seo/dados-estruturados.json`: fonte dos dados de Attorney, WebSite, WebPage e FAQPage; inclui as quatro unidades e 8 FAQs publicadas no HTML. Não há avaliações, OAB, horários ou outras afirmações não confirmadas.
- `scripts/configurar-seo.mjs`: constrói os arquivos para a URL real do site.
- `scripts/verificar-seo.mjs`: verifica a consistência antes do deploy.

## 3. Deploy do site estático

Faça upload do **conteúdo** da pasta `carina-pessoa-site` para a raiz pública do seu site. Para Cloudflare Pages, configure a pasta de saída para a que contém `index.html`, `sitemap.xml` e `robots.txt` diretamente no nível raiz. Não crie a URL `/carina-pessoa-site/` a menos que essa seja intencionalmente a página principal (o gerador atual pressupõe que o site fica na raiz `/`).

Confirme após o deploy, abrindo no navegador:

- `https://SEU-DOMINIO.com.br/` (site e status HTTP 200)
- `https://SEU-DOMINIO.com.br/robots.txt` (texto e referência ao sitemap)
- `https://SEU-DOMINIO.com.br/sitemap.xml` (XML sem erros e com a URL final)
- `https://SEU-DOMINIO.com.br/assets/img/og-carina.webp` (imagem de compartilhamento)
- `https://SEU-DOMINIO.com.br/assets/svg/favicon.svg` (favicon)

Verifique a URL canônica no código-fonte, exatamente igual à URL publicada. Configure HTTPS; se usar tanto `www` quanto a versão sem `www`, redirecione um para o outro com HTTP 301/308, evitando duplicação de conteúdo.

## 4. Adicionar ao Google Search Console

1. Acesse `https://search.google.com/search-console/` e escolha **Adicionar propriedade**.
2. Para cobrir `http`, `https`, `www` e subdomínios, prefira **Domínio** e adicione o domínio sem `https://`; siga a instrução exibida para criar o registro **TXT** de verificação no provedor de DNS. Como alternativa, use **Prefixo do URL** e verifique o endereço HTTPS exato por um dos métodos oferecidos.
3. Após a verificação, vá a **Indexação > Sitemaps** e envie **`sitemap.xml`** (ou a URL completa do sitemap).
4. Em **Inspeção de URL**, coloque a homepage real e verifique se a página é acessível, indexável e qual canonical o Google selecionou. Se apropriado, use **Solicitar indexação**.
5. Acompanhe em **Páginas**, **Sitemaps**, **Desempenho** e nas verificações de dados estruturados, quando disponíveis. O envio não garante indexação nem uma posição específica nos resultados.

## 5. Pendências de conteúdo para publicação

- Nomes e cargos da equipe aparecem como `[NOME A CONFIRMAR]` e `[CARGO / OAB, SE APLICÁVEL]`. Defina se serão divulgados ou remova os cards com esses textos antes de permitir indexação.
- Confirme o perfil de Instagram e a identificação profissional antes da publicação. Não inclua OAB, depoimentos, estatísticas ou especializações não verificadas.
- Confirme se os **seis ramos de atuação** descritos no site correspondem à atuação do escritório.
- O schema FAQ é informativo: a presença de marcação válida não garante que o Google exibirá um resultado rico de FAQ (sua exibição é restrita em muitos casos).
- Se futuramente criar páginas verdadeiras, por exemplo `/previdenciario/`, atualize o sitemap para incluir apenas URLs canônicas realmente existentes, com conteúdo exclusivo.

## 6. Troubleshooting

- **"Sitemap não pôde ser lido"**: verifique 200, tipo de conteúdo XML, redirecionamentos, HTTPS, correspondência do host e se o URL do sitemap abre no navegador público.
- **"Página alternativa com canonical adequada"**: verifique redirecionamentos entre `www` e sem `www` e se o canonical aponta para a URL principal.
- **"Descoberta, atualmente não indexada"**: isso não indica automaticamente erro técnico; revise a qualidade da página e aguarde os relatórios.
- **Preview social não funciona**: confirme que `og:image` é absoluta e acessível publicamente (1200×630 WebP). Alguns serviços mantêm cache e podem demorar para atualizar.
