const searchUsers = (params, callback) => {
    const bindParams = [];
    const connection = getConnection();

    const page = params.page || 1;
    const limit = params.limit || 10;
    const offset = (page - 1) * limit;
    const name = params.name || null;
    const sortType = parseInt(params.sortType) || 0;

    let baseSql = " FROM users";

    let whereAdded = false;

    if (name) {
        baseSql += " WHERE (email LIKE ? OR name LIKE ? OR phone LIKE ?)";
        bindParams.push("%" + name + "%");
        bindParams.push("%" + name + "%");
        bindParams.push("%" + name + "%");
        whereAdded = true;
    }

    switch (sortType) {
        case 1:
            baseSql += whereAdded ? " AND " : " WHERE ";
            baseSql += "status = 1";
            whereAdded = true;
            break;
        case 0:
            baseSql += whereAdded ? " AND " : " WHERE ";
            baseSql += "status = 0";
            whereAdded = true;
            break;
    }

    const countQuery = "SELECT COUNT(*) AS total" + baseSql;

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

        const selectColumnsQuery =
            "SELECT user_id, email, name, bday, date, status, add_address, phone, img " +
            baseSql +
            ` LIMIT ${limit} OFFSET ${offset}`;

        connection.query(selectColumnsQuery, bindParams, (error, users) => {
            if (error) {
                callback(error, null);
                return;
            }

            callback(null, {
                total: countResult[0].total,
                records: users,
            });
            connection.end();
        });
    });
};
