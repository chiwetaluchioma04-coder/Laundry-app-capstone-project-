const { randomUUID } = require("crypto");
const User = require("../models/User");
const Wallet = require("../models/Wallet");
const Withdrawal = require("../models/Withdrawal");
const { MIN_WITHDRAWAL_AMOUNT } = require("../utils/constants");
const { success, error } = require("../utils/apiResponse");

const getBalance = async (req, res, next) => {
  try {
    const wallet = await Wallet.findOne({ vendor: req.user.id });
    return success(res, { balance: wallet?.balance || 0, minimumWithdrawal: MIN_WITHDRAWAL_AMOUNT });
  } catch (err) {
    return next(err);
  }
};

const withdraw = async (req, res, next) => {
  const amount = req.body.amount;
  if (!Number.isSafeInteger(amount) || amount < MIN_WITHDRAWAL_AMOUNT) {
    return error(res, `Withdrawal amount must be at least ${MIN_WITHDRAWAL_AMOUNT}`, 400);
  }

  try {
    const vendor = await User.findOne({ _id: req.user.id, role: "vendor" });
    if (!vendor?.bankName || !vendor.accountNumber || !vendor.accountName) {
      return error(res, "Save complete bank details before withdrawing", 400);
    }

    const wallet = await Wallet.findOneAndUpdate(
      { vendor: req.user.id, balance: { $gte: amount } },
      { $inc: { balance: -amount } },
      { returnDocument: "after" }
    );
    if (!wallet) return error(res, "Insufficient balance", 400);

    let withdrawal;
    try {
      withdrawal = await Withdrawal.create({
        vendor: req.user.id,
        amount,
        bankDetails: {
          bankName: vendor.bankName,
          accountNumber: vendor.accountNumber,
          accountName: vendor.accountName,
        },
        reference: randomUUID(),
        status: "processing",
      });
    } catch (createError) {
      await Wallet.updateOne({ vendor: req.user.id }, { $inc: { balance: amount } });
      throw createError;
    }

    return success(res, { withdrawal, balance: wallet.balance }, "Withdrawal request submitted for manual payout", 201);
  } catch (err) {
    return next(err);
  }
};

const listWithdrawals = async (req, res, next) => {
  try {
    const withdrawals = await Withdrawal.find({ vendor: req.user.id }).sort({ createdAt: -1 });
    return success(res, { withdrawals });
  } catch (err) {
    return next(err);
  }
};

module.exports = { getBalance, listWithdrawals, withdraw };