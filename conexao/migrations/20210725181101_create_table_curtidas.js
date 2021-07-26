exports.up = function(knex) {
    return knex.schema.createTable('curtidas', tabela => {
        tabela.increments("id_curtida").primary()
        tabela.integer("usuario_id").notNull()
        tabela.integer("post_id").notNull()
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable("curtidas")
};