const mysql = require('mysql')
const multer = require('multer');
const fs = require('fs');
const path = require('path');
var rimraf = require("rimraf");

var con = mysql.createConnection({
    host: "remotemysql.com",
    user: "VY6ybliafL",
    password: "SH0wpDO5Ax",
    database: "VY6ybliafL"
});


var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, `./images/inventory/${req.query.tableId}`)
    },
    filename: function (req, file, cb) {
        cb(null, req.query.lineId+'_line-pic'+file.originalname.slice(file.originalname.indexOf('.'), file.originalname.length))
    }
})

var up = multer({ storage: storage, limits: { fileSize: 1024*65 } }).single('file') //max 65KB

module.exports = {
    async create(req, res) {
        con.query('INSERT INTO inventories SET ?', req.body);

        var sql = `
            CREATE TABLE ${req.body.id} (
                id INT PRIMARY KEY AUTO_INCREMENT,
                img blob,
                img_name varchar(45) collate latin1_general_ci,
                name varchar(255) NOT NULL,
                qnt INT,
                category INT
            );
        `        
          
        con.query(sql);

        return res.status(200).send('Changes saved to database')
    },

    async updateTableName(req, res) {
        con.query(`UPDATE inventories SET ? WHERE id = '${req.query.tableId}'`, req.body)
        return res.status(200).send('Changes saved to database') 
    },

    async paginate(req, res) {
        con.query("SELECT * FROM inventories", function (err, result, fields) {
            res.send(result);
        });
    },

    async delete(req, res) {
        con.query(`DELETE FROM inventories WHERE id = '${req.query.tableId}'`);
        con.query(`DROP TABLE ${req.query.tableId}`);
        rimraf(`./images/inventory/${req.query.tableId}`, function () {});
        return res.status(200).send('Changes saved to database') 
    },

    async listing(req, res) {
        con.query(`SELECT * FROM ${req.query.tableId}`, function (err, result, fields) {
            res.send({docs: result, total: result.length, page: '1'});
        });
    },

    async add(req, res) {
        con.query(`INSERT INTO ${req.query.tableId} SET ?`, req.body, function (err, result, fields) {
            return res.status(200).send(result) 
        });
    },

    async uploadImage(req,res) {
        if (!fs.existsSync(`./images/inventory/${req.query.tableId}`)){
            fs.mkdirSync(`./images/inventory/${req.query.tableId}`);
        }

        fs.readdir(`./images/inventory/${req.query.tableId}`, (err, files) => {
            if (err) {
                return res.status(500).send("Unable to save to database")
            }
        
            files.forEach(async file => {
                const fileDir = path.join(`./images/inventory/${req.query.tableId}`, file);
        
                if (file.slice(0,file.indexOf('.')) == req.query.lineId+'_line-pic') {
                    await fs.unlink(fileDir, () => {});
                }
            });
        });
            
        up(req, res, function (err) {
            if (err instanceof multer.MulterError) {
                return
            } else if (err) {
                return
            }
            
            let data = {
                img: fs.readFileSync(req.file.path),
                img_name: req.file.originalname
            }

            con.query(`UPDATE ${req.query.tableId} SET ? WHERE id = ${req.query.lineId}`, data)
        })   

        return res.status(200).send("Changes saved to datatabse")
    },

    async getTableName(req,res) {
        con.query(`SELECT name FROM inventories WHERE id = '${req.query.tableId}'`, function (err, result, fields) {
            res.send(result);
        });
    },

    async updateItem(req, res) {
        con.query(`UPDATE ${req.query.tableId} SET ? WHERE id = ${req.body.id}`, req.body)
        return res.status(200).send('Changes saved to database') 
    }
}