const dns = require("dns");
dns.setServers(["8.8.8.8"]);

const express = require("express");
require("dotenv").config();

const connectDB = require("./config/db");
const userRoute = require("./routes/userRoute");

const app = express();

// Middleware
app.use(express.json());
app.use("/users", userRoute);

app.get("/", (req, res) => {
  res.status(200).json({ msg: "Hello From PG & Hostel Management Server." });
});

connectDB();

let Port = process.env.PORT;

app.listen(Port, (err) =>
  err ? console.log(err) : console.log(`Server is Running at Port ${Port}`),
);
