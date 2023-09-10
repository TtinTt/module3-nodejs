import mysql from "mysql";

const getConnection = () => {
    return mysql.createConnection({
        // host: "127.0.0.1",
        host: "192.168.1.16",
        port: 3306,
        user: "root",
        password: "password",
        database: "module3-project",
        // connectTimeout: 10000, // in milliseconds, so 10 seconds
    });
};

export default getConnection;
