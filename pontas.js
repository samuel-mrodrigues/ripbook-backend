// Cadastro
const cadastro = require("./api/cadastro/cadastro.js")
const login = require("./api/login/login.js")

function carregarPontas(app) {
    local = app.linkapi
    console.log("Carregando pontas...");

    // Cadastrar usuario
    console.log(local + "/login/cadastro");
    cadastro.cadastraPonta(app, local + "/login/cadastro")

    // Logar usuario
    console.log(local + "/login/logar");
    login.cadastraPonta(app, local + "/login/logar")
}

module.exports = { carregarPontas }