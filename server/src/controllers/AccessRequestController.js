const mongoose = require('mongoose');
const AccessRequestingUser = mongoose.model('AccessRequestingUser');

module.exports = {
    async new(req, res) {
            let newAccessRequestingUser = new AccessRequestingUser(); 

            //informação não encriptada
            newAccessRequestingUser.name = req.body.name;
            newAccessRequestingUser.surname = req.body.surname;
            newAccessRequestingUser.email = req.body.email;
            
            newAccessRequestingUser.save()
                .then(() => {
                    res.status(201).send("New requesting user added");
                })
                .catch(() => {
                    res.status(400).send("Unable to save to database");
            });
    },
}