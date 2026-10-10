const express = require("express");

const router = express.Router();

const {
    validateFinalMatchInput
} = require("../validators/ml.validator");

const {
    getFinalMatch
} = require("../controllers/ml.controller");

router.post(
    "/final-match",
    validateFinalMatchInput,
    getFinalMatch
);

module.exports = router;