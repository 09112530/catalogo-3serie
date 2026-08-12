const catalogo = document.querySelector("main");
const botaoAdicionar = document.querySelector(".title-add");
const duracaoRemocao = 250;
const camposEditaveis = ".title-name, .title-years, .title-categories, .title-description, .title-imdb, .title-rotten";
const htmlBotaoConfirmar = `
                <button class="title-confirm" type="button" aria-label="Confirmar informações">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                        <path d="M20 6L9 17l-5-5" />
                    </svg>
                </button>`;

function renumerarTitulos()
{
    const numeros = catalogo.querySelectorAll(".title-number");
    numeros.forEach((numero, indice) => numero.textContent = indice + 1);
}

function confirmarExclusao(linha)
{
    const nome = linha.querySelector(".title-name").textContent.trim();

    if (nome === "")
    {
        return confirm("Excluir este título do catálogo?");
    }

    return confirm(`Excluir "${nome}" do catálogo?`);
}

function excluirTitulo(linha, botao)
{
    botao.disabled = true;
    linha.classList.add("title-row-removing");

    setTimeout(() =>
    {
        linha.remove();
        renumerarTitulos();
    }, duracaoRemocao);
}

function confirmarTitulo(card, botao)
{
    const campos = card.querySelectorAll("[contenteditable]");

    campos.forEach((campo) => campo.removeAttribute("contenteditable"));
    botao.remove();
}

function editarTitulo(card)
{
    if (card.querySelector(".title-confirm") !== null)
    {
        return;
    }

    const campos = card.querySelectorAll(camposEditaveis);

    campos.forEach((campo) => campo.setAttribute("contenteditable", "true"));
    card.insertAdjacentHTML("beforeend", htmlBotaoConfirmar);
    card.querySelector(".title-name").focus();
}

function criarTitulo()
{
    const linha = document.createElement("div");
    linha.className = "title-row";
    linha.innerHTML = `
            <div class="title-card">
                <div class="title-thumbnail-box">
                    <p class="title-number"></p>
                    <div class="title-thumbnail title-thumbnail-empty"></div>
                </div>
                <div class="title-data">
                    <p class="title-name" contenteditable="true">Título</p>
                    <p class="title-years" contenteditable="true">0000-0000</p>
                    <p class="title-categories" contenteditable="true">Categorias</p>
                </div>
                <p class="title-description" contenteditable="true">Descrição do título.</p>
                <div class="divider"></div>
                <div class="title-avaliation">
                    <p class="title-imdb" contenteditable="true">0.0/10 IMDb</p>
                    <p class="title-rotten" contenteditable="true">0% Rotten Tomatoes</p>
                </div>${htmlBotaoConfirmar}
            </div>
            <div class="title-actions">
                <button class="title-edit" type="button" aria-label="Editar título">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                        <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
                    </svg>
                </button>
                <button class="title-delete" type="button" aria-label="Remover título">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                        <path d="M3 6h18" />
                        <path d="M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2" />
                        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                        <path d="M10 11v6" />
                        <path d="M14 11v6" />
                    </svg>
                </button>
            </div>`;

    return linha;
}

function selecionarConteudo(elemento)
{
    const intervalo = document.createRange();
    intervalo.selectNodeContents(elemento);

    const selecao = window.getSelection();
    selecao.removeAllRanges();
    selecao.addRange(intervalo);
}

botaoAdicionar.addEventListener("click", () =>
{
    const linha = criarTitulo();

    catalogo.insertBefore(linha, botaoAdicionar);
    renumerarTitulos();

    const nome = linha.querySelector(".title-name");
    nome.focus();
    selecionarConteudo(nome);
});

catalogo.addEventListener("click", (evento) =>
{
    const botaoConfirmar = evento.target.closest(".title-confirm");

    if (botaoConfirmar !== null)
    {
        confirmarTitulo(botaoConfirmar.closest(".title-card"), botaoConfirmar);
        return;
    }

    const botaoEditar = evento.target.closest(".title-edit");

    if (botaoEditar !== null)
    {
        editarTitulo(botaoEditar.closest(".title-row").querySelector(".title-card"));
        return;
    }

    const botao = evento.target.closest(".title-delete");

    if (botao === null)
    {
        return;
    }

    const linha = botao.closest(".title-row");

    if (confirmarExclusao(linha) === false)
    {
        return;
    }

    excluirTitulo(linha, botao);
});
