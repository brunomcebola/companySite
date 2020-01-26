const mongoose = require('mongoose');
const nodemailer = require("nodemailer");
const randomstring = require("randomstring");
const aes256 = require('aes256');
const sortJsonArray = require('sort-json-array');


const AccessRequestingUser = mongoose.model('AccessRequestingUser');
const User = mongoose.model('User');

const settings = require('../../config')

//elasticemail smtp pass: 4381F496BF133EDD4EE81BB531347C3E2D19

module.exports = {
    async new(req, res) {
        let newAccessRequestingUser = new AccessRequestingUser(); 

        newAccessRequestingUser.generateHash(req.body.email)

        let checker1 = await AccessRequestingUser.find({hash: newAccessRequestingUser.hash})
        let checker2 = await User.find({hash: newAccessRequestingUser.hash})

        if(!checker1[0] && !checker2[0]){
            
            //informação encriptada
            newAccessRequestingUser.setSalt();
            newAccessRequestingUser.name = aes256.encrypt(newAccessRequestingUser.salt, req.body.name);
            newAccessRequestingUser.surname = aes256.encrypt(newAccessRequestingUser.salt, req.body.surname);
            newAccessRequestingUser.email = aes256.encrypt(newAccessRequestingUser.salt, req.body.email);
            
            await newAccessRequestingUser.save()
                .then(() => {
                    return res.status(200).send("Changes saved to database");
                })
                .catch(() => {
                    return res.status(400).send("Unable to save to database");
            });
        }
        else {
            return res.status(400).send("Unable to save to database");
        }
    },

    //falta status code; falta ordenar para a procura
    async paginate(req, res) {
        let aux = [];
        let docs = [];
        const { per_page, page, order, dir, search } = req.query;
        let accessRequestingUsers;

        accessRequestingUsers = await AccessRequestingUser.find();

        if(search){
            accessRequestingUsers.map(accessRequestingUser => { 
                let key = accessRequestingUser.salt

                if(aes256.decrypt(key, accessRequestingUser.name).match(search) ||
                aes256.decrypt(key, accessRequestingUser.surname).match(search) ||
                aes256.decrypt(key, accessRequestingUser.email).match(search)){
                    aux.push({
                        _id: accessRequestingUser._id,
                        name: aes256.decrypt(key, accessRequestingUser.name),
                        surname: aes256.decrypt(key, accessRequestingUser.surname),
                        email: aes256.decrypt(key, accessRequestingUser.email),
                    })
                } 
            })
        }
        else {
            accessRequestingUsers.map(accessRequestingUser => {
                let key = accessRequestingUser.salt

                aux.push({
                    _id: accessRequestingUser._id,
                    name: aes256.decrypt(key, accessRequestingUser.name),
                    surname: aes256.decrypt(key, accessRequestingUser.surname),
                    email: aes256.decrypt(key, accessRequestingUser.email),
                })
            })
        }
        
        order ? sortJsonArray(aux, order, dir) : null;
        
        for(let n = per_page*(page-1); n < per_page*page, n < aux.length; n++){
            docs.push(aux[n])
        }

        return res.json({docs, total: aux.length, page: page});
    },

    async refuse(req, res) {
        await AccessRequestingUser.findOneAndDelete({'_id' : req.query.id })
            .then(() => {
                res.status(200).send("Changes saved to data base")
            })
            .catch(() => {
                res.status(400).send("Unable to save to database")
            })
    },

    async accept(req, res) {
        let accessRequestingUser = await AccessRequestingUser.findOne({'_id' : req.query.id })
        if(!accessRequestingUser) return res.status(400).send("Unable to save to database");

        let key = accessRequestingUser.salt;
        let name = aes256.decrypt(key, accessRequestingUser.name)
        let surname = aes256.decrypt(key, accessRequestingUser.surname)
        let email = aes256.decrypt(key, accessRequestingUser.email)

        let username = (name+surname).toLowerCase()
        let password = randomstring.generate({
            length: 10,
            readable: true,
            charset: 'alphanumeric'
        });

        let html = `
            <div style="height:250px; text-align: center">
                <h2>Welcome to ${settings.name}!</h2>
                <p>Your acount has been cleared. To start working you just need to use the credentials bellow.</p>
                <p><strong>Username:</strong> ${username}</p>
                <p><strong>Password:</strong> ${password}</p>
                <p>Access your account using the following button</p>
                <a 
                    href=${settings.home_page} 
                    target="_blank" 
                    style="
                        color: #fff; 
                        text-decoration: none; 
                        font-size: 18px;
                        font-weight: 100;
                        border-radius: 20px;
                        padding: 6.5px 16.5px;
                        margin-bottom: 20px;
                        background: #${settings.firstColor};
                        background: linear-gradient(to left, #${settings.firstColor}, #${settings.secondColor});
                        background: -moz-linear-gradient(to left, #${settings.firstColor}, #${settings.secondColor});
                        background: -webkit-linear-gradient(to left, #${settings.firstColor}, #${settings.secondColor});"
                >
                    Sign in             
                </a>
            </div>
        `

        
        let newUser = new User(); 
        newUser.setSalt();
        newUser.name = aes256.encrypt(newUser.dataSalt, name);
        newUser.surname = aes256.encrypt(newUser.dataSalt, surname);
        newUser.email = aes256.encrypt(newUser.dataSalt, email);
        newUser.hash = accessRequestingUser.hash;
        newUser.setBasePassword(password)
        newUser.setPassword(password)
        newUser.setUsername(username);

        let newUserId = newUser._id;

        await newUser.save()
            .then(async () => {
                await AccessRequestingUser.findOneAndDelete({'_id' : req.query.id })
                    .then(async () => {
                        let transporter = nodemailer.createTransport({
                            host: settings.smtp_host,
                            port: 465,
                            secure: true, // true for 465, false for other ports
                            auth: {
                              user: settings.email, // generated ethereal user
                              pass: settings.pass // generated ethereal password
                            }
                        });

                        await transporter.sendMail({
                            from: `${settings.name} <${settings.email}>`,
                            to: email, // list of receivers
                            subject: "Access granted", // Subject line
                            html: html // html body
                        })
                            .then(async () => {
                                res.status(200).send("Changes saved to data base")
                            })
                            .catch(async () => {
                                await User.findOneAndDelete({'_id' : newUserId })

                                let newAccessRequestingUser = new AccessRequestingUser(); 
                                newAccessRequestingUser.setSalt();
                                newAccessRequestingUser.name = aes256.encrypt(newAccessRequestingUser.salt, name);
                                newAccessRequestingUser.surname = aes256.encrypt(newAccessRequestingUser.salt, surname);
                                newAccessRequestingUser.email = aes256.encrypt(newAccessRequestingUser.salt, email);
                                newAccessRequestingUser.generateHash(email)
                                newAccessRequestingUser.save()

                                res.status(400).send("Unable to save to database")
                            })
                    })
                    .catch(async () => {
                        await User.findOneAndDelete({'_id' : newUserId })
                        res.status(400).send("Unable to save to database")
                    })
            })
            .catch(() => {
                return res.status(400).send("Unable to save to database");
            })
    }            
    
}