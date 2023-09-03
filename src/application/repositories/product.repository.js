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

        let sqlWithSortAndLimit =
            baseSql +
            " GROUP BY products.product_id ORDER BY products.product_id DESC"; // Thêm dòng này

        switch (sortType) {
            case "2":
                sqlWithSortAndLimit += ", price ASC";
                break;
            case "1":
                sqlWithSortAndLimit += ", price DESC";
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

const updateProduct = (ProductId, params, callback) => {
    const connection = getConnection();

    // Cập nhật thông tin sản phẩm trong bảng `products`
    let sql =
        "UPDATE products SET name = ?, price = ?, comparative = ?, sku = ?, description = ? WHERE product_id = ?";
    let bindParams = [
        params.name,
        params.price,
        params.comparative,
        params.sku,
        params.description,
        ProductId,
    ];

    connection.query(sql, bindParams, (error, result) => {
        if (error) {
            callback(error, null);
            return;
        }

        // Xóa các tag cũ trong bảng `product_tags`
        sql = "DELETE FROM product_tags WHERE product_id = ?";
        connection.query(sql, [ProductId], (error, result) => {
            if (error) {
                callback(error, null);
                return;
            }

            // Thêm các tag mới vào bảng `product_tags`
            const tags = params.tag.split(",");
            const tagInsertQueries = tags.map((tag) => {
                sql =
                    "INSERT INTO product_tags (product_id, tag) VALUES (?, ?)";
                return new Promise((resolve, reject) => {
                    connection.query(sql, [ProductId, tag], (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    });
                });
            });

            // Xóa các ảnh cũ trong bảng `product_images`
            sql = "DELETE FROM product_images WHERE product_id = ?";
            connection.query(sql, [ProductId], (error, result) => {
                if (error) {
                    callback(error, null);
                    return;
                }

                // Thêm các ảnh mới vào bảng `product_images`
                const imgInsertQueries = params.img.map((imgUrl) => {
                    sql =
                        "INSERT INTO product_images (product_id, image_url) VALUES (?, ?)";
                    return new Promise((resolve, reject) => {
                        connection.query(
                            sql,
                            [ProductId, imgUrl],
                            (error, result) => {
                                if (error) reject(error);
                                else resolve(result);
                            }
                        );
                    });
                });

                // Thực hiện tất cả các truy vấn để thêm tag và ảnh
                Promise.all([...tagInsertQueries, ...imgInsertQueries])
                    .then(() => {
                        callback(
                            null,
                            "Cập nhật sản phẩm và các tag, ảnh liên quan thành công."
                        );
                        connection.end();
                    })
                    .catch((error) => {
                        callback(error, null);
                        connection.end();
                    });
            });
        });
    });
};

const addProduct = (params, handleSaveFile, callback) => {
    const connection = getConnection();

    connection.beginTransaction(function (err) {
        if (err) {
            callback(err, null);
            return;
        }

        // Thêm thông tin sản phẩm vào bảng `products`
        let sql =
            "INSERT INTO products (name, price, comparative, sku, description) VALUES (?, ?, ?, ?, ?)";
        let bindParams = [
            params.name,
            params.price,
            params.comparative,
            params.sku,
            params.description,
        ];

        connection.query(sql, bindParams, (error, result) => {
            if (error) {
                return connection.rollback(function () {
                    callback(error, null);
                });
            }

            const newProductId = result.insertId;

            // Code để tạo tên tập tin hình ảnh với newProductId tại đây
            params.img = handleSaveFile(newProductId);

            // Thêm các tag vào bảng `product_tags`
            const tags = params.tag.split(",");
            const tagInsertQueries = tags.map((tag) => {
                sql =
                    "INSERT INTO product_tags (product_id, tag) VALUES (?, ?)";
                return new Promise((resolve, reject) => {
                    connection.query(
                        sql,
                        [newProductId, tag],
                        (error, result) => {
                            if (error) reject(error);
                            else resolve(result);
                        }
                    );
                });
            });

            // Thêm các ảnh vào bảng `product_images`
            const imgInsertQueries = params.img.map((imgUrl) => {
                sql =
                    "INSERT INTO product_images (product_id, image_url) VALUES (?, ?)";
                return new Promise((resolve, reject) => {
                    connection.query(
                        sql,
                        [newProductId, imgUrl],
                        (error, result) => {
                            if (error) reject(error);
                            else resolve(result);
                        }
                    );
                });
            });

            // Thực hiện tất cả các truy vấn để thêm tag và ảnh
            Promise.all([...tagInsertQueries, ...imgInsertQueries])
                .then(() => {
                    connection.commit(function (err) {
                        if (err) {
                            return connection.rollback(function () {
                                callback(err, null);
                            });
                        }
                        callback(
                            null,
                            "Thêm sản phẩm và các tag, ảnh liên quan thành công."
                        );
                    });
                    connection.end();
                })
                .catch((error) => {
                    return connection.rollback(function () {
                        callback(error, null);
                    });
                });
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

const getTag = (callback) => {
    const connection = getConnection();

    const tagQuery = `
        SELECT DISTINCT tag 
        FROM (
            SELECT pt.tag, 
                   ROW_NUMBER() OVER(PARTITION BY pt.product_id ORDER BY pt.tag_id ASC) as rn 
            FROM product_tags pt
        ) as tmp
        WHERE rn = 1;
    `;

    connection.query(tagQuery, [], (error, results) => {
        if (error) {
            console.log(error);
            callback(error, null);
            connection.end();
            return;
        }

        if (results.length === 0) {
            callback(null, {
                tags: [],
            });
            connection.end();
            return;
        }

        const tags = results.map((result) => result.tag);

        callback(null, {
            tags: tags,
        });
        connection.end();
    });
};

const deleteProduct = (id, callback) => {
    const connection = getConnection();

    // Xóa thông tin sản phẩm từ bảng `product_images`
    connection.query(
        "DELETE FROM product_images WHERE product_id = ?",
        [id],
        (error, result) => {
            if (error) {
                callback(error, null);
                connection.end();
                return;
            }

            // Xóa thông tin sản phẩm từ bảng `product_tags`
            connection.query(
                "DELETE FROM product_tags WHERE product_id = ?",
                [id],
                (error, result) => {
                    if (error) {
                        callback(error, null);
                        connection.end();
                        return;
                    }

                    // Xóa thông tin sản phẩm từ bảng `products`
                    connection.query(
                        "DELETE FROM products WHERE product_id = ?",
                        [id],
                        (error, result) => {
                            if (error) {
                                callback(error, null);
                            } else {
                                callback(
                                    null,
                                    "Xóa sản phẩm và các thông tin liên quan thành công"
                                );
                            }
                            connection.end();
                        }
                    );
                }
            );
        }
    );
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
    getTag,
    addProduct,
    // getDetailProduct,
    // getProductByProductnameAndRole,
    // getProductByApiKey,
    // createApiKey,
    updateProduct,
    deleteProduct,
};
