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
var conexao = require("./conexao/conexao")

// -----
const linkapi = "/api"

// -----
console.log("Preparando pontas");

// Cadastrar usuario
app.post(linkapi + "/cadastro", (req, resp) => {
    console.log("Nova requisição de cadastro");
    console.log(req.body);

    resp.send("Recebi sua request")
    resp.end()
})

// Login de usuario
app.post(linkapi + "/login", (req, resp) => {
    console.log("Nova requisição de login");
    console.log(req.body);

    resp.send("Recebi sua request")
    resp.end()
})

app.listen(8081)