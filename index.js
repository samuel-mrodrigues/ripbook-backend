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

app.conexao = mysql

// -----
pontas.carregarPontas(app)
// app.post("/api/cadastro", (req, resp) => {
//     resp.send("Recebi sua request")
// })
app.listen(8081)