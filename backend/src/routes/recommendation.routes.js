const express = require("express");
const router = express.Router();

const {
    validateRecommendationInput
} = require("../validators/recommendation.validator");

const {
    getRecommendation
} = require("../controllers/recommendation.controller");

router.post(
    "/",
    validateRecommendationInput,
    getRecommendation
);

module.exports = router;