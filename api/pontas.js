// Cadastro
const { response } = require("express")
const cadastro = require("./cadastro/cadastro.js")
const login = require("./login/login.js")
const logout = require("./login/logout")

const posts = require("./posts/post")

async function carregarPontas(app) {
    let url = app.url

    // Ponte mestre. 
    app.use(async function(req, res, next) {
        console.log("Nova request para o backend...");

        console.log("[Inicio da request]");
        console.log(req.method);
        console.log("--------------------");

        // res.setHeader('Access-Control-Allow-Origin', 'http://192.168.0.103:8080');
        res.setHeader('Access-Control-Allow-Origin', 'http://192.168.0.101:8080');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
        res.setHeader('Access-Control-Allow-Credentials', true);

        // Se não for uma request preflight, faz a verificação da sessão
        if (req.method != "OPTIONS") {
            console.log("Efetuando checagem de sessão....");

            let cookies = req.cookies
            console.log(cookies);
            if (cookies.sessaoID != undefined) {
                let sessaoID = cookies.sessaoID
                console.log("Cookie de sessão da request: " + sessaoID);

                let dadosSessao = await app.sessao.getDadosUsuario(sessaoID)
                console.log(dadosSessao);

                if (dadosSessao) {
                    req.sessao = dadosSessao;
                    console.log("Cookie de sessão valida. Incluindo sessão na request para outras pontas..");
                } else {
                    console.log("Cookie de sessão não existe/invalido. Não adicionando na request a sessão...");
                }
            } else {
                console.log("Request nao tem cookies de sessão..");
            }
        }
        next();
    });

    console.log("Carregando pontas...");
    // Cadastrar usuario
    cadastro.cadastraPonta(app, url + "/login/cadastro")
        // Logar usuario
    login.cadastraPontaLogin(app, url + "/login/logar")
        // Login por cookie
    login.cadastraPontaCookie(app, url + "/login/logar/cookie")
        // Logout
    logout.cadastrarPonta(app, url + "/login/logout")

    // Postar algo/Pegar algum post/Posts
    posts.cadastraPonta(app, url + "/posts")
}

module.exports = { carregarPontas }