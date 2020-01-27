const mysql = require('mysql')

var con = mysql.createConnection({
    host: "remotemysql.com",
    user: "VY6ybliafL",
    password: "SH0wpDO5Ax",
    database: "VY6ybliafL"
});

module.exports = {
    async create(req, res) {
        con.query('INSERT INTO inventories SET ?', req.body);

        var sql = `
            CREATE TABLE ${req.body.id} (
                id INT PRIMARY KEY,
                img blob,
                img_name varchar(45) collate latin1_general_ci,
                name varchar(255),
                qnt INT,
                category INT
            );
        `        
          
        con.query(sql);
        return res.status(200).send('Changes saved to database')
    },

    async new(req, res) {
        let data = {
            name: 'machado'
        }

        con.query('INSERT INTO inventory SET ?', data);
        return res.status(200).send('Changes saved to database')
    },

    async paginate(req, res) {
        con.query("SELECT * FROM inventories", function (err, result, fields) {
            if (err) throw err;
            res.send(result);
        });
    }
}