// Cadastro
const cadastro = require("./cadastro/cadastro.js")
const login = require("./login/login.js")

function carregarPontas(app) {
    local = app.linkapi
    console.log("Carregando pontas...");

    // Cadastrar usuario
    cadastro.cadastraPonta(app, local + "/login/cadastro")

    // Logar usuario
    login.cadastraPontaLogin(app, local + "/login/logar")
        // Login por cookie
    login.cadastraPontaCookie(app, local + "/login/logar/cookie")
}

module.exports = { carregarPontas }