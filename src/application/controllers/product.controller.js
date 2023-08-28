import productService from "../services/product.service.js";

const searchProducts = (request, response) => {
    // if (request.auth.role !== 1) {
    //     response.status(403).send({
    //         error: "Không có quyền truy cập.",
    //     });

    //     return;
    // }

    const { name, page, limit, maxPrice, sortType, category } = request.query;

    console.log(request.query);

    productService.searchProducts(
        {
            name: name,
            page: page,
            limit: limit,
            maxPrice: maxPrice,
            sortType: sortType,
            category: category,
        },
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

const getPrice = (request, response) => {
    productService.getPrice((error, result) => {
        if (error) {
            response.status(500).send({
                error: error.message,
            });
        } else {
            response.send(result);
        }
    });
};

const getTag = (request, response) => {
    productService.getTag((error, result) => {
        if (error) {
            response.status(500).send({
                error: error.message,
            });
        } else {
            response.send(result);
        }
    });
};

const addProduct = (request, response) => {
    if (request.auth.role !== 1) {
        response.status(403).send({
            error: "Không có quyền truy cập.",
        });

        return;
    }

    const requestBody = request.body;
    const avatar = request.file;

    productService.addProduct(
        {
            ...requestBody,
            authId: request.auth.product_id,
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

const getDetailProduct = (request, response) => {
    if (request.auth.role !== 1) {
        response.status(403).send({
            error: "Không có quyền truy cập.",
        });

        return;
    }

    const { id } = request.params;
    productService.getDetailProduct(id, (error, result) => {
        if (error) {
            response.status(500).send({
                error: error.message,
            });
        } else {
            response.send(result);
        }
    });
};

const updateProduct = (request, response) => {
    if (request.auth.role !== 1) {
        response.status(403).send({
            error: "Không có quyền truy cập.",
        });

        return;
    }

    const productId = request.params.id;
    const requestBody = request.body;
    const avatar = request.file;

    productService.updateProduct(
        productId,
        {
            ...requestBody,
            avatar: avatar,
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

const deleteProduct = (request, response) => {
    if (request.auth.role !== 1) {
        response.status(403).send({
            error: "Không có quyền truy cập.",
        });

        return;
    }

    const { id } = request.params;

    productService.deleteProduct(id, (error, result) => {
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
    searchProducts,
    getPrice,
    getTag,
    addProduct,
    getDetailProduct,
    updateProduct,
    deleteProduct,
};
