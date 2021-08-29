const Erros = require("./erro")

class Resposta {
    // Dados retornado no objeto .dados
    dados = {}

    // Objeto de er
    erros = {}

    // Status
    // 0 = Request aprovada
    // 1 = Request recusada
    status = 1

    mensagem = "..."
    retornarData = false;

    constructor(errosPossiveis, retornaDado) {
        this.erros = new Erros(errosPossiveis)
        this.retornarData = retornaDado
    }

    getDados() {
        return this.dados.dados;
    }

    addDados(key, dado) {
        this.dados[key] = dado
    }

    getResposta() {
        if (this.retornarData && Object.keys(this.dados).length == 0) throw "Erro: Retorna dado esta true porem nao tem nada nos dados a retornar"

        let resp = {}

        resp.status = this.status
        if (this.retornarData) resp.dados = this.dados
        resp.erros = this.erros.getErrosFormatados()
        resp.mensagem = this.mensagem

        return resp
    }

    getErros() {
        return this.erros.getErros()
    }

    getMsgErros() {
        return this.erros.getErrosFormatados()
    }

    addErro(novoErro) {
        return this.erros.addErro(novoErro)
    }

    setMensagemResp(msg) {
        this.mensagem = msg
    }

    aprovada(mensagem) {
        this.status = 0
        this.setMensagemResp(mensagem)
    }

    recusada(mensagem) {
        this.status = 1
        this.setMensagemResp(mensagem)
    }

    SetRetornarData(bool) {
        this.retornarData = bool
    }

}
module.exports = Resposta