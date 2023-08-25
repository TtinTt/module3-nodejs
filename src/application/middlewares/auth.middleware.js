import url from "url";
import userRepository from "./../repositories/user.repository.js";

export default function (request, response, next) {
    const { pathname } = url.parse(request.url, true);
    const method = request.method;

    if (
        (method === "POST" && pathname === "/login") ||
        (method === "POST" && pathname === "/register") ||
        (method === "GET" && pathname === "/products") ||
        (method === "GET" && pathname === "/products/price")
    ) {
        next();
    } else {
        const apiKey = request.header("X-API-Key");
        console.log("request.body", request.body);
        console.log("request.params", request.params);

        console.log("auth middleware", apiKey);
        if (!apiKey) {
            response.status(401).send({
                error: "Không thể xác thực.",
            });
        } else {
            userRepository.getUserByApiKey(apiKey, (error, result) => {
                if (error) {
                    response.status(500).send({
                        error: error.message,
                    });
                } else if (result.length === 0) {
                    response.status(401).send({
                        error: "Không thể xác thực.",
                    });
                } else {
                    const auth = result[0];
                    request.auth = auth;

                    next();
                }
            });
        }
    }
}
