const express = require("express");
const authMiddleware = require ("../middleware/authMiddleware");
const { 
    createCompany,
    getCompanies,
    getCompniesById,
    updateCompany,
    deleteCompany 
} = require("../controllers/companyController");

const router =express.Router();

router.post("/", authMiddleware,createCompany);
router.get("/", authMiddleware, getCompanies);
router.get("/:id", authMiddleware,getCompniesById);
router.put("/:id", authMiddleware, updateCompany);
router.delete("/:id", authMiddleware, deleteCompany);

module.exports=router;
