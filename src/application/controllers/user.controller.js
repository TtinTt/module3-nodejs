import userService from "./../services/user.service.js";

const searchUsers = (request, response) => {
    if (!request.authAdmin.admin_id) {
        response.status(403).send({
            error: "Không có quyền truy cập.",
        });

        return;
    }

    const { name, page, limit, sortType } = request.query;

    userService.searchUsers(
        { name: name, page: page, limit: limit, sortType: sortType },
        (error, result) => {
            if (error) {
                response.status(500).send({
                    error: error.message,
                });
            } else {
                response.send(result);
            }
        }
    );
};

const addUser = (request, response) => {
    if (request.auth.role !== 1) {
        response.status(403).send({
            error: "Không có quyền truy cập.",
        });

        return;
    }

    const requestBody = request.body;
    const avatar = request.file;

    userService.addUser(
        {
            ...requestBody,
            authId: request.auth.user_id,
            avatar: avatar,
        },
        (error, result) => {
            if (error) {
                response.status(500).send({
                    error: error,
                });
            } else {
                response.status(201).send();
            }
        }
    );
};

const getDetailUser = (request, response) => {
    if (request.auth.role !== 1) {
        response.status(403).send({
            error: "Không có quyền truy cập.",
        });

        return;
    }

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

const updateUser = (request, response) => {
    const userId = request.params.id;
    const requestBody = request.body;
    const img = request.file;
    console.log("user controller", request.body);

    if (request.body.status && !request.authAdmin?.admin_id) {
        response.status(403).send({
            error: "Không có quyền truy cập.",
        });
        return;
    }

    if (request.body.resetPassword && !request.authAdmin?.admin_id) {
        response.status(403).send({
            error: "Không có quyền truy cập.",
        });
        return;
    }

    userService.updateUser(
        userId,
        {
            ...requestBody,
            avatar: img,
        },
        (error, result) => {
            if (error) {
                response.status(500).send({
                    error: error,
                });
            } else {
                response.status(200).send();
            }
        }
    );
};

const deleteUser = (request, response) => {
    if (request.auth.role !== 1) {
        response.status(403).send({
            error: "Không có quyền truy cập.",
        });

        return;
    }

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
