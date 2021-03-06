module.exports = {
    login: {
        cadastro: {
            1: {
                mensagem: "Nome invalido",
            },
            2: {
                mensagem: "Sobrenome invalido"
            },
            3: {
                mensagem: "E-mail invalido"
            },
            4: {
                mensagem: "Senha invalida"
            },
            5: {
                mensagem: "Senha muito curta"
            },
            6: {
                mensagem: "E-mail já existe"
            }
        },
        logar: {
            1: {
                mensagem: "E-mail não existe"
            },
            2: {
                mensagem: "Senha incorreta"
            },
            3: {
                mensagem: "E-mail nao atende aos requisitos"
            },
            4: {
                mensagem: "Senha nao atende aos requisitos"
            },
            5: {
                mensagem: "Erro ao criar sua sessão"
            }
        },
        logar_com_cookie: {
            1: {
                mensagem: "Sessão não existe"
            },
            2: {
                mensagem: "Sessão expirada"
            }
        },
        logout: {
            1: {
                mensagem: "Sessão informada não existe, logout falhou."
            }
        }
    },
    posts: {
        1: {
            mensagem: "Campos informados invalidos"
        },
        2: {
            mensagem: "É necessario estar logado para realizar essa ação"
        },
        3: {
            mensagem: "O ID do post requisitado precisa ser numerico"
        },
        4: {
            mensagem: "Post requisitado não existe"
        }
    },
    curtir: {
        1: {
            mensagem: "O ID do post precisa ser numerico"
        },
        2: {
            mensagem: "É necessario ter uma sessão para curtir posts"
        },
        3: {
            mensagem: "Post informado não existe."
        },
        4: {
            mensagem: "Post já curtido pelo usuario"
        }
    },
    descurtir: {
        1: {
            mensagem: "O ID do post precisa ser numerico"
        },
        2: {
            mensagem: "É necessario ter uma sessão para descurtir posts"
        },
        3: {
            mensagem: "Post informado não existe."
        },
        4: {
            mensagem: "Post não esta curtido pelo usuario"
        }
    },
    comentarios: {
        1: {
            mensagem: "O ID do post precisa ser numerico"
        },
        2: {
            mensagem: "É necessario ter uma sessão"
        },
        3: {
            mensagem: "Post informado não existe."
        },
        4: {
            mensagem: "Post não esta curtido pelo usuario"
        },
        5: {
            mensagem: "Comentario não informado"
        }
    }
}