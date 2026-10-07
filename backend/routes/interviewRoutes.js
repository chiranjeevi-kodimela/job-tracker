const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");

const{
    createInterview,
    getInterviews,
    getInterviewById,
    updateInterview,
    deleteInterview,
} = require("../controllers/interviewController");

const router=express.Router();

router.post("/", authMiddleware,createInterview);
router.get("/", authMiddleware, getInterviews);
router.get("/:id", authMiddleware, getInterviewById);
router.put("/",authMiddleware,updateInterview);
router.delete("/:id", authMiddleware, deleteInterview);
module.exports=router;