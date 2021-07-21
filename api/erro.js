class Erro {
    erros = []
    mensagens = {}

    constructor(mensagens) {
        console.log("Novo construção de erro");
        this.mensagens = mensagens

        console.log("Criando um novo campo de erros");
    }

    addErro(novoErro) {
        this.erros.push(novoErro)
    }
    removeErro(erro) {
        let index = this.erros.indexOf(erro)

        if (index != -1) {
            this.erros.splice(index, 1)
        }
    }

    getMensagens() {
        return this.mensagens
    }

    getErrosFormatados() {
        let msgErros = {}
        this.erros.forEach(codErro => {
            msgErros[codErro] = this.mensagens[codErro].mensagem
        })

        return msgErros;
    }

    getErros() {
        return this.erros;
    }

}

module.exports = Erro