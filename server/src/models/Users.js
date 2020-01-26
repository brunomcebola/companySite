const mongoose = require('mongoose');
//permite separar a informação por páginas
const mongoosePaginate = require('mongoose-paginate');
//librarie que permite criar os hashes
const crypto = require('crypto');


/* ESQUEMA DA INFORMAÇÃO REFERENTE AOS PACIENTES */
const UsersSchema = new mongoose.Schema({
    name: { type: String, required: true },

    surname: { type: String, required: true },

    email: { type: String,  required: true },

    permissions: { type: Number, default: 0 },

    basePasswordSalt: { type: String, required: true },

    basePasswordHash: { type: String, required: true },

    passwordSalt: { type: String, default: '' },

    passwordHash: { type: String, default: '' },

    usernameSalt: { type: String, required: true },

    usernameHash: { type: String, required: true },

    dataSalt: { type: String, required: true },

    hash: { type: String, required: true },
}); 

UsersSchema.methods.setBasePassword = function(password) {
    this.basePasswordSalt = crypto.randomBytes(16).toString('hex'); 
    this.basePasswordHash = crypto.pbkdf2Sync(password, this.basePasswordSalt, 1000, 64, `sha512`).toString(`hex`);
}

UsersSchema.methods.setPassword = function(password) {
    this.passwordSalt = crypto.randomBytes(16).toString('hex'); 
    this.passwordHash = crypto.pbkdf2Sync(password, this.passwordSalt, 1000, 64, `sha512`).toString(`hex`);
}

UsersSchema.methods.validatePassword = function(password) { 
    var hash = crypto.pbkdf2Sync(password, this.passwordSalt, 1000, 64, `sha512`).toString(`hex`); 
    return this.passwordHash === hash; 
};

UsersSchema.methods.setUsername = function(username) {
    this.usernameSalt = crypto.randomBytes(16).toString('hex'); 
    this.usernameHash = crypto.pbkdf2Sync(username, this.usernameSalt, 1000, 64, `sha512`).toString(`hex`);
}

UsersSchema.methods.validateUsername = function(username) { 
    var hash = crypto.pbkdf2Sync(username, this.usernameSalt, 1000, 64, `sha512`).toString(`hex`); 
    return this.usernameHash === hash; 
};

UsersSchema.methods.setSalt = function() {
    this.dataSalt = crypto.randomBytes(16).toString('hex');  
}

UsersSchema.plugin(mongoosePaginate);

mongoose.model('User', UsersSchema);