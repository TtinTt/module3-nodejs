import getConnection from "../../config/connection.database.js";

const searchProducts = (params, callback) => {
    const bindParams = [];

    const connection = getConnection();

    const page = params.page || 1;
    const limit = params.limit || 10;
    const offset = (page - 1) * limit;
    const maxPrice = params.maxPrice || null;
    const sortType = params.sortType || 0;

    let baseSql = " FROM products";

    if (params.category) {
        baseSql +=
            " INNER JOIN product_tags ON products.product_id = product_tags.product_id";
    } else {
        baseSql +=
            " LEFT JOIN product_tags ON products.product_id = product_tags.product_id";
    }

    let whereAdded = false;

    if (params.category) {
        baseSql += " WHERE product_tags.tag = ?";
        bindParams.push(params.category);
        whereAdded = true;
    }

    if (params.name) {
        baseSql += whereAdded ? " AND " : " WHERE ";
        baseSql +=
            "(products.name LIKE ? OR products.sku LIKE ? OR product_tags.tag LIKE ?)";
        bindParams.push(
            "%" + params.name + "%",
            "%" + params.name + "%",
            "%" + params.name + "%"
        );
        whereAdded = true;
    }

    if (maxPrice !== null) {
        baseSql += whereAdded ? " AND " : " WHERE ";
        baseSql += "price <= ?";
        bindParams.push(maxPrice);
    }

    const countQuery =
        "SELECT COUNT(DISTINCT products.product_id) AS total" + baseSql;

    connection.query(countQuery, bindParams, (error, countResult) => {
        if (error) {
            console.log(error);
            callback(error, null);
            return;
        }

        if (countResult[0].total === 0) {
            callback(null, {
                total: 0,
                records: [],
            });
            connection.end();
            return;
        }

        let sqlWithSortAndLimit = baseSql + " GROUP BY products.product_id";

        switch (sortType) {
            case "2":
                sqlWithSortAndLimit += " ORDER BY price ASC";
                break;
            case "1":
                sqlWithSortAndLimit += " ORDER BY price DESC";
                break;
        }

        const selectColumnsQuery =
            "SELECT products.*" +
            sqlWithSortAndLimit +
            ` LIMIT ${limit} OFFSET ${offset}`;

        connection.query(selectColumnsQuery, bindParams, (error, products) => {
            if (error) {
                callback(error, null);
                return;
            }

            const productIds = products.map((product) => product.product_id);

            connection.query(
                "SELECT * FROM product_images WHERE product_id IN (?)",
                [productIds],
                (err, images) => {
                    if (err) {
                        callback(err, null);
                        return;
                    }

                    connection.query(
                        "SELECT * FROM product_tags WHERE product_id IN (?)",
                        [productIds],
                        (err, tags) => {
                            if (err) {
                                callback(err, null);
                                return;
                            }

                            const productList = products.map((product) => {
                                const img = images
                                    .filter(
                                        (image) =>
                                            image.product_id ===
                                            product.product_id
                                    )
                                    .map((image) => image.image_url);
                                const tag = tags
                                    .filter(
                                        (tag) =>
                                            tag.product_id ===
                                            product.product_id
                                    )
                                    .map((tag) => tag.tag);
                                return {
                                    ...product,
                                    img: img,
                                    tag,
                                };
                            });

                            callback(null, {
                                total: countResult[0].total,
                                records: productList,
                            });
                            connection.end();
                        }
                    );
                }
            );
        });
    });
};

const getPrice = (callback) => {
    const connection = getConnection();

    const countQuery =
        "SELECT COUNT(*) AS total, MAX(price) AS MaxPrice, MIN(price) AS MinPrice FROM products";

    connection.query(countQuery, [], (error, results) => {
        if (error) {
            console.log(error);
            callback(error, null);
            return;
        }

        if (results[0].total === 0) {
            callback(null, {
                total: 0,
                maxPrice: null,
                minPrice: null,
            });
            connection.end();
            return;
        }

        callback(null, {
            total: results[0].total,
            maxPrice: results[0].MaxPrice,
            minPrice: results[0].MinPrice,
        });
        connection.end();
    });
};

// // Sử dụng hàm:
// let searchParams = {
//     page: 1,
//     limit: 5,
//     name: "",
// };
// searchProducts(searchParams, (err, products) => {
//     if (err) {
//         console.error("Error fetching products:", err);
//         return;
//     }
//     console.log(products);
// });

export default {
    searchProducts,
    getPrice,
    // ,addProduct,
    // getDetailProduct,
    // getProductByProductnameAndRole,
    // getProductByApiKey,
    // createApiKey,
    // updateProduct,
    // deleteProduct,
};
