import { Router } from "express";

import userController from "./controllers/user.controller.js";

const router = Router();

// User management
router.get("/users", userController.searchUsers);
router.post("/users", userController.addUser);
router.get("/users/:id", userController.getDetailUser);
router.put("/users/:id", userController.updateUser);
router.delete("/users/:id", userController.deleteUser);

// Product management

// Order management

// Contact management

export default router;
