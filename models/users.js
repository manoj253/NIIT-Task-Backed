const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true,unique : true},
    mobile: { type: String, default: null },
    password: { type: String, required: true },
    modifiedAt : { type: Date, default : Date.now },
    createdAt : { type: Date, default : Date.now },
    isActive : {type  : Boolean, default : 1 },
},{timestamp : {createdAt: "createdAt",updatedAt:"modifiedAt"}});

UserSchema.pre('save', function(next){
    var user = this;
    if(user.isModified('password')){
        bcrypt.genSalt(5, (err, salt)=>{
            bcrypt.hash(user.password, salt, (err, hash)=>{
                user.password = hash;
                next();
            })
        });
    }else{
        next();
    }
});

var User = mongoose.model('Users', UserSchema);

module.exports = {User}