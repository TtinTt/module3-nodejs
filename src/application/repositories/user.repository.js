import getConnection from "./../../config/connection.database.js";

const searchUsers = (params, callback) => {
  const connection = getConnection();

  let sql = "SELECT * FROM users";
  const bindParams = [];

  const page = params.page || 1;
  const limit = params.limit || 5;

  const offset = (page - 1) * limit;

  if (params.name) {
    const name = "%" + params.name + "%";
    sql += " WHERE username LIKE ?";
    bindParams.push(name);
  }

  sql += ` LIMIT ${limit} OFFSET ${offset}`;

  connection.query(sql, bindParams, (error, result) => {
    if (error) {
      callback(error, null);
    } else {
      callback(null, result);
    }
  });

  connection.end();
};

const addUser = (params, callback) => {};

const getDetailUser = (id, callback) => {
  const connection = getConnection();

  connection.query(
    "SELECT * FROM users WHERE user_id = ?",
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

const updateUser = (params, callback) => {};

const deleteUser = (id, callback) => {
  const connection = getConnection();

  connection.query(
    "DELETE FROM users WHERE user_id = ?",
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
  searchUsers,
  addUser,
  getDetailUser,
  updateUser,
  deleteUser,
};
