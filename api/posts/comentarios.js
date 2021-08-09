let Resposta = require("../resposta")

async function cadastraPonta(app, ponta) {
    cadastraPostComentarios(app, ponta)
}

function cadastraPostComentarios(app, ponta) {
    console.log(`POST ${ponta}`);
    app.post(ponta, async(req, resp) => {
        console.log("Nova request de postar comentario em postagem");
        let resposta = new Resposta(app.erros.comentarios, false)

        let postComentado = req.params.id
        let comentario = req.body.comentario

        console.log(`${postComentado} novo comment: ${comentario}`);

        if (req.login) {
            if (comentario == undefined || comentario == "") {
                resposta.addErro(5)
            }

            if (resposta.getErros().length == 0) {
                if (!isNaN(postComentado)) {
                    let postDados = await app.bancodados("posts").where({ id_post: postComentado }).first()

                    if (postDados) {
                        await app.bancodados("posts_comentarios").insert({ usuario_id: req.login.sessao.usuario_id, post_id: postComentado, comentario: comentario })
                        resposta.aprovada("Comentado com sucesso")
                        console.log("Notificar o WS..");
                        app.teste({
                            tipo: 'atualizarPostagem',
                            postId: postDados.id_post
                        })

                        // Mandar nodificação pro dono do post, e verificar se não é o proprio dono curtindo
                        if (req.login.sessao.usuario_id != postDados.usuario_id) {
                            app.teste({
                                tipo: 'notificacao',
                                titulo: 'Novo comentario',
                                conteudo: `${req.login.usuario.nome} fez um comentario em um post seu: ${comentario}`,
                                usuarioReceber: postDados.usuario_id
                            })
                        }
                    } else {
                        resposta.addErro(3)
                        resposta.recusada("Post não existe")
                    }
                } else {
                    resposta.addErro(1)
                    resposta.recusada("Dados informados invalidos")
                }
            } else {
                resposta.recusada("Campos informados invalidos")
            }
        } else {
            resposta.addErro(2)
            resposta.recusada("Usuario não possui sessão")
        }

        resp.send(resposta.getResposta())
    })
}

module.exports = { cadastraPonta }