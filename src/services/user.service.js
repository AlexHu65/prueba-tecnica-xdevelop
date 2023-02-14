const Users = require('../models/Users');

const crypto = require('crypto');

let database = require('../database');

let service = {};

const fs = require('fs');

const userById = async(id) => {
	return await Users.findOne({
		attributes: ['id', 'avatar', 'password'],
		where: { id: id }
	})
	.then( data =>{
		let msg = ((!data) ? 'No se puede encontrar usuario a borrar' : '');
		return { success: true, data: data, msg: msg};
	})
	.catch(error => {	
		const res = { success: false, error: error };
		return res;
	});
}

const userByEmail = async(email) => {
	return await Users.findOne({
		where: { email: email }
	})
	.then( data =>{
		let msg = ((data) ? 'Este email ya existe en nuestra base de datos: ' : '');
		return { success: true, data: data, msg: msg};
	})
	.catch(err => {	
		const res = { success: false, error: err, msg: err.errors[0].message};
		return res;
	});
}


//Listado de usuarios
service.users = async(req, res) => {

	const response = await Users.findAll({
		attributes: ['id','nombre', 'apellido', 'email', 'avatar']
	})
	.then((data) =>{
		const res = {success: true, data: data};
		return res;
	})
	.catch((err) => {
		const res = { success: false, error: err, msg: err.errors[0].message};
		return res;
	});
	
	res.json(response);

}

//Crear un nuevo usuario
service.create = async(req, res) => {

	const t = await database.transaction();	

	try {	

		const { nombre, apellido, email, password} = req.body;
		//Buscar el email de usuario
		const row = await userByEmail(email);

		//Si encontramos el usuario con ese email
		if(row.data){
			let msg = `${row.msg} ${email}`;
			const response = {success: false, msg: msg};
			res.json(response);
			return;
		};	

		//Subimos el archivo
		const subirArchivo = req.body.file.mv(`../frontend/public/${req.body.file.name}`, (err)  => {
			if (err) {
				console.log(err)
				return "Ocurrio un error al subir el archivo.";
			}
		});

		// Si no se pudo subir
		if(subirArchivo){
			msg = subirArchivo;
			return res;
		}

		const response = await Users.create({
			nombre: nombre,
			apellido: apellido,
			email: email,
			password: crypto.createHash('md5').update(password).digest("hex"),
			avatar: `public/${req.body.file.name}`
		}, {transaction: t})
		.then((data) =>{
	
			let msg = (data ? 'Usuario agregado con éxito.' : 'No se agrego usuario.');
	
			const res = {success: true, msg: msg, data: data};

			t.commit();
	
			return res;
		})
		.catch((err) => {
	
			const res = { success: false, error: err, msg: err.errors[0].message};

			t.rollback();
	
			return res;
	
		});

		res.json(response);

		
	} catch (e) {
		console.log(e);		
	}

}


//Se obtiene un cada usuario
service.get = async(req, res) => {
	const {id} = req.params;

	const response = await Users.findOne({
		attributes: ['id','nombre', 'apellido', 'email', 'avatar'],
		where: {id:id}
	})
	.then((data) => {
		const res = data;
		return res;
	})
	.catch((err) => {
		const res = { success: false, error: err, msg: err.errors[0].message};
		return res;
	});
	res.json(response);
}


service.update = async(req, res) => {

	const t = await database.transaction();	

	try {

		let { id, nombre, apellido, email, password} = req.body;				

		const row = await userById(id);
		// Si no encontramos el usuario que vamos a actualizar
		if(!row.data){
			let msg = `${row.msg}`;
			const response = {success: false, msg: msg};
			res.json(response);
			return;
		};	

		let avatar = row.data.avatar;

		// Validamos si hay que subir un nuevo archivo
		if(req.body.file){
			//Si es diferente
			if(row.data.avatar != `public/${req.body.file.name}`){

				// Eliminamos primero el archivo
				const eliminarArchivo = fs.unlink(`../frontend/${row.data.avatar}`, (err) => {
					if (err) {
						console.log(err)
						return "Ocurrio un error al borrar el archivo.";
					}
				});

				// Si no se pudo subir
				if(eliminarArchivo){
					let msg = `${row.msg}`;
					const response = {success: false, msg: msg};
					res.json(response);
					return;
				}

				const subirArchivo = req.body.file.mv(`../frontend/public/${req.body.file.name}`, (err)  => {
					if (err) {
						console.log(err)
						return "Ocurrio un error al subir el archivo.";
					}
				});
		
				// Si no se pudo subir
				if(subirArchivo){
					let msg = `${row.msg}`;
					const response = {success: false, msg: msg};
					res.json(response);
					return;
				}

				avatar = `public/${req.body.file.name}`;

			}else{
				// Si el avatar no cambio
				avatar = row.data.avatar;
			}
		}

		if(!password){
			// si no temenos la contraseña usamos la misma
			password = row.data.password;
		}else{
			// Si tenemos una contraseña nueva hacemos la encriptacion
			password = crypto.createHash('md5').update(password).digest("hex");
		}

		const response = await Users.update({
				nombre: nombre,
				apellido: apellido,
				email: email,
				// Solo se va a actualizar la contraseña si existe en el req
				password: password,
				avatar: `${avatar}`
			},
			{
				where: { id: id },
				transaction: t
			}
		)
		.then((data) => {	
			
			let msg = (data ? 'Usuario actualizado con éxito' : `No se puede encontrar usuario con id: ${id}`)

			const res = { success: true, data: data, msg: msg};

			t.commit();

			return res;
		})
		.catch(err => {
			const res = { success: false, error: err, msg: err.errors[0].message};
			t.rollback();	
			return res;
		});

		//Enviamos los datos del usuario a borrar para borrar el avatar
		response.data = row.data;

		res.json(response);

	} catch (e) {
		console.log(e);
	}
};


service.delete = async(req, res) => {

	const t = await database.transaction();	

	try {

		const { id } = req.params;

		const row = await userById(id);

		// Si no encontramos el usuario que vamos a borrar
		if(!row.data){
			let msg = `${row.msg}`;
			const response = {success: false, msg: msg};
			res.json(response);
			return;
		};	

		const response = await Users.destroy({
			attributes: ['id', 'avatar'],
			where: { id: id },
			transaction: t,
		})
		.then((data) => {	
			
			let msg = (data ? 'Usuario borrado con éxito' : `No se puede encontrar usuario con id: ${id}`)

			const eliminarArchivo = fs.unlink(`../frontend/${row.data.avatar}`, (err) => {
				if (err) {
					console.log(err)
					return "Ocurrio un error al borrar el archivo.";
				}
			});

			if(eliminarArchivo){
				msg = eliminarArchivo;
				t.rollback();
				return {success: false, data: data, msg: msg};
			}

			const res = { success: true, data: data, msg: msg};

			t.commit();

			return res;
		})
		.catch(err => {
			const res = { success: false, error: err, msg: err.errors[0].message};
			t.rollback();	
			return res;
		});

		//Enviamos los datos del usuario a borrar para borrar el avatar
		response.data = row.data;

		res.json(response);

	} catch (e) {
		console.log(e);
	}
};

module.exports = service;