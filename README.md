# Atualização: Athamantis com galerias editáveis (Pages CMS)

**LEIA PRIMEIRO `COMO-EDITAR-FOTOS.md`.** Esta adaptação adiciona configuração do Pages CMS para a página inicial e as seis galerias, mantendo o visual anterior.

- Não foi publicado online nem conectado a nenhuma conta.
- É necessário subir o **conteúdo extraído** no GitHub, conectar o repositório ao site **existente** na Netlify e autorizar Pages CMS.
- O site é estático; agora lê os arquivos `data/*.json` ao abrir online. Fora de um servidor HTTP, mostra o HTML original como prévia.
- Fotos enviadas pelo CMS ficam em `assets/`, e o GitHub/Netlify publicam as alterações após a configuração.

---

# Athamantis — portfólio ampliado para aprovação

Site estático completo, baseado no ZIP Athamantis-Site-Completo-Email-WhatsApp. Nenhuma publicação foi realizada.

## Conferir antes de publicar
Extraia o ZIP e abra index.html no navegador. Todas as fotografias e os recursos visuais ficam na pasta assets. Navegação, filtros, galerias, preços e diálogos funcionam localmente. Vídeos incorporados e links externos precisam de internet. O formulário precisa do serviço Netlify Forms; abrir o arquivo localmente não envia uma notificação por e-mail.

A prévia separada Athamantis-Previa.html é um arquivo único para analisar as páginas. Ela usa imagens reduzidas e desativa o envio do formulário. Ela não é o arquivo para publicar.

## O que foi atualizado
- Seis galerias: Ensaios, Gestantes, Formaturas, Eventos, Gastronomia & Produtos e Empresas.
- 167 fotografias nas galerias: as 18 anteriores, mais 137 selecionadas do Drive e 12 complementares do site antigo.
- 32 séries novas, além das seleções de abertura anteriores.
- Títulos em português, navegação por série, ampliação com anterior/próxima e teclado.
- Cinco fotos de eventos apresentadas em preto e branco (classe monochrome/data-tone=mono). O filtro é aplicado no site e na ampliação. Os arquivos coloridos foram preservados.
- Seta da capa em SVG e ajuste localizado de um título para telas estreitas.
- Código e campos do formulário original preservados. Não houve disparo de orçamento de teste nem confirmação de entrega de e-mail.

## Alcance da seleção
Foram inventariados 3.288 registros de imagem em 26 pastas fornecidas e duas subpastas. A primeira amostra de 518 arquivos do Drive permitiu visualizar 517 imagens; um arquivo não pôde ser decodificado e não foi incluído. Também foram analisadas 83 imagens do portfólio antigo. Essa é uma seleção inicial representativa, não uma revisão individual de todas as 3.288 imagens e não um backup completo do Drive. O feed do Instagram não ficou disponível para análise nesta rodada.

As novas cópias para ampliação têm até 2.200 px no maior lado; miniaturas WebP têm até 900 px. Sem recortes adicionais nos arquivos e sem substituição por imagens geradas. Os originais do Drive não foram modificados. Os recursos que já estavam no site foram preservados.

## Publicar no Netlify depois de aprovar
1. Extraia o ZIP.
2. Abra o projeto existente no Netlify e envie a pasta que contém index.html, os outros HTML, os scripts, style.css e assets. Mantenha a estrutura das pastas.
3. É um site estático: não há build nem instalação de dependências. Se usar repositório, a pasta publicada é a raiz do site.
4. Mantenha habilitada a detecção de formulários e a notificação por e-mail do formulário orcamento-athamantis já configuradas na conta. Essas configurações da conta não ficam dentro do ZIP.
5. Após publicar, faça um pedido de teste e confirme o recebimento na caixa de e-mail e o redirecionamento para WhatsApp.

## Cloudflare Pages
Os arquivos estáticos também podem ser hospedados na Cloudflare Pages, sem build. O formulário atual depende de Netlify Forms e não enviará e-mails automaticamente nessa outra hospedagem: será necessário integrar um endpoint próprio antes de utilizar o formulário lá. Não foi criada essa integração neste pacote.

## Editar
index.html: página inicial e formulário.
ensaios.html, gestantes.html, formaturas.html, eventos.html, produtos.html, empresas.html: galerias.
style.css: visual; gallery.js: ampliação nas galerias; app.js: interações da página inicial; lead.js: envio Netlify/WhatsApp.
TITULOS.md: título e caminho de cada foto.

Para remover o preto e branco de uma foto específica, remova a classe monochrome e data-tone="mono" do botão correspondente. Não modifique o CSS global de todas as imagens.
