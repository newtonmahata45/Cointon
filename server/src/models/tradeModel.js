const mongoose = require("mongoose");
const objectId = mongoose.Schema.Types.ObjectId
const tradeSchema = new mongoose.Schema({
    userId: {
        type: objectId,
        ref: "User"
    },
    symbol:{type: String, required: true},
    buyAt: { type: Number, default: null },
    sellAt: { type: Number, default: null },
    leverage: { type: Number, default: 1 },
    quantity: { type: Number, default: 1 },
    isShorted: {type:Boolean, default: false}
}, { timestamps: true })


module.exports = mongoose.model("Trade", tradeSchema)