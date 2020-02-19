var mongoose = require('mongoose')

const  ProfilePicsSchema = new mongoose.Schema({
    img: { data: Buffer, contentType: String},
    userId: String
}, {
    timestamps: true
});

module.exports = mongoose.model('ProfilePic', ProfilePicsSchema);