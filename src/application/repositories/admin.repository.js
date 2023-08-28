import moment from "moment";
import getConnection from "../../config/connection.database.js";
import { encryptPassword } from "../../utilities/hash.util.js";

// const searchAdmins = (params, callback) => {
//     const connection = getConnection();

//     let sql = " FROM admins";
//     const bindParams = [];

//     const page = params.page || 1;
//     const limit = params.limit || 5;

//     const offset = (page - 1) * limit;

//     if (params.name) {
//         const name = "%" + params.name + "%";
//         sql += " WHERE adminname LIKE ?";
//         bindParams.push(name);
//     }

//     const countQuery = "SELECT COUNT(1) AS total" + sql;

//     connection.query(countQuery, bindParams, (error, countResult) => {
//         if (error) {
//             callback(error, null);
//         } else if (countResult[0].total !== 0) {
//             const selectColumnsQuery =
//                 "SELECT admin_id, adminname, email, first_name, last_name, role, avatar, created_at, created_by_id, updated_at, updated_by_id" +
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

// const addAdmin = (admin, callback) => {
//     const connection = getConnection();

//     const adminToCreate = {
//         ...admin,
//         password: encryptPassword(admin.password),
//         // created_at: moment().format('YYYY-MM-DD HH:mm:ss'),
//         // updated_at: moment().format('YYYY-MM-DD HH:mm:ss'),
//     };

//     connection.query(
//         "INSERT INTO admins SET ?",
//         adminToCreate,
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

const getDetailAdmin = (id, callback) => {
    const connection = getConnection();

    connection.query(
        "SELECT admin_id, email, date FROM admins WHERE admin_id = ?",
        [id],
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

const getAdminByUsernameAndRole = (email, callback) => {
    const connection = getConnection();

    connection.query(
        `
      SELECT
        admin_id,
        email,
        password
      FROM admins
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

const getAdminByApiKey = (apiKey, callback) => {
    const connection = getConnection();
    // console.log("apiKey", apiKey);
    // connection.query(
    //     `
    //   SELECT admin_id, email, name, bday, date, status, add_address, phone, img, JSON_EXTRACT(cart, '$[*]') AS cart FROM admins WHERE api_key = ?
    // `,
    connection.query(
        `
      SELECT admin_id , email, date FROM admins WHERE api_key = ?
    `,
        [apiKey],
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

const createApiKey = (adminId, apiKeyAdmin, callback) => {
    const connection = getConnection();

    connection.query(
        "UPDATE admins SET api_key = ? WHERE admin_id = ?",
        [apiKeyAdmin, adminId],
        (error, result) => {
            if (error) {
                callback(error, null);
            } else {
                callback(null, apiKeyAdmin);
            }
        }
    );

    connection.end();
};

// const updateAdmin = (adminId, params, callback) => {
//     const connection = getConnection();
//     console.log(params);
//     let sql = "UPDATE admins SET cart = ?";

//     // if (params.cart) {
//     //     sql += ", ";
//     //     ;
//     // }

//     let bindParams = [];
//     if (params.cart) {
//         bindParams.push(JSON.stringify(params.cart));
//     } else {
//         bindParams.push("[]");
//     }

//     if (params.name) {
//         sql += ", name = ?";
//         bindParams.push(params.name);
//     }

//     if (params.bday) {
//         sql += ", bday = ?";
//         bindParams.push(params.bday);
//     }

//     if (params.add_address) {
//         sql += ", add_address = ?";
//         bindParams.push(params.add_address);
//     }

//     if (params.phone) {
//         sql += ", phone = ?";
//         bindParams.push(params.phone);
//     }

//     if (params.password) {
//         sql += ", password = ?";
//         bindParams.push(encryptPassword(params.password));
//     }

//     if (params.img) {
//         sql += ", img = ?";
//         bindParams.push(params.img);
//     }
//     if (params.status) {
//         //TODO check quyền admin
//         sql += ", status = ?";
//         bindParams.push(params.status);
//     }

//     sql += " WHERE admin_id = ?";
//     bindParams.push(adminId);

//     connection.query(sql, bindParams, (error, result) => {
//         if (error) {
//             callback(error, null);
//         } else {
//             callback(null, result);
//         }
//     });

//     connection.end();
// };

// const deleteAdmin = (id, callback) => {
//     const connection = getConnection();

//     connection.query(
//         "DELETE FROM admins WHERE admin_id = ?",
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
    // searchAdmins,
    // addAdmin,
    getDetailAdmin,
    getAdminByUsernameAndRole,
    getAdminByApiKey,
    createApiKey,
    // updateAdmin,
    // deleteAdmin,
};
