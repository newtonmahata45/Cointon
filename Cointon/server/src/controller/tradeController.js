const userModel = require("../models/userModel");
const tradeModel = require("../models/tradeModel");


let createTrade = async function (req, res) {
    try {
        let data = req.body;
        let { buyAt, sellAt, leverage, quantity, symbol } = data;
        let userId = req.loginUserId;

        if (!symbol) { return res.status(400).json({ status: false, message: "Symbol is mandatory" }) }
        if (!buyAt && !sellAt) { return res.status(400).json({ status: false, message: "Trade price is not set" }) }
        if (buyAt && sellAt) { return res.status(400).json({ status: false, message: "You can not buy & sell at once " }) }

        let user = await userModel.findById(userId);

        if (!leverage || leverage < 1) { leverage = 1 }
        if (!quantity || quantity <= 0) { quantity = 1 }
        data.leverage = Math.round(leverage)

        let price = buyAt || sellAt;
        let margin = (price * quantity); // Margin used in this trade;

        if (user.fund < margin) { return res.status(406).json({ status: false, message: `Insufficient Balance, add ₹ ${margin.toFixed(2) - user.fund} to execute this trade` }) }

        let findTrade = await tradeModel.findOne({ symbol: symbol, userId: userId, $or: [{ buyAt: null }, { sellAt: null }] })

        if (findTrade) {

            if (buyAt && findTrade.buyAt) { return res.status(409).json({ status: false, message: `Already ${symbol} bought. Do you want to buy more?`, nextCall:"updatetrede" })}
            if (sellAt && findTrade.sellAt) { return res.status(409).json({ status: false, message: `Already ${symbol} shorted. Do you want to sell more?`, nextCall:"updatetrede" }) }
            if (buyAt && findTrade.sellAt) { return res.status(400).json({ status: false, message: `${symbol} is shorted. Enter quantity, you want to exit`, nextCall:"crossupdatetrade" }) };
            if (sellAt && findTrade.buyAt) { return res.status(400).json({ status: false, message: `${symbol} is bought, Enter quantity, you want to exit`, nextCall:"crossupdatetrade" }) };

        };

        if( sellAt ) { data.isShorted = true }

        data.userId = userId;
        let created = await tradeModel.create(data)
        
        let taka = margin.toFixed(2);
        let tax = margin-taka;
        
        user.fund -= taka;
        
        await userModel.findByIdAndUpdate(userId, { $set: { ...user } })

        return res.status(201).json({status:true, newTrade: created, tax: tax})
    }
    catch (error) {
        console.log(error)
        return response.status(500).send({ status: false, message: error.message })
    }
}

let openTrade = async function (req, res) {
    try {
        let userId = req.loginUserId;

        let theTrades = await tradeModel.find({ userId: userId, $or: [{ buyAt: null }, { sellAt: null }] })
        if (theTrades.length == 0) { return res.status(404).json({ status: false, message: `No open trade found` }) }
        
        theTrades.reverse();
        return res.status(200).json(theTrades)

    }
    catch (error) {
        console.log(error)
        return response.status(500).send({ status: false, message: error.message })
    }
}
let tradeHistory = async function (req, res) {
    try {
        const filters = req.query;

        let userId = req.loginUserId;
        
                                    //   .find({$nor: [{buyAt: null}]})
        let history = await tradeModel.find({ userId: userId, ...filters, $nor: [{ buyAt: null }, { sellAt: null }] })
        history.reverse()
        return res.status(200).json(history)

    }
    catch (error) {
        console.log(error)
        return response.status(500).send({ status: false, message: error.message })
    }
}

let updateTrade = async function (req, res) {
    try {
        let data = req.body;
        let { buyAt, sellAt, quantity, symbol } = data;
        let userId = req.loginUserId;


        if (!symbol) { return res.status(400).json({ status: false, message: "Symbol is mandatory" }) }
        if(!buyAt && !sellAt){ return res.status(400).json({ status:false, message: "buying price & selling price both should not be empty" }) }
        let theTrade = await tradeModel.findOne({ symbol: symbol, userId: userId, $or: [{ buyAt: null }, { sellAt: null }] })
        if (!theTrade) { return res.status(404).json({ status: false, message: `No open trade found of ${symbol}` }) }

        let oldAt = theTrade.buyAt || theTrade.sellAt;

        // if (!leverage) { leverage = 1 }
        if (!quantity) { quantity = 1 }

        if (buyAt) {
            if (theTrade.sellAt) { return res.status(400).json({ status: false, message: `${symbol} is not bought` }) }

            theTrade.buyAt = ((buyAt * quantity) + (oldAt * theTrade.quantity)) / (theTrade.quantity + quantity);
        }
        else {
            if (theTrade.buyAt) { return res.status(400).json({ status: false, message: `${symbol} is not shorted` }) }

            theTrade.sellAt = ((sellAt * quantity) + (oldAt * theTrade.quantity)) / (theTrade.quantity + quantity);
        }

        // theTrade.leverage = (leverage * quantity) + (theTrade.leverage * theTrade.quantity) / (theTrade.quantity + quantity);
        theTrade.quantity += quantity;

        let user = await userModel.findById(userId)

        let price = buyAt || sellAt;
        let margin = (price * quantity)  // Margin used in this trade;

        if (user.fund < margin) { return res.status(406).json({ status: false, message: `Insufficient Balance, add ₹ ${margin.toFixed(2) - user.fund} to execute this trade` }) }

        let taka = margin.toFixed(2);
        let tax = margin-taka;
        
        user.fund -= taka;  // margin

        await userModel.findByIdAndUpdate(userId, { $set: { ...user } })

        let updatedTrade = await tradeModel.findByIdAndUpdate(theTrade._id, { $set: { ...theTrade } }, { new: true })

        return res.status(200).json({status:true,updatedTrade:updatedTrade, tax:tax})

    }
    catch (error) {
        console.log(error)
        return response.status(500).send({ status: false, message: error.message })
    }
}

let crossUpdateTrade = async function (req, res) {
    try {
        let data = req.body;
        let { buyAt, sellAt, quantity, symbol } = data;

        let userId = req.loginUserId;

        if (!symbol) { return res.status(400).json({ status: false, message: "Symbol is mandatory" }) }
        if (!quantity) { return res.status(400).json({ status: false, message: "Quantity is mandatory here" }) }
        if(!buyAt && !sellAt){ return res.status(400).json({ status:false, message: "buying price & selling price both should not be empty" })}
        if (quantity <= 0) { return res.status(400).json({ status: false, message: "Quantity should be greater then zero" }) }

        // Finding the trade
        let theTrade = await tradeModel.findOne({ symbol: symbol, userId: userId, $or: [{ buyAt: null }, { sellAt: null }] })

        if (!theTrade) { return res.status(404).json({ status: false, message: `No open trade found of ${symbol}` }) }
        if (theTrade.quantity <= quantity) { return res.status(400).json({ status: false, message: "Close the open trade, otherwise reduce Quantity" }) }

        let oldAt = theTrade.buyAt || theTrade.sellAt;

        let profit = 0;
        if (sellAt) {
            if (theTrade.sellAt) { return res.status(400).json({ status: false, message: `${symbol} is not bought` }) }

            profit = (sellAt - oldAt) * quantity * theTrade.leverage;
            theTrade.buyAt = ((oldAt * theTrade.quantity) + (sellAt * quantity)) / (theTrade.quantity + quantity);
        }
        else {
            if (theTrade.buyAt) { return res.status(400).json({ status: false, message: `${symbol} is not shorted` }) }

            profit = (oldAt - buyAt) * quantity * theTrade.leverage;

            theTrade.sellAt = ((oldAt * theTrade.quantity) + (buyAt * quantity)) / (theTrade.quantity + quantity);
        }

        theTrade.quantity -= quantity;

        // let price = buyAt || sellAt;

        let margin = (oldAt * quantity)

        // let exitAmount = (price * quantity)

        let newFund = (margin + profit).toFixed(2) 
        let tax = (margin+profit)- newFund;
        await userModel.findByIdAndUpdate(userId, { $inc: { fund: newFund } }) // margin + profit

        let updatedTrade = await tradeModel.findByIdAndUpdate(theTrade._id, { $set: { ...theTrade } }, { new: true })

        return res.status(200).json({ status: true, updatedTrade: updatedTrade, margin: margin, profit: profit, tax:tax })
    }
    catch (error) {
        console.log(error)
        return response.status(500).send({ status: false, message: error.message })
    }
}

let closeTrade = async function (req, res) {
    try {
        let data = req.body;
        let { priceAt, symbol } = data;
        let userId = req.loginUserId;

        if (!priceAt || !symbol) { return res.status(400).json({ status: false, message: `Closing priceAt & symbol are mandatory to close any trade` }) }

        let theTrade = await tradeModel.findOne({ symbol: symbol, userId: userId, $or: [{ buyAt: null }, { sellAt: null }] })
        if (!theTrade) { return res.status(404).json({ status: false, message: `No open trade found of ${symbol}` }) }

        let oldAt = theTrade.buyAt || theTrade.sellAt;

        if (!theTrade.sellAt) { theTrade.sellAt = priceAt; }
        else { theTrade.buyAt = priceAt }

        let tradeClosed = await tradeModel.findByIdAndUpdate(theTrade._id, { $set: { ...theTrade } }, { new: true });

        let margin = (oldAt * tradeClosed.quantity);

        let profit = (tradeClosed.sellAt - tradeClosed.buyAt) * tradeClosed.quantity * tradeClosed.leverage;

        let newFund = (margin + profit).toFixed(2) 
        let tax = (margin+profit)- newFund;                 // margin + profit 
        await userModel.findByIdAndUpdate(userId, { $inc: { fund: newFund } })
        return res.status(200).json({ status: true, tradeDetails: tradeClosed, profit: profit, margin: margin, tax:tax })

    }
    catch (error) {
        console.log(error)
        return response.status(500).send({ status: false, message: error.message })
    }
}



module.exports.createTrade = createTrade;
module.exports.openTrade = openTrade;
module.exports.updateTrade = updateTrade;
module.exports.crossUpdateTrade = crossUpdateTrade;
module.exports.closeTrade = closeTrade;
module.exports.tradeHistory = tradeHistory;