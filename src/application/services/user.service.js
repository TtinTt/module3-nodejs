import userRepository from "./../repositories/user.repository.js";

const searchUsers = (params, callback) => {
  if (!/^[0-9]+$/.test(params.limit)) {
    callback({ message: "Limit phải là số" }, null);
  } else if (!/^[0-9]+$/.test(params.page)) {
    callback({ message: "Page phải là số" }, null);
  } else {
    userRepository.searchUsers(params, (error, result) => {
      if (error) {
        callback(error, null);
      } else {
        callback(null, result);
      }
    });
  }
};

const addUser = (params, callback) => {};

const getDetailUser = (id, callback) => {
  if (!/^[0-9]+$/.test(id)) {
    callback({ message: "ID phải là số" }, null);
  } else {
    userRepository.getDetailUser(id, (error, result) => {
      if (error) {
        callback(error, null);
      } else if (result.length === 0) {
        callback({ message: "User not found" }, null);
      } else {
        callback(null, result);
      }
    });
  }
};

const updateUser = (params, callback) => {};

const deleteUser = (id, callback) => {
  if (!/^[0-9]+$/.test(id)) {
    callback({ message: "ID phải là số" }, null);
  } else {
    userRepository.deleteUser(id, (error, result) => {
      if (error) {
        callback(error, null);
      } else if (result.affectedRows === 0) {
        callback({ message: "User not found" }, null);
      } else {
        callback(null, result);
      }
    });
  }
};

export default {
  searchUsers,
  addUser,
  getDetailUser,
  updateUser,
  deleteUser,
};
