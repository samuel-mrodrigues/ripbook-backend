async function cadastrar(req, resp) {
    console.log("Nova request para cadastro!");
    // JSON: {
    //     nome: "",
    //     sobrenome: "",
    //     email: "",
    //     senha: ""
    // }
    // Codigos de Erros.
    // 1: Nome invalido
    dados = { ...req.body }
    erros = []
    console.log(dados);

    // Codigo de erro: 1
    if (!nomeValido(dados.nome)) {
        console.log("Nome invalido:");
        erros.push(1)
    }

    // Codigo de erro: 2
    if (!sobrenomeValido(dados.sobrenome)) {
        console.log("Sobrenome invalido");
        erros.push(2)
    }

    // Codigo de erro: 3
    if (!emailValido(dados.email)) {
        console.log("Email invalido");
        erros.push(3)
    }

    // Codigo de erro: 4
    if (!senhaValida(dados.senhaValida)) {
        console.log("Senha invalida");
        erros.push(4)
    }

    resp.send("Recebi sua solicitação de cadastro!")
}

function isVazio(algo) {
    if (algo == null) return true;
    if (typeof algo == String && algo.length == 0) return true
}

function nomeValido(nome) {
    if (isVazio(nome)) return false;
    if (nome.length <= 2) return false;
}

function sobrenomeValido(sobrenome) {
    if (isVazio(sobrenome)) return false;
    if (sobrenome.length <= 3) return false;
}

function emailValido(email) {
    if (isVazio(email)) return false;
    let a = "a"
    if (email.indexOf("@") == -1) return false;

}

function senhaValida() {

}

module.exports = { cadastrar };