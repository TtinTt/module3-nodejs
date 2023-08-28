import userRepository from "../repositories/user.repository.js";
import { comparePassword } from "../../utilities/hash.util.js";
import { randomString } from "../../utilities/string.util.js";
import authRepository from "../repositories/auth.repository.js";
import adminRepository from "../repositories/admin.repository.js";
const login = (params, callback) => {
    const { email, password, type } = params;
    // TODO: Validate
    if (!(email && password) && !(type == "admin" || type == "customer")) {
        callback(
            {
                code: 500,
                message: error.message,
            },
            null
        );
    }

    type == "customer" &&
        userRepository.getUserByUsernameAndRole(email, (error, result) => {
            if (error) {
                callback(
                    {
                        code: 500,
                        message: error.message,
                    },
                    null
                );
                return;
            } else if (result.length === 0) {
                callback(
                    {
                        code: 401,
                        message: "User not found",
                    },
                    null
                );
                return;
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
                    return;
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
                                return;
                            } else {
                                callback(null, {
                                    token: result,
                                });
                            }
                            return;
                        }
                    );
                }
            }
        });

    type == "admin" &&
        adminRepository.getAdminByUsernameAndRole(email, (error, result) => {
            if (error) {
                callback(
                    {
                        code: 500,
                        message: error.message,
                    },
                    null
                );
                return;
            } else if (result.length === 0) {
                callback(
                    {
                        code: 401,
                        message: "User not found",
                    },
                    null
                );
                return;
            } else {
                const admin = result[0];

                if (!comparePassword(password, admin.password)) {
                    callback(
                        {
                            code: 401,
                            message: "Sai mật khẩu",
                        },
                        null
                    );
                    return;
                } else {
                    const apiKeyAdmin = admin.admin_id + randomString(128);

                    adminRepository.createApiKey(
                        admin.admin_id,
                        apiKeyAdmin,
                        (error, result) => {
                            if (error) {
                                callback(
                                    {
                                        code: 500,
                                        message: error.message,
                                    },
                                    null
                                );
                                return;
                            } else {
                                callback(null, {
                                    token: result,
                                });
                            }
                            return;
                        }
                    );
                }
            }
        });
};

const getAuth = (userId, adminId, callback) => {
    // Nếu không có userId và adminId
    if (!userId && !adminId) {
        return callback(new Error("Không có thông tin xác thực."), null);
    }

    // Đối tượng chứa kết quả từ cả hai repository
    let verify = {};

    const processUser = (done) => {
        if (userId) {
            userRepository.getDetailUser(userId, (error, result) => {
                if (error) {
                    done(error);
                } else {
                    verify.user = result[0];
                    done();
                }
            });
        } else {
            done();
        }
    };

    const processAdmin = (done) => {
        if (adminId) {
            adminRepository.getDetailAdmin(adminId, (error, result) => {
                if (error) {
                    done(error);
                } else {
                    verify.admin = result[0];
                    done();
                }
            });
        } else {
            done();
        }
    };

    // Lần lượt thực hiện xử lý user và admin
    processUser((userError) => {
        if (userError) {
            return callback(userError, null);
        }

        processAdmin((adminError) => {
            if (adminError) {
                return callback(adminError, null);
            }

            callback(null, verify);
        });
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
    // let originalname = null;
    // let path = null;

    // if (requestBody.avatar) {
    //     originalname = requestBody.avatar.originalname;
    //     path = requestBody.avatar.path;
    // }

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

        // // Validate email
        // if (!params.email) {
        //     errors.set("email", "Email không được bỏ trống.");
        // } else if (typeof params.email !== "string") {
        //     errors.set("email", "Email phải là chuỗi.");
        // } else if (params.email.length < 4 || params.email.length > 50) {
        //     errors.set("email", "Email chỉ cho phép 4 đến 50 ký tự.");
        // }

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

        // // Validate password
        // if (typeof params.password !== "string") {
        //     errors.set("password", "Mật khẩu phải là chuỗi.");
        // } else if (params.password < 8 || params.password.length > 20) {
        //     errors.set("password", "Mật khẩu chỉ cho phép từ 8 đến 20 ký tự.");
        // }

        // // Validate password
        // if (!params.password) {
        //     errors.set("password", "Mật khẩu không được bỏ trống.");
        // } else if (typeof params.password !== "string") {
        //     errors.set("password", "Mật khẩu phải là chuỗi.");
        // } else if (params.password.length < 8 || params.password.length > 20) {
        //     errors.set("password", "Mật khẩu chỉ cho phép từ 8 đến 20 ký tự.");
        // }
        const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

        if (params.email == "" || params.password == "") {
            errors.set(
                "password and email",
                "Các thông tin không được để trống"
            );
        } else if (!regex.test(params.email)) {
            errors.set("email", "Email không hợp lệ");
        } else if (params.password.length < 6 || params.password.length > 200) {
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

        // if (typeof params.role !== "string") {
        //     errors.set("role", "Vai trò phải là chuỗi.");
        // } else if (params.role !== "1" && params.role !== "2") {
        //     errors.set("role", "Vai trò chỉ cho phép nhập 1 hoặc 2.");
        // }
        return errors;
    };

    // console.log(params);
    const errors = validate(params);
    if (errors.size > 0) {
        return callback({ errors: [...errors.values()] }, null);
    } else {
        authRepository.register(params, callback);
    }
};

export default {
    login,
    logout,
    getAuth,
    register,
};
