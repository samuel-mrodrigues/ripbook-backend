function logar(req, resp) {
    console.log("Nova request para login!");
    console.log(req.body);

    resp.send("Recebi sua solicição de login!")
}

module.exports = { logar };