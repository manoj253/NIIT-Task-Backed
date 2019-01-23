const mongoose = require('mongoose');
const ComplaintSchema = new mongoose.Schema({
    heading: { type: String },
    description : {type : String},
    status : {type : String,enum : ['open','accepted'],default:"open"},
    modifiedAt : { type: Date, default : Date.now },
    createdAt : { type: Date, default : Date.now },
    isActive : {type  : Boolean, default : 1 },
},{timestamp : {createdAt: "createdAt",updatedAt:"modifiedAt"}});


var Complaint = mongoose.model('Complaints', ComplaintSchema);

module.exports = {Complaint}