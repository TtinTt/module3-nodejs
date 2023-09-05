import adminService from "../services/admin.service.js";

const searchAdmins = (request, response) => {
    if (!request.authAdmin.admin_id) {
        response.status(403).send({
            error: "Không có quyền truy cập.",
        });

        return;
    }

    const { name, page, limit, sortType } = request.query;

    adminService.searchAdmins(
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

const addAdmin = (request, response) => {
    console.log("check:");
    console.log(request.authAdmin.admin_id);
    console.log(request.authAdmin.admin_id != 1);
    if (request.authAdmin.admin_id != 1) {
        response.status(403).send({
            error: "Không có quyền truy cập.",
        });

        return;
    }

    const requestBody = request.body;

    adminService.addAdmin(
        {
            ...requestBody,
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

const getDetailAdmin = (request, response) => {
    if (request.auth.role !== 1) {
        response.status(403).send({
            error: "Không có quyền truy cập.",
        });

        return;
    }

    const { id } = request.params;
    adminService.getDetailAdmin(id, (error, result) => {
        if (error) {
            response.status(500).send({
                error: error.message,
            });
        } else {
            response.send(result);
        }
    });
};

const updateAdmin = (request, response) => {
    const adminId = request.params.id;
    console.log("adminId1", adminId);
    console.log("adminId2", request.authAdmin.admin_id);
    const requestBody = request.body;
    const img = request.file;

    if (request.body.status >= 0 && request.authAdmin.admin_id !== 1) {
        response.status(403).send({
            error: "Không có quyền truy cập.",
        });
        return;
    }

    if (request.body.status == 0 && adminId == "1") {
        response.status(403).send({
            error: "Không có quyền truy cập.",
        });
        return;
    }

    if (
        request.body.resetPassword &&
        request.authAdmin.admin_id != adminId &&
        request.authAdmin.admin_id != 1
    ) {
        response.status(403).send({
            error: "Không có quyền truy cập.",
        });
        return;
    }

    adminService.updateAdmin(
        adminId,
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

// const deleteAdmin = (request, response) => {
//     if (request.auth.role !== 1) {
//         response.status(403).send({
//             error: "Không có quyền truy cập.",
//         });

//         return;
//     }

//     const { id } = request.params;

//     adminService.deleteAdmin(id, (error, result) => {
//         if (error) {
//             response.status(500).send({
//                 error: error.message,
//             });
//         } else {
//             response.status(204).send();
//         }
//     });
// };

export default {
    searchAdmins,
    addAdmin,
    getDetailAdmin,
    updateAdmin,
    // deleteAdmin,
};
