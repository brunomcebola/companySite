const mongoose = require('mongoose');

/* ESQUEMA DA INFORMAÇÃO REFERENTE AOS MÉDICOS */
const DoctorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    password:{
        type: String,
        required: true,
    },
    medicalNumber: {
        type: String,
        minlength : 9,
        maxlength : 9,
        required: true
    }
});

mongoose.model('Doctor', DoctorSchema);