import { Router } from "express";
import userController from "./controllers/user.controller.js";

// User management
const router = Router();
router.get("/users", userController.searchUsers);
router.get("/users/new", userController.viewAddUser);
router.post("/users", userController.addUser);
router.get("/users/:id", userController.getDetailUser);
router.get("/users/:id/edit", userController.viewEditUser);
router.put("/users/:id", userController.updateUser);
router.delete("/users/:id", userController.deleteUser);

// Product management

// Order management

// Contact management

export default router;
