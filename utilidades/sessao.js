// Regras de sessao
// Gera uma sessão id com numeros, letras e chars aleatorios de tamanho 15
// A id de sessão é valida por 1 mes

let banco;

async function gerarSessao(usuarioDados) {
    let sessaoId = gerarStringAleatoria(14)
    let dataHoje = new Date()
    let validadeSessao = new Date()

    validadeSessao.setMonth(dataHoje.getMonth() == 11 ? 1 : dataHoje.getMonth() + 1)
    if (dataHoje.getMonth() == 11) validadeSessao.setFullYear(dataHoje.getFullYear() + 1)
    let dadosInsercao = {
        sessao_id: sessaoId,
        usuario_id: usuarioDados.id_usuario,
        validade: validadeSessao.getTime().toString()
    }

    // Fazer a verificação caso o usuario já tenha uma sessão
    let existeSessao = await banco("sessoes").where({ usuario_id: usuarioDados.id_usuario }).first()
    if (existeSessao) {

        let atualizarSessao = await banco("sessoes").update({
            sessao_id: dadosInsercao.sessao_id,
            validade: dadosInsercao.validade
        }).where({ usuario_id: dadosInsercao.usuario_id })

        if (atualizarSessao) {
            dadosInsercao.existente = true
        } else {
            return null
        }
    } else {
        let resultadoInsercao = await banco("sessoes").insert(dadosInsercao)

        if (!resultadoInsercao) {
            return null
        }
    }

    return dadosInsercao
}

async function getDadosUsuario(cookieSessao) {
    let dados = {}

    let sessao = await banco("sessoes").where({ sessao_id: cookieSessao }).first()
    if (sessao) {
        let usuario = await banco("usuarios").where({ id_usuario: sessao.usuario_id }).first()

        dados.sessao = {...sessao }
        dados.usuario = {...usuario }

        return dados
    }
}

function setBanco(novoBanco) {
    banco = novoBanco
}


function gerarStringAleatoria(quantosChars) {
    let chars = "abcdefghijklmnopqrstuvwxyz123456789().!-"
    let stringAleatoria = ""

    for (let index = 0; index <= quantosChars; index++) {
        let letra = chars.substr(Math.random() * (chars.length - 1), 1)
        letra = Math.random() <= 0.5 ? letra.toUpperCase() : letra

        stringAleatoria += letra
    }

    return stringAleatoria
}

module.exports = { gerarSessao, setBanco, getDadosUsuario }