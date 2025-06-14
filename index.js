const bodyParser = require('body-parser');
const express=require('express');
const cors = require("cors");
const dbConnect = require('./config/dbConnect');
const app=express();
const dotenv=require('dotenv').config();
const PORT = process.env.PORT||4000;
const authRouter = require('./routes/authRoute');
const productRouter = require('./routes/productRoute');
const blogRouter = require('./routes/blogRoute');
const categoryRouter = require('./routes/categoryRoute');   
const blogCategoryRouter = require('./routes/blogCatRoute');
const cartRouter = require("./routes/cartRoute");
const couponRouter = require('./routes/couponRoute');
const addressRouter = require('./routes/addressRoute');
const reviewRouter = require('./routes/reviewRoute');
const { notFound, errorHandler } = require('./middlewares/errorHandler');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
dbConnect();
app.use(cors({
  origin: "http://localhost:3000", // Cho phép frontend truy cập
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"], // Các phương thức được phép
  credentials: true, // Nếu cần gửi cookie hoặc thông tin xác thực
}));

app.use(morgan("dev")); 
// app.use(bodyParser.json());
app.use(express.json()); // Thay thế bodyParser.json() bằng express.json()
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/user",authRouter);
app.use("/api/product",productRouter);
app.use("/api/blog",blogRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/blog-category", blogCategoryRouter);
app.use("/api/coupon", couponRouter);

app.use("/api/cart", cartRouter);
app.use("/api/address", addressRouter);


app.use("/api/category", categoryRouter);

app.use("/api/reviews", reviewRouter);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});