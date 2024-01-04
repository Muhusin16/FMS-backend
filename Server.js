const express = require('express');
const connectDb = require("./config/dbConnection")
const bodyParser = require('body-parser');
const cors = require("cors");
const morgan = require("morgan");
const CooKieParser = require("cookie-parser");
const http = require("http")
// const allowedOrigin = process.env.ALLOWED_ORIGIN || "*";
require("dotenv").config();

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT

const allowedOrigin = 'http://localhost:3000'; // Replace with your React app's origin
app.use(cors({ origin: allowedOrigin }));

app.use(morgan('short'))
app.use(bodyParser.json());
// app.use(errorHandler)
app.use(express.json())
app.use(CooKieParser())
app.use(express.static("public"))

app.use("/api/user", require("./routes/userRoutes"));
app.use("/api", require("./routes/teamRoutes"));

connectDb();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
