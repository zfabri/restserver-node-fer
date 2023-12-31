const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos, validarJWT, esAdminRole } = require('../middlewares');

const {
	actualizarProducto,
	borrarProducto,
	crearProducto,
	obtenerProducto,
	obtenerProductos,
} = require('../controllers/productos');

const {
	existeCategoriaPorId,
	existeProductoPorId,
} = require('../helpers/db-validators');

const router = Router();

// obtener todos los productos
router.get('/', obtenerProductos);

// obtener un producto
router.get(
	'/:id',
	[
		check('id', 'No es un id de Mongo valido').isMongoId(),
		check('id').custom(existeProductoPorId),
		validarCampos,
	],
	obtenerProducto
);

// crear producto - cualquiera con token valido
router.post(
	'/',
	[
		validarJWT,
		check('nombre', 'El nombre es obligatorio').not().isEmpty(),
		check('categoria', 'No es un id de Mongo valido').isMongoId(),
		check('categoria').custom(existeCategoriaPorId),
		validarCampos,
	],
	crearProducto
);

// actualizar - cualquiera con token valido
router.put(
	'/:id',
	[
		validarJWT,
		// check('categoria', 'No es un id de Mongo valido').isMongoId(),
		check('id').custom(existeProductoPorId),
		validarCampos,
	],
	actualizarProducto
);

// borrar un producto - admin
router.delete(
	'/:id',
	[
		validarJWT,
		esAdminRole,
		check('id', 'No es un id de Mongo valido').isMongoId(),
		check('id').custom(existeProductoPorId),
	],
	borrarProducto
);

module.exports = router;
