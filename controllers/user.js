const { response } = require('express');
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');
const { emailExiste } = require('../helpers/db-validators');

const usuariosGet = async (req, res = response) => {
	const { limite = 5, desde = 0 } = req.query;
	const query = { estado: true };

	const [total, usuarios] = await Promise.all([
		Usuario.countDocuments(query),
		Usuario.find(query).limit(Number(limite)).skip(Number(desde)),
	]);

	res.json({
		total,
		usuarios,
	});
};

const usuariosPut = async (req, res) => {
	const { id } = req.params;
	const { _id, password, google, correo, ...resto } = req.body;

	if (password) {
		// cambiar la contraseña
		const salt = bcryptjs.genSaltSync();
		resto.password = bcryptjs.hashSync(password, salt);
	}

	const usuario = await Usuario.findByIdAndUpdate(id, resto);

	res.json(usuario);
};

const usuariosPost = async (req, res) => {
	const { nombre, correo, password, rol } = req.body;
	const usuario = new Usuario({ nombre, correo, password, rol });

	// encriptar la contraseña
	const salt = bcryptjs.genSaltSync();
	usuario.password = bcryptjs.hashSync(password, salt);

	// guardar en bd
	await usuario.save();

	res.json({
		msg: 'post API - controlador',
		usuario,
	});
};

const usuariosPatch = (req, res) => {
	res.json({
		msg: 'patch API - controlador',
	});
};

const usuariosDelete = async (req, res) => {
	const { id } = req.params;

	// forma de borrarlo fisicamente
	// const usuario = await Usuario.findByIdAndDelete(id);

	const usuario = await Usuario.findByIdAndUpdate(id, { estado: false });
	// const usuarioAutenticado = req.usuario

	res.json(usuario);
};

module.exports = {
	usuariosGet,
	usuariosPut,
	usuariosPost,
	usuariosPatch,
	usuariosDelete,
};
