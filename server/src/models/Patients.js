const mongoose = require('mongoose');
//permite separar a informação por páginas
const mongoosePaginate = require('mongoose-paginate');
//librarie que permite criar os hashes
const crypto = require('crypto');


/* ESQUEMA DA INFORMAÇÃO REFERENTE AOS PACIENTES */
const PatientSchema = new mongoose.Schema({
    hsn: {
        type: String,
        minlength : 9,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    sex: {
        type: Number,
        default: 2,
    },
    changed: {
        type: Number,
        default: 0,
    },
    docNum: {
        type: String,
        minlength : 9,
        required: true
    },
    docName: {
        type: String,
        required: true
    },
    boxNum: {
        type: String,
        minlength : 12,
        required: true
    },
    username: String,
    age: Number,
    hash : String, 
    saltPass : String,
    saltUser:  String,
});

//cria o hash e o salt da password e armazena-os na base de dados
PatientSchema.methods.setPassword = function(password) { 
    this.saltPass = crypto.randomBytes(16).toString('hex'); 
    this.hash = crypto.pbkdf2Sync(password, this.saltPass, 1000, 64, `sha512`).toString(`hex`); 
}; 

//verifica se a password passada como argumento é igual à password do paciente
PatientSchema.methods.validPassword = function(password) { 
    var hash = crypto.pbkdf2Sync(password, this.saltPass, 1000, 64, `sha512`).toString(`hex`); 
    return this.hash === hash; 
};

//cria o salt para o username e armazena-o na base de dados
PatientSchema.methods.setUserSalt = function() { 
    this.saltUser = crypto.randomBytes(16).toString('hex');
}; 

//gera o hash do username com base no saltUser
PatientSchema.methods.getUserHash = function(username) { 
    return crypto.pbkdf2Sync(username, this.saltUser, 1000, 64, `sha512`).toString(`hex`); 
}; 

PatientSchema.plugin(mongoosePaginate);

mongoose.model('Patient', PatientSchema);