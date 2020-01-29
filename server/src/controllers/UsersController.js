const mongoose = require('mongoose');
const aes256 = require('aes256');
const sortJsonArray = require('sort-json-array');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const User = mongoose.model('User');
const ProfilePic = mongoose.model('ProfilePic');


var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'images/profile_pics')
    },
    filename: function (req, file, cb) {
        cb(null, req.query.id+'_profile-pic'+file.originalname.slice(file.originalname.indexOf('.'), file.originalname.length))
    }
})

var up = multer({ storage: storage, limits: { fileSize: 1024*512 } }).single('file') //max 0.5MB


module.exports = {
    //return dento de foreach nao sai
    async login(req, res) {
        let aux = await User.find();
        for(let i = 0; i < aux.length; i++) {
            if(aux[i].validatePassword(req.body.password) && aux[i].validateUsername(req.body.username)){
                return res.status(200).send(aux[i]._id)
            }
        }
        return res.status(401).send("Access not allowed")
    },

    async name(req, res) {
        await User.find({_id: req.query.id})
            .then((user) => {
                let name = aes256.decrypt(user[0].dataSalt, user[0].name) + ' ' + aes256.decrypt(user[0].dataSalt, user[0].surname)
                return res.status(200).send(name)
            })
            .catch(() => {
                return res.status(401).send("Bad request")
            })
    },

    async permissions(req, res){
        await User.find({_id: req.query.id})
            .then((user) => {
                return res.status(200).send(user[0].permissions.toString())
            })
            .catch(() => {
                return res.status(401).send("Bad request")
            })
    },

    async paginate(req, res) {
        var aux = [];
        let docs = [];
        const { per_page, page, order, dir, search, id } = req.query;
        let users;

        users = await User.find({ _id: { $ne: id } });

        if(search){
            users.map(user => { 
                let key = user.dataSalt;

                if(aes256.decrypt(key, user.name).match(search) ||
                aes256.decrypt(key, user.surname).match(search) ||
                aes256.decrypt(key, user.email).match(search)){
                    aux.push({
                        _id: user._id,
                        name: aes256.decrypt(key, user.name),
                        surname: aes256.decrypt(key, user.surname),
                        email: aes256.decrypt(key, user.email),
                        permissions: user.permissions,
                    })
                } 
            })
        }
        else {
            users.map(async (user) => { 
                let key = user.dataSalt;

                aux.push({
                    _id: user._id,
                    name: aes256.decrypt(key, user.name),
                    surname: aes256.decrypt(key, user.surname),
                    email: aes256.decrypt(key, user.email),
                    permissions: user.permissions
                })
            })
        }

        order ? sortJsonArray(aux, order, dir) : null;
        
        for(let n = per_page*(page-1); n < per_page*page, n < aux.length; n++){
            docs.push(aux[n])
        }

        return res.status(200).json({docs, total: aux.length, page: page});      

          
            
    },

    async exclude(req, res) {
        await User.findOneAndDelete({'_id' : req.query.id })
            .then(() => {
                return res.status(200).send("Changes saved to data base")
            })
            .catch(() => {
                return res.status(500).send("Unable to save to database")
            })
    },

    async update(req, res) {
        await User.findOne({'_id': req.body._id})
            .then(async (user) => {
                //let key = user.dataSalt
                let userUpdate = new User()
                let data = {}

                if(req.body.password){
                    userUpdate.setPassword(req.body.password)
                    data.passwordSalt = userUpdate.passwordSalt
                    data.passwordHash = userUpdate.passwordHash
                }
                data.permissions = req.body.permissions

                await User.findOneAndUpdate({'_id': req.body._id}, data)
                    .then(() => {
                        res.status(200).send("Changes saved to data base")
                    })
                    .catch(() => {
                        res.status(500).send("Unable to save to database")
                    })
            })
            .catch(() => {
                res.status(500).send("Unable to save to database")
            })
    },

    async uploadImage(req,res) {
        fs.readdir('./images/profile_pics', (err, files) => {
            if (err) {
                return res.status(500).send("Unable to save to database")
            }
        
            files.forEach(async file => {
                const fileDir = path.join('./images/profile_pics', file);
        
                if (file.match(req.query.id)) {
                    await fs.unlink(fileDir, () => {});
                }
            });
        });

        await ProfilePic.findOneAndDelete({'userId' : req.query.id })
            .catch(() => {
                return res.status(500).send("Unable to save to database")
            })     
            
        up(req, res, function (err) {
            if (err instanceof multer.MulterError) {
                return
            } else if (err) {
                return
            }

            let new_img = new ProfilePic;
            new_img.img.data = fs.readFileSync(req.file.path)
            new_img.img.contentType = 'image/'+req.file.originalname.slice(req.file.originalname.indexOf('.')+1, req.file.originalname.length);
            new_img.userId = req.query.id;
            new_img.save()
                .then(() => {
                    return res.status(200).send("Changes saved to data base")
                })
                .catch(() => {
                    return res.status(500).send("Unable to save to database")
                })
        })   
    },

    async retrieveProfilePic(req, res) {
        ProfilePic.findOne({userId: req.query.userId})
            .then((img) => {
                res.contentType('json');
                return res.status(200).send(img);
            })
            .catch(() => {
                return res.send(400).send("Unable to save to database")
            })
    },

    async retrieveProfilePics(req, res) {
        ProfilePic.find({userId: { $ne: req.query.userId }})
            .then((imgs) => {
                res.contentType('json');
                return res.status(200).send(imgs);
            })
            .catch(() => {
                return res.send(400).send("Unable to save to database")
            })
    }
}