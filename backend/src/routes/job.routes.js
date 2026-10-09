const express = require("express");
const protect = require("../middleware/auth.middleware");
const authorizeRoles = require("../middleware/role.middleware");

const {createJob,getAllJobs,getMyJobs,getJobById,updateJob,deleteJob,updateJobStatus} = require("../controllers/job.controller");

const router = express.Router();

router.get("/",getAllJobs);
router.get("/:jobId",getJobById);

router.post("/",protect,authorizeRoles("recruiter"),createJob);
router.put("/:jobId",protect,authorizeRoles("recruiter"),updateJob);
router.get("/my",protect,authorizeRoles("recruiter"),getMyJobs);
router.delete("/:jobId",protect,authorizeRoles("recruiter"),deleteJob);
router.patch("/:jobId/status",protect,authorizeRoles("recruiter"),updateJobStatus); 


module.exports = router;