console.log("Iniciando backend");

// -----
const app = require("express")()

// -----
const cors = require("cors")
const bodyparser = require("body-parser")

// -----
app.use(cors())
app.use(bodyparser.json())

// -----
const linkapi = "/api"
app.linkapi = linkapi

// -----
var mysql = require("./conexao/conexao")
var pontas = require("./pontas")
var erros = require("./erros")

app.bancodados = mysql
app.erros = erros;

// -----
pontas.carregarPontas(app)

// ------
app.listen(8081)