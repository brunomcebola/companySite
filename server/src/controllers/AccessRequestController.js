const mongoose = require('mongoose');
const paginate = require('paginate-array');
const AccessRequestingUser = mongoose.model('AccessRequestingUser');


function Paginator(items, page, per_page) {
 
    var page = page || 1,
    per_page = per_page || 10,
    offset = (page - 1) * per_page,
   
    paginatedItems = items.slice(offset).slice(0, per_page),
    total_pages = Math.ceil(items.length / per_page);
    return {
        page: page,
        per_page: per_page,
        pre_page: page - 1 ? page - 1 : null,
        next_page: (total_pages > page) ? page + 1 : null,
        total: items.length,
        total_pages: total_pages,
        docs: paginatedItems
    };
}

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
        const { per_page, page, search } = req.query;
        let accessRequestingUsers
        if(search){
            accessRequestingUsers = await AccessRequestingUser.find({ 
                $or: [ 
                    { name: {$regex: search, $options: 'i'}}, 
                    { surname: {$regex: search, $options: 'i'}},
                    { email: {$regex: search, $options: 'i'}}
                ] 
            })
            const paginateCollection = Paginator(accessRequestingUsers, Number(page), Number(per_page));
            return res.json(paginateCollection)
        }
        accessRequestingUsers = await AccessRequestingUser.paginate({},{ page , limit: Number(per_page) });
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