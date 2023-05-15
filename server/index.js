const express = require("express")
const mongoose = require("mongoose")
const route = require("./src/route")
const dotenv = require("dotenv");
dotenv.config()

const cors = require('cors'); 
app.use(cors()) ;
const app = express()
app.use(express.json())

mongoose.connect(process.env.DATABASESTRING, { useNewUrlParser: true }, mongoose.set('strictQuery', false))

    .then(() => console.log("MongoDb is connected"))
    .catch((err) => console.log(err))

app.use("/", route)



app.use((request, response) => {
    return response.status(400).send({ status: false, message: "End point is incorrect" })
});

app.listen(process.env.PORT || 5000, () => {
    console.log(`Express app is running on port:`, (process.env.PORT || 5000))
})
