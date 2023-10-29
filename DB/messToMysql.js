import getConnection from "../src/config/connection.database.js";
import fs from "fs";

const connection = getConnection();

connection.connect((err) => {
    if (err) throw err;
    console.log("Connected!");

    // Đọc file mess.json
    fs.readFile("./DB/mess.json", "utf8", (err, data) => {
        if (err) throw err;

        let messages = JSON.parse(data);

        messages.forEach((message) => {
            let { email, name, phone, date, mess, status } = message; // chỉ lấy những thuộc tính cần thiết

            connection.query(
                "INSERT INTO messages (email, name, phone, date, mess, status) VALUES (?, ?, ?, ?, ?, ?)",
                [email, name, phone, date, mess, status],
                (err) => {
                    if (err) throw err;
                }
            );
        });

        // Đóng kết nối sau khi hoàn tất
        connection.end();
    });
});
