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
    salt: {
        type: String,
        required: true
    },
    hash: {
        type: String,
        required: true
    }
}); 

AccessRequestingUserSchema.methods.setSalt = function() {
    this.salt = crypto.randomBytes(16).toString('hex');  
}

AccessRequestingUserSchema.methods.generateHash = function(email) {
    this.hash = crypto.pbkdf2Sync(email, email, 1000, 64, `sha512`).toString(`hex`);
    return this.hash
}

AccessRequestingUserSchema.plugin(mongoosePaginate);

mongoose.model('AccessRequestingUser', AccessRequestingUserSchema);