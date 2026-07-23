function parsePreco(valor) {
    if (valor === undefined || valor === null || valor === "") return 0;

    const texto = String(valor).trim().replace(/[^\d,.-]/g, "");
    if (!texto) return 0;

    const temVirgula = texto.includes(",");
    const temPonto = texto.includes(".");

    if (temVirgula && temPonto) {
        return Number(texto.replace(/\./g, "").replace(",", "."));
    }

    if (temVirgula) {
        return Number(texto.replace(",", "."));
    }

    return Number(texto);
}

function atualizarTotal() {
    const totalEl = document.getElementById("total");
    if (!totalEl) return;

    let total = 0;

    document.querySelectorAll(".dd-cart").forEach(checkbox => {
        if (checkbox.checked) {
            total += parsePreco(checkbox.dataset.preco ?? checkbox.value);
        }
    });

    totalEl.textContent = `total:R$ ${total.toFixed(2)}`;
}

const formasPagamento = {
    pix: {
        titulo: "Pix",
        texto: "Chave Pix: 45 998063120",
        obs: "Envie o comprovante após o pagamento."
    },
    cartao: {
        titulo: "Pagamento por Cartão",
        texto: "maquininha ou link de pagamento.",
        obs: "Aceitamos débito e crédito."
    },
    dinheiro: {
        titulo: "Pagamento em Dinheiro",
        texto: "Pagamento na entrega.",
        obs: "Troco disponível."
    }
};

function atualizarDestinoPagamento() {
    const selectForma = document.getElementById("forma-pagamento");
    const destinoPagamento = document.getElementById("destino-pagamento");

    if (!selectForma || !destinoPagamento) return;

    const info = formasPagamento[selectForma.value] || formasPagamento.pix;

    destinoPagamento.innerHTML = `
        <h3>${info.titulo}</h3>
        <p>${info.texto}</p>
        <small>${info.obs}</small>
    `;
}

function pegarValorTotal() {
    const totalEl = document.getElementById("total");
    if (!totalEl) return 0;

    const texto = totalEl.textContent.replace(/[^0-9,.-]/g, "").replace(",", ".");
    const valor = Number(texto);

    return isNaN(valor) ? 0 : valor;
}

function getItensSelecionados() {
    return Array.from(document.querySelectorAll(".dd-cart:checked")).map(checkbox => {
        const nome = checkbox.dataset.nome || "Produto";
        const preco = parsePreco(checkbox.dataset.preco ?? checkbox.value);
        return `• ${nome} - R$ ${preco.toFixed(2)}`;
    });
}

function getDadosEntrega() {
    return {
        data: document.getElementById("data-entrega")?.value || "Não informada",
        endereco: document.getElementById("endereco")?.value.trim() || "Não informado",
        telefone: document.getElementById("telefone")?.value.trim() || "Não informado",
        observacao: document.getElementById("observacao")?.value.trim() || "Sem observação"
    };
}

function gerarQrPagamento(total, forma) {
    const container = document.getElementById("qrcode");
    if (!container) return;

    if (typeof QRCode === "undefined") {
        container.textContent = "Biblioteca QR não carregada.";
        return;
    }

    container.innerHTML = "";

    const canvas = document.createElement("canvas");
    container.appendChild(canvas);

    QRCode.toCanvas(canvas, `https://meu-site.com/pagamento?valor=${total.toFixed(2)}&forma=${forma}`, { width: 220 });
}

function finalizarPagamento() {
    const total = pegarValorTotal();
    const selectForma = document.getElementById("forma-pagamento");
    const info = formasPagamento[selectForma?.value || "pix"];

    const { data, endereco, telefone, observacao } = getDadosEntrega();

    if (!document.getElementById("data-entrega")?.value) {
        alert("Escolha a data da entrega.");
        return;
    }

    if (!document.getElementById("endereco")?.value.trim()) {
        alert("Digite o endereço.");
        return;
    }

    if (!document.getElementById("telefone")?.value.trim()) {
        alert("Digite o telefone para contato.");
        return;
    }

    const itens = getItensSelecionados();
    const listaItens = itens.length ? itens.join("\n") : "• Nenhum item selecionado";

    document.getElementById("resultado-pagamento").innerHTML = `
        <h3>Resumo do pagamento</h3>
        <p><strong>Total:</strong> R$ ${total.toFixed(2)}</p>
        <p><strong>Forma:</strong> ${info.titulo}</p>
        <p><strong>Data:</strong> ${data}</p>
        <p><strong>Endereço:</strong> ${endereco}</p>
        <p><strong>Telefone:</strong> ${telefone}</p>
        <p><strong>Observação:</strong> ${observacao}</p>
        <p><strong>Itens:</strong><br>${itens.join("<br>")}</p>
    `;

    gerarQrPagamento(total, selectForma?.value || "pix");

    const mensagem = `Pedido confirmado!\nTotal: R$ ${total.toFixed(2)}\nForma: ${info.titulo}\nData: ${data}\nEndereço: ${endereco}\nTelefone: ${telefone}\nObservação: ${observacao}\n\nItens:\n${listaItens}`;

    window.location.href = `https://wa.me/554599104097?text=${encodeURIComponent(mensagem)}`;
}

document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".dd-cart").forEach(cb => {
        cb.checked = false;
    });

    atualizarTotal();

    document.querySelectorAll(".dd-cart").forEach(checkbox => {
        checkbox.addEventListener("change", atualizarTotal);
    });

    document.querySelectorAll(".produto-img").forEach(img => {
        const defaultSrc = img.dataset.default || img.src;
        const hoverSrc = img.dataset.hover;

        img.addEventListener("mouseenter", () => {
            if (hoverSrc) img.src = hoverSrc;
        });

        img.addEventListener("mouseleave", () => {
            img.src = defaultSrc;
        });
    });

    const slide = document.getElementById("slaide");
    if (slide) {
        const track = slide.querySelector(".slider-track");
        const items = Array.from(slide.querySelectorAll(".slider-item"));
        const prevBtn = slide.querySelector(".slider-btn.prev");
        const nextBtn = slide.querySelector(".slider-btn.next");

        let index = 0;

        function atualizarSlide() {
            if (track) {
                track.style.transform = `translateX(-${index * 100}%)`;
            }
        }

        prevBtn?.addEventListener("click", () => {
            index = (index - 1 + items.length) % items.length;
            atualizarSlide();
        });

        nextBtn?.addEventListener("click", () => {
            index = (index + 1) % items.length;
            atualizarSlide();
        });

        atualizarSlide();
    }

    document.getElementById("forma-pagamento")?.addEventListener("change", atualizarDestinoPagamento);
    atualizarDestinoPagamento();

    document.getElementById("btn-finalizar")?.addEventListener("click", finalizarPagamento);

    document.getElementById("btn-revendedor")?.addEventListener("click", () => {
        const nome = document.getElementById("nome-revendedor")?.value.trim() || "Não informado";
        const whatsapp = document.getElementById("whatsapp-revendedor")?.value.trim() || "Não informado";
        const cidade = document.getElementById("cidade-revendedor")?.value.trim() || "Não informado";
        const cpf = document.getElementById("identidade-cpf")?.value.trim() || "Não informado";
        const endereco = document.getElementById("rua-numero")?.value.trim() || "Não informado";
        const mensagem = document.getElementById("mensagem-revendedor")?.value.trim() || "Sem mensagem";

        const texto = `Cadastro de revendedor\nNome: ${nome}\nWhatsApp: ${whatsapp}\nCPF: ${cpf}\nEndereço: ${endereco}\nCidade: ${cidade}\nMensagem: ${mensagem}`;

        window.location.href = `https://wa.me/554599104097?text=${encodeURIComponent(texto)}`;
    });

    document.getElementById("link-encomendas")?.addEventListener("click", (e) => {
        e.preventDefault();
        document.getElementById("pagamento")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });

    document.getElementById("link-sejaumrevendedor")?.addEventListener("click", (e) => {
        e.preventDefault();
        document.getElementById("cadastro-revendedor")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });

    document.getElementById("link-conhecanososprodutos")?.addEventListener("click", (e) => {
        e.preventDefault();
        document.getElementById("produtos")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });

    document.getElementById("link-biografiachoocodesperto")?.addEventListener("click", (e) => {
        e.preventDefault();
        document.getElementById("biografia-choocodesperto")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });

    document.getElementById("link-tornesemembro")?.addEventListener("click", (e) => {
        e.preventDefault();
        document.getElementById("tornesemembro")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
});