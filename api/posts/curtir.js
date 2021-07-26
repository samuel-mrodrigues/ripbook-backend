let Resposta = require("../resposta")

async function cadastraPonta(app, ponta) {
    cadastraPostCurtir(app, ponta)
}

function cadastraPostCurtir(app, ponta) {
    console.log(`POST ${ponta}`);
    app.post(ponta, async(req, resp) => {
        console.log("Nova request de curtir post");
        let resposta = new Resposta(app.erros.curtir, false)

        let postCurtido = req.params.id
            // if (req.sessao) {

        if (!isNaN(postCurtido)) {
            let postDados = await app.bancodados("posts").where({ id_post: postCurtido }).first()

            if (postDados) {
                let curtidaDados = await app.bancodados("curtidas").where({ post_id: postCurtido, usuario_id: req.sessao.usuario.id_usuario }).first()

                if (!curtidaDados) {
                    console.log("Post ainda n foi curtido");
                    await app.bancodados("curtidas").insert({ usuario_id: req.sessao.usuario.id_usuario, post_id: postCurtido })
                    console.log("Curtido");

                    resposta.aprovada("Sucesso")
                } else {
                    console.log("Já curtiu o post");
                    resposta.addErro(4)
                    resposta.recusada("Ação não permitida")
                }
            } else {
                resposta.addErro(3)
                resposta.recusada("Post para dar like não existe")
            }
        } else {
            resposta.addErro(1)
            resposta.recusada("Dados informados invalidos")
        }
        // } else {
        //     resposta.addErro(2)
        //     resposta.recusada("Usuario não possui sessão")
        // }

        resp.send(resposta.getResposta())
    })
}

module.exports = { cadastraPonta }