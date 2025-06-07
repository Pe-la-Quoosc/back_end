const bodyParser = require('body-parser');
const express=require('express');
const dbConnect = require('./config/dbConnect');
const app=express();
const dotenv=require('dotenv').config();
const PORT = process.env.PORT||4000;
const authRouter = require('./routes/authRoute');
const productRouter = require('./routes/productRoute');
const blogRouter = require('./routes/blogRoute');
const categoryRouter = require('./routes/categoryRoute');   
const blogCategoryRouter = require('./routes/blogCatRoute');
const couponRouter = require('./routes/couponRoute');
const AddressRouter = require('./routes/addressRoute'); 
const { notFound, errorHandler } = require('./middlewares/errorHandler');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
dbConnect();
app.use(morgan("dev")); 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/api/user",authRouter);
app.use("/api/product",productRouter);
app.use("/api/blog",blogRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/blog-category", blogCategoryRouter);
app.use("/api/coupon", couponRouter);
app.use("/api/address", AddressRouter);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});