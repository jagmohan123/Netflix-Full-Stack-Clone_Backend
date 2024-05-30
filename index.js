// agar aap import ya export use karna chate hai to package.json me jakar ke  type module kar do  "main":"index" ke neeche   // "type": "module",

// ################first way @@@@@@@@@@@@@@@@@
//agar aapko require ka use nhi karna tab
/*import express from "express";
 import dotenv from "dotenv";

 dotenv.config({
     path:"../.env"
 })*/
// import cookieParser from "cookie-parser";

// ################first way @@@@@@@@@@@@@@@@@
// step-1
const express = require("express");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const getDbConnect = require("./configuration/database");
const userRoute = require("./routes/user");
const BASE_URL=process.env.BASE_URL;
// import cors from "cors";
const cors = require("cors");
// import the db connection
// step-2 instance create
const app = express();
const PORT = process.env.PORT || 4000;

// create the corsOption where you define your frontend server url
// for cookies send in frontend

// Adding some middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
// const corsOption = {
//   origin: "http://localhost:3000",
//   credentials: true,
// };

// app.use(cors(corsOption));

const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));

// create the api
app.use(BASE_URL, userRoute);

// so our api looks like
// http://localhost:3000/api/v1/user/

app.get("/", (req, res) => {
  res.send(`<h1>Hello G we are live now!!!! </h1>`);
});

// stabilisg DB Connection
getDbConnect();
app.listen(PORT, () => {
  console.log(`Server start on the port  ${PORT} `);
});
