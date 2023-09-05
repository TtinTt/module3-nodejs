import url from "url";
import userRepository from "./../repositories/user.repository.js";
import adminRepository from "../repositories/admin.repository.js";
export default function (request, response, next) {
    const { pathname } = url.parse(request.url, true);
    const method = request.method;

    if (
        (method === "POST" && pathname === "/login") ||
        (method === "POST" && pathname === "/register") ||
        (method === "GET" && pathname === "/products") ||
        (method === "GET" && pathname === "/products/price") ||
        (method === "GET" && pathname === "/products/tag") ||
        (method === "POST" && pathname === "/messs")
    ) {
        next();
    } else {
        const apiKey = request.header("X-API-Key");
        const apiKeyAdmin = request.header("X-API-Key-Admin");
        console.log("apiKey", apiKey);
        console.log("apiKeyAdmin", apiKeyAdmin);

        if (!apiKey && !apiKeyAdmin) {
            return response.status(401).send({
                error: "Không có API Key để xác thực.",
            });
        }

        const userPromise = new Promise((resolve, reject) => {
            if (apiKey) {
                userRepository.getUserByApiKey(apiKey, (error, result) => {
                    if (error) {
                        reject({ status: 500, message: error.message });
                    } else if (result.length === 0) {
                        reject({
                            status: 401,
                            message: "Không thể xác thực người dùng.",
                        });
                    } else {
                        request.auth = result[0];
                        resolve();
                    }
                });
            } else {
                resolve();
            }
        });

        const adminPromise = new Promise((resolve, reject) => {
            if (apiKeyAdmin) {
                adminRepository.getAdminByApiKey(
                    apiKeyAdmin,
                    (error, result) => {
                        if (error) {
                            reject({ status: 500, message: error.message });
                        } else if (result.length === 0) {
                            reject({
                                status: 401,
                                message: "Không thể xác thực quản trị viên.",
                            });
                        } else {
                            request.authAdmin = result[0];
                            resolve();
                        }
                    }
                );
            } else {
                resolve();
            }
        });

        Promise.all([userPromise, adminPromise])
            .then(() => {
                next();
            })
            .catch((error) => {
                response.status(error.status).send({ error: error.message });
            });
    }
}
