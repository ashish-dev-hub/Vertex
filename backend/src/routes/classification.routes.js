const express = require("express");
const router = express.Router();

const {
    validateClassificationInput
} = require("../validators/classification.validator");

const {
    getClassification
} = require("../controllers/classification.controller");

router.post(
    "/",
    validateClassificationInput,
    getClassification
);

module.exports = router;