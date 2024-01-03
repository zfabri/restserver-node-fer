const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos, validarArchivoSubir } = require('../middlewares');
const {
    cargarArchivo,
    actualizarImagen,
    mostrarImagen,
    actualizarImagenCloudinary,
} = require('../controllers/uploads');
const { coleccionesPermitidas } = require('../helpers');

const router = Router();

router.post('/', validarArchivoSubir, cargarArchivo);

router.put('/:coleccion/:id',
    [
        // validarArchivoSubir,
        check('id', 'El id debe ser un id de Mongo').isMongoId(),
        check('coleccion').custom((c) =>
            coleccionesPermitidas(c, [ 'usuarios', 'productos' ]),
        ),
        validarCampos,
    ],
    // actualizarImagen,
    actualizarImagenCloudinary,
);

router.get('/:coleccion/:id',
    [
        // validarArchivoSubir,
        check('id', 'El id debe ser un id de Mongo').isMongoId(),
        check('coleccion').custom((c) =>
            coleccionesPermitidas(c, [ 'usuarios', 'productos' ]),
        ),
    ],
    mostrarImagen,
);

module.exports = router;
