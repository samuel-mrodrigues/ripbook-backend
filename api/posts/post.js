let Resposta = require("../resposta")

async function cadastraPonta(app, ponta) {
    cadastraPost(app, ponta)
    cadastraGet(app, ponta)
    cadastraGetParametro(app, ponta)
}

function cadastraGetParametro(app, ponta) {
    console.log(`GET ${ponta}/:id`);

    app.get(ponta + "/:id", async(req, resp) => {

        let resposta = new Resposta(app.erros.posts)
        let postRequis = req.params.id

        console.log(req.login);

        console.log(resposta);
        if (req.login != undefined) {
            if (!isNaN(postRequis)) {
                console.log("ID valido informado");

                let postDados = await app.bancodados("posts").where({ id_post: postRequis }).first()
                if (postDados) {
                    let postDono = await app.bancodados("usuarios").where({ id_usuario: postDados.usuario_id }).first()
                    let estaCurtido = await app.bancodados("posts_curtidas").where({ post_id: postDados.id_post, usuario_id: req.login.sessao.usuario_id }).first()
                    let postCurtidas = await app.bancodados("posts_curtidas").where({ post_id: postDados.id_post })
                    let postComentarios = await app.bancodados("posts_comentarios").where({ post_id: postDados.id_post })

                    // Colocar os dados de cada usuario do comentario no objeto
                    for (let index = 0; index < postComentarios.length; index++) {
                        let comentario = postComentarios[index];

                        let autorComentario = await app.bancodados("usuarios").where({ id_usuario: comentario.usuario_id }).first()
                        comentario.autor = { nome: autorComentario.nome, sobrenome: autorComentario.sobrenome }
                    }

                    console.log(postComentarios);

                    let dadosDoPost = {}
                    dadosDoPost = { id_post: postDados.id_post, conteudo_post: postDados.conteudo_post }
                    dadosDoPost.autor = { id_usuario: postDono.id_usuario, nome: postDono.nome, sobrenome: postDono.sobrenome }
                    dadosDoPost.curtidas = [...postCurtidas]
                    dadosDoPost.comentarios = [...postComentarios]
                    dadosDoPost.curtido = estaCurtido ? true : false

                    resposta.addDados("post", dadosDoPost)
                    resposta.SetRetornarData(true)
                    resposta.aprovada("Sucesso")
                } else {
                    resposta.addErro(4)
                    resposta.recusada("Post solicitado não existe")
                }
            } else {
                console.log("Erro, ID informado não é um numero");
                resposta.addErro(1)
                resposta.recusada("Dados informados invalidos")
            }
        } else {
            resposta.addErro(2)
            resposta.recusada("Solicitação não permitida")
        }

        resp.send(resposta.getResposta())
    })
}

function cadastraGet(app, ponta) {
    console.log(`GET ${ponta}`);

    app.get(ponta, async(req, resp) => {
        console.log("Novo GET de posts");
        let resposta = new Resposta(app.erros.posts, true)

        let posts = await app.bancodados("posts")
            // console.log(posts);

        let listaDePosts = []
        for (const key in posts) {
            if (Object.hasOwnProperty.call(posts, key)) {
                const post = posts[key];

                listaDePosts.push({...post })
            }
        }

        resposta.SetRetornarData(true)
        resposta.addDados("posts", listaDePosts)
        resposta.aprovada("Sucesso")

        resp.send(resposta.getResposta())
    })
}

function cadastraPost(app, ponta) {
    console.log(`POST ${ponta}`);
    app.post(ponta, async(req, resp) => {
        console.log("Nova request de postagem!");

        let resposta = new Resposta(app.erros.posts, false)
        let dados = req.body
        let cookieSessao = req.cookies.sessaoID

        if (estaVazio(dados.comentario)) {
            console.log("Campo de post não validado");
            resposta.addErro(1)
            resposta.recusada("Solicitação faltando parametros...")
        }

        let totalErros = resposta.getErros().length
        if (totalErros == 0) {
            let userData = await app.sessao.getDadosUsuario(cookieSessao);
            let postagem = await app.bancodados("posts").insert({ usuario_id: userData.sessao.usuario_id, conteudo_post: dados.comentario })
            console.log(postagem);

            if (postagem != undefined) {
                resposta.aprovada("Postagem concluida")
            } else {
                resposta.recusada("Erro interno")
            }
        }

        resp.send(resposta.getResposta())
    })
}

function estaVazio(string) {
    if (!string) return true;
    if (string.length < 5) return true;

    return false;
}

module.exports = { cadastraPonta }