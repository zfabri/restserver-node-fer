const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos, validarJWT, esAdminRole } = require('../middlewares');

const {
	actualizarCategoria,
	borrarCategoria,
	crearCategoria,
	obtenerCategoria,
	obtenerCategorias,
} = require('../controllers/categorias');

const { existeCategoriaPorId } = require('../helpers/db-validators');

const router = Router();

// obtener todas las categorias - publico
router.get('/', obtenerCategorias);

// obtener una categoria - publico
router.get(
	'/:id',
	[
		check('id', 'No es un id de Mongo valido').isMongoId(),
		check('id').custom(existeCategoriaPorId),
		validarCampos,
	],
	obtenerCategoria
);

// crear categoria - privado - cualquiera con token valido
router.post(
	'/',
	[
		validarJWT,
		check('nombre', 'El nombre es obligatorio').not().isEmpty(),
		validarCampos,
	],
	crearCategoria
);

// actualizar - privado - cualquiera con token valido
router.put(
	'/:id',
	[
		validarJWT,
		check('nombre', 'El nombre es obligatorio').not().isEmpty(),
		check('id').custom(existeCategoriaPorId),
		validarCampos,
	],
	actualizarCategoria
);

// borrar una categoria - admin
router.delete(
	'/:id',
	[
		validarJWT,
		esAdminRole,
		check('id', 'No es un id de Mongo valido').isMongoId(),
		check('id').custom(existeCategoriaPorId),
	],
	borrarCategoria
);

module.exports = router;
