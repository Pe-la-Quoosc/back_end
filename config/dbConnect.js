const {default: mongoose} = require('mongoose');

const dbConnect =()=>{
    try {
        const conn=mongoose.connect(process.env.MONGO_URL);
        console.log(`MongoDB connected`);
    } catch(error){
        console.error(`MongoDB connection error`);
    }
}
module.exports = dbConnect;