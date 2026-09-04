# Catálogo

Aplicação de catálogo de filmes e séries construída apenas com HTML, CSS e
JavaScript puro (sem bibliotecas, sem frameworks, sem instalação de nada).

Este repositório é material didático. O objetivo desta etapa do projeto é
mostrar como uma aplicação completa de cadastro funciona **antes de existir
qualquer servidor ou banco de dados** — e, principalmente, deixar visível o
limite que essa ausência impõe.

---

## Aviso importante antes de qualquer coisa

> **Esta versão do projeto não guarda nada.**
>
> Todas as obras cadastradas, editadas ou excluídas existem somente na
> memória do navegador, enquanto a aba estiver aberta. Ao pressionar `F5`, a
> página volta exatamente ao estado inicial: as três obras que estão escritas
> dentro do `script.js`, e mais nada.
>
> Isso **não é um defeito**. É a consequência correta e esperada do que o
> código faz. Reconhecer esse limite é o conteúdo principal desta etapa.

Duas perguntas ajudam a enxergar o problema com clareza:

1. **Cadastre uma obra nova e recarregue a página.** Ela some. Por quê? Porque
   os dados foram alterados apenas na memória; o arquivo `script.js` no disco
   continua exatamente igual ao que era. Ao recarregar, o navegador descarta a
   memória e lê o arquivo de novo.
2. **Abra o mesmo projeto em dois navegadores ao mesmo tempo e cadastre algo
   em um deles.** O outro não vê nada. Cada navegador tem a própria cópia da
   lista. Não existe "o catálogo" — existem tantos catálogos independentes
   quantos forem os computadores que abriram a página.

O que falta é um lugar onde os dados morem **fora** do navegador, em uma única
máquina que todos consultam. Esse lugar é o banco de dados, e quem conversa
com ele em nome do navegador é o servidor.

```
ESTA ETAPA                             PRÓXIMA ETAPA

navegador                              navegador
┌──────────────────┐                   ┌──────────────────┐
│  script.js       │                   │  script.js       │
│                  │                   │        │         │
│  let obras = []  │ ← os dados        └────────┼─────────┘
│                  │   moram aqui               │ pede pela rede
└──────────────────┘                   ┌────────┼─────────┐
                                       │  servidor        │ ← PHP
some ao recarregar                     │        │         │
não é compartilhado                    │  banco de dados  │ ← MySQL
                                       └──────────────────┘

                                       sobrevive a tudo
                                       é o mesmo para todos
```

---

## Como executar

Não há dependências, build, nem servidor. Basta abrir o `index.html` no
navegador.

Um detalhe útil: como não existe processo de build, qualquer alteração nos
arquivos aparece assim que a página é recarregada. Recomenda-se manter o
console do navegador aberto (`F12`) durante o desenvolvimento — é ali que
erros de JavaScript aparecem.

---

## Estrutura de arquivos

```
catalogo/
├── index.html          estrutura da página (a "moldura")
├── style.css           aparência e layout
├── script.js           dados + regras + montagem da tela
├── README.md           este documento
└── assets/
    └── images/
        ├── title-1/thumbnail.webp
        ├── title-2/thumbnail.webp
        └── title-3/thumbnail.webp
```

A divisão em três arquivos segue a separação clássica: o HTML descreve **o que
existe**, o CSS descreve **como aparece**, e o JavaScript descreve **como se
comporta**. Cada arquivo pode ser lido e alterado sem que seja necessário
entender os outros por completo.

---

## Como o projeto funciona, em uma frase

O `index.html` nasce praticamente vazio de conteúdo; o `script.js` guarda uma
lista de obras e desenha os cards a partir dela; toda ação do usuário altera a
lista e manda desenhar tudo de novo.

O fluxo, em ordem:

```
1. O navegador carrega index.html
2. Encontra <section id="lista"> vazia — é o espaço reservado para os cards
3. No fim do <body>, carrega script.js
4. script.js chama carregarObras()
5. carregarObras() pede a lista ordenada e manda desenhá-la
6. Cada obra vira um <article class="title-card"> inserido na seção
7. O usuário clica em algo (+, lápis, lixeira, Salvar)
8. A lista em memória é alterada
9. carregarObras() é chamada de novo → a tela inteira é redesenhada
```

O passo 9 é a decisão central de todo o projeto e vale destacá-la: **depois de
qualquer alteração, a lista é redesenhada por completo, do zero.** Não existe
código que insira um card sozinho, nem que corrija um card específico, nem que
renumere os cards restantes. Isso torna impossível a tela ficar
"dessincronizada" dos dados, porque a tela é sempre uma consequência direta
deles. É mais trabalho para o navegador e muito menos código para manter — uma
troca claramente vantajosa em listas deste tamanho.

---

## Os dados

Toda a informação do catálogo está no topo do `script.js`, em uma lista de
objetos:

```js
let obras = [
{
    id: 1,
    nome: 'Game of Thrones',
    ano_inicio: 2011,
    ano_fim: 2019,
    categorias: 'Fantasia, Drama, Ação',
    descricao: 'Épica adaptação das obras de George R. R. Martin. ...',
    imagem: 'assets/images/title-1/thumbnail.webp',
    imagem_alt: 'Personagem John Snow segurando uma espada ...',
    nota_imdb: 9.3,
    nota_rotten: 89
},
// ...
];

let proximoId = 4;
```

### Por que uma lista de objetos

É a estrutura que representa "várias coisas do mesmo tipo, cada uma com vários
campos". Vale reparar que ela é exatamente uma tabela: cada objeto `{ ... }` é
uma linha, e cada `chave: valor` é uma coluna. Quando o banco de dados entrar
no projeto, a tradução dessa estrutura para uma tabela SQL será direta, campo
por campo.

### Campo a campo, e o motivo de cada formato

| Campo | Tipo | Por que está assim |
|---|---|---|
| `id` | número | É a identidade do registro. Permite dizer "edite esta obra" sem depender do nome (que pode repetir) nem da posição na lista (que muda quando algo é excluído). O `id` nunca muda. |
| `nome` | texto | O título da obra. |
| `ano_inicio` | número | Guardado como número, e não dentro de uma frase como `"2011-2019"`. Frase não se ordena nem se compara. |
| `ano_fim` | número ou `null` | `null` tem um significado combinado: **a obra ainda está em exibição**. É daí que sai a diferença entre "2011–2019" e "2016–Presente" na tela — do formato do dado, não de condicionais espalhadas pelo código. |
| `categorias` | texto | Gêneros separados por vírgula, exibidos como vieram. |
| `descricao` | texto | Sinopse curta. |
| `imagem` | texto | Caminho local (`assets/images/...`) ou URL completa da internet. Ambos funcionam, porque o valor vai direto para o `src` da tag `<img>`. |
| `imagem_alt` | texto | Descrição da imagem para leitores de tela. É um campo obrigatório do formulário, e não um detalhe opcional — ver a seção de acessibilidade. |
| `nota_imdb` | número | Guardado como `9.3`, e não como `"9.3/10 IMDb"`, porque a lista é ordenada por esse valor. O sufixo `/10 IMDb` é igual em todas as obras: é decoração da tela, e é a tela quem deve colocá-lo. |
| `nota_rotten` | número | Mesmo raciocínio: `89`, não `"89%"`. |

### Por que `let obras` e não `const obras`

A função de exclusão reatribui a lista inteira (`obras = obras.filter(...)`), e
`const` proíbe reatribuição. A regra prática permanece: usar `const` por
padrão, e `let` apenas quando o valor precisa mesmo mudar.

### Por que existe um `proximoId`

Toda obra precisa de um identificador único, e alguém precisa decidir qual é o
próximo número. Nesta etapa, esse controle é feito à mão por uma variável. Vale
guardar o detalhe: quando o banco de dados entrar, essa variável desaparece —
o MySQL tem um recurso chamado `AUTO_INCREMENT` que faz exatamente isso, e faz
melhor, porque nunca repete um número mesmo com duas pessoas cadastrando ao
mesmo tempo.

---

## As quatro operações do CRUD

CRUD é a sigla das quatro operações básicas sobre dados: **C**reate, **R**ead,
**U**pdate, **D**elete — criar, ler, atualizar e excluir. No projeto, cada uma
delas é uma função que mexe no array:

```js
function listarObras()
{
    return [...obras].sort((a, b) => b.nota_imdb - a.nota_imdb);
}

function criarObra(obra)
{
    obra.id = proximoId;
    proximoId = proximoId + 1;
    obras.push(obra);
}

function atualizarObra(id, obra)
{
    const indice = obras.findIndex((item) => item.id === id);
    if (indice === -1) return;

    obra.id = id;
    obras[indice] = obra;
}

function excluirObra(id)
{
    obras = obras.filter((item) => item.id !== id);
}
```

### Por que essas funções ficam separadas de todo o resto

Esta é a decisão de organização mais importante do arquivo. Nenhuma outra parte
do código toca no array `obras` diretamente: tudo passa por uma dessas quatro
funções. Parece burocracia em um projeto pequeno, mas é o que vai permitir
trocar "mexer no array" por "conversar com o servidor" alterando somente o
miolo dessas quatro funções, sem tocar em mais nada.

| Função | O que faz nesta etapa | O que se torna quando houver servidor |
|---|---|---|
| `listarObras()` | ordena e devolve a lista | uma requisição a `api/listar.php` |
| `criarObra()` | `push` na lista | uma requisição a `api/criar.php` |
| `atualizarObra()` | troca um item da lista | uma requisição a `api/atualizar.php` |
| `excluirObra()` | remove um item da lista | uma requisição a `api/excluir.php` |

Essa ideia tem nome: **separar onde os dados moram de como os dados
aparecem**. Quem faz essa separação desde o início pode trocar o banco, trocar
a linguagem do servidor ou trocar o front-end inteiro — uma peça de cada vez,
sem refazer o resto.

### Detalhes que merecem atenção

**`[...obras]` dentro de `listarObras`.** Os três pontos criam uma cópia da
lista antes de ordenar. Sem a cópia, o `.sort()` reordenaria o array original e
a ordem de cadastro se perderia para sempre. É um detalhe pequeno com
consequência grande, e vale como princípio: **funções que apenas leem dados não
deveriam alterá-los.**

**`.sort((a, b) => b.nota_imdb - a.nota_imdb)`.** A função de comparação
devolve um número. Se for negativo, `a` vem primeiro; se for positivo, `b` vem
primeiro. Fazendo `b - a`, a ordem sai da maior nota para a menor. Trocando
para `a - b`, sairia da menor para a maior.

**`.filter()` em `excluirObra`.** O `filter` não remove nada: ele cria uma
lista nova contendo apenas os itens que passam no teste. "Fique com todos cujo
`id` seja diferente deste" é o mesmo resultado que "remova este". É por isso
que a reatribuição é necessária.

**O `if (indice === -1) return;` em `atualizarObra`.** O `findIndex` devolve
`-1` quando não encontra nada. Sem essa guarda, a linha seguinte escreveria na
posição `-1` do array e criaria uma propriedade inválida em silêncio. Verificar
antes de usar é um hábito que evita bugs difíceis de rastrear.

---

## Desenhar a tela

```js
const lista = document.querySelector('#lista');

let obrasEmTela = [];

function carregarObras()
{
    obrasEmTela = listarObras();
    desenharLista(obrasEmTela);
}

function desenharLista(obras)
{
    lista.innerHTML = '';

    obras.forEach((obra, indice) => {
        lista.insertAdjacentHTML('beforeend', montarCard(obra, indice + 1));
    });
}
```

**`obrasEmTela`** guarda o que está visível no momento. Quando o usuário clica
no lápis de um card, os dados daquela obra já estão ali, na memória, prontos
para preencher o formulário — não é preciso buscá-los de novo. Esse papel se
mantém quando o servidor entrar, e é o que evita uma requisição extra a cada
clique em "editar".

**`lista.innerHTML = ''`** limpa a seção antes de redesenhar. Sem essa linha,
cada salvamento faria os cards aparecerem duplicados, empilhados.

**`forEach((obra, indice) => ...)` com `indice + 1`** resolve a numeração. O
número exibido no card (1, 2, 3...) não é um dado guardado em lugar nenhum: é
**a posição**, calculada no momento de desenhar. Ao excluir uma obra, as
restantes se renumeram sozinhas, sem uma única linha de código a mais.

> **Regra geral:** se um valor pode ser calculado a partir de outros, não o
> guarde — calcule-o.

**`insertAdjacentHTML('beforeend', ...)` em vez de `innerHTML +=`.** O
`innerHTML +=` faz o navegador ler tudo o que já está na página, apagar e
reconstruir, a cada card. Com 3 cards ninguém percebe; com 200, a página
engasga. O `insertAdjacentHTML` apenas acrescenta ao final.

### O formato dos anos

```js
function formatarAnos(obra)
{
    return obra.ano_fim
        ? `${obra.ano_inicio}–${obra.ano_fim}`
        : `${obra.ano_inicio}–Presente`;
}
```

Uma função pequena e isolada, com uma responsabilidade só: transformar dois
campos numéricos no texto que aparece na tela. Como `ano_fim` pode ser `null`,
o operador ternário escolhe entre os dois formatos. Manter isso em uma função
separada significa que existe **um único lugar** a alterar caso o formato mude.

### A montagem do card

```js
function montarCard(obra, posicao)
{
    return `
    <article class="title-card" data-id="${obra.id}">
        <p class="title-number">${posicao}</p>
        <img class="title-thumbnail" src="${obra.imagem}"
        alt="${obra.imagem_alt}" width="200">
        <div class="title-data">
            <h2 class="title-name">${obra.nome}</h2>
            <p class="title-years">${formatarAnos(obra)}</p>
            <p class="title-categories">${obra.categorias}</p>
        </div>
        <p class="title-description">${obra.descricao}</p>
        <div class="card-line"></div>
        <div class="title-rating">
            <p class="title-imdb">${obra.nota_imdb}/10 IMDb</p>
            <p class="title-rotten">${obra.nota_rotten}% Rotten Tomatoes</p>
        </div>
        <div class="card-actions">
            <button class="btn-icon" data-acao="editar" title="Editar obra">
                <svg viewBox="0 0 24 24" ...>...</svg>
            </button>
            <button class="btn-icon" data-acao="excluir" title="Excluir obra">
                <svg viewBox="0 0 24 24" ...>...</svg>
            </button>
        </div>
    </article>`;
}
```

**As crases (`` ` ``) em vez de aspas** criam um *template literal*: um texto
que pode ocupar várias linhas e no qual tudo que estiver dentro de `${...}` é
substituído pelo valor correspondente. É o que permite escrever HTML legível
com os dados encaixados no meio.

**`data-id="${obra.id}"` no `<article>`.** Um atributo `data-*` é o lugar
oficial do HTML para guardar informação própria da aplicação. Aqui, ele grava
no elemento qual obra ele representa. Quando alguém clicar na lixeira daquele
card, é dali que o JavaScript vai descobrir qual obra excluir.

**`<article>` em vez de `<div>`, e `<h2>` em vez de `<p>` no nome.** Uma
`<div>` não significa nada; `<article>` significa "um conteúdo que faz sentido
sozinho" — exatamente o caso de um card. O `<h2>` marca o título desse
conteúdo, o que permite a um leitor de tela navegar de obra em obra.
Visualmente nada muda (o CSS cuida da aparência); o que muda é a página passar
a ter estrutura, e não apenas aparência.

**Os ícones em SVG dentro dos botões.** O lápis e a lixeira são desenhados como
SVG inline, com `stroke="currentColor"` — ou seja, a cor do traço vem da cor de
texto do botão, definida no CSS. Isso permite trocar a cor de um ícone alterando
uma única propriedade CSS, sem tocar no JavaScript. Cada `<svg>` leva
`aria-hidden="true"`, porque o desenho não deve ser anunciado por leitores de
tela — quem cumpre esse papel é o atributo `title` do botão.

**A chamada final que dá início a tudo:**

```js
carregarObras();
```

---

## O formulário (modal)

O `index.html` traz um `<dialog id="modal">` com um formulário completo. O
mesmo modal serve para criar e para editar.

### Por que `<dialog>` e não uma `<div>` com CSS

O `<dialog>` é um elemento nativo do HTML que já vem pronto com:

- o fundo escurecido, através do pseudo-elemento `::backdrop`;
- fechamento pela tecla `Esc`, sem nenhum código;
- o foco do teclado preso dentro da janela enquanto ela está aberta (quem
  navega por `Tab` não sai acidentalmente para a página de trás);
- posicionamento centralizado, sem `position: fixed` nem cálculo de
  `transform`.

Reproduzir tudo isso com uma `<div>` custaria dezenas de linhas de CSS e
JavaScript, e o resultado seria pior em acessibilidade. Aqui, abrir é
`modal.showModal()` e fechar é `modal.close()`.

### Por que um modal só, para criar e editar

O formulário de editar é idêntico ao de criar, apenas preenchido. Sendo
iguais, devem ser o mesmo elemento: dois formulários gêmeos significariam que
toda alteração precisa ser feita em dobro — e um dia alguém esquece uma delas.

A peça que torna isso possível é o campo oculto:

```html
<input type="hidden" id="campo-id" name="id">
```

Ele é invisível para o usuário e guarda uma única informação: qual obra está
sendo editada.

- **Campo vazio** → está sendo criada uma obra nova.
- **Campo preenchido** → está sendo editada a obra daquele `id`.

É um recurso simples, usado no mundo inteiro, e a lógica continua exatamente a
mesma quando o back-end chegar.

### Abrir para criar

```js
function abrirModalCriacao()
{
    formulario.reset();
    document.querySelector('#campo-id').value = '';
    modalTitulo.textContent = 'Nova obra';
    modal.showModal();
}
```

O `formulario.reset()` evita um bug garantido: sem ele, quem editasse
"Friends", fechasse o modal e clicasse no `+` veria o formulário já preenchido
com os dados de Friends. O `reset()` devolve todos os campos ao estado inicial.

### Abrir para editar

```js
function abrirModalEdicao(id)
{
    const obra = obrasEmTela.find((item) => item.id === id);
    if (!obra) return;

    document.querySelector('#campo-id').value = obra.id;
    document.querySelector('#campo-nome').value = obra.nome;
    document.querySelector('#campo-ano-inicio').value = obra.ano_inicio;
    document.querySelector('#campo-ano-fim').value = obra.ano_fim ?? '';
    // ... demais campos ...

    modalTitulo.textContent = 'Editar obra';
    modal.showModal();
}
```

O operador `??` significa "use o valor da esquerda; se ele for `null` ou
`undefined`, use o da direita". Sem ele, uma obra ainda em exibição colocaria o
texto literal `"null"` dentro do campo do formulário.

### Decisões do HTML do formulário

**Todo campo tem `<label for="...">`.** O atributo `for` amarra o rótulo ao
campo pelo `id`. Com isso, clicar no texto foca o campo, e o leitor de tela
anuncia "Nome, campo de texto" em vez de apenas "campo de texto". Custo: zero.

**`required`, `min`, `max`, `type="number"`, `maxlength`.** É validação de
graça, feita pelo navegador, sem uma linha de JavaScript. O aviso aparece antes
do envio.

> **Atenção permanente:** validação feita no navegador é **conveniência, não
> segurança**. Qualquer pessoa a desliga pelo DevTools em cinco segundos.
> Quando existir servidor, ele valida tudo de novo — e aí sim há garantia.

**O atributo `name` de cada campo é igual à chave correspondente dos dados.**
`name="ano_inicio"` é idêntico à chave `ano_inicio` do objeto. Isso não é
coincidência: é o que permite ler o formulário inteiro em uma linha, como
descrito a seguir.

---

## Salvar: criação e edição no mesmo lugar

```js
formulario.addEventListener('submit', (evento) => {
    evento.preventDefault();

    const campos = Object.fromEntries(new FormData(formulario));

    const obra =
    {
        nome: campos.nome,
        ano_inicio: Number(campos.ano_inicio),
        ano_fim: campos.ano_fim === '' ? null : Number(campos.ano_fim),
        categorias: campos.categorias,
        descricao: campos.descricao,
        imagem: campos.imagem,
        imagem_alt: campos.imagem_alt,
        nota_imdb: Number(campos.nota_imdb),
        nota_rotten: Number(campos.nota_rotten)
    };

    if (campos.id === '')
    {
        criarObra(obra);
    }
    else
    {
        atualizarObra(Number(campos.id), obra);
    }

    modal.close();
    carregarObras();
});
```

**`evento.preventDefault()` é a linha mais importante do bloco.** O
comportamento padrão de um `<form>` é recarregar a página inteira enviando os
dados. Como o tratamento é feito em JavaScript, esse comportamento precisa ser
cancelado. Esquecer essa linha faz a página piscar e nada acontecer — um dos
erros mais confusos para quem está começando, porque não gera erro nenhum no
console: simplesmente "não funciona".

**`new FormData(formulario)`** lê o formulário inteiro de uma vez, usando o
atributo `name` de cada campo como chave. **`Object.fromEntries(...)`**
transforma isso em um objeto JavaScript comum. Em uma linha, obtém-se
`{ id: "", nome: "Chernobyl", ano_inicio: "2019", ... }` — sem um
`querySelector` por campo. É por isso que todo campo tem `name`, e é por isso
que os nomes foram escolhidos iguais aos das chaves dos dados.

**A conversão com `Number()`.** Um formulário HTML sempre devolve texto, mesmo
em `<input type="number">`. Guardar `"9.4"` como texto faria a ordenação
comparar textos, e `"10"` viria antes de `"9.5"`, porque em ordem alfabética o
`1` vem antes do `9`. É um bug sutil, difícil de encontrar e fácil de evitar
convertendo no lugar certo: na fronteira entre o formulário e os dados.

**`campos.ano_fim === '' ? null : Number(...)`.** Um campo numérico vazio chega
como texto vazio `''`. Passá-lo por `Number()` daria `0`, e a tela mostraria
"2016–0". Traduzir "vazio" para `null` preserva o significado combinado no
modelo de dados: `null` = ainda em exibição.

**O `if` que decide entre criar e atualizar.** Um formulário, dois destinos. A
única diferença entre "salvar uma obra nova" e "salvar uma edição" é ter ou não
um `id`. Todo o resto — abrir o modal, ler os campos, converter os tipos,
fechar, redesenhar — é idêntico. Quando dois fluxos diferem em uma linha,
mantê-los juntos é o correto.

---

## Cliques nos cards: delegação de eventos

```js
lista.addEventListener('click', (evento) => {
    const botao = evento.target.closest('.btn-icon');
    if (!botao) return;

    const card = botao.closest('.title-card');
    const id = Number(card.dataset.id);

    if (botao.dataset.acao === 'editar')
    {
        abrirModalEdicao(id);
    }
    else if (botao.dataset.acao === 'excluir')
    {
        confirmarExclusao(id);
    }
});
```

Há **um único** `addEventListener` na lista, e não um por botão. Esse conceito
se chama **delegação de eventos**, e é o ponto mais importante desta seção.

O motivo é concreto: os botões dos cards não existem quando o `script.js` roda
pela primeira vez — eles nascem depois, dentro de `desenharLista`. Não é
possível adicionar um listener a um botão que ainda não foi criado. Pior: toda
vez que a lista é redesenhada, os botões antigos são destruídos e novos são
criados, de modo que os listeners precisariam ser registrados de novo a cada
renderização.

A solução é pendurar um listener no elemento pai (`#lista`), que existe desde o
início e nunca é destruído. Quando um botão é clicado, o evento "sobe" pela
árvore de elementos até chegar na lista — e ali o código pergunta de onde veio
aquele clique.

**`evento.target.closest('.btn-icon')`.** O `evento.target` é o elemento exato
que recebeu o clique (pode ser até o `<svg>` dentro do botão). O `closest()`
sobe pela árvore procurando o ancestral mais próximo que combine com o seletor.
Se devolver `null`, o clique foi em outro ponto qualquer do card e é
simplesmente ignorado pelo `return`.

**`card.dataset.id`** é como o JavaScript lê os atributos `data-*`. O
`data-id="3"` do HTML vira `card.dataset.id === "3"`. O `Number()` em volta é
necessário porque `dataset` sempre devolve texto, e os `id` do projeto são
números — e a comparação `item.id === id` usa `===`, que não converte tipos.

**`data-acao="editar"` / `data-acao="excluir"`** é como um mesmo listener
distingue qual dos dois botões foi clicado. A alternativa seria comparar
classes CSS, mas classe existe para aparência; `data-*` existe para
significado.

---

## Excluir

```js
function confirmarExclusao(id)
{
    const obra = obrasEmTela.find((item) => item.id === id);
    if (!obra) return;

    const confirmado = confirm(`Excluir "${obra.nome}" do catálogo?\n\nEsta ação não pode ser desfeita.`);
    if (!confirmado) return;

    excluirObra(id);
    carregarObras();
}
```

**A confirmação mostra o nome da obra.** "Tem certeza?" é uma pergunta ruim: o
usuário clica em OK no automático, sem ler. `Excluir "Friends" do catálogo?`
obriga a pessoa a reconhecer exatamente o que vai desaparecer. É uma diferença
pequena no código e grande no uso. Vale como regra: **toda confirmação deve
dizer o que vai acontecer, e não perguntar se há certeza sobre algo que ela não
nomeia.**

**`confirm()` e não um modal personalizado.** O `confirm()` é uma janela nativa
do navegador: feia, não personalizável e impossível de errar. Um modal de
confirmação próprio significaria mais um `<dialog>`, mais CSS e mais lógica
assíncrona. Para esta etapa, `confirm()` é a escolha certa — e fica anotado
como melhoria futura.

**`if (!confirmado) return;`.** O `confirm()` devolve `true` se a pessoa clicou
em OK e `false` se cancelou. O `return` interrompe a função ali mesmo. Vale
testar o cancelamento com atenção: um botão de excluir que ignora o "Cancelar"
é um desastre, e é um bug fácil de deixar passar, porque o caminho feliz
funciona normalmente.

Ao confirmar, os cards restantes se renumeram sozinhos — a recompensa concreta
da decisão de calcular a numeração em vez de guardá-la.

---

## O CSS

### Cores centralizadas em variáveis

O `style.css` começa definindo todas as cores do projeto como variáveis CSS
(*custom properties*) no seletor `:root`:

```css
:root
{
    --cor-pagina: #faf9f7;
    --cor-superficie: #ffffff;
    --cor-escura: #232120;
    --cor-tinta: #1a1917;
    --cor-tinta-media: #57534e;
    --cor-tinta-suave: #736d65;
    --cor-borda: #e7e3dd;
    --cor-destaque: #f4b400;
    --cor-destaque-escuro: #8a5a00;
    --cor-remover: #fbdcd8;
    --cor-remover-tinta: #7b1e1e;
    --cor-editar: #e3edfd;
    --cor-editar-tinta: #17458f;
}
```

Cada cor é declarada **uma única vez** e usada com `var(--nome)` em todo o
arquivo. Trocar o amarelo de destaque do projeto inteiro é alterar uma linha.
Além disso, os nomes descrevem o **papel** da cor (`--cor-borda`,
`--cor-destaque`) e não sua aparência (`--amarelo`), o que mantém o nome
correto mesmo depois de uma mudança de paleta.

Os três níveis de tinta (`--cor-tinta`, `--cor-tinta-media`,
`--cor-tinta-suave`) formam uma hierarquia deliberada de leitura: o nome da
obra é o mais escuro, a descrição é intermediária, e as categorias são a
informação mais discreta.

### Layout da página

```css
body
{
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    ...
}
```

O `body` é uma coluna flex com cabeçalho, `main` e rodapé. O `main` usa
`flex-grow: 1` para ocupar o espaço restante, o que mantém o rodapé colado na
parte de baixo mesmo quando há poucas obras.

O uso de `min-height: 100vh` em vez de `height: 100vh` é intencional: com
altura fixa, a página teria exatamente uma tela — funcionaria com 3 cards, mas
com 10 o conteúdo transbordaria para fora. `min-height` significa "pelo menos
uma tela, mas cresça se precisar".

A fonte é declarada como `"Open Sans", "Google Sans", sans-serif`. As duas
primeiras vêm do Google Fonts, pela internet; o `sans-serif` no fim é a
reserva. Em uma máquina sem rede — ou com a rede da escola bloqueando o Google
Fonts — o navegador cai na fonte reserva do sistema em vez de escolher uma
qualquer.

### O card

```css
.title-card
{
    position: relative;
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0.75rem;
    box-sizing: border-box;
    min-height: 9.5rem;
    ...
}
```

**`position: relative`** existe para servir de referência ao
`position: absolute` do bloco de ações (o lápis e a lixeira), posicionando-os
em relação ao card e não à página.

**`min-height` e não `height`.** Qualquer pessoa pode cadastrar uma descrição
de cinco linhas. Com altura fixa, esse texto vazaria para fora do card.
`min-height` mantém o visual pretendido e resolve o caso do texto longo.

**`box-sizing: border-box`** faz com que a largura declarada já inclua o
`padding` e a borda, evitando que o card ultrapasse o espaço disponível.

**As colunas têm largura fixa.** `.title-data` (11.75rem), `.title-description`
(22rem) e `.title-rating` (9rem) usam `width` combinado com `flex: none`. Sem
isso, cada bloco teria a largura do próprio texto — "Crime, Drama, Suspense"
ocuparia mais que "Comédia, Romance" — e os elementos seguintes ficariam
deslocados em cada card, de modo que a linha divisória cairia em uma posição
diferente a cada linha da lista. Com larguras fixas, todos os cards compartilham
o mesmo alinhamento vertical, independentemente do tamanho dos textos.

**A linha divisória usa `align-self: stretch`:**

```css
.card-line
{
    width: 2px;
    background-color: var(--cor-borda);
    align-self: stretch;
    margin: 0.375rem 0;
}
```

Uma altura em porcentagem só funciona se o elemento pai tiver altura definida;
como o card usa `min-height` (e não uma altura fixa), uma regra como
`height: 80%` calcularia 80% de "auto", chegaria a zero, e a linha ficaria com
2px de largura por 0 de altura — invisível, sem erro algum no console. O
`align-self: stretch` resolve pela raiz: a linha acompanha a altura real do
card, seja ela qual for.

**A miniatura** usa `aspect-ratio: 16 / 9` com `object-fit: cover`, o que
garante proporção idêntica em todos os cards mesmo que as imagens originais
tenham tamanhos diferentes — a imagem é recortada, nunca distorcida. A margem
negativa vertical (`margin: -0.75rem 0`) cancela o `padding` do card apenas
nesse elemento, fazendo a imagem encostar nas bordas superior e inferior.

**O número da posição** (`.title-number`) é um círculo com a cor de destaque,
com `flex-shrink: 0` para nunca ser comprimido pelo flex.

### Ações do card

```css
.card-actions
{
    position: absolute;
    top: 0.5rem;
    right: 0.75rem;
    opacity: 0;
    transition: opacity 0.2s ease;
}

.title-card:hover .card-actions,
.title-card:focus-within .card-actions
{
    opacity: 1;
}
```

**`opacity: 0` em vez de `display: none`.** Com `display: none`, o elemento sai
do fluxo do layout e o card "pula" quando os ícones aparecem. Com `opacity`, o
espaço já está reservado e a transição fica suave. Além disso, `opacity` é uma
propriedade que o navegador anima sem recalcular o layout, o que a torna mais
leve.

**`:focus-within` ao lado de `:hover`.** Quem navega por teclado nunca dispara
`:hover`. Sem essa linha, o lápis e a lixeira seriam inalcançáveis para essas
pessoas. Uma linha de CSS, um problema de acessibilidade a menos.

Os dois botões são diferenciados por cor através de seletores de atributo, que
reaproveitam o mesmo `data-acao` já usado pelo JavaScript:

```css
.btn-icon[data-acao="editar"]  { background-color: var(--cor-editar);  color: var(--cor-editar-tinta); }
.btn-icon[data-acao="excluir"] { background-color: var(--cor-remover); color: var(--cor-remover-tinta); }
```

Como o SVG usa `stroke="currentColor"`, a propriedade `color` define ao mesmo
tempo a cor do traço do ícone.

### O modal

```css
#modal
{
    border: none;
    border-radius: 0.75rem;
    padding: 1.5rem;
    width: min(30rem, 90vw);
}

#modal::backdrop
{
    background-color: rgba(0, 0, 0, 0.5);
}
```

`width: min(30rem, 90vw)` significa "o menor entre 30rem e 90% da largura da
janela": em telas grandes o modal tem 30rem; em telas pequenas, ele encolhe e
mantém uma folga nas laterais. Uma linha resolve o caso desktop e o caso
celular.

O `::backdrop` é o pseudo-elemento nativo do `<dialog>` que representa a área
atrás da janela — é ele que escurece o restante da página.

### Responsividade

```css
@media (max-width: 70rem)
{
    .title-card
    {
        flex-direction: column;
        text-align: center;
        width: 100%;
    }

    .title-number { position: absolute; left: 0.75rem; top: 0.75rem; }
    .card-line    { display: none; }
    .card-actions { opacity: 1; }
    ...
}
```

Abaixo de 70rem (1120px), o card deixa de ser uma linha horizontal e passa a
ser uma coluna: a imagem ocupa a largura toda, os textos ficam centralizados, e
as larguras fixas das colunas são substituídas por `width: 100%`.

Duas decisões merecem destaque:

- **A linha divisória é escondida.** Ela separava colunas lado a lado; em
  layout vertical ela não separa mais nada, e viraria apenas um traço solto.
- **As ações ficam sempre visíveis (`opacity: 1`).** Em telas de toque não
  existe `:hover`. Se os botões continuassem escondidos até o mouse passar por
  cima, seriam inalcançáveis no celular.

O número da posição passa a `position: absolute` sobre a imagem, com uma sombra
mais forte para garantir legibilidade sobre qualquer thumbnail.

### Movimento reduzido

```css
@media (prefers-reduced-motion: reduce)
{
    .title-card, .card-actions, .btn-icon, .btn-adicionar
    {
        transition: none;
    }
}
```

`prefers-reduced-motion` é uma preferência que o usuário configura no próprio
sistema operacional, normalmente por causa de enxaqueca, vertigem ou distúrbios
vestibulares — animações podem causar desconforto físico real. Quando essa
preferência está ativa, o projeto simplesmente desliga as transições. Tudo
continua funcionando; apenas para de se mover.

---

## Acessibilidade

As decisões de acessibilidade estão espalhadas pelo código e vale reuni-las:

| Decisão | Onde | O que resolve |
|---|---|---|
| `<label for="...">` em todos os campos | `index.html` | O leitor de tela anuncia o nome do campo; clicar no rótulo foca o campo |
| Campo `imagem_alt` obrigatório | formulário e `montarCard()` | Toda obra cadastrada tem descrição de imagem — a acessibilidade não fica dependendo da boa vontade de quem cadastra |
| `<article>` e `<h2>` no card | `montarCard()` | Dá estrutura navegável à página, além de aparência |
| `aria-hidden="true"` nos `<svg>` | `montarCard()` | O desenho não é lido; quem descreve o botão é o `title` |
| `title` nos botões de ação | `montarCard()`, `index.html` | Nomeia botões que só têm ícone |
| `:focus-within` nas ações | `style.css` | Torna lápis e lixeira alcançáveis por teclado |
| `<dialog>` nativo | `index.html` | Prende o foco do teclado dentro do modal enquanto ele está aberto |
| `prefers-reduced-motion` | `style.css` | Respeita a preferência de sistema por menos animação |

---

## Roteiro de teste

Sugere-se executar na ordem, com o console aberto (`F12`).

| # | Ação | Resultado esperado |
|---|---|---|
| 1 | Abrir o `index.html` | Os 3 cards aparecem, ordenados por nota (9.5, 9.3, 8.9) |
| 2 | Conferir os números | 1, 2, 3 — sem buracos |
| 3 | Conferir a linha cinza vertical | Aparece em todos os cards, com a mesma folga |
| 4 | Passar o mouse sobre um card | Lápis e lixeira aparecem suavemente |
| 5 | Clicar no `+` e tentar salvar em branco | O navegador reclama dos campos obrigatórios |
| 6 | Preencher tudo e salvar | O card entra na posição correta pela nota |
| 7 | Criar uma obra sem ano de fim | O card mostra "2022–Presente" |
| 8 | Criar uma obra com descrição bem longa | O card cresce sem quebrar o layout |
| 9 | Editar uma obra pelo lápis | O modal abre preenchido, com o título "Editar obra" |
| 10 | Mudar a nota para 9.9 e salvar | O card sobe para o primeiro lugar |
| 11 | Abrir o modal de edição, cancelar, clicar no `+` | O formulário vem vazio |
| 12 | Clicar na lixeira e cancelar | Nada é excluído |
| 13 | Clicar na lixeira e confirmar | O card some e os outros se renumeram |
| 14 | Excluir todos os cards | A página fica vazia, sem erro no console |
| 15 | Criar uma obra com a lista vazia | Funciona normalmente |
| 16 | Testar acentos: "Ação, Comédia, História" | Aparecem corretos |
| 17 | Estreitar a janela abaixo de 1120px | O card vira coluna e os ícones ficam sempre visíveis |
| 18 | Navegar só com `Tab` | É possível alcançar o lápis e a lixeira sem mouse |
| 19 | **Cadastrar algo e pressionar `F5`** | **Tudo volta às 3 obras iniciais** — comportamento esperado |

Se houver texto em vermelho no console, algo está errado. Os dois erros mais
comuns:

| Erro | Causa | Onde olhar |
|---|---|---|
| `Cannot read properties of null` | Um `querySelector` não encontrou o elemento | O `id` no HTML está diferente do usado no JS |
| A página pisca e nada acontece ao salvar | Faltou `evento.preventDefault()` | O listener de `submit` |

---

## Limites conhecidos desta etapa

Todos os itens abaixo são **decisões conscientes**, não descuidos. Reconhecer
uma limitação e registrá-la é engenharia; não perceber que ela existe é que é
problema.

1. **Não há persistência.** Nada sobrevive ao `F5`. É o assunto central desta
   etapa e o motivo pelo qual a próxima existe.
2. **Não há compartilhamento.** Cada navegador tem a própria cópia dos dados.
3. **A validação é apenas do navegador.** É conveniência, não garantia — pode
   ser desligada pelo DevTools. A validação real só existe quando há servidor.
4. **A confirmação de exclusão usa `confirm()` nativo.** Funciona e é
   impossível de errar, mas destoa visualmente do restante da interface.
5. **A imagem é informada como caminho ou URL digitada à mão.** Não há upload
   de arquivo, porque upload exige um servidor que receba e grave o arquivo.
6. **Não há busca, filtro nem paginação.** A ordenação é fixa, sempre pela nota
   do IMDb, em ordem decrescente.

### Sobre o `localStorage`

É uma pergunta que costuma surgir, e a resposta ensina bastante. Sim, o
navegador tem um espaço chamado `localStorage`, onde é possível gravar dados
que sobrevivem ao `F5`. Ele resolveria o item 1 da lista acima. Mas não resolve
o item 2, e vale reparar no motivo:

- Os dados ficam no navegador daquela pessoa, naquele computador. Ninguém mais
  os vê.
- Ao trocar de máquina ou abrir no celular: catálogo vazio.
- Ao limpar o histórico do navegador: catálogo apagado.
- Não existe "o catálogo". Existe "o catálogo do computador 12 do laboratório".

O que falta, portanto, não é apenas gravar — é gravar **em um lugar único, fora
do navegador, que todos consultam**. Esse lugar é o banco de dados. E como o
JavaScript do navegador não tem — e não pode ter — permissão para falar direto
com um banco de dados, alguém precisa ficar no meio, recebendo os pedidos e
conversando com o banco. Esse alguém é o servidor.

---

## Resumo das ideias que este projeto ensina

Independentemente da linguagem ou da tecnologia usada depois, estas ideias se
repetem:

1. **Separar onde os dados moram de como os dados aparecem.** Aqui, as quatro
   funções de CRUD ficam isoladas do código que desenha a tela. Trocar a origem
   dos dados passa a ser uma alteração local.
2. **Se um valor pode ser calculado, não o guarde — calcule-o.** A numeração
   dos cards é posição, não dado.
3. **Guardar o dado no formato que permite trabalhar com ele.** Números como
   números, `null` com significado combinado, decoração só na hora de exibir.
4. **Dois fluxos que diferem em uma linha devem ser o mesmo código.** Um único
   modal e um único `submit` cuidam de criar e de editar.
5. **Funções que leem não devem alterar.** Daí a cópia com `[...obras]` antes
   de ordenar.
6. **Ouvir o clique no pai, e não em cada filho.** Delegação de eventos resolve
   o problema dos elementos criados dinamicamente.
7. **Validação no navegador é conveniência; segurança só existe do lado do
   servidor.**
8. **Acessibilidade é decidida no momento de escrever, não depois.** Rótulo,
   texto alternativo, foco e movimento custam quase nada quando são pensados
   desde o começo.

---

## O que vem a seguir

A próxima etapa introduz o servidor e o banco de dados. Vale
antecipar o que isso significa em termos de código: o `index.html`, o
`style.css`, o modal, o formulário, `montarCard()`, `desenharLista()`,
`formatarAnos()`, as funções que abrem o modal e a delegação de eventos
continuam exatamente como estão.

O que muda está concentrado no bloco das quatro funções de CRUD, no topo do
`script.js` — justamente o bloco que foi mantido separado do resto por esse
motivo. Onde hoje há `obras.push(...)`, passará a haver um pedido pela rede; a
lista `let obras = [...]` vira uma tabela no MySQL; o `let proximoId`
desaparece, substituído pelo `AUTO_INCREMENT` do banco; e o `.sort()` por nota
vira um `ORDER BY nota_imdb DESC` no SQL.

---

Projeto escolar · SENAI · Iago Teixeira
