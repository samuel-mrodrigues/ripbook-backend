class Resposta {
    resposta = {}
    erros = {}

    // Status
    // 0 = Request aprovada
    // 1 = Request recusada
    status = 1

    constructor(erros) {
        this.erros = erros
    }

    getResposta(respostaSucesso, respostaErro) {
        let resp = {}
        resp.erros = this.erros

        if (respostaSucesso.lenght != 0) resp.mensagem = respostaSucesso
        if (respostaErro.lenght != 0) resp.mensagem = respostaErro

        return resp
    }

    setErros(erros) {
        this.erros = erros
    }

    delErros() {
        this.erros = {}
    }

    aprovada() {
        this.status = 0
    }

    recusada() {
        this.status = 1
    }
}
module.exports = Resposta