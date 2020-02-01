const mysql = require('mysql')
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const rimraf = require("rimraf");
const sortJsonArray = require('sort-json-array');

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
        cb(null, req.query.lineId+'_line-pic'+file.originalname.slice(file.originalname.lastIndexOf('.'), file.originalname.length))
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
                category INT,
                location INT
            );
        `        
          
        con.query(sql);

        if (!fs.existsSync(`./images/inventory/${req.body.id}`)){
            fs.mkdirSync(`./images/inventory/${req.body.id}`);
        }

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
        const { per_page, page, tableId, order, dir, search} = req.query;

        if(search) {
            con.query(`SELECT * FROM ${tableId} WHERE name REGEXP '${search}' OR qnt REGEXP '${search}' ${order?'ORDER BY '+order+' '+dir.toUpperCase():''}`, function (err, result, fields) {
                if(result){ 
                    let aux = []
                    
                    for(let n = per_page*(page-1); n < per_page*page && n < result.length; n++){
                        aux.push(result[n])
                    }
                    
                    res.send({docs: aux, total: result.length, page: page})
                }
                else{
                    res.send(null)
                }
            });
        }
        else {
            con.query(`SELECT * FROM ${tableId} ${order?'ORDER BY '+order+' '+dir.toUpperCase():''}`, function (err, result, fields) {
                if(result){ 
                    let aux = []
                    
                    for(let n = per_page*(page-1); n < per_page*page && n < result.length; n++){
                        aux.push(result[n])
                    }
                    
                    res.send({docs: aux, total: result.length, page: page})
                }
                else{
                    res.send(null)
                }
            });
        }        
    },

    async add(req, res) {
        con.query(`INSERT INTO ${req.query.tableId} SET ?`, req.body, function (err, result, fields) {
            return res.status(200).send(result) 
        });
    },

    async uploadImage(req,res) {
        fs.readdir(`./images/inventory/${req.query.tableId}`, (err, files) => {
            if (err) {
                return
            }
        
            files.forEach(async file => {
                const fileDir = path.join(`./images/inventory/${req.query.tableId}`, file);
        
                if (file.slice(0,file.lastIndexOf('.')) == req.query.lineId+'_line-pic') {
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
    },

    async deleteItem(req, res) {
        con.query(`DELETE FROM ${req.query.tableId} WHERE id = '${req.query.lineId}'`);
        fs.readdir(`./images/inventory/${req.query.tableId}`, (err, files) => {
            if (err) {
                return
            }
        
            files.forEach(async file => {
                const fileDir = path.join(`./images/inventory/${req.query.tableId}`, file);
        
                if (file.slice(0,file.indexOf('.')) == req.query.lineId+'_line-pic') {
                    await fs.unlink(fileDir, () => {});
                }
            });
        });
        return res.status(200).send("changes saved to database")
    }
}