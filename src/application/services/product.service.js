import productRepository from "../repositories/product.repository.js";
import fs from "fs";
import { getFileExtension } from "../../utilities/upload.util.js";

const searchProducts = (params, callback) => {
    if (params.limit && !/^[0-9]+$/.test(params.limit)) {
        callback({ message: "Limit phải là số" }, null);
    } else if (params.page && !/^[0-9]+$/.test(params.page)) {
        callback({ message: "Page phải là số" }, null);
    } else if (
        params.maxPrice &&
        (!/^[0-9]+$/.test(params.maxPrice) || params.maxPrice == null)
    ) {
        callback({ message: "Limit phải là số" }, null);
    } else if (
        params.sortType &&
        !(params.sortType == 0 || params.sortType == 1 || params.sortType == 2)
    ) {
        callback({ message: "Kiểu sắp xếp không hợp lệ" }, null);
    } else if (params.category && params.category.length > 100) {
        callback({ message: "Danh mục không hợp lệ" }, null);
    } else {
        productRepository.searchProducts(params, (error, result) => {
            if (error) {
                callback(error, null);
            } else {
                callback(null, result);
            }
        });
    }
};

const getPrice = (callback) => {
    productRepository.getPrice((error, result) => {
        if (error) {
            callback(error, null);
        } else {
            callback(null, result);
        }
    });
};

const addProduct = (requestBody, callback) => {
    let originalname = null;
    let path = null;

    if (requestBody.avatar) {
        originalname = requestBody.avatar.originalname;
        path = requestBody.avatar.path;
    }

    const validate = (params) => {
        let errors = new Map();

        // Validate productname
        if (!params.productname) {
            errors.set("productname", "Tên đăng nhập không được bỏ trống.");
        } else if (typeof params.productname !== "string") {
            errors.set("productname", "Tên đăng nhập phải là chuỗi.");
        } else if (
            params.productname.length < 4 ||
            params.productname.length > 10
        ) {
            errors.set(
                "productname",
                "Tên đăng nhập chỉ cho phép 4 đến 10 ký tự."
            );
        }

        // Validate email
        if (!params.email) {
            errors.set("email", "Email không được bỏ trống.");
        } else if (typeof params.email !== "string") {
            errors.set("email", "Email phải là chuỗi.");
        } else if (params.email.length < 4 || params.email.length > 50) {
            errors.set("email", "Email chỉ cho phép 4 đến 50 ký tự.");
        }

        // Validate first name
        if (typeof params.first_name !== "string") {
            errors.set("first_name", "Họ phải là chuỗi.");
        } else if (params.first_name && params.first_name.length > 50) {
            errors.set("first_name", "Họ chỉ cho phép dưới 50 ký tự.");
        }

        // Validate last name
        if (typeof params.last_name !== "string") {
            errors.set("last_name", "Tên phải là chuỗi.");
        } else if (params.first_name && params.first_name.length > 50) {
            errors.set("last_name", "Tên chỉ cho phép dưới 50 ký tự.");
        }

        // Validate password
        if (typeof params.password !== "string") {
            errors.set("password", "Mật khẩu phải là chuỗi.");
        } else if (params.password < 8 || params.password.length > 20) {
            errors.set("password", "Mật khẩu chỉ cho phép từ 8 đến 20 ký tự.");
        }

        // Validate password
        if (!params.password) {
            errors.set("password", "Mật khẩu không được bỏ trống.");
        } else if (typeof params.password !== "string") {
            errors.set("password", "Mật khẩu phải là chuỗi.");
        } else if (params.password < 8 || params.password.length > 20) {
            errors.set("password", "Mật khẩu chỉ cho phép từ 8 đến 20 ký tự.");
        }

        if (typeof params.role !== "string") {
            errors.set("role", "Vai trò phải là chuỗi.");
        } else if (params.role !== "1" && params.role !== "2") {
            errors.set("role", "Vai trò chỉ cho phép nhập 1 hoặc 2.");
        }

        return errors;
    };

    const validateErrors = validate(requestBody);

    if (validateErrors.size !== 0) {
        callback(Object.fromEntries(validateErrors), null);
    } else {
        let avatar = null;

        if (requestBody.avatar) {
            const avatarExtension = getFileExtension(originalname);
            avatar = `avatar/${requestBody.productname}.${avatarExtension}`;
            const avatarLocation = `./public/${avatar}`;

            // Copy upload file to saving location
            fs.cpSync(path, avatarLocation);
        }

        const newProduct = {
            productname: requestBody.productname,
            email: requestBody.email,
            first_name: requestBody.first_name,
            last_name: requestBody.last_name,
            password: requestBody.password,
            role: requestBody.role,
            avatar: avatar,
            created_by_id: requestBody.authId,
            updated_by_id: requestBody.authId,
        };

        productRepository.addProduct(newProduct, (error, result) => {
            if (path) {
                fs.rmSync(path);
            }
            if (error) {
                callback(error, null);
            } else {
                callback(null, result);
            }
        });
    }
};

const getDetailProduct = (id, callback) => {
    if (!/^[0-9]+$/.test(id)) {
        callback({ message: "ID phải là số" }, null);
    } else {
        productRepository.getDetailProduct(id, (error, result) => {
            if (error) {
                callback(error, null);
            } else if (result.length === 0) {
                callback({ message: "Product not found" }, null);
            } else {
                callback(null, result[0]);
            }
        });
    }
};

const updateProduct = (productId, requestBody, callback) => {
    let originalname = null;
    let path = null;

    if (requestBody.avatar) {
        originalname = requestBody.avatar.originalname;
        path = requestBody.avatar.path;
    }

    const validate = (params) => {
        let errors = new Map();

        // Validate first name
        if (typeof params.first_name !== "string") {
            errors.set("first_name", "Họ phải là chuỗi.");
        } else if (params.first_name && params.first_name.length > 50) {
            errors.set("first_name", "Họ chỉ cho phép dưới 50 ký tự.");
        }

        // Validate last name
        if (typeof params.last_name !== "string") {
            errors.set("last_name", "Tên phải là chuỗi.");
        } else if (params.first_name && params.first_name.length > 50) {
            errors.set("last_name", "Tên chỉ cho phép dưới 50 ký tự.");
        }

        // Validate password
        if (params.password) {
            if (typeof params.password !== "string") {
                errors.set("password", "Mật khẩu phải là chuỗi.");
            } else if (params.password < 8 || params.password.length > 20) {
                errors.set(
                    "password",
                    "Mật khẩu chỉ cho phép từ 8 đến 20 ký tự."
                );
            }
        }

        if (typeof params.role !== "string") {
            errors.set("role", "Vai trò phải là chuỗi.");
        } else if (params.role !== "1" && params.role !== "2") {
            errors.set("role", "Vai trò chỉ cho phép nhập 1 hoặc 2.");
        }

        return errors;
    };

    const validateErrors = validate(requestBody);

    if (validateErrors.size !== 0) {
        callback(Object.fromEntries(validateErrors), null);
    } else {
        let avatar = null;

        if (requestBody.avatar) {
            const avatarExtension = getFileExtension(originalname);
            avatar = `avatar/${requestBody.productname}.${avatarExtension}`;
            const avatarLocation = `./public/${avatar}`;

            // Copy upload file to saving location
            fs.cpSync(path, avatarLocation);
        }

        const updateProduct = {
            productname: requestBody.productname,
            email: requestBody.email,
            first_name: requestBody.first_name,
            last_name: requestBody.last_name,
            password: requestBody.password,
            role: requestBody.role,
            avatar: avatar,
            updated_by_id: requestBody.authId,
        };

        productRepository.updateProduct(
            productId,
            updateProduct,
            (error, result) => {
                if (path) {
                    fs.rmSync(path);
                }
                if (error) {
                    callback(error, null);
                } else {
                    callback(null, result);
                }
            }
        );
    }
};

const deleteProduct = (id, callback) => {
    if (!/^[0-9]+$/.test(id)) {
        callback({ message: "ID phải là số" }, null);
    } else {
        productRepository.deleteProduct(id, (error, result) => {
            if (error) {
                callback(error, null);
            } else if (result.affectedRows === 0) {
                callback({ message: "Product not found" }, null);
            } else {
                callback(null, result);
            }
        });
    }
};

export default {
    getPrice,
    searchProducts,
    addProduct,
    getDetailProduct,
    updateProduct,
    deleteProduct,
};
