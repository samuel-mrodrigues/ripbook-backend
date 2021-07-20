console.log("Iniciando backend");

// -----
const app = require("express")()

// -----
const cors = require("cors")
let corsOrigem = {
    origin: "http://192.168.1.98:8080",
    credentials: true
}

const bodyparser = require("body-parser")
const cookie = require("cookie-parser")

// Usar cors para permitir requisições 
app.use(cors(corsOrigem))
    // Dar parse no body das requisições json
app.use(bodyparser.json())
    // Dar parse nos cookies
app.use(cookie())

// -----
const linkapi = "/api"
app.linkapi = linkapi

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

// ------
app.listen(8081)