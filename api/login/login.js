// Regras de login
// email: Precisa conter um @ e ser maior que 6 chars.
// senha: Minimo de 6 chars


const { isStringVazio } = require("../../utilidades/validacoesBasicas")
let Resposta = require("../resposta")

// Ponta de login por dados do formulario
async function cadastraPontaLogin(app, ponta) {
    console.log(`POST ${app.url}${ponta}`);

    app.post(ponta, async (req, resp) => {
        let resposta = new Resposta(app.erros.login.logar, false)
        console.log("Nova request para login!");
        // JSON: {
        //     email: "",
        //     senha: "",
        //     lembrarlogin: "",    
        // }
        //Status do login:
        // 0: Login aprovado
        // 1: Login negado

        console.log(req.xablau);

        let dados = { ...req.body };

        // Validação dos campos
        // Codigo do erro: 3
        if (!emailValido(dados.email)) {
            console.log("Email invalido!");
            resposta.addErro(3)
        }

        // Codigo do erro 4
        if (!senhaValida(dados.senha)) {
            console.log("Senha invalida!");
            resposta.addErro(4)
        }

        let totalErros = resposta.getErros().length
        console.log("Total de erros encontrados: " + totalErros);

        // Se não tiver erro na validação, procede na consulta ao banco
        //Formular a resposta. 0 = Sucesso, 1= Erro
        if (totalErros == 0) {
            let usuario = await app.bancodados("usuarios").where({ email: dados.email }).first()
            console.log(usuario);

            if (usuario) {
                console.log("Usuario existe!");

                if (usuario.senha == dados.senha) {
                    console.log("Login pre-aprovado, gerando sessão...");

                    let dadosDaSessao = await app.sessao.gerarSessao(usuario)
                    console.log("Sessão gerada: " + dadosDaSessao.sessao_id);

                    if (dadosDaSessao) {
                        resp.cookie("sessaoID",
                            dadosDaSessao.sessao_id, {
                            expires: new Date(parseInt(dadosDaSessao.validade)),
                            path: "/"
                        })

                        if (dadosDaSessao.existente) {
                            console.log("Usuario já tinha uma sessão, a antiga foi substituida...");
                        }

                        resposta.aprovada("Login aprovado")
                    } else {
                        console.log("Erro ao gerar sessão para usuario");
                        resposta.addErro(5)
                        resposta.recusada("Erro interno do servidor")
                    }
                } else {
                    resposta.addErro(2)
                    console.log("Senha incorreta para esse e-mail");
                    resposta.recusada("Senha incorreta")
                }
            } else {
                resposta.addErro(1)
                console.log("O usuario com esse e-mail não existe");
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
    console.log(`GET ${app.url}${ponta}`);
    app.get(ponta, async (req, resp) => {
        let resposta = new Resposta(app.erros.login.logar_com_cookie, false)
        console.log("Nova requisição de login por cookie");
        console.log(req.cookies);

        if (req.sessao != undefined) {
            let cookieSessao = req.sessao.sessao.sessao_id;
            console.log("Existe um cookie de sessãoID: " + cookieSessao);

            console.log("Verificando se essa sessão ainda é valida");
            let sessaoNoBanco = await app.bancodados("sessoes").where({ sessao_id: cookieSessao }).first()
            console.log(sessaoNoBanco);

            if (sessaoNoBanco) {
                console.log("A sessão existe no banco de dados. Verificando se ela não esta expirada");

                let dataAgora = new Date()
                console.log("Data agora: " + dataAgora.toUTCString());

                let dataSessao = new Date(parseInt(sessaoNoBanco.validade))
                console.log("Data do cookie: " + dataSessao.toUTCString());

                if (dataSessao.getTime() >= dataAgora.getTime()) {
                    console.log("A sessão ainda é valida! Permitindo o login.");
                    resposta.aprovada("Login por cookie aprovado")
                } else {
                    console.log("Sessão expirada!");
                    resposta.addErro(2)
                    resposta.recusada("Sessão expirada")
                }
            } else {
                console.log("Esse cookie de sessão não existe, negando login...");
                resposta.addErro(1)
                resposta.recusada("A sessão solicitada não existe.")
            }
        } else {
            // Erro por nao ter o cookie na requisição
            resposta.addErro(3)
            resposta.recusada("Sessão não informada na requisição")
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