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
                console.log("user là", user);

                if (!comparePassword(password, user.password)) {
                    callback(
                        {
                            code: 401,
                            message: "Sai mật khẩu",
                        },
                        null
                    );
                    return;
                } else if (Number(user.status) == 0) {
                    callback(
                        {
                            code: 406,
                            message: "Tài khoản bị vô hiệu hóa",
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
                } else if (Number(admin.status) == 0) {
                    callback(
                        {
                            code: 406,
                            message: "Tài khoản bị vô hiệu hóa",
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

        const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

        if (params.email == "" || params.password == "") {
            errors.set(
                "password and email",
                "Các thông tin không được để trống"
            );
        } else if (!regex.test(params.email)) {
            errors.set("email", "Email không hợp lệ");
        } else if (
            !(params.password.length >= 6 && params.password.length <= 200)
        ) {
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
