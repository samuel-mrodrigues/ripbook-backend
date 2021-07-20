
let Erro = require("../erro")
let Resposta = require("../resposta")

async function cadastraPonta(app, ponta) {
    cadastraPost(app, ponta)
    cadastraGet(app, ponta)
    cadastraGetParametro(app, ponta)
}

function cadastraGetParametro(app, ponta) {
    console.log("GET " + local + "/posts/:id");
    app.get(ponta + "/:id", (req, resp) => {
        let erros = new Erro(app.erros.posts)
        
        let postRequis = req.params.id
        
        if (!isNaN(postRequis)) {
            console.log("ID valido informado");
        } else {
            console.log("Erro, ID informado não é um numero");
            erros.addErro(3)
        }
        let resposta = new Resposta(erros.getErros())
        
        console.log(resposta.getResposta("Sucesso", "Erro"));
        resp.send("")
    })
}

function cadastraGet(app, ponta) {
    console.log("GET " + local + "/posts");

    app.get(ponta, async (req, resp) => {
        console.log("Novo GET de posts");

        let posts = await app.bancodados("posts")
        // console.log(posts);

        let resposta = []
        for (const key in posts) {
            if (Object.hasOwnProperty.call(posts, key)) {
                const post = posts[key];

                resposta.push({ ...post })
            }
        }

        console.log(resposta);
        resp.send(resposta)
    })
}

function cadastraPost(app, ponta) {
    console.log("POST " + local + "/posts");

    app.post(ponta, async (req, resp) => {
        let msgErros = app.erros.posts

        console.log("Nova request de postagem!");
        let cookieSessao = req.cookies.sessaoID

        let dados = req.body

        let resposta = {}
        resposta.status = 1

        let erros = []

        if (estaVazio(dados.comentario)) {
            console.log("Campo de post não validado");
            erros.push(1)
            resposta.mensagem = "Campos invalidos"
        }

        if (erros.length == 0) {
            let userData = await app.sessao.getDadosUsuario(cookieSessao);
            console.log(userData);

            if (userData) {
                let postagem = await app.bancodados("posts").insert({ usuario_id: userData.sessao.usuario_id, conteudo_post: dados.comentario })
                console.log(postagem);

                resposta.status = 0
                resposta.mensagem = "Postagem realizada com sucesso"
            } else {
                erros.push(2)
            }
        }

        resposta.erros = {}
        erros.forEach(codErro => {
            resposta.erros[codErro] = msgErros[codErro].mensagem
        })

        resp.send(resposta)
    })
}

function estaVazio(string) {
    if (!string) return true;
    if (string.length < 5) return true;

    return false;
}

module.exports = { cadastraPonta }