console.log("Iniciando backend");

// -----
const app = require("express")()

const bodyparser = require("body-parser")
const cookie = require("cookie-parser")
const websocketServer = require("ws").Server

// -------------

// Dar parse no body das requisições json
app.use(bodyparser.json())
    // Dar parse nos cookies
app.use(cookie())
    // -----
const linkapi = "/api"
app.url = linkapi

// -----
var mysql = require("./conexao/conexao")
var pontas = require("./api/pontas")
var erros = require("./utilidades/erros");
var sessao = require("./utilidades/sessao")

app.bancodados = mysql
app.erros = erros;
app.sessao = sessao
app.sessao.setBanco(app.bancodados)

// -----
pontas.carregarPontas(app)

// Testes com WebSocket para fazer atualização dos posts, curtidas e comentarios em tempo real.
// Websocket
var ws = new websocketServer({ port: 8082 })
ws.on('connection', async(conexao, request) => {
    console.log("Nova conexão!");

    let cookieSessao = request.headers.cookie.split("=")[1]
    let sessaoUsuario = await app.sessao.getDadosUsuario(cookieSessao)

    conexao.login = sessaoUsuario
})

let notificarGeral = function(mensagem) {
    console.log("Notificando geral com os dados abaixo:");
    console.log(mensagem);

    let notificados = []

    if (mensagem.usuarioReceber != undefined) {
        console.log("Mensagem destinada somente ao usuario com ID " + mensagem.usuarioReceber);

        for (let conexaoUsuario of ws.clients) {
            if (conexaoUsuario.login.sessao.usuario_id == mensagem.usuarioReceber) {
                console.log("Usuario logado! Enviando notificação!");
                notificados.push(conexaoUsuario)
                break;
            }
        }

        if (notificados.length == 0) console.log("Usuario offline, ignorando o envio da notificação..");
    } else {
        console.log("Enviando mensagem a todos conectados");
        notificados = ws.clients
    }

    notificados.forEach(usuarioConexao => {
        usuarioConexao.send(JSON.stringify(mensagem))
    })
}

app.teste = notificarGeral;


app.listen(8081)