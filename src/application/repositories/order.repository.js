import moment from "moment";
import getConnection from "../../config/connection.database.js";
import { encryptPassword } from "../../utilities/hash.util.js";

// const searchOrders = (params, callback) => {
//     const connection = getConnection();

//     let sql = " FROM orders";
//     const bindParams = [];

//     const page = params.page || 1;
//     const limit = params.limit || 5;

//     const offset = (page - 1) * limit;

//     if (params.name) {
//         const name = "%" + params.name + "%";
//         sql += " WHERE ordername LIKE ?";
//         bindParams.push(name);
//     }

//     const countQuery = "SELECT COUNT(1) AS total" + sql;

//     connection.query(countQuery, bindParams, (error, countResult) => {
//         if (error) {
//             callback(error, null);
//         } else if (countResult[0].total !== 0) {
//             const selectColumnsQuery =
//                 "SELECT order_id, ordername, email, first_name, last_name, role, avatar, created_at, created_by_id, updated_at, updated_by_id" +
//                 sql +
//                 ` LIMIT ${limit} OFFSET ${offset}`;
//             connection.query(
//                 selectColumnsQuery,
//                 bindParams,
//                 (error, result) => {
//                     if (error) {
//                         callback(error, null);
//                     } else {
//                         callback(null, {
//                             total: countResult[0].total,
//                             records: result,
//                         });
//                     }
//                 }
//             );
//             connection.end();
//         } else {
//             callback(null, {
//                 total: 0,
//                 records: [],
//             });
//             connection.end();
//         }
//     });
// };

const addOrder = (order, callback) => {
    const connection = getConnection();
    const { email, cart, address, date, status } = order;

    // const orderToCreate = {
    //     ...order,
    //     password: encryptPassword(order.password),
    //     // created_at: moment().format('YYYY-MM-DD HH:mm:ss'),
    //     // updated_at: moment().format('YYYY-MM-DD HH:mm:ss'),
    // };

    // connection.query(
    //     "INSERT INTO orders SET ?",
    //     orderToCreate,
    //     (error, result) => {
    //         if (error) {
    //             callback(error, null);
    //         } else {
    //             callback(null, result);
    //         }
    //     }
    // );
    connection.query(
        "INSERT INTO orders (email, cart_json, address_json, date, status) VALUES (?, ?, ?, ?, ?)",
        [email, JSON.stringify(cart), JSON.stringify(address), date, status],
        (error, result) => {
            if (error) {
                callback(error, null);
            } else {
                callback(null, result);
                console.log("Order inserted with ID:", result.id);
            }
        }
    );
    connection.end();
};

const getOrderByUserEmail = (email, callback) => {
    const connection = getConnection();
    // let table = "orders";

    connection.query(
        "SELECT id, email, JSON_UNQUOTE(JSON_EXTRACT(cart_json, '$')) AS cart, JSON_UNQUOTE(JSON_EXTRACT(address_json, '$')) AS address, date, status FROM orders WHERE email = ?",
        [email],

        (error, result) => {
            if (error) {
                callback(error, null);
            } else {
                result.forEach((order) => {
                    order.cart = JSON.parse(order.cart);
                    order.address = JSON.parse(order.address);
                    order.status = Number(order.status); // Chuyển đổi status từ chuỗi sang số
                });
                const normalizedResult = JSON.parse(JSON.stringify(result));
                console.log("normalizedResult", normalizedResult);
                callback(null, normalizedResult);
            }
        }
    );

    connection.end();
};

// const getDetailOrder = (id, callback) => {
//     const connection = getConnection();

//     connection.query(
//         "SELECT order_id, email, name, bday, date, status, add_address, phone, img, JSON_EXTRACT(cart, '$[*]') AS cart FROM orders WHERE order_id = ?",
//         [id],
//         (error, result) => {
//             if (error) {
//                 callback(error, null);
//             } else {
//                 for (let i = 0; i < result.length; i++) {
//                     if (result[i].cart) {
//                         result[i].cart = JSON.parse(result[i].cart);

//                         // Chuyển đổi các thuộc tính trong cart thành số nguyên
//                         for (let item of result[i].cart) {
//                             if (item.comparative) {
//                                 item.comparative = parseInt(
//                                     item.comparative,
//                                     10
//                                 );
//                             }
//                             if (item.price) {
//                                 item.price = parseInt(item.price, 10);
//                             }
//                             if (item.quantity) {
//                                 item.quantity = parseInt(item.quantity, 10);
//                             }
//                         }
//                     } else {
//                         result[i].cart = [];
//                     }
//                 }
//                 callback(null, result);
//             }
//         }
//     );

//     connection.end();
// };

// const getOrderByOrdernameAndRole = (email, callback) => {
//     const connection = getConnection();
//     // let table = "orders";

//     connection.query(
//         `
//       SELECT
//         order_id,
//         email,
//         password
//       FROM orders
//       WHERE
//         email = ?
//     `,
//         [email],
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

// const getOrderByApiKey = (apiKey, callback) => {
//     const connection = getConnection();
//     console.log("apiKey", apiKey);
//     // connection.query(
//     //     `
//     //   SELECT order_id, email, name, bday, date, status, add_address, phone, img, JSON_EXTRACT(cart, '$[*]') AS cart FROM orders WHERE api_key = ?
//     // `,
//     connection.query(
//         `
//       SELECT order_id , email, name, bday, date, status, add_address, phone, img, JSON_EXTRACT(cart, '$[*]') AS cart FROM orders WHERE api_key = ?
//     `,
//         [apiKey],
//         (error, result) => {
//             if (error) {
//                 callback(error, null);
//             } else {
//                 for (let i = 0; i < result.length; i++) {
//                     if (result[i].cart) {
//                         result[i].cart = JSON.parse(result[i].cart);

//                         // Chuyển đổi các thuộc tính trong cart thành số nguyên
//                         for (let item of result[i].cart) {
//                             if (item.comparative) {
//                                 item.comparative = parseInt(
//                                     item.comparative,
//                                     10
//                                 );
//                             }
//                             if (item.price) {
//                                 item.price = parseInt(item.price, 10);
//                             }
//                             if (item.quantity) {
//                                 item.quantity = parseInt(item.quantity, 10);
//                             }
//                         }
//                     } else {
//                         result[i].cart = [];
//                     }
//                 }
//                 callback(null, result);
//             }
//         }
//     );

//     connection.end();
// };

// const createApiKey = (orderId, apiKey, callback) => {
//     const connection = getConnection();

//     connection.query(
//         "UPDATE orders SET api_key = ? WHERE order_id = ?",
//         [apiKey, orderId],
//         (error, result) => {
//             if (error) {
//                 callback(error, null);
//             } else {
//                 callback(null, apiKey);
//             }
//         }
//     );

//     connection.end();
// };

const updateOrder = (orderId, updateOrder, callback) => {
    const connection = getConnection();
    const updateKeys = [];
    const updateValues = [];
    if (updateOrder.cart) {
        updateKeys.push("cart_json = ?");
        updateValues.push(JSON.stringify(updateOrder.cart));
    }
    if (updateOrder.address) {
        updateKeys.push("address_json = ?");
        updateValues.push(JSON.stringify(updateOrder.address));
    }
    if (updateOrder.status) {
        updateKeys.push("status = ?");
        updateValues.push(updateOrder.status);
    }

    if (updateKeys.length === 0) {
        callback(new Error("No valid fields provided for update."), null);
        return;
    }

    const sql = `UPDATE orders SET ${updateKeys.join(", ")} WHERE id = ?`;
    updateValues.push(orderId);

    connection.query(sql, updateValues, (error, result) => {
        if (error) {
            callback(error, null);
        } else {
            callback(null, result);
        }
    });

    connection.end();
};

// const deleteOrder = (id, callback) => {
//     const connection = getConnection();

//     connection.query(
//         "DELETE FROM orders WHERE order_id = ?",
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
    // searchOrders,
    addOrder,
    getOrderByUserEmail,
    // getDetailOrder,
    // getOrderByOrdernameAndRole,
    // getOrderByApiKey,
    // createApiKey,
    updateOrder,
    // deleteOrder,
};
