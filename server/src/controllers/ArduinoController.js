const mongoose = require('mongoose');
const db = mongoose.connection;
const Patient = mongoose.model('Patient');

module.exports = {
    async data(req,res){
        //verificação de que a caixa se encontra registada
        const patient = await Patient.findOne({'boxNum':req.body.boxNum});
        if(patient!==null) {
            //obtem o valor da parcela (hora e medicamentos)
            const resp = await db.collection(`${'u'+patient.hsn}`).findOne({'name':req.params.name});
            if(resp!==null){
                return res.send('>'+resp.hour+'&'+resp.meds);
            }
            else {
                return res.status(200).send();
            }
        }
        //mensagem de erro se a caixa não estiver registada
        else {
            return res.send('caixa não registada');
        }        
    }
}