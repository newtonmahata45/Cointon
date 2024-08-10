import userModel from "../models/userModel.js";


let getFund = async function (request, response) {
    try {
        let userId = request.loginUserId;
        let userData = await userModel.findById(userId);
        return response.status(200).json( userData.fund )     
    }
    catch (error) {
        console.log(error)
        return response.status(500).send({ status: false, message: error.message })
    }
}


let updateFund = async function (req, res) {
    try {

        let userId = req.loginUserId;
        
        let { addFund } = req.body;

        let updateFund = await userModel.findByIdAndUpdate( userId , { $inc: { fund:addFund } }, { new: true })

        return res.status(200).send({status:true, message:"success", fund:updateFund.fund} )
    } catch (err) {
        console.log(err)
        return res.status(500).send({ status: false, message: err.message })
    }
}


export { getFund, updateFund }
