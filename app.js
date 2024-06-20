import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import dbconnection from "./config/connectiondb.js";
import routes from "./routes/useroutes.js";

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 8001; // Fallback port if .env is not set
const url = process.env.url;
app.use("/api/user", routes);
dbconnection(url);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
