import express from "express";
import mongoose from "mongoose";
import route from "./src/route.js";
import { config } from "dotenv";
import multer from "multer";
import cors from 'cors';

const app = express();

app.use(express.json());

config();

app.use(multer().any());

app.use(cors());

mongoose.connect(process.env.DATABASESTRING, { useNewUrlParser: true }, mongoose.set('strictQuery', false))
    .then(() => console.log("MongoDb is connected"))
    .catch((err) => console.log(err));

app.use("/", route);


app.use((request, response) => {
    return response.status(400).send({ status: false, message: "End point is incorrect" })
});

app.listen(process.env.PORT || 3000, () => {
    console.log(`Express app is running on port:`, (process.env.PORT || 3000))
})
