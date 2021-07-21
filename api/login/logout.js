let Resposta = require("../resposta")

async function cadastrarPonta(app, ponta) {
    console.log(`POST ${app.url}${ponta}`);

    app.post(ponta, async (req, resp) => {
        console.log("Nova request de logout!");
        let resposta = new Resposta(app.erros.login.logout, false)

        let dados = req.body
        console.log(dados);

        let sessao = dados.sessao.toString()
        let existe = await app.bancodados("sessoes").where({ sessao_id: sessao }).first()
        console.log(existe);

        if (existe) {
            console.log("Sessão existe no banco!");

            let removerSessao = await app.bancodados("sessoes").delete().where({ sessao_id: sessao })
            if (removerSessao) {

                resposta.aprovada("Logout efetuado com sucesso")
            } else {
                resposta.recusada("Não foi possivel realizar o logout")
            }

        } else {
            console.log("Sessão " + sessao + " não existe no banco.");
            resposta.addErro(1)
            resposta.recusada("A sessão informada não existe, logout falhou.")
        }

        resp.send(resposta.getResposta())
    })

}

module.exports = {
    cadastrarPonta
}