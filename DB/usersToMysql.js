import { encryptPassword } from "../src/utilities/hash.util.js";
import getConnection from "../src/config/connection.database.js";
import fs from "fs";

const connection = getConnection();

connection.connect((err) => {
    if (err) throw err;
    console.log("Connected!");

    fs.readFile("./DB/users.json", "utf8", (err, data) => {
        if (err) throw err;

        let users = JSON.parse(data);

        users.forEach((user) => {
            let encryptedPassword = encryptPassword(user.password);
            let {
                email,
                name,
                bday,
                date,
                status,
                add_address,
                phone,
                img,
                cart,
            } = user;

            let cartJson = JSON.stringify(cart);
            connection.query(
                "INSERT INTO users (email, password, name, bday, date, status, add_address, phone, img, cart) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                [
                    email,
                    encryptedPassword,
                    name,
                    bday || null,
                    date,
                    status,
                    add_address,
                    phone,
                    img,
                    cartJson,
                ],
                (err) => {
                    if (err) throw err;
                }
            );
        });

        // Đóng kết nối sau khi hoàn tất
        connection.end();
    });
});
