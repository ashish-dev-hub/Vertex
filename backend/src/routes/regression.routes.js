const express = require("express");
const router = express.Router();

const {
    validateRegressionInput
} = require("../validators/regression.validator");

const {
    getRegression
} = require("../controllers/regression.controller");

router.post(
    "/",
    validateRegressionInput,
    getRegression
);

module.exports = router;