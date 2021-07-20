async function cadastrarPonta(app, ponta) {
    
    app.post(ponta, async (req, resp) => {
        console.log("POST " + local + "/login/logout");
        let msgErros = app.erros.login.logout
        console.log("Nova request de logout!");
        let dados = req.body
        console.log(dados);

        let erros = []
        let resposta = {}
        resposta.status = 1

        let sessao = dados.sessao.toString()
        let existe = await app.bancodados("sessoes").where({sessao_id: sessao}).first()
        console.log(existe);

        if (existe) {
            console.log("Sessão existe no banco!");

            let removerSessao = await app.bancodados("sessoes").delete().where({sessao_id: sessao})
            if (removerSessao) {

                resposta.status = 0
                resposta.mensagem = "Sessão excluida com sucesso, logout realizado."
            } else {
                resposta.mensagem = "Não foi possivel efetuar o logout"
            }

        } else {
            console.log("Sessão " + sessao + " não existe no banco.");
            erros.push(1)
            resposta.mensagem = "Esta sessão não existe"
        }

        resposta.erros = {}
        erros.forEach(codErro => {
            resposta.erros[codErro] = msgErros[codErro].mensagem
        })

        resp.send(resposta)
    })
    
}

module.exports = {
    cadastrarPonta
}