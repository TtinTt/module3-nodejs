import moment from "moment";
import getConnection from "../../config/connection.database.js";
import { encryptPassword } from "../../utilities/hash.util.js";

const searchAdmins = (params, callback) => {
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
    let baseSql = " FROM admins";

    let whereAdded = false;

    if (name) {
        baseSql += " WHERE (email LIKE ?)";
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
            "SELECT admin_id, email, date, status " +
            baseSql +
            " ORDER BY admin_id DESC" +
            ` LIMIT ${limit} OFFSET ${offset}`;

        connection.query(selectColumnsQuery, bindParams, (error, admins) => {
            if (error) {
                callback(error, null);
                return;
            }

            callback(null, {
                total: countResult[0].total,
                records: admins,
            });
            connection.end();
        });
    });
};

const addAdmin = (admin, callback) => {
    const connection = getConnection();

    const adminToCreate = {
        ...admin,
        password: encryptPassword(admin.password),
    };

    connection.query(
        "INSERT INTO admins SET ?",
        adminToCreate,
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

const getDetailAdmin = (id, callback) => {
    const connection = getConnection();

    connection.query(
        "SELECT admin_id, email, date, status FROM admins WHERE admin_id = ?",
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
        password, 
        status
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
      SELECT admin_id , email, date, status FROM admins WHERE api_key = ?
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

const updateAdmin = (adminId, params, callback) => {
    console.log("admin repo", params);
    const connection = getConnection();
    let sql = "UPDATE admins SET status = ?";
    let bindParams = [];

    if (params.status == 0) {
        bindParams.push("0");
    } else {
        bindParams.push("1");
    }
    // if (params.cart) {
    //     bindParams.push(JSON.stringify(params.cart));
    // } else {
    //     bindParams.push("[]");
    // }

    // if (params.name) {
    //     sql += ", name = ?";
    //     bindParams.push(params.name);
    // }

    // if (params.bday) {
    //     sql += ", bday = ?";
    //     bindParams.push(params.bday);
    // }

    // if (params.add_address) {
    //     sql += ", add_address = ?";
    //     bindParams.push(params.add_address);
    // }

    // if (params.phone) {
    //     sql += ", phone = ?";
    //     bindParams.push(params.phone);
    // }

    if (params.password) {
        sql += ", password = ?";
        // , api_key = NULL";
        bindParams.push(encryptPassword(params.password));
    }

    // if (params.img) {
    //     sql += ", img = ?";
    //     bindParams.push(params.img);
    // }
    // console.log("Status", params.status);

    sql += " WHERE admin_id = ?";
    bindParams.push(adminId);

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

const deleteAdmin = (id, callback) => {
    const connection = getConnection();

    connection.query(
        "DELETE FROM admins WHERE admin_id = ?",
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

export default {
    searchAdmins,
    addAdmin,
    getDetailAdmin,
    getAdminByUsernameAndRole,
    getAdminByApiKey,
    createApiKey,
    updateAdmin,
    deleteAdmin,
};
