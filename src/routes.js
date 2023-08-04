import { Router } from "express";
import userController from "./controllers/user.controller.js";
import productController from "./controllers/product.controller.js";
import orderController from "./controllers/order.controller.js";
import contactController from "./controllers/contact.controller.js";

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
// router.get("/products", productController.searchproducts);
// router.get("/products/new", productController.viewAddproduct);
// router.post("/products", productController.addproduct);
// router.get("/products/:id", productController.getDetailproduct);
// router.get("/products/:id/edit", productController.viewEditproduct);
// router.put("/products/:id", productController.updateproduct);
// router.delete("/products/:id", productController.deleteproduct);
// Order management
// router.get("/orders", orderController.searchorders);
// router.get("/orders/new", orderController.viewAddorder);
// router.post("/orders", orderController.addorder);
// router.get("/orders/:id", orderController.getDetailorder);
// router.get("/orders/:id/edit", orderController.viewEditorder);
// router.put("/orders/:id", orderController.updateorder);
// router.delete("/orders/:id", orderController.deleteorder);
// Contact management
// router.get("/contacts", contactController.searchcontacts);
// router.get("/contacts/new", contactController.viewAddcontact);
// router.post("/contacts", contactController.addcontact);
// router.get("/contacts/:id", contactController.getDetailcontact);
// router.get("/contacts/:id/edit", contactController.viewEditcontact);
// router.put("/contacts/:id", contactController.updatecontact);
// router.delete("/contacts/:id", contactController.deletecontact);
export default router;
