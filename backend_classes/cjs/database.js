// dotenv
// this library helps to read the .env file making the key value peer avaliable to the process.env of node
require("dotenv").config();

// sequelize a Object Relationship Mapping ORM for SQL databases
// this will help with our database connection and activities
const { Sequelize } = require("sequelize");

// initializing a database iinstance with sequelize
// value are gotten from the .env
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    host: DB_HOST,
    dialect:
      DB_DIALECT /* one of 'mysql' | 'postgres' | 'sqlite' | 'mariadb' | 'mssql' | 'db2' | 'snowflake' | 'oracle' */,
  }
);

// default export of instance
export default sequelize;
// named / object export of instance
export { sequelize };
