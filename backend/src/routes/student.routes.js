const express = require("express");

const protect = require("../middleware/auth.middleware");
const authorizeRoles = require("../middleware/role.middleware");

const {createStudentProfile,getStudentProfile,updateStudentProfile} = require("../controllers/student.controller");

const router = express.Router();

router.post("/profile",protect,authorizeRoles("student"),createStudentProfile);
router.get("/profile",protect,authorizeRoles("student"),getStudentProfile)
router.put("/profile",protect,authorizeRoles("student"),updateStudentProfile)

module.exports = router;