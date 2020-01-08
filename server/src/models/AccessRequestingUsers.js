const mongoose = require('mongoose');
//permite separar a informação por páginas
const mongoosePaginate = require('mongoose-paginate');
//librarie que permite criar os hashes
const crypto = require('crypto');


/* ESQUEMA DA INFORMAÇÃO REFERENTE AOS PACIENTES */
const AccessRequestingUserSchema = new mongoose.Schema({
    name: {
        type: String, 
        required: true
    },
    surname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
}); 

AccessRequestingUserSchema.plugin(mongoosePaginate);

mongoose.model('AccessRequestingUser', AccessRequestingUserSchema);