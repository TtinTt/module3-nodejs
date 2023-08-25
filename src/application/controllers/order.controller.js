import orderService from "../services/order.service.js";

// const searchOrders = (request, response) => {
//     if (request.auth.role !== 1) {
//         response.status(403).send({
//             error: "Không có quyền truy cập.",
//         });

//         return;
//     }

//     const { name, page, limit } = request.query;

//     orderService.searchOrders(
//         { name: name, page: page, limit: limit },
//         (error, result) => {
//             if (error) {
//                 response.status(500).send({
//                     error: error.message,
//                 });
//             } else {
//                 response.send(result);
//             }
//         }
//     );
// };

const addOrder = (request, response) => {
    console.log(request.body);
    const requestBody = request.body;
    console.log("controller requestBody", requestBody);

    orderService.addOrder(
        {
            ...requestBody,
            // authId: request.auth.order_id,
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

const getOrderByUserEmail = (request, response) => {
    const email = decodeURIComponent(request.params.email);
    console.log("email", email);

    orderService.getOrderByUserEmail(email, (error, result) => {
        if (error) {
            response.status(500).send({
                error: error.message,
            });
        } else {
            response.send(result);
        }
    });
};

// const getDetailOrder = (request, response) => {
//     if (request.auth.role !== 1) {
//         response.status(403).send({
//             error: "Không có quyền truy cập.",
//         });

//         return;
//     }

//     const { id } = request.params;
//     orderService.getDetailOrder(id, (error, result) => {
//         if (error) {
//             response.status(500).send({
//                 error: error.message,
//             });
//         } else {
//             response.send(result);
//         }
//     });
// };

const updateOrder = (request, response) => {
    const orderId = request.params.id;
    const requestBody = request.body;

    orderService.updateOrder(
        orderId,
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

// const deleteOrder = (request, response) => {
//     if (request.auth.role !== 1) {
//         response.status(403).send({
//             error: "Không có quyền truy cập.",
//         });

//         return;
//     }

//     const { id } = request.params;

//     orderService.deleteOrder(id, (error, result) => {
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
    // searchOrders,
    getOrderByUserEmail,
    addOrder,
    // getDetailOrder,
    updateOrder,
    // deleteOrder,
};
