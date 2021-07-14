// Cadastro
const cadastro = require("./api/cadastro/cadastro.js")
const login = require("./api/login/login.js")

function carregarPontas(app) {
    local = app.linkapi
    console.log("Carregando pontas...");

    // Cadastrar usuario
    console.log(local + "login/cadastro");
    app.route(local + "/login/cadastro").post(cadastro.cadastrar)

    // Logar usuario
    console.log(local + "login/logar");
    app.route(local + "/login/logar").post(login.logar)
}

module.exports = { carregarPontas }