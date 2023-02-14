let Sequelize = require('sequelize');

let database = require('../database');

let Users = database.define('users', {
	id: {
		type: Sequelize.INTEGER,
		primaryKey: true,
		autoIncrement: true
	},
	nombre: {
		type: Sequelize.STRING,
		allowNull: false,
		validate:{
			notEmpty: true,
			is: /^[a-zA-ZñÑáÁéÉíÍóÓúÚ ]+$/i
		}
	},
	apellido: {
		type: Sequelize.STRING,
		allowNull: false,
		validate:{
			notEmpty: true,
			is: /^[a-zA-ZñÑáÁéÉíÍóÓúÚ ]+$/i
		}
	},
	email: {
		type: Sequelize.STRING,
		allowNull: false,
		unique: true,
		validate:{
			isEmail: true,
			notEmpty: true
		}
	},
	password: {
		type: Sequelize.STRING,
		allowNull: false,
		validate:{
			notEmpty: true
		}
	},
	avatar: {
		type: Sequelize.STRING,
		allowNull: false,
	},
});

module.exports = Users;