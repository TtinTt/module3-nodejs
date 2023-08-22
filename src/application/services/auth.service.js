import userRepository from "../repositories/user.repository.js";
import { comparePassword } from "../../utilities/hash.util.js";
import { randomString } from "../../utilities/string.util.js";

const login = (params, callback) => {
    const { username, password, type } = params;
    // TODO: Validate

    let role = null;
    if (type === "admin") {
        role = 1;
    } else if (type === "customer") {
        role = 2;
    }

    userRepository.getUserByUsernameAndRole(username, role, (error, result) => {
        if (error) {
            callback(
                {
                    code: 500,
                    message: error.message,
                },
                null
            );
        } else if (result.length === 0) {
            callback(
                {
                    code: 401,
                    message: "User not found",
                },
                null
            );
        } else {
            const user = result[0];

            if (!comparePassword(password, user.password)) {
                callback(
                    {
                        code: 401,
                        message: "Sai mật khẩu",
                    },
                    null
                );
            } else {
                const apiKey = user.user_id + randomString(128);

                userRepository.createApiKey(
                    user.user_id,
                    apiKey,
                    (error, result) => {
                        if (error) {
                            callback(
                                {
                                    code: 500,
                                    message: error.message,
                                },
                                null
                            );
                        } else {
                            callback(null, {
                                token: result,
                            });
                        }
                    }
                );
            }
        }
    });
};

const getAuth = (authId, callback) => {
    userRepository.getDetailUser(authId, (error, result) => {
        if (error) {
            callback(error, null);
        } else {
            callback(null, result[0]);
        }
    });
};

const logout = (authId, callback) => {
    userRepository.createApiKey(authId, null, (error, result) => {
        if (error) {
            callback(
                {
                    code: 500,
                    message: error.message,
                },
                null
            );
        } else {
            callback(null, {});
        }
    });
};

const register = (params, callback) => {
    let originalname = null;
    let path = null;

    if (requestBody.avatar) {
        originalname = requestBody.avatar.originalname;
        path = requestBody.avatar.path;
    }

    const validate = (params) => {
        let errors = new Map();

        // // Validate username
        // if (!params.username) {
        //     errors.set('username', 'Tên đăng nhập không được bỏ trống.');
        // } else if (typeof params.username !== 'string') {
        //     errors.set('username', 'Tên đăng nhập phải là chuỗi.');
        // } else if (params.username.length < 4 || params.username.length > 10) {
        //     errors.set('username', 'Tên đăng nhập chỉ cho phép 4 đến 10 ký tự.');
        // }

        // Validate email
        if (!params.email) {
            errors.set("email", "Email không được bỏ trống.");
        } else if (typeof params.email !== "string") {
            errors.set("email", "Email phải là chuỗi.");
        } else if (params.email.length < 4 || params.email.length > 50) {
            errors.set("email", "Email chỉ cho phép 4 đến 50 ký tự.");
        }

        // // Validate first name
        // if (typeof params.first_name !== 'string') {
        //     errors.set('first_name', 'Họ phải là chuỗi.');
        // } else if (params.first_name && params.first_name.length > 50) {
        //     errors.set('first_name', 'Họ chỉ cho phép dưới 50 ký tự.');
        // }

        // // Validate last name
        // if (typeof params.last_name !== 'string') {
        //     errors.set('last_name', 'Tên phải là chuỗi.');
        // } else if (params.first_name && params.first_name.length > 50) {
        //     errors.set('last_name', 'Tên chỉ cho phép dưới 50 ký tự.');
        // }

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

        // if (typeof params.role !== "string") {
        //     errors.set("role", "Vai trò phải là chuỗi.");
        // } else if (params.role !== "1" && params.role !== "2") {
        //     errors.set("role", "Vai trò chỉ cho phép nhập 1 hoặc 2.");
        // }
        return errors;
    };
};

export default {
    login,
    logout,
    getAuth,
    register,
};
