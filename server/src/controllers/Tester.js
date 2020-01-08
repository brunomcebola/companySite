const mongoose = require('mongoose');

module.exports = {
    async test(req,res){
        return res.send('caixa não registada'); 
    }
}