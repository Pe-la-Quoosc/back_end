const mongoose = require('mongoose'); // Erase if already required
const { post } = require('../routes/authRoute');

// Declare the Schema of the Mongo model
var productSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    slug:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
    },
    description:{
        type:String,
        required:true,
        unique:true,
    },
    price:{
        type:Number,
        required:true,
    },
    category:{
        type:String,
        required:true,
    },
    quantity:{ type:Number, required:true,
        select: false,
    },
    sold:{
        type:Number,
        default:0,
        select: false,
    },
    images:{
        type:Array,
    },
    color:{
        type:String,
        required:true,
    },
    ratings: [
        {
        star:Number,
        comment: String,
        postby :{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    },],
    totalrating:{
        type:String,
        default:0,
    },
},{ timestamps: true });

//Export the model
module.exports = mongoose.model('Product', productSchema);