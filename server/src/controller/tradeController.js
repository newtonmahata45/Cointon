import userModel from "../models/userModel.js";
import tradeModel from "../models/tradeModel.js";
import axios from "axios";

let createTrade = async function (req, res) {
  try {
    let data = req.body;
    let { buyAt, sellAt, leverage, quantity, symbol } = data;
    let userId = req.loginUserId;

    if (!symbol) {
      return res
        .status(400)
        .json({ status: false, message: "Symbol is mandatory" });
    }
    if (!buyAt && !sellAt) {
      return res
        .status(400)
        .json({ status: false, message: "Trade price is not set" });
    }
    if (buyAt && sellAt) {
      return res
        .status(400)
        .json({ status: false, message: "You can not buy & sell at once" });
    }

    let user = await userModel.findById(userId);

    if (!leverage || leverage < 1) leverage = 1;

    if (!quantity || quantity <= 0) quantity = 1;

    data.leverage = Math.round(leverage);

    let coin = await axios.get(
      `https://api.coingecko.com/api/v3/simple/price?ids=${symbol}&vs_currencies=inr`
    );
    console.log(coin)
    if (!coin["data"][`${symbol}`])
      return res
        .status(400)
        .send({ status: false, message: "Symbol is not vaild" });

    let price = coin["data"][`${symbol}`]["inr"];
    let margin = price * quantity / data.leverage; // Margin used in this trade;

    if (user.fund < margin) {
      return res.status(406).send({
        status: false,
        message: `Insufficient Balance, add ₹ ${margin.toFixed(2) - user.fund
          } more to execute this trade`,
      });
    }

    let findTrade = await tradeModel.findOne({
      symbol: symbol,
      userId: userId,
      $or: [{ buyAt: null }, { sellAt: null }],
    });

    if (findTrade) {
      if (buyAt && findTrade.buyAt) {
        return res.status(409).send({
          status: false,
          message: `Already ${symbol} bought. Do you want to buy more?`,
          nextCall: "updatetrede",
          data: data,
        });
      }
      if (sellAt && findTrade.sellAt) {
        return res.status(409).send({
          status: false,
          message: `Already ${symbol} shorted. Do you want to sell more?`,
          nextCall: "updatetrede",
          data: data,
        });
      }
      if (buyAt && findTrade.sellAt) {
        return res.status(400).send({
          status: false,
          message: `${symbol} is shorted. Enter quantity, you want to exit`,
          nextCall: "crossupdatetrade",
          data: data,
        });
      }
      if (sellAt && findTrade.buyAt) {
        return res.status(400).send({
          status: false,
          message: `${symbol} is bought, Do you want to exit ?`,
          nextCall: "crossupdatetrade",
          data: data,
        });
      }
    }

    sellAt ? (data.sellAt = price) : (data.buyAt = price);

    data.userId = userId;
    let created = await tradeModel.create(data);

    let taka = margin.toFixed(2);
    let tax = margin - taka;

    user.fund -= taka;

    await userModel.findByIdAndUpdate(userId, { $set: { fund: user.fund } });

    return res
      .status(201)
      .send({ status: true, message: "Success", data: created, tax: tax });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ status: false, message: error.message });
  }
};

let openTrades = async function (req, res) {
  try {
    let userId = req.loginUserId;

    let theTrades = await tradeModel.find({
      userId: userId,
      $or: [{ buyAt: null }, { sellAt: null }],
    });
    if (theTrades.length == 0) {
      return res
        .status(404)
        .send({ status: false, message: `No open trade found` });
    }

    theTrades.reverse();
    return res.status(200).send(theTrades);
  } catch (error) {
    console.log(error);
    return res.status(500).send({ status: false, message: error.message });
  }
};

let tradeHistory = async function (req, res) {
  try {
    const filters = req.query;

    let userId = req.loginUserId;
    //   .find({$nor: [{buyAt: null}]})
    let history = await tradeModel.find({
      userId: userId,
      ...filters,
      $nor: [{ buyAt: null }, { sellAt: null }],
    });
    history.reverse();
    return res.status(200).send({ status: true, data: history });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ status: false, message: error.message });
  }
};

let updateTrade = async function (req, res) {
  try {
    let data = req.body;
    let { buyAt, sellAt, quantity, symbol } = data;
    let userId = req.loginUserId;

    if (!symbol) {
      return res
        .status(400)
        .send({ status: false, message: "Symbol is mandatory" });
    }
    if (!buyAt && !sellAt) {
      return res.status(400).send({
        status: false,
        message: "buy & sell both should not be empty",
      });
    }
    let theTrade = await tradeModel.findOne({
      symbol: symbol,
      userId: userId,
      $or: [{ buyAt: null }, { sellAt: null }],
    });
    if (!theTrade) {
      return res
        .status(404)
        .send({ status: false, message: `No open trade found of ${symbol}` });
    }

    let oldAt = theTrade.buyAt || theTrade.sellAt;

    // if (!leverage) { leverage = 1 }
    if (!quantity) {
      quantity = 1;
    }
    let coin = await axios.get(
      `https://api.coingecko.com/api/v3/simple/price?ids=${symbol}&vs_currencies=inr`
    );
    if (!coin["data"][`${symbol}`])
      return res
        .status(400)
        .send({ status: false, message: "Symbol is not vaild" });

    let price = coin["data"][`${symbol}`]["inr"];

    if (buyAt) {
      buyAt = price;
      if (theTrade.sellAt) {
        return res
          .status(400)
          .send({ status: false, message: `${symbol} is not bought` });
      }

      theTrade.buyAt =
        (buyAt * quantity + oldAt * theTrade.quantity) /
        (theTrade.quantity + quantity);
    } else {
      sellAt = price;
      if (theTrade.buyAt) {
        return res
          .status(400)
          .send({ status: false, message: `${symbol} is not shorted` });
      }

      theTrade.sellAt =
        (sellAt * quantity + oldAt * theTrade.quantity) /
        (theTrade.quantity + quantity);
    }

    // theTrade.leverage = (leverage * quantity) + (theTrade.leverage * theTrade.quantity) / (theTrade.quantity + quantity);
    theTrade.quantity += quantity;

    let user = await userModel.findById(userId);

    let margin = price * quantity / theTrade.leverage; // Margin used in this trade;

    if (user.fund < margin) {
      return res.status(406).send({
        status: false,
        message: `Insufficient Balance, add ₹ ${margin.toFixed(2) - user.fund
          } more to execute this trade`,
      });
    }

    let taka = margin.toFixed(2);
    let tax = margin - taka;

    user.fund -= taka; // margin

    await userModel.findByIdAndUpdate(userId, { $set: { fund: user.fund } });

    let updatedTrade = await tradeModel.findByIdAndUpdate(
      theTrade._id,
      { $set: { ...theTrade } },
      { new: true }
    );

    return res
      .status(200)
      .send({ status: true, data: updatedTrade, tax: tax });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ status: false, message: error.message });
  }
};

let crossUpdateTrade = async function (req, res) {
  try {
    let data = req.body;
    let { buyAt, sellAt, quantity, symbol } = data;

    let userId = req.loginUserId;

    if (!symbol) {
      return res
        .status(400)
        .send({ status: false, message: "Symbol is mandatory" });
    }
    if (!quantity) {
      return res
        .status(400)
        .send({ status: false, message: "Quantity is mandatory here" });
    }
    if (!buyAt && !sellAt) {
      return res.status(400).send({
        status: false,
        message: "buy & sell both should not be empty",
      });
    }
    if (quantity <= 0) {
      return res.status(400).send({
        status: false,
        message: "Quantity should be greater then zero",
      });
    }

    // Finding the trade
    let theTrade = await tradeModel.findOne({
      symbol: symbol,
      userId: userId,
      $or: [{ buyAt: null }, { sellAt: null }],
    });

    if (!theTrade) {
      return res
        .status(404)
        .send({ status: false, message: `No open trade found of ${symbol}` });
    }
    if (theTrade.quantity <= quantity) {
      return res.status(400).send({
        status: false,
        message: "Close the open trade, otherwise reduce Quantity",
      });
    }

    let coin = await axios.get(
      `https://api.coingecko.com/api/v3/simple/price?ids=${symbol}&vs_currencies=inr`
    );
    if (!coin["data"][`${symbol}`])
      return res
        .status(400)
        .send({ status: false, message: "Symbol is not vaild" });

    let price = coin["data"][`${symbol}`]["inr"];


    let oldAt = theTrade.buyAt || theTrade.sellAt;

    let profit = 0;
    if (sellAt) {
      sellAt = price;
      if (theTrade.sellAt) {
        return res
          .status(400)
          .send({ status: false, message: `Your didn't buy ${symbol}` });
      }

      profit = (sellAt - oldAt) * quantity * theTrade.leverage;
      theTrade.buyAt =
        (oldAt * theTrade.quantity + sellAt * quantity) /
        (theTrade.quantity + quantity);
    } else {
      buyAt = price;
      if (theTrade.buyAt) {
        return res
          .status(400)
          .send({ status: false, message: `${symbol} is not shorted` });
      }

      profit = (oldAt - buyAt) * quantity * theTrade.leverage;

      theTrade.sellAt =
        (oldAt * theTrade.quantity + buyAt * quantity) /
        (theTrade.quantity + quantity);
    }

    theTrade.quantity -= quantity;

    // let price = buyAt || sellAt;

    let margin = oldAt * quantity;

    // let exitAmount = (price * quantity)

    let newFund = (margin + profit).toFixed(2);
    let tax = margin + profit - newFund;
    await userModel.findByIdAndUpdate(userId, { $inc: { fund: newFund } }); // margin + profit

    let updatedTrade = await tradeModel.findByIdAndUpdate(
      theTrade._id,
      { $set: { ...theTrade } },
      { new: true }
    );

    return res.status(200).send({
      status: true,
      data: updatedTrade,
      margin: margin,
      profit: profit,
      tax: tax,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ status: false, message: error.message });
  }
};

let closeTrade = async function (req, res) {
  try {
    let data = req.body;
    let { symbol } = data;
    let userId = req.loginUserId;

    if (!symbol) {
      return res.status(400).send({
        status: false,
        message: `Symbol is mandatory to close any trade`,
      });
    }

    let theTrade = await tradeModel.findOne({
      symbol: symbol,
      userId: userId,
      $or: [{ buyAt: null }, { sellAt: null }],
    });
    if (!theTrade) {
      return res
        .status(404)
        .send({ status: false, message: `No open trade found of ${symbol}` });
    }

    let coin = await axios.get(
      `https://api.coingecko.com/api/v3/simple/price?ids=${symbol}&vs_currencies=inr`
    );
    if (!coin["data"][`${symbol}`])
      return res
        .status(400)
        .send({ status: false, message: "Symbol is not vaild" });

    let priceAt = coin["data"][`${symbol}`]["inr"];

    let oldAt = theTrade.buyAt || theTrade.sellAt;

    if (!theTrade.sellAt) {
      theTrade.sellAt = priceAt;
    } else {
      theTrade.buyAt = priceAt;
    }

    let tradeClosed = await tradeModel.findByIdAndUpdate(
      theTrade._id,
      { $set: { ...theTrade } },
      { new: true }
    );

    let margin = oldAt * tradeClosed.quantity;

    let profit =
      (tradeClosed.sellAt - tradeClosed.buyAt) *
      tradeClosed.quantity *
      tradeClosed.leverage;

    let newFund = (margin + profit).toFixed(2);
    let tax = margin + profit - newFund; // margin + profit
    await userModel.findByIdAndUpdate(userId, { $inc: { fund: newFund } });
    return res.status(200).send({
      status: true,
      data: tradeClosed,
      profit: profit,
      margin: margin,
      tax: tax,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ status: false, message: error.message });
  }
};


export { createTrade };

export { openTrades };

export { updateTrade };

export { crossUpdateTrade };

export { closeTrade };

export { tradeHistory };
