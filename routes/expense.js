const express = require("express");
const router = express.Router();

const { createExpense, getExpenses, getExpense, updateExpense, delExpense, expenseById, expensesLabel, expenseUpload } = require('../controllers/expense');
const { requireSignin, isAuth } = require("../controllers/auth");
const { setUser } = require("../controllers/user");
const { uploadFile }  = require("../controllers/upload");

router.use(requireSignin, isAuth, setUser);

router.route("/")
    .get(getExpenses)
    .post(createExpense)
    .put(expensesLabel)


router.route("/:expenseId/")
    .get(getExpense)
    .put(updateExpense)
    .delete(delExpense);

router.post("/upload", uploadFile.single("file"), expenseUpload)


router.param('expenseId', expenseById)

module.exports = router;