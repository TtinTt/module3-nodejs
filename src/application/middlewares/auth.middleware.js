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

        console.log("request.body", request.body);
        console.log("request.params", request.params);
        console.log("auth middleware", apiKey);
        console.log("auth middleware admin", apiKeyAdmin);

        if (!apiKey && !apiKeyAdmin) {
            return response.status(401).send({
                error: "Không có API Key để xác thực.",
            });
        }

        if (apiKey) {
            userRepository.getUserByApiKey(apiKey, (error, result) => {
                if (error) {
                    return response.status(500).send({
                        error: error.message,
                    });
                } else if (result.length === 0) {
                    return response.status(401).send({
                        error: "Không thể xác thực người dùng.",
                    });
                } else {
                    request.auth = result[0];

                    if (!apiKeyAdmin) {
                        next();
                    }
                }
            });
        }

        if (apiKeyAdmin) {
            adminRepository.getAdminByApiKey(apiKeyAdmin, (error, result) => {
                if (error) {
                    return response.status(500).send({
                        error: error.message,
                    });
                } else if (result.length === 0) {
                    return response.status(401).send({
                        error: "Không thể xác thực quản trị viên.",
                    });
                } else {
                    request.authAdmin = result[0];
                    next();
                }
            });
        }
    }
}
