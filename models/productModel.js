const mongoose = require('mongoose'); // Erase if already required


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
    discountPercentage:{
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
    review: {
      type: [
        {
          user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
          },
          comment: {
            type: String,
            required: true,
          },
          rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
          },
          createdAt: {
            type: Date,
            default: Date.now,
          },
        },
      ],
      default: null, // Đặt giá trị mặc định là null
    },
    ratings: {
      type: [
        {
          star: Number,
          comment: String,
          postby: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
          },
        },
      ],
      default: null, // Đặt giá trị mặc định là null
    },
    totalrating:{
        type:String,
        default:0,
    },
},{ timestamps: true });

//Export the model
module.exports = mongoose.model('Product', productSchema);