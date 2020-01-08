const mongoose = require('mongoose');
const db = mongoose.connection;
const links = require('../links');
const Patient = mongoose.model('Patient');

//confirma o link de onde o pedido é originado para permitir ou negar acesso. Apenas o site tem acesso a estas funções
function check(req){
    return (links.includes(req.headers.referer))
}

module.exports = {
    //cria uma nova coleção para os medicamentos de um novo utilizador
    async new (req, res) {
        if (check(req)){
            await db.createCollection(req.params.col);
            await db.collection(req.params.col).insertOne({name: 'info', text : ''});
            res.send();
        }
        else {
            return res.send('Não tem permissão para aceder a esta página')
        }
    },
    
    //atualiza a informação médica existente na coleção
    async updateInfo(req, res) {
        if (check(req)){
            await db.collection(req.params.col).findOneAndUpdate({ 'name' : 'info' }, {$set: req.body});
            return res.send();
        }
        else {
            return res.send('Não tem permissão para aceder a esta página')
        }
    },

    //obtem a informação médica guardada na coleção
    async info(req, res) {
        if (check(req)){
            const response = await db.collection(req.params.col).findOne({ 'name': 'info'});
            return res.json(response);
        }
        else {
            return res.send('Não tem permissão para aceder a esta página')
        }
    },

    //insere um novo slot de medicação na coleção ou atualiza um já existente
    async newMed(req, res) {
        if (check(req)){
            const response = await db.collection(req.params.col).findOne({ 'name': req.body.name});
            if(response === null){
                await db.collection(req.params.col).insertOne(req.body);
            } 
            else{
                await db.collection(req.params.col).findOneAndUpdate({ 'name' : req.body.name }, {$set: req.body});
            }
            return res.send();
        }
        else {
            return res.send('Não tem permissão para aceder a esta página')
        }
    },

    //apaga um slot de medicação da coleção
    async delMed(req, res) {
        if (check(req)){
            await db.collection(req.params.col).findOneAndDelete({ 'name' : req.params.name });
            return res.send();
        }
        else {
            return res.send('Não tem permissão para aceder a esta página')
        }
    },

    //obtem os dados de um slot de medicaçao presente na coleção
    async medicine(req, res) {
        //lida com os pedidos vindos do site
        if (check(req)){
            const response = await db.collection(req.params.col).findOne({ 'name': req.params.name });
            return res.json(response)
        }
        //lida com os pedidos vindos da aplicação
        else if(req.body.appToken === 'WR7mG@h3rx9hxAX6A.72dtWJn&uxfjYa') {
            await Patient.findOne({'username': req.body.user}, async function(err, patient) {
                if (patient === null) { 
                    return res.send('Não tem permissão para aceder a esta informação')
                } 
                else { 
                    if(patient.validPassword(req.body.pass)){
                        //retorna a informaçao se todos os dados estiverem corretos
                        if(req.params.col.substring(1)===patient.hsn){
                            const response = await db.collection(req.params.col).findOne({ 'name': req.params.name });
                            return res.json(response)
                        }

                        return res.json(patient);
                    } 
                    else{
                        return res.send('Não tem permissão para aceder a esta informação')
                    } 
                }
            });
        }
        else {
            return res.send('Não tem permissão para aceder a esta página')
        }
    }
}