import { Router } from "express";
const router = Router();
import { registerUser, logIn, getProfile, favorite } from "./controller/userController.js";
import { getFund, updateFund } from "./controller/fundController.js";
import { createTrade, openTrades, updateTrade, crossUpdateTrade, closeTrade, tradeHistory } from "./controller/tradeController.js";
import { authenticate } from "./auth.js";


// ****************************** USER ***************************
router.post("/register", registerUser);   // { referId } to get refer amount
router.post("/login", logIn);
router.get("/profile", authenticate, getProfile)
router.post("/favorite", authenticate, favorite) // To get favorites => just call whith post request;
//                                                Add to favorites => { addFav } = req.body;
//                                                Remove from Favorites => { removeFav } = req.body;

// // ****************************** FUNDS ***************************

router.get("/getfund", authenticate, getFund);
router.put("/updatefund", authenticate, updateFund);   //give -ve value for withdrall


// // ****************************** TRADES ***************************
router.post("/createtrade", authenticate, createTrade);    //{ (buyAt || sellAt), leverage, quantity, symbol }
router.get("/opentrade", authenticate, openTrades);
router.put("/updatetrede", authenticate, updateTrade)       // { (buyAt || sellAt), quantity, symbol }
router.put("/crossupdatetrade", authenticate, crossUpdateTrade)  // { (buyAt || sellAt),  quantity, symbol }
router.put("/closetrade", authenticate, closeTrade);     // { priceAt, symbol }
router.get("/history", authenticate, tradeHistory);     // Query Params


export default router ;
