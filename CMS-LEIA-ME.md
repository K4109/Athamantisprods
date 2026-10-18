# Editar o site da Athamantis

O design, as classes CSS e a ordem das seções foram preservados. O painel organiza o conteúdo em dez áreas, com os mesmos nomes usados no site.

1. **Página inicial:** textos, fotos da abertura/redes, logo e fotografias em destaque. Quantidade 0 exibe todas; o padrão continua em 6.
2. **Capas das especialidades:** imagens dos quatro cartões de entrada. São independentes das capas dos projetos internos.
3. **Fotografia:** seis galerias, séries e fotos. Arraste para ordenar.
4. **Audiovisual:** título da seção, vídeos do Vimeo/YouTube, capas e ordem.
5. **Design:** título da seção, projetos, capa, descrição e link opcional.
6. **Websites:** título da seção, projetos, capa, descrição e link opcional.
7. **Marca e equipe:** textos da marca e integrantes.
8. **Serviços e orçamento:** áreas, serviços, pacotes e valores numéricos em reais. Ative “Preço sob consulta” quando não houver preço definido.
9. **Depoimentos:** clientes, textos e fotos.
10. **Contato e redes sociais:** dados compartilhados entre páginas.

Para publicar um projeto, preencha título/imagem e ative “Projeto publicado”. Link vazio não mostra botão. O site mantém a apresentação e o recorte atuais. Imagens antigas inexistentes ficam sem ícone quebrado; escolha uma imagem própria no CMS para preencher essas capas.

## Orçamento e e-mail

O formulário de `monte-seu-projeto.html` envia o pedido completo via FormSubmit AJAX a **kaioc360@gmail.com**. É preciso ativar esse endereço pelo e-mail de confirmação do FormSubmit. A primeira solicitação pode iniciar essa confirmação. Não considere a entrega validada até confirmar a ativação e receber um pedido de teste feito no site publicado. Verifique spam.

O e-mail contém referência, data de Brasília, nome, e-mail, WhatsApp, cidade, serviços, pacotes, estimativa e ideia completa. O cliente recebe uma confirmação na página apenas quando o provedor confirma o pedido. Aceitação pelo provedor não comprova chegada na caixa de entrada.

O WhatsApp abre somente uma saudação receptiva, sem nome, preços, serviços ou descrição do formulário. O telefone identifica o cliente durante o atendimento. O envio de e-mail não abre o WhatsApp automaticamente: o cliente decide continuar.

Durante o envio o botão é bloqueado. Repetir o mesmo pedido confirmado na mesma página não gera nova requisição; após erro, os dados ficam preenchidos para tentar novamente. Falhas de rede após a aceitação pelo provedor ainda podem causar duplicação numa tentativa posterior; a referência do pedido facilita identificar essas ocorrências. Não há alegação de idempotência no servidor.

O destinatário dos orçamentos é fixado em `ath-quote.js`, independentemente do e-mail público exibido no rodapé. Alterar o destinatário exige atualizar esse endereço no script e ativá-lo no FormSubmit. Não há senha, chave de e-mail ou credencial no repositório.

## Arquivos de conteúdo

`.pages.yml` é a configuração ativa do Pages CMS; `pages.yml` é uma cópia espelhada. Design e Websites agora usam `data/ath-design.json` e `data/ath-websites.json`. `data/ath-projects.json` foi preservado como registro da versão anterior e não é mais lido pelo site/painel.

O formulário antigo oculto na página inicial não é o fluxo de orçamento atual. Use sempre “Monte seu projeto”. O envio completo foi integrado nessa página; a dependência antiga de Netlify Forms foi retirada do formulário oculto para não indicar um envio que Cloudflare não processa.
