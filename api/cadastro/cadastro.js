// Regras de login
// nome: Minimo 2 chars
// sobrenome: Minimo de 3 chars
// email: Minimo de 6 chars e conter um @
// senha: Minimo de 6 chars e maximo de 15

const { isStringVazio } = require("../../utilidades/validacoesBasicas")

let Resposta = require("../resposta")

async function cadastraPonta(app, ponta) {
    console.log(`POST ${app.url}${ponta}`);
    app.post(ponta, async (req, resp) => {
        let resposta = new Resposta(app.erros.login.cadastro, false)

        console.log("Nova request para cadastro!");
        // JSON: {
        //     nome: "",
        //     sobrenome: "",
        //     email: "",
        //     senha: ""
        // }
        //Status do cadastro:
        // 0: Cadastro aprovado
        // 1: Cadastro negado
        let dados = { ...req.body }
        console.log(dados);

        // Validação dos campos
        // Codigo de erro: 1
        if (!nomeValido(dados.nome)) {
            console.log("Nome invalido:");
            resposta.addErro(1)
        }

        // Codigo de erro: 2
        if (!sobrenomeValido(dados.sobrenome)) {
            console.log("Sobrenome invalido");
            resposta.addErro(2)
        }

        // // Codigo de erro: 3
        if (!emailValido(dados.email)) {
            console.log("Email invalido");
            resposta.addErro(3)
        }

        // // Codigo de erro: 4
        if (!senhaValida(dados.senha)) {
            console.log("Senha invalida");
            resposta.addErro(4)
        }

        let totalErros = resposta.getErros();
        console.log("Total de erros encontrados: " + totalErros);
        // Se não tiver erro na validação, procede na consulta ao banco
        //Formular a resposta. 0 = Sucesso, 1= Erro
        if (totalErros == 0) {
            let usuario = await app.bancodados("usuarios").where({ email: dados.email }).first()
            if (!usuario) {
                console.log("Usuario nao existe. Cadastrando no banco...");

                let novoCadastro = await app.bancodados("usuarios").insert(dados)

                if (novoCadastro) {
                    console.log("Inserido com sucesso!");
                    resposta.aprovada("Cadastro realizado")
                } else {
                    console.log("Erro ao inserir:");
                }

            } else {
                console.log("Novo cadastro com um e-mail existente!: " + dados.email);
                resposta.addErro(6)
                resposta.recusada("E-mail informado já em uso")
            }
        } else {
            resposta.recusada("Validação dos campos informados não aprovada")
        }

        resp.send(resposta.getResposta())
    })
}

function nomeValido(nome) {
    if (isStringVazio(nome)) return false;
    if (nome.length <= 2) return false;

    return true
}

function sobrenomeValido(sobrenome) {
    if (isStringVazio(sobrenome)) return false;
    if (sobrenome.length <= 3) return false;

    return true;
}

function emailValido(email) {
    if (isStringVazio(email)) return false;
    if (email.length <= 6) return false;
    if (email.indexOf("@") == -1) return false;

    return true;
}

function senhaValida(senha) {
    if (isStringVazio(senha)) return false;
    if (senha.length < 6) return false

    return true;
}

module.exports = { cadastraPonta };