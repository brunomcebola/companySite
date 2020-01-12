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
                    res.status(201).send("Changes saved to database");
                })
                .catch(() => {
                    res.status(400).send("Unable to save to database");
            });
    },

    async paginate(req, res) {
        const { per_page, page } = req.query;
        const accessRequestingUsers = await AccessRequestingUser.paginate({},{ page , limit: Number(per_page) });
        return res.json(accessRequestingUsers);
    },

    async refuse(req, res) {
        AccessRequestingUser.findOneAndDelete({'_id' : req.query.id })
            .then(() => {
                res.status(200).send("Changes saved to data base")
            })
            .catch(() => {
                res.status(400).send("Unable to save to database")
            })
    }
}