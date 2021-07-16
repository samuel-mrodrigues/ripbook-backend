
exports.up = function (knex) {
    return knex.schema.createTable('sessoes', tabela => {
        tabela.increments("id_sessao").primary()
        tabela.string("sessao_id", 15).notNull()
        tabela.integer("usuario_id").notNull()
        tabela.string("validade").notNull()
    })
};

exports.down = function (knex) {
    return knex.schema.dropTable("sessoes")
};
