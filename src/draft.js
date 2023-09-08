// Tạo mã ngẫu nhiên 6 ký tự
const generateRandomCode = () => {
    return Math.random().toString(36).substr(2, 6).toUpperCase();
};

const updateNoteWithEmail = async (email) => {
    const connection = getConnection();

    return new Promise((resolve, reject) => {
        // Tìm kiếm người dùng có email trùng khớp
        let selectSql = "SELECT * FROM users WHERE email = ?";
        connection.query(selectSql, [email], (selectError, selectResult) => {
            if (selectError) {
                connection.end();
                return reject(selectError);
            }

            if (selectResult.length > 0) {
                // Tạo mã ngẫu nhiên
                const randomCode = generateRandomCode();

                // Cập nhật cột note
                let updateSql = "UPDATE users SET note = ? WHERE email = ?";
                connection.query(
                    updateSql,
                    [randomCode, email],
                    (updateError, updateResult) => {
                        connection.end();

                        if (updateError) {
                            return reject(updateError);
                        }

                        return resolve(updateResult);
                    }
                );
            } else {
                connection.end();
                return resolve("No user found with given email.");
            }
        });
    });
};
