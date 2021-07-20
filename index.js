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
// app.options('*', cors())
// app.use(cors(configCors))
// Dar parse no body das requisições json
app.use(bodyparser.json())
    // Dar parse nos cookies
app.use(cookie())
app.use(function(req, res, next) {
    console.log("Nova request");

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://192.168.0.103:8080');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

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