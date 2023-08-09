import userService from "./../services/user.service.js";

const searchUsers = (request, response) => {
  const { name, page, limit } = request.query;

  userService.searchUsers(
    { name: name, page: page, limit: limit },
    (error, result) => {
      if (error) {
        response.status(500).send({
          error: error.message,
        });
      } else {
        response.send({
          users: result,
        });
      }
    }
  );
};

const addUser = (request, response) => {};

const getDetailUser = (request, response) => {
  const { id } = request.params;
  userService.getDetailUser(id, (error, result) => {
    if (error) {
      response.status(500).send({
        error: error.message,
      });
    } else {
      response.send(result);
    }
  });
};

const updateUser = (request, response) => {};

const deleteUser = (request, response) => {
  const { id } = request.params;

  userService.deleteUser(id, (error, result) => {
    if (error) {
      response.status(500).send({
        error: error.message,
      });
    } else {
      response.status(204).send();
    }
  });
};

export default {
  searchUsers,
  addUser,
  getDetailUser,
  updateUser,
  deleteUser,
};
