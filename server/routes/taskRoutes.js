const express = require("express");
const { createTask, updateTask, deleteTask } = require("../controllers/taskController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);

router.post("/project/:projectId", createTask);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);

module.exports = router;

