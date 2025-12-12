const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv= require('dotenv')
const expenseRoutes = require("./routes/expenseRoutes");
const authRoutes=require('./routes/authRoutes')

const app = express();

dotenv.config()
app.use(cors());
app.use(express.json());


mongoose
  .connect("mongodb://127.0.0.1:27017/expense_tracker")
  .then(() => console.log(" MongoDB connected"))
  .catch((err) => console.error("Mongo error:", err));


app.use("/api/expenses", expenseRoutes);
app.use('/auth',authRoutes)


const PORT = 5000;
app.listen(PORT, () => {
  console.log(` Server running on ${PORT}`);
});
