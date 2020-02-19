const mysql = require('mysql')
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const rimraf = require("rimraf");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
var pdf = require("pdf-creator-node");
let decode = require('image-decode')

var con;

let db_config = {
    host: "remotemysql.com",
    user: "VY6ybliafL",
    password: "SH0wpDO5Ax",
    database: "VY6ybliafL"
};

function handleDisconnect() {
    con = mysql.createConnection(db_config); // Recreate the connection, since
                                                  // the old one cannot be reused.

    con.connect(function(err) {                   // The server is either down
        if(err) {                                     // or restarting (takes a while sometimes).
            console.log('error when connecting to db:', err);
            setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
        }                                     // to avoid a hot loop, and to allow our node script to
    });                                     // process asynchronous requests in the meantime.
                                          // If you're also serving http, display a 503 error.
    con.on('error', function(err) {
        console.log('db error', err);
        if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
            handleDisconnect();                         // lost due to either server restart, or a
        } else {                                      // connnection idle timeout (the wait_timeout
            throw err;                                  // server variable configures this)
        }
    });
}

handleDisconnect();

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, `./images/inventory`)
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
        up(req, res, async function (err) {
            if (err instanceof multer.MulterError) {
                return
            } else if (err) {
                return
            }
            
            let data = {
                img: fs.readFileSync(req.file.path),
                img_name: req.query.lineId+'_line-pic'+req.file.originalname.slice(req.file.originalname.lastIndexOf('.'), req.file.originalname.length)
            }

            con.query(`UPDATE ${req.query.tableId} SET ? WHERE id = ${req.query.lineId}`, data)

            await fs.unlink(req.file.path, () => {});
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
        return res.status(200).send("changes saved to database")
    },

    async pdf(req, res) {             
        con.query(`SELECT * FROM ${req.query.tableId} ORDER BY name ASC`, async function(err, result, fields) {
            var groups = []
            var aux = [];
            let sz = 0;

            fs.mkdirSync(path.dirname(__dirname) + `/templates/images/${req.query.tableId}`);

            result.forEach(rs => {
                let loc = 'tools.png'
                if(rs.img) {
                    let buf = Buffer.from(rs.img,'base64');
                    let ext = rs.img_name.slice(rs.img_name.lastIndexOf('.'), rs.img_name.length)
                    let name = rs.id+'_line'+ext
                    fs.writeFile(path.join(path.dirname(__dirname),`/templates/images/${req.query.tableId}/`, name), buf, function(error){});
                    loc = req.query.tableId + '/' + name
                }
                aux.push({
                    name: rs.name,
                    path: loc,
                    qnt: rs.qnt
                })
                sz += 1;
                if(sz == 12) {
                    sz = 0;
                    groups.push(aux);
                    aux = []
                }
            });

            if(sz != 0) {
                groups.push(aux);
            }

            var html = fs.readFileSync('./src/templates/template.html', 'utf8');

            var options = {
                format: "A4",
                orientation: "portrait",
                border: "10mm",
                base: 'file:///' + path.dirname(__dirname) + '/templates/images/',
                "footer": {
                    "height": "5mm",
                    "contents": {
                        default: '<span style = "float: right"><span style="color: #444;">{{page}}</span>/<span>{{pages}}</span></span>', // fallback value
                    }
                }
            };

            var document = {
                html: html,
                data: {
                    groups,
                    title: 'Arduino inventory'
                },
                path: "./output.pdf"
            };

            await pdf.create(document, options)
            
            var file = fs.createReadStream(document.path);
            file.pipe(res);

            await fs.unlink(document.path, () => {});

            rimraf(path.dirname(__dirname) + `/templates/images/${req.query.tableId}`, function () {});

            return
        })

        return
    }
}