import moment from "moment";
import getConnection from "./../../config/connection.database.js";
import { encryptPassword } from "../../utilities/hash.util.js";
import nodemailer from "nodemailer";

const searchUsers = (params, callback) => {
    const bindParams = [];
    const connection = getConnection();

    const page = params.page || 1;
    const limit = params.limit || 10;
    const offset = (page - 1) * limit;
    const name = params.name || null;
    const checkSortType = parseInt(params.sortType);
    let sortType = null;
    if (checkSortType !== 2) {
        sortType = checkSortType;
    }
    let baseSql = " FROM users";

    let whereAdded = false;

    if (name) {
        baseSql += " WHERE (email LIKE ? OR name LIKE ? OR phone LIKE ?)";
        bindParams.push("%" + name + "%");
        bindParams.push("%" + name + "%");
        bindParams.push("%" + name + "%");
        whereAdded = true;
    }

    console.log("sortType", sortType);
    switch (sortType) {
        case 1:
            baseSql += whereAdded ? " AND " : " WHERE ";
            baseSql += "status = 1";
            whereAdded = true;
            break;
        case 0:
            baseSql += whereAdded ? " AND " : " WHERE ";
            baseSql += "status = 0";
            whereAdded = true;
            break;
    }

    const countQuery = "SELECT COUNT(*) AS total" + baseSql;

    connection.query(countQuery, bindParams, (error, countResult) => {
        if (error) {
            console.log(error);
            callback(error, null);
            return;
        }

        if (countResult[0].total === 0) {
            callback(null, {
                total: 0,
                records: [],
            });
            connection.end();
            return;
        }

        const selectColumnsQuery =
            "SELECT user_id, email, name, bday, date, status, add_address, phone, img " +
            baseSql +
            " ORDER BY user_id DESC" +
            ` LIMIT ${limit} OFFSET ${offset}`;

        connection.query(selectColumnsQuery, bindParams, (error, users) => {
            if (error) {
                callback(error, null);
                return;
            }

            callback(null, {
                total: countResult[0].total,
                records: users,
            });
            connection.end();
        });
    });
};

// const addUser = (user, callback) => {
//     const connection = getConnection();

//     const userToCreate = {
//         ...user,
//         password: encryptPassword(user.password),
//     };

//     connection.query(
//         "INSERT INTO users SET ?",
//         userToCreate,
//         (error, result) => {
//             if (error) {
//                 callback(error, null);
//             } else {
//                 callback(null, result);
//             }
//         }
//     );

//     connection.end();
// };

const getDetailUser = (id, callback) => {
    const connection = getConnection();

    connection.query(
        "SELECT user_id, email, name, bday, date, status, add_address, phone, img, JSON_EXTRACT(cart, '$[*]') AS cart FROM users WHERE user_id = ?",
        [id],
        (error, result) => {
            if (error) {
                callback(error, null);
            } else {
                for (let i = 0; i < result.length; i++) {
                    if (result[i].cart) {
                        result[i].cart = JSON.parse(result[i].cart);

                        // Chuyển đổi các thuộc tính trong cart thành số nguyên
                        for (let item of result[i].cart) {
                            if (item.comparative) {
                                item.comparative = parseInt(
                                    item.comparative,
                                    10
                                );
                            }
                            if (item.price) {
                                item.price = parseInt(item.price, 10);
                            }
                            if (item.quantity) {
                                item.quantity = parseInt(item.quantity, 10);
                            }
                        }
                    } else {
                        result[i].cart = [];
                    }
                }
                callback(null, result);
            }
        }
    );

    connection.end();
};

const getUserByUsernameAndRole = (email, callback) => {
    const connection = getConnection();
    // let table = "users";

    connection.query(
        `
      SELECT
        user_id,
        email,
        password,
        status
      FROM users
      WHERE
        email = ?
    `,
        [email],
        (error, result) => {
            if (error) {
                callback(error, null);
            } else {
                callback(null, result);
            }
        }
    );

    connection.end();
};

const getUserByApiKey = (apiKey, callback) => {
    const connection = getConnection();
    // console.log("apiKey", apiKey);
    // connection.query(
    //     `
    //   SELECT user_id, email, name, bday, date, status, add_address, phone, img, JSON_EXTRACT(cart, '$[*]') AS cart FROM users WHERE api_key = ?
    // `,
    connection.query(
        `
      SELECT user_id , email, name, bday, date, status, add_address, phone, img, JSON_EXTRACT(cart, '$[*]') AS cart FROM users WHERE api_key = ?
    `,
        [apiKey],
        (error, result) => {
            if (error) {
                callback(error, null);
            } else {
                for (let i = 0; i < result.length; i++) {
                    if (result[i].cart) {
                        result[i].cart = JSON.parse(result[i].cart);

                        // Chuyển đổi các thuộc tính trong cart thành số nguyên
                        for (let item of result[i].cart) {
                            if (item.comparative) {
                                item.comparative = parseInt(
                                    item.comparative,
                                    10
                                );
                            }
                            if (item.price) {
                                item.price = parseInt(item.price, 10);
                            }
                            if (item.quantity) {
                                item.quantity = parseInt(item.quantity, 10);
                            }
                        }
                    } else {
                        result[i].cart = [];
                    }
                }
                callback(null, result);
            }
        }
    );

    connection.end();
};

const createApiKey = (userId, apiKey, callback) => {
    const connection = getConnection();

    connection.query(
        "UPDATE users SET api_key = ? WHERE user_id = ?",
        [apiKey, userId],
        (error, result) => {
            if (error) {
                callback(error, null);
            } else {
                callback(null, apiKey);
            }
        }
    );

    connection.end();
};

const updateUser = (userId, params, callback) => {
    console.log("user repo", params);
    const connection = getConnection();
    let sql = "UPDATE users SET cart = ?";
    let bindParams = [];

    if (params.cart) {
        bindParams.push(JSON.stringify(params.cart));
    } else {
        bindParams.push("[]");
    }

    if (params.name) {
        sql += ", name = ?";
        bindParams.push(params.name);
    }

    if (params.bday) {
        sql += ", bday = ?";
        bindParams.push(params.bday);
    }

    if (params.add_address) {
        sql += ", add_address = ?";
        bindParams.push(params.add_address);
    }

    if (params.phone) {
        sql += ", phone = ?";
        bindParams.push(params.phone);
    }

    if (params.password) {
        sql += ", password = ?";
        // , api_key = NULL";
        bindParams.push(encryptPassword(params.password));
    }

    if (params.img) {
        sql += ", img = ?";
        bindParams.push(params.img);
    }
    console.log("Status", params.status);

    if (params.status >= 0) {
        sql += ", status = ?";
        bindParams.push(params.status);
    }

    sql += " WHERE user_id = ?";
    bindParams.push(userId);

    console.log("sql", sql, "bindParams", bindParams);
    connection.query(sql, bindParams, (error, result) => {
        if (error) {
            callback(error, null);
        } else {
            callback(null, result);
        }
    });

    connection.end();
};

// Tạo mã ngẫu nhiên 6 ký tự nối với thời gian hiện tại
const generateRandomCode = () => {
    const randomString = Math.random().toString(36).substr(2, 6).toUpperCase();
    const currentTime = Date.now().toString();
    return randomString + "_" + currentTime;
};

let transporter = nodemailer.createTransport({
    host: "smtp-mail.outlook.com", // hostname
    secureConnection: false, // TLS requires secureConnection to be false
    port: 587, // port for secure SMTP
    service: "Outlook365",
    auth: {
        user: "COZYhandmade2032@outlook.com",
        pass: "COZY2032handmade",
    },
    tls: {
        ciphers: "SSLv3",
    },
});

const sendEmail = (to, code) => {
    const mailOptions = {
        from: "COZYhandmade2032@outlook.com",
        to: to,
        subject: "Cozy - Mã đặt lại mật khẩu ",
        text: `Mã đặt lại mật khẩu: ${code}
        Lưu ý mã chỉ có hiệu lực trong vòng 5 phút.`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log("Email sent: " + info.response);
        }
    });
};

const getCodeResetPassUser = (email, callback) => {
    const connection = getConnection();
    let sql = "UPDATE users SET code = ?";
    let bindParams = [];

    // Tạo mã ngẫu nhiên
    const randomCode = generateRandomCode();
    bindParams.push(randomCode);

    sql += " WHERE email = ?";
    bindParams.push(email);

    console.log("sql", sql, "bindParams", bindParams);

    connection.query(sql, bindParams, (error, result) => {
        if (error) {
            callback(error, null);
        } else {
            // Kiểm tra số lượng bản ghi được cập nhật
            if (result.affectedRows > 0) {
                // Gửi mã reset qua email
                const codeToSend = randomCode.split("_")[0]; // Lấy đoạn mã phía trước dấu _
                sendEmail(email, codeToSend); // Gửi email
                callback(null, result);
            } else {
                console.log(
                    "Không có người dùng nào có email được truyền vào."
                );
                callback(
                    "Không có người dùng nào có email được truyền vào.",
                    null
                );
            }
        }
    });

    connection.end();
};

const isCodeExpired = (codeLong, code) => {
    const parts = codeLong.split("_");

    const codeTime = parseInt(parts[1], 10);
    const currentTime = Date.now();

    if (
        // currentTime - codeTime < 5 * 60 * 1000 &&
        code == parts[0]
    ) {
        return true;
    } else {
        return false;
    }
    // Kiểm tra xem thời gian có chênh lệch quá 5 phút hay không
};

const resetPass = (userInfo, callback) => {
    const { email, code, password } = userInfo;
    const connection = getConnection();

    let sql = "SELECT code FROM users WHERE email = ?";
    connection.query(sql, [email], (error, result) => {
        if (error) {
            callback(error, null);
            return;
        }

        if (result.length === 0) {
            callback("Không tìm thấy người dùng với email này.", null);
            return;
        }

        const userCodeLong = result[0].code;
        if (isCodeExpired(userCodeLong, code)) {
            sql = "UPDATE users SET password = ? WHERE email = ?";
            const hashedPassword = encryptPassword(password);

            connection.query(sql, [hashedPassword, email], (error, result) => {
                if (error) {
                    callback(error, null);
                } else {
                    if (result.affectedRows > 0) {
                        callback(null, "Mật khẩu đã được cập nhật.");
                    } else {
                        callback("Không thể cập nhật mật khẩu.", null);
                    }
                }
            });
        } else {
            callback("Mã xác thực không hợp lệ hoặc đã hết hạn.", null);
        }

        connection.end();
    });
};

// const deleteUser = (id, callback) => {
//     const connection = getConnection();

//     connection.query(
//         "DELETE FROM users WHERE user_id = ?",
//         [id],
//         (error, result) => {
//             if (error) {
//                 callback(error, null);
//             } else {
//                 callback(null, result);
//             }
//         }
//     );

//     connection.end();
// };

export default {
    searchUsers,
    getCodeResetPassUser,
    // addUser,
    getDetailUser,
    getUserByUsernameAndRole,
    getUserByApiKey,
    createApiKey,
    updateUser,
    resetPass,
    // deleteUser,
};
