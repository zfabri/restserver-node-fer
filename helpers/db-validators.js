const { Categoria, Role, Usuario, Producto } = require('../models');

const esRoleValido = async (rol = '') => {
	const existeRol = await Role.findOne({ rol });

	if (!existeRol) {
		throw new Error(`El rol ${rol} no esta registrado en la bd`);
	}
};

const emailExiste = async (correo = '') => {
	const existeEmail = await Usuario.findOne({ correo: correo });

	if (existeEmail) {
		throw new Error(`El correo ${correo} ya esta registrado`);
	}
};

const existeUsuarioPorId = async id => {
	const existeUsuario = await Usuario.findById(id);

	if (!existeUsuario) {
		throw new Error(`El id no existe ${id}`);
	}
};

// Categorias
const existeCategoriaPorId = async id => {
	const existeCategoria = await Categoria.findById(id);

	if (!existeCategoria) {
		throw new Error(`El id no existe ${id}`);
	}
};

// productos
const existeProductoPorId = async id => {
	const existeProducto = await Producto.findById(id);

	if (!existeProducto) {
		throw new Error(`El id no existe ${id}`);
	}
};

// validas colecciones permitidas
const coleccionesPermitidas = (coleccion = '', colecciones = []) => {
	const incluida = colecciones.includes(coleccion);

	if (!incluida) {
		throw new Error(
			`La colección ${coleccion} no es permitida. Intenta con ${colecciones}`
		);
	}

	return true;
};

module.exports = {
	coleccionesPermitidas,
	emailExiste,
	esRoleValido,
	existeCategoriaPorId,
	existeProductoPorId,
	existeUsuarioPorId,
};
