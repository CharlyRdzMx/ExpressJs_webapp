// Librerías
const express = require("express");
const router = express.Router();
const path = require('path');

const multer = require('multer');
const upload = multer({ dest: process.env.PATH_TEMP_FILES });
const csv = require('fast-csv');
const fs = require('fs');

router.get('/', async (req, res) => {
    res.render('index');
});

router.post('/loadfile', upload.single('file'), (req, res) => {
    if (!req.file) {
        const err = 'Debe seleccionar un archivo válido.';
        res.render('index', { err });
    }
    else if (path.extname(req.file.originalname) !== '.csv') {
        const err = 'El archivo no es de formato CSV.';
        res.render('index', { err });
    } else {
        fs.renameSync(req.file.path, path.join(process.env.PATH_TEMP_FILES, 'file_menu.csv'));
        res.redirect('/schedule');
    }
});

router.get('/schedule', async (req, res) => {
    const fileRows = [];
    const file_path = path.join(process.env.PATH_TEMP_FILES, 'file_menu.csv');

    if (fs.existsSync(file_path)) {    
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
            res.render('schedule', { fileRows });
        });
    } else {
        const err = 'No hay información disponible.';
        res.render('schedule', { err });
    }
});

module.exports = router;