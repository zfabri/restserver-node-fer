const { Router } = require('express');
const { body, check } = require('express-validator');

const {
	validarCampos,
	validarJWT,
	esAdminRole,
	tieneRole,
} = require('../middlewares');

const {
	esRoleValido,
	emailExiste,
	existeUsuarioPorId,
} = require('../helpers/db-validators');

const {
	usuariosGet,
	usuariosPut,
	usuariosPost,
	usuariosPatch,
	usuariosDelete,
} = require('../controllers/user');

const router = Router();

router.get('/', usuariosGet);

router.put(
	'/:id',
	[
		check('id', 'El id no es valido').isMongoId(),
		check('id').custom(existeUsuarioPorId),
		body('rol').custom(esRoleValido),
		validarCampos,
	],
	usuariosPut
);

router.post(
	'/',
	[
		body('nombre', 'El nombre es obligatorio').not().isEmpty(),
		body('password', 'El password debe tener 6 letras o mas').isLength({
			min: 6,
		}),
		body('correo', 'El correo no es valido').isEmail(),
		body('correo').custom(emailExiste),

		// body('rol', 'No es un rol valido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
		body('rol').custom(esRoleValido),
		validarCampos,
	],
	usuariosPost
);

router.patch('/', usuariosPatch);

router.delete(
	'/:id',
	[
		validarJWT,
		// esAdminRole,
		tieneRole('ADMIN_ROLE', 'USER_ROLE', 'VENTAS_ROLE'),
		check('id', 'El id no es valido').isMongoId(),
		check('id').custom(existeUsuarioPorId),
		validarCampos,
	],
	usuariosDelete
);

module.exports = router;
