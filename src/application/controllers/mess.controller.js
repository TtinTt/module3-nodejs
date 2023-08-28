import messService from "../services/mess.service.js";

const searchMesss = (request, response) => {
    if (!request.authAdmin.admin_id) {
        response.status(403).send({
            error: "Không có quyền truy cập.",
        });
        return;
    }

    const { name, page, limit, sortType } = request.query;

    messService.searchMesss(
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

const addMess = (request, response) => {
    console.log(request.body);
    const requestBody = request.body;
    console.log("controller request", request.body);

    messService.addMess(
        {
            ...requestBody,
            // authId: request.auth.mess_id,
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

// const getMessByUserEmail = (request, response) => {
//     const email = decodeURIComponent(request.params.email);
//     console.log("email", email);

//     messService.getMessByUserEmail(email, (error, result) => {
//         if (error) {
//             response.status(500).send({
//                 error: error.message,
//             });
//         } else {
//             response.send(result);
//         }
//     });
// };

// const getDetailMess = (request, response) => {
//     if (request.auth.role !== 1) {
//         response.status(403).send({
//             error: "Không có quyền truy cập.",
//         });

//         return;
//     }

//     const { id } = request.params;
//     messService.getDetailMess(id, (error, result) => {
//         if (error) {
//             response.status(500).send({
//                 error: error.message,
//             });
//         } else {
//             response.send(result);
//         }
//     });
// };

const updateMess = (request, response) => {
    console.log("check mess", request.body);

    if (!request.authAdmin.admin_id) {
        response.status(403).send({
            error: "Không có quyền truy cập.",
        });

        return;
    }

    const messId = request.params.id;
    const requestBody = request.body;

    messService.updateMess(
        messId,
        {
            ...requestBody,
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

// const deleteMess = (request, response) => {
//     if (request.auth.role !== 1) {
//         response.status(403).send({
//             error: "Không có quyền truy cập.",
//         });

//         return;
//     }

//     const { id } = request.params;

//     messService.deleteMess(id, (error, result) => {
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
    searchMesss,
    // getMessByUserEmail,
    addMess,
    // getDetailMess,
    updateMess,
    // deleteMess,
};
