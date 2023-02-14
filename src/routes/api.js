const express = require('express');
const router = express.Router();

//Se agregan los servicios que se requieran
const userService = require('../services/user.service');

router.get('/users', userService.users);

router.post('/users', (req,res) => {

	if (!req.files) {
        return res.status(200).send({success: false, msg: "No has seleccionado un archivo" });
    }

	const avatarArchivo = req.files.avatar;

	req.body.file = avatarArchivo;

	return userService.create(req, res);
});

/* Se busca un usuario de acurdo al id */ 
router.get('/users/:id', userService.get);

/* Borramos el usuario con el archivo*/
router.delete('/users/:id/', userService.delete);

/* Actualizamos el usuario */
router.put('/user', (req, res) => {
	if (req.files) {
		const avatarArchivo = req.files.avatar;
		req.body.file = avatarArchivo;
    }
	return userService.update(req, res);
});

module.exports = router;