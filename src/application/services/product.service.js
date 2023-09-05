import productRepository from "../repositories/product.repository.js";
import fs from "fs";
import { getFileExtension } from "../../utilities/upload.util.js";
import path from "path";
const searchProducts = (params, callback) => {
    if (params.limit && !/^[0-9]+$/.test(params.limit)) {
        callback({ message: "Limit phải là số" }, null);
    } else if (params.page && !/^[0-9]+$/.test(params.page)) {
        callback({ message: "Page phải là số" }, null);
    } else if (
        params.maxPrice &&
        (!/^[0-9]+$/.test(params.maxPrice) || params.maxPrice == null)
    ) {
        callback({ message: "Limit phải là số" }, null);
    } else if (
        params.sortType &&
        !(params.sortType == 0 || params.sortType == 1 || params.sortType == 2)
    ) {
        callback({ message: "Kiểu sắp xếp không hợp lệ" }, null);
    } else if (params.category && params.category.length > 100) {
        callback({ message: "Danh mục không hợp lệ" }, null);
    } else {
        productRepository.searchProducts(params, (error, result) => {
            if (error) {
                callback(error, null);
            } else {
                callback(null, result);
            }
        });
    }
};

const getPrice = (callback) => {
    productRepository.getPrice((error, result) => {
        if (error) {
            callback(error, null);
        } else {
            callback(null, result);
        }
    });
};

const getTag = (callback) => {
    productRepository.getTag((error, result) => {
        if (error) {
            callback(error, null);
        } else {
            callback(null, result);
        }
    });
};

const addProduct = (requestBody, callback) => {
    let originalname = null;
    let path = null;

    if (requestBody.avatar) {
        originalname = requestBody.avatar.originalname;
        path = requestBody.avatar.path;
    }

    const validate = (product) => {
        let errors = new Map();

        if (!product.name) {
            errors.set("name", "Tên sản phẩm không được bỏ trống.");
        }

        if (Number(product.price) < 1) {
            errors.set("price", "Giá sản phẩm không hợp lệ.");
        }

        if (product.comparative && Number(product.comparative) < 1) {
            errors.set("comparative", "Giá so sánh không hợp lệ.");
        }

        if (typeof product.name !== "string") {
            errors.set("name", "Tên sản phẩm phải là chuỗi.");
        } else if (!product.name.length > 3 && !product.name.length < 250) {
            errors.set(
                "name",
                "Tên sản phẩm chỉ cho phép dài từ 3 tới 250 ký tự."
            );
        }

        if (product.imgUrls && !product.imgUrls instanceof Array) {
            errors.set("imgUrls", "Ảnh sản phẩm phải là mảng.");
        }

        if (product.sku && typeof product.sku !== "string") {
            errors.set("sku", "Sku sản phẩm phải là chuỗi.");
        } else if (product.hasOwnProperty("sku") && product.sku.length > 250) {
            errors.set(
                "sku",
                "Sku sản phẩm chỉ cho phép dài không quá 250 ký tự."
            );
        }

        if (product.description && typeof product.description !== "string") {
            errors.set("description", "Sku sản phẩm phải là chuỗi.");
        } else if (product.description && product.description.length > 1000) {
            errors.set(
                "description",
                "Sku sản phẩm chỉ cho phép dài không quá 1000 ký tự."
            );
        }
        console.log(errors);
        return errors;
    };

    const validateErrors = validate(requestBody);
    if (validateErrors.size !== 0) {
        callback(Object.fromEntries(validateErrors), null);
    } else {
        let imgFiles = null;
        let processedImgFiles = [];
        // if (requestBody.imgFiles?.length > 0) {
        //     // console.log(requestBody.imgFiles);
        //     imgFiles = requestBody.imgFiles;
        //     imgFiles.forEach((imgFile, index) => {
        //         console.log(imgFile.originalname);
        //         let originalname = parseName(imgFile.originalname);
        //         let indexImg = imgFile.fieldname.slice(-1);
        //         console.log("file name", originalname, " - index", indexImg);
        //         // let originalname = imgFile.originalname;
        //         const imgFilesExtension = getFileExtension(
        //             imgFile.originalname
        //         );
        //         let path = imgFile.path;
        //         let newImgFilePath = `imgFiles/${productId}-${indexImg}.${imgFilesExtension}`; // Sử dụng một biến mới
        //         processedImgFiles.push(newImgFilePath); // Thêm đường dẫn vào mảng
        //         const imgFilesLocation = `./public/${newImgFilePath}`; // Cập nhật biến này

        //         // Copy upload file to saving location
        //         fs.cpSync(path, imgFilesLocation);
        //         fs.rmSync(path);
        //     });

        //     // console.log("file", processedImgFiles, "url", requestBody.imgUrls);
        // }

        // let img = requestBody.imgUrls || [];

        const handleSaveFile = (productId) => {
            // console.log(requestBody.imgFiles);
            imgFiles = requestBody.imgFiles;
            imgFiles.forEach((imgFile, index) => {
                console.log(imgFile.originalname);
                let originalname = parseName(imgFile.originalname);
                let indexImg = imgFile.fieldname.slice(-1);
                console.log("file name", originalname, " - index", indexImg);
                // let originalname = imgFile.originalname;
                const imgFilesExtension = getFileExtension(
                    imgFile.originalname
                );
                let path = imgFile.path;
                let newImgFilePath = `imgFiles/${productId}-${indexImg}.${imgFilesExtension}`; // Sử dụng một biến mới
                processedImgFiles.push(newImgFilePath); // Thêm đường dẫn vào mảng
                const imgFilesLocation = `./public/${newImgFilePath}`; // Cập nhật biến này

                // Copy upload file to saving location
                fs.cpSync(path, imgFilesLocation);
                fs.rmSync(path);
            });

            // console.log("file", processedImgFiles, "url", requestBody.imgUrls);
            let img = requestBody.imgUrls || [];
            let resultImg = mergeAndSortImages(processedImgFiles, img);
            return resultImg;
        };

        const updateProduct = {
            name: requestBody.name || "",
            tag: requestBody.tag || "",
            price: requestBody.price,
            comparative: requestBody.comparative || "",
            sku: requestBody.sku || "",
            description: requestBody.description || "",
        };
        console.log("updateProduct", updateProduct);
        productRepository.addProduct(
            updateProduct,
            handleSaveFile,
            (error, result) => {
                if (error) {
                    callback(error, null);
                } else {
                    console.log(result);
                    callback(null, result);
                }
            }
        );
    }
};

const getDetailProduct = (id, callback) => {
    if (!/^[0-9]+$/.test(id)) {
        callback({ message: "ID phải là số" }, null);
    } else {
        productRepository.getDetailProduct(id, (error, result) => {
            if (error) {
                callback(error, null);
            } else if (result.length === 0) {
                callback({ message: "Product not found" }, null);
            } else {
                callback(null, result[0]);
            }
        });
    }
};

const parseName = (name) => {
    const nameWithoutExtension = name.substr(0, name.lastIndexOf("."));
    return nameWithoutExtension;
};

const updateProduct = (productId, requestBody, callback) => {
    console.log("requestBody", requestBody);
    let originalname = null;
    let path = null;

    if (requestBody.imgFiles) {
        originalname = requestBody.imgFiles.originalname;
        path = requestBody.imgFiles.path;
    }

    const validate = (product) => {
        let errors = new Map();

        if (!productId) {
            errors.set("id", "ID không được bỏ trống.");
        }

        if (product.name.length == 0) {
            errors.set("name", "Tên sản phẩm không được bỏ trống.");
        }

        if (Number(product.price) < 1) {
            errors.set("price", "Giá sản phẩm không hợp lệ.");
        }

        if (product.comparative && Number(product.comparative) < 1) {
            errors.set("comparative", "Giá so sánh không hợp lệ.");
        }

        if (typeof product.name !== "string") {
            errors.set("name", "Tên sản phẩm phải là chuỗi.");
        } else if (!product.name.length > 3 && !product.name.length < 250) {
            errors.set(
                "name",
                "Tên sản phẩm chỉ cho phép dài từ 3 tới 250 ký tự."
            );
        }

        if (product.imgUrls && !product.imgUrls instanceof Array) {
            errors.set("imgUrls", "Ảnh sản phẩm phải là mảng.");
        }

        if (product.sku && typeof product.sku !== "string") {
            errors.set("sku", "Sku sản phẩm phải là chuỗi.");
        } else if (product.hasOwnProperty("sku") && product.sku.length > 250) {
            errors.set(
                "sku",
                "Sku sản phẩm chỉ cho phép dài không quá 250 ký tự."
            );
        }

        if (product.description && typeof product.description !== "string") {
            errors.set("description", "Sku sản phẩm phải là chuỗi.");
        } else if (product.description && product.description.length > 1000) {
            errors.set(
                "description",
                "Sku sản phẩm chỉ cho phép dài không quá 1000 ký tự."
            );
        }
        console.log(errors);
        return errors;
    };

    const validateErrors = validate(requestBody);

    if (validateErrors.size !== 0) {
        callback(Object.fromEntries(validateErrors), null);
    } else {
        let imgFiles = null;
        let processedImgFiles = [];
        if (requestBody.imgFiles?.length > 0) {
            // console.log(requestBody.imgFiles);
            imgFiles = requestBody.imgFiles;
            imgFiles.forEach((imgFile, index) => {
                console.log(imgFile.originalname);
                let originalname = parseName(imgFile.originalname);
                let indexImg = imgFile.fieldname.slice(-1);
                console.log("file name", originalname, " - index", indexImg);
                // let originalname = imgFile.originalname;
                const imgFilesExtension = getFileExtension(
                    imgFile.originalname
                );
                let path = imgFile.path;
                let newImgFilePath = `imgFiles/${productId}-${indexImg}.${imgFilesExtension}`; // Sử dụng một biến mới
                processedImgFiles.push(newImgFilePath); // Thêm đường dẫn vào mảng
                const imgFilesLocation = `./public/${newImgFilePath}`; // Cập nhật biến này

                // Copy upload file to saving location
                fs.cpSync(path, imgFilesLocation);
                fs.rmSync(path);
            });

            // console.log("file", processedImgFiles, "url", requestBody.imgUrls);
        }

        let img = requestBody.imgUrls || [];
        let resultImg = mergeAndSortImages(processedImgFiles, img);
        const updateProduct = {
            name: requestBody.name || "",
            img:
                requestBody.imgFiles?.length > 0
                    ? mergeAndSortImages(processedImgFiles, img)
                    : img,
            tag: requestBody.tag || "",
            price: requestBody.price,
            comparative: requestBody.comparative || "",
            sku: requestBody.sku || "",
            description: requestBody.description || "",
        };
        console.log("updateProduct", updateProduct);
        productRepository.updateProduct(
            productId,
            updateProduct,
            (error, result) => {
                if (error) {
                    callback(error, null);
                } else {
                    console.log(result);
                    callback(null, result);
                }
            }
        );
    }
};

function mergeAndSortImages(processedImgFiles, imgUrls) {
    let result = [];
    let fileOrderMap = {};

    processedImgFiles.forEach((filePath) => {
        const match = filePath.match(/-(\d+)\./);
        if (match) {
            const index = parseInt(match[1], 10);
            fileOrderMap[index] = filePath;
        }
    });

    let maxIndex = Math.max(
        ...Object.keys(fileOrderMap).map(Number),
        imgUrls.length + Object.keys(fileOrderMap).length - 1
    );

    let urlIndex = 0;

    for (let i = 0; i <= maxIndex; i++) {
        if (fileOrderMap.hasOwnProperty(i)) {
            result[i] = fileOrderMap[i];
        } else {
            if (urlIndex < imgUrls.length) {
                result[i] = imgUrls[urlIndex];
                urlIndex++;
            }
        }
    }

    return result;
}

const deleteProduct = (id, callback) => {
    if (!/^[0-9]+$/.test(id)) {
        callback({ message: "ID phải là số" }, null);
    } else {
        productRepository.deleteProduct(id, (error, result) => {
            if (error) {
                callback(error, null);
            } else if (result.affectedRows === 0) {
                callback({ message: "Product not found" }, null);
            } else {
                const folderPath = "./public/imgfiles/";

                fs.readdir(folderPath, (err, files) => {
                    if (err) {
                        console.error("An error occurred:", err);
                        return;
                    } // lấy ra các file trong folder nếu lỗi thì log ra và return

                    const filteredFiles = files.filter((file) =>
                        file.startsWith(`${id}-`)
                    ); //lọc file theo id

                    console.log("Các file xóa:", filteredFiles);

                    filteredFiles.forEach((file) => {
                        const filePath = path.join(folderPath, file);
                        fs.unlink(filePath, (err) => {
                            if (err) {
                                console.error(`Chưa xóa ${file}:`, err);
                            } else {
                                console.log(`Đã xóa ${file}`);
                            }
                        });
                    });
                });

                callback(null, result);
            }
        });
    }
};

export default {
    getPrice,
    getTag,
    searchProducts,
    addProduct,
    getDetailProduct,
    updateProduct,
    deleteProduct,
};
