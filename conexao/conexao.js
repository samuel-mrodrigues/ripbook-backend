const config = require("./knexfile")

console.log("Iniciando conexão com o banco de dados");
const banco = require("knex").knex({...config })
console.log("Atualizando banco...");

banco.migrate.latest([config])

module.exports = banco