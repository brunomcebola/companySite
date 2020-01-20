const mongoose = require('mongoose');
const User = mongoose.model('User');

module.exports = {
    async login(req, res){
        let aux = await User.find();
        aux.forEach(user => { 
            if(user.validatePassword(req.body.password) && user.validateUsername(req.body.username)){
                return res.status(200).send(user._id)
            }
        })
        return res.status(401).send("Access not allowed")
    }
}