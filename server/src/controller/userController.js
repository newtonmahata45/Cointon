const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
// const nodemailer = require("nodemailer");

const registerUser = async function (req, res) {
    try {

        // profile picture not added
        // password not hashed/ bycriped

        const data = req.body;
        const { name, phone, email, password, city, referCode } = data;

        if (!name) { return res.status(400).send({ status: false, message: "Name is mandatory" }) }
        if (!phone) { return res.status(400).send({ status: false, message: "Phone no is mandatory" }) }
        if (!password) { return res.status(400).send({ status: false, message: "Password is mandatory" }) }
        if (!email) { return res.status(400).send({ status: false, message: "Email id is mandatory" }) }

        if (!(/^[a-zA-Z ,.'-]+$/.test(name))) { return res.status(400).send({ status: false, message: "Name is not valid" }) }
        if (!(/^[0]?[6789]\d{9}$/.test(phone))) { return res.status(400).send({ status: false, message: "Mobile no is not valid" }) }
        let emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-z\-0-9]+\.)+[a-z]{2,}))$/;
        if (!(emailRegex.test(email))) { return res.status(400).send({ status: false, message: "email is not valid" }) }

        let passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,15}$/;
        if (!(passwordRegex.test(password))) { return res.status(400).send({ status: false, message: "Choose a Strong Password, Use a mix of letters (uppercase and lowercase), numbers, and symbols in between 8-15 characters" }) }
        let uniquePhn = await userModel.findOne({ phone: phone })   // checking Phone Number is Unique or not //
        if (uniquePhn) return res.status(409).send({ status: false, message: "Phone Number is already registered" })
        let uniqueEmail = await userModel.findOne({ email: email })
        if (uniqueEmail) return res.status(409).send({ status: false, message: "Email id is already registered" })

        if (referCode) {
            let referedUser = await userModel.findById(referCode); // finding user with the refer code
            if (!referedUser) { return res.status(404).send({ status: false, message: "invalid refer code" }) }

            referedUser.fund += 100;
            await userModel.findByIdAndUpdate(referCode, { $set: { ...referedUser } }, { new: true })

            data.fund = 100;

        };
        let userData = await userModel.create(data) // User is Create Successfully
        return res.status(201).send({ status: true, message: 'Registration Successfull', data: userData })
    }
    catch (error) {
        console.log(error)
        return res.status(500).send({ status: false, message: error.message })
    }
}

const forgotPassword = async function (req, res) {

}


let logIn = async function (req, res) {
    try {
        let credentials = req.body;
        let { email, password } = credentials;

        if (!password) { return res.status(400).send({ status: false, message: "password is mandatory" }) }
        if (!email) { return res.status(400).send({ status: false, message: "email is mandatory" }) }

        let userDetail = await userModel.findOne({ email: email, password: password })
        if (!userDetail) {
            return res.status(404).send({ status: false, message: "User not found with this Email Id and Password" })
        }

        let token = jwt.sign({ id: userDetail._id.toString() }, "secret-key-of-newton");

        res.setHeader("x-api-key", token);
        return res.status(200).send({ status: true, message: "User login successfull", token, userDetail })

    } catch (err) {
        console.log(err)
        return res.status(500).send({ status: false, message: err.message })
    }
}


let getProfile = async function (req, res) {
    try {
        let userId = req.loginUserId;
        let userData = await userModel.findById(userId);
        if(!userData) return res.status(404).send({ status: false, message: "user not found" });
        return res.status(200).send({ status: true, message: "success", userDetail: userData })
    }
    catch (error) {
        console.log(error)
        return response.status(500).send({ status: false, message: error.message })
    }

}


let favorite = async function (req, res) {
    try {
        let { addFav, removeFav } = req.body;
        let userId = req.loginUserId;
        let userDetail = await userModel.findById(userId);

        const favArr = userDetail.favorites;
        if (Object.keys(req.body).length == 0) { return res.status(200).json(favArr) }
        if (addFav) {
            for (let i = 0; i < favArr.length; i++) {

                if (favArr[i] == addFav) { return res.status(409).send({ status: false, message: "Already added" }) }
            }
            userDetail.favorites.push(addFav);
        }
        if (removeFav) {
            for (let j = 0; j < favArr.length; j++) {

                if (favArr[j] == removeFav) {
                    userDetail.favorites.splice(j, 1)
                    break;
                }
            }
        }

        let userData = await userModel.findOneAndUpdate({ _id: userId }, { $set: { ...userDetail } }, { new: true });

        return res.status(200).json(userData.favorites)

    } catch (err) {
        console.log(err)
        return res.status(500).send({ status: false, message: err.message })
    }
}


module.exports = { registerUser, logIn, getProfile, favorite }