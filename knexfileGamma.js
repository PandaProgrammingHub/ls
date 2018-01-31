var dotenv = require('dotenv');

dotenv.load();

module.exports = {
  client: 'mysql',
  connection: {
    host : process.env.MYSQL_DB_HOST,
    user : process.env.MYSQL_DB_USER,
    password : process.env.MYSQL_DB_PASSWORD,
    database : process.env.MYSQL_DB_DATABASE
  }
};
