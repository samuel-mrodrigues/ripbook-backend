exports.up = function(knex) {
    return knex.schema.createTable('posts_comentarios', tabela => {
        tabela.increments("id_comentario").primary()
        tabela.integer("usuario_id").notNull()
        tabela.integer("post_id").notNull()
        tabela.string("comentario").notNull()
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable("posts_comentarios")
};