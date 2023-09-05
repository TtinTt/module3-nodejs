import { encryptPassword } from "../src/utilities/hash.util.js";
import getConnection from "../src/config/connection.database.js";
import fs from "fs";

const connection = getConnection();

connection.connect((err) => {
    if (err) throw err;
    console.log("Connected!");

    // Đọc file admins.json thay vì users.json
    fs.readFile("./DB/admins.json", "utf8", (err, data) => {
        if (err) throw err;

        let admins = JSON.parse(data);

        admins.forEach((admin) => {
            let encryptedPassword = encryptPassword(admin.password);
            let { email, date } = admin; // chỉ lấy những thuộc tính cần thiết

            connection.query(
                "INSERT INTO admins (email, password, date) VALUES (?, ?, ?)",
                [email, encryptedPassword, date],
                (err) => {
                    if (err) throw err;
                }
            );
        });

        // Đóng kết nối sau khi hoàn tất
        connection.end();
    });
});
