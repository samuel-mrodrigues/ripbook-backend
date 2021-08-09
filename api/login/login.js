// Regras de login
// email: Precisa conter um @ e ser maior que 6 chars.
// senha: Minimo de 6 chars


const { isStringVazio } = require("../../utilidades/validacoesBasicas")
let Resposta = require("../resposta")

// Ponta de login por dados do formulario
async function cadastraPontaLogin(app, ponta) {
    console.log(`POST ${ponta}`);

    app.post(ponta, async(req, resp) => {
        let resposta = new Resposta(app.erros.login.logar, false)
            // JSON: {
            //     email: "",
            //     senha: "",
            //     lembrarlogin: "",    
            // }
            //Status do login:
            // 0: Login aprovado
            // 1: Login negado

        let dados = {...req.body };

        // Validação dos campos
        // Codigo do erro: 3
        if (!emailValido(dados.email)) {
            resposta.addErro(3)
        }

        // Codigo do erro 4
        if (!senhaValida(dados.senha)) {
            resposta.addErro(4)
        }

        let totalErros = resposta.getErros().length

        // Se não tiver erro na validação, procede na consulta ao banco
        //Formular a resposta. 0 = Sucesso, 1= Erro
        if (totalErros == 0) {
            let usuario = await app.bancodados("usuarios").where({ email: dados.email }).first()

            if (usuario) {

                if (usuario.senha == dados.senha) {
                    let dadosDaSessao = await app.sessao.gerarSessao(usuario)
                    if (dadosDaSessao) {
                        resp.cookie("sessaoID",
                            dadosDaSessao.sessao_id, {
                                expires: new Date(parseInt(dadosDaSessao.validade)),
                                path: "/"
                            })

                        resposta.aprovada("Login aprovado")
                    } else {

                        resposta.addErro(5)
                        resposta.recusada("Erro interno do servidor")
                    }
                } else {
                    resposta.addErro(2)

                    resposta.recusada("Senha incorreta")
                }
            } else {
                resposta.addErro(1)

                resposta.recusada("E-mail não existe")
            }
        } else {
            resposta.recusada("Validação dos campos recusada")
        }

        resp.send(resposta.getResposta())
    })
}

// Ponta de login por cookie
async function cadastraPontaCookie(app, ponta) {
    console.log(`POST ${ponta}`);
    app.post(ponta, async(req, resp) => {
        let resposta = new Resposta(app.erros.login.logar_com_cookie, false)

        if (req.login != undefined) {
            let cookieSessao = req.login.sessao.sessao_id;
            let sessaoNoBanco = await app.bancodados("sessoes").where({ sessao_id: cookieSessao }).first()

            if (sessaoNoBanco) {
                let dataAgora = new Date()
                let dataSessao = new Date(parseInt(sessaoNoBanco.validade))
                if (dataSessao.getTime() >= dataAgora.getTime()) {
                    resposta.SetRetornarData(true)
                    let userInfo = req.login.usuario

                    resposta.addDados('info_usuario', {
                        nome: userInfo.nome,
                        sobrebome: userInfo.sobrenome,
                        email: userInfo.email,
                        id: userInfo.id_usuario
                    })

                    resposta.aprovada("Login por cookie aprovado")
                } else {
                    resposta.addErro(2)
                    resposta.recusada("Sessão expirada")
                }
            } else {
                resposta.addErro(1)
                resposta.recusada("A sessão solicitada não existe.")
            }
        } else {
            // Erro por nao ter o cookie na requisição.
            resposta.addErro(1)
            resposta.recusada("Sessão invalida")
        }

        resp.send(resposta.getResposta())
    })
}


// Validações
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


module.exports = { cadastraPontaLogin, cadastraPontaCookie };