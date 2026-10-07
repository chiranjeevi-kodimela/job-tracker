const express=require("express");
const authMiddleware=require("../middleware/authMiddleware");
const {
    createApplication,
    getApplications,
    getApplicationById,
    updateApplication,
    deleteApplication
} =require("../controllers/applicationController");

const router =express.Router();

router.post("/", authMiddleware, createApplication);
router.get("/", authMiddleware, getApplications);
router.get("/:id", authMiddleware, getApplicationById);
router.put("/", authMiddleware , updateApplication);
router.delete("/:id", authMiddleware, deleteApplication);
module.exports=router;