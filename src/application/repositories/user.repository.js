import moment from "moment";
import getConnection from "./../../config/connection.database.js";
import { encryptPassword } from "../../utilities/hash.util.js";

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
    // addUser,
    getDetailUser,
    getUserByUsernameAndRole,
    getUserByApiKey,
    createApiKey,
    updateUser,
    // deleteUser,
};
