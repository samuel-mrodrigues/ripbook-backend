let Resposta = require("../resposta")

async function cadastraPonta(app, ponta) {
    cadastraPostDescurtir(app, ponta)
}

function cadastraPostDescurtir(app, ponta) {
    console.log(`POST ${ponta}`);
    app.post(ponta, async(req, resp) => {
        console.log("Nova request de descurtir post");
        let resposta = new Resposta(app.erros.descurtir, false)

        let postCurtido = req.params.id
            // if (req.sessao) {

        if (!isNaN(postCurtido)) {
            let postDados = await app.bancodados("posts").where({ id_post: postCurtido }).first()

            if (postDados) {
                let curtidaDados = await app.bancodados("curtidas").where({ post_id: postCurtido, usuario_id: req.sessao.usuario.id_usuario }).first()

                if (curtidaDados) {
                    console.log("Post ainda n foi descurtido");
                    await app.bancodados("curtidas").delete({ usuario_id: req.sessao.usuario.id_usuario, post_id: postCurtido })
                    console.log("Descurtido");

                    resposta.aprovada("Sucesso")
                } else {
                    console.log("Nao tem curtida nesse post");
                    resposta.addErro(4)
                    resposta.recusada("Ação não permitida")
                }
            } else {
                resposta.addErro(3)
                resposta.recusada("Post para descurtir não existe")
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