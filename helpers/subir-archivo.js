const { v4: uuidv4 } = require('uuid');
const path = require('path');

const extensiones = ['png', 'jpg', 'jpeg', 'gif'];

const subirArchivo = (files, extensionesValidas = extensiones, carpeta = '') => {

    return new Promise((resolve, reject) => {
        
        const { archivo } = files;
        const nombreCortado = archivo.name.split('.');
        const extension = nombreCortado[nombreCortado.length - 1];

    
        if (!extensionesValidas.includes(extension)) {
            
            return reject(`La extension ${extension} no es permitida. Intenta con ${extensionesValidas}`);
        }
    
        const nombreTemporal = uuidv4() + '.' + extension;
        const uploadPath = path.join(__dirname, '../uploads/', carpeta, nombreTemporal);
    
        archivo.mv(uploadPath, err => {
            if (err) {
                reject(err);
            }
    
            resolve(nombreTemporal);
        });
    });
};

module.exports = {
	subirArchivo,
};
