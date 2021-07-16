exports.up = function (knex) {
  return knex.schema.createTable('usuarios', tabela => {
    tabela.increments("id_usuario").primary()
    tabela.string("nome", 20).notNull()
    tabela.string("sobrenome", 40).notNull()
    tabela.string("email", 40).notNull()
    tabela.string("senha", 15).notNull()
  })
};

exports.down = function (knex) {
  return knex.schema.dropTable("usuarios")
};
