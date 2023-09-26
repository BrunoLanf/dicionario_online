let formulario = document.querySelector(".js-formulario");
let resultado = document.querySelector(".js-resultado");
let resultadoTitulo = document.querySelector(".js-resultado_titulo");
let resultadoDescricao = document.querySelector(".js-resultado_descricao");
let loading = document.querySelector(".js-loading");


function notFound() {
    resultadoTitulo.textContent =
        "Palavra não encontrada, tente novamente!";
    resultadoDescricao.textContent = "";
}

function mostrarResultado(mostrar = false) {
    if (mostrar) {
        resultado.classList.remove("display-none");
        loading.classList.remove("display-none");
    } else {
        loading.classList.add("display-none");
    }
}

function parserXML(data) {
    let resposta = {
        titulo: "",
        descricao: "",
    };
    funcaoDeParseamento = new DOMParser();

    resposta.titulo = funcaoDeParseamento
        .parseFromString(data, "text/xml")
        .getElementsByTagName("form")[0]
        .getElementsByTagName("orth")[0].textContent;

    resposta.descricao = funcaoDeParseamento
        .parseFromString(data, "text/xml")
        .getElementsByTagName("sense")[0]
        .getElementsByTagName("def")[0].textContent;

    return resposta;
}

function inserirRespostas(objRespostas) {
    resultadoTitulo.textContent = objRespostas.titulo;
    resultadoDescricao.textContent = objRespostas.descricao;
}

function requisicaoFormulario(palavraBuscar) {
    let url = `https://api.dicionario-aberto.net/word/${palavraBuscar}`;

    fetch(url)
        .then((resposta) => resposta.json())
        .then((resposta) => {
            if (!resposta[0]) {
                notFound();
                return;
            }

            let conteudo = parserXML(resposta[0].xml);
            inserirRespostas(conteudo);
        })
        .finally(() => {
            mostrarResultado();
        });
}

function gerenciarFormulario() {
    formulario.addEventListener("submit", (evento) => {
        evento.preventDefault();

        mostrarResultado(true);
        let palavra = evento.target[0].value;
        requisicaoFormulario(palavra);
    });
}

gerenciarFormulario();