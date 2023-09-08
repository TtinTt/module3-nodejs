import userRepository from "./../repositories/user.repository.js";
import fs from "fs";
import { getFileExtension } from "../../utilities/upload.util.js";

const searchUsers = (params, callback) => {
    if (params.limit && !/^[0-9]+$/.test(params.limit)) {
        callback({ message: "Limit phải là số" }, null);
    } else if (params.page && !/^[0-9]+$/.test(params.page)) {
        callback({ message: "Page phải là số" }, null);
    } else if (params.name && typeof params.name !== "string") {
        callback({ message: "Name phải là chuỗi" }, null);
    } else if (
        params.sortType &&
        params.sortType !== "0" &&
        params.sortType !== "1" &&
        params.sortType !== "2"
    ) {
        callback({ message: "Kiểu sắp xếp không hợp lệ" }, null);
    } else {
        userRepository.searchUsers(params, (error, result) => {
            if (error) {
                callback(error, null);
            } else {
                callback(null, result);
            }
        });
    }
};

const updateUser = (userId, requestBody, callback) => {
    console.log(requestBody);
    let originalname = null;
    let path = null;

    if (requestBody.avatar) {
        originalname = requestBody.avatar.originalname;
        path = requestBody.avatar.path;
    }

    const validate = (params) => {
        let errors = new Map();

        // Validate cart
        // if (
        //     params.cart &&
        //     !params.cart == [] &&
        //     !isArrayContainingObjects(params.cart)
        // ) {
        //     errors.set("cart", "Giỏ hàng không hợp lệ.");
        // }

        // Validate name
        if (params.hasOwnProperty("name") && typeof params.name !== "string") {
            errors.set("name", "Tên phải là chuỗi.");
        } else if (params.first_name && params.first_name.length > 50) {
            errors.set("name", "Tên chỉ cho phép dưới 50 ký tự.");
        }

        // Validate password
        if (
            params.hasOwnProperty("password") &&
            !(params.password.length >= 6 && params.password.length <= 200)
        ) {
            errors.set("password", "Mật khẩu cần có độ dài 6 tới 200 ký tự");
        } else if (
            params.hasOwnProperty("password") &&
            !(
                params.password.match(/[a-z]/) &&
                params.password.match(/[A-Z]/) &&
                params.password.match(/\d/)
            )
        ) {
            errors.set(
                "password",
                "Mật khẩu cần bao gồm ký tự IN HOA, chữ thường và chữ số"
            );
        }

        // Validate resetpassword
        if (
            params.hasOwnProperty("resetPassword") &&
            !(
                params.resetPassword.length >= 6 &&
                params.resetPassword.length <= 200
            )
        ) {
            errors.set("password", "Mật khẩu cần có độ dài 6 tới 200 ký tự");
        }
        // else if (
        //     !(
        //         params.hasOwnProperty("resetPassword") &&
        //         params.resetPassword.match(/[a-z]/) &&
        //         params.resetPassword.match(/[A-Z]/) &&
        //         params.resetPassword.match(/\d/)
        //     )
        // ) {
        //     errors.set(
        //         "password",
        //         "Mật khẩu cần bao gồm ký tự IN HOA, chữ thường và chữ số"
        //     );
        // }

        return errors;
    };

    const validateErrors = validate(requestBody);

    if (validateErrors.size !== 0) {
        callback(Object.fromEntries(validateErrors), null);
        // return;
    } else {
        let avatar = null;

        if (requestBody.avatar) {
            const avatarExtension = getFileExtension(originalname);
            avatar = `avatar/${userId}.${avatarExtension}`;
            const avatarLocation = `./public/${avatar}`;

            // Copy upload file to saving location
            fs.cpSync(path, avatarLocation);
        }

        const updateUser = {
            name: requestBody.name,
            bday: requestBody.bday,
            password: requestBody.resetPassword
                ? requestBody.resetPassword
                : requestBody.password,
            add_address: requestBody.add_address,
            phone: requestBody.phone,
            img: avatar,
            cart: requestBody.cart,
            status: requestBody.status, //TODO check quyền admin
        };

        userRepository.updateUser(userId, updateUser, (error, result) => {
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

const getCodeResetPassUser = (email, callback) => {
    console.log(email);
    let originalname = null;
    let path = null;

    const validate = (params) => {
        let errors = new Map();
        const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        // Validate name
        if (params == "") {
            errors.set("email", "Email không thể để trống.");
        } else if (!regex.test(params)) {
            errors.set("email", "Email không hợp lệ.");
        }

        return errors;
    };

    const validateErrors = validate(email);

    if (validateErrors.size !== 0) {
        callback(Object.fromEntries(validateErrors), null);
        // return;
    } else {
        userRepository.getCodeResetPassUser(email, (error, result) => {
            if (error) {
                callback(error, null);
            } else {
                callback(null, result);
            }
        });
    }
};

const resetPass = (requestBody, callback) => {
    console.log("requestBody 999", requestBody);

    const validate = (params) => {
        let errors = new Map();
        const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        // Validate name
        if (params.email == "") {
            errors.set("email", "Email không thể để trống.");
        } else if (!regex.test(params.email)) {
            errors.set("email", "Email không hợp lệ.");
        }

        if (params?.code.length != 6) {
            errors.set("code", "Code không hợp lệ.");
        }

        if (!(params.password.length >= 6 && params.password.length <= 200)) {
            errors.set("password", "Mật khẩu cần có độ dài 6 tới 200 ký tự");
        } else if (
            !(
                params.password.match(/[a-z]/) &&
                params.password.match(/[A-Z]/) &&
                params.password.match(/\d/)
            )
        ) {
            errors.set(
                "password",
                "Mật khẩu cần bao gồm ký tự IN HOA, chữ thường và chữ số"
            );
        }
        return errors;
    };

    const validateErrors = validate(requestBody);

    if (validateErrors.size !== 0) {
        callback(Object.fromEntries(validateErrors), null);
        // return;
    } else {
        userRepository.resetPass(
            {
                email: requestBody.email,
                code: requestBody.code,
                password: requestBody.password,
            },
            (error, result) => {
                if (error) {
                    callback(error, null);
                } else {
                    callback(null, result);
                }
            }
        );
    }
};

// const deleteUser = (id, callback) => {
//     if (!/^[0-9]+$/.test(id)) {
//         callback({ message: "ID phải là số" }, null);
//     } else {
//         userRepository.deleteUser(id, (error, result) => {
//             if (error) {
//                 callback(error, null);
//             } else if (result.affectedRows === 0) {
//                 callback({ message: "User not found" }, null);
//             } else {
//                 callback(null, result);
//             }
//         });
//     }
// };

export default {
    searchUsers,
    getCodeResetPassUser,
    updateUser,
    resetPass,
    // addUser,
    // getDetailUser,
    // deleteUser,
};
