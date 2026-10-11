# ATHAMANTIS — Como editar fotos sem alterar o design

Esta versão mantém o layout e a hospedagem Netlify. O CMS edita as listas de fotos sem alterar HTML/CSS. Os dados iniciais foram copiados **diretamente do ZIP Athamantis-Site-Completo(3).zip**.

## Preparação (apenas uma vez)

1. **Faça backup do ZIP original e mantenha o site atual no ar.** Não publique por cima da versão oficial antes de testar.
2. Crie um repositório no **GitHub** (pode ser privado) e envie **o conteúdo desta pasta extraída** para a raiz do repositório: `index.html`, `assets/`, `data/`, `.pages.yml`, etc. O GitHub não deve conter um ZIP como único arquivo. Arquivos acima de 100 MB individualmente não são aceitos pelo GitHub; neste projeto não há arquivos desse tamanho.
3. Na **Netlify**, abra seu **site já existente** e conecte esse repositório em `Project configuration → Build & deploy → Continuous deployment → Repository → Link repository` (os nomes podem mudar). Configure: `Base directory` vazio; `Build command` vazio; `Publish directory` `.`. Confirme que você está vinculando o **site já existente** para manter o endereço original.
4. Abra **https://app.pagescms.org/**, entre com GitHub, autorize o aplicativo para esse repositório e selecione-o. O painel será criado a partir do `.pages.yml` incluído nesta versão. **Não precisa pagar ChatGPT Pro, Wix nem mudar de hospedagem.**
5. Confirme em uma prévia que a home e as seis páginas exibem as fotos, testando navegação, filtros, lightbox e o formulário de orçamento (Netlify Forms deve continuar habilitado).

## Editar pelo Pages CMS

- Escolha `Página inicial · fotografias` ou uma das seis opções `Galeria · ...`.
- Para **trocar** uma foto, edite o campo `Foto principal` no respectivo item e salve.
- Para **adicionar** fotos, use a opção de adicionar item na lista `Fotos desta série`, informe o título, envie/seleciona a imagem e salve.
- Para **tirar** uma foto do site, remova o item da lista (a mídia original pode continuar guardada no GitHub até ser removida também).
- Para **reordenar**, altere a ordem dos itens no painel; para criar um ensaio novo, adicione um item em `Séries / ensaios` e acrescente as fotos.
- `Miniatura` é opcional; se ficar vazia, o site usa a foto principal. Miniaturas WebP menores aceleram páginas grandes. Para as fotos já existentes, mantenha os caminhos e miniaturas atuais ao editar.
- Para fotos de **Eventos**, o campo `Mostrar em preto e branco` reproduz o tratamento de cinco fotos presentes no ZIP original.
- Ao salvar, o Pages CMS registra as alterações no GitHub. A Netlify conectada publica uma nova versão automaticamente; aguarde a finalização em `Deploys`. **Não precisa gerar/enviar ZIP novamente.**

## Cuidados

- **Não mude o nome nem o formato** dos campos JSON por fora do CMS. Os dados ficam na pasta `data/` e as fotos em `assets/`.
- Não apague os arquivos de `assets/` usados por outras partes do site. Trocar a imagem numa galeria não exclui a mídia antiga automaticamente.
- A home mostra os destaques; as seis páginas internas têm suas próprias listas. Para aparecer nos dois lugares, inclua a foto também em ambos os lugares.
- Os arquivos `.json` são carregados pelo navegador. Abrir `index.html` diretamente como `file://` mostra as galerias estáticas originais (fallback), não as edições feitas nos JSON. Para prévia local do novo sistema, rode `python -m http.server 8000` dentro da pasta e acesse `http://localhost:8000`.
- **Site estático:** não há senha/área administrativa hospedada dentro do site público. A edição é feita somente no Pages CMS, autenticado pelo GitHub.
- O formulário de contato continua usando a configuração existente do **Netlify Forms**; sempre faça um envio de teste e confirme recebimento após mudar o tipo de publicação.
- GitHub e Netlify podem ter limites gratuitos de armazenamento/banda. Otimize fotos antes de carregar muitas imagens de alta resolução.

## Arquivos alterados/adicionados

- HTML (7 páginas): pequenos atributos e carregamento de JS adicionais — sem alteração dos elementos visuais existentes.
- `gallery.js`: evento de clique atualizado para funcionar também com fotos adicionadas dinamicamente.
- `gallery-cms.js`: exibe os dados do JSON nas seis galerias.
- `home-cms.js`: exibe os dados do JSON na home.
- `data/*.json`: fotografias, séries e títulos iniciais; estrutura editável pelo CMS.
- `.pages.yml`: configuração do Pages CMS.

**Importante:** os arquivos já estão preparados, mas conectar GitHub, ativar Pages CMS e vincular a Netlify exige acesso às suas contas. Este pacote não fez nenhuma publicação nem ativou integrações. Não coloque senhas ou tokens em arquivos do site.
