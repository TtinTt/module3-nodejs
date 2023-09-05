import moment from "moment";
import getConnection from "./../../config/connection.database.js";
import { encryptPassword } from "../../utilities/hash.util.js";

// const searchUsers = (params, callback) => {
//     const connection = getConnection();

//     let sql = " FROM users";
//     const bindParams = [];

//     const page = params.page || 1;
//     const limit = params.limit || 5;

//     const offset = (page - 1) * limit;

//     if (params.name) {
//         const name = "%" + params.name + "%";
//         sql += " WHERE username LIKE ?";
//         bindParams.push(name);
//     }

//     const countQuery = "SELECT COUNT(1) AS total" + sql;

//     connection.query(countQuery, bindParams, (error, countResult) => {
//         if (error) {
//             callback(error, null);
//         } else if (countResult[0].total !== 0) {
//             const selectColumnsQuery =
//                 "SELECT user_id, username, email, first_name, last_name, role, avatar, created_at, created_by_id, updated_at, updated_by_id" +
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

const register = (user, callback) => {
    const connection = getConnection();

    const userToCreate = {
        ...user,
        password: encryptPassword(user.password),
        status: true,
        img: "https://www.getillustrations.com/photos/pack/video/55895-3D-AVATAR-ANIMATION.gif",
        // created_at: moment().format('YYYY-MM-DD HH:mm:ss'),
        // updated_at: moment().format('YYYY-MM-DD HH:mm:ss'),
    };

    connection.query(
        "INSERT INTO users SET ?",
        userToCreate,
        (error, result) => {
            if (error) {
                callback(error, null);
                console.log(error);
            } else {
                callback(null, result);
                console.log(
                    "đã thêm user",
                    user.email,
                    " password",
                    user.password
                );
            }
        }
    );

    connection.end();
};

// const getDetailUser = (id, callback) => {
//     const connection = getConnection();

//     connection.query(
//         "SELECT user_id, username, email, first_name, last_name, role, avatar, created_at, created_by_id, updated_at, updated_by_id FROM users WHERE user_id = ?",
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

// const getUserByUsernameAndRole = (email, role, callback) => {
//     const connection = getConnection();
//     let table = "users";
//     if (role == 2) {
//         table = "admins";
//     }

//     connection.query(
//         `
//       SELECT
//         user_id,
//         email,
//         password
//       FROM ?
//       WHERE
//         email = ?
//     `,
//         [table, email],
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

// const getUserByApiKey = (apiKey, callback) => {
//     const connection = getConnection();

//     connection.query(
//         `
//       SELECT
//         user_id,
//         username,
//         email,
//         first_name,
//         last_name,
//         role,
//         avatar,
//         created_at,
//         created_by_id,
//         updated_at,
//         updated_by_id
//       FROM users
//       WHERE
//         api_key = ?
//     `,
//         [apiKey],
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

// const createApiKey = (userId, apiKey, callback) => {
//     const connection = getConnection();

//     connection.query(
//         "UPDATE users SET api_key = ? WHERE user_id = ?",
//         [apiKey, userId],
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

// const updateUser = (userId, params, callback) => {
//     const connection = getConnection();

//     let sql =
//         "UPDATE users SET first_name = ?, last_name = ?, role = ?, updated_by_id = ?";
//     let bindParams = [
//         params.first_name,
//         params.last_name,
//         params.role,
//         params.updated_by_id,
//     ];

//     if (params.password) {
//         sql += ", password = ?";
//         bindParams.push(encryptPassword(params.password));
//     }
//     if (params.avatar) {
//         sql += ", avatar = ?";
//         bindParams.push(params.avatar);
//     }

//     sql += " WHERE user_id = ?";
//     bindParams.push(userId);

//     connection.query(sql, bindParams, (error, result) => {
//         if (error) {
//             callback(error, null);
//         } else {
//             callback(null, result);
//         }
//     });

//     connection.end();
// };

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
    // searchUsers,
    register,
    // getDetailUser,
    // getUserByUsernameAndRole,
    // getUserByApiKey,
    // createApiKey,
    // updateUser,
    // deleteUser,
};
