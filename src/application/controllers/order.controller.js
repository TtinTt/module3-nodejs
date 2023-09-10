import orderService from "../services/order.service.js";

const searchOrders = (request, response) => {
    if (!request.authAdmin.admin_id) {
        response.status(403).send({
            error: "Không có quyền truy cập.",
        });

        return;
    }

    const { name, page, limit, sortType } = request.query;

    orderService.searchOrders(
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

const addOrder = (request, response) => {
    console.log(request.body);
    const requestBody = request.body;
    console.log("controller requestBody", requestBody);

    orderService.addOrder(
        {
            ...requestBody,
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

const getDaysDifference = (date) => {
    if (!date) {
        return "";
    }

    let dateString = date.toString();
    if (dateString == "") {
        return "";
    } else {
        const [time, date] = dateString.split(" ");
        const [hour, minute] = time.slice(0, -1).split(":");
        const [day, month, year] = date.split("/");

        const now = new Date();
        const dateObject = new Date(year, month - 1, day, hour, minute);

        const differenceInTime = now.getTime() - dateObject.getTime();
        const differenceInDays = differenceInTime / (1000 * 3600);

        return Math.abs(Math.round(differenceInDays));
    }
};

const updateOrder = (request, response) => {
    const orderId = request.params.id;
    const requestBody = request.body;

    if (
        !request.authAdmin.admin_id &&
        !(getDaysDifference(requestBody.date) > 4)
    ) {
        response.status(403).send({
            error: "Không thể cập nhật đơn hàng trong thời gian còn có thể hủy bởi khách hàng",
        });

        return;
    }

    // if (!(getDaysDifference(requestBody.date) > 4)) {
    //     errors.set(
    //         "date",
    //         "Không thể cập nhật đơn hàng trong thời gian còn có thể hủy bởi khách hàng"
    //     );
    // }

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

export default {
    searchOrders,
    getOrderByUserEmail,
    addOrder,
    updateOrder,
};
