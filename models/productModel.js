const mongoose = require('mongoose'); // Erase if already required


// Declare the Schema of the Mongo model
const variantSchema = new mongoose.Schema({},{strict: false});
var productSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    slug:{
        type:String,
        required:true,
        lowercase:true,
    },
    description:{
        type:String,
        required:true,
    },
    price:{
        type:Number,
        required:true,
    },
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Category',
        required:true,
    },
    quantity:{ type:Number, required:true },
    sold:{
        type:Number,
        default:0,
    },
    images:{
        type:[String],
        required:true,
    },
    variants:{
       type: [variantSchema],
       default: [],
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