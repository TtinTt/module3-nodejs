import moment from "moment";
import getConnection from "../../config/connection.database.js";
import { encryptPassword } from "../../utilities/hash.util.js";

const searchMesss = (params, callback) => {
    const bindParams = [];
    const connection = getConnection();

    const page = params.page || 1;
    const limit = params.limit || 10;
    const offset = (page - 1) * limit;
    const name = params.name || null;
    const sortType = parseInt(params.sortType) || null;

    let baseSql = " FROM messages";

    let whereAdded = false;

    if (name) {
        baseSql += " WHERE (email LIKE ? OR name LIKE ? OR phone LIKE ?)";
        bindParams.push("%" + name + "%");
        bindParams.push("%" + name + "%");
        bindParams.push("%" + name + "%");
        whereAdded = true;
    }

    switch (sortType) {
        case 0:
            baseSql += whereAdded ? " AND " : " WHERE ";
            baseSql += "status IN (0)";
            whereAdded = true;
            break;
        case 1:
            baseSql += whereAdded ? " AND " : " WHERE ";
            baseSql += "status IN (1)";
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
            "SELECT * " + baseSql + ` LIMIT ${limit} OFFSET ${offset}`;

        connection.query(selectColumnsQuery, bindParams, (error, messs) => {
            if (error) {
                callback(error, null);
                return;
            }

            callback(null, {
                total: countResult[0].total,
                records: messs,
            });
            connection.end();
        });
    });
};

const addMess = (messInput, callback) => {
    const connection = getConnection();
    const { email, name, phone, date, mess, status } = messInput;
    console.log(mess);
    connection.query(
        "INSERT INTO messages (email, name, phone, date, mess, status) VALUES (?, ?, ?, ?, ?, ?)",
        [email, name, phone, date, mess, status],
        (error, result) => {
            if (error) {
                callback(error, null);
            } else {
                callback(null, result);
                console.log("Mess inserted with ID:", result.id);
            }
            connection.end();
        }
    );
};

const updateMess = (messId, updateMess, callback) => {
    const connection = getConnection();
    const updateKeys = [];
    const updateValues = [];

    if (updateMess.email) {
        updateKeys.push("email = ?");
        updateValues.push(updateMess.email);
    }
    if (updateMess.name) {
        updateKeys.push("name = ?");
        updateValues.push(updateMess.name);
    }
    if (updateMess.phone) {
        updateKeys.push("phone = ?");
        updateValues.push(updateMess.phone);
    }
    if (updateMess.date) {
        updateKeys.push("date = ?");
        updateValues.push(updateMess.date);
    }
    if (updateMess.mess) {
        updateKeys.push("mess = ?");
        updateValues.push(updateMess.mess);
    }
    if (updateMess.status !== 2) {
        updateKeys.push("status = ?");
        updateValues.push(updateMess.status);
    }

    if (updateKeys.length === 0) {
        callback(new Error("No valid fields provided for update."), null);
        return;
    }

    const sql = `UPDATE messages SET ${updateKeys.join(", ")} WHERE id = ?`;
    updateValues.push(messId);

    connection.query(sql, updateValues, (error, result) => {
        if (error) {
            callback(error, null);
        } else {
            callback(null, result);
        }
        connection.end();
    });
};

export default {
    searchMesss,
    addMess,
    updateMess,
};
