const { response } = require('express');
const { ObjectId } = require('mongoose').Types;

const { Usuario, Categoria, Producto } = require('../models');

const coleccionesPermitidas = ['usuarios', 'categorias', 'productos'];

const buscarUsuarios = async (termino = '', res = response) => {
	const esMongoId = ObjectId.isValid(termino); /* true o false */

	if (esMongoId) {
		const usuario = await Usuario.findById(termino);

		return res.json({
			results: usuario ? [usuario] : [],
		});
	}

	// expresion regular
	// i -> es insensible a mayusculas y minusculas
	const regex = new RegExp(termino, 'i');

	const usuarios = await Usuario.find({
		$or: [{ nombre: regex }, { correo: regex }],
		$and: [{ estado: true }],
	});

	res.json({
		results: usuarios,
	});
};

const buscarCategorias = async (termino = '', res = response) => {
	const esMongoId = ObjectId.isValid(termino); /* true o false */

	if (esMongoId) {
		const categoria = await Categoria.findById(termino);

		return res.json({
			results: categoria ? [categoria] : [],
		});
	}

	const regex = new RegExp(termino, 'i');

	const categorias = await Categoria.find({ nombre: regex, estado: true });

	res.json({
		results: categorias,
	});
};

const buscarProductos = async (termino = '', res = response) => {
	const esMongoId = ObjectId.isValid(termino); /* true o false */

	if (esMongoId) {
		const producto = await Producto.findById(termino).populate(
			'categoria',
			'nombre'
		);

		return res.json({
			results: producto ? [producto] : [],
		});
	}

	const regex = new RegExp(termino, 'i');

	const productos = await Producto.find({
		nombre: regex,
		estado: true,
	}).populate('categoria', 'nombre');

	res.json({
		results: productos,
	});
};

const buscar = (req, res = response) => {
	const { coleccion, termino } = req.params;

	if (!coleccionesPermitidas.includes(coleccion)) {
		return res.status(400).json({
			msg: `Las colecciones permitidas son: ${coleccionesPermitidas}`,
		});
	}

	switch (coleccion) {
		case 'usuarios':
			buscarUsuarios(termino, res);
			break;

		case 'categorias':
			buscarCategorias(termino, res);
			break;

		case 'productos':
			buscarProductos(termino, res);
			break;

		case 'roles':
			break;

		default:
			res.status(500).json({
				msg: 'Se me olvido hacer la busqueda',
			});
	}
};

module.exports = {
	buscar,
};
