import authService from "../services/auth.service.js";

const login = (request, response) => {
    const requestBody = request.body;

    const params = {
        email: requestBody.email,
        password: requestBody.password,
        type: requestBody.type,
    };

    authService.login(params, (error, result) => {
        if (error) {
            response.status(error.code).send({
                error: error.message,
            });
        } else {
            response.send(result);
        }
    });
};

const getAuth = (request, response) => {
    const userId = request.auth?.user_id;
    const adminId = request.authAdmin?.admin_id;

    // Nếu cả hai đều không tồn tại, trả về lỗi
    if (!userId && !adminId) {
        return response.status(400).send({
            error: "Thiếu thông tin xác thực.",
        });
    }

    // Gọi dịch vụ với userId và/hoặc adminId
    authService.getAuth(userId, adminId, (error, result) => {
        if (error) {
            return response.status(500).send({
                error: "Lỗi khi xác thực.",
            });
        }
        response.send(result);
    });
};

const logout = (request, response) => {
    authService.logout(request.auth.user_id, (error, result) => {
        if (error) {
            response.status(401).send({
                error: error,
            });
        } else {
            response.send(result);
        }
    });
};

const register = (request, response) => {
    const requestBody = request.body;
    // console.log("requestBody", requestBody);
    // const avatar =
    //     request.file
    // userService.addUser(
    //     {
    //         ...requestBody,
    //         authId: request.auth.user_id,
    //         avatar: avatar,
    //     },
    authService.register(
        {
            ...requestBody,
            // authId: request.auth.user_id,
            // avatar: avatar,
        },
        (error, result) => {
            if (error) {
                if (error.code == "ER_DUP_ENTRY") {
                    response.status(403).send({
                        error: error,
                    });
                } else {
                    response.status(500).send({
                        error: error,
                    });
                }
            } else {
                response.status(201).send();
                // console.log(result);
            }
        }
    );
};

export default {
    login,
    getAuth,
    logout,
    register,
};
