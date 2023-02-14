let Sequelize = require('sequelize');
const config = require('config');

const database = new Sequelize(
	config.get('db.name'), 
	config.get('db.user'), 
	config.get('db.password'),
	{
	  host: config.get('db.host'),
	  dialect: config.get('db.dialect')
	}
  );

database.sync();

module.exports = database;