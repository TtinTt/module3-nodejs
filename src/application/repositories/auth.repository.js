import moment from "moment";
import getConnection from "./../../config/connection.database.js";
import { encryptPassword } from "../../utilities/hash.util.js";

const register = (user, callback) => {
    const connection = getConnection();

    const userToCreate = {
        ...user,
        password: encryptPassword(user.password),
        status: true,
        img: "https://www.getillustrations.com/photos/pack/video/55895-3D-AVATAR-ANIMATION.gif",
    };

    connection.query(
        "INSERT INTO users SET ?",
        userToCreate,
        (error, result) => {
            if (error) {
                callback(error, null);
                console.log(error);
            } else {
                callback(null, result);
                console.log(
                    "đã thêm user",
                    user.email,
                    " password",
                    user.password
                );
            }
        }
    );

    connection.end();
};

export default {
    register,
};
