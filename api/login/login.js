async function cadastraPonta(app, ponta) {
    let msgErros = app.erros.login.logar
    console.log(msgErros);

    app.post(ponta, (req, resp) => {
        console.log("Nova request para login!");
        console.log(req.body);

        resp.send("Recebi sua solicição de login!")
    })
}

module.exports = { cadastraPonta };