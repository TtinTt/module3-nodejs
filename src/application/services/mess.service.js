import messRepository from "../repositories/mess.repository.js";
import fs from "fs";
import { getFileExtension } from "../../utilities/upload.util.js";

const searchMesss = (params, callback) => {
    if (params.limit && !/^[0-9]+$/.test(params.limit)) {
        callback({ message: "Limit phải là số" }, null);
    } else if (params.page && !/^[0-9]+$/.test(params.page)) {
        callback({ message: "Page phải là số" }, null);
    } else if (params.name && typeof params.name !== "string") {
        callback({ message: "Name phải là chuỗi" }, null);
    } else if (
        params.sortType &&
        params.sortType !== "0" &&
        params.sortType !== "1" &&
        params.sortType !== "2"
    ) {
        callback({ message: "Kiểu sắp xếp không hợp lệ" }, null);
    } else {
        messRepository.searchMesss(params, (error, result) => {
            if (error) {
                callback(error, null);
            } else {
                callback(null, result);
            }
        });
    }
};

const addMess = (requestBody, callback) => {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

    const validate = (requestBody) => {
        let errors = new Map();

        if (requestBody.email == "") {
            errors.set("email", "Email không thể để trống");
        } else if (!regex.test(requestBody.email)) {
            errors.set("email", "Email không hợp lệ");
        } else if (requestBody.phone == "") {
            errors.set("phone", "Số điện thoại không thể để trống");
        } else if (requestBody.date == "") {
            errors.set("date", "Ngày không thể để trống");
        } else if (requestBody.mess.length < 25) {
            errors.set("mess", "Lời nhắn không hợp lệ");
        }

        // //validate address
        if (
            requestBody.name &&
            (requestBody.name.length < 3 || requestBody.name.length > 80)
        ) {
            errors.set("name", "Tên không hợp lệ");
        } else if (requestBody.phone && requestBody.phone.length < 10) {
            errors.set("address", "Số điện thoại không hợp lệ.");
        }

        return errors;
    };

    const validateErrors = validate(requestBody);

    if (validateErrors.size !== 0) {
        callback(Object.fromEntries(validateErrors), null);
    } else {
        const newMess = {
            email: requestBody.email,
            name: requestBody.name,
            phone: requestBody.phone,
            date: requestBody.date,
            mess: requestBody.mess,
            status: 1,
        };

        messRepository.addMess(newMess, (error, result) => {
            // if (path) {
            //     fs.rmSync(path);
            // }
            if (error) {
                callback(error, null);
            } else {
                callback(null, result);
            }
        });
    }
};

// const getMessByUserEmail = (email, callback) => {
//     const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

//     if (email == "") {
//         errors.set("email", "Email không được để trống");
//     } else if (!regex.test(email)) {
//         errors.set("email", "Email không hợp lệ");
//     } else {
//         messRepository.getMessByUserEmail(email, (error, result) => {
//             if (error) {
//                 callback(error, null);
//             } else if (result.length === 0) {
//                 callback({ message: "Mess not found" }, null);
//             } else {
//                 callback(null, result);
//             }
//         });
//     }
// };

// const getDetailMess = (id, callback) => {
//     if (!/^[0-9]+$/.test(id)) {
//         callback({ message: "ID phải là số" }, null);
//     } else {
//         messRepository.getDetailMess(id, (error, result) => {
//             if (error) {
//                 callback(error, null);
//             } else if (result.length === 0) {
//                 callback({ message: "Mess not found" }, null);
//             } else {
//                 callback(null, result[0]);
//             }
//         });
//     }
// };
// const isArrayContainingObjects = (obj) => {
//     if (!Array.isArray(obj)) {
//         return false;
//     }

//     for (let item of obj) {
//         if (typeof item !== "object" || item === null || Array.isArray(item)) {
//             return false;
//         }
//     }

//     return true;
// };
const updateMess = (messId, requestBody, callback) => {
    let originalname = null;
    const validate = (requestBody) => {
        let errors = new Map();

        if (
            requestBody.hasOwnProperty("status") &&
            (requestBody.status < -2 || requestBody.status > 5)
        ) {
            errors.set("status", "Status không hợp lệ");
        }

        if (
            requestBody.hasOwnProperty("cart") &&
            requestBody.cart.length === 0
        ) {
            errors.set("cart", "Không thể để trống giỏ hàng");
        }

        // validate address
        if (
            requestBody.hasOwnProperty("address") &&
            (requestBody.address.name === "" ||
                requestBody.address.address === "" ||
                requestBody.address.phoneNumber === "")
        ) {
            errors.set(
                "address",
                "Không thể để trống tên, địa chỉ hoặc số điện thoại."
            );
        } else if (
            requestBody.hasOwnProperty("address") &&
            requestBody.address.name &&
            (requestBody.address.name.length < 3 ||
                requestBody.address.name.length > 80)
        ) {
            errors.set("address", "Tên không hợp lệ");
        } else if (
            requestBody.hasOwnProperty("address") &&
            requestBody.address.phoneNumber &&
            requestBody.address.phoneNumber.length < 10
        ) {
            errors.set("address", "Số điện thoại không hợp lệ.");
        } else if (
            requestBody.hasOwnProperty("address") &&
            requestBody.address.address &&
            requestBody.address.address.length < 20
        ) {
            errors.set(
                "address",
                "Địa chỉ không hợp lệ. Vui lòng viết địa chỉ chi tiết hơn"
            );
        }

        return errors;
    };

    const validateErrors = validate(requestBody);

    if (validateErrors.size !== 0) {
        callback(Object.fromEntries(validateErrors), null);
    } else {
        const updateMess = {
            cart: requestBody.cart,
            address: requestBody.address,
            status: requestBody.status, //TODO check quyền admin
        };

        messRepository.updateMess(messId, updateMess, (error, result) => {
            if (error) {
                callback(error, null);
            } else {
                callback(null, result);
            }
        });
    }
};

// const deleteMess = (id, callback) => {
//     if (!/^[0-9]+$/.test(id)) {
//         callback({ message: "ID phải là số" }, null);
//     } else {
//         messRepository.deleteMess(id, (error, result) => {
//             if (error) {
//                 callback(error, null);
//             } else if (result.affectedRows === 0) {
//                 callback({ message: "Mess not found" }, null);
//             } else {
//                 callback(null, result);
//             }
//         });
//     }
// };

export default {
    searchMesss,
    addMess,
    // getMessByUserEmail,
    // getDetailMess,
    updateMess,
    // deleteMess,
};
