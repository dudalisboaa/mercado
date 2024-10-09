// Produtos do catálogo
const produtos = [
    { id: 1, nome: 'Bloco de Ouro', preco: 100, imagem: '/assets/goldblock.png', descricao: 'Um literal block de Ouro, pelo preço daqui de nossa loja isso é um roubou. O peso é somente 19,300 kg. (So pra avisar nosso E-Market não cobre o seu transporte ;)' },
    { id: 2, nome: 'Espada de Ferro', preco: 50, imagem: '/assets/Enchanted_Iron_Sword.png', descricao: 'Uma espada de ferro encantada, calibrada e afida, feita por um profisional para um profisional. Ela foi encantada com Sharpness 16, Knockback 939 etc (Parando pra pensar não seria melhor colocar os encantamentos numa espada de diamente?).' },
    { id: 3, nome: 'Maça dourada abençoada', preco: 999999, imagem: '/assets/god-apple.gif', descricao: 'Pode até parecer uma maçã comum más, essa maçã feita sob medida pode e vai solucionar 99,99% dos seus problemas; relacionados a saúdo (Ministerío da saúde adverte "Um medico devera ser consultado".) ' },
];

// Carregar produtos no catálogo
function carregarProdutos() {
    const containerProdutos = document.getElementById('produtos');
    produtos.forEach(produto => {
        const divProduto = document.createElement('div');
        divProduto.className = 'produto';
        divProduto.innerHTML = `
            <img src="${produto.imagem}" alt="${produto.nome}">
            <h3>${produto.nome}</h3>
            <p>Preço: R$ ${produto.preco}</p>
            <p>${produto.descricao}</p>
            <button onclick="adicionarAoCarrinho(${produto.id})">Adicionar ao Carrinho</button>
        `;
        containerProdutos.appendChild(divProduto);
    });
}

// Adicionar produto ao carrinho
function adicionarAoCarrinho(idProduto) {
    let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    const produto = produtos.find(p => p.id === idProduto);
    carrinho.push(produto);
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    alert(`${produto.nome} foi adicionado ao carrinho.`);
}

// Carregar carrinho
function carregarCarrinho() {
    const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    const containerCarrinho = document.getElementById('carrinho');
    containerCarrinho.innerHTML = '';
    if (carrinho.length === 0) {
        containerCarrinho.innerHTML = '<p>O carrinho está vazio.</p>';
        return;
    }
    carrinho.forEach(produto => {
        const divProduto = document.createElement('div');
        divProduto.className = 'produto';
        divProduto.innerHTML = `
            <img src="${produto.imagem}" alt="${produto.nome}">
            <h3>${produto.nome}</h3>
            <p>Preço: R$ ${produto.preco}</p>
            <p>${produto.descricao}</p>
            <button onclick="removerDoCarrinho(${produto.id})">Remover</button>
        `;
        containerCarrinho.appendChild(divProduto);
    });
}

// Remover produto do carrinho
function removerDoCarrinho(idProduto) {
    let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    carrinho = carrinho.filter(produto => produto.id !== idProduto);
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    carregarCarrinho();
}

// Finalizar compra
function finalizarCompra() {
    window.location.href = 'checkout.html';
}

// Carregar carrinho na página de checkout
function carregarCarrinhoCheckout() {
    const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    const containerCarrinho = document.getElementById('carrinhoCheckout');
    containerCarrinho.innerHTML = '';
    if (carrinho.length === 0) {
        containerCarrinho.innerHTML = '<p>O carrinho está vazio.</p>';
        return;
    }
    carrinho.forEach(produto => {
        const divProduto = document.createElement('div');
        divProduto.className = 'produto';
        divProduto.innerHTML = `
            <img src="${produto.imagem}" alt="${produto.nome}">
            <h3>${produto.nome}</h3>
            <p>Preço: R$ ${produto.preco}</p>
            <p>${produto.descricao}</p>
        `;
        containerCarrinho.appendChild(divProduto);
    });
}

// Event listener para o formulário de checkout
if (document.getElementById('checkoutForm')) {
    document.getElementById('checkoutForm').addEventListener('submit', function (event) {
        event.preventDefault();
        alert('Compra finalizada com sucesso!');
        localStorage.removeItem('carrinho');
        window.location.href = 'confirmacao.html';
    });
}

async function cadastrar(event) {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const data = { name, email, password }

    const response = await fetch('http://localhost:4500/usuario/cadastrar', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })

    const result = await response.json();

    if (result.success) {
        alert(result.message)
    } else {
        alert(alert.message)
    }
}

async function logar(event) {
    event.preventDefault()

    const email = document.getElementById('email_login').value;
    const password = document.getElementById('password_login').value;

    const data = { email, password }

    const response = await fetch("http://localhost:4500/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })

    let result = await response.json();

    if (result.success) {
        let userData = result.data;

        localStorage.setItem('informacoes', JSON.stringify(userData))

        window.location.href = "cadastro.html"

        alert(result.message)
    } else {
        alert(result.message)
    }
}

function sair() {
    localStorage.removeItem('informacoes')
    window.location.href = "cadastro.html"
}

window.addEventListener("load", () => {
    if (localStorage.getItem("informacoes")) {
        let html = document.getElementById("informacoes")
        let dados = JSON.parse(localStorage.getItem('informacoes'))
        dados.perfil === 'admin'
            ? document.getElementById('cadastrar_produto').style.display = 'block'
            : document.getElementById('cadastrar_produto').style.display = 'none'

        html.innerHTML = `<div style="display: flex; flex-direction: column; align-items: end"> nome: ${dados.nome} email: ${dados.email} Perfil: ${dados.perfil}
            </div>`

        html.style.display = "block"
    }
})

async function cadastrarProduto(event) {
    event.preventDefault()

    const title = document.getElementById('title').value
    const price = document.getElementById('price').value
    const file = document.getElementById('file').files[0]

    let formData = new FormData();
    formData.append('title', title)
    formData.append('price', price)
    formData.append('file', file)

}





