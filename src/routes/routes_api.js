// Librerías
const express = require("express");
const router = express.Router();
const path = require('path');

const multer = require('multer');
const upload = multer({ dest: process.env.PATH_TEMP_FILES });

const csv = require('fast-csv');
const fs = require('fs');

/**
 * Metodo:      schedule
 * Ruta:        /api/schedule
 * Descripcion: Obtiene la información del archivo cargado previamente y devuelve la información en formato JSON.
 */
router.get('/schedule', async (req, res) => {

    const file_path = path.join(process.env.PATH_TEMP_FILES, 'file_menu.csv');

    if (fs.existsSync(file_path)) {
        const fileRows = [];
        csv.parseFile(file_path)
        .on('data', function(row) {
            const item = {
                _name: row[0],
                _kindfood: row[1],
                _hour: row[2],
                _location: row[3]
            };
            fileRows.push(item);
        })
        .on('end', function (){
            fileRows.shift();
            res.status(200).json(fileRows);
        });
    } else {
        res.status(204);
    }
});

/**
 * Metodo:      loadfile
 * Ruta:        /api/loadfile
 * Descripcion: Recibe el archivo enviado por el usuario, el método renombra el archivo y lo almacena en una carpeta temporal.
 */
router.post('/loadfile', upload.single('file'), (req, res) => {
    const fileRows = [];
    csv.parseFile(req.file.path)
    .on('data', function(row){
        fileRows.push(row);
    })
    .on('end', function(){
        fs.unlinkSync(req.file.path);
        csv.writeToPath(path.join(process.env.PATH_TEMP_FILES, 'file_menu.csv'), fileRows)
        res.status(200).json('El archivo ha sido cargado con éxito.');
    });
});

module.exports = router;