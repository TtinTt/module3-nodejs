import { Router } from "express";
import todoController from "./controllers/todo.controller.js";

// Todo management
const router = Router();
router.get("/todos", todoController.searchTodos);
router.get("/todos/new", todoController.viewAddTodo);
router.post("/todos", todoController.addTodo);
router.get("/todos/:id", todoController.getDetailTodo);
router.get("/todos/:id/edit", todoController.viewEditTodo);
router.put("/todos/:id", todoController.updateTodo);
router.delete("/todos/:id", todoController.deleteTodo);
router.put("/todos/:id/complete", todoController.completeTodo);

// Product management

// Order management

// Contact management

export default router;
