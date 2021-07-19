// Regras de sessao
// Gera uma sessão id com numeros, letras e chars aleatorios de tamanho 15
// A id de sessão é valida por 1 mes

const sessoes = []
let banco;

async function gerarSessao(usuarioDados) {
    console.log("Gerando uma sessão para o usuario " + usuarioDados.email);

    let sessaoId = gerarStringAleatoria(14)
    let dataHoje = new Date()
    let validadeSessao = new Date()

    validadeSessao.setMonth(dataHoje.getMonth() == 11 ? 1 : dataHoje.getMonth() + 1)
    if (dataHoje.getMonth() == 11) validadeSessao.setFullYear(dataHoje.getFullYear() + 1)
    console.log("Validade da sessão: " + validadeSessao.toUTCString());

    let dadosInsercao = {
        sessao_id: sessaoId,
        usuario_id: usuarioDados.id_usuario,
        validade: validadeSessao.getTime().toString()
    }

    // Fazer a verificação caso o usuario já tenha uma sessão
    let existeSessao = await banco("sessoes").where({ usuario_id: usuarioDados.id_usuario }).first()
    if (existeSessao) {
        console.log("Usuario " + usuarioDados.email + " já possui uma sessao, substituindo a antiga...");

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
        console.log(`Cadastrando nova sessão para o usuario ${usuarioDados.email}`);
        let resultadoInsercao = await banco("sessoes").insert(dadosInsercao)

        if (!resultadoInsercao) {
            return null
        }
    }

    return dadosInsercao
}

function setBanco(novoBanco) {
    banco = novoBanco
}

function gerarStringAleatoria(quantosChars) {
    let chars = "abcdefghijklmnopqrstuvwxyz123456789/=-)(@!_$#"
    let stringAleatoria = ""

    for (let index = 0; index <= quantosChars; index++) {
        let letra = chars.substr(Math.random() * (chars.length - 1), 1)
        letra = Math.random() <= 0.5 ? letra.toUpperCase() : letra

        stringAleatoria += letra
    }

    console.log("ID de Sessão: " + stringAleatoria);
    return stringAleatoria
}

module.exports = { gerarSessao, setBanco }