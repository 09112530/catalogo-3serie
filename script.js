let obras = [
{
    id: 1,
    nome: 'Game of Thrones',
    ano_inicio: 2011,
    ano_fim: 2019,
    categorias: 'Fantasia, Drama, Ação',
    descricao: 'Épica adaptação das obras de George R. R. Martin. Conflitos, batalhas e personagens envolventes na luta pelo Trono de Ferro.',
    imagem: 'assets/images/title-1/thumbnail.webp',
    imagem_alt: 'Personagem John Snow segurando uma espada enquanto está sentado no Trono de Ferro. Há o logo da HBO e o título da obra, Game of Thrones.',
    nota_imdb: 9.3,
    nota_rotten: 89
},
{
    id: 2,
    nome: 'Breaking Bad',
    ano_inicio: 2008,
    ano_fim: 2013,
    categorias: 'Crime, Drama, Suspense',
    descricao: 'A transformação de um professor de química em um traficante de metanfetamina. Uma história intensa e impecável.',
    imagem: 'assets/images/title-2/thumbnail.webp',
    imagem_alt: 'Personagens Walter White e Jessy Pink sentados em uma cadeira.',
    nota_imdb: 9.5,
    nota_rotten: 96
},
{
    id: 3,
    nome: 'Friends',
    ano_inicio: 1994,
    ano_fim: 2004,
    categorias: 'Comédia, Romance',
    descricao: 'As vidas, amores e amizades de seis amigos em Nova Iorque. Um comédia icônica e divertida.',
    imagem: 'assets/images/title-3/thumbnail.webp',
    imagem_alt: 'Personagens da série encenando para uma foto dentro de uma moldura de quadro',
    nota_imdb: 8.9,
    nota_rotten: 83
}
];

let proximoId = 4;

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

function formatarAnos(obra)
{
    return obra.ano_fim
        ? `${obra.ano_inicio}–${obra.ano_fim}`
        : `${obra.ano_inicio}–Presente`;
}

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
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
                </svg>
            </button>
            <button class="btn-icon" data-acao="excluir" title="Excluir obra">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <path d="M3 6h18" />
                    <path d="M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2" />
                    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                    <path d="M10 11v6" />
                    <path d="M14 11v6" />
                </svg>
            </button>
        </div>
    </article>`;
}

carregarObras();

const modal = document.querySelector('#modal');
const modalTitulo = document.querySelector('#modal-titulo');
const formulario = document.querySelector('#form-obra');
const btnAdicionar = document.querySelector('#btn-adicionar');
const btnCancelar = document.querySelector('#btn-cancelar');

function abrirModalCriacao()
{
    formulario.reset();
    document.querySelector('#campo-id').value = '';
    modalTitulo.textContent = 'Nova obra';
    modal.showModal();
}

function abrirModalEdicao(id)
{
    const obra = obrasEmTela.find((item) => item.id === id);
    if (!obra) return;

    document.querySelector('#campo-id').value = obra.id;
    document.querySelector('#campo-nome').value = obra.nome;
    document.querySelector('#campo-ano-inicio').value = obra.ano_inicio;
    document.querySelector('#campo-ano-fim').value = obra.ano_fim ?? '';
    document.querySelector('#campo-categorias').value = obra.categorias;
    document.querySelector('#campo-descricao').value = obra.descricao;
    document.querySelector('#campo-imagem').value = obra.imagem;
    document.querySelector('#campo-imagem-alt').value = obra.imagem_alt;
    document.querySelector('#campo-nota-imdb').value = obra.nota_imdb;
    document.querySelector('#campo-nota-rotten').value = obra.nota_rotten;

    modalTitulo.textContent = 'Editar obra';
    modal.showModal();
}

function confirmarExclusao(id)
{
    const obra = obrasEmTela.find((item) => item.id === id);
    if (!obra) return;

    const confirmado = confirm(`Excluir "${obra.nome}" do catálogo?\n\nEsta ação não pode ser desfeita.`);
    if (!confirmado) return;

    excluirObra(id);
    carregarObras();
}

btnAdicionar.addEventListener('click', abrirModalCriacao);
btnCancelar.addEventListener('click', () => modal.close());

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
