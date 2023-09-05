import { Router } from "express";
import multer from "multer";
import authMiddleware from "./middlewares/auth.middleware.js";
import uploadConfig from "../config/upload.config.js";
import authController from "./controllers/auth.controller.js";
import userController from "./controllers/user.controller.js";
import productController from "./controllers/product.controller.js";
import orderController from "./controllers/order.controller.js";
import messController from "./controllers/mess.controller.js";
import adminController from "./controllers/admin.controller.js";
// https://expressjs.com/en/resources/middleware/multer.html
const upload = multer(uploadConfig);

const router = Router();

router.use(authMiddleware);

// Authentication
router.post("/login", authController.login);
router.get("/auth", authController.getAuth); // Lấy thông tin người dùng đang đăng nhập
router.post("/logout", authController.logout);
router.post("/register", authController.register);

// User management
router.get("/users", userController.searchUsers); //userApi.searchUsers
router.put("/users/:id", upload.single("img"), userController.updateUser); //userApi.updateUser


// Admin management
router.get("/admins", adminController.searchAdmins);
router.post("/admins", adminController.addAdmin);
router.put("/admins/:id", upload.single("img"), adminController.updateAdmin);


// Product management
router.get("/products", productController.searchProducts); //productApi.searchProducts
router.get("/products/price", productController.getPrice); //productApi.getPrice
router.get("/products/tag", productController.getTag); //productApi.getTag
router.post("/products", upload.any(), productController.addProduct); //productApi.createProduct
router.put("/products/:id", upload.any(), productController.updateProduct); //productApi.updateProduct
router.delete("/products/:id", productController.deleteProduct); //productApi.deleteProduct

// Order management
router.get("/orders", orderController.searchOrders);
router.post("/orders", orderController.addOrder);
router.get("/orders/:email", orderController.getOrderByUserEmail);
router.put("/orders/:id", orderController.updateOrder);

// Contact management
router.get("/messs", messController.searchMesss);
router.post("/messs", messController.addMess);
router.put("/messs/:id", messController.updateMess);

export default router;
