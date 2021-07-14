// Update with your config settings.

module.exports = {
  client: "mysql",
  connection: {
    host: "localhost",
    user: "root",
    password: "root",
    database: "ripbook"
  },
  pool: {
    min: 2,
    max: 10
  },
  migrations: {
    tableName: 'knex_migrations',

  }
};
