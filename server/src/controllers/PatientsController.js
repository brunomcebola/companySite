const mongoose = require('mongoose');
const links = require('../links');
const aes256 = require('aes256');
const randomstring = require("randomstring");

const Patient = mongoose.model('Patient');

function check(req){
    return (links.includes(req.headers.referer))
}

module.exports = {
    //retorna todos os pacientes
    async index(req, res) {
        if (check(req)){
            const { page } = req.query;
            const patients = await Patient.paginate({},{ page , limit:10 });
            patients.docs.map(patient => {
                let patientAux = new Patient(); 
                patientAux.saltUser = patient.saltUser;
                let key = patientAux.getUserHash(patient.username);

                //desencripta a informação necessária
                patient.firstName = aes256.decrypt(key, patient.firstName);
                patient.lastName = aes256.decrypt(key, patient.lastName);
                patient.docName =  aes256.decrypt(key, patient.docName);
                patient.docNum = aes256.decrypt(key, patient.docNum);

                //elimina da resposta dados não necessários e secretos
                patient.boxNum = '';
                patient.changed = '';
                patient.hash = '';
                patient.saltUser = '';
                patient.saltPass = '';
                patient.username = '';
            })
            return res.json(patients);
        }
        else {
            return res.send('Não tem permissão para aceder a esta página')
        }
    },

    //retorna um paciente em específico
    async show(req, res) {
        if (check(req)){
            await Patient.findOne({'hsn':req.params.hsn}, function(err, patient){
                if (patient === null) { 
                    return res.json(null) 
                } 
                else { 
                    let key = patient.getUserHash(patient.username);

                    //desencripta a informação necessária
                    patient.firstName = aes256.decrypt(key, patient.firstName);
                    patient.lastName = aes256.decrypt(key, patient.lastName);
                    patient.docName = aes256.decrypt(key, patient.docName);
                    patient.docNum = aes256.decrypt(key, patient.docNum);

                    //elimina informação confidencial da resposta
                    patient.boxNum = '';
                    patient.changed = '';
                    patient.hash = '';
                    patient.saltUser = '';
                    patient.saltPass = '';

                    return res.json(patient)
                }
            });
        }
        else {
            return res.send('Não tem permissão para aceder a esta página')
        }
    },

    //lida com os logins dos pacientes
    async log(req, res) {
        //confirma a origem do pedido (site / app)
        if (check(req) || req.body.appToken === 'WR7mG@h3rx9hxAX6A.72dtWJn&uxfjYa'){
            await Patient.findOne({'username': req.body.user}, function(err, patient) {
                if (patient === null) { 
                    return res.json(null) 
                } 
                else { 
                    if(patient.validPassword(req.body.pass)){
                        let key = patient.getUserHash(patient.username);

                        //desencripta a informeção necessária
                        patient.firstName = aes256.decrypt(key, patient.firstName);
                        patient.lastName = aes256.decrypt(key, patient.lastName);

                        //esconde a informação confidencial da resposta
                        patient.boxNum = '';
                        patient.hash = '';
                        patient.saltUser = '';
                        patient.saltPass = '';
                        patient.docName = '';
                        patient.docNum = '';

                        return res.json(patient);
                    } 
                    else{
                        return res.json(null);
                    } 
                }
            });
        }
        else {
            return res.send('Não tem permissão para aceder a esta página')
        }
    }, 

    //permite criar novos pacientes
    async store(req, res) {
        if (check(req)){

            let newPatient = new Patient(); 

            //gera uma pass aleatoria com numeros e letras
            let pass = randomstring.generate({
                length: 10,
                readable: true,
                charset: 'alphanumeric'
            });

            //gera os salt da pass e do username e o hash da pass
            newPatient.setUserSalt();
            newPatient.setPassword(pass);

            //obtem o hash do username para encriptar a informação
            let key = newPatient.getUserHash(req.body.username);

            //informação não encriptada
            newPatient.username = req.body.username;
            newPatient.hsn = req.body.hsn; 
            newPatient.boxNum = req.body.boxNum; 
            newPatient.age = req.body.age;

            //infomração encriptada
            newPatient.firstName = aes256.encrypt(key, req.body.firstName); 
            newPatient.lastName = aes256.encrypt(key, req.body.lastName);  
            newPatient.docNum = aes256.encrypt(key, req.body.docNum); 
            newPatient.docName = aes256.encrypt(key, req.body.docName); 
            
            newPatient.save((err, Patient) => {}); 

            return res.json(pass);
        }
        else {
            return res.send('Não tem permissão para aceder a esta página')
        }
    },

    //atualiza os dados de um paciente especifico
    async update(req, res) {
        if (check(req) || req.body.appToken === 'WR7mG@h3rx9hxAX6A.72dtWJn&uxfjYa'){
            let docName, docNum, boxNum

            //obtem os dados anteriores e desencripta-os
            const resp = await Patient.findOne({'hsn':req.params.id});
            let deletePatient = new Patient();
            deletePatient.saltUser = resp.saltUser;
            let keyDelete = deletePatient.getUserHash(resp.username);
            docName = aes256.decrypt(keyDelete, resp.docName);
            docNum = aes256.decrypt(keyDelete, resp.docNum);
            boxNum = resp.boxNum


            let newPatient = new Patient(); 

            //gera novo salt para pass e user e novo hash para pass
            newPatient.setUserSalt();
            newPatient.setPassword(req.body.password);

            let key = newPatient.getUserHash(req.body.username);

            //info não encriptada
            newPatient.username = req.body.username;
            newPatient.hsn = req.body.hsn; 
            newPatient.boxNum = boxNum; 
            newPatient.sex = req.body.sex;
            newPatient.age = req.body.age;

            //encripta os dados com base no novo hash do username
            newPatient.firstName = aes256.encrypt(key, req.body.firstName); 
            newPatient.lastName = aes256.encrypt(key, req.body.lastName);  
            newPatient.docNum = aes256.encrypt(key, docNum); 
            newPatient.docName = aes256.encrypt(key, docName);

            //cria um novo objeto e insere todos os dados para poder atulizar
            let patientUpdate ={
                sex: '', age: '', changed: '', saltUser: '', saltPass: '', hash: '',
                username: '', hsn: '', boxNum: '', firstName: '', lastName: '',
                docNum: '', docName: ''
            };
            patientUpdate.sex = newPatient.sex;
            patientUpdate.age = newPatient.age;
            patientUpdate.changed = 1;
            patientUpdate.saltUser = newPatient.saltUser;
            patientUpdate.saltPass = newPatient.saltPass;
            patientUpdate.hash = newPatient.hash;
            patientUpdate.username = newPatient.username;
            patientUpdate.hsn = newPatient.hsn;
            patientUpdate.boxNum = newPatient.boxNum;
            patientUpdate.firstName = newPatient.firstName;
            patientUpdate.lastName = newPatient.lastName;
            patientUpdate.docNum = newPatient.docNum;
            patientUpdate.docName = newPatient.docName;
            
            await Patient.findOneAndUpdate({'hsn':req.params.id}, patientUpdate)

            return res.send('success')
        }
        else {
            return res.send('Não tem permissão para aceder a esta página')
        }
    },

    //verifica a existencia de um username
    async checkUsername(req, res) {
        if(check(req)) {
            const patient = await Patient.findOne({'username': req.body.user});
            return res.json(patient===null); 
        }
        else {
            return res.send('Não tem permissão para aceder a esta página')
        }
    }
}; 