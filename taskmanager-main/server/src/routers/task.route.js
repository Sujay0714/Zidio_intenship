import express from "express";
import {
  createSubTask,
  createTask,
  dashboardStatistics,
  deleteRestoreTask,
  duplicateTask,
  getTask,
  getTasks,
  postTaskActivity,
  trashTask,
  updateTask,
} from "../controllers/task.controller.js";
import { isAdminRoute, protectRoute } from "../middleware/authMiddleware.js";

const taskRouter = express.Router();

taskRouter.post("/create", protectRoute, isAdminRoute, createTask);
taskRouter.post("/duplicate/:id", protectRoute, isAdminRoute, duplicateTask);
taskRouter.post("/activity/:id", protectRoute, postTaskActivity);

taskRouter.get("/dashboard", protectRoute, dashboardStatistics);
taskRouter.get("/", protectRoute, getTasks);
taskRouter.get("/:id", protectRoute, getTask);

taskRouter.put("/create-subtask/:id", protectRoute, isAdminRoute, createSubTask);
taskRouter.put("/update/:id", protectRoute, isAdminRoute, updateTask);
taskRouter.put("/:id", protectRoute, isAdminRoute, trashTask);

taskRouter.delete(
  "/delete-restore/:id?",
  protectRoute,
  isAdminRoute,
  deleteRestoreTask
);

export default taskRouter;
