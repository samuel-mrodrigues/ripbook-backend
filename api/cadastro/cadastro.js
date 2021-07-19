// Regras de login
// nome: Minimo 2 chars
// sobrenome: Minimo de 3 chars
// email: Minimo de 6 chars e conter um @
// senha: Minimo de 6 chars e maximo de 15

const { isStringVazio } = require("../../utilidades/validacoesBasicas")

async function cadastraPonta(app, ponta) {
    console.log(local + "/login/cadastro");
    let msgErros = app.erros.login.cadastro

    app.post(ponta, async(req, resp) => {
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
        let dados = {...req.body }
        let erros = []
        console.log(dados);

        // Validação dos campos
        // Codigo de erro: 1
        if (!nomeValido(dados.nome)) {
            console.log("Nome invalido:");
            erros.push(1)
        }

        // Codigo de erro: 2
        if (!sobrenomeValido(dados.sobrenome)) {
            console.log("Sobrenome invalido");
            erros.push(2)
        }

        // // Codigo de erro: 3
        if (!emailValido(dados.email)) {
            console.log("Email invalido");
            erros.push(3)
        }

        // // Codigo de erro: 4
        if (!senhaValida(dados.senha)) {
            console.log("Senha invalida");
            erros.push(4)
        }

        let resposta = {}
        console.log("Total de erros encontrados: " + erros.length);
        // Se não tiver erro na validação, procede na consulta ao banco
        //Formular a resposta. 0 = Sucesso, 1= Erro
        if (erros.length == 0) {
            resposta.status = 0
            resposta.mensagem = "Sucesso no cadastro"

            let usuario = await app.bancodados("usuarios").where({ email: dados.email }).first()
            if (!usuario) {
                console.log("Usuario nao existe. Cadastrando no banco...");

                await app.bancodados("usuarios").insert(dados).then(_ => {
                    console.log("Inserido com sucesso!");
                }).catch(_ => {
                    console.log("Erro ao inserir:");
                    console.log(_);
                    resposta.status = 1
                    resposta.mensagem = "Erro interno no servidor :("
                })
            } else {
                console.log("Novo cadastro com um e-mail existente!: " + dados.email);
                erros.push(6)
                resposta.status = 1;
                resposta.mensagem = "E-mail informado já em uso"
            }
        } else {
            resposta.status = 1
            resposta.mensagem = "Validação dos campos informados não aprovada"
        }

        resposta.erros = {}
        erros.forEach(codErro => {
            resposta.erros[codErro] = msgErros[codErro].mensagem
        })

        resp.send(resposta)
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