const config = require("./knexfile")

console.log("Iniciando conexão com o banco de dados");
const banco = require("knex")(config)

banco.migrate.latest()

module.exports = banco