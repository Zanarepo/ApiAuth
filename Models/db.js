const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database/authsystem.sqlite', // Path to SQLite database file
});

sequelize
  .authenticate()
  .then(() => console.log('Connection to SQLite has been established successfully.'))
  .catch((err) => console.error('Unable to connect to the database:', err));

module.exports = sequelize;
