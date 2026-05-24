const form = document.querySelector("#form-pesquisa");
const resultado = document.querySelector("#resultado");

form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const nome = document.querySelector("#nome").value.trim();

    if (nome === "") {
        resultado.textContent = "Digite um nome para buscar.";
        return;
    }

    try {
        resultado.textContent = "Carregando...";

        const resposta = await fetch("https://api.tvmaze.com/search/shows?q=" + nome);

        if (!resposta.ok) {
            throw new Error("Erro HTTP: " + resposta.status);
        }

        const dados = await resposta.json();

        mostrarResultado(dados);

    } catch (erro) {
        console.error(erro);
        resultado.textContent = "Erro ao carregar dados.";
    }
});

function mostrarResultado(lista) {
    resultado.innerHTML = "";
    resultado.className = "d-flex flex-wrap justify-content-center";

    if (lista.length === 0) {
        resultado.textContent = "Nenhum resultado encontrado.";
        return;
    }

    lista.forEach(item => {
        const card = document.createElement("div");
        card.className = "card m-3";
        card.style.width = "16rem";

        let imagemHTML = `
            <div class="d-flex align-items-center justify-content-center bg-light text-secondary card-img-top" style="height: 350px;">
                Série sem imagem
            </div>
        `;

        if (item.show.image) {
            imagemHTML = `<img src="${item.show.image.medium}" class="card-img-top" alt="${item.show.name}" style="height: 350px; object-fit: cover;">`;
        }

        card.innerHTML = `
            ${imagemHTML}
            <div class="card-body text-center">
                <strong>${item.show.name}</strong><br>
                Score: ${item.score}
            </div>
        `;
        resultado.appendChild(card);
    });
}