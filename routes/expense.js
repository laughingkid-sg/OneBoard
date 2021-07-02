const express = require("express");
const router = express.Router();

const { createExpense, createExpenses, getExpense, updateExpense, delExpense, expenseById } = require('../controllers/expense');
const { requireSignin, isAuth } = require("../controllers/auth");
const { setUser } = require("../controllers/user");

router.use(requireSignin, isAuth, setUser);

router.route("/")
    .get(createExpenses)
    .post(createExpense)

router.route("/:expenseId/")
    .get(getExpense)
    .put(updateExpense)
    .delete(delExpense);


router.param('expenseId', expenseById)

module.exports = router;