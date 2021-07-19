
exports.up = function (knex) {
    return knex.schema.createTable('posts', tabela => {
        tabela.increments("id_post").primary()
        tabela.integer("usuario_id").notNull()
        tabela.string("conteudo_post").notNull()
    })
};

exports.down = function (knex) {
    return knex.schema.dropTable("posts")
};
