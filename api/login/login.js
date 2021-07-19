// Regras de login
// email: Precisa conter um @ e ser maior que 6 chars.
// senha: Minimo de 6 chars


const { isStringVazio } = require("../../utilidades/validacoesBasicas")

// Ponta de login por dados do formulario
async function cadastraPontaLogin(app, ponta) {
    console.log(local + "/login/logar");
    let msgErros = app.erros.login.logar

    app.post(ponta, async(req, resp) => {
        console.log("Nova request para login!");
        // JSON: {
        //     email: "",
        //     senha: "",
        //     lembrarlogin: "",    
        // }
        //Status do login:
        // 0: Login aprovado
        // 1: Login negado

        let dados = {...req.body };
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
            // Status do login
            // 0: Login aprovado
            // 1: Login recusado
        resposta.status = 1;
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
                    if (dadosDaSessao) {
                        resp.cookie("sessaoID",
                            dadosDaSessao.sessao_id, {
                                expires: new Date(parseInt(dadosDaSessao.validade)),
                                path: "/"
                            })

                        if (dadosDaSessao.existente) {
                            console.log("Usuario já tinha uma sessão, a antiga foi substituida...");
                        }

                        resposta.status = 0
                    } else {
                        console.log("Erro ao gerar sessão para usuario");
                        erros.push(5)
                        resposta.mensagem = "Erro interno no servidor."
                    }
                } else {
                    erros.push(2)
                    resposta.mensagem = "Senha incorreta para esse e-mail"
                    console.log("Senha incorreta para esse e-mail");
                }
            } else {
                resposta.mensagem = "Email não existe"
                erros.push(1)
                console.log("O usuario com esse e-mail não existe");
            }
        } else {
            resposta.mensagem = "Validação dos campos informados não aprovada"
        }

        resposta.erros = {}
        erros.forEach(codErro => {
            resposta.erros[codErro] = msgErros[codErro].mensagem
        })
        resp.send(resposta)
    })
}

// Ponta de login por cookie
async function cadastraPontaCookie(app, ponta) {
    let msgErros = app.erros.login.logar_com_cookie

    console.log(local + "/login/logar/cookie");
    app.get(ponta, async(req, resp) => {
        console.log("Nova requisição de login por cookie");
        console.log(req.cookies);

        let erros = []
        let resposta = {}
            // Status
            // 0: Sessão aprovada
            // 1: Sessão recusada
        resposta.status = 1;

        if (req.cookies.sessaoID != undefined) {
            let cookieSessao = req.cookies.sessaoID;
            console.log("Existe um cookie de sessãoID!");

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
                    resposta.status = 0
                    resposta.mensagem = "Cookie de sessão valido"
                } else {
                    console.log("Sessão expirada!");
                    erros.push(2)
                    resposta.mensagem = "Cookie de sessão expirado"
                }
            } else {
                console.log("Esse cookie de sessão não existe, negando login...");
                erros.push(1)
                resposta.mensagem = "Cookie de sessão não existe"
            }
        } else {
            // Erro por nao ter o cookie na requisição
            erros.push(3)
            resposta.mensagem = "Cookie de sessão não esta presente"
        }

        resposta.erros = {}
        erros.forEach(codErro => {
            resposta.erros[codErro] = msgErros[codErro].mensagem
        })

        resp.send(resposta)
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