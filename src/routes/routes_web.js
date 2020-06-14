// Librerías
const express = require("express");
const router = express.Router();
const path = require('path');

const multer = require('multer');
const upload = multer({ dest: './public/temp/' });
const csv = require('fast-csv');
const fs = require('fs');

router.get('/', async (req, res) => {

    if (!fs.existsSync(path.join(process.env.PATH_TEMP_FILES, 'menu.csv'))) {
        res.render('index');
    } else {
        const fileRows = [];
        csv.parseFile(path.join(process.env.PATH_TEMP_FILES, 'menu.csv'))
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
            res.render('index', { fileRows });
        });
    }

});

router.post('/loadfile', upload.single('file'), (req, res) => {
    const fileRows = [];
    
    csv.parseFile(req.file.path)
    .on('data', function(row){
        fileRows.push(row);
    })
    .on('end', function(){
        fs.unlinkSync(req.file.path);
        csv.writeToPath(path.join(process.env.PATH_TEMP_FILES, 'menu.csv'), fileRows)
        res.redirect('/');
    });
});

module.exports = router;