const mongoose = require('mongoose');
const Doctor = mongoose.model('Doctor');
const links = require('../links');

//utilizada para fazer a autenticação do link
function check(req){
    return (links.includes(req.headers.referer)) 
}

module.exports = {
    //retorna lista dos médicos
    async index(req, res) {
        if (check(req)){
            const doctors = await Doctor.find();
            return res.json(doctors);
        }
        else {
            return res.send('Não tem permissão para aceder a esta página')
        }
    },

    //retorna um médico em específico
    async show(req, res) {
        if (check(req)){
            const doctor = await Doctor.findOne({'medicalNumber':req.params.id});
            return res.json(doctor);
        }
        else {
            return res.send('Não tem permissão para aceder a esta página')
        }
        
    },

    //serve para criar um novo médico - não está a ser utilizado atualmente
    async store(req, res) {
        if (check(req)){
            const doctor = await Doctor.create(req.body);
            return res.json(doctor);
        }
        else {
            return res.send('Não tem permissão para aceder a esta página')
        }
    },

    //serve para atualizar os dados de um médico - não está a ser utilizado atualmente
    async update(req, res) {
        if (check(req)){
            const doctor = await Doctor.findByIdAndUpdate(req.params.id, req.body, {new: true});
            return res.json(doctor);
        }
        else {
            return res.send('Não tem permissão para aceder a esta página')
        }
    }
}; 