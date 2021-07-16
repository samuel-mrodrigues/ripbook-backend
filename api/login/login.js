
// Regras de login
// email: Precisa conter um @ e ser maior que 6 chars.
// senha: Minimo de 6 chars


const { isStringVazio } = require("../../validacoesBasicas")

async function cadastraPonta(app, ponta) {
    let msgErros = app.erros.login.logar

    app.post(ponta, async (req, resp) => {
        console.log("Nova request para login!");
        // JSON: {
        //     email: "",
        //     senha: "",
        //     lembrarlogin: "",
        // }
        //Status do login:
        // 0: Login aprovado
        // 1: Login negado
        let dados = { ...req.body };
        let erros = []
        console.log(dados);

        // Validação dos campos
        // Codigo do erro: 3
        if (!emailValido(dados.email)) {
            console.log("Email invalido!");
            erros.push(3)
        }

        // Codigo do erro 4
        if (!senhaValida(dados.senha)) {
            console.log("Senha invalida!");
            erros.push(4)
        }

        let resposta = {}
        console.log("Total de erros encontrados: " + erros.length);

        // Se não tiver erro na validação, procede na consulta ao banco
        //Formular a resposta. 0 = Sucesso, 1= Erro
        if (erros.length == 0) {
            resposta.status = 0
            resposta.mensagem = "Login aprovado"

            let usuario = await app.bancodados("usuarios").where({ email: dados.email }).first()
            console.log(usuario);
            if (usuario) {
                console.log("Usuario existe!");

                if (usuario.senha == dados.senha) {
                    console.log("Login pre-aprovado, gerando sessão...");

                    let dadosDaSessao = await app.sessao.gerarSessao(usuario)
                    if (dadosDaSessao != undefined) {
                        console.log("De milli: " + new Date(parseInt(dadosDaSessao.validade)).toUTCString())
                        resp.cookie("sessaoID",
                            dadosDaSessao.sessao_id, {
                            expires: new Date(dadosDaSessao.validadeSessao),
                            path: "/"
                        })
                    } else {
                        console.log("Erro ao gerar sessão para usuario");
                        erros.push(5)
                        resposta.status = 1
                        resposta.mensagem = "Erro interno no servidor."
                    }
                } else {
                    erros.push(2)
                    resposta.status = 1
                    resposta.mensagem = "Senha incorreta para esse e-mail"
                    console.log("Senha incorreta para esse e-mail");
                }
            } else {
                resposta.status = 1
                resposta.mensagem = "Email não existe"
                erros.push(1)
                console.log("O usuario com esse e-mail não existe");
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

function emailValido(email) {
    if (isStringVazio(email)) return false;
    if (email.indexOf("@") == -1) return false;
    if (email.length <= 6) return false;

    return true;
}

function senhaValida(senha) {
    if (isStringVazio(senha)) return false;
    if (senha.length < 6) return false

    return true;
}


module.exports = { cadastraPonta };