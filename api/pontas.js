// Cadastro
const cadastro = require("./cadastro/cadastro.js")
const login = require("./login/login.js")
const logout = require("./login/logout")

const posts = require("./posts/post")

async function carregarPontas(app) {
    local = app.linkapi
    console.log("Carregando pontas...");

    await app.all("*", (req, resp, next) => {
        next()
    })

    // Cadastrar usuario
    cadastro.cadastraPonta(app, local + "/login/cadastro")

    // Logar usuario
    login.cadastraPontaLogin(app, local + "/login/logar")
    // Login por cookie
    login.cadastraPontaCookie(app, local + "/login/logar/cookie")
    // Logout
    logout.cadastrarPonta(app, local + "/login/logout")

    // Postar algo/Pegar algum post/Posts
    posts.cadastraPonta(app, local + "/posts")
}

module.exports = { carregarPontas }